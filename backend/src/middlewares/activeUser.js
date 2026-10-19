const Utilisateur = require("../models/utilisateur.model");

/**
 * Charge un utilisateur actif à partir du payload JWT.
 * Retourne null si le compte est absent ou désactivé.
 * @param {object} decoded - payload JWT
 * @param {{ findById?: Function }} [deps] - injection optionnelle pour les tests
 */
async function loadActiveUserFromToken(decoded, deps = {}) {
  const findById = deps.findById || ((id) => Utilisateur.findById(id));
  const utilisateurId = Number(decoded?.utilisateur_id);

  if (!Number.isInteger(utilisateurId) || utilisateurId <= 0) {
    return null;
  }

  const utilisateur = await findById(utilisateurId);

  if (!utilisateur || !utilisateur.actif) {
    return null;
  }

  return {
    utilisateur_id: utilisateur.utilisateur_id,
    role_id: utilisateur.role_id,
    email: utilisateur.email,
  };
}

module.exports = {
  loadActiveUserFromToken,
};
