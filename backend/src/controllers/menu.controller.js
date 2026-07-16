const menuService = require("../services/menu.service");

const menuController = {
  async getAllMenus(req, res) {
    try {
      const menus = await menuService.getAllMenus();

      res.json(menus);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération des menus.",
        error: error.message,
      });
    }
  },

  async getMenuById(req, res) {
    try {
      const menu = await menuService.getMenuById(req.params.id);

      if (!menu) {
        return res.status(404).json({
          message: "Menu introuvable.",
        });
      }

      res.json(menu);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération du menu.",
        error: error.message,
      });
    }
  },

  async createMenu(req, res) {
    try {
      console.log(req.body);

      const menuId = await menuService.createMenu(req.body);

      res.status(201).json({
        message: "Menu créé avec succès.",
        menu_id: menuId,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la création du menu.",
        error: error.message,
      });
    }
  },

  async getPlatsByMenu(req, res) {
    try {
      const plats = await menuService.getPlatsByMenuId(req.params.id);

      res.json(plats);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Erreur lors de la récupération des plats du menu.",
        error: error.message,
      });
    }
  },

  async addPlatToMenu(req, res) {
    try {
      await menuService.addPlatToMenu(req.params.id, req.body.plat_id);

      res.status(201).json({
        message: "Plat ajouté au menu avec succès.",
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de l'ajout du plat au menu.",
        error: error.message,
      });
    }
  },

  async removePlatFromMenu(req, res) {
    try {
      await menuService.removePlatFromMenu(req.params.id, req.params.platId);

      res.json({
        message: "Plat retiré du menu avec succès.",
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors du retrait du plat du menu.",
        error: error.message,
      });
    }
  },
};

module.exports = menuController;
