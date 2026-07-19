const database = require("../config/database");

const Regime = {
  async findAll() {
    const [rows] = await database.query(
      `
        SELECT *
        FROM regime
      `,
    );

    return rows;
  },

  async findById(id) {
    const [rows] = await database.query(
      `
        SELECT *
        FROM regime
        WHERE regime_id = ?
      `,
      [id],
    );

    return rows[0];
  },

  async findByLibelle(libelle) {
    const [rows] = await database.query(
      `
        SELECT *
        FROM regime
        WHERE libelle = ?
      `,
      [libelle],
    );

    return rows[0];
  },

  async create(regime) {
    const [result] = await database.query(
      `
        INSERT INTO regime (
          libelle
        )
        VALUES (?)
      `,
      [regime.libelle],
    );

    return result.insertId;
  },

  async update(id, regime) {
    const [result] = await database.query(
      `
        UPDATE regime
        SET
          libelle = ?
        WHERE regime_id = ?
      `,
      [regime.libelle, id],
    );

    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await database.query(
      `
        DELETE FROM regime
        WHERE regime_id = ?
      `,
      [id],
    );

    return result.affectedRows > 0;
  },

  async exists(id) {
    const [rows] = await database.query(
      `
        SELECT regime_id
        FROM regime
        WHERE regime_id = ?
      `,
      [id],
    );

    return rows.length > 0;
  },
};

module.exports = Regime;
