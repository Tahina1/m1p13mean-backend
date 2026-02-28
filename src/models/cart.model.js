const mongoose = require('mongoose');

const CartSchema = mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false, //TODO: Not connected user can also have cart, so this field is not required
            index: true
        },
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            shopId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Shop',
                required: true
            },
            priceAtAdd: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: [1, 'Quantity must be at least 1']
            }

        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cart', CartSchema);