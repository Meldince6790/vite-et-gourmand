const express = require("express");

const router = express.Router();

const livraisonController = require("../controllers/livraison.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.post(
  "/estimation",
  authMiddleware,
  roleMiddleware(1),
  livraisonController.estimerLivraison,
);

module.exports = router;
