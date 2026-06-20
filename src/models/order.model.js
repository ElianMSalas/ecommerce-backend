const pool = require("../config/db");

const createOrderFromCart = async (userId, cartId, items) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const total = items.reduce(
            (sum, item) => sum + item.quantity * Number(item.price),
            0
        );

        const orderResult = await client.query(
            `INSERT INTO orders (user_id, total, status)
            VALUES ($1, $2, 'pending')
            RETURNING *`,
            [userId, total]
        );
        const order = orderResult.rows[0];

        for (const item of items) {
            const productResult = await client.query(
                "SELECT stock FROM products WHERE id = $1 FOR UPDATE",
                [item.product_id]
            );
            const currentStock = productResult.rows[0].stock;

            if (currentStock < item.quantity) {
                throw new Error(`Stock insuficiente para el producto ${item.name}`);
            }

            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4)`,
                [order.id, item.product_id, item.quantity, item.price]
            );

            await client.query(
                "UPDATE products SET stock = stock - $1 WHERE id = $2",
                [item.quantity, item.product_id]
            );
        }

        await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

        await client.query("COMMIT");
        return order;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
};

const getOrdersByUser = async (userId) => {
    const result = await pool.query(
        `SELECT id, total, status, created_at
        FROM orders
        WHERE user_id = $1
        ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
};

const getOrderById = async (orderId, userId) => {
    const orderResult = await pool.query(
        "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
        [orderId, userId]
    );
    const order = orderResult.rows[0];
    if (!order) return null;

    const itemsResult = await pool.query(
        `SELECT oi.product_id, oi.quantity, oi.price,
            p.name,
            (oi.quantity * oi.price) AS subtotal
            FROM order_items oi
            JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = $1`,
        [orderId]
        );

        order.items = itemsResult.rows;
        return order;
};

module.exports = { createOrderFromCart, getOrdersByUser, getOrderById };

