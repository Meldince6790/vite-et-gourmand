const Commande = require("../models/commande.model");
const Menu = require("../models/menu.model");
const statistiqueService = require("./statistique.service");

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

const MODES_CONTACT_AUTORISES = new Set(["Téléphone", "Mail"]);

const commandeService = {
  async getAllCommandes() {
    return await Commande.findAll();
  },

  async getCommandeById(id, user) {
    const commande = await Commande.findById(id);

    if (!commande) {
      throw new Error("Commande introuvable.");
    }

    const roleId = Number(user.role_id);

    if (roleId === 2 || roleId === 3) {
      return commande;
    }

    if (
      roleId === 1 &&
      Number(commande.utilisateur_id) === Number(user.utilisateur_id)
    ) {
      return commande;
    }

    throw new Error("Commande introuvable.");
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

    const stockDisponible = await Menu.hasStock(
      commande.menu_id,
      commande.nombre_personne,
    );

    if (!stockDisponible) {
      throw new Error(
        "Le stock disponible est insuffisant pour cette commande.",
      );
    }

    let prixMenu =
      Number(menu.prix_par_personne) * Number(commande.nombre_personne);

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

    const commandeId = await Commande.create(commande);

    await Menu.decreaseStock(commande.menu_id, commande.nombre_personne);

    // Mise à jour des statistiques MongoDB
    try {
      await statistiqueService.updateStatistiqueCommande(
        {
          ...commande,
          commande_id: commandeId,
        },
        menu,
      );
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des statistiques MongoDB :",
        error,
      );
    }

    return commandeId;
  },

  async getCommandeClient(id, utilisateurId) {
    const commande = await Commande.findById(id);

    if (!commande) {
      throw new Error("Commande introuvable.");
    }

    if (commande.utilisateur_id !== utilisateurId) {
      throw new Error("Cette commande ne vous appartient pas.");
    }

    return commande;
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

  async annulerCommande(id, data) {
    const commande = await Commande.findById(id);

    if (!commande) {
      throw new Error("Commande introuvable.");
    }

    if (!data.mode_contact_annulation) {
      throw new Error("Le mode de contact est obligatoire.");
    }

    if (!MODES_CONTACT_AUTORISES.has(data.mode_contact_annulation)) {
      throw new Error("Le mode de contact doit être Téléphone ou Mail.");
    }

    if (!data.motif_annulation) {
      throw new Error("Le motif d'annulation est obligatoire.");
    }

    const result = await Commande.updateAnnulation(id, {
      mode_contact_annulation: data.mode_contact_annulation,
      motif_annulation: data.motif_annulation,
      date_annulation: new Date(),
    });

    await Menu.increaseStock(commande.menu_id, commande.nombre_personne);

    return result;
  },

  async annulerCommandeClient(id, utilisateurId) {
    const commande = await this.getCommandeClient(id, utilisateurId);

    if (commande.statut !== "En attente") {
      throw new Error("Cette commande ne peut plus être annulée.");
    }

    const result = await Commande.updateStatut(id, "Annulée");

    await Menu.increaseStock(commande.menu_id, commande.nombre_personne);

    return result;
  },

  async updateCommande(id, utilisateurId, data) {
    const commande = await this.getCommandeClient(id, utilisateurId);

    if (commande.statut !== "En attente") {
      throw new Error("Cette commande ne peut plus être modifiée.");
    }

    const menu = await Menu.findById(commande.menu_id);

    if (!menu) {
      throw new Error("Menu introuvable.");
    }

    const nombrePersonne = data.nombre_personne ?? commande.nombre_personne;

    if (nombrePersonne < menu.nombre_personne_minimum) {
      throw new Error(
        "Le nombre de personnes est inférieur au minimum requis.",
      );
    }

    let prixMenu = Number(menu.prix_par_personne) * Number(nombrePersonne);

    if (nombrePersonne >= Number(menu.nombre_personne_minimum) + 5) {
      prixMenu *= 0.9;
    }

    return await Commande.update(id, {
      date_prestation: data.date_prestation ?? commande.date_prestation,

      heure_livraison: data.heure_livraison ?? commande.heure_livraison,

      adresse_livraison: data.adresse_livraison ?? commande.adresse_livraison,

      nombre_personne: nombrePersonne,

      pret_materiel: data.pret_materiel ?? commande.pret_materiel,

      restitution_materiel:
        data.restitution_materiel ?? commande.restitution_materiel,

      prix_menu: Number(prixMenu.toFixed(2)),
    });
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
