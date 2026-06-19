const { registerUser, loginUser } = require("../services/auth.service");

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

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        const result = await loginUser({ email, password });

        res.status(200).json({
            status: "ok",
            message: "Sesión iniciada correctamente",
            token: result.token,
            user: result.user,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error al iniciar sesión, intenta nuevamente...",
        });


    }
};

module.exports = { register, login };