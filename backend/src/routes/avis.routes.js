const express = require("express");
const router = express.Router();

const avisController = require("../controllers/avis.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Consultation publique

router.get("/", avisController.getAll);

router.get("/:id", avisController.getById);

// Création d'un avis par un client connecté

router.post("/", authMiddleware, roleMiddleware(1), avisController.create);

// Gestion / modération employé et administrateur

router.put("/:id", authMiddleware, roleMiddleware(2, 3), avisController.update);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  avisController.delete,
);

module.exports = router;
