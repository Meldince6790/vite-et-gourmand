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
const utilisateurService = require("./utilisateur.service");

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

describe("utilisateurService.createUtilisateur", () => {
  let createdPayload;
  let hashCalls;

  beforeEach(() => {
    createdPayload = null;
    hashCalls = [];

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

  it("crée un client avec succès", async () => {
    const id = await utilisateurService.createUtilisateur(validClient());

    assert.equal(id, 42);
    assert.equal(createdPayload.role_id, 1);
    assert.equal(createdPayload.actif, true);
    assert.equal(createdPayload.email, "claire.durand@example.com");
    assert.equal(createdPayload.nom, "Durand");
    assert.equal(createdPayload.prenom, "Claire");
  });

  it("rejette si le nom est manquant", async () => {
    await assert.rejects(
      () => utilisateurService.createUtilisateur(validClient({ nom: "   " })),
      { message: "Le nom est obligatoire." },
    );
    assert.equal(createdPayload, null);
  });

  it("rejette si le prénom est manquant", async () => {
    await assert.rejects(
      () =>
        utilisateurService.createUtilisateur(validClient({ prenom: undefined })),
      { message: "Le prénom est obligatoire." },
    );
    assert.equal(createdPayload, null);
  });

  it("rejette si l'email est manquant", async () => {
    await assert.rejects(
      () => utilisateurService.createUtilisateur(validClient({ email: "" })),
      { message: "L'adresse e-mail est obligatoire." },
    );
    assert.equal(createdPayload, null);
  });

  it("rejette si le mot de passe est manquant", async () => {
    await assert.rejects(
      () =>
        utilisateurService.createUtilisateur(validClient({ password: "" })),
      { message: "Le mot de passe est obligatoire." },
    );
    assert.equal(createdPayload, null);
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
  });

  it("rejette si l'email est déjà utilisé", async () => {
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
