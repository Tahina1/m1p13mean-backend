const productCategoryService = require("../services/product-category.service");

// GET /api/product-categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await productCategoryService.getCategories();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

// GET /api/product-categories/:id
exports.getCategoryById = async (req, res) => {
    try {
        const category = await productCategoryService.getCategoryById(req.params.id);
        return res.status(200).json(category);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

// GET /api/product-categories/search?name=...
exports.getCategoryByName = async (req, res) => {
    try {
        const category = await productCategoryService.getCategoryByName(req.query.name);
        return res.status(200).json(category);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

// POST /api/product-categories
exports.createCategory = async (req, res) => {
    try {
        const category = await productCategoryService.createCategory(req.body);
        return res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

// PATCH /api/product-categories/:id
exports.updateCategory = async (req, res) => {
    try {
        const category = await productCategoryService.updateCategory(req.params.id, req.body);
        return res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

// PATCH /api/product-categories/:id/status
exports.updateCategoryStatus = async (req, res) => {
    try {
        const category = await productCategoryService.updateCategoryStatus(req.params.id, req.body.isActive);
        return res.status(200).json({ message: "Category status updated successfully", category });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}
