const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { createAvisService } = require("./avis.service");

function createMocks({
  commandesTerminees = [{ commande_id: 1 }],
  avisActifs = [],
} = {}) {
  const createCalls = [];
  const queries = [];

  const getAllCalls = [];
  const getByIdCalls = [];

  const avisModel = {
    create: async (payload) => {
      createCalls.push(payload);
      return 42;
    },
    getAll: async (options) => {
      getAllCalls.push(options);
      return [];
    },
    getById: async (id, options) => {
      getByIdCalls.push({ id, options });
      return null;
    },
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

  return {
    service,
    createCalls,
    getAllCalls,
    getByIdCalls,
    queries,
    avisModel,
    database,
  };
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

describe("avisService.getAll / getById", () => {
  it("filtre les avis Validé en mode public", async () => {
    const { service, getAllCalls } = createMocks();

    await service.getAll({ publicOnly: true });

    assert.deepEqual(getAllCalls[0], { statut: "Validé" });
  });

  it("ne filtre pas sans publicOnly", async () => {
    const { service, getAllCalls } = createMocks();

    await service.getAll();

    assert.equal(getAllCalls[0], undefined);
  });

  it("filtre getById en mode public", async () => {
    const { service, getByIdCalls } = createMocks();

    await service.getById(7, { publicOnly: true });

    assert.deepEqual(getByIdCalls[0], {
      id: 7,
      options: { statut: "Validé" },
    });
  });
});

describe("avisService.update", () => {
  it("refuse un corps sans champ modifiable avant tout appel au modèle", async () => {
    for (const body of [{}, [], null, undefined, "x", { autre: 1 }]) {
      let updateCalls = 0;
      const { service, avisModel } = createMocks();
      avisModel.update = async () => {
        updateCalls += 1;
        return 1;
      };

      await assert.rejects(
        service.update(1, body),
        /Aucune donnée modifiable n'a été fournie\./,
      );
      assert.equal(updateCalls, 0);
    }
  });

  it("refuse un statut vide ou invalide", async () => {
    const { service } = createMocks();

    for (const statut of ["", null, 0, false, "Inconnu", ["Validé"], {}]) {
      await assert.rejects(
        service.update(1, { statut }),
        /Statut d'avis invalide\./,
      );
    }
  });

  it("refuse une description qui n'est pas un texte", async () => {
    const { service } = createMocks();

    for (const description of [{}, { a: 1 }, ["x"], null, 12, true]) {
      await assert.rejects(
        service.update(1, { description }),
        /Le commentaire doit être un texte\./,
      );
    }
  });

  it("transmet inchangés les champs valides au modèle", async () => {
    const received = [];
    const { service, avisModel } = createMocks();
    avisModel.update = async (id, data) => {
      received.push({ id, data });
      return 1;
    };

    await service.update(5, { note: "4", description: "Bien", statut: "Validé" });
    await service.update(5, { statut: "Refusé" });
    await service.update(5, { description: "" });

    assert.deepEqual(received, [
      { id: 5, data: { note: 4, description: "Bien", statut: "Validé" } },
      { id: 5, data: { statut: "Refusé" } },
      { id: 5, data: { description: "" } },
    ]);
  });

  it("conserve les contrôles existants sur la note", async () => {
    const { service } = createMocks();

    await assert.rejects(
      service.update(1, { note: 9 }),
      /La note doit être comprise entre 1 et 5\./,
    );
  });
});
