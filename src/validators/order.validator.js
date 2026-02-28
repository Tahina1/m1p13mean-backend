const { body, query, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const VALID_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateCheckout = [
    body("billingDetails.name")
        .notEmpty().withMessage("Billing name is required"),
    body("billingDetails.email")
        .notEmpty().withMessage("Billing email is required")
        .isEmail().withMessage("Billing email must be valid"),
    body("billingDetails.phone")
        .notEmpty().withMessage("Billing phone is required"),
    body("shippingAddress")
        .notEmpty().withMessage("Shipping address is required"),
    handleValidation
];

const validateGetMyOrders = [
    query("page")
        .optional()
        .isInt({ gt: 0 }).withMessage("Page must be a positive integer")
        .toInt(),
    query("limit")
        .optional()
        .isInt({ gt: 0 }).withMessage("Limit must be a positive integer")
        .toInt(),
    query("productName")
        .optional()
        .trim(),
    query("shopName")
        .optional()
        .trim(),
    query("status")
        .optional()
        .toArray()
        .isArray({ min: 1 }).withMessage("At least one status is required")
        .custom((statuses) => statuses.every(s => VALID_STATUSES.includes(s)))
        .withMessage("Invalid status value"),
    query("startDate")
        .optional()
        .isISO8601().withMessage("startDate must be a valid date (ISO 8601)")
        .toDate(),
    query("endDate")
        .optional()
        .isISO8601().withMessage("endDate must be a valid date (ISO 8601)")
        .toDate()
        .custom((endDate, { req }) => {
            if (req.query.startDate && endDate <= req.query.startDate) {
                throw new Error("endDate must be after startDate");
            }
            return true;
        }),
    handleValidation
];

const validateGetShopOrders = [
    query("page")
        .optional()
        .isInt({ gt: 0 }).withMessage("Page must be a positive integer")
        .toInt(),
    query("limit")
        .optional()
        .isInt({ gt: 0 }).withMessage("Limit must be a positive integer")
        .toInt(),
    query("productName")
        .optional()
        .trim(),
    query("customerId")
        .optional()
        .custom(id => mongoose.Types.ObjectId.isValid(id))
        .withMessage("Invalid customer ID format"),
    query("status")
        .optional()
        .toArray()
        .isArray({ min: 1 }).withMessage("At least one status is required")
        .custom((statuses) => statuses.every(s => VALID_STATUSES.includes(s)))
        .withMessage("Invalid status value"),
    query("startDate")
        .optional()
        .isISO8601().withMessage("startDate must be a valid date (ISO 8601)")
        .toDate(),
    query("endDate")
        .optional()
        .isISO8601().withMessage("endDate must be a valid date (ISO 8601)")
        .toDate()
        .custom((endDate, { req }) => {
            if (req.query.startDate && endDate <= req.query.startDate) {
                throw new Error("endDate must be after startDate");
            }
            return true;
        }),
    handleValidation
];

const validatePatchShopOrder = [
    param("id")
        .custom(id => mongoose.Types.ObjectId.isValid(id))
        .withMessage("Invalid order ID format"),
    body("status")
        .notEmpty().withMessage("Status is required")
        .isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(", ")}`),
    handleValidation
];

module.exports = { validateCheckout, validateGetMyOrders, validateGetShopOrders, validatePatchShopOrder };
