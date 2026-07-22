const Plat = require("../models/plat.model");
const Allergene = require("../models/allergene.model");

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

    const utilise = await Plat.usedInMenus(id);

    if (utilise) {
      throw new Error(
        "Impossible de supprimer ce plat car il est associé à un menu.",
      );
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

  async getAllergenesByPlatId(platId) {
    const platExiste = await Plat.exists(platId);

    if (!platExiste) {
      throw new Error("Plat introuvable.");
    }

    return await Plat.findAllergenesByPlatId(platId);
  },

  async addAllergeneToPlat(platId, allergeneId) {
    const platExiste = await Plat.exists(platId);

    if (!platExiste) {
      throw new Error("Plat introuvable.");
    }

    const allergeneExiste = await Allergene.exists(allergeneId);

    if (!allergeneExiste) {
      throw new Error("Allergène introuvable.");
    }

    const dejaAssocie = await Plat.allergeneExistsForPlat(platId, allergeneId);

    if (dejaAssocie) {
      throw new Error("Cet allergène est déjà associé à ce plat.");
    }

    return await Plat.addAllergeneToPlat(platId, allergeneId);
  },

  async removeAllergeneFromPlat(platId, allergeneId) {
    const platExiste = await Plat.exists(platId);

    if (!platExiste) {
      throw new Error("Plat introuvable.");
    }

    const allergeneExiste = await Allergene.exists(allergeneId);

    if (!allergeneExiste) {
      throw new Error("Allergène introuvable.");
    }

    const dejaAssocie = await Plat.allergeneExistsForPlat(platId, allergeneId);

    if (!dejaAssocie) {
      throw new Error("Cet allergène n'est pas associé à ce plat.");
    }

    return await Plat.removeAllergeneFromPlat(platId, allergeneId);
  },
};

module.exports = platService;
