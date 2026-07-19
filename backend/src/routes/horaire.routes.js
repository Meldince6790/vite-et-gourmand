const express = require("express");

const router = express.Router();

const horaireController = require("../controllers/horaire.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Consultation publique

router.get("/", horaireController.getAll);

router.get("/:id", horaireController.getById);

// Gestion employé/admin

router.post(
  "/",
  authMiddleware,
  roleMiddleware([2, 3]),
  horaireController.create,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware([2, 3]),
  horaireController.update,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([2, 3]),
  horaireController.delete,
);

module.exports = router;
