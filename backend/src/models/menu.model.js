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
    const [menus] = await database.query(
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

    if (menus.length === 0) {
      return null;
    }

    const menu = menus[0];

    const [plats] = await database.query(
      `
        SELECT
            plat.plat_id,
            plat.titre_plat,
            plat.photo
        FROM menu_plat
        JOIN plat
            ON menu_plat.plat_id = plat.plat_id
        WHERE menu_plat.menu_id = ?
        `,
      [id],
    );

    menu.plats = plats;

    return menu;
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

  async findPlatsByMenuId(menuId) {
    const [rows] = await database.query(
      `
        SELECT
            plat.plat_id,
            plat.titre_plat,
            plat.photo
        FROM menu_plat
        JOIN plat
            ON menu_plat.plat_id = plat.plat_id
        WHERE menu_plat.menu_id = ?
        `,
      [menuId],
    );

    return rows;
  },

  async addPlatToMenu(menuId, platId) {
    await database.query(
      `
        INSERT INTO menu_plat (
            menu_id,
            plat_id
        ) VALUES (?, ?)
        `,
      [menuId, platId],
    );
  },
};

module.exports = Menu;
