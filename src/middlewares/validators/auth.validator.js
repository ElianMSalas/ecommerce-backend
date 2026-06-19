const { body } = require("express-validator");

const registerValidation = [
    body("name")
        .trim()
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres"),
    body("surname")
        .trim()
        .notEmpty().withMessage("El apellido es obligatorio")
        .isLength({ min: 2, max: 100 }).withMessage("El apellido debe tener entre 2 y 100 caracteres"),
    body("email")
        .trim()
        .notEmpty().withMessage("El email es obligatorio")
        .isEmail().withMessage("El email no tiene un formato válido")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
];

module.exports = { registerValidation };