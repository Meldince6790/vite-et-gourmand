const Theme = require("../models/theme.model");

const themeService = {
  async getAllThemes() {
    return await Theme.findAll();
  },

  async getThemeById(id) {
    const theme = await Theme.findById(id);

    if (!theme) {
      throw new Error("Thème introuvable.");
    }

    return theme;
  },

  async createTheme(theme) {
    const themeExiste = await Theme.findByLibelle(theme.libelle);

    if (themeExiste) {
      throw new Error("Ce thème existe déjà.");
    }

    return await Theme.create(theme);
  },

  async updateTheme(id, theme) {
    const themeExiste = await Theme.exists(id);

    if (!themeExiste) {
      throw new Error("Thème introuvable.");
    }

    const doublon = await Theme.findByLibelle(theme.libelle);

    if (doublon) {
      throw new Error("Ce thème existe déjà.");
    }

    return await Theme.update(id, theme);
  },

  async deleteTheme(id) {
    const themeExiste = await Theme.exists(id);

    if (!themeExiste) {
      throw new Error("Thème introuvable.");
    }

    try {
      return await Theme.delete(id);
    } catch (error) {
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        throw new Error(
          "Impossible de supprimer ce thème car il est utilisé par un ou plusieurs menus.",
        );
      }

      throw error;
    }
  },
};

module.exports = themeService;
