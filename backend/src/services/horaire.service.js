const Horaire = require("../models/horaire.model");

const horaireService = {
  async getAllHoraires() {
    return await Horaire.getAll();
  },

  async getHoraireById(id) {
    return await Horaire.getById(id);
  },

  async createHoraire(data) {
    return await Horaire.create(data);
  },

  async updateHoraire(id, data) {
    return await Horaire.update(id, data);
  },

  async deleteHoraire(id) {
    return await Horaire.delete(id);
  },
};

module.exports = horaireService;
