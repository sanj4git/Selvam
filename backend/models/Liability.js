import mongoose from "mongoose";

/*
  Liability Schema
  ----------------
  This schema represents a single liability (debt) created by a user.
  Examples:
  - Loan
  - Credit Card
  - EMI
  - Other debts

  Each liability:
  - Belongs to exactly one user
  - Is protected by authentication
  - Cannot be accessed by other users
*/

const liabilitySchema = new mongoose.Schema(
  {
    /*
      user:
      -----
      Reference to the User who owns this liability.
      This ensures:
      - Liabilities are user-specific
      - One user cannot see another user's liabilities
    */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /*
      type:
      -----
      Type/category of liability.
      Examples: "Loan", "Credit Card", "EMI"
    */
    type: {
      type: String,
      required: true,
      trim: true,
    },

    /*
      amount:
      -------
      Total amount owed for this liability.
      Must be a positive number.
    */
    amount: {
      type: Number,
      required: true,
    },

    /*
      interestRate:
      -------------
      Optional interest rate for the liability.
      Example: 12.5 (%)
    */
    interestRate: {
      type: Number,
      default: null,
    },

    /*
      dueDate:
      --------
      Due date for repayment.
      Used for reminders and tracking.
    */
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

// Create Liability model
const Liability = mongoose.model("Liability", liabilitySchema);
export default Liability;
