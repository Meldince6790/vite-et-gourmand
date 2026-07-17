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
      throw new Error("Utilisateur introuvable.");
    }
    console.log("Password reçu :", password);
    console.log("Hash BDD :", utilisateur.password);

    const passwordValid = await bcrypt.compare(password, utilisateur.password);

    console.log("Résultat bcrypt :", passwordValid);

    if (!passwordValid) {
      throw new Error("Mot de passe incorrect.");
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
