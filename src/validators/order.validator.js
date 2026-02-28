const { body, query, validationResult } = require("express-validator");

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
        .toDate()
        .isISO8601().withMessage("startDate must be a valid date (ISO 8601)"),
    query("endDate")
        .optional()
        .toDate()
        .isISO8601().withMessage("endDate must be a valid date (ISO 8601)")
        .custom((endDate, { req }) => {
            if (req.query.startDate && new Date(endDate) <= new Date(req.query.startDate)) {
                throw new Error("endDate must be after startDate");
            }
            return true;
        }),
    handleValidation
];

module.exports = { validateCheckout, validateGetMyOrders };
