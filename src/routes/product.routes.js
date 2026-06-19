const express = require("express");
const router = express.Router();
const { create, update, remove, list } = require("../controllers/product.controller");
const { productValidation } = require("../middlewares/validators/product.validator");
const { handleValidation } = require("../middlewares/handleValidation");
const { authenticate } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/admin.middleware") ;

router.post("/", authenticate, isAdmin, productValidation, handleValidation, create);
router.put("/:id", authenticate, isAdmin, productValidation, handleValidation, update);
router.delete("/:id", authenticate, isAdmin, remove);
router.get("/", list);

module.exports = router;