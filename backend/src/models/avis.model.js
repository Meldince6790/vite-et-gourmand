const db = require("../config/database");

const Avis = {
  async getAll() {
    const [rows] = await db.query(`
      SELECT
        avis.*,
        utilisateur.nom,
        utilisateur.prenom
      FROM avis
      LEFT JOIN utilisateur
        ON avis.utilisateur_id = utilisateur.utilisateur_id
    `);

    return rows;
  },

  async getById(id) {
    const [rows] = await db.query(
      `
      SELECT
        avis.*,
        utilisateur.nom,
        utilisateur.prenom
      FROM avis
      LEFT JOIN utilisateur
        ON avis.utilisateur_id = utilisateur.utilisateur_id
      WHERE avis.avis_id = ?
      `,
      [id],
    );

    return rows[0];
  },

  async create(avis) {
    const [result] = await db.query(
      `
      INSERT INTO avis (
        note,
        description,
        statut,
        utilisateur_id
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        avis.note,
        avis.description,
        avis.statut || "En attente",
        avis.utilisateur_id,
      ],
    );

    return result.insertId;
  },

  async update(id, avis) {
    const [result] = await db.query(
      `
      UPDATE avis
      SET
        note = ?,
        description = ?,
        statut = ?
      WHERE avis_id = ?
      `,
      [avis.note, avis.description, avis.statut, id],
    );

    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await db.query(
      `
      DELETE FROM avis
      WHERE avis_id = ?
      `,
      [id],
    );

    return result.affectedRows;
  },
};

module.exports = Avis;
