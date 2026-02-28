const router = require("express").Router();
const authenticate = require("../middlewares/auth.middleware");
const { validateCheckout } = require("../validators/order.validator");
const orderController = require("../controllers/order.controller");

// POST /api/orders/checkout
router.post("/checkout",
    authenticate,
    validateCheckout,
    orderController.checkout
);

module.exports = router;
