const database = require("../config/database");

const Utilisateur = {
  async findAll() {
    const [rows] = await database.query(
      `
        SELECT
          utilisateur_id,
          email,
          nom,
          prenom,
          telephone,
          ville,
          pays,
          adresse_postale,
          role_id,
          actif
        FROM utilisateur
      `,
    );

    return rows;
  },

  async findById(id) {
    const [rows] = await database.query(
      `
        SELECT
          utilisateur_id,
          email,
          nom,
          prenom,
          telephone,
          ville,
          pays,
          adresse_postale,
          role_id,
          actif
        FROM utilisateur
        WHERE utilisateur_id = ?
      `,
      [id],
    );

    return rows[0];
  },

  async findByEmail(email) {
    const [rows] = await database.query(
      `
        SELECT *
        FROM utilisateur
        WHERE email = ?
      `,
      [email],
    );

    return rows[0];
  },

  async create(utilisateur) {
    const [result] = await database.query(
      `
        INSERT INTO utilisateur (
          email,
          password,
          nom,
          prenom,
          telephone,
          ville,
          pays,
          adresse_postale,
          role_id,
          actif
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        utilisateur.email,
        utilisateur.password,
        utilisateur.nom,
        utilisateur.prenom,
        utilisateur.telephone,
        utilisateur.ville,
        utilisateur.pays,
        utilisateur.adresse_postale,
        utilisateur.role_id,
        utilisateur.actif ?? true,
      ],
    );

    return result.insertId;
  },

  async update(id, utilisateur) {
    const [result] = await database.query(
      `
        UPDATE utilisateur
        SET
          nom = ?,
          prenom = ?,
          telephone = ?,
          ville = ?,
          pays = ?,
          adresse_postale = ?
        WHERE utilisateur_id = ?
      `,
      [
        utilisateur.nom,
        utilisateur.prenom,
        utilisateur.telephone,
        utilisateur.ville,
        utilisateur.pays,
        utilisateur.adresse_postale,
        id,
      ],
    );

    return result;
  },

  async updateActif(id, actif) {
    const [result] = await database.query(
      `
        UPDATE utilisateur
        SET actif = ?
        WHERE utilisateur_id = ?
      `,
      [actif, id],
    );

    return result.affectedRows > 0;
  },
};

module.exports = Utilisateur;
