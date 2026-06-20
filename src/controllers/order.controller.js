const { placeOrder, listOrders, getOrder } = require("../services/order.service");

const create = async (req, res) => {
    try {
        const order = await placeOrder(req.user.id);
        res.status(201).json({
            status: "ok",
            message: "Pedido creado correctamente",
            order,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error al crear el pedido",
        });
    }
};

const list = async (req, res) => {
    try {
        const orders = await listOrders(req.user.id);
        res.status(200).json({ status: "ok", orders });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error al listar los pedidos",
        });
    }
};

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await getOrder(req.user.id, id);
        res.status(200).json({ status: "ok", order });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error al obtener el pedido",
        });
    }
};

module.exports = { create, list, getOne };