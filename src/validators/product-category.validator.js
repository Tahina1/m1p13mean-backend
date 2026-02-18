const { body, query, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

exports.validateCreateCategory = [
    body("name")
        .trim()
        .notEmpty().withMessage("Category name is required")
        .isLength({ max: 50 }).withMessage("Category name cannot exceed 50 characters"),
    handleValidation
]

exports.validateUpdateCategory = [
    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("Category name cannot be empty")
        .isLength({ max: 50 }).withMessage("Category name cannot exceed 50 characters"),
    handleValidation
]

exports.validateUpdateCategoryStatus = [
    body("isActive")
        .notEmpty().withMessage("isActive is required")
        .isBoolean().withMessage("isActive must be a boolean"),
    handleValidation
]

exports.validateSearchByName = [
    query("name")
        .trim()
        .notEmpty().withMessage("name query parameter is required"),
    handleValidation
]
