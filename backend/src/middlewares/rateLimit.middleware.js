const rateLimit = require("express-rate-limit");

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
  },
});

const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Trop de messages envoyés. Réessayez dans une heure.",
  },
});

module.exports = {
  loginRateLimiter,
  contactRateLimiter,
};
