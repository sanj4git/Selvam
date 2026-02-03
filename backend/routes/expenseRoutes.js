import express from "express";

// Import expense controller functions
import {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
} from "../controllers/expenseController.js";

// Import auth middleware to protect routes
import protect  from "../middlewares/authMiddleware.js";
import { validateExpense } from "../middlewares/expenseValidation.js";

const router = express.Router();

/*
  Expense Routes
  --------------
  All routes are protected.
  Only authenticated users can access their own expenses.
*/

/*
  @route   POST /expenses
  @desc    Add a new expense
  @access  Private
*/
router.post("/", protect, validateExpense, addExpense); 

/*
  @route   GET /expenses
  @desc    Get all expenses of logged-in user
  @access  Private
*/
router.get("/", protect, getExpenses);

/*
  @route   PUT /expenses/:id
  @desc    Update a specific expense
  @access  Private
*/
router.put("/:id", protect, validateExpense ,updateExpense);

/*
  @route   DELETE /expenses/:id
  @desc    Delete a specific expense
  @access  Private
*/
router.delete("/:id", protect, deleteExpense);

export default router;
