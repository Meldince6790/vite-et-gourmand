const Menu = require("../models/menu.model");

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
    return await Menu.addPlatToMenu(menuId, platId);
  },
};

module.exports = menuService;
