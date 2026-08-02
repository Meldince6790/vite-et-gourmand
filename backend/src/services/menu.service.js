const Menu = require("../models/menu.model");
const Plat = require("../models/plat.model");

function createMenuService({
  menuModel = Menu,
  platModel = Plat,
} = {}) {
  return {
    async getAllMenus() {
      return await menuModel.findAll();
    },

    async getMenuById(id) {
      const menu = await menuModel.findById(id);

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

      if (menu.quantite_restante === undefined) {
        menu.quantite_restante = 0;
      }

      return await menuModel.create(menu);
    },

    async getPlatsByMenuId(menuId) {
      const menuExiste = await menuModel.exists(menuId);

      if (!menuExiste) {
        throw new Error("Menu introuvable.");
      }

      return await menuModel.findPlatsByMenuId(menuId);
    },

    async addPlatToMenu(menuId, platId) {
      const menuExiste = await menuModel.exists(menuId);

      if (!menuExiste) {
        throw new Error("Menu introuvable.");
      }

      const plat = await platModel.findById(platId);

      if (!plat) {
        throw new Error("Plat introuvable.");
      }

      const associationExiste = await menuModel.platAlreadyExists(
        menuId,
        platId,
      );

      if (associationExiste) {
        throw new Error("Ce plat est déjà associé à ce menu.");
      }

      return await menuModel.addPlatToMenu(menuId, platId);
    },

    async removePlatFromMenu(menuId, platId) {
      const menuExiste = await menuModel.exists(menuId);

      if (!menuExiste) {
        throw new Error("Menu introuvable.");
      }

      const associationExiste = await menuModel.platAlreadyExists(
        menuId,
        platId,
      );

      if (!associationExiste) {
        throw new Error("Ce plat n'est pas associé à ce menu.");
      }

      return await menuModel.removePlatFromMenu(menuId, platId);
    },

    async updateMenu(id, menu) {
      const existe = await menuModel.exists(id);

      if (!existe) {
        throw new Error("Menu introuvable.");
      }

      return await menuModel.update(id, menu);
    },

    async deleteMenu(id) {
      const existe = await menuModel.exists(id);

      if (!existe) {
        throw new Error("Menu introuvable.");
      }

      const utilise = await menuModel.usedInCommandes(id);

      if (utilise) {
        throw new Error(
          "Impossible de supprimer ce menu car il est associé à une commande.",
        );
      }

      return await menuModel.delete(id);
    },
  };
}

const menuService = createMenuService();

module.exports = menuService;
module.exports.createMenuService = createMenuService;
