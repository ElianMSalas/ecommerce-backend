const { body } = require("express-validator");

const addToCartValidation = [
    body("productId")
        .notEmpty().withMessage("El productId es obligatorio")
        .isInt({ min: 1 }).withMessage("El productId debe ser un entero válido"),
    
    body("quantity")
        .notEmpty().withMessage("La cantidad es obligatoria")
        .isInt({ min: 1 }).withMessage("La cantidad debe ser un entero mayor a 0"),
];

const updateItemValidation = [
    body("quantity")
        .notEmpty().withMessage("La cantidad es obligatoria")
        .isInt({ min: 1 }).withMessage("La cantidad debe ser un entero mayor a 0"),
];

module.exports = { addToCartValidation, updateItemValidation };