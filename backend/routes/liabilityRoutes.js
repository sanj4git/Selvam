import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  addLiability,
  getLiabilities,
  updateLiability,
  deleteLiability,
} from "../controllers/liabilityController.js";
import { validateCreateLiability } from "../middlewares/liabilityValidation.js";

const router = express.Router();

/*
  CREATE liability
  POST /liabilities
*/
router.post("/", protect, validateCreateLiability, addLiability);

/*
  READ liabilities
  GET /liabilities
*/
router.get("/", protect, getLiabilities);

/*
  UPDATE liability
  PUT /liabilities/:id
*/
router.put("/:id", protect, updateLiability);

/*
  DELETE liability
  DELETE /liabilities/:id
*/
router.delete("/:id", protect, deleteLiability);

export default router;
