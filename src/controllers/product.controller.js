const {
    addProduct,
    editProduct,
    removeProduct,
    listProducts,
} = require ("../services/product.service");

const create = async (req, res) => {
    try {
        const product = await addProduct(req.body);
        res.status(201).json({
            status: "ok",
            message: "Producto creado correctamente",
            product,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            messsage: error.message || "Error al crear el producto",
        });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await editProduct(id, req.body);
        res.status(200).json({
            status:"ok",
            message: "Producto actualizado correctamente",
            product,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error al actualizar el producto",
        });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await removeProduct(id);
        res.status(200).json({
            status: "ok",
            message: "Producto eliminado correctamente",
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status:"error",
            message: error.message || "Error al eliminar el producto",
        });
    }
};

const list = async (req, res) => {
    try {
        const result = await listProducts(req.query);
        res.status(200).json({
            status: "ok",
            ...result,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error al listar los productos",
        });
    }
};

module.exports = { create, update, remove, list };