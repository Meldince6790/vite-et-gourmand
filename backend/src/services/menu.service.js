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
};

module.exports = menuService;
