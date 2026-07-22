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

// Chiffre d'affaires année en cours
router.get(
  "/chiffre-affaires/annuel",
  authMiddleware,
  roleMiddleware(3),
  statistiqueController.getChiffreAffairesAnnuel,
);

// Evolution du chiffre d'affaires par période
router.get(
  "/chiffre-affaires/periode",
  authMiddleware,
  roleMiddleware(3),
  statistiqueController.getChiffreAffairesParPeriode,
);

// Chiffre d'affaires par menu
router.get(
  "/chiffre-affaires/menu",
  authMiddleware,
  roleMiddleware(3),
  statistiqueController.getChiffreAffairesParMenu,
);

// Chiffre d'affaires avec filtres menu + période
router.get(
  "/chiffre-affaires/filtre",
  authMiddleware,
  roleMiddleware(3),
  statistiqueController.getChiffreAffairesFiltre,
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
