const regimeService = require("../services/regime.service");

function handleError(res, error, defaultMessage) {
  console.error(error);

  if (error.message.includes("introuvable")) {
    return res.status(404).json({
      message: error.message,
    });
  }

  if (
    error.message.includes("déjà") ||
    error.message.includes("existe") ||
    error.message.includes("utilisé")
  ) {
    return res.status(409).json({
      message: error.message,
    });
  }

  return res.status(400).json({
    message: error.message || defaultMessage,
  });
}

const regimeController = {
  async getAllRegimes(req, res) {
    try {
      const regimes = await regimeService.getAllRegimes();

      res.status(200).json(regimes);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération des régimes.",
      );
    }
  },

  async getRegimeById(req, res) {
    try {
      const regime = await regimeService.getRegimeById(req.params.id);

      res.status(200).json(regime);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération du régime.",
      );
    }
  },

  async createRegime(req, res) {
    try {
      const regimeId = await regimeService.createRegime(req.body);

      res.status(201).json({
        message: "Régime créé avec succès.",
        regime_id: regimeId,
      });
    } catch (error) {
      return handleError(res, error, "Erreur lors de la création du régime.");
    }
  },

  async updateRegime(req, res) {
    try {
      await regimeService.updateRegime(req.params.id, req.body);

      res.status(200).json({
        message: "Régime modifié avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la modification du régime.",
      );
    }
  },

  async deleteRegime(req, res) {
    try {
      await regimeService.deleteRegime(req.params.id);

      res.status(200).json({
        message: "Régime supprimé avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la suppression du régime.",
      );
    }
  },
};

module.exports = regimeController;
