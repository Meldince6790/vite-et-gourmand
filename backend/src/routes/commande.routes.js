const express = require("express");

const router = express.Router();

const commandeController = require("../controllers/commande.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Consultation des commandes (Employé + Administrateur)
router.get(
  "/",
  authMiddleware,
  roleMiddleware(2, 3),
  commandeController.getAllCommandes,
);

// Consultation d'une commande par utilisateur (Employé + Administrateur)
router.get(
  "/utilisateur/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  commandeController.getCommandesByUtilisateur,
);

// Consultation d'une commande
router.get("/:id", authMiddleware, commandeController.getCommandeById);

// Création d'une commande (Client)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(1),
  commandeController.createCommande,
);

// Modification du statut (Employé + Administrateur)
router.patch(
  "/:id/statut",
  authMiddleware,
  roleMiddleware(2, 3),
  commandeController.updateStatut,
);

// Suppression d'une commande (Employé + Administrateur)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  commandeController.deleteCommande,
);

module.exports = router;
