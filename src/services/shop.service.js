const Shop = require("../models/shop.model");
const User = require("../models/user.model")

// POST /api/shops
exports.createShop = async (shopData) => {

    if(shopData.ownerId!=null){
        //check user and if he has the appropriate role
        const user = await User.findById(shopData.ownerId)
        console.log("user: ", user);
        if(!user){
            throw new Error("User not found");
        }
        
    }
    const newShop = new Shop(shopData);
    return await newShop.save();
}