const mongoose = require("mongoose");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Shop = require("../models/shop.model");
const AppError = require("../utils/AppError");
const Order = require("../models/order.model");

exports.processCheckout = async (ownerId, shippingAddress) => {
    if(!shippingAddress) throw new AppError("Shipping address is required", 400);
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const cart = await Cart.findOne({ ownerId }).populate("items.productId").session(session);
        //Validate globaly Cart
        if(!cart) throw new AppError("Cart not found", 404);
        if(cart.items.length === 0) throw new AppError("Cart is empty", 400);

        //Validate product and shop
        const groupedByOrder = cart.items.reduce((groups, item) => {
            const shopIdAsKey = item.shopId.toString();
            if(!groups[shopIdAsKey]) groups[shopIdAsKey] = [];
            groups[shopIdAsKey].push(item); 
            return groups;

        },{}); //map

        for(const shop in groupedByOrder){
            const shopItems = groupedByOrder[shop];
            const order = new Order({
                customerId: ownerId,
                shopId: shop,
                items: [],
                totalAmount: 0,
                shippingAddress: shippingAddress
            });
            for(const item of shopItems){
                const product = item.productId;     
                if(!product || !product.isActive) {
                    throw new AppError(`Product ${item.productId?.name || "Unknown"} not found or not active`, 404);
                }

                if(product.stock < item.quantity) {
                    throw new AppError(`Not enough stock for product ${item.productId?.name || "Unknown"}`, 400);
                }

                order.items.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtOrder: item.priceAtAdd
                })

                product.stock -= item.quantity;
                await product.save({ session });              
                order.totalAmount += item.quantity * item.priceAtAdd;
            }
            await order.save({ session });
        }
        await Cart.deleteOne({ ownerId }).session(session);
        await session.commitTransaction();
        return { message: "Checkout successful" };
        
    } catch (error) {
        await session.abortTransaction();
        throw new AppError(error.message, error.status || 500);
    } finally {
        session.endSession();
    }


}