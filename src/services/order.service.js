const mongoose = require("mongoose");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Shop = require("../models/shop.model");
const AppError = require("../utils/AppError");
const Order = require("../models/order.model");

exports.processCheckout = async (ownerId, billingDetails, shippingAddress) => {
    if(!shippingAddress) throw new AppError("Shipping address is required", 400);
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const cart = await Cart.findOne({ ownerId })
        .populate("items.productId")
        .populate("items.shopId")
        .session(session);
        //Validate globaly Cart
        if(!cart) throw new AppError("Cart not found", 404);
        if(cart.items.length === 0) throw new AppError("Cart is empty", 400);

        //Validate product and shop
        const groupedByOrder = cart.items.reduce((groups, item) => {
            const shopIdAsKey = item.shopId._id.toString();
            if(!groups[shopIdAsKey]) groups[shopIdAsKey] = [];
            groups[shopIdAsKey].push(item); 
            return groups;

        },{}); //map

        for(const shopIdAsKey in groupedByOrder){
            const shopItems = groupedByOrder[shopIdAsKey];
            const order = new Order({
                customerId: ownerId,
                billingDetails: billingDetails,
                shopId: shopIdAsKey,
                // as we group by shop, 
                // all items have the same shop, 
                // so we can take the name from the first item
                // we have already populated shop in cart for each item, 
                // so we can access shop name without extra query
                // so for each first item we take shop name and use it for whole order
                shopName: shopItems[0].shopId.name, 
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
                    productId: item.productId._id,
                    productName: item.productId.name,
                    quantity: item.quantity,
                    priceAtOrder: item.priceAtAdd
                })

                product.stock -= item.quantity;
                await product.save({ session });              
                order.totalAmount += item.quantity * item.priceAtAdd;
            }
            order.status = "Processing";
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

exports.getMyOrders = async ({page=1, limit=10, productName=null, customerId=null, startDate=null, endDate=null, shopName=null, status=null} ) => {
    try {
        if(!customerId) throw new AppError("Customer ID is required", 400);
        const query = { customerId };
        if(productName) query["items.productName"] = { $regex: productName, $options: 'i'};
        if(shopName) query.shopName = { $regex: shopName, $options: 'i' };
        if(status && status.length > 0) query.status = { $in: status };//status is Array of status
        if(startDate && endDate){
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const [orders, total] = await Promise.all([Order.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
            Order.countDocuments(query)
        ]);

        return {
            orders,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }

            
    } catch (error) {
        throw new AppError(error.message, error.status || 500);
    }
}