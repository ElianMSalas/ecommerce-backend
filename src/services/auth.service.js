const bcrypt = require("bcrypt");
const { findUserByEmail, createUser } = require("../models/user.model");
const jwt = require("jsonwebtoken");

const registerUser = async ({ name, surname, email, password }) => {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        const error = new Error("El email ya está registrado");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
        name,
        surname,
        email,
        password: hashedPassword,
    });
    return newUser;
};

const loginUser = async ({ email, password }) => {
    const user = await findUserByEmail(email);

    if (!user) {
        const error = new Error("Credenciales inválidas");
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error("Credenciales inválidas");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
}

module.exports = { registerUser, loginUser };