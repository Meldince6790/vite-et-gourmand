const utilisateurService = require("../services/utilisateur.service");
const { toClientErrorMessage } = require("../utils/safeErrorMessage");

const utilisateurController = {
  async getAll(req, res) {
    try {
      const utilisateurs = await utilisateurService.getAllUtilisateurs();

      res.status(200).json(utilisateurs);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Erreur lors de la récupération des utilisateurs.",
      });
    }
  },

  async getById(req, res) {
    try {
      const utilisateur = await utilisateurService.getUtilisateurById(
        req.params.id,
      );

      res.status(200).json(utilisateur);
    } catch (error) {
      console.error(error);

      if (error.message === "Utilisateur introuvable.") {
        return res.status(404).json({
          message: error.message,
        });
      }

      res.status(500).json({
        message: "Erreur lors de la récupération de l'utilisateur.",
      });
    }
  },

  async getMe(req, res) {
    try {
      const utilisateur = await utilisateurService.getUtilisateurById(
        req.user.utilisateur_id,
      );

      res.status(200).json(utilisateur);
    } catch (error) {
      console.error(error);

      if (error.message === "Utilisateur introuvable.") {
        return res.status(404).json({
          message: error.message,
        });
      }

      res.status(500).json({
        message: "Erreur lors de la récupération du profil utilisateur.",
      });
    }
  },

  async updateMe(req, res) {
    try {
      const utilisateur = await utilisateurService.updateUtilisateur(
        req.user.utilisateur_id,
        req.body,
      );

      res.status(200).json({
        message: "Profil mis à jour avec succès.",
        utilisateur,
      });
    } catch (error) {
      console.error(error);

      if (error.message === "Utilisateur introuvable.") {
        return res.status(404).json({
          message: error.message,
        });
      }

      res.status(400).json({
        message: toClientErrorMessage(
          error,
          "Erreur lors de la mise à jour du profil.",
        ),
      });
    }
  },

  async create(req, res) {
    try {
      const id = await utilisateurService.createUtilisateur(req.body);

      res.status(201).json({
        message: "Utilisateur créé avec succès.",
        utilisateur_id: id,
      });
    } catch (error) {
      console.error(error);

      if (error.message === "Cette adresse e-mail est déjà utilisée.") {
        return res.status(409).json({
          message: error.message,
        });
      }

      const erreursValidation = new Set([
        "Le nom est obligatoire.",
        "Le prénom est obligatoire.",
        "L'adresse e-mail est obligatoire.",
        "Le mot de passe est obligatoire.",
        "Le mot de passe ne respecte pas les règles de sécurité.",
      ]);

      if (erreursValidation.has(error.message)) {
        return res.status(400).json({
          message: error.message,
        });
      }

      res.status(500).json({
        message: "Erreur interne du serveur.",
      });
    }
  },

  // Création d'un compte employé par un administrateur
  async createEmploye(req, res) {
    try {
      const id = await utilisateurService.createEmploye(req.body);

      res.status(201).json({
        message: "Compte employé créé avec succès.",
        utilisateur_id: id,
      });
    } catch (error) {
      console.error(error);

      if (error.message === "Cette adresse e-mail est déjà utilisée.") {
        return res.status(409).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "Le mot de passe ne respecte pas les règles de sécurité."
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }

      res.status(500).json({
        message: "Erreur lors de la création du compte employé.",
      });
    }
  },

  // Activation / désactivation d'un compte employé
  async updateActif(req, res) {
    try {
      const { actif } = req.body;

      if (typeof actif !== "boolean") {
        return res.status(400).json({
          message: "La valeur actif doit être un booléen.",
        });
      }

      await utilisateurService.updateActif(req.params.id, actif);

      res.status(200).json({
        message: "Statut du compte modifié avec succès.",
      });
    } catch (error) {
      console.error(error);

      if (error.message === "Utilisateur introuvable.") {
        return res.status(404).json({
          message: error.message,
        });
      }

      res.status(400).json({
        message: toClientErrorMessage(
          error,
          "Erreur lors de la modification du statut du compte.",
        ),
      });
    }
  },
};

module.exports = utilisateurController;
