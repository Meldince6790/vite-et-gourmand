const bcrypt = require("bcrypt");
const Utilisateur = require("../models/utilisateur.model");

function validatePassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 10 &&
    password.length <= 255 &&
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

    const client = {
      email: utilisateur.email,
      password: passwordHash,
      nom: utilisateur.nom || null,
      prenom: utilisateur.prenom || null,
      telephone: utilisateur.telephone || null,
      ville: utilisateur.ville || null,
      pays: utilisateur.pays || null,
      adresse_postale: utilisateur.adresse_postale || null,
      role_id: 1,
      actif: true,
    };

    return await Utilisateur.create(client);
  },

  async createEmploye(utilisateur) {
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

    const employe = {
      email: utilisateur.email,
      password: passwordHash,
      nom: utilisateur.nom || null,
      prenom: utilisateur.prenom || null,
      telephone: utilisateur.telephone || null,
      ville: utilisateur.ville || null,
      pays: utilisateur.pays || null,
      adresse_postale: utilisateur.adresse_postale || null,
      role_id: 2,
      actif: true,
    };

    return await Utilisateur.create(employe);
  },

  async updateActif(id, actif) {
    const utilisateur = await Utilisateur.findById(id);

    if (!utilisateur) {
      throw new Error("Utilisateur introuvable.");
    }

    if (utilisateur.role_id !== 2) {
      throw new Error(
        "Seuls les comptes employés peuvent être activés ou désactivés.",
      );
    }

    if (utilisateur.actif === actif) {
      throw new Error("Le compte possède déjà ce statut.");
    }

    await Utilisateur.updateActif(id, actif);

    return await Utilisateur.findById(id);
  },

  async updateUtilisateur(id, donnees) {
    const utilisateurExistant = await Utilisateur.findById(id);

    if (!utilisateurExistant) {
      throw new Error("Utilisateur introuvable.");
    }

    const utilisateurModifie = {
      nom: donnees.nom,
      prenom: donnees.prenom,
      telephone: donnees.telephone,
      ville: donnees.ville,
      pays: donnees.pays,
      adresse_postale: donnees.adresse_postale,
    };

    await Utilisateur.update(id, utilisateurModifie);

    return await Utilisateur.findById(id);
  },
};

module.exports = utilisateurService;
