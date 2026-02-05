const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String }
  },
  { _id: false }
);

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
        gallery: [gallerySchema],
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