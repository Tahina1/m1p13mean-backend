const orderService = require("../services/order.service");

exports.checkout = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const { billingDetails, shippingAddress } = req.body;
        const result = await orderService.processCheckout(ownerId, billingDetails, shippingAddress);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};
