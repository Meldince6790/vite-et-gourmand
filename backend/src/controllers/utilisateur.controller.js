const utilisateurService = require("../services/utilisateur.service");

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
        message: error.message || "Erreur lors de la mise à jour du profil.",
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

      if (
        error.message ===
        "Le mot de passe ne respecte pas les règles de sécurité."
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }

      res.status(500).json({
        message: "Erreur interne du serveur.",
      });
    }
  },
};

module.exports = utilisateurController;
