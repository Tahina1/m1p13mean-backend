const Shop = require('../models/shop.model');

// GET /api/shops
exports.getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find();
        return res.status(200).json(shops);

    } catch (error) {
        //No specific error for select all
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// POST /api/shops
exports.createShop = async (req, res) => {
    try {
        const { name, location } = req.body;
        const newShop = new Shop({ name, location, ownerId: req.user.id });
        await newShop.save();
        return res.status(201).json({ message: "Shop created successfully", shop: newShop });
        
        
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}