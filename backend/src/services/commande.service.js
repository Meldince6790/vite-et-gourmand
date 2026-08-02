const database = require("../config/database");
const CommandeRepository = require("../repositories/CommandeRepository");
const Menu = require("../models/menu.model");
const statistiqueServiceModule = require("./statistique.service");
const Commande = require("../domain/Commande");

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

class CommandeService {
  constructor({
    commandeRepository,
    menuModel,
    statistiqueService,
    CommandeDomain,
  }) {
    this.commandeRepository = commandeRepository;
    this.menuModel = menuModel;
    this.statistiqueService = statistiqueService;
    this.Commande = CommandeDomain;
  }

  async getAllCommandes() {
    return await this.commandeRepository.findAll();
  }

  async getCommandeById(id, user) {
    const commande = await this.commandeRepository.findById(id);

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
  }

  async getCommandesByUtilisateurId(utilisateurId) {
    return await this.commandeRepository.findByUtilisateurId(utilisateurId);
  }

  async createCommande(commande) {
    const menu = await this.menuModel.findById(commande.menu_id);

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

    const stockDisponible = await this.menuModel.hasStock(
      commande.menu_id,
      commande.nombre_personne,
    );

    if (!stockDisponible) {
      throw new Error(
        "Le stock disponible est insuffisant pour cette commande.",
      );
    }

    const nouvelleCommande = this.Commande.initialiserCreation(commande, menu);

    const commandeId = await this.commandeRepository.create(nouvelleCommande);

    await this.menuModel.decreaseStock(
      nouvelleCommande.menu_id,
      nouvelleCommande.nombre_personne,
    );

    // Mise à jour des statistiques MongoDB
    try {
      await this.statistiqueService.updateStatistiqueCommande(
        {
          ...nouvelleCommande,
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
  }

  async getCommandeClient(id, utilisateurId) {
    const commande = await this.commandeRepository.findById(id);

    if (!commande) {
      throw new Error("Commande introuvable.");
    }

    if (commande.utilisateur_id !== utilisateurId) {
      throw new Error("Cette commande ne vous appartient pas.");
    }

    return commande;
  }

  async updateStatut(id, statut) {
    const commandeExiste = await this.commandeRepository.exists(id);

    if (!commandeExiste) {
      throw new Error("Commande introuvable.");
    }

    if (!STATUTS_AUTORISES.has(statut)) {
      throw new Error("Statut de commande invalide.");
    }

    return await this.commandeRepository.updateStatut(id, statut);
  }

  async annulerCommande(id, data) {
    const commande = await this.commandeRepository.findById(id);

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

    const result = await this.commandeRepository.updateAnnulation(id, {
      mode_contact_annulation: data.mode_contact_annulation,
      motif_annulation: data.motif_annulation,
      date_annulation: new Date(),
    });

    await this.menuModel.increaseStock(
      commande.menu_id,
      commande.nombre_personne,
    );

    return result;
  }

  async annulerCommandeClient(id, utilisateurId) {
    const commandeExistante = await this.getCommandeClient(id, utilisateurId);
    const commandeMetier = new this.Commande(commandeExistante);

    if (!commandeMetier.peutEtreAnnuleeParClient()) {
      throw new Error("Cette commande ne peut plus être annulée.");
    }

    const result = await this.commandeRepository.updateStatut(id, "Annulée");

    await this.menuModel.increaseStock(
      commandeExistante.menu_id,
      commandeExistante.nombre_personne,
    );

    return result;
  }

  async updateCommande(id, utilisateurId, data) {
    const commandeExistante = await this.getCommandeClient(id, utilisateurId);
    const commandeMetier = new this.Commande(commandeExistante);

    if (!commandeMetier.peutEtreModifieeParClient()) {
      throw new Error("Cette commande ne peut plus être modifiée.");
    }

    const menu = await this.menuModel.findById(commandeExistante.menu_id);

    if (!menu) {
      throw new Error("Menu introuvable.");
    }

    const nombrePersonne =
      data.nombre_personne ?? commandeExistante.nombre_personne;

    if (nombrePersonne < menu.nombre_personne_minimum) {
      throw new Error(
        "Le nombre de personnes est inférieur au minimum requis.",
      );
    }

    return await this.commandeRepository.update(id, {
      date_prestation:
        data.date_prestation ?? commandeExistante.date_prestation,

      heure_livraison:
        data.heure_livraison ?? commandeExistante.heure_livraison,

      adresse_livraison:
        data.adresse_livraison ?? commandeExistante.adresse_livraison,

      nombre_personne: nombrePersonne,

      pret_materiel: data.pret_materiel ?? commandeExistante.pret_materiel,

      restitution_materiel:
        data.restitution_materiel ?? commandeExistante.restitution_materiel,

      prix_menu: this.Commande.calculerPrixMenu(menu, nombrePersonne),
    });
  }

  async deleteCommande(id) {
    const commandeExiste = await this.commandeRepository.exists(id);

    if (!commandeExiste) {
      throw new Error("Commande introuvable.");
    }

    return await this.commandeRepository.delete(id);
  }
}

const commandeRepository = new CommandeRepository(database);

const commandeService = new CommandeService({
  commandeRepository,
  menuModel: Menu,
  statistiqueService: statistiqueServiceModule,
  CommandeDomain: Commande,
});

module.exports = commandeService;
module.exports.CommandeService = CommandeService;
