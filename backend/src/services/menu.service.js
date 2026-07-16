const Menu = require("../models/menu.model");
const Plat = require("../models/plat.model");

const menuService = {
  async getAllMenus() {
    return await Menu.findAll();
  },

  async getMenuById(id) {
    return await Menu.findById(id);
  },

  async createMenu(menu) {
    return await Menu.create(menu);
  },

  async getPlatsByMenuId(menuId) {
    return await Menu.findPlatsByMenuId(menuId);
  },

  async addPlatToMenu(menuId, platId) {
    const menuExiste = await Menu.exists(menuId);

    if (!menuExiste) {
      throw new Error("Menu introuvable.");
    }

    const plat = await Plat.findById(platId);

    if (!plat) {
      throw new Error("Plat introuvable.");
    }

    const associationExiste = await Menu.platAlreadyExists(menuId, platId);

    if (associationExiste) {
      throw new Error("Ce plat est déjà associé à ce menu.");
    }

    return await Menu.addPlatToMenu(menuId, platId);
  },

  async removePlatFromMenu(menuId, platId) {
    const associationExiste = await Menu.platAlreadyExists(menuId, platId);

    if (!associationExiste) {
      throw new Error("Ce plat n'est pas associé à ce menu.");
    }

    return await Menu.removePlatFromMenu(menuId, platId);
  },
};

module.exports = menuService;
