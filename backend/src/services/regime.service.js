const Regime = require("../models/regime.model");

const regimeService = {
  async getAllRegimes() {
    return await Regime.findAll();
  },

  async getRegimeById(id) {
    const regime = await Regime.findById(id);

    if (!regime) {
      throw new Error("Régime introuvable.");
    }

    return regime;
  },

  async createRegime(regime) {
    const regimeExiste = await Regime.findByLibelle(regime.libelle);

    if (regimeExiste) {
      throw new Error("Ce régime existe déjà.");
    }

    return await Regime.create(regime);
  },

  async updateRegime(id, regime) {
    const regimeExiste = await Regime.exists(id);

    if (!regimeExiste) {
      throw new Error("Régime introuvable.");
    }

    const doublon = await Regime.findByLibelle(regime.libelle);

    if (doublon && doublon.regime_id !== Number(id)) {
      throw new Error("Ce régime existe déjà.");
    }

    return await Regime.update(id, regime);
  },

  async deleteRegime(id) {
    const regimeExiste = await Regime.exists(id);

    if (!regimeExiste) {
      throw new Error("Régime introuvable.");
    }

    try {
      return await Regime.delete(id);
    } catch (error) {
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        throw new Error(
          "Impossible de supprimer ce régime car il est utilisé par un ou plusieurs menus.",
        );
      }

      throw error;
    }
  },
};

module.exports = regimeService;
