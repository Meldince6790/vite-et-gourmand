const jwt = require("jsonwebtoken");
const { loadActiveUserFromToken } = require("./activeUser");

const JWT_VERIFY_OPTIONS = { algorithms: ["HS256"] };

/**
 * Attache req.user si un Bearer JWT valide appartient à un compte actif.
 * Ne bloque jamais la requête (endpoints publics).
 * Un compte désactivé est traité comme visiteur anonyme.
 */
const optionalAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return next();
  }

  try {
    const decoded = jwt.verify(
      parts[1],
      process.env.JWT_SECRET,
      JWT_VERIFY_OPTIONS,
    );
    const utilisateur = await loadActiveUserFromToken(decoded);

    if (utilisateur) {
      req.user = utilisateur;
    }
  } catch {
    // Token invalide / expiré : traiter comme visiteur anonyme
  }

  return next();
};

module.exports = optionalAuthMiddleware;
