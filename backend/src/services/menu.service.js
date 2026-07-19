const Menu = require("../models/menu.model");
const Plat = require("../models/plat.model");

const menuService = {
  async getAllMenus() {
    return await Menu.findAll();
  },

  async getMenuById(id) {
    const menu = await Menu.findById(id);

    if (!menu) {
      throw new Error("Menu introuvable.");
    }

    return menu;
  },

  async createMenu(menu) {
    if (!menu.titre) {
      throw new Error("Le titre du menu est obligatoire.");
    }

    if (menu.nombre_personne_minimum <= 0) {
      throw new Error(
        "Le nombre minimum de personnes doit être supérieur à zéro.",
      );
    }

    if (menu.prix_par_personne <= 0) {
      throw new Error("Le prix par personne doit être supérieur à zéro.");
    }

    return await Menu.create(menu);
  },

  async getPlatsByMenuId(menuId) {
    const menuExiste = await Menu.exists(menuId);

    if (!menuExiste) {
      throw new Error("Menu introuvable.");
    }

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
    const menuExiste = await Menu.exists(menuId);

    if (!menuExiste) {
      throw new Error("Menu introuvable.");
    }

    const associationExiste = await Menu.platAlreadyExists(menuId, platId);

    if (!associationExiste) {
      throw new Error("Ce plat n'est pas associé à ce menu.");
    }

    return await Menu.removePlatFromMenu(menuId, platId);
  },

  async updateMenu(id, menu) {
    const existe = await Menu.exists(id);

    if (!existe) {
      throw new Error("Menu introuvable.");
    }

    return await Menu.update(id, menu);
  },

  async deleteMenu(id) {
    const existe = await Menu.exists(id);

    if (!existe) {
      throw new Error("Menu introuvable.");
    }

    return await Menu.delete(id);
  },
};

module.exports = menuService;
