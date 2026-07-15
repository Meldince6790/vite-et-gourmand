const Utilisateur = require("../models/utilisateur.model");

const utilisateurService = {
    async getAllUtilisateurs() {
        return await Utilisateur.findAll();
    },

    async getUtilisateurById(id) {
        return await Utilisateur.findById(id);
    }
};

module.exports = utilisateurService;