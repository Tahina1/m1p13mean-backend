const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const AppError = require('../utils/AppError');

//GET CART
exports.getCart = async (ownerId) => {
    let cart = await Cart.findOne({ ownerId })
        .populate('items.productId', 'name price')
        .populate('items.shopId', 'name')
        .lean();
    if (!cart) {
        cart = new Cart({ ownerId, items: [] });
        await cart.save();
        return {
            cart,
            totalAmount: 0
        }
    }

    const totalAmount = cart.items.reduce((total, item) => {
        return total + (item.quantity*item.priceAtAdd);
    }, 0)


    return {
        cart,
        totalAmount
    }
}

//ADD ITEM
exports.addItemToCart = async (cartItemData) => {
    const { ownerId, productId, quantity } = cartItemData;
    let cart = await Cart.findOne({ ownerId }); //TODO: if user is not connected, we can use sessionId or something else to identify the cart, so ownerId is not required
    if (!cart) {
        cart = new Cart({ ownerId, items: [] });
    }
    //TODO: calculate total amount for the new item
    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError("Product not found", 404);
    }
    if(quantity < 1){
        throw new AppError("Quantity must be at least 1", 400);
    }
    if (!product.isActive) {
        throw new AppError("Product is not active", 403);
    }
    //TODO: increase quantity if the same product is added again, instead of adding a new item to the cart
    const existingItem = cart.items.find(item => item.productId.equals(productId));
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
    if(product.stock < newQuantity){
        throw new AppError("Not enough stock", 400);
    }

    if (existingItem) {
        existingItem.quantity = newQuantity;
    }
    else {
        cart.items.push({ 
            productId, 
            shopId: product.shopId, 
            priceAtAdd: product.price, 
            quantity 
        });
    }
    // cart.totalAmount = cart.items.reduce((total, item)=>{
    //     return total + (item.quantity*item.priceAtAdd);
    // }, 0)
    return await cart.save();
}

//PUT ITEM
exports.updateItemToCart = async (ownerId, productId, quantity) => {
    let cart = await Cart.findOne({ ownerId });
    if (!cart) {
        throw new AppError("Cart not found", 404);
    }
    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    if (itemIndex === -1) {
        throw new AppError("Item not found in cart", 404);
    }
    if(quantity < 1){
        throw new AppError("Quantity must be at least 1", 400);
    }
    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError("Product not found", 404);
    }
    if (!product.isActive) {
        throw new AppError("Product is not active", 403);
    }
    if(product.stock < quantity){
        throw new AppError("Not enough stock", 400);
    }
    cart.items[itemIndex].quantity = quantity;
    return await cart.save();
}

//DELETE ITEM
exports.removeItemFromCart = async (ownerId, productId) => {
    let cart = await Cart.findOne({ ownerId });
    if (!cart) {
        throw new AppError("Cart not found", 404);
    }
    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    if (itemIndex === -1) {
        throw new AppError("Item not found in cart", 404);
    }
    //splice remove the item from the index and 1 means remove one item, 
    //if we want to remove all items with the same productId
    cart.items.splice(itemIndex, 1);
    return await cart.save();
}