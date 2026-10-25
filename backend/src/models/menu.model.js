const defaultDatabase = require("../config/database");

function createMenuModel(database = defaultDatabase) {
  return {
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

    let allergenesRows = [];

    if (plats.length > 0) {
      const platIds = plats.map((plat) => plat.plat_id);
      const placeholders = platIds.map(() => "?").join(", ");

      const [rows] = await database.query(
        `
          SELECT
            plat_allergene.plat_id,
            allergene.allergene_id,
            allergene.libelle
          FROM plat_allergene
          JOIN allergene
            ON plat_allergene.allergene_id = allergene.allergene_id
          WHERE plat_allergene.plat_id IN (${placeholders})
        `,
        platIds,
      );

      allergenesRows = rows;
    }

    const allergenesByPlatId = new Map();

    for (const row of allergenesRows) {
      if (!allergenesByPlatId.has(row.plat_id)) {
        allergenesByPlatId.set(row.plat_id, []);
      }

      allergenesByPlatId.get(row.plat_id).push({
        allergene_id: row.allergene_id,
        libelle: row.libelle,
      });
    }

    menu.plats = plats.map((plat) => ({
      plat_id: plat.plat_id,
      titre_plat: plat.titre_plat,
      photo: plat.photo,
      allergenes: allergenesByPlatId.get(plat.plat_id) || [],
    }));

    return menu;
  },

  async create(menu) {
    const [result] = await database.query(
      `
        INSERT INTO menu (
          titre,
          nombre_personne_minimum,
          prix_par_personne,
          description,
          conditions,
          quantite_restante,
          regime_id,
          theme_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        menu.titre,
        menu.nombre_personne_minimum,
        menu.prix_par_personne,
        menu.description,
        menu.conditions,
        menu.quantite_restante,
        menu.regime_id,
        menu.theme_id,
      ],
    );

    return result.insertId;
  },

  async update(id, menu) {
    const [result] = await database.query(
      `
        UPDATE menu
        SET
          titre = ?,
          nombre_personne_minimum = ?,
          prix_par_personne = ?,
          description = ?,
          conditions = ?,
          quantite_restante = ?,
          regime_id = ?,
          theme_id = ?
        WHERE menu_id = ?
      `,
      [
        menu.titre,
        menu.nombre_personne_minimum,
        menu.prix_par_personne,
        menu.description,
        menu.conditions,
        menu.quantite_restante,
        menu.regime_id,
        menu.theme_id,
        id,
      ],
    );

    return result.affectedRows > 0;
  },

  async delete(id) {
    await database.query(
      `
        DELETE FROM menu_plat
        WHERE menu_id = ?
      `,
      [id],
    );

    const [result] = await database.query(
      `
        DELETE FROM menu
        WHERE menu_id = ?
      `,
      [id],
    );

    return result.affectedRows > 0;
  },

  async exists(id) {
    const [rows] = await database.query(
      `
        SELECT menu_id
        FROM menu
        WHERE menu_id = ?
      `,
      [id],
    );

    return rows.length > 0;
  },

  async usedInCommandes(id) {
    const [rows] = await database.query(
      `
        SELECT commande_id
        FROM commande
        WHERE menu_id = ?
        LIMIT 1
      `,
      [id],
    );

    return rows.length > 0;
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
        )
        VALUES (?, ?)
      `,
      [menuId, platId],
    );
  },

  async removePlatFromMenu(menuId, platId) {
    await database.query(
      `
        DELETE FROM menu_plat
        WHERE menu_id = ?
        AND plat_id = ?
      `,
      [menuId, platId],
    );
  },

  async platAlreadyExists(menuId, platId) {
    const [rows] = await database.query(
      `
        SELECT *
        FROM menu_plat
        WHERE menu_id = ?
        AND plat_id = ?
      `,
      [menuId, platId],
    );

    return rows.length > 0;
  },

  // Gestion du stock

  async hasStock(id, quantite = 1, connection = null) {
    const db = connection ?? database;
    const [rows] = await db.query(
      `
        SELECT quantite_restante
        FROM menu
        WHERE menu_id = ?
      `,
      [id],
    );

    if (rows.length === 0) {
      return false;
    }

    return rows[0].quantite_restante >= quantite;
  },

  async decreaseStock(id, quantite, connection = null) {
    const db = connection ?? database;
    const [result] = await db.query(
      `
        UPDATE menu
        SET quantite_restante = quantite_restante - ?
        WHERE menu_id = ?
        AND quantite_restante >= ?
      `,
      [quantite, id, quantite],
    );

    return result.affectedRows > 0;
  },

  async increaseStock(id, quantite, connection = null) {
    const db = connection ?? database;
    const [result] = await db.query(
      `
        UPDATE menu
        SET quantite_restante = quantite_restante + ?
        WHERE menu_id = ?
      `,
      [quantite, id],
    );

    return result.affectedRows > 0;
  },
  };
}

const Menu = createMenuModel();

module.exports = Menu;
module.exports.createMenuModel = createMenuModel;
