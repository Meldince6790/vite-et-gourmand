const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { createAvisService } = require("./avis.service");

function createMocks({
  commandesTerminees = [{ commande_id: 1 }],
  avisActifs = [],
} = {}) {
  const createCalls = [];
  const queries = [];

  const avisModel = {
    create: async (payload) => {
      createCalls.push(payload);
      return 42;
    },
    getAll: async () => [],
    getById: async () => null,
    update: async () => 1,
    delete: async () => 1,
  };

  const database = {
    query: async (sql, params) => {
      queries.push({ sql, params });

      if (String(sql).includes("FROM commande")) {
        return [commandesTerminees];
      }

      if (String(sql).includes("FROM avis")) {
        return [avisActifs];
      }

      return [[]];
    },
  };

  const service = createAvisService({ avisModel, database });

  return { service, createCalls, queries, avisModel, database };
}

describe("avisService.create", () => {
  const baseInput = () => ({
    utilisateur_id: 3,
    note: 5,
    description: "  Excellent service.  ",
  });

  it("crée un avis valide avec description trimée et statut En attente", async () => {
    const { service, createCalls } = createMocks();

    const id = await service.create(baseInput());

    assert.equal(id, 42);
    assert.equal(createCalls.length, 1);
    assert.deepEqual(createCalls[0], {
      note: 5,
      description: "Excellent service.",
      statut: "En attente",
      utilisateur_id: 3,
    });
  });

  it("ignore le statut Validé fourni dans le body", async () => {
    const { service, createCalls } = createMocks();

    await service.create({
      ...baseInput(),
      statut: "Validé",
    });

    assert.equal(createCalls[0].statut, "En attente");
  });

  it("rejette une note absente", async () => {
    const { service, createCalls } = createMocks();
    const input = baseInput();
    delete input.note;

    await assert.rejects(() => service.create(input), {
      message: "La note est obligatoire.",
    });
    assert.equal(createCalls.length, 0);
  });

  it("rejette une note hors limites", async () => {
    const { service, createCalls } = createMocks();

    await assert.rejects(
      () => service.create({ ...baseInput(), note: 6 }),
      { message: "La note doit être comprise entre 1 et 5." },
    );
    await assert.rejects(
      () => service.create({ ...baseInput(), note: 3.5 }),
      { message: "La note doit être comprise entre 1 et 5." },
    );
    assert.equal(createCalls.length, 0);
  });

  it("rejette une description vide ou uniquement des espaces", async () => {
    const { service, createCalls } = createMocks();

    await assert.rejects(
      () => service.create({ ...baseInput(), description: "   " }),
      { message: "Le commentaire est obligatoire." },
    );
    await assert.rejects(
      () => service.create({ ...baseInput(), description: "" }),
      { message: "Le commentaire est obligatoire." },
    );
    assert.equal(createCalls.length, 0);
  });

  it("rejette une description supérieure à 500 caractères", async () => {
    const { service, createCalls } = createMocks();

    await assert.rejects(
      () =>
        service.create({
          ...baseInput(),
          description: "a".repeat(501),
        }),
      { message: "Le commentaire ne peut pas dépasser 500 caractères." },
    );
    assert.equal(createCalls.length, 0);
  });

  it("rejette si aucune commande terminée", async () => {
    const { service, createCalls } = createMocks({
      commandesTerminees: [],
    });

    await assert.rejects(() => service.create(baseInput()), {
      message:
        "Impossible de déposer un avis : aucune commande terminée trouvée.",
    });
    assert.equal(createCalls.length, 0);
  });

  it("rejette si un avis actif existe déjà", async () => {
    const { service, createCalls, queries } = createMocks({
      avisActifs: [{ avis_id: 9 }],
    });

    await assert.rejects(() => service.create(baseInput()), {
      message: "Vous avez déjà déposé un avis en attente ou validé.",
    });
    assert.equal(createCalls.length, 0);
    assert.ok(
      queries.some((query) => String(query.sql).includes("FROM avis")),
    );
  });

  it("autorise un nouveau dépôt si seuls des avis refusés existent", async () => {
    const { service, createCalls } = createMocks({
      avisActifs: [],
    });

    const id = await service.create(baseInput());

    assert.equal(id, 42);
    assert.equal(createCalls.length, 1);
    assert.equal(createCalls[0].statut, "En attente");
  });
});
