const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "API Vite & Gourmand opérationnelle",
    });
});

module.exports = router;