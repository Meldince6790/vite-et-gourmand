const {
  describe,
  it,
  beforeEach,
  afterEach,
  after,
  mock,
} = require("node:test");
const assert = require("node:assert/strict");

const bcrypt = require("bcrypt");
const database = require("../config/database");
const Utilisateur = require("../models/utilisateur.model");
const {
  createUtilisateurService,
} = require("./utilisateur.service");

const VALID_PASSWORD = "MotDePasse1!";

function validClient(overrides = {}) {
  return {
    nom: "Durand",
    prenom: "Claire",
    email: "claire.durand@example.com",
    password: VALID_PASSWORD,
    telephone: "0622222222",
    adresse_postale: "3 rue du Traiteur",
    ...overrides,
  };
}

function createFakeEmailService() {
  const calls = {
    sendWelcomeEmail: [],
  };

  return {
    calls,
    emailService: {
      sendWelcomeEmail: async (payload) => {
        calls.sendWelcomeEmail.push(payload);
        return { ok: true, provider: "log", id: "log-test" };
      },
    },
  };
}

describe("utilisateurService.createUtilisateur", () => {
  let createdPayload;
  let hashCalls;
  let welcomeCalls;
  let utilisateurService;
  let logger;

  beforeEach(() => {
    createdPayload = null;
    hashCalls = [];
    const fakeMail = createFakeEmailService();
    welcomeCalls = fakeMail.calls.sendWelcomeEmail;
    logger = {
      errorCalls: [],
      error: (...args) => logger.errorCalls.push(args),
    };

    utilisateurService = createUtilisateurService({
      emailService: fakeMail.emailService,
      logger,
    });

    mock.method(Utilisateur, "findByEmail", async () => undefined);
    mock.method(Utilisateur, "create", async (utilisateur) => {
      createdPayload = utilisateur;
      return 42;
    });
    mock.method(bcrypt, "hash", async (password, rounds) => {
      hashCalls.push({ password, rounds });
      return "hashed-password";
    });
  });

  afterEach(() => {
    mock.restoreAll();
  });

  after(async () => {
    await database.end().catch(() => {});
  });

  it("crée un client avec succès et envoie l'e-mail de bienvenue", async () => {
    const id = await utilisateurService.createUtilisateur(validClient());

    assert.equal(id, 42);
    assert.equal(createdPayload.role_id, 1);
    assert.equal(createdPayload.actif, true);
    assert.equal(createdPayload.email, "claire.durand@example.com");
    assert.equal(createdPayload.nom, "Durand");
    assert.equal(createdPayload.prenom, "Claire");
    assert.equal(welcomeCalls.length, 1);
    assert.deepEqual(welcomeCalls[0], {
      to: "claire.durand@example.com",
      prenom: "Claire",
      nom: "Durand",
    });
  });

  it("reste non bloquant si l'e-mail de bienvenue échoue", async () => {
    utilisateurService = createUtilisateurService({
      emailService: {
        sendWelcomeEmail: async () => {
          throw new Error("Resend unavailable");
        },
      },
      logger,
    });

    const id = await utilisateurService.createUtilisateur(validClient());

    assert.equal(id, 42);
    assert.equal(createdPayload.role_id, 1);
    assert.equal(logger.errorCalls.length, 1);
    assert.match(String(logger.errorCalls[0][0]), /bienvenue/i);
  });

  it("rejette si le nom est manquant sans envoyer d'e-mail", async () => {
    await assert.rejects(
      () => utilisateurService.createUtilisateur(validClient({ nom: "   " })),
      { message: "Le nom est obligatoire." },
    );
    assert.equal(createdPayload, null);
    assert.equal(welcomeCalls.length, 0);
  });

  it("rejette si le prénom est manquant", async () => {
    await assert.rejects(
      () =>
        utilisateurService.createUtilisateur(validClient({ prenom: undefined })),
      { message: "Le prénom est obligatoire." },
    );
    assert.equal(createdPayload, null);
    assert.equal(welcomeCalls.length, 0);
  });

  it("rejette si l'email est manquant", async () => {
    await assert.rejects(
      () => utilisateurService.createUtilisateur(validClient({ email: "" })),
      { message: "L'adresse e-mail est obligatoire." },
    );
    assert.equal(createdPayload, null);
    assert.equal(welcomeCalls.length, 0);
  });

  it("rejette si le mot de passe est manquant", async () => {
    await assert.rejects(
      () =>
        utilisateurService.createUtilisateur(validClient({ password: "" })),
      { message: "Le mot de passe est obligatoire." },
    );
    assert.equal(createdPayload, null);
    assert.equal(welcomeCalls.length, 0);
  });

  it("rejette si le mot de passe est invalide", async () => {
    await assert.rejects(
      () =>
        utilisateurService.createUtilisateur(
          validClient({ password: "tropcourt" }),
        ),
      { message: "Le mot de passe ne respecte pas les règles de sécurité." },
    );
    assert.equal(createdPayload, null);
    assert.equal(welcomeCalls.length, 0);
  });

  it("rejette si l'email est déjà utilisé sans envoyer d'e-mail", async () => {
    mock.restoreAll();
    mock.method(Utilisateur, "findByEmail", async () => ({
      utilisateur_id: 1,
      email: "claire.durand@example.com",
    }));
    mock.method(Utilisateur, "create", async (utilisateur) => {
      createdPayload = utilisateur;
      return 42;
    });
    mock.method(bcrypt, "hash", async () => "hashed-password");

    await assert.rejects(
      () => utilisateurService.createUtilisateur(validClient()),
      { message: "Cette adresse e-mail est déjà utilisée." },
    );
    assert.equal(createdPayload, null);
    assert.equal(welcomeCalls.length, 0);
  });

  it("n'envoie pas d'e-mail si l'insertion SQL échoue", async () => {
    mock.restoreAll();
    mock.method(Utilisateur, "findByEmail", async () => undefined);
    mock.method(Utilisateur, "create", async () => {
      throw new Error("insert failed");
    });
    mock.method(bcrypt, "hash", async () => "hashed-password");

    await assert.rejects(
      () => utilisateurService.createUtilisateur(validClient()),
      { message: "insert failed" },
    );
    assert.equal(welcomeCalls.length, 0);
  });

  it("force role_id = 1 même si le body contient role_id = 3", async () => {
    await utilisateurService.createUtilisateur(
      validClient({ role_id: 3 }),
    );

    assert.equal(createdPayload.role_id, 1);
  });

  it("hash le mot de passe avant insertion", async () => {
    await utilisateurService.createUtilisateur(validClient());

    assert.equal(hashCalls.length, 1);
    assert.equal(hashCalls[0].password, VALID_PASSWORD);
    assert.equal(hashCalls[0].rounds, 10);
    assert.equal(createdPayload.password, "hashed-password");
  });
});

describe("utilisateurService.createEmploye", () => {
  let welcomeCalls;
  let utilisateurService;

  beforeEach(() => {
    const fakeMail = createFakeEmailService();
    welcomeCalls = fakeMail.calls.sendWelcomeEmail;

    utilisateurService = createUtilisateurService({
      emailService: fakeMail.emailService,
      logger: { error() {} },
    });

    mock.method(Utilisateur, "findByEmail", async () => undefined);
    mock.method(Utilisateur, "create", async () => 99);
    mock.method(bcrypt, "hash", async () => "hashed-password");
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it("ne déclenche aucun e-mail de bienvenue client", async () => {
    const id = await utilisateurService.createEmploye({
      email: "employe@example.com",
      password: VALID_PASSWORD,
      nom: "Martin",
      prenom: "Julie",
    });

    assert.equal(id, 99);
    assert.equal(welcomeCalls.length, 0);
  });
});
