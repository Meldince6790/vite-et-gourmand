const express = require("express");

const router = express.Router();

const platController = require("../controllers/plat.controller");

router.get("/", platController.getAllPlats);

router.get("/:id", platController.getPlatById);

router.post("/", platController.createPlat);

module.exports = router;
