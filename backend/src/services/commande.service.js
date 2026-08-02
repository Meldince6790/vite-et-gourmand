const database = require("../config/database");
const CommandeRepository = require("../repositories/CommandeRepository");
const Menu = require("../models/menu.model");
const Utilisateur = require("../models/utilisateur.model");
const statistiqueServiceModule = require("./statistique.service");
const emailServiceModule = require("./email.service");
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
    database,
    emailService,
    utilisateurModel,
    logger = console,
  }) {
    this.commandeRepository = commandeRepository;
    this.menuModel = menuModel;
    this.statistiqueService = statistiqueService;
    this.Commande = CommandeDomain;
    this.database = database;
    this.emailService = emailService;
    this.utilisateurModel = utilisateurModel;
    this.logger = logger;
  }

  async getClientPourEmail(utilisateurId) {
    const utilisateur = await this.utilisateurModel.findById(utilisateurId);

    if (!utilisateur || !utilisateur.email) {
      return null;
    }

    return utilisateur;
  }

  async envoyerEmailAnnulation(commande) {
    try {
      const client = await this.getClientPourEmail(commande.utilisateur_id);

      if (!client) {
        return;
      }

      await this.emailService.sendOrderCancellationEmail({
        to: client.email,
        prenom: client.prenom,
        commande: {
          ...commande,
          statut: "Annulée",
        },
      });
    } catch (error) {
      this.logger.error(
        "Erreur lors de l'envoi de l'e-mail d'annulation de commande :",
        error,
      );
    }
  }

  async withTransaction(work) {
    const connection = await this.database.getConnection();

    try {
      await connection.beginTransaction();
      const result = await work(connection);
      await connection.commit();
      return result;
    } catch (error) {
      try {
        await connection.rollback();
      } catch {
        // Ne pas masquer l'erreur d'origine si le rollback échoue.
      }

      throw error;
    } finally {
      connection.release();
    }
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

    const commandeId = await this.withTransaction(async (connection) => {
      const id = await this.commandeRepository.create(
        nouvelleCommande,
        connection,
      );

      const stockDecremente = await this.menuModel.decreaseStock(
        nouvelleCommande.menu_id,
        nouvelleCommande.nombre_personne,
        connection,
      );

      if (!stockDecremente) {
        throw new Error("La mise à jour du stock a échoué.");
      }

      return id;
    });

    // Mise à jour des statistiques MongoDB (après commit uniquement)
    try {
      await this.statistiqueService.updateStatistiqueCommande(
        {
          ...nouvelleCommande,
          commande_id: commandeId,
        },
        menu,
      );
    } catch (error) {
      this.logger.error(
        "Erreur lors de la mise à jour des statistiques MongoDB :",
        error,
      );
    }

    try {
      const client = await this.getClientPourEmail(
        nouvelleCommande.utilisateur_id,
      );

      if (client) {
        await this.emailService.sendOrderConfirmationEmail({
          to: client.email,
          prenom: client.prenom,
          commande: {
            ...nouvelleCommande,
            commande_id: commandeId,
          },
        });
      }
    } catch (error) {
      this.logger.error(
        "Erreur lors de l'envoi de l'e-mail de confirmation de commande :",
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
    const commande = await this.commandeRepository.findById(id);

    if (!commande) {
      throw new Error("Commande introuvable.");
    }

    if (!STATUTS_AUTORISES.has(statut)) {
      throw new Error("Statut de commande invalide.");
    }

    if (statut === "Annulée") {
      if (commande.statut === "Annulée") {
        throw new Error("Cette commande est déjà annulée.");
      }

      const result = await this.withTransaction(async (connection) => {
        const updated = await this.commandeRepository.updateStatut(
          id,
          statut,
          connection,
        );

        const stockRestitue = await this.menuModel.increaseStock(
          commande.menu_id,
          commande.nombre_personne,
          connection,
        );

        if (!stockRestitue) {
          throw new Error("La mise à jour du stock a échoué.");
        }

        return updated;
      });

      await this.envoyerEmailAnnulation(commande);

      return result;
    }

    return await this.commandeRepository.updateStatut(id, statut);
  }

  async annulerCommande(id, data) {
    const commande = await this.commandeRepository.findById(id);

    if (!commande) {
      throw new Error("Commande introuvable.");
    }

    if (commande.statut === "Annulée") {
      throw new Error("Cette commande est déjà annulée.");
    }

    if (!data?.mode_contact_annulation) {
      throw new Error("Le mode de contact est obligatoire.");
    }

    if (!MODES_CONTACT_AUTORISES.has(data.mode_contact_annulation)) {
      throw new Error("Le mode de contact doit être Téléphone ou Mail.");
    }

    if (!data?.motif_annulation) {
      throw new Error("Le motif d'annulation est obligatoire.");
    }

    const annulation = {
      mode_contact_annulation: data.mode_contact_annulation,
      motif_annulation: data.motif_annulation,
      date_annulation: new Date(),
    };

    const result = await this.withTransaction(async (connection) => {
      const updated = await this.commandeRepository.updateAnnulation(
        id,
        annulation,
        connection,
      );

      const stockRestitue = await this.menuModel.increaseStock(
        commande.menu_id,
        commande.nombre_personne,
        connection,
      );

      if (!stockRestitue) {
        throw new Error("La mise à jour du stock a échoué.");
      }

      return updated;
    });

    await this.envoyerEmailAnnulation(commande);

    return result;
  }

  async annulerCommandeClient(id, utilisateurId) {
    const commandeExistante = await this.getCommandeClient(id, utilisateurId);

    if (commandeExistante.statut === "Annulée") {
      throw new Error("Cette commande est déjà annulée.");
    }

    const commandeMetier = new this.Commande(commandeExistante);

    if (!commandeMetier.peutEtreAnnuleeParClient()) {
      throw new Error("Cette commande ne peut plus être annulée.");
    }

    const result = await this.withTransaction(async (connection) => {
      const updated = await this.commandeRepository.updateStatut(
        id,
        "Annulée",
        connection,
      );

      const stockRestitue = await this.menuModel.increaseStock(
        commandeExistante.menu_id,
        commandeExistante.nombre_personne,
        connection,
      );

      if (!stockRestitue) {
        throw new Error("La mise à jour du stock a échoué.");
      }

      return updated;
    });

    await this.envoyerEmailAnnulation(commandeExistante);

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

    const ancienNombre = Number(commandeExistante.nombre_personne);
    const nouveauNombre = Number(nombrePersonne);
    const delta = nouveauNombre - ancienNombre;

    const updateData = {
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
    };

    if (delta > 0) {
      return await this.withTransaction(async (connection) => {
        const stockDisponible = await this.menuModel.hasStock(
          commandeExistante.menu_id,
          delta,
          connection,
        );

        if (!stockDisponible) {
          throw new Error(
            "Le stock disponible est insuffisant pour cette commande.",
          );
        }

        const stockDecremente = await this.menuModel.decreaseStock(
          commandeExistante.menu_id,
          delta,
          connection,
        );

        if (!stockDecremente) {
          throw new Error("La mise à jour du stock a échoué.");
        }

        return await this.commandeRepository.update(
          id,
          updateData,
          connection,
        );
      });
    }

    if (delta < 0) {
      return await this.withTransaction(async (connection) => {
        const result = await this.commandeRepository.update(
          id,
          updateData,
          connection,
        );

        const stockRestitue = await this.menuModel.increaseStock(
          commandeExistante.menu_id,
          Math.abs(delta),
          connection,
        );

        if (!stockRestitue) {
          throw new Error("La mise à jour du stock a échoué.");
        }

        return result;
      });
    }

    // delta === 0 : aucun mouvement de stock, update simple hors transaction
    return await this.commandeRepository.update(id, updateData);
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
  database,
  emailService: emailServiceModule,
  utilisateurModel: Utilisateur,
  logger: console,
});

module.exports = commandeService;
module.exports.CommandeService = CommandeService;
