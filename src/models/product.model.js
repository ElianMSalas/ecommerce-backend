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

const getProducts = async ({ category, search, minPrice, maxPrice, limit, offset }) => {
    const conditions = [];
    const values = [];
    let i = 1;

    if (category) {
        conditions.push(`category = $${i++}`);
        values.push(category);
    }
    if (search) {
        conditions.push(`name ILIKE $${i++}`);
        values.push(`%${search}%`);
    }
    if (minPrice !== undefined) {
        conditions.push(`price >= $${i++}`);
        values.push(minPrice);
    }
    if (maxPrice !== undefined) {
        conditions.push(`price <= $${i++}`);
        values.push(maxPrice);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
        SELECT * FROM products
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${i++} OFFSET $${i++}
    `;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
};

const countProducts = async ({ category, search, minPrice, maxPrice }) => {
    const conditions = [];
    const values = [];
    let i = 1;

    if (category) {
        conditions.push(`category = $${i++}`);
        values.push(category);
    }
    if (search) {
        conditions.push(`name ILIKE $${i++}`);
        values.push(`%${search}%`);
    }
    if (minPrice !== undefined) {
        conditions.push(`price >= $${i++}`);
        values.push(minPrice);
    }
    if (maxPrice !== undefined) {
        conditions.push(`price <= $${i++}`);
        values.push(maxPrice);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(`SELECT COUNT(*) FROM products ${whereClause}`, values);
    return parseInt(result.rows[0].count, 10);
};

module.exports = {
    createProduct,
    findProductById,
    updateProduct,
    deleteProduct,
    getProducts,
    countProducts,
};