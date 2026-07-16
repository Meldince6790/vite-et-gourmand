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
};

module.exports = Plat;
