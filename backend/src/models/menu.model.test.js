const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { createMenuModel } = require("./menu.model");

function createFakeDatabase(handlers) {
  const calls = [];

  return {
    calls,
    query: async (sql, params) => {
      calls.push({ sql, params });

      for (const handler of handlers) {
        if (handler.match(sql, params)) {
          return handler.result;
        }
      }

      throw new Error(`Requête non mockée : ${sql}`);
    },
  };
}

describe("Menu.findById", () => {
  it("retourne le menu avec plats et allergènes enrichis", async () => {
    const database = createFakeDatabase([
      {
        match: (sql) =>
          String(sql).includes("FROM menu") &&
          String(sql).includes("WHERE menu.menu_id"),
        result: [
          [
            {
              menu_id: 1,
              titre: "Menu Entreprise Classique",
              description: "Description",
              prix_par_personne: 35,
              nombre_personne_minimum: 10,
              quantite_restante: 50,
              conditions: "Commande minimum de 10 personnes.",
              regime: "Classique",
              theme: "Entreprise",
            },
          ],
        ],
      },
      {
        match: (sql) => String(sql).includes("FROM menu_plat"),
        result: [
          [
            {
              plat_id: 1,
              titre_plat: "Salade périgourdine",
              photo: null,
            },
            {
              plat_id: 4,
              titre_plat: "Filet de poulet sauce forestière",
              photo: null,
            },
          ],
        ],
      },
      {
        match: (sql) => String(sql).includes("FROM plat_allergene"),
        result: [
          [
            { plat_id: 1, allergene_id: 3, libelle: "Fruits à coque" },
            { plat_id: 4, allergene_id: 2, libelle: "Lait" },
          ],
        ],
      },
    ]);

    const Menu = createMenuModel(database);
    const menu = await Menu.findById(1);

    assert.equal(menu.menu_id, 1);
    assert.equal(menu.titre, "Menu Entreprise Classique");
    assert.equal(menu.plats.length, 2);
    assert.deepEqual(menu.plats[0], {
      plat_id: 1,
      titre_plat: "Salade périgourdine",
      photo: null,
      allergenes: [{ allergene_id: 3, libelle: "Fruits à coque" }],
    });
    assert.deepEqual(menu.plats[1].allergenes, [
      { allergene_id: 2, libelle: "Lait" },
    ]);
    assert.equal(database.calls.length, 3);
    assert.deepEqual(database.calls[2].params, [1, 4]);
  });

  it("retourne un tableau allergenes vide pour un plat sans allergène", async () => {
    const database = createFakeDatabase([
      {
        match: (sql) =>
          String(sql).includes("FROM menu") &&
          String(sql).includes("WHERE menu.menu_id"),
        result: [[{ menu_id: 2, titre: "Menu Végétarien" }]],
      },
      {
        match: (sql) => String(sql).includes("FROM menu_plat"),
        result: [
          [
            {
              plat_id: 9,
              titre_plat: "Salade de fruits frais",
              photo: null,
            },
          ],
        ],
      },
      {
        match: (sql) => String(sql).includes("FROM plat_allergene"),
        result: [[]],
      },
    ]);

    const Menu = createMenuModel(database);
    const menu = await Menu.findById(2);

    assert.equal(menu.plats.length, 1);
    assert.deepEqual(menu.plats[0].allergenes, []);
  });

  it("retourne un menu sans plat avec plats = [] sans requête allergènes", async () => {
    const database = createFakeDatabase([
      {
        match: (sql) =>
          String(sql).includes("FROM menu") &&
          String(sql).includes("WHERE menu.menu_id"),
        result: [[{ menu_id: 3, titre: "Menu vide" }]],
      },
      {
        match: (sql) => String(sql).includes("FROM menu_plat"),
        result: [[]],
      },
    ]);

    const Menu = createMenuModel(database);
    const menu = await Menu.findById(3);

    assert.deepEqual(menu.plats, []);
    assert.equal(database.calls.length, 2);
    assert.equal(
      database.calls.some((call) =>
        String(call.sql).includes("FROM plat_allergene"),
      ),
      false,
    );
  });

  it("retourne null si le menu est introuvable", async () => {
    const database = createFakeDatabase([
      {
        match: (sql) =>
          String(sql).includes("FROM menu") &&
          String(sql).includes("WHERE menu.menu_id"),
        result: [[]],
      },
    ]);

    const Menu = createMenuModel(database);
    const menu = await Menu.findById(999);

    assert.equal(menu, null);
    assert.equal(database.calls.length, 1);
  });

  it("conserve les champs menu existants du détail", async () => {
    const database = createFakeDatabase([
      {
        match: (sql) =>
          String(sql).includes("FROM menu") &&
          String(sql).includes("WHERE menu.menu_id"),
        result: [
          [
            {
              menu_id: 1,
              titre: "Menu Entreprise Classique",
              description: "Description",
              prix_par_personne: 35,
              nombre_personne_minimum: 10,
              quantite_restante: 50,
              conditions: "Commande minimum de 10 personnes.",
              regime_id: 1,
              theme_id: 2,
              regime: "Classique",
              theme: "Entreprise",
            },
          ],
        ],
      },
      {
        match: (sql) => String(sql).includes("FROM menu_plat"),
        result: [[]],
      },
    ]);

    const Menu = createMenuModel(database);
    const menu = await Menu.findById(1);

    assert.equal(menu.regime, "Classique");
    assert.equal(menu.theme, "Entreprise");
    assert.equal(menu.quantite_restante, 50);
    assert.equal(menu.conditions, "Commande minimum de 10 personnes.");
    assert.equal(menu.prix_par_personne, 35);
    assert.equal(menu.nombre_personne_minimum, 10);
    assert.ok(Array.isArray(menu.plats));
  });
});
