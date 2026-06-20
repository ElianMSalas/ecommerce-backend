const {
    createOrderFromCart,
    getOrdersByUser,
    getOrderById,
} = require("../models/order.model");

const { findCartByUserId, getCartItems } = require("../models/cart.model");

const placeOrder = async (userId) => {
    const cart = await findCartByUserId(userId);
    if (!cart) {
        const error = new Error("No tienes un carrito");
        error.statusCode = 400;
        throw error;
    }

    const items = await getCartItems(cart.id);
    if (items.length === 0) {
        const error = new Error("El carrito está vacío");
        error.statusCode = 400;
        throw error;
    }

    const order = await createOrderFromCart(userId, cart.id, items);
    return order;
};

const listOrders = async (userId) => {
    return await getOrdersByUser(userId);
};

const getOrder = async (userId, orderId) => {
    const order = await getOrderById(orderId, userId);
    if (!order) {
        const error = new Error("Pedido no encontrado");
        error.statusCode = 404;
        throw error;
    }
    return order;
};

module.exports = { placeOrder, listOrders, getOrder };