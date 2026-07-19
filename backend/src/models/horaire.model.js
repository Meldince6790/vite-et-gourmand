const db = require("../config/database");

const Horaire = {
  async getAll() {
    const [rows] = await db.query("SELECT * FROM horaire ORDER BY horaire_id");

    return rows;
  },

  async getById(id) {
    const [rows] = await db.query(
      "SELECT * FROM horaire WHERE horaire_id = ?",
      [id],
    );

    return rows[0];
  },

  async create(horaire) {
    const { jour, heure_ouverture, heure_fermeture } = horaire;

    const [result] = await db.query(
      `
      INSERT INTO horaire
      (jour, heure_ouverture, heure_fermeture)
      VALUES (?, ?, ?)
      `,
      [jour, heure_ouverture, heure_fermeture],
    );

    return result.insertId;
  },

  async update(id, horaire) {
    const { jour, heure_ouverture, heure_fermeture } = horaire;

    const [result] = await db.query(
      `
      UPDATE horaire
      SET jour = ?,
          heure_ouverture = ?,
          heure_fermeture = ?
      WHERE horaire_id = ?
      `,
      [jour, heure_ouverture, heure_fermeture, id],
    );

    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await db.query(
      "DELETE FROM horaire WHERE horaire_id = ?",
      [id],
    );

    return result.affectedRows;
  },
};

module.exports = Horaire;
