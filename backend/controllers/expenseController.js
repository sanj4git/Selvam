import Expense from "../models/Expense.js";
import User from "../models/User.js";

/*
  @desc    Add a new expense
  @route   POST /expenses
  @access  Private (Authenticated users only)
*/
export const addExpense = async (req, res) => {
    try {
        // Extract expense details from request body
        const { amount, category, date, description } = req.body;

        // Create a new expense linked to the logged-in user
        const expense = await Expense.create({
            user: req.user._id,   // comes from auth middleware
            amount,
            category,
            date,
            description,
        });

        // Send success response
        res.status(201).json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to add expense",
        });
    }
};

/*
  @desc    Get all expenses of the logged-in user
  @route   GET /expenses
  @access  Private
*/
export const getExpenses = async (req, res) => {
    try {
        const familyMembers = await User.find({ familyId: req.user.familyId }).select('_id');
        const familyUserIds = familyMembers.map(m => m._id);

        // Fetch expenses belonging to the family
        const expenses = await Expense.find({ user: { $in: familyUserIds } })
            .sort({ date: -1 }); // latest expenses first

        res.status(200).json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch expenses",
        });
    }
};

/*
  @desc    Update an existing expense
  @route   PUT /expenses/:id
  @access  Private
*/
export const updateExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;

        // Find expense by ID
        const expense = await Expense.findById(expenseId);

        // Check if expense exists
        if (!expense) {
            return res.status(404).json({
                message: "Expense not found",
            });
        }

        const familyMembers = await User.find({ familyId: req.user.familyId }).select('_id');
        const familyUserIds = familyMembers.map(m => m._id.toString());

        // Ensure the expense belongs to the family
        if (!familyUserIds.includes(expense.user.toString())) {
            return res.status(401).json({
                message: "Not authorized to update this expense",
            });
        }

        // Update fields (fallback to existing values)
        expense.amount = req.body.amount ?? expense.amount;
        expense.category = req.body.category ?? expense.category;
        expense.date = req.body.date ?? expense.date;
        expense.description = req.body.description ?? expense.description;

        // Save updated expense
        const updatedExpense = await expense.save();

        res.status(200).json(updatedExpense);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update expense",
        });
    }
};

/*
  @desc    Delete an expense
  @route   DELETE /expenses/:id
  @access  Private
*/
export const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;

        // Find expense by ID
        const expense = await Expense.findById(expenseId);

        // Check if expense exists
        if (!expense) {
            return res.status(404).json({
                message: "Expense not found",
            });
        }

        const familyMembers = await User.find({ familyId: req.user.familyId }).select('_id');
        const familyUserIds = familyMembers.map(m => m._id.toString());

        // Ensure the expense belongs to the family
        if (!familyUserIds.includes(expense.user.toString())) {
            return res.status(401).json({
                message: "Not authorized to delete this expense",
            });
        }

        // Delete the expense
        await expense.deleteOne();

        res.status(200).json({
            message: "Expense deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete expense",
        });
    }
};
