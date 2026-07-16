const database = require("../config/database");

const Plat = {
  async findAll() {
    const [rows] = await database.query("SELECT * FROM plat");

    return rows;
  },

  async findById(id) {
    const [rows] = await database.query(
      "SELECT * FROM plat WHERE plat_id = ?",
      [id],
    );

    return rows[0];
  },

  async create(plat) {
    const [result] = await database.query(
      `INSERT INTO plat (
                titre_plat,
                photo
            ) VALUES (?, ?)`,
      [plat.titre_plat, plat.photo],
    );

    return result.insertId;
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
