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

exports.patchShopOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await orderService.patchShopOrder(id, req.user.shopId, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

exports.getShopOrders = async (req, res) => {
    try {
        const { page, limit, productName, customerId, status, startDate, endDate } = req.query;
        const result = await orderService.getShopOrders({
            shopId: req.user.shopId,
            page,
            limit,
            productName,
            customerId,
            status,
            startDate,
            endDate
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const { page, limit, productName, shopName, status, startDate, endDate } = req.query;
        const result = await orderService.getMyOrders({
            customerId: req.user.id,
            page,
            limit,
            productName,
            shopName,
            status,
            startDate,
            endDate
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};
