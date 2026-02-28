const router = require("express").Router();
const authenticate = require("../middlewares/auth.middleware");
const { validateCheckout, validateGetMyOrders, validateGetShopOrders, validatePatchShopOrder } = require("../validators/order.validator");
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

// GET /api/orders/shop - Get orders for the authenticated shop owner
router.get("/shop",
    authenticate,
    validateGetShopOrders,
    orderController.getShopOrders
);

// PATCH /api/orders/:id - Update order status (SHOP only)
router.patch("/:id",
    authenticate,
    validatePatchShopOrder,
    orderController.patchShopOrder
);

module.exports = router;
