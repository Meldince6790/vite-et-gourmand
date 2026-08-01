const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const database = require("../config/database");

const authService = {
  async login(email, password) {
    const [rows] = await database.query(
      "SELECT * FROM utilisateur WHERE email = ?",
      [email],
    );

    const utilisateur = rows[0];

    if (!utilisateur) {
      throw new Error("Identifiants incorrects.");
    }

    if (!password || !utilisateur.password) {
      throw new Error("Identifiants incorrects.");
    }

    const passwordValid = await bcrypt.compare(password, utilisateur.password);

    if (!passwordValid) {
      throw new Error("Identifiants incorrects.");
    }

    if (!utilisateur.actif) {
      throw new Error("Identifiants incorrects.");
    }

    const token = jwt.sign(
      {
        utilisateur_id: utilisateur.utilisateur_id,
        role_id: utilisateur.role_id,
        email: utilisateur.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      },
    );

    return {
      utilisateur_id: utilisateur.utilisateur_id,
      email: utilisateur.email,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      role_id: utilisateur.role_id,
      token,
    };
  },
};

module.exports = authService;
