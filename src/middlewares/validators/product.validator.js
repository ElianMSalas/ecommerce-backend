const { body } = require("express-validator");

const productValidation = [
    body("name")
        .trim()
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 2, max: 150 }).withMessage("El nombre debe tener entre 2 y 150 caracteres"),

    body("description")
        .optional()
        .trim(),

    body("price")
        .notEmpty().withMessage("El precio es obligatorio")
        .isFloat({ min: 0 }).withMessage("El precio debe ser un número mayor o igual a 0"),
    
    body("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("El stock debe ser un número entero mayor o igual a 0"),
    
    body("category")
        .optional()
        .trim(),
];

module.exports = { productValidation };