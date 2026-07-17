const commandeService = require("../services/commande.service");

const commandeController = {
  async getAllCommandes(req, res) {
    try {
      const commandes = await commandeService.getAllCommandes();
      res.json(commandes);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération des commandes.",
        error: error.message,
      });
    }
  },

  async getCommandeById(req, res) {
    try {
      const commande = await commandeService.getCommandeById(req.params.id);
      res.json(commande);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération de la commande.",
        error: error.message,
      });
    }
  },

  async createCommande(req, res) {
    try {
      const commandeId = await commandeService.createCommande(req.body);

      res.status(201).json({
        message: "Commande créée avec succès.",
        commande_id: commandeId,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la création de la commande.",
        error: error.message,
      });
    }
  },

  async updateStatut(req, res) {
    try {
      const result = await commandeService.updateStatut(
        req.params.id,
        req.body.statut,
      );

      if (result === 0) {
        return res.status(404).json({
          message: "Commande introuvable.",
        });
      }

      res.json({
        message: "Statut de la commande mis à jour avec succès.",
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la mise à jour du statut.",
        error: error.message,
      });
    }
  },
};

module.exports = commandeController;
