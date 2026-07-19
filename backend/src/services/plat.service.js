const Plat = require("../models/plat.model");

const platService = {
  async getAllPlats() {
    return await Plat.findAll();
  },

  async getPlatById(id) {
    const plat = await Plat.findById(id);

    if (!plat) {
      throw new Error("Plat introuvable.");
    }

    return plat;
  },

  async createPlat(plat) {
    return await Plat.create(plat);
  },

  async updatePlat(id, plat) {
    const platExiste = await Plat.exists(id);

    if (!platExiste) {
      throw new Error("Plat introuvable.");
    }

    return await Plat.update(id, plat);
  },

  async deletePlat(id) {
    const platExiste = await Plat.exists(id);

    if (!platExiste) {
      throw new Error("Plat introuvable.");
    }

    return await Plat.delete(id);
  },

  async getMenusByPlatId(platId) {
    const platExiste = await Plat.exists(platId);

    if (!platExiste) {
      throw new Error("Plat introuvable.");
    }

    return await Plat.findMenusByPlatId(platId);
  },
};

module.exports = platService;
