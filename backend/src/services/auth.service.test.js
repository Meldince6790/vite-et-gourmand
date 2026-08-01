const {
  describe,
  it,
  afterEach,
  after,
  mock,
} = require("node:test");
const assert = require("node:assert/strict");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const database = require("../config/database");
const authService = require("./auth.service");

const ACTIVE_EMPLOYEE = {
  utilisateur_id: 2,
  email: "employe@vite-gourmand.fr",
  password: "hashed-password",
  nom: "Martin",
  prenom: "Julie",
  role_id: 2,
  actif: 1,
};

const INACTIVE_EMPLOYEE = {
  ...ACTIVE_EMPLOYEE,
  actif: 0,
};

const ACTIVE_CLIENT = {
  utilisateur_id: 3,
  email: "client@vite-gourmand.fr",
  password: "hashed-password",
  nom: "Durand",
  prenom: "Claire",
  role_id: 1,
  actif: 1,
};

describe("authService.login", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  after(async () => {
    await database.end().catch(() => {});
  });

  it("resolves with a token for an active employee with a valid password", async () => {
    mock.method(database, "query", async () => [[ACTIVE_EMPLOYEE]]);
    mock.method(bcrypt, "compare", async () => true);
    mock.method(jwt, "sign", () => "test-token");

    const result = await authService.login(
      ACTIVE_EMPLOYEE.email,
      "PlainPassword1!",
    );

    assert.equal(result.token, "test-token");
    assert.equal(result.role_id, 2);
    assert.equal(result.utilisateur_id, 2);
    assert.equal(result.email, ACTIVE_EMPLOYEE.email);
  });

  it("rejects with Identifiants incorrects. for an inactive employee with a valid password", async () => {
    mock.method(database, "query", async () => [[INACTIVE_EMPLOYEE]]);
    mock.method(bcrypt, "compare", async () => true);
    mock.method(jwt, "sign", () => "test-token");

    await assert.rejects(
      () => authService.login(INACTIVE_EMPLOYEE.email, "PlainPassword1!"),
      { message: "Identifiants incorrects." },
    );
  });

  it("rejects with Identifiants incorrects. for an inactive employee with an invalid password", async () => {
    mock.method(database, "query", async () => [[INACTIVE_EMPLOYEE]]);
    mock.method(bcrypt, "compare", async () => false);
    mock.method(jwt, "sign", () => "test-token");

    await assert.rejects(
      () => authService.login(INACTIVE_EMPLOYEE.email, "WrongPassword1!"),
      { message: "Identifiants incorrects." },
    );
  });

  it("resolves for an active client with a valid password", async () => {
    mock.method(database, "query", async () => [[ACTIVE_CLIENT]]);
    mock.method(bcrypt, "compare", async () => true);
    mock.method(jwt, "sign", () => "client-token");

    const result = await authService.login(
      ACTIVE_CLIENT.email,
      "PlainPassword1!",
    );

    assert.equal(result.token, "client-token");
    assert.equal(result.role_id, 1);
    assert.equal(result.utilisateur_id, 3);
  });

  it("rejects with Identifiants incorrects. for an unknown email", async () => {
    mock.method(database, "query", async () => [[]]);
    mock.method(bcrypt, "compare", async () => true);
    mock.method(jwt, "sign", () => "test-token");

    await assert.rejects(
      () => authService.login("inconnu@example.com", "PlainPassword1!"),
      { message: "Identifiants incorrects." },
    );
  });

  it("rejects with Identifiants incorrects. for an active user with a wrong password", async () => {
    mock.method(database, "query", async () => [[ACTIVE_EMPLOYEE]]);
    mock.method(bcrypt, "compare", async () => false);
    mock.method(jwt, "sign", () => "test-token");

    await assert.rejects(
      () => authService.login(ACTIVE_EMPLOYEE.email, "WrongPassword1!"),
      { message: "Identifiants incorrects." },
    );
  });
});
