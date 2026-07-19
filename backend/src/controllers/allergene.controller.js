const allergeneService = require("../services/allergene.service");

function handleError(res, error, defaultMessage) {
  console.error(error);

  if (error.message.includes("introuvable")) {
    return res.status(404).json({
      message: error.message,
    });
  }

  if (error.message.includes("existe déjà")) {
    return res.status(409).json({
      message: error.message,
    });
  }

  return res.status(400).json({
    message: error.message || defaultMessage,
  });
}

const allergeneController = {
  async getAllAllergenes(req, res) {
    try {
      const allergenes = await allergeneService.getAllAllergenes();

      res.status(200).json(allergenes);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération des allergènes.",
      );
    }
  },

  async getAllergeneById(req, res) {
    try {
      const allergene = await allergeneService.getAllergeneById(req.params.id);

      res.status(200).json(allergene);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération de l'allergène.",
      );
    }
  },

  async createAllergene(req, res) {
    try {
      const allergeneId = await allergeneService.createAllergene(req.body);

      res.status(201).json({
        message: "Allergène créé avec succès.",
        allergene_id: allergeneId,
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la création de l'allergène.",
      );
    }
  },

  async updateAllergene(req, res) {
    try {
      await allergeneService.updateAllergene(req.params.id, req.body);

      res.status(200).json({
        message: "Allergène modifié avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la modification de l'allergène.",
      );
    }
  },

  async deleteAllergene(req, res) {
    try {
      await allergeneService.deleteAllergene(req.params.id);

      res.status(200).json({
        message: "Allergène supprimé avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la suppression de l'allergène.",
      );
    }
  },
};

module.exports = allergeneController;
