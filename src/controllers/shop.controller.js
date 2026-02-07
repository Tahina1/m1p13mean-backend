const Shop = require('../models/shop.model');
const shopService = require("../services/shop.service");

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
        const shopData = {...req.body, gallery: req.gallery};
        const shopResult = await shopService.createShop(shopData);
        return res.status(201).json({ message: "Shop created successfully", shop: shopResult }); 
        
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}