const Statistique = require("../models/statistique.model");

const statistiqueService = {
  // Création ou mise à jour des statistiques après une commande
  async updateStatistiqueCommande(commande, menu) {
    if (!menu) {
      throw new Error("Menu introuvable.");
    }

    const dateCommande = new Date(commande.date_commande);

    const periode = `${dateCommande.getFullYear()}-${String(
      dateCommande.getMonth() + 1,
    ).padStart(2, "0")}`;

    const statistiqueExistante = await Statistique.findOne({
      menu_id: commande.menu_id,
      periode,
    });

    const chiffreAffaires =
      Number(commande.prix_menu) + Number(commande.prix_livraison);

    if (statistiqueExistante) {
      statistiqueExistante.nombre_commandes += 1;
      statistiqueExistante.chiffre_affaires += chiffreAffaires;

      return await statistiqueExistante.save();
    }

    const nouvelleStatistique = new Statistique({
      menu_id: commande.menu_id,
      nom_menu: menu.titre,
      nombre_commandes: 1,
      chiffre_affaires: chiffreAffaires,
      periode,
    });

    return await nouvelleStatistique.save();
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

    return await Statistique.find(query).sort({
      periode: -1,
    });
  },

  // Nombre de commandes par menu (graphique)
  async getCommandesParMenu() {
    return await Statistique.aggregate([
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

  // Chiffre d'affaires avec filtres menu et période
  async getChiffreAffaires(filters = {}) {
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

    const result = await Statistique.aggregate([
      {
        $match: match,
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
          chiffre_affaires_total: 1,
        },
      },
    ]);

    return (
      result[0] || {
        chiffre_affaires_total: 0,
      }
    );
  },
};

module.exports = statistiqueService;
