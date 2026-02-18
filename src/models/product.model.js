const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
        },
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductCategory',
            index: true
        }],
        images: {
            type: [String],
        },
        price: {
            type: Number,
            required: true
        },
        shopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop',
            required: true,
            index: true
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        stock: {
            type: Number,
            default: 0,
            min: 0
        },
        viewsCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);