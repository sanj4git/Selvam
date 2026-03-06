import Family from "../models/Family.js";
import User from "../models/User.js";
import crypto from "crypto";

/*
  @desc    Generate a new join code for the family
  @route   POST /api/family/join-code
  @access  Protected (Head only)
*/
export const generateJoinCode = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user.role !== "Head" || !user.familyId) {
            return res.status(403).json({ message: "Only the Family Head can generate join codes." });
        }

        const family = await Family.findById(user.familyId);
        if (!family) {
            return res.status(404).json({ message: "Family not found." });
        }

        // Generate new 8 char code
        const newCode = crypto.randomBytes(4).toString("hex").toUpperCase();
        family.joinCode = newCode;
        await family.save();

        res.status(200).json({ joinCode: family.joinCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/*
  @desc    Join an existing family using a code
  @route   POST /api/family/join
  @access  Protected
*/
export const joinFamily = async (req, res) => {
    try {
        const { joinCode } = req.body;

        if (!joinCode) {
            return res.status(400).json({ message: "Please provide a join code." });
        }

        const family = await Family.findOne({ joinCode: joinCode.trim() });

        if (!family) {
            return res.status(404).json({ message: "Invalid join code." });
        }

        const user = await User.findById(req.user._id);

        // Update user's familyId and role
        user.familyId = family._id;
        user.role = "Member";
        await user.save();

        res.status(200).json({ message: `Successfully joined ${family.name}`, familyId: family._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/*
  @desc    Get user's family details and members
  @route   GET /api/family
  @access  Protected
*/
export const getFamily = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        console.log("DEBUG getFamily user:", user);

        if (!user.familyId) {
            return res.status(404).json({ message: "User is not part of any family." });
        }

        const family = await Family.findById(user.familyId);
        if (!family) {
            return res.status(404).json({ message: "Family not found." });
        }

        // Fetch members
        const members = await User.find({ familyId: family._id }).select("name email role createdAt");

        res.status(200).json({
            family: {
                _id: family._id,
                name: family.name,
                joinCode: user.role === "Head" ? family.joinCode : null, // Hide code from members
                headUserId: family.headUserId,
            },
            members,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
