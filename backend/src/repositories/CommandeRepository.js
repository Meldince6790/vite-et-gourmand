class CommandeRepository {
  constructor(database) {
    this.database = database;
  }

  async findAll() {
    const [rows] = await this.database.query(
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
  }

  async findById(id) {
    const [rows] = await this.database.query(
      `
        SELECT *
        FROM commande
        WHERE commande_id = ?
      `,
      [id],
    );

    return rows[0];
  }

  async findByUtilisateurId(utilisateurId) {
    const [rows] = await this.database.query(
      `
        SELECT *
        FROM commande
        WHERE utilisateur_id = ?
        ORDER BY date_commande DESC
      `,
      [utilisateurId],
    );

    return rows;
  }

  async create(commande) {
    const [result] = await this.database.query(
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
  }

  async updateStatut(id, statut) {
    const [result] = await this.database.query(
      `
        UPDATE commande
        SET statut = ?
        WHERE commande_id = ?
      `,
      [statut, id],
    );

    return result.affectedRows > 0;
  }

  async updateAnnulation(id, annulation) {
    const [result] = await this.database.query(
      `
        UPDATE commande
        SET
          statut = ?,
          mode_contact_annulation = ?,
          motif_annulation = ?,
          date_annulation = ?
        WHERE commande_id = ?
      `,
      [
        "Annulée",
        annulation.mode_contact_annulation,
        annulation.motif_annulation,
        annulation.date_annulation,
        id,
      ],
    );

    return result.affectedRows > 0;
  }

  async update(id, commande) {
    const [result] = await this.database.query(
      `
        UPDATE commande
        SET
          date_prestation = ?,
          heure_livraison = ?,
          adresse_livraison = ?,
          nombre_personne = ?,
          prix_menu = ?,
          pret_materiel = ?,
          restitution_materiel = ?
        WHERE commande_id = ?
      `,
      [
        commande.date_prestation,
        commande.heure_livraison,
        commande.adresse_livraison,
        commande.nombre_personne,
        commande.prix_menu,
        commande.pret_materiel,
        commande.restitution_materiel,
        id,
      ],
    );

    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await this.database.query(
      `
        DELETE FROM commande
        WHERE commande_id = ?
      `,
      [id],
    );

    return result.affectedRows > 0;
  }

  async exists(id) {
    const [rows] = await this.database.query(
      `
        SELECT commande_id
        FROM commande
        WHERE commande_id = ?
      `,
      [id],
    );

    return rows.length > 0;
  }
}

module.exports = CommandeRepository;
