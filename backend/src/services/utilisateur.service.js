const bcrypt = require("bcrypt");
const Utilisateur = require("../models/utilisateur.model");

function validatePassword(password) {
  return (
    password.length >= 10 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

const utilisateurService = {
  async getAllUtilisateurs() {
    return await Utilisateur.findAll();
  },

  async getUtilisateurById(id) {
    return await Utilisateur.findById(id);
  },

  async createUtilisateur(utilisateur) {
    const utilisateurExistant = await Utilisateur.findByEmail(
      utilisateur.email,
    );

    if (utilisateurExistant) {
      throw new Error("Cette adresse e-mail est déjà utilisée.");
    }

    if (!validatePassword(utilisateur.password)) {
      throw new Error(
        "Le mot de passe ne respecte pas les règles de sécurité.",
      );
    }

    const passwordHash = await bcrypt.hash(utilisateur.password, 10);

    utilisateur.password = passwordHash;

    utilisateur.role_id = 1;

    return await Utilisateur.create(utilisateur);
  },
};

module.exports = utilisateurService;
