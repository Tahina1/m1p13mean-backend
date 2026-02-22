const Product = require('../models/product.model');
const Shop = require('../models/shop.model');
const AppError = require('../utils/AppError');

exports.createProduct = async (productData) => {
    const shop = await Shop.findById(productData.shopId);
    if(!shop) throw new AppError("Shop not found", 404);
    if(shop.status !== "ACTIVE") throw new AppError("Shop is not active", 403);
    const product = new Product(productData);
    return product.save();
}

exports.getProducts = async ({page=1, limit=10, name=null, categoryIds=null, minPrice=null, maxPrice=null, shopId=null, isActive=null}) => {
    try {
        const query = {};      
        if(name) query.name = { $regex: name, $options: 'i' };
        if(categoryIds && categoryIds.length > 0) query.categories = { $in: categoryIds };
        if(minPrice !== null || maxPrice !== null){
            query.price = {};
            if(minPrice !== null) query.price.$gte = minPrice;
            if(maxPrice !== null) query.price.$lte = maxPrice;
        }
        if(shopId) query.shopId = shopId;
        if(isActive!==null) query.isActive = isActive

        const [products, total] = await Promise.all([Product.find(query)
            .select("name categories images price isActive")
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
            Product.countDocuments(query)]);
        return {
            products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                limit
            }
        }

    } catch (error) {
        throw new AppError(error.message, 500);
    }

}