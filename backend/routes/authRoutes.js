import express from "express";
import { registerUser } from "../controllers/authControllers.js";

const router = express.Router();

// @route POST /api/auth/register
// @desc Register a new user
// @access Public

router.post("/register", registerUser);
export default router;
