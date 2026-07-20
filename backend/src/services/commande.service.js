const Commande = require("../models/commande.model");
const Menu = require("../models/menu.model");

const STATUTS_AUTORISES = new Set([
  "En attente",
  "Acceptée",
  "En préparation",
  "En cours de livraison",
  "Livrée",
  "En attente du retour de matériel",
  "Terminée",
  "Annulée",
]);

const commandeService = {
  async getAllCommandes() {
    return await Commande.findAll();
  },

  async getCommandeById(id) {
    const commande = await Commande.findById(id);

    if (!commande) {
      throw new Error("Commande introuvable.");
    }

    return commande;
  },

  async getCommandesByUtilisateurId(utilisateurId) {
    return await Commande.findByUtilisateurId(utilisateurId);
  },

  async createCommande(commande) {
    const menu = await Menu.findById(commande.menu_id);

    if (!menu) {
      throw new Error("Menu introuvable.");
    }

    if (!commande.date_prestation) {
      throw new Error("La date de prestation est obligatoire.");
    }

    if (!commande.heure_livraison) {
      throw new Error("L'heure de livraison est obligatoire.");
    }

    if (!commande.adresse_livraison) {
      throw new Error("L'adresse de livraison est obligatoire.");
    }

    if (!commande.nombre_personne || commande.nombre_personne <= 0) {
      throw new Error("Le nombre de personnes doit être supérieur à zéro.");
    }

    if (commande.nombre_personne < menu.nombre_personne_minimum) {
      throw new Error(
        "Le nombre de personnes est inférieur au minimum requis pour ce menu.",
      );
    }

    let prixMenu =
      Number(menu.prix_par_personne) * Number(commande.nombre_personne);

    // Réduction de 10% si la commande dépasse de 5 personnes le minimum requis
    if (commande.nombre_personne >= Number(menu.nombre_personne_minimum) + 5) {
      prixMenu *= 0.9;
    }

    commande.prix_menu = Number(prixMenu.toFixed(2));

    let prixLivraison = 0;

    if (commande.distance_km > 0) {
      prixLivraison = 5 + 0.59 * commande.distance_km;
    }

    commande.prix_livraison = Number(prixLivraison.toFixed(2));

    commande.numero_commande = `CMD-${Date.now()}`;
    commande.date_commande = new Date();

    commande.statut = "En attente";

    if (commande.pret_materiel === undefined) {
      commande.pret_materiel = false;
    }

    if (commande.restitution_materiel === undefined) {
      commande.restitution_materiel = false;
    }

    return await Commande.create(commande);
  },

  async updateStatut(id, statut) {
    const commandeExiste = await Commande.exists(id);

    if (!commandeExiste) {
      throw new Error("Commande introuvable.");
    }

    if (!STATUTS_AUTORISES.has(statut)) {
      throw new Error("Statut de commande invalide.");
    }

    return await Commande.updateStatut(id, statut);
  },

  async deleteCommande(id) {
    const commandeExiste = await Commande.exists(id);

    if (!commandeExiste) {
      throw new Error("Commande introuvable.");
    }

    return await Commande.delete(id);
  },
};

module.exports = commandeService;
