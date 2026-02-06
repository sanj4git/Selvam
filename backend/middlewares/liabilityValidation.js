import { body, validationResult } from "express-validator";

/*
  Helper to handle validation result
  ---------------------------------
  Sends validation errors (if any) as response
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
  Validation for creating a liability
  (POST /liabilities)
*/
export const validateCreateLiability = [
  body("type")
    .notEmpty()
    .withMessage("Liability type is required"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("interestRate")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Interest rate must be a positive number"),

  handleValidation,
];
