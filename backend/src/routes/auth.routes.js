const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { loginRateLimiter } = require("../middlewares/rateLimit.middleware");

router.post("/login", loginRateLimiter, authController.login);

module.exports = router;
