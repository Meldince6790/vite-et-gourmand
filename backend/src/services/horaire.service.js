const Horaire = require("../models/horaire.model");

const horaireService = {
  async getAllHoraires() {
    return await Horaire.getAll();
  },

  async getHoraireById(id) {
    const horaire = await Horaire.getById(id);

    if (!horaire) {
      throw new Error("Horaire introuvable.");
    }

    return horaire;
  },

  async createHoraire(data) {
    if (!data.jour) {
      throw new Error("Le jour est obligatoire.");
    }

    if (!data.heure_ouverture || !data.heure_fermeture) {
      throw new Error(
        "Les horaires d'ouverture et de fermeture sont obligatoires.",
      );
    }

    return await Horaire.create(data);
  },

  async updateHoraire(id, data) {
    const horaireExiste = await Horaire.getById(id);

    if (!horaireExiste) {
      throw new Error("Horaire introuvable.");
    }

    if (!data.jour) {
      throw new Error("Le jour est obligatoire.");
    }

    if (!data.heure_ouverture || !data.heure_fermeture) {
      throw new Error(
        "Les horaires d'ouverture et de fermeture sont obligatoires.",
      );
    }

    return await Horaire.update(id, data);
  },

  async deleteHoraire(id) {
    const horaireExiste = await Horaire.getById(id);

    if (!horaireExiste) {
      throw new Error("Horaire introuvable.");
    }

    return await Horaire.delete(id);
  },
};

module.exports = horaireService;
