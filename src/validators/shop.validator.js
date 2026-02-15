const {body, validationResult} = require('express-validator');
const mongoose = require('mongoose');

// Validation rules for creating a shop 
exports.validateCreateShop = [
    body("name")
        .trim()
        .notEmpty().withMessage("Shop name is required"),
    body("category")
        .optional()
        .trim(),
    body("location.floor")
        .optional()
        .trim(),
    body('location.shopNumber')
        .optional()
        .trim(),
    body('ownerId')
        .optional()
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Invalid owner ID format"),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    }
]

// Validation rules for patching a shop (all fields optional)
exports.validatePatchShop = [
    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("Shop name cannot be empty"),
    body("category")
        .optional()
        .trim(),
    body("location.floor")
        .optional()
        .trim(),
    body('location.shopNumber')
        .optional()
        .trim(),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    }
]