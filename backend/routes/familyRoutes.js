import express from "express";
import { generateJoinCode, joinFamily, getFamily, createFamily } from "../controllers/familyController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createFamily);
router.post("/join-code", protect, generateJoinCode);
router.post("/join", protect, joinFamily);
router.get("/", protect, getFamily);

export default router;
