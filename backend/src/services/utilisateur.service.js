const bcrypt = require("bcrypt");
const Utilisateur = require("../models/utilisateur.model");

function validatePassword(password) {
  return (
    typeof password === "string" &&
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
    const utilisateur = await Utilisateur.findById(id);

    if (!utilisateur) {
      throw new Error("Utilisateur introuvable.");
    }

    return utilisateur;
  },

  async createUtilisateur(utilisateur) {
    if (!utilisateur.email || !utilisateur.password) {
      throw new Error("L'adresse e-mail et le mot de passe sont obligatoires.");
    }

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

    // Toute inscription publique crée un compte client
    utilisateur.role_id = 1;

    return await Utilisateur.create(utilisateur);
  },

  async updateUtilisateur(id, donnees) {
    const utilisateur = await Utilisateur.findById(id);

    if (!utilisateur) {
      throw new Error("Utilisateur introuvable.");
    }

    if (donnees.email && donnees.email !== utilisateur.email) {
      const utilisateurExistant = await Utilisateur.findByEmail(donnees.email);

      if (utilisateurExistant && utilisateurExistant.utilisateur_id !== id) {
        throw new Error("Cette adresse e-mail est déjà utilisée.");
      }
    }

    const utilisateurModifie = {
      nom: donnees.nom,
      prenom: donnees.prenom,
      email: donnees.email,
      telephone: donnees.telephone,
    };

    await Utilisateur.update(id, utilisateurModifie);

    return await Utilisateur.findById(id);
  },
};

module.exports = utilisateurService;
