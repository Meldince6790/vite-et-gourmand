const menuService = require("../services/menu.service");
const { toClientErrorMessage } = require("../utils/safeErrorMessage");

function handleError(res, error, defaultMessage) {
  console.error(error);

  const clientMessage = toClientErrorMessage(error, defaultMessage);

  if (
    clientMessage !== defaultMessage &&
    error.message.includes("introuvable")
  ) {
    return res.status(404).json({
      message: clientMessage,
    });
  }

  if (
    clientMessage !== defaultMessage &&
    (error.message.includes("déjà") || error.message.includes("existe"))
  ) {
    return res.status(409).json({
      message: clientMessage,
    });
  }

  return res.status(400).json({
    message: clientMessage,
  });
}

const menuController = {
  async getAllMenus(req, res) {
    try {
      const menus = await menuService.getAllMenus();

      res.status(200).json(menus);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération des menus.",
      );
    }
  },

  async getMenuById(req, res) {
    try {
      const menu = await menuService.getMenuById(req.params.id);

      res.status(200).json(menu);
    } catch (error) {
      return handleError(res, error, "Erreur lors de la récupération du menu.");
    }
  },

  async createMenu(req, res) {
    try {
      const menuId = await menuService.createMenu(req.body);

      res.status(201).json({
        message: "Menu créé avec succès.",
        menu_id: menuId,
      });
    } catch (error) {
      return handleError(res, error, "Erreur lors de la création du menu.");
    }
  },

  async updateMenu(req, res) {
    try {
      await menuService.updateMenu(req.params.id, req.body);

      res.status(200).json({
        message: "Menu modifié avec succès.",
      });
    } catch (error) {
      return handleError(res, error, "Erreur lors de la modification du menu.");
    }
  },

  async deleteMenu(req, res) {
    try {
      await menuService.deleteMenu(req.params.id);

      res.status(200).json({
        message: "Menu supprimé avec succès.",
      });
    } catch (error) {
      return handleError(res, error, "Erreur lors de la suppression du menu.");
    }
  },

  async getPlatsByMenu(req, res) {
    try {
      const plats = await menuService.getPlatsByMenuId(req.params.id);

      res.status(200).json(plats);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération des plats du menu.",
      );
    }
  },

  async addPlatToMenu(req, res) {
    try {
      await menuService.addPlatToMenu(req.params.id, req.body.plat_id);

      res.status(201).json({
        message: "Plat ajouté au menu avec succès.",
      });
    } catch (error) {
      return handleError(res, error, "Erreur lors de l'ajout du plat au menu.");
    }
  },

  async removePlatFromMenu(req, res) {
    try {
      await menuService.removePlatFromMenu(req.params.id, req.params.platId);

      res.status(200).json({
        message: "Plat retiré du menu avec succès.",
      });
    } catch (error) {
      return handleError(res, error, "Erreur lors du retrait du plat du menu.");
    }
  },
};

module.exports = menuController;
