const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, roles: user.roles },
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

        const accessToken = generateAccessToken(user);
        res.status(200).json({ 
            accessToken,
            user: { 
                id: user._id, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                email: user.email, 
                roles: user.roles 
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}