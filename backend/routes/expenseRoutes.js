import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  validateCreateExpense,
  validateUpdateExpense,
} from "../middlewares/expenseValidation.js";
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

// CREATE expense → strict validation
router.post("/", protect, validateCreateExpense, addExpense);

// READ expenses
router.get("/", protect, getExpenses);

// UPDATE expense → flexible validation
router.put("/:id", protect, validateUpdateExpense, updateExpense);

// DELETE expense
router.delete("/:id", protect, deleteExpense);

export default router;
