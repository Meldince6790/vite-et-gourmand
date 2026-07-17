const Commande = require("../models/commande.model");
const Menu = require("../models/menu.model");

const commandeService = {
  async getAllCommandes() {
    return await Commande.findAll();
  },

  async getCommandeById(id) {
    return await Commande.findById(id);
  },

  async createCommande(commande) {
    const menu = await Menu.findById(commande.menu_id);

    if (!menu) {
      throw new Error("Menu introuvable.");
    }

    if (commande.nombre_personne < menu.nombre_personne_minimum) {
      throw new Error(
        "Le nombre de personnes est inférieur au minimum requis pour ce menu.",
      );
    }

    let prixMenu = menu.prix_par_personne * commande.nombre_personne;

    if (commande.nombre_personne >= menu.nombre_personne_minimum + 5) {
      prixMenu = Number(prixMenu.toFixed(2));
    }

    commande.prix_menu = prixMenu;

    let prixLivraison = 0;

    if (commande.distance_km > 0) {
      prixLivraison = 5 + 0.59 * commande.distance_km;
    }

    commande.prix_livraison = prixLivraison;

    return await Commande.create(commande);
  },

  async updateStatut(id, statut) {
    return await Commande.updateStatut(id, statut);
  },
};

module.exports = commandeService;
