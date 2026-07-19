const Allergene = require("../models/allergene.model");

const allergeneService = {
  async getAllAllergenes() {
    return await Allergene.findAll();
  },

  async getAllergeneById(id) {
    const allergene = await Allergene.findById(id);

    if (!allergene) {
      throw new Error("Allergène introuvable.");
    }

    return allergene;
  },

  async createAllergene(allergene) {
    const existe = await Allergene.existsByLibelle(allergene.libelle);

    if (existe) {
      throw new Error("Cet allergène existe déjà.");
    }

    return await Allergene.create(allergene);
  },

  async updateAllergene(id, allergene) {
    const allergeneExiste = await Allergene.exists(id);

    if (!allergeneExiste) {
      throw new Error("Allergène introuvable.");
    }

    const doublon = await Allergene.existsByLibelle(allergene.libelle);

    const allergeneActuel = await Allergene.findById(id);

    if (doublon && allergeneActuel.libelle !== allergene.libelle) {
      throw new Error("Cet allergène existe déjà.");
    }

    return await Allergene.update(id, allergene);
  },

  async deleteAllergene(id) {
    const allergeneExiste = await Allergene.exists(id);

    if (!allergeneExiste) {
      throw new Error("Allergène introuvable.");
    }

    return await Allergene.delete(id);
  },
};

module.exports = allergeneService;
