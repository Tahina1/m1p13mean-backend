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
        const status = error.status || 500;
        return res.status(status).json({ message: error.message });
    }
}

// PATCH /api/shops/:id
exports.patchShop = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = {...req.body};
        if(req.gallery && req.gallery.length > 0){
            updateData.gallery = req.gallery;
        }
        const updatedShop = await shopService.patchShop(id, updateData);
        return res.status(200).json({ message: "Shop updated successfully", shop: updatedShop });
        
    } catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ message: error.message });

    }
}

exports.updateShopStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedShop = await shopService.updateStatus(id, req.body.status);
        return res.status(200).json({ message: "Shop status updated successfully", shop: updatedShop });
        
    } catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ message: error.message });
    }
}