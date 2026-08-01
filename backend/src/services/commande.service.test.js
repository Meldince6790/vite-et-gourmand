const {
  describe,
  it,
  beforeEach,
  afterEach,
  after,
  mock,
} = require("node:test");
const assert = require("node:assert/strict");

const Commande = require("../models/commande.model");
const database = require("../config/database");
const commandeService = require("./commande.service");

const ORDER = {
  commande_id: 1,
  utilisateur_id: 10,
  menu_id: 1,
  statut: "En attente",
};

describe("commandeService.getCommandeById", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  after(async () => {
    await database.end();
  });

  beforeEach(() => {
    mock.method(Commande, "findById", async () => ORDER);
  });

  it("returns the order for the owning client (role_id 1)", async () => {
    const user = { role_id: 1, utilisateur_id: 10 };

    const result = await commandeService.getCommandeById(1, user);

    assert.equal(result, ORDER);
  });

  it("rejects with Commande introuvable. for a different client (role_id 1)", async () => {
    const user = { role_id: 1, utilisateur_id: 99 };

    await assert.rejects(
      () => commandeService.getCommandeById(1, user),
      { message: "Commande introuvable." },
    );
  });

  it("returns the order for an employee (role_id 2)", async () => {
    const user = { role_id: 2, utilisateur_id: 99 };

    const result = await commandeService.getCommandeById(1, user);

    assert.equal(result, ORDER);
  });

  it("returns the order for an administrator (role_id 3)", async () => {
    const user = { role_id: 3, utilisateur_id: 99 };

    const result = await commandeService.getCommandeById(1, user);

    assert.equal(result, ORDER);
  });

  it("rejects with Commande introuvable. when the order is missing", async () => {
    mock.restoreAll();
    mock.method(Commande, "findById", async () => undefined);

    const user = { role_id: 1, utilisateur_id: 10 };

    await assert.rejects(
      () => commandeService.getCommandeById(1, user),
      { message: "Commande introuvable." },
    );
  });

  it("rejects with Commande introuvable. for an unsupported role", async () => {
    const user = { role_id: 99, utilisateur_id: 10 };

    await assert.rejects(
      () => commandeService.getCommandeById(1, user),
      { message: "Commande introuvable." },
    );
  });
});
