const router = require('express').Router();
const shopController = require('../controllers/shop.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');

// GET /api/shops - accessible for all users
router.get('/', shopController.getAllShops);

// POST /api/shops - only accessible for admins
router.post('/', authenticate, authorize("SHOP"), shopController.createShop);

module.exports = router;