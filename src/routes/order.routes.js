const express = require("express");
const router = express.Router();
const { create, list, getOne } = require("../controllers/order.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.post("/", authenticate, create);
router.get("/", authenticate, list);
router.get("/:id", authenticate, getOne);

module.exports = router;