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
};

module.exports = menuController;
