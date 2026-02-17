const router = require("express").Router();
const shopController = require("../controllers/shop.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const { validateCreateShop, validatePatchShop } = require("../validators/shop.validator");
const { uploadToVercelBlob } = require("../middlewares/vercel-upload.middleware");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/shops - accessible for all users
router.get('/', shopController.getAllShops);

// POST /api/shops - only accessible for admins
router.post('/',
    authenticate,
    authorize("ADMIN"),
    upload.array('gallery'),
    uploadToVercelBlob,
    validateCreateShop,
    shopController.createShop
);

//PATCH /api/shops/id/status - only accessible for admins
router.patch("/:id/status",
    authenticate,
    authorize("ADMIN"),
    shopController.updateShopStatus
)

//PATCH /api/shops - accessible by admin and shop
router.patch("/:id",
    authenticate,
    authorize("ADMIN","SHOP"),
    upload.array("gallery"),
    uploadToVercelBlob,
    validatePatchShop,
    shopController.patchShop
)

module.exports = router;