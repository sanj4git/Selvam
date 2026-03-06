import User from "../models/User.js";
import Family from "../models/Family.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public

export const registerUser = async (req, res) => {

    try {

        const { name, email, password, role, joinCode } = req.body;

        // Basic Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        }

        // Check if User already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        let newRole = "None"; // Default if not provided
        if (role === "Member" || role === "Head") {
            newRole = role;
        }

        let linkedFamilyId = null;

        // If 'Member' role is selected, validate join code first
        if (newRole === "Member") {
            if (!joinCode) {
                return res.status(400).json({ message: "Join code is required for members" });
            }
            const family = await Family.findOne({ joinCode: joinCode.trim() });
            if (!family) {
                return res.status(404).json({ message: "Invalid join code" });
            }
            linkedFamilyId = family._id;
        }

        // Create new User
        console.log("DEBUG: Creating new user with role:", newRole);
        const user = await User.create({
            name,
            email,
            password, // will be hashed automatically
            role: newRole,
            familyId: linkedFamilyId,
        });
        console.log("DEBUG: User created:", user._id);

        // If 'Head' role, Auto-create Family
        if (newRole === "Head") {
            const newJoinCode = crypto.randomBytes(4).toString('hex').toUpperCase();
            console.log("DEBUG: Creating Family...");
            const family = await Family.create({
                name: `${user.name}'s Family`,
                joinCode: newJoinCode,
                headUserId: user._id,
            });
            console.log("DEBUG: Family created:", family._id);

            // Make sure the User is actually updated in the Database
            user.familyId = family._id;
            await user.save();
            console.log("DEBUG: User familyId updated to:", user.familyId);
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        // Send response
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};


// @desc    Login existing user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check if User Exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email / Password" });
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Send success response
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });

    }
};
