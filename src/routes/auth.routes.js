const express = require("express");
const router = express.Router();
const { register } = require("../controllers/auth.controller");
const { registerValidation } = require("../middlewares/validators/auth.validator");
const { handleValidation } = require("../middlewares/handleValidation");

router.post("/register", registerValidation, handleValidation, register);

module.exports = router;