const database = require("../config/database");

const Theme = {
  async findAll() {
    const [rows] = await database.query(
      `
        SELECT *
        FROM theme
      `,
    );

    return rows;
  },

  async findById(id) {
    const [rows] = await database.query(
      `
        SELECT *
        FROM theme
        WHERE theme_id = ?
      `,
      [id],
    );

    return rows[0];
  },

  async create(theme) {
    const [result] = await database.query(
      `
        INSERT INTO theme (
          libelle
        )
        VALUES (?)
      `,
      [theme.libelle],
    );

    return result.insertId;
  },

  async update(id, theme) {
    const [result] = await database.query(
      `
        UPDATE theme
        SET
          libelle = ?
        WHERE theme_id = ?
      `,
      [theme.libelle, id],
    );

    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await database.query(
      `
        DELETE FROM theme
        WHERE theme_id = ?
      `,
      [id],
    );

    return result.affectedRows > 0;
  },

  async exists(id) {
    const [rows] = await database.query(
      `
        SELECT theme_id
        FROM theme
        WHERE theme_id = ?
      `,
      [id],
    );

    return rows.length > 0;
  },

  async findByLibelle(libelle) {
    const [rows] = await database.query(
      `
        SELECT theme_id
        FROM theme
        WHERE libelle = ?
      `,
      [libelle],
    );

    return rows.length > 0;
  },

  async countMenusByThemeId(themeId) {
    const [rows] = await database.query(
      `
        SELECT COUNT(*) AS total
        FROM menu
        WHERE theme_id = ?
      `,
      [themeId],
    );

    return rows[0].total;
  },

  async replaceInMenus(oldThemeId, newThemeId) {
    await database.query(
      `
        UPDATE menu
        SET theme_id = ?
        WHERE theme_id = ?
      `,
      [newThemeId, oldThemeId],
    );
  },
};

module.exports = Theme;
