const express = require("express");
const router = express.Router();

const authController = require("../controllers/authcontroller");

router.post("/register", authController.register);
router.post("/logout", authController.logout);

router.post("/login",authController.login);

module.exports = router;
