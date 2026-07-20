const express = require("express");

const router = express.Router();

const utilisateurController = require("../controllers/utilisateur.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Profil utilisateur connecté
router.get("/me", authMiddleware, utilisateurController.getMe);

// Liste des utilisateurs (administrateur uniquement)
router.get(
  "/",
  authMiddleware,
  roleMiddleware(3),
  utilisateurController.getAll,
);

// Création compte client
router.post("/", utilisateurController.create);

module.exports = router;
