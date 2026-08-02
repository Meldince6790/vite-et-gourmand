const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const {
  createContactController,
} = require("./contact.controller");

function createMockResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe("contact.controller", () => {
  it("rejette un nom manquant", async () => {
    const controller = createContactController({
      emailService: {
        sendContactEmail: async () => {
          throw new Error("ne doit pas être appelé");
        },
      },
    });
    const res = createMockResponse();

    await controller.send(
      { body: { nom: "  ", email: "a@b.c", message: "Bonjour" } },
      res,
    );

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { message: "Le nom est obligatoire." });
  });

  it("rejette un email invalide", async () => {
    const controller = createContactController({
      emailService: {
        sendContactEmail: async () => {
          throw new Error("ne doit pas être appelé");
        },
      },
    });
    const res = createMockResponse();

    await controller.send(
      { body: { nom: "Claire", email: "invalide", message: "Bonjour" } },
      res,
    );

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
      message: "L'adresse e-mail est invalide.",
    });
  });

  it("rejette un message manquant", async () => {
    const controller = createContactController({
      emailService: {
        sendContactEmail: async () => {
          throw new Error("ne doit pas être appelé");
        },
      },
    });
    const res = createMockResponse();

    await controller.send(
      { body: { nom: "Claire", email: "claire@example.com", message: "   " } },
      res,
    );

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { message: "Le message est obligatoire." });
  });

  it("retourne 201 et envoie l'accusé en best-effort", async () => {
    const calls = [];
    const controller = createContactController({
      emailService: {
        sendContactEmail: async (payload) => {
          calls.push(["contact", payload]);
          return { ok: true };
        },
        sendContactAcknowledgementEmail: async (payload) => {
          calls.push(["ack", payload]);
          return { ok: true };
        },
      },
    });
    const res = createMockResponse();

    await controller.send(
      {
        body: {
          nom: "  Claire  ",
          email: " claire@example.com ",
          message: " Bonjour ",
        },
      },
      res,
    );

    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.body, {
      message: "Message envoyé avec succès.",
    });
    assert.deepEqual(calls, [
      [
        "contact",
        {
          nom: "Claire",
          email: "claire@example.com",
          message: "Bonjour",
        },
      ],
      [
        "ack",
        {
          to: "claire@example.com",
          nom: "Claire",
        },
      ],
    ]);
  });

  it("retourne 502 générique si l'envoi principal échoue", async () => {
    const logs = [];
    const controller = createContactController({
      emailService: {
        sendContactEmail: async () => {
          throw new Error("API key is invalid");
        },
        sendContactAcknowledgementEmail: async () => {
          throw new Error("ne doit pas être appelé");
        },
      },
      logger: {
        error: (...args) => logs.push(args),
      },
    });
    const res = createMockResponse();

    await controller.send(
      {
        body: {
          nom: "Claire",
          email: "claire@example.com",
          message: "Bonjour",
        },
      },
      res,
    );

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body, {
      message: "Impossible d’envoyer le message pour le moment.",
    });
    assert.equal(logs.length, 1);
    assert.equal(
      String(res.body.message).includes("API key is invalid"),
      false,
    );
  });

  it("retourne 201 si l'accusé échoue", async () => {
    const logs = [];
    const controller = createContactController({
      emailService: {
        sendContactEmail: async () => ({ ok: true }),
        sendContactAcknowledgementEmail: async () => {
          throw new Error("ack failed");
        },
      },
      logger: {
        error: (...args) => logs.push(args),
      },
    });
    const res = createMockResponse();

    await controller.send(
      {
        body: {
          nom: "Claire",
          email: "claire@example.com",
          message: "Bonjour",
        },
      },
      res,
    );

    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.body, {
      message: "Message envoyé avec succès.",
    });
    assert.equal(logs.length, 1);
    assert.match(String(logs[0][0]), /accusé/i);
  });
});
