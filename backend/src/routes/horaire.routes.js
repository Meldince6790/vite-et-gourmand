const express = require("express");

const router = express.Router();

const horaireController = require("../controllers/horaire.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Consultation publique

router.get("/", horaireController.getAllHoraires);

router.get("/:id", horaireController.getHoraireById);

// Gestion des horaires (Employé + Administrateur)

router.post(
  "/",
  authMiddleware,
  roleMiddleware(2, 3),
  horaireController.createHoraire,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  horaireController.updateHoraire,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  horaireController.deleteHoraire,
);

module.exports = router;
