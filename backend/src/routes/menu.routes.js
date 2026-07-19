const express = require("express");

const router = express.Router();

const menuController = require("../controllers/menu.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Consultation des menus
router.get("/", menuController.getAllMenus);

router.get("/:id", menuController.getMenuById);

router.get("/:id/plats", menuController.getPlatsByMenu);

// Gestion des menus (Employé + Administrateur)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(2, 3),
  menuController.createMenu,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  menuController.updateMenu,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  menuController.deleteMenu,
);

// Gestion des plats associés au menu (Employé + Administrateur)
router.post(
  "/:id/plats",
  authMiddleware,
  roleMiddleware(2, 3),
  menuController.addPlatToMenu,
);

router.delete(
  "/:id/plats/:platId",
  authMiddleware,
  roleMiddleware(2, 3),
  menuController.removePlatFromMenu,
);

module.exports = router;
