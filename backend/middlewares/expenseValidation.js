import { body, validationResult } from "express-validator";

/*
  Helper to handle validation result
*/
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg),
    });
  }

  next();
};

/*
  Validation for creating an expense
  (POST /expenses)
*/
export const validateCreateExpense = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),

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

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  handleValidation,
];

/*
  Validation for updating an expense
  (PUT /expenses/:id)
*/
export const validateUpdateExpense = [
  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),

  body("category")
    .optional()
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

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  handleValidation,
];
