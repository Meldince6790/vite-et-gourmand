const jwt = require("jsonwebtoken");

/**
 * Attache req.user si un Bearer JWT valide est présent.
 * Ne bloque jamais la requête (endpoints publics).
 */
const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return next();
  }

  try {
    req.user = jwt.verify(parts[1], process.env.JWT_SECRET);
  } catch {
    // Token invalide / expiré : traiter comme visiteur anonyme
  }

  return next();
};

module.exports = optionalAuthMiddleware;
