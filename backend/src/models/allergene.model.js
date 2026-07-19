const database = require("../config/database");

const Allergene = {
  async findAll() {
    const [rows] = await database.query(
      `
        SELECT *
        FROM allergene
      `,
    );

    return rows;
  },

  async findById(id) {
    const [rows] = await database.query(
      `
        SELECT *
        FROM allergene
        WHERE allergene_id = ?
      `,
      [id],
    );

    return rows[0];
  },

  async create(allergene) {
    const [result] = await database.query(
      `
        INSERT INTO allergene (
          libelle
        )
        VALUES (?)
      `,
      [allergene.libelle],
    );

    return result.insertId;
  },

  async update(id, allergene) {
    const [result] = await database.query(
      `
        UPDATE allergene
        SET
          libelle = ?
        WHERE allergene_id = ?
      `,
      [allergene.libelle, id],
    );

    return result.affectedRows > 0;
  },

  async delete(id) {
    await database.query(
      `
        DELETE FROM plat_allergene
        WHERE allergene_id = ?
      `,
      [id],
    );

    const [result] = await database.query(
      `
        DELETE FROM allergene
        WHERE allergene_id = ?
      `,
      [id],
    );

    return result.affectedRows > 0;
  },

  async exists(id) {
    const [rows] = await database.query(
      `
        SELECT allergene_id
        FROM allergene
        WHERE allergene_id = ?
      `,
      [id],
    );

    return rows.length > 0;
  },

  async existsByLibelle(libelle) {
    const [rows] = await database.query(
      `
      SELECT allergene_id
      FROM allergene
      WHERE libelle = ?
    `,
      [libelle],
    );

    return rows.length > 0;
  },
};

module.exports = Allergene;
