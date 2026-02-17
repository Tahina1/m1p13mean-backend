const Shop = require('../models/shop.model');
const shopService = require("../services/shop.service");


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

// GET /api/shops
exports.getShops = async (req, res) => {
    try {
        const { page, limit, name, category, status } = req.query;
        const result = await shopService.getShops({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            name,
            category,
            status
        });
        return res.status(200).json(result);

    } catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ message: error.message });
    }
}

// GET /api/shops/:id
exports.getShopById = async (req, res) => {
    try {
        const shop = await shopService.getShopById(req.params.id);
        return res.status(200).json(shop);

    } catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ message: error.message });
    }
}