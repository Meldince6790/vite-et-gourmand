const express = require("express");

const router = express.Router();

const utilisateurController = require("../controllers/utilisateur.controller");

router.get("/", utilisateurController.getAll);

router.get("/:id", utilisateurController.getById);

router.post("/", utilisateurController.create);

module.exports = router;
