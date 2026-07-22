const horaireService = require("../services/horaire.service");

function handleError(res, error, defaultMessage) {
  console.error(error);

  if (error.message.includes("introuvable")) {
    return res.status(404).json({
      message: error.message,
    });
  }

  if (error.message.includes("obligatoire") || error.message.includes("doit")) {
    return res.status(400).json({
      message: error.message,
    });
  }

  return res.status(400).json({
    message: error.message || defaultMessage,
  });
}

const horaireController = {
  async getAllHoraires(req, res) {
    try {
      const horaires = await horaireService.getAllHoraires();

      res.status(200).json(horaires);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération des horaires.",
      );
    }
  },

  async getHoraireById(req, res) {
    try {
      const horaire = await horaireService.getHoraireById(req.params.id);

      res.status(200).json(horaire);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération de l'horaire.",
      );
    }
  },

  async createHoraire(req, res) {
    try {
      const horaireId = await horaireService.createHoraire(req.body);

      res.status(201).json({
        message: "Horaire créé avec succès.",
        horaire_id: horaireId,
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la création de l'horaire.",
      );
    }
  },

  async updateHoraire(req, res) {
    try {
      await horaireService.updateHoraire(req.params.id, req.body);

      res.status(200).json({
        message: "Horaire modifié avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la modification de l'horaire.",
      );
    }
  },

  async deleteHoraire(req, res) {
    try {
      await horaireService.deleteHoraire(req.params.id);

      res.status(200).json({
        message: "Horaire supprimé avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la suppression de l'horaire.",
      );
    }
  },
};

module.exports = horaireController;
