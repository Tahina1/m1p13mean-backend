const router = require("express").Router();
const productCategoryController = require("../controllers/product-category.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const {
    validateCreateCategory,
    validateUpdateCategory,
    validateUpdateCategoryStatus,
    validateSearchByName
} = require("../validators/product-category.validator");

// GET /api/product-categories - public
router.get("/", productCategoryController.getCategories);

// GET /api/product-categories/search?name=... - public (avant /:id pour eviter conflit)
router.get("/search", validateSearchByName, productCategoryController.getCategoryByName);

// GET /api/product-categories/:id - public
router.get("/:id", productCategoryController.getCategoryById);

// POST /api/product-categories - admin only
router.post("/",
    authenticate,
    authorize("ADMIN"),
    validateCreateCategory,
    productCategoryController.createCategory
);

// PATCH /api/product-categories/:id/status - admin only (avant /:id pour eviter conflit)
router.patch("/:id/status",
    authenticate,
    authorize("ADMIN"),
    validateUpdateCategoryStatus,
    productCategoryController.updateCategoryStatus
);

// PATCH /api/product-categories/:id - admin only
router.patch("/:id",
    authenticate,
    authorize("ADMIN"),
    validateUpdateCategory,
    productCategoryController.updateCategory
);

module.exports = router;
