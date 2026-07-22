const express = require("express");

const router = express.Router();

const utilisateurController = require("../controllers/utilisateur.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Profil utilisateur connecté
router.get("/me", authMiddleware, utilisateurController.getMe);

// Modification du profil utilisateur connecté
router.patch("/me", authMiddleware, utilisateurController.updateMe);

// Liste des utilisateurs
// Accessible uniquement à l'administrateur
router.get(
  "/",
  authMiddleware,
  roleMiddleware(3),
  utilisateurController.getAll,
);

// Création d'un compte client
// Route publique utilisée lors de l'inscription
router.post("/", utilisateurController.create);

// Création d'un compte employé
// Accessible uniquement à l'administrateur
router.post(
  "/employe",
  authMiddleware,
  roleMiddleware(3),
  utilisateurController.createEmploye,
);

// Activation / désactivation d'un compte employé
// Accessible uniquement à l'administrateur
router.patch(
  "/:id/actif",
  authMiddleware,
  roleMiddleware(3),
  utilisateurController.updateActif,
);

module.exports = router;
