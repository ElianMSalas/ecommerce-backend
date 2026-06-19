const pool = require("../config/db");

const findUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return result.rows[0];
};

const createUser = async ({ name, surname, email, password }) => {
    const result = await pool.query(
        `INSERT INTO users (name, surname, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, surname, email, role, created_at`,
        [name, surname, email, password]
    );
    return result.rows[0]
};

module.exports = { findUserByEmail, createUser };