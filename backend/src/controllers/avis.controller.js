const avisService = require("../services/avis.service");
const { toClientErrorMessage } = require("../utils/safeErrorMessage");

function isStaffUser(user) {
  const roleId = Number(user?.role_id);
  return roleId === 2 || roleId === 3;
}

const avisController = {
  async getAll(req, res) {
    try {
      const avis = await avisService.getAll({
        publicOnly: !isStaffUser(req.user),
      });

      res.status(200).json(avis);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Erreur lors de la récupération des avis.",
      });
    }
  },

  async getById(req, res) {
    try {
      const avis = await avisService.getById(req.params.id, {
        publicOnly: !isStaffUser(req.user),
      });

      if (!avis) {
        return res.status(404).json({
          message: "Avis introuvable.",
        });
      }

      res.status(200).json(avis);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Erreur lors de la récupération de l'avis.",
      });
    }
  },

  async create(req, res) {
    try {
      const avis = {
        ...req.body,
        utilisateur_id: req.user.utilisateur_id,
      };

      const id = await avisService.create(avis);

      res.status(201).json({
        message: "Avis créé avec succès.",
        avis_id: id,
      });
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: toClientErrorMessage(
          error,
          "Erreur lors de la création de l'avis.",
        ),
      });
    }
  },

  async update(req, res) {
    try {
      const result = await avisService.update(req.params.id, req.body);

      if (!result) {
        return res.status(404).json({
          message: "Avis introuvable.",
        });
      }

      res.status(200).json({
        message: "Avis modifié avec succès.",
      });
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: toClientErrorMessage(
          error,
          "Erreur lors de la modification de l'avis.",
        ),
      });
    }
  },

  async delete(req, res) {
    try {
      const result = await avisService.delete(req.params.id);

      if (!result) {
        return res.status(404).json({
          message: "Avis introuvable.",
        });
      }

      res.status(200).json({
        message: "Avis supprimé avec succès.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Erreur lors de la suppression de l'avis.",
      });
    }
  },
};

module.exports = avisController;
