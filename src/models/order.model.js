const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        billingDetails: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true }
        },
        shopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true
        },
        shopName: {
            type: String,
            required: true
        },
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            productName: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                required: true
            },
            priceAtOrder: {
                type: Number,
                required: true
            }
        }],
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending"
        },
        shippingAddress: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);