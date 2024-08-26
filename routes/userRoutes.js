const express = require("express");
const { getAllUsers } = require("../controllers/userController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const router = express.Router();

router.get("/", authenticate, authorize(["admin"]), getAllUsers);

module.exports = router;
