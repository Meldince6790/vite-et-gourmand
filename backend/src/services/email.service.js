const { Resend } = require("resend");
const templates = require("./email.templates");

const PREVIEW_MAX_LENGTH = 80;

function truncatePreview(text, maxLength = PREVIEW_MAX_LENGTH) {
  const normalized = String(text ?? "")
    .replaceAll(/\s+/g, " ")
    .trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength)}…`;
}

class EmailService {
  constructor({
    provider = "log",
    apiKey = "",
    from = "",
    contactTo = "",
    logger = console,
    resendClient = null,
    idGenerator = null,
  } = {}) {
    this.provider = provider;
    this.apiKey = apiKey;
    this.from = from;
    this.contactTo = contactTo;
    this.logger = logger;
    this.resendClient = resendClient;
    this.idGenerator = idGenerator;
  }

  createLogId() {
    if (typeof this.idGenerator === "function") {
      return this.idGenerator();
    }

    return `log-${Date.now()}`;
  }

  getResendClient() {
    if (this.resendClient) {
      return this.resendClient;
    }

    this.resendClient = new Resend(this.apiKey);
    return this.resendClient;
  }

  async sendMail({ to, subject, html, text, replyTo } = {}) {
    if (!to) {
      throw new Error("Le destinataire de l'e-mail est obligatoire.");
    }

    if (!subject) {
      throw new Error("Le sujet de l'e-mail est obligatoire.");
    }

    if (this.provider === "log") {
      this.logger.info("[email:log]", {
        to,
        subject,
        preview: truncatePreview(text || html || ""),
      });

      return {
        ok: true,
        provider: "log",
        id: this.createLogId(),
      };
    }

    if (this.provider === "resend") {
      if (!this.apiKey) {
        throw new Error("RESEND_API_KEY est obligatoire en mode resend.");
      }

      if (!this.from) {
        throw new Error("EMAIL_FROM est obligatoire en mode resend.");
      }

      const client = this.getResendClient();
      const payload = {
        from: this.from,
        to,
        subject,
        html,
        text,
      };

      if (replyTo) {
        payload.replyTo = replyTo;
      }

      const { data, error } = await client.emails.send(payload);

      if (error) {
        const message =
          error.message || "Erreur lors de l'envoi de l'e-mail via Resend.";
        throw new Error(message);
      }

      return {
        ok: true,
        provider: "resend",
        id: data?.id ?? null,
      };
    }

    throw new Error(`Fournisseur e-mail non supporté : ${this.provider}`);
  }

  async sendContactEmail({ nom, email, message }) {
    if (!this.contactTo) {
      throw new Error("CONTACT_TO est obligatoire pour le formulaire de contact.");
    }

    const content = templates.contactNotification({ nom, email, message });

    return this.sendMail({
      to: this.contactTo,
      subject: content.subject,
      text: content.text,
      html: content.html,
      replyTo: email,
    });
  }

  async sendContactAcknowledgementEmail({ to, nom }) {
    const content = templates.contactAcknowledgement({ nom });

    return this.sendMail({
      to,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
  }

  async sendWelcomeEmail({ to, prenom, nom }) {
    const content = templates.welcome({ prenom, nom });

    return this.sendMail({
      to,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
  }

  async sendOrderConfirmationEmail({ to, prenom, commande }) {
    const content = templates.orderConfirmation({ prenom, commande });

    return this.sendMail({
      to,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
  }

  async sendOrderCancellationEmail({ to, prenom, commande }) {
    const content = templates.orderCancellation({ prenom, commande });

    return this.sendMail({
      to,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
  }
}

const emailService = new EmailService({
  provider: process.env.EMAIL_PROVIDER || "log",
  apiKey: process.env.RESEND_API_KEY || "",
  from: process.env.EMAIL_FROM || "",
  contactTo: process.env.CONTACT_TO || "",
  logger: console,
});

module.exports = emailService;
module.exports.EmailService = EmailService;
module.exports.templates = templates;
module.exports.truncatePreview = truncatePreview;
