const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const {
  EmailService,
  truncatePreview,
} = require("./email.service");

describe("truncatePreview", () => {
  it("tronque une prévisualisation trop longue", () => {
    const preview = truncatePreview("a".repeat(100), 20);

    assert.equal(preview.length, 21);
    assert.match(preview, /…$/);
  });
});

describe("EmailService mode log", () => {
  it("envoie un résultat simulé sans appeler le réseau", async () => {
    const logs = [];
    const service = new EmailService({
      provider: "log",
      logger: {
        info: (...args) => logs.push(args),
      },
      idGenerator: () => "log-fixed-id",
    });

    const result = await service.sendMail({
      to: "client@example.com",
      subject: "Test",
      text: "Contenu confidentiel trop long pour être journalisé en entier ".repeat(
        3,
      ),
      html: "<p>secret</p>",
    });

    assert.deepEqual(result, {
      ok: true,
      provider: "log",
      id: "log-fixed-id",
    });
    assert.equal(logs.length, 1);
    assert.equal(logs[0][0], "[email:log]");
    assert.equal(logs[0][1].to, "client@example.com");
    assert.equal(logs[0][1].subject, "Test");
    assert.ok(logs[0][1].preview.length <= 81);
    assert.equal(logs[0][1].html, undefined);
    assert.equal(String(logs[0][1].preview).includes("<p>secret</p>"), false);
  });

  it("rejette un destinataire manquant", async () => {
    const service = new EmailService({ provider: "log" });

    await assert.rejects(
      () => service.sendMail({ subject: "Test", text: "Hello" }),
      { message: "Le destinataire de l'e-mail est obligatoire." },
    );
  });

  it("rejette un sujet manquant", async () => {
    const service = new EmailService({ provider: "log" });

    await assert.rejects(
      () => service.sendMail({ to: "a@b.c", text: "Hello" }),
      { message: "Le sujet de l'e-mail est obligatoire." },
    );
  });

  it("n'exige pas de clé API en mode log", async () => {
    const service = new EmailService({
      provider: "log",
      apiKey: "",
      idGenerator: () => "log-1",
      logger: { info() {} },
    });

    const result = await service.sendMail({
      to: "a@b.c",
      subject: "Sans clé",
      text: "ok",
    });

    assert.equal(result.ok, true);
    assert.equal(result.provider, "log");
  });
});

describe("EmailService mode resend", () => {
  it("exige RESEND_API_KEY", async () => {
    const service = new EmailService({
      provider: "resend",
      apiKey: "",
      from: "Vite & Gourmand <onboarding@resend.dev>",
    });

    await assert.rejects(
      () =>
        service.sendMail({
          to: "a@b.c",
          subject: "Test",
          text: "Hello",
        }),
      { message: "RESEND_API_KEY est obligatoire en mode resend." },
    );
  });

  it("exige EMAIL_FROM", async () => {
    const service = new EmailService({
      provider: "resend",
      apiKey: "re_test",
      from: "",
    });

    await assert.rejects(
      () =>
        service.sendMail({
          to: "a@b.c",
          subject: "Test",
          text: "Hello",
        }),
      { message: "EMAIL_FROM est obligatoire en mode resend." },
    );
  });

  it("utilise le client Resend injecté et normalise le résultat", async () => {
    const calls = [];
    const service = new EmailService({
      provider: "resend",
      apiKey: "re_test",
      from: "Vite & Gourmand <onboarding@resend.dev>",
      resendClient: {
        emails: {
          send: async (payload) => {
            calls.push(payload);
            return { data: { id: "re_123" }, error: null };
          },
        },
      },
    });

    const result = await service.sendMail({
      to: "client@example.com",
      subject: "Hello",
      text: "Texte",
      html: "<p>Texte</p>",
      replyTo: "reply@example.com",
    });

    assert.deepEqual(result, {
      ok: true,
      provider: "resend",
      id: "re_123",
    });
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0], {
      from: "Vite & Gourmand <onboarding@resend.dev>",
      to: "client@example.com",
      subject: "Hello",
      text: "Texte",
      html: "<p>Texte</p>",
      replyTo: "reply@example.com",
    });
  });

  it("propage les erreurs du fournisseur", async () => {
    const service = new EmailService({
      provider: "resend",
      apiKey: "re_test",
      from: "Vite & Gourmand <onboarding@resend.dev>",
      resendClient: {
        emails: {
          send: async () => ({
            data: null,
            error: { message: "API key is invalid" },
          }),
        },
      },
    });

    await assert.rejects(
      () =>
        service.sendMail({
          to: "a@b.c",
          subject: "Test",
          text: "Hello",
        }),
      { message: "API key is invalid" },
    );
  });
});

describe("EmailService helpers métier", () => {
  it("sendContactEmail utilise CONTACT_TO et le template de notification", async () => {
    const service = new EmailService({
      provider: "log",
      contactTo: "contact@example.com",
      idGenerator: () => "log-contact",
      logger: { info() {} },
    });

    const result = await service.sendContactEmail({
      nom: "Claire",
      email: "claire@example.com",
      message: "Bonjour",
    });

    assert.equal(result.id, "log-contact");
    assert.equal(result.provider, "log");
  });

  it("sendContactEmail exige CONTACT_TO", async () => {
    const service = new EmailService({
      provider: "log",
      contactTo: "",
    });

    await assert.rejects(
      () =>
        service.sendContactEmail({
          nom: "Claire",
          email: "claire@example.com",
          message: "Bonjour",
        }),
      {
        message:
          "CONTACT_TO est obligatoire pour le formulaire de contact.",
      },
    );
  });

  it("sendWelcomeEmail, sendOrderConfirmationEmail et sendOrderCancellationEmail fonctionnent en mode log", async () => {
    const service = new EmailService({
      provider: "log",
      idGenerator: () => "log-helper",
      logger: { info() {} },
    });

    const welcome = await service.sendWelcomeEmail({
      to: "claire@example.com",
      prenom: "Claire",
      nom: "Durand",
    });

    const confirmation = await service.sendOrderConfirmationEmail({
      to: "claire@example.com",
      prenom: "Claire",
      commande: {
        numero_commande: "CMD-1",
        statut: "En attente",
        date_prestation: "2026-09-01",
        nombre_personne: 10,
        prix_menu: 100,
        prix_livraison: 0,
      },
    });

    const cancellation = await service.sendOrderCancellationEmail({
      to: "claire@example.com",
      prenom: "Claire",
      commande: {
        numero_commande: "CMD-1",
        statut: "Annulée",
      },
    });

    assert.equal(welcome.ok, true);
    assert.equal(confirmation.ok, true);
    assert.equal(cancellation.ok, true);
  });
});
