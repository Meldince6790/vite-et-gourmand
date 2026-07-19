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
};

module.exports = Plat;
