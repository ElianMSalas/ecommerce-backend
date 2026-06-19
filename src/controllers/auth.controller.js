const { registerUser } = require("../services/auth.service");

const  register = async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;

        const newUser = await registerUser({ name, surname, email, password });

        res.status(201).json({
            status: "ok",
            message: "Usuario registrado correctamente",
            user: newUser,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error al registrar el usuario",
        });
    }
};

module.exports = { register };