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
          role_id
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
          role_id
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
          role_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      ],
    );

    return result.insertId;
  },

  async update(id, utilisateur) {
    await database.query(
      `
        UPDATE utilisateur
        SET
          email = ?,
          nom = ?,
          prenom = ?,
          telephone = ?
        WHERE utilisateur_id = ?
      `,
      [
        utilisateur.email,
        utilisateur.nom,
        utilisateur.prenom,
        utilisateur.telephone,
        id,
      ],
    );
  },
};

module.exports = Utilisateur;
