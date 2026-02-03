import mongoose from "mongoose";

/*
  Expense Schema
  --------------
  This schema represents a single expense entry created by a user.
  Each expense is linked to one user and is used for:
  - Expense tracking
  - Dashboard summaries
  - Category-wise & month-wise analytics
*/

const expenseSchema = new mongoose.Schema(
    {
        user: {
            /*
          user:
          -----
          Stores reference to the User who created this expense.
          This ensures:
          - Expenses are user-specific
          - One user cannot access another user's data
        */
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            /*
          amount:
          -------
          Stores the monetary value of the expense.
          Must be a number and is required.
          Used for:
          - Total expense calculation
          - Monthly & yearly summaries
        */
            type: Number,
            required: true,
        },

        category: {
             /*
          category:
          ---------
          Categorizes the expense (Food, Rent, etc.).
          Enum restricts values to predefined categories,
          which helps maintain clean data and enables analytics.
        */
            type: String,
            required: true,
            enum: [
                "Food",
                "Transport",
                "Rent",
                "Utilities",
                "Shopping",
                "Health",
                "Entertainment",
                "Other",
            ],
        },

        date: {
            /*
          date:
          -----
          The date on which the expense occurred.
          Defaults to the current date if not provided.
          Used for:
          - Month-wise grouping
          - Time-based filters
        */
            type: Date,
            default: Date.now,
            required: true,
        },

        description: {
            /*
          description:
          ------------
          Optional text field to add notes about the expense.
          Example: "Dinner with friends"
          Trim removes extra whitespace.
        */
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // adds createdAt & updatedAt
    }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
