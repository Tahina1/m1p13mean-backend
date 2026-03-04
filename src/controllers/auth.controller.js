const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Shop = require('../models/shop.model');

const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, roles } = req.body;
        const newUser = new User({ firstName, lastName, email, password, roles });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const tokenPayload = { id: user._id, roles: user.roles };
        if (user.roles.includes('SHOP')) {
            const shop = await Shop.findOne({ ownerId: user._id }).select('_id');
            if (shop) tokenPayload.shopId = shop._id;
        }

        const accessToken = generateAccessToken(tokenPayload);
        res.status(200).json({
            accessToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                roles: user.roles,
                shopId: tokenPayload.shopId || null
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}