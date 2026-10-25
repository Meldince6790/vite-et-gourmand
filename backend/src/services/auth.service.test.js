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
  telephone: "0611111111",
  ville: "Bordeaux",
  pays: "France",
  adresse_postale: "2 rue du Traiteur",
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
  telephone: "0622222222",
  ville: "Bordeaux",
  pays: "France",
  adresse_postale: "3 rue du Traiteur",
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
    assert.equal(result.telephone, ACTIVE_EMPLOYEE.telephone);
    assert.equal(result.ville, ACTIVE_EMPLOYEE.ville);
    assert.equal(result.pays, ACTIVE_EMPLOYEE.pays);
    assert.equal(result.adresse_postale, ACTIVE_EMPLOYEE.adresse_postale);
    assert.equal(result.actif, ACTIVE_EMPLOYEE.actif);
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
    assert.equal(result.telephone, ACTIVE_CLIENT.telephone);
    assert.equal(result.ville, ACTIVE_CLIENT.ville);
    assert.equal(result.pays, ACTIVE_CLIENT.pays);
    assert.equal(result.adresse_postale, ACTIVE_CLIENT.adresse_postale);
    assert.equal(result.actif, ACTIVE_CLIENT.actif);
  });

  it("returns profile fields without putting them in the JWT payload", async () => {
    mock.method(database, "query", async () => [[ACTIVE_CLIENT]]);
    mock.method(bcrypt, "compare", async () => true);

    let jwtPayload;
    mock.method(jwt, "sign", (payload) => {
      jwtPayload = payload;
      return "client-token";
    });

    const result = await authService.login(
      ACTIVE_CLIENT.email,
      "PlainPassword1!",
    );

    assert.deepEqual(jwtPayload, {
      utilisateur_id: 3,
      role_id: 1,
      email: ACTIVE_CLIENT.email,
    });
    assert.equal(result.telephone, "0622222222");
    assert.equal(result.ville, "Bordeaux");
    assert.equal(result.pays, "France");
    assert.equal(result.adresse_postale, "3 rue du Traiteur");
    assert.equal(result.actif, 1);
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
