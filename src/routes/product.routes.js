const router = require('express').Router();
const productController = require('../controllers/product.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uploadToVercelBlob } = require('../middlewares/vercel-upload.middleware');
const { validateCreateProduct, validateGetProducts, validatePatchProduct, validateGetProductById } = require('../validators/product.validator');

// POST /api/products - only accessible for admins and shops
router.post('/',
    authenticate,
    authorize("ADMIN", "SHOP"),
    upload.array("images"),
    uploadToVercelBlob("images"),
    validateCreateProduct,
    productController.createProduct);

// PATCH /api/products/:id - only accessible for admins and shops
router.patch('/:id',
    authenticate,
    authorize("ADMIN", "SHOP"),
    upload.array("images"),
    uploadToVercelBlob("images"),
    validatePatchProduct,
    productController.updateProduct
)

// GET /api/products - accessible for all users
router.get('/',
    validateGetProducts,
    productController.getProducts);

// GET /api/products/:id - accessible for all users
router.get('/:id',
    validateGetProductById,
    productController.getProductById);

module.exports = router;