const database = require("../config/database");

const Menu = {
  async findAll() {
    const [rows] = await database.query(
      `
        SELECT 
            menu.*,
            regime.libelle AS regime,
            theme.libelle AS theme
        FROM menu
        JOIN regime 
            ON menu.regime_id = regime.regime_id
        JOIN theme 
            ON menu.theme_id = theme.theme_id
        `,
    );

    return rows;
  },

  async findById(id) {
    const [rows] = await database.query(
      `
        SELECT 
            menu.*,
            regime.libelle AS regime,
            theme.libelle AS theme
        FROM menu
        JOIN regime 
            ON menu.regime_id = regime.regime_id
        JOIN theme 
            ON menu.theme_id = theme.theme_id
        WHERE menu.menu_id = ?
        `,
      [id],
    );

    return rows[0];
  },

  async create(menu) {
    const [result] = await database.query(
      `INSERT INTO menu (
            titre,
            nombre_personne_minimum,
            prix_par_personne,
            description,
            quantite_restante,
            regime_id,
            theme_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        menu.titre,
        menu.nombre_personne_minimum,
        menu.prix_par_personne,
        menu.description,
        menu.quantite_restante,
        menu.regime_id,
        menu.theme_id,
      ],
    );

    return result.insertId;
  },
};

module.exports = Menu;
