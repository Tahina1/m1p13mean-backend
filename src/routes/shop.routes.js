const router = require("express").Router();
const shopController = require("../controllers/shop.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const { validateCreateShop } = require("../validators/shop.validator");
const { uploadToVercelBlob } = require("../middlewares/vercel-upload.middleware");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/shops - accessible for all users
router.get('/', shopController.getAllShops);

// POST /api/shops - only accessible for admins
router.post('/',
    authenticate,
    authorize("SHOP"),
    upload.array('gallery'),
    uploadToVercelBlob,
    validateCreateShop,
    shopController.createShop
);

module.exports = router;