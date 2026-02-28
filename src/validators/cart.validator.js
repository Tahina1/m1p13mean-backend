const {body, param, validationResult} = require("express-validator");
const mongoose = require("mongoose");

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() })
    }
    next();
}

exports.validateAddItem = [
    body("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .custom(productId => mongoose.isValidObjectId(productId))
        .withMessage("Invalid Product ID format"),
    body("quantity")
        .default(1)
        .isInt({ gt: 0 })
        .withMessage("Quantity must be a positive number"),
    handleValidation
]

exports.validateUpdateItem = [
    param("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .custom(productId => mongoose.isValidObjectId(productId))
        .withMessage("Invalid Product ID format"),
    body("quantity")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("Quantity must be a positive number"),
    handleValidation
]

exports.validateRemoveItem = [
    param("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .custom(productId => mongoose.isValidObjectId(productId))
        .withMessage("Invalid Product ID format"),
    handleValidation
]