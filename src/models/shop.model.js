const mongoose = require('mongoose');


const shopSchema = mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            index: true
        },
        gallery: {
            type: [String],
        },
        location: {
            floor: { type: String },
            shopNumber: { type: String }
        },
        status: {
            type: String,
            enum: ['PENDING', 'ACTIVE', 'SUSPENDED'],
            default: 'PENDING',
            index: true       
        },
        contract: {
            startDate: Date,
            endDate: Date
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Shop', shopSchema);