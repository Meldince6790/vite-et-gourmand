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

      if (!utilisateur) {
        return res.status(404).json({
          message: "Utilisateur introuvable.",
        });
      }

      res.status(200).json(utilisateur);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Erreur lors de la récupération de l'utilisateur.",
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

      res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur.",
      });
    }
  },
};

module.exports = utilisateurController;
