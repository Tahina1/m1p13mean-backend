const ProductCategory = require("../models/product-category.model");
const AppError = require("../utils/AppError");

exports.getCategories = async () => {
    return await ProductCategory.find().select("name isActive createdAt").sort({ name: 1 }).lean();
}

exports.getCategoryById = async (id) => {
    const category = await ProductCategory.findById(id).lean();
    if (!category) throw new AppError("Category not found", 404);
    return category;
}

exports.getCategoryByName = async (name) => {
    const category = await ProductCategory.findOne({ name: { $regex: `^${name}$`, $options: "i" } }).lean();
    if (!category) throw new AppError("Category not found", 404);
    return category;
}

exports.createCategory = async ({ name, isActive }) => {
    const existing = await ProductCategory.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (existing) throw new AppError("Category already exists", 409);
    const category = new ProductCategory({ name, ...(isActive !== undefined && { isActive }) });
    return await category.save();
}

exports.updateCategory = async (id, { name, isActive }) => {
    const category = await ProductCategory.findById(id);
    if (!category) throw new AppError("Category not found", 404);
    if (name) {
        const existing = await ProductCategory.findOne({
            name: { $regex: `^${name}$`, $options: "i" },
            _id: { $ne: id }
        });
        if (existing) throw new AppError("Category name already exists", 409);
        category.name = name;
    }
    if (isActive !== undefined) category.isActive = isActive;
    return await category.save();
}
