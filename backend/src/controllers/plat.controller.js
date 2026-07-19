const platService = require("../services/plat.service");

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
    error.message.includes("associé") ||
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

const platController = {
  async getAllPlats(req, res) {
    try {
      const plats = await platService.getAllPlats();

      res.status(200).json(plats);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération des plats.",
      );
    }
  },

  async getPlatById(req, res) {
    try {
      const plat = await platService.getPlatById(req.params.id);

      res.status(200).json(plat);
    } catch (error) {
      return handleError(res, error, "Erreur lors de la récupération du plat.");
    }
  },

  async createPlat(req, res) {
    try {
      const platId = await platService.createPlat(req.body);

      res.status(201).json({
        message: "Plat créé avec succès.",
        plat_id: platId,
      });
    } catch (error) {
      return handleError(res, error, "Erreur lors de la création du plat.");
    }
  },

  async updatePlat(req, res) {
    try {
      await platService.updatePlat(req.params.id, req.body);

      res.status(200).json({
        message: "Plat modifié avec succès.",
      });
    } catch (error) {
      return handleError(res, error, "Erreur lors de la modification du plat.");
    }
  },

  async deletePlat(req, res) {
    try {
      await platService.deletePlat(req.params.id);

      res.status(200).json({
        message: "Plat supprimé avec succès.",
      });
    } catch (error) {
      return handleError(res, error, "Erreur lors de la suppression du plat.");
    }
  },

  async getMenusByPlat(req, res) {
    try {
      const menus = await platService.getMenusByPlatId(req.params.id);

      res.status(200).json(menus);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération des menus du plat.",
      );
    }
  },

  async getAllergenesByPlat(req, res) {
    try {
      const allergenes = await platService.getAllergenesByPlatId(req.params.id);

      res.status(200).json(allergenes);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération des allergènes du plat.",
      );
    }
  },

  async addAllergeneToPlat(req, res) {
    try {
      await platService.addAllergeneToPlat(
        req.params.id,
        req.body.allergene_id,
      );

      res.status(201).json({
        message: "Allergène ajouté au plat avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de l'ajout de l'allergène au plat.",
      );
    }
  },

  async removeAllergeneFromPlat(req, res) {
    try {
      await platService.removeAllergeneFromPlat(
        req.params.id,
        req.params.allergeneId,
      );

      res.status(200).json({
        message: "Allergène retiré du plat avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors du retrait de l'allergène du plat.",
      );
    }
  },
};

module.exports = platController;
