const express = require("express");

const router = express.Router();

const allergeneController = require("../controllers/allergene.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Consultation des allergènes
router.get("/", allergeneController.getAllAllergenes);

router.get("/:id", allergeneController.getAllergeneById);

// Gestion des allergènes (Employé + Administrateur)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(2, 3),
  allergeneController.createAllergene,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  allergeneController.updateAllergene,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  allergeneController.deleteAllergene,
);

module.exports = router;
