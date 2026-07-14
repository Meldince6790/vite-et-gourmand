const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("API Vite & Gourmand opérationnelle");
});

module.exports = router;