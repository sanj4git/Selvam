import express from "express";
import { registerUser, loginUser } from "../controllers/authControllers.js";

const router = express.Router();

// @route POST /api/auth/register
// @desc Register a new user
// @access Public
router.post("/register", registerUser);

// @route POST /api/auth/login
// @desc Existing user login
// @access Public
router.post("/login", loginUser);

export default router;
