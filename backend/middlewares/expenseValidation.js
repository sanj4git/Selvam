import { body, validationResult } from "express-validator";

/*
  Validation rules for creating/updating expenses
*/
export const validateExpense = [
  // Amount must exist and be a positive number
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a number greater than 0"),

  // Category must exist and be one of allowed values
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "Food",
      "Transport",
      "Rent",
      "Utilities",
      "Shopping",
      "Health",
      "Entertainment",
      "Other",
    ])
    .withMessage("Invalid category"),

  // Date is optional but must be valid if provided
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),

  // Description is optional but should be a string
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  // Final middleware to check validation result
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map(err => err.msg),
      });
    }

    next();
  },
];
