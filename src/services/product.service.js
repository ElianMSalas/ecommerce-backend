const {
    createProduct,
    findProductById,
    updateProduct,
    deleteProduct,
    getProducts,
    countProducts,
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

const listProducts = async (filters) => {
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const minPrice = filters.minPrice !== undefined ? parseFloat(filters.minPrice): undefined;
    const maxPrice = filters.maxPrice !== undefined ? parseFloat(filters.maxPrice): undefined;

    const queryParams = {
        category: filters.category,
        search: filters.search,
        minPrice,
        maxPrice
    };

    const products = await getProducts({ ...queryParams, limit, offset });
    const total = await countProducts(queryParams);

    return {
        products,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

module.exports = { addProduct, editProduct, removeProduct, listProducts };