const {
    getCart,
    addToCart,
    updateItem,
    removeItem,
    emptyCart,
} = require("../services/cart.service");

const view = async (req, res) => {
    try {
        const cart = await getCart(req.user.id);
        res.status(200).json({ status: "ok", cart });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error al obtener el carrito",
        });
    }
};

const add = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const item = await addToCart(req.user.id, productId, quantity);
        res.status(200).json({
            status: "ok",
            message: "Producto agregado al carrito",
            item,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error al agregar el carrito",
        });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const item = await updateItem(req.user.id, id, quantity);
        res.status(200).json({
            status: "ok",
            message: "Cantidad actualizada",
            item,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error al actualizar el item",
        });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await removeItem(req.user.id, id);
        res.status(200).json({ status: "ok", message: "Item eliminado del carrito" });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error al eliminar el item",
        });
    }
};

const clear = async (req, res) => {
    try {
        await emptyCart(req.user.id);
        res.status(200).json({ status: "ok", message: "Carrito vaciado" });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error al vaciar el carrito",
        });
    }
};

module.exports = { view, add, update, remove, clear };