const express = require("express");

const router = express.Router();

const menuController = require("../controllers/menu.controller");

router.get("/", menuController.getAllMenus);

router.get("/:id/plats", menuController.getPlatsByMenu);

router.post("/:id/plats", menuController.addPlatToMenu);

router.get("/:id", menuController.getMenuById);

router.post("/", menuController.createMenu);

router.delete("/:id/plats/:platId", menuController.removePlatFromMenu);

module.exports = router;
