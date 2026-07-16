const express = require("express");

const router = express.Router();

const utilisateurRoutes = require("./utilisateur.routes");

router.get("/", (req, res) => {
  res.json({
    message: "API Vite & Gourmand opérationnelle",
  });
});

router.use("/utilisateurs", utilisateurRoutes);

module.exports = router;
