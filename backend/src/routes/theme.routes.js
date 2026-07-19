const express = require("express");

const router = express.Router();

const themeController = require("../controllers/theme.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Consultation des thèmes
router.get("/", themeController.getAllThemes);

router.get("/:id", themeController.getThemeById);

// Gestion des thèmes (Employé + Administrateur)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(2, 3),
  themeController.createTheme,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  themeController.updateTheme,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(2, 3),
  themeController.deleteTheme,
);

module.exports = router;
