const Shop = require("../models/shop.model");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");

// POST /api/shops
exports.createShop = async (shopData) => {

    if(shopData.ownerId!=null){
        //check user and if he has the appropriate role
        const user = await User.findById(shopData.ownerId);
        
        if(!user){
            throw new AppError("User not found", 404);
        }
        
    }   
    const newShop = new Shop(shopData);
    return await newShop.save();
}

exports.patchShop = async (shopId, updatedData) => {
    const shop = await Shop.findById(shopId);
    if (!shop) {
        throw new AppError("Shop not found", 404);
    }

    const {name, category, location, gallery} = updatedData;
    if(name) shop.name = name;
    if(category) shop.category = category;
    if(location) shop.location = location;
    if(gallery && gallery.length > 0){
        //remove old gallery images if new ones are provided
        shop.gallery = gallery;
    }

    return await shop.save();
}

exports.updateStatus = async (shopId, status) => {
    if(!["PENDING", "ACTIVE", "SUSPENDED"].includes(status)){
        throw new AppError("Invalid status value", 400);
    }
    const shop = await Shop.findById(shopId);
    if (!shop) {
        throw new AppError("Shop not found", 404);
    }
    shop.status = status;
    return await shop.save();
}

exports.getShops = async ({page=1, limit=10, name=null, category=null, status=null}) => {
    try {
        const query = {};
        if(name) query.name = { $regex: name, $options: 'i' };
        if(category) query.category = category;
        if(status) query.status = status;
        const [shops, total] = await Promise.all([Shop.find(query)
            .select("name category ownerId status")
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),//retourne des objets JS bruts au lieu de documents Mongoose (jusqu'à 60% plus rapide
            Shop.countDocuments(query)]);
        return {
            shops,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                limit
            }
          };
        
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}