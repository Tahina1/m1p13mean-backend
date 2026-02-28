const router = require("express").Router();
const authenticate = require("../middlewares/auth.middleware");
const { validateCheckout, validateGetMyOrders } = require("../validators/order.validator");
const orderController = require("../controllers/order.controller");

// POST /api/orders/checkout
router.post("/checkout",
    authenticate,
    validateCheckout,
    orderController.checkout
);

// GET /api/orders/me - Get orders for the authenticated client
router.get("/me",
    authenticate,
    validateGetMyOrders,
    orderController.getMyOrders
);

module.exports = router;
