const platService = require("../services/plat.service");

const platController = {
  async getAllPlats(req, res) {
    try {
      const plats = await platService.getAllPlats();

      res.json(plats);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération des plats.",
        error: error.message,
      });
    }
  },

  async getPlatById(req, res) {
    try {
      const plat = await platService.getPlatById(req.params.id);

      if (!plat) {
        return res.status(404).json({
          message: "Plat introuvable.",
        });
      }

      res.json(plat);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération du plat.",
        error: error.message,
      });
    }
  },

  async createPlat(req, res) {
    try {
      const platId = await platService.createPlat(req.body);

      res.status(201).json({
        message: "Plat créé avec succès.",
        plat_id: platId,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la création du plat.",
        error: error.message,
      });
    }
  },

  async getMenusByPlat(req, res) {
    try {
      const menus = await platService.getMenusByPlatId(req.params.id);

      res.json(menus);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération des menus du plat.",
        error: error.message,
      });
    }
  },
};

module.exports = platController;
