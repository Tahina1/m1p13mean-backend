const productService = require('../services/product.service');

exports.createProduct = async (req, res) => {
    try {
        const { categoryIds, ...rest } = req.body;
        const productData = { ...rest, images: req.images, categories: categoryIds };
        const productResult = await productService.createProduct(productData);
        return res.status(201).json({ message: "Product created successfully", product: productResult });

    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
}

exports.getProducts = async (req, res) => {
    try {
        const { page, limit, name, categoryIds, minPrice, maxPrice, shopId, isActive } = req.query;
        const productResult = await productService.getProducts({
            page: page || 1,
            limit: limit || 10,
            name,
            categoryIds,
            minPrice,
            maxPrice,
            shopId,
            isActive
        });
        return res.status(200).json(productResult)

    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
}