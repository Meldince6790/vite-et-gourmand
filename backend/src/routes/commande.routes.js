const express = require("express");
const router = express.Router();

const commandeController = require("../controllers/commande.controller");

router.get("/", commandeController.getAllCommandes);

router.post("/", commandeController.createCommande);

router.get("/:id", commandeController.getCommandeById);

router.patch("/:id/statut", commandeController.updateStatut);

module.exports = router;
