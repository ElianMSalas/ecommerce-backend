const pool = require("../config/db");

const createProduct = async ({ name, description, price, stock, category }) => {
    const result = await pool.query(
        `INSERT INTO products (name, description, price, stock, category)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [name, description, price, stock, category]
    );
    return result.rows[0];
};

const findProductById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

const updateProduct = async (id, { name, description, price, stock, category }) => {
    const result = await pool.query(
        `UPDATE products
        SET name = $1, description = $2, price = $3, stock = $4, category = $5
        WHERE id = $6
        RETURNING *`,
        [name, description, price, stock, category, id]
    );
    return result.rows[0];
};

const deleteProduct = async (id) => {
    const result = await pool.query(
        "DELETE FROM products WHERE id = $1 RETURNING id",
        [id]
    );
    return result.rows[0];
};

module.exports = {
    createProduct,
    findProductById,
    updateProduct,
    deleteProduct,
};