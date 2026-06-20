const pool = require("../config/db");

const findCartByUserId = async (userId) => {
    const result = await pool.query(
        "SELECT * FROM carts WHERE user_id = $1",
        [userId]
    );
    return result.rows[0];
};

const createCart = async (userId) => {
    const result = await pool.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
        [userId]
    );
    return result.rows[0];
};

const getCartItems = async (cartId) => {
    const result = await pool.query(
        `SELECT ci.id, ci.product_id, ci.quantity,
        p.name, p.price, p.stock,
        (ci.quantity * p.price) AS subtotal
        FROM cart_items ci
        JOIN products p ON p.id = ci.product_id
        WHERE ci.cart_id = $1
        ORDER BY ci.id`,
        [cartId]
    );
    return result.rows;
};

const findCartItem = async (cartId, productId) => {
    const result = await pool.query(
        "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
        [cartId, productId]
    );
    return result.rows[0];
};

const addCartItem = async (cartId, productId, quantity) => {
    const result = await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [cartId, productId, quantity]
    );
    return result.rows[0];
};

const updateCartItemQuantity = async (itemId, quantity) => {
    const result = await pool.query(
        `UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *`,
        [quantity, itemId]
    );
    return result.rows[0];
};

const removeCartItem = async (itemId, cartId) => {
    const result = await pool.query(
        "DELETE FROM cart_items WHERE id = $1 AND cart_id = $2 RETURNING id",
        [itemId, cartId]
    );
    return result.rows[0];
};

const clearCart = async (cartId) => {
    await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
};

module.exports = {
    findCartByUserId,
    createCart,
    getCartItems,
    findCartItem,
    addCartItem,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
};