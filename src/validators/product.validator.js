const { body, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');


const handleValidation = (req, res, next) => {
    //validationResult récupère juste les erreurs accumulées par les body()
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() })
    }
    next();
}

exports.validateCreateProduct = ([
    body("name")
        .trim()
        .notEmpty().withMessage("Product name is required"),
    body("categoryIds")
        .toArray()
        .isArray({ min: 1 }).withMessage("At least one category ID is required")
        .custom((categoryIds) => categoryIds.every(id => mongoose.Types.ObjectId.isValid(id)))
        .withMessage("Invalid category ID format")
        .customSanitizer((categoryIds) => categoryIds.map(id => new mongoose.Types.ObjectId(id))),
    body("price")
        .isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
    body("shopId")
        .optional()
        .custom(shopId => mongoose.Types.ObjectId.isValid(shopId))
        .withMessage("Invalid shop ID format"),
    body("isActive")
        .optional()
        .isBoolean().withMessage("isActive must be a boolean value"),
    body("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    handleValidation
]);

exports.validateGetProducts = ([
    query("name")
        .optional()
        .trim(),
    query("categoryIds")
        .optional()
        .toArray()
        .isArray({ min: 1 }).withMessage("At least one category ID is required")
        .custom((categoryIds) => categoryIds.every(id => mongoose.Types.ObjectId.isValid(id)))
        .withMessage("Invalid category ID format")
        .bail()
        .customSanitizer((categoryIds) => categoryIds.map(id => new mongoose.Types.ObjectId(id))),
    query("minPrice")
        .optional()
        .isFloat({ gt: 0 }).withMessage("minPrice must be a positive number")
        .customSanitizer(value => parseFloat(value)),
    query("maxPrice")
        .optional()
        .isFloat({ gt: 0 }).withMessage("maxPrice must be a positive number")
        .customSanitizer(value => parseFloat(value))
        .custom((maxPrice, { req }) => {//par défaut, express-validator ne te donne pas directement req comme 2ᵉ argument, il te donne un objet avec req dedans.
            if(req.query.minPrice && maxPrice < parseFloat(req.query.minPrice)){
                throw new Error("maxPrice must be greater than or equal to minPrice");
            }}),
    query("shopId")
        .optional()
        .custom(shopId => mongoose.Types.ObjectId.isValid(shopId))
        .withMessage("Invalid shop ID format"),
    query("isActive")
        .optional()
        .isBoolean().withMessage("isActive must be a boolean value")
        .customSanitizer(value => value === "true"),
    handleValidation
]);