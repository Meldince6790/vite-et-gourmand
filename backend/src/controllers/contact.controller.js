const emailServiceModule = require("../services/email.service");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createContactController({
  emailService = emailServiceModule,
  logger = console,
} = {}) {
  return {
    async send(req, res) {
      const nom = String(req.body?.nom ?? "").trim();
      const email = String(req.body?.email ?? "").trim();
      const message = String(req.body?.message ?? "").trim();

      if (!nom) {
        return res.status(400).json({
          message: "Le nom est obligatoire.",
        });
      }

      if (!email || !isValidEmail(email)) {
        return res.status(400).json({
          message: "L'adresse e-mail est invalide.",
        });
      }

      if (!message) {
        return res.status(400).json({
          message: "Le message est obligatoire.",
        });
      }

      try {
        await emailService.sendContactEmail({ nom, email, message });
      } catch (error) {
        logger.error(
          "Erreur lors de l'envoi du message de contact :",
          error,
        );

        return res.status(502).json({
          message: "Impossible d’envoyer le message pour le moment.",
        });
      }

      try {
        await emailService.sendContactAcknowledgementEmail({
          to: email,
          nom,
        });
      } catch (error) {
        logger.error(
          "Erreur lors de l'envoi de l'accusé de réception :",
          error,
        );
      }

      return res.status(201).json({
        message: "Message envoyé avec succès.",
      });
    },
  };
}

const contactController = createContactController();

module.exports = contactController;
module.exports.createContactController = createContactController;
