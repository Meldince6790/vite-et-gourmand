const database = require("../config/database");

const Commande = {
  async findAll() {
    const [rows] = await database.query(
      `
        SELECT
          commande.*,
          utilisateur.nom,
          utilisateur.prenom
        FROM commande
        LEFT JOIN utilisateur
          ON commande.utilisateur_id = utilisateur.utilisateur_id
        ORDER BY date_commande DESC
      `,
    );

    return rows;
  },

  async findById(id) {
    const [rows] = await database.query(
      `
        SELECT *
        FROM commande
        WHERE commande_id = ?
      `,
      [id],
    );

    return rows[0];
  },

  async findByUtilisateurId(utilisateurId) {
    const [rows] = await database.query(
      `
        SELECT *
        FROM commande
        WHERE utilisateur_id = ?
        ORDER BY date_commande DESC
      `,
      [utilisateurId],
    );

    return rows;
  },

  async create(commande) {
    const [result] = await database.query(
      `
        INSERT INTO commande (
          numero_commande,
          date_commande,
          date_prestation,
          heure_livraison,
          adresse_livraison,
          prix_menu,
          nombre_personne,
          prix_livraison,
          statut,
          pret_materiel,
          restitution_materiel,
          utilisateur_id,
          menu_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        commande.numero_commande,
        commande.date_commande,
        commande.date_prestation,
        commande.heure_livraison,
        commande.adresse_livraison,
        commande.prix_menu,
        commande.nombre_personne,
        commande.prix_livraison,
        commande.statut,
        commande.pret_materiel,
        commande.restitution_materiel,
        commande.utilisateur_id,
        commande.menu_id,
      ],
    );

    return result.insertId;
  },

  async updateStatut(id, statut) {
    const [result] = await database.query(
      `
        UPDATE commande
        SET statut = ?
        WHERE commande_id = ?
      `,
      [statut, id],
    );

    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await database.query(
      `
        DELETE FROM commande
        WHERE commande_id = ?
      `,
      [id],
    );

    return result.affectedRows > 0;
  },

  async exists(id) {
    const [rows] = await database.query(
      `
        SELECT commande_id
        FROM commande
        WHERE commande_id = ?
      `,
      [id],
    );

    return rows.length > 0;
  },
};

module.exports = Commande;
