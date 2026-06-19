const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { registerValidation, loginValidation } = require("../middlewares/validators/auth.validator");
const { handleValidation } = require("../middlewares/handleValidation");

router.post("/register", registerValidation, handleValidation, register);
router.post("/login", loginValidation, handleValidation, login);

module.exports = router;