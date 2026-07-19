const themeService = require("../services/theme.service");

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

const themeController = {
  async getAllThemes(req, res) {
    try {
      const themes = await themeService.getAllThemes();

      res.status(200).json(themes);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération des thèmes.",
      );
    }
  },

  async getThemeById(req, res) {
    try {
      const theme = await themeService.getThemeById(req.params.id);

      res.status(200).json(theme);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération du thème.",
      );
    }
  },

  async createTheme(req, res) {
    try {
      const themeId = await themeService.createTheme(req.body);

      res.status(201).json({
        message: "Thème créé avec succès.",
        theme_id: themeId,
      });
    } catch (error) {
      return handleError(res, error, "Erreur lors de la création du thème.");
    }
  },

  async updateTheme(req, res) {
    try {
      await themeService.updateTheme(req.params.id, req.body);

      res.status(200).json({
        message: "Thème modifié avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la modification du thème.",
      );
    }
  },

  async deleteTheme(req, res) {
    try {
      await themeService.deleteTheme(req.params.id);

      res.status(200).json({
        message: "Thème supprimé avec succès.",
      });
    } catch (error) {
      return handleError(res, error, "Erreur lors de la suppression du thème.");
    }
  },
};

module.exports = themeController;
