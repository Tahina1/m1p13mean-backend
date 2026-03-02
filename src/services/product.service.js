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

exports.updateProduct = async (productId, productData) => {
    const product = await Product.findById(productId);
    if(!product) throw new AppError("Product not found", 404);

    const {name, description, categories, images, price, shopId, isActive, stock} = productData;
    if(name) product.name = name;
    if(description) product.description = description;
    if(categories && categories.length > 0) product.categories = categories;
    if(images && images.length > 0) product.images = images;
    if(price) product.price = price;
    if(shopId) product.shopId = shopId;
    if(isActive!==undefined) product.isActive = isActive;
    if(stock!==undefined) product.stock = stock;//in js 0 is falsy but valid, so we check for undefined instead

    return product.save();
}

exports.getProductById = async (productId) => {
    try {
        const product = await Product.findById(productId)
            .populate('categories', 'name')
            .populate('shopId', 'name')
            .lean();
        if (!product) throw new AppError("Product not found", 404);
        return product;
    } catch (error) {
        throw new AppError(error.message, error.status || 500);
    }
};

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