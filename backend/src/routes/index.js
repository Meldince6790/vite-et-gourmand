const express = require("express");

const router = express.Router();

const utilisateurRoutes = require("./utilisateur.routes");
const menuRoutes = require("./menu.routes");
const platRoutes = require("./plat.routes");
const commandeRoutes = require("./commande.routes");
const authRoutes = require("./auth.routes");
const allergeneRoutes = require("./allergene.routes");
const themeRoutes = require("./theme.routes");

router.get("/", (req, res) => {
  res.json({
    message: "API Vite & Gourmand opérationnelle",
  });
});

router.use("/utilisateurs", utilisateurRoutes);
router.use("/menus", menuRoutes);
router.use("/plats", platRoutes);
router.use("/commandes", commandeRoutes);
router.use("/auth", authRoutes);
router.use("/allergenes", allergeneRoutes);
router.use("/themes", themeRoutes);

module.exports = router;
