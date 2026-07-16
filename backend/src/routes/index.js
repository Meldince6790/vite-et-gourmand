const express = require("express");

const router = express.Router();

const utilisateurRoutes = require("./utilisateur.routes");
const menuRoutes = require("./menu.routes");
const platRoutes = require("./plat.routes");

router.get("/", (req, res) => {
  res.json({
    message: "API Vite & Gourmand opérationnelle",
  });
});

router.use("/utilisateurs", utilisateurRoutes);
router.use("/menus", menuRoutes);
router.use("/plats", platRoutes);

module.exports = router;
