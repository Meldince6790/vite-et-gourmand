const express = require("express");

const router = express.Router();

const statistiqueController = require("../controllers/statistique.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Toutes les statistiques
router.get(
  "/",
  authMiddleware,
  roleMiddleware(3),
  statistiqueController.getStatistiques,
);

// Comparaison du nombre de commandes par menu (graphique)
router.get(
  "/commandes-par-menu",
  authMiddleware,
  roleMiddleware(3),
  statistiqueController.getCommandesParMenu,
);

// Chiffre d'affaires avec filtres
router.get(
  "/chiffre-affaires",
  authMiddleware,
  roleMiddleware(3),
  statistiqueController.getChiffreAffaires,
);

// Statistiques d'un menu précis
// À mettre en dernier car :menu_id capture n'importe quelle chaîne
router.get(
  "/menu/:menu_id",
  authMiddleware,
  roleMiddleware(3),
  statistiqueController.getStatistiquesParMenu,
);

module.exports = router;
