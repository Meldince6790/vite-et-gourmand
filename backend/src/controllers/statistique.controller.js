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

  // Chiffre d'affaires avec filtres
  async getChiffreAffaires(req, res) {
    try {
      const chiffreAffaires = await statistiqueService.getChiffreAffaires(
        req.query,
      );

      res.status(200).json(chiffreAffaires);
    } catch (error) {
      console.error("Erreur récupération chiffre affaires :", error);

      res.status(500).json({
        message: "Erreur serveur lors du calcul du chiffre d'affaires.",
      });
    }
  },
};

module.exports = statistiqueController;
