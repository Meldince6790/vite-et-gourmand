const commandeService = require("../services/commande.service");

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
    error.message.includes("invalide")
  ) {
    return res.status(409).json({
      message: error.message,
    });
  }

  return res.status(400).json({
    message: error.message || defaultMessage,
  });
}

const commandeController = {
  async getAllCommandes(req, res) {
    try {
      const commandes = await commandeService.getAllCommandes();

      res.status(200).json(commandes);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération des commandes.",
      );
    }
  },

  async getCommandeById(req, res) {
    try {
      const commande = await commandeService.getCommandeById(req.params.id);

      res.status(200).json(commande);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération de la commande.",
      );
    }
  },

  async getCommandesByUtilisateur(req, res) {
    try {
      const commandes = await commandeService.getCommandesByUtilisateurId(
        req.params.id,
      );

      res.status(200).json(commandes);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération des commandes utilisateur.",
      );
    }
  },

  async getMesCommandes(req, res) {
    try {
      const commandes = await commandeService.getCommandesByUtilisateurId(
        req.user.utilisateur_id,
      );

      res.status(200).json(commandes);
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la récupération de vos commandes.",
      );
    }
  },

  async createCommande(req, res) {
    try {
      const commande = {
        ...req.body,
        utilisateur_id: req.user.utilisateur_id,
      };

      const commandeId = await commandeService.createCommande(commande);

      res.status(201).json({
        message: "Commande créée avec succès.",
        commande_id: commandeId,
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la création de la commande.",
      );
    }
  },

  async updateCommandeClient(req, res) {
    try {
      await commandeService.updateCommande(
        req.params.id,
        req.user.utilisateur_id,
        req.body,
      );

      res.status(200).json({
        message: "Commande modifiée avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la modification de la commande.",
      );
    }
  },

  async annulerCommandeClient(req, res) {
    try {
      await commandeService.annulerCommandeClient(
        req.params.id,
        req.user.utilisateur_id,
      );

      res.status(200).json({
        message: "Commande annulée avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de l'annulation de la commande.",
      );
    }
  },

  async updateStatut(req, res) {
    try {
      await commandeService.updateStatut(req.params.id, req.body.statut);

      res.status(200).json({
        message: "Statut de la commande mis à jour avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la mise à jour du statut.",
      );
    }
  },

  async annulerCommande(req, res) {
    try {
      await commandeService.annulerCommande(req.params.id, req.body);

      res.status(200).json({
        message: "Commande annulée avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de l'annulation de la commande.",
      );
    }
  },

  async deleteCommande(req, res) {
    try {
      await commandeService.deleteCommande(req.params.id);

      res.status(200).json({
        message: "Commande supprimée avec succès.",
      });
    } catch (error) {
      return handleError(
        res,
        error,
        "Erreur lors de la suppression de la commande.",
      );
    }
  },
};

module.exports = commandeController;
