const Plat = require("../models/plat.model");

const platService = {
  async getAllPlats() {
    return await Plat.findAll();
  },

  async getPlatById(id) {
    return await Plat.findById(id);
  },

  async createPlat(plat) {
    return await Plat.create(plat);
  },

  async getMenusByPlatId(platId) {
    return await Plat.findMenusByPlatId(platId);
  },
};

module.exports = platService;
