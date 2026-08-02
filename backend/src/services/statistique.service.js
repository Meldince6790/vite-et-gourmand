const Statistique = require("../models/statistique.model");

function calculerPeriode(dateCommande) {
  const date = new Date(dateCommande);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function calculerChiffreAffaires(commande) {
  return Number(commande.prix_menu) + Number(commande.prix_livraison);
}

function createStatistiqueService({
  StatistiqueModel = Statistique,
  logger = console,
} = {}) {
  const statistiqueService = {
    async appliquerDeltaStatistique(
      commande,
      { deltaCommandes = 0, deltaCA = 0, nomMenu } = {},
    ) {
      if (!commande?.menu_id) {
        throw new Error("menu_id manquant pour la mise à jour statistique.");
      }

      if (!commande?.date_commande) {
        throw new Error(
          "date_commande manquante pour la mise à jour statistique.",
        );
      }

      const periode = calculerPeriode(commande.date_commande);
      const deltaCommandesNumber = Number(deltaCommandes);
      const deltaCANumber = Number(deltaCA);

      const statistiqueExistante = await StatistiqueModel.findOne({
        menu_id: commande.menu_id,
        periode,
      });

      if (!statistiqueExistante) {
        if (deltaCommandesNumber < 0 || deltaCANumber < 0) {
          logger.warn(
            "Statistique MongoDB introuvable pour un delta négatif :",
            {
              menu_id: commande.menu_id,
              periode,
              deltaCommandes: deltaCommandesNumber,
              deltaCA: deltaCANumber,
            },
          );
          return null;
        }

        if (!nomMenu) {
          throw new Error(
            "nom_menu manquant pour la création d'une statistique.",
          );
        }

        const nouvelleStatistique = new StatistiqueModel({
          menu_id: commande.menu_id,
          nom_menu: nomMenu,
          nombre_commandes: Math.max(0, deltaCommandesNumber),
          chiffre_affaires: Math.max(0, deltaCANumber),
          periode,
        });

        return await nouvelleStatistique.save();
      }

      statistiqueExistante.nombre_commandes = Math.max(
        0,
        Number(statistiqueExistante.nombre_commandes) + deltaCommandesNumber,
      );
      statistiqueExistante.chiffre_affaires = Math.max(
        0,
        Number(statistiqueExistante.chiffre_affaires) + deltaCANumber,
      );

      return await statistiqueExistante.save();
    },

    // Façade +1 après création de commande
    async updateStatistiqueCommande(commande, menu) {
      if (!menu) {
        throw new Error("Menu introuvable.");
      }

      return statistiqueService.appliquerDeltaStatistique(commande, {
        deltaCommandes: 1,
        deltaCA: calculerChiffreAffaires(commande),
        nomMenu: menu.titre,
      });
    },

    // Façade -1 après annulation de commande
    async retirerStatistiqueCommande(commande) {
      const chiffreAffaires = calculerChiffreAffaires(commande);

      return statistiqueService.appliquerDeltaStatistique(commande, {
        deltaCommandes: -1,
        deltaCA: -chiffreAffaires,
      });
    },

    /**
     * Recalcule les agrégats Mongo à partir des commandes actives (non annulées).
     * Non destructif : aucun document n'est supprimé.
     */
    async recalculerStatistiques(commandesActives = []) {
      const agregats = new Map();

      for (const commande of commandesActives) {
        const menuId = Number(commande.menu_id);
        const periode = calculerPeriode(commande.date_commande);
        const cle = `${menuId}|${periode}`;
        const chiffreAffaires = calculerChiffreAffaires(commande);
        const existant = agregats.get(cle);

        if (existant) {
          existant.nombre_commandes += 1;
          existant.chiffre_affaires += chiffreAffaires;
          if (commande.nom_menu) {
            existant.nom_menu = commande.nom_menu;
          }
        } else {
          agregats.set(cle, {
            menu_id: menuId,
            periode,
            nom_menu: commande.nom_menu,
            nombre_commandes: 1,
            chiffre_affaires: chiffreAffaires,
          });
        }
      }

      const rapport = {
        commandesLues: commandesActives.length,
        agregatsCalcules: agregats.size,
        documentsCrees: 0,
        documentsMisAJour: 0,
        documentsRemisAZero: 0,
      };

      for (const agregat of agregats.values()) {
        const document = await StatistiqueModel.findOne({
          menu_id: agregat.menu_id,
          periode: agregat.periode,
        });

        if (!document) {
          const nouveau = new StatistiqueModel({
            menu_id: agregat.menu_id,
            nom_menu: agregat.nom_menu,
            nombre_commandes: agregat.nombre_commandes,
            chiffre_affaires: agregat.chiffre_affaires,
            periode: agregat.periode,
          });

          await nouveau.save();
          rapport.documentsCrees += 1;
          continue;
        }

        const inchange =
          Number(document.nombre_commandes) === agregat.nombre_commandes &&
          Number(document.chiffre_affaires) === agregat.chiffre_affaires &&
          document.nom_menu === agregat.nom_menu;

        if (!inchange) {
          document.nombre_commandes = agregat.nombre_commandes;
          document.chiffre_affaires = agregat.chiffre_affaires;
          document.nom_menu = agregat.nom_menu;
          await document.save();
          rapport.documentsMisAJour += 1;
        }
      }

      const documentsExistants = await StatistiqueModel.find({});

      for (const document of documentsExistants) {
        const cle = `${Number(document.menu_id)}|${document.periode}`;

        if (agregats.has(cle)) {
          continue;
        }

        const dejaAZero =
          Number(document.nombre_commandes) === 0 &&
          Number(document.chiffre_affaires) === 0;

        if (!dejaAZero) {
          document.nombre_commandes = 0;
          document.chiffre_affaires = 0;
          await document.save();
          rapport.documentsRemisAZero += 1;
        }
      }

      return rapport;
    },

    // Récupération des statistiques avec filtres simples
    async getStatistiques(filters = {}) {
      const query = {};

      if (filters.menu_id) {
        query.menu_id = Number(filters.menu_id);
      }

      if (filters.periode) {
        query.periode = filters.periode;
      }

      return await StatistiqueModel.find(query).sort({
        periode: -1,
      });
    },

    // Nombre de commandes par menu (graphique)
    async getCommandesParMenu() {
      return await StatistiqueModel.aggregate([
        {
          $group: {
            _id: "$nom_menu",
            total_commandes: {
              $sum: "$nombre_commandes",
            },
          },
        },

        {
          $project: {
            _id: 0,
            menu: "$_id",
            total_commandes: 1,
          },
        },

        {
          $sort: {
            total_commandes: -1,
          },
        },
      ]);
    },

    // Chiffre d'affaires total de l'année en cours
    async getChiffreAffairesAnnuel() {
      const annee = new Date().getFullYear();

      const result = await StatistiqueModel.aggregate([
        {
          $match: {
            periode: {
              $regex: `^${annee}`,
            },
          },
        },

        {
          $group: {
            _id: null,

            chiffre_affaires_total: {
              $sum: "$chiffre_affaires",
            },
          },
        },

        {
          $project: {
            _id: 0,
            annee: annee,
            chiffre_affaires_total: 1,
          },
        },
      ]);

      return (
        result[0] || {
          annee,
          chiffre_affaires_total: 0,
        }
      );
    },

    // Evolution du chiffre d'affaires par période
    async getChiffreAffairesParPeriode() {
      return await StatistiqueModel.aggregate([
        {
          $group: {
            _id: "$periode",

            chiffre_affaires: {
              $sum: "$chiffre_affaires",
            },
          },
        },

        {
          $project: {
            _id: 0,
            periode: "$_id",
            chiffre_affaires: 1,
          },
        },

        {
          $sort: {
            periode: 1,
          },
        },
      ]);
    },

    // Chiffre d'affaires par menu
    async getChiffreAffairesParMenu() {
      return await StatistiqueModel.aggregate([
        {
          $group: {
            _id: "$nom_menu",

            chiffre_affaires: {
              $sum: "$chiffre_affaires",
            },
          },
        },

        {
          $project: {
            _id: 0,
            menu: "$_id",
            chiffre_affaires: 1,
          },
        },

        {
          $sort: {
            chiffre_affaires: -1,
          },
        },
      ]);
    },

    // Chiffre d'affaires avec filtres menu et période
    async getChiffreAffairesFiltre(filters = {}) {
      const match = {};

      if (filters.menu_id) {
        match.menu_id = Number(filters.menu_id);
      }

      if (filters.periode_debut && filters.periode_fin) {
        match.periode = {
          $gte: filters.periode_debut,
          $lte: filters.periode_fin,
        };
      }

      return await StatistiqueModel.aggregate([
        {
          $match: match,
        },

        {
          $group: {
            _id: "$nom_menu",

            chiffre_affaires: {
              $sum: "$chiffre_affaires",
            },
          },
        },

        {
          $project: {
            _id: 0,
            menu: "$_id",
            chiffre_affaires: 1,
          },
        },

        {
          $sort: {
            chiffre_affaires: -1,
          },
        },
      ]);
    },
  };

  return statistiqueService;
}

const statistiqueService = createStatistiqueService();

module.exports = statistiqueService;
module.exports.createStatistiqueService = createStatistiqueService;
