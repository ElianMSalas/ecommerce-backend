const {
    createProduct,
    findProductById,
    updateProduct,
    deleteProduct,
} = require("../models/product.model");

const addProduct = async (data) => {
    return await createProduct(data);
};

const editProduct = async (id, data) => {
    const existing = await findProductById(id);
    if (!existing) {
        const error = new Error("Producto no encontrado");
        error.statusCode = 404;
        throw error;
    }
    return await updateProduct(id, data);
};

const removeProduct = async (id) => {
    const deleted = await deleteProduct(id);
    if (!deleted) {
        const error = new Error("Producto no encontrado");
        error.statusCode = 404;
        throw error;
    }
    return deleted;
};

module.exports = { addProduct, editProduct, removeProduct };