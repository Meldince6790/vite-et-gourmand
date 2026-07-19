const express = require("express");

const router = express.Router();

const regimeController = require("../controllers/regime.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Consultation des régimes
router.get("/", regimeController.getAllRegimes);

router.get("/:id", regimeController.getRegimeById);

// Gestion des régimes (Employé + Administrateur)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(2, 3),
  regimeController.createRegime,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  regimeController.updateRegime,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  regimeController.deleteRegime,
);

module.exports = router;
