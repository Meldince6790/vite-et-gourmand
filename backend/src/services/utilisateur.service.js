const bcrypt = require("bcrypt");
const Utilisateur = require("../models/utilisateur.model");

const utilisateurService = {
  async getAllUtilisateurs() {
    return await Utilisateur.findAll();
  },

  async getUtilisateurById(id) {
    return await Utilisateur.findById(id);
  },

  async createUtilisateur(utilisateur) {
    const passwordHash = await bcrypt.hash(utilisateur.password, 10);

    utilisateur.password = passwordHash;

    return await Utilisateur.create(utilisateur);
  },
};

module.exports = utilisateurService;
