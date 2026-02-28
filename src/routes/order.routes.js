const router = require("express").Router();
const authenticate = require("../middlewares/auth.middleware");
const { validateCheckout, validateGetMyOrders, validateGetShopOrders, validatePatchShopOrder, validateGetOrderById } = require("../validators/order.validator");
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

// GET /api/orders/me/:id - Get a specific order for the authenticated client
router.get("/me/:id",
    authenticate,
    validateGetOrderById,
    orderController.getMyOrderById
);

// GET /api/orders/shop/:id - Get a specific order for the authenticated shop owner
router.get("/shop/:id",
    authenticate,
    validateGetOrderById,
    orderController.getShopOrderById
);

// PATCH /api/orders/:id - Update order status (SHOP only)
router.patch("/:id",
    authenticate,
    validatePatchShopOrder,
    orderController.patchShopOrder
);

module.exports = router;
