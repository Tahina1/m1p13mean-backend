const { body, validationResult } = require("express-validator");

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
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateCheckout };
