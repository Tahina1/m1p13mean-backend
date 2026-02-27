const cartService = require('../services/cart.service');
const AppError = require('../utils/AppError');

//GET CART
exports.getCart = async (req, res) => {
    try {
        //TODO: if user is not connected, 
        //later we can use sessionId or something else to identify the cart, so ownerId is not required

        //Ces checks sont défensifs mais créent du bruit.
        //  La responsabilité d'authentification appartient au middleware, pas au controller.
        //if (!req.user) throw new AppError("You must be logged in to view the cart", 401); 
        const ownerId = req.user.id;
        const cartData = await cartService.getCart(ownerId);
        res.status(200).json(cartData);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
}

//ADD ITEM TO CART
exports.addItem = async (req, res) => {
    try {
        //if (!req.user) throw new AppError("You must be logged in to add items to the cart", 401);
        const cartItemData = req.body;
        const cartItemResult = await cartService.addItemToCart(req.user.id, cartItemData);
        res.status(201).json({ message: "Item added to cart successfully", cart: cartItemResult });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
}

//PUT ITEM TO CART
exports.updateItem = async (req, res) => {
    try {
        //if (!req.user) throw new AppError("You must be logged in to update items in the cart", 401);
        const cartItemData = req.body;
        const cartItemResult = await cartService.updateItemToCart(req.user.id, cartItemData);
        res.status(200).json({ message: "Item updated successfully", cart: cartItemResult });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
}

//DELETE ITEM FROM CART
exports.deleteItem = async (req, res) => {
    try {
        //if (!req.user) throw new AppError("You must be logged in to delete items from the cart", 401);
        const productId = req.params.productId;
        await cartService.removeItemFromCart(req.user.id, productId);
        res.status(200).json({ message: "Item deleted from cart successfully" });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    } 
}