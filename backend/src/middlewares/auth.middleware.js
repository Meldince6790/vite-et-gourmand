const jwt = require("jsonwebtoken");
const { loadActiveUserFromToken } = require("./activeUser");

const JWT_VERIFY_OPTIONS = { algorithms: ["HS256"] };

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Accès refusé. Token manquant.",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Accès refusé. Format du token invalide.",
      });
    }

    const token = parts[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      JWT_VERIFY_OPTIONS,
    );

    const utilisateur = await loadActiveUserFromToken(decoded);

    if (!utilisateur) {
      return res.status(401).json({
        message: "Token invalide ou expiré.",
      });
    }

    req.user = utilisateur;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Token invalide ou expiré.",
    });
  }
};

module.exports = authMiddleware;
