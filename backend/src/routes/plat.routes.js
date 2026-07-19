const express = require("express");

const router = express.Router();

const platController = require("../controllers/plat.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Consultation des plats
router.get("/", platController.getAllPlats);

router.get("/:id/allergenes", platController.getAllergenesByPlat);

router.get("/:id/menus", platController.getMenusByPlat);

router.get("/:id", platController.getPlatById);

// Gestion des allergènes associés aux plats
router.post(
  "/:id/allergenes",
  authMiddleware,
  roleMiddleware(2, 3),
  platController.addAllergeneToPlat,
);

router.delete(
  "/:id/allergenes/:allergeneId",
  authMiddleware,
  roleMiddleware(2, 3),
  platController.removeAllergeneFromPlat,
);

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
