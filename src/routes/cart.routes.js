const express = require("express");
const router = express.Router();
const { view, add, update, remove, clear } = require("../controllers/cart.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { handleValidation } = require("../middlewares/handleValidation");
const {
    addToCartValidation,
    updateItemValidation,
} = require("../middlewares/validators/cart.validator");

router.get("/", authenticate, view);
router.post("/items", authenticate, addToCartValidation, handleValidation, add);
router.put("/items/:id", authenticate, updateItemValidation, handleValidation, update);
router.delete("/items/:id", authenticate, remove);
router.delete("/", authenticate, clear);

module.exports = router;