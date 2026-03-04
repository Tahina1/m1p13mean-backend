const router =  require('express').Router();
const { validateAddItem, validateUpdateItem, validateRemoveItem } = require("../validators/cart.validator");
const authenticate = require("../middlewares/auth.middleware");
const cartController = require("../controllers/cart.controller");

// POST /api/cart/items - Add item to cart
router.post("/items",
    authenticate,
    validateAddItem, 
    cartController.addItem);

// GET or CREATE /api/cart - Get cart for the user, if not exist create an empty cart
router.get("/",
    authenticate, //TODO: handle this when not connected customer order
    cartController.getCart
)

// PUT /api/cart/items/:productId - Update item quantity in cart
router.put("/items/:productId",
    authenticate,
    validateUpdateItem, 
    cartController.updateItem);

// DELETE /api/cart/items/:productId - Remove item from cart
router.delete("/items/:productId",
    authenticate,
    validateRemoveItem, 
    cartController.deleteItem);

module.exports = router;