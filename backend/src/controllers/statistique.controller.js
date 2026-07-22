const statistiqueService = require("../services/statistique.service");

const statistiqueController = {
  async getStatistiques(req, res) {
    try {
      const statistiques = await statistiqueService.getStatistiques(req.query);

      res.status(200).json(statistiques);
    } catch (error) {
      console.error("Erreur récupération statistiques :", error);

      res.status(500).json({
        message: "Erreur serveur lors de la récupération des statistiques.",
      });
    }
  },

  async getStatistiquesParMenu(req, res) {
    try {
      const { menu_id } = req.params;

      const statistiques = await statistiqueService.getStatistiques({
        menu_id,
      });

      res.status(200).json(statistiques);
    } catch (error) {
      console.error("Erreur récupération statistiques menu :", error);

      res.status(500).json({
        message:
          "Erreur serveur lors de la récupération des statistiques du menu.",
      });
    }
  },

  // Comparaison des commandes par menu (graphique)
  async getCommandesParMenu(req, res) {
    try {
      const statistiques = await statistiqueService.getCommandesParMenu();

      res.status(200).json(statistiques);
    } catch (error) {
      console.error("Erreur récupération commandes par menu :", error);

      res.status(500).json({
        message:
          "Erreur serveur lors de la récupération des commandes par menu.",
      });
    }
  },

  // Chiffre d'affaires année en cours
  async getChiffreAffairesAnnuel(req, res) {
    try {
      const chiffreAffaires =
        await statistiqueService.getChiffreAffairesAnnuel();

      res.status(200).json(chiffreAffaires);
    } catch (error) {
      console.error("Erreur récupération CA annuel :", error);

      res.status(500).json({
        message:
          "Erreur serveur lors de la récupération du chiffre d'affaires annuel.",
      });
    }
  },

  // Evolution du chiffre d'affaires par période
  async getChiffreAffairesParPeriode(req, res) {
    try {
      const chiffreAffaires =
        await statistiqueService.getChiffreAffairesParPeriode();

      res.status(200).json(chiffreAffaires);
    } catch (error) {
      console.error("Erreur récupération CA par période :", error);

      res.status(500).json({
        message:
          "Erreur serveur lors de la récupération du chiffre d'affaires par période.",
      });
    }
  },

  // Chiffre d'affaires par menu
  async getChiffreAffairesParMenu(req, res) {
    try {
      const chiffreAffaires =
        await statistiqueService.getChiffreAffairesParMenu();

      res.status(200).json(chiffreAffaires);
    } catch (error) {
      console.error("Erreur récupération CA par menu :", error);

      res.status(500).json({
        message:
          "Erreur serveur lors de la récupération du chiffre d'affaires par menu.",
      });
    }
  },

  // Chiffre d'affaires avec filtres combinés
  async getChiffreAffairesFiltre(req, res) {
    try {
      const chiffreAffaires = await statistiqueService.getChiffreAffairesFiltre(
        req.query,
      );

      res.status(200).json(chiffreAffaires);
    } catch (error) {
      console.error("Erreur récupération CA filtré :", error);

      res.status(500).json({
        message:
          "Erreur serveur lors de la récupération du chiffre d'affaires filtré.",
      });
    }
  },
};

module.exports = statistiqueController;
