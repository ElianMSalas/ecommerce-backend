const bcrypt = require("bcrypt");
const { findUserByEmail, createUser } = require("../models/user.model");

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

module.exports = { registerUser };