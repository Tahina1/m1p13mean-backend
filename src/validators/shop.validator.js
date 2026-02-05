const {body, validationResult} = require('express-validator');

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

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    }
]