const express = require("express");
const router = express.Router();

const commandeController = require("../controllers/commande.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Consultation de toutes les commandes (Employé + Administrateur)
router.get(
  "/",
  authMiddleware,
  roleMiddleware(2, 3),
  commandeController.getAllCommandes,
);

// Création d'une commande (Client)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(1),
  commandeController.createCommande,
);

// Consultation d'une commande
router.get("/:id", authMiddleware, commandeController.getCommandeById);

// Modification du statut (Employé + Administrateur)
router.patch(
  "/:id/statut",
  authMiddleware,
  roleMiddleware(2, 3),
  commandeController.updateStatut,
);

module.exports = router;
