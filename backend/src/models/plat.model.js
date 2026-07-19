const database = require("../config/database");

const Plat = {
  async findAll() {
    const [rows] = await database.query("SELECT * FROM plat");

    return rows;
  },

  async findById(id) {
    const [rows] = await database.query(
      `
        SELECT *
        FROM plat
        WHERE plat_id = ?
      `,
      [id],
    );

    return rows[0];
  },

  async create(plat) {
    const [result] = await database.query(
      `
        INSERT INTO plat (
          titre_plat,
          photo
        )
        VALUES (?, ?)
      `,
      [plat.titre_plat, plat.photo],
    );

    return result.insertId;
  },

  async update(id, plat) {
    const [result] = await database.query(
      `
        UPDATE plat
        SET
          titre_plat = ?,
          photo = ?
        WHERE plat_id = ?
      `,
      [plat.titre_plat, plat.photo, id],
    );

    return result.affectedRows > 0;
  },

  async delete(id) {
    await database.query(
      `
        DELETE FROM menu_plat
        WHERE plat_id = ?
      `,
      [id],
    );

    await database.query(
      `
        DELETE FROM plat_allergene
        WHERE plat_id = ?
      `,
      [id],
    );

    const [result] = await database.query(
      `
        DELETE FROM plat
        WHERE plat_id = ?
      `,
      [id],
    );

    return result.affectedRows > 0;
  },

  async exists(id) {
    const [rows] = await database.query(
      `
        SELECT plat_id
        FROM plat
        WHERE plat_id = ?
      `,
      [id],
    );

    return rows.length > 0;
  },

  async findMenusByPlatId(platId) {
    const [rows] = await database.query(
      `
        SELECT
          menu.menu_id,
          menu.titre
        FROM menu_plat
        JOIN menu
          ON menu_plat.menu_id = menu.menu_id
        WHERE menu_plat.plat_id = ?
      `,
      [platId],
    );

    return rows;
  },

  async findAllergenesByPlatId(platId) {
    const [rows] = await database.query(
      `
        SELECT
          allergene.allergene_id,
          allergene.libelle
        FROM plat_allergene
        JOIN allergene
          ON plat_allergene.allergene_id = allergene.allergene_id
        WHERE plat_allergene.plat_id = ?
      `,
      [platId],
    );

    return rows;
  },

  async addAllergeneToPlat(platId, allergeneId) {
    await database.query(
      `
        INSERT INTO plat_allergene (
          plat_id,
          allergene_id
        )
        VALUES (?, ?)
      `,
      [platId, allergeneId],
    );
  },

  async removeAllergeneFromPlat(platId, allergeneId) {
    await database.query(
      `
        DELETE FROM plat_allergene
        WHERE plat_id = ?
        AND allergene_id = ?
      `,
      [platId, allergeneId],
    );
  },

  async allergeneAlreadyExists(platId, allergeneId) {
    const [rows] = await database.query(
      `
        SELECT *
        FROM plat_allergene
        WHERE plat_id = ?
        AND allergene_id = ?
      `,
      [platId, allergeneId],
    );

    return rows.length > 0;
  },
};

module.exports = Plat;
