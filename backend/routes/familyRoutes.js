import express from "express";
import { generateJoinCode, joinFamily, getFamily } from "../controllers/familyController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/join-code", protect, generateJoinCode);
router.post("/join", protect, joinFamily);
router.get("/", protect, getFamily);

export default router;
