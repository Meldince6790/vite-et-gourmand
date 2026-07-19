const express = require("express");

const router = express.Router();

const platController = require("../controllers/plat.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Consultation des plats
router.get("/", platController.getAllPlats);

router.get("/:id", platController.getPlatById);

router.get("/:id/menus", platController.getMenusByPlat);

// Gestion des plats (Employé + Administrateur)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(2, 3),
  platController.createPlat,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  platController.updatePlat,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  platController.deletePlat,
);

module.exports = router;
