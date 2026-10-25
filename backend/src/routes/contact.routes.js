const express = require("express");

const router = express.Router();

const contactController = require("../controllers/contact.controller");
const { contactRateLimiter } = require("../middlewares/rateLimit.middleware");

router.post("/", contactRateLimiter, contactController.send);

module.exports = router;
