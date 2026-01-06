import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public

export const registerUser = async (req, res) => {

    try{

        const {name, email, password} = req.body;

        // Basic Validation
        if(!name || !email || !password){
            return res.status(400).json({
                message : "Please provide all required fields",
            });
        }

        // Check if User already exists
        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({
                message : "User already exists"
            });
        }

        // Create new User
        const user = await User.create({
            name, 
            email, 
            password, // will be hashed automatically
        });

        // Generate JWT
        const token = jwt.sign(
            { id : user._id },
            process.env.JWT_SECRET,
            { expiresIn : "30d" }
        );

        // Send response
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            token
        });

    } catch (error){

        console.log(error);
        res.status(500).json({
            message : "Server Error",
        });
    }
};


// @desc    Login existing user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {

    try{

        const { email, password } = req.body;

        // Check if User Exists
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message : "Invalid Email / Password" });
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message : "Invalid Password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id : user._id },
            process.env.JWT_SECRET,
            { expiresIn : "7d" }
        );

        // Send success response
        res.status(200).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            token,
        });

    } catch(error){

        console.log(error);
        res.status(500).json({
            message : "Server Error",
        });

    }
};
