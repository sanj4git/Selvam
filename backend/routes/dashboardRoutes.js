import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getDashboardSummary,
  getExpenseSummary,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", protect, getDashboardSummary);
router.get("/expenses", protect, getExpenseSummary);

export default router;
