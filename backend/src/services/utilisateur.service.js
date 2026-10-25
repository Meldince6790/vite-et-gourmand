const bcrypt = require("bcrypt");
const Utilisateur = require("../models/utilisateur.model");
const emailServiceModule = require("./email.service");

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

function requireText(value, message) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(message);
  }

  return value.trim();
}

function createUtilisateurService({
  emailService = emailServiceModule,
  logger = console,
} = {}) {
  return {
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
      const nom = requireText(utilisateur.nom, "Le nom est obligatoire.");
      const prenom = requireText(
        utilisateur.prenom,
        "Le prénom est obligatoire.",
      );
      const email = requireText(
        utilisateur.email,
        "L'adresse e-mail est obligatoire.",
      );

      if (
        typeof utilisateur.password !== "string" ||
        utilisateur.password.length === 0
      ) {
        throw new Error("Le mot de passe est obligatoire.");
      }

      const utilisateurExistant = await Utilisateur.findByEmail(email);

      if (utilisateurExistant) {
        throw new Error("Cette adresse e-mail est déjà utilisée.");
      }

      if (!validatePassword(utilisateur.password)) {
        throw new Error(
          "Le mot de passe ne respecte pas les règles de sécurité.",
        );
      }

      const passwordHash = await bcrypt.hash(utilisateur.password, 10);

      // role_id du body volontairement ignoré : compte client uniquement
      const client = {
        email,
        password: passwordHash,
        nom,
        prenom,
        telephone: utilisateur.telephone || null,
        ville: utilisateur.ville || null,
        pays: utilisateur.pays || null,
        adresse_postale: utilisateur.adresse_postale || null,
        role_id: 1,
        actif: true,
      };

      const id = await Utilisateur.create(client);

      try {
        await emailService.sendWelcomeEmail({
          to: email,
          prenom,
          nom,
        });
      } catch (error) {
        logger.error(
          "Erreur lors de l'envoi de l'e-mail de bienvenue :",
          error,
        );
      }

      return id;
    },

    async createEmploye(utilisateur) {
      if (!utilisateur.email || !utilisateur.password) {
        throw new Error(
          "L'adresse e-mail et le mot de passe sont obligatoires.",
        );
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
}

const utilisateurService = createUtilisateurService();

module.exports = utilisateurService;
module.exports.createUtilisateurService = createUtilisateurService;
