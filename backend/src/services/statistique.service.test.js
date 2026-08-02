const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { createStatistiqueService } = require("./statistique.service");

const COMMANDE = {
  menu_id: 1,
  date_commande: "2026-08-02T12:00:00.000Z",
  prix_menu: 100,
  prix_livraison: 10,
};

const MENU = {
  titre: "Menu Test",
};

function createDocument(initial = {}) {
  const doc = {
    menu_id: 1,
    nom_menu: "Menu Test",
    nombre_commandes: 2,
    chiffre_affaires: 220,
    periode: "2026-08",
    ...initial,
    async save() {
      doc.saveCalls = (doc.saveCalls || 0) + 1;
      return doc;
    },
  };

  return doc;
}

function createModelMock({ existing = null } = {}) {
  const created = [];
  const finds = [];

  function StatistiqueModel(data) {
    const doc = createDocument(data);
    created.push(doc);
    return doc;
  }

  StatistiqueModel.findOne = async (query) => {
    finds.push(query);
    return existing;
  };

  StatistiqueModel.find = async () => [];
  StatistiqueModel.aggregate = async () => [];
  StatistiqueModel.deleteMany = async () => {
    throw new Error("deleteMany ne doit pas être appelé");
  };
  StatistiqueModel.deleteOne = async () => {
    throw new Error("deleteOne ne doit pas être appelé");
  };

  return { StatistiqueModel, created, finds };
}

function createStoreMock(initialDocs = []) {
  const docs = initialDocs.map((data) => createDocument(data));
  const deleteCalls = [];

  function StatistiqueModel(data) {
    const doc = createDocument(data);
    doc._pendingInsert = true;

    const baseSave = doc.save.bind(doc);
    doc.save = async () => {
      if (doc._pendingInsert) {
        docs.push(doc);
        doc._pendingInsert = false;
      }
      return baseSave();
    };

    return doc;
  }

  StatistiqueModel.findOne = async ({ menu_id, periode }) =>
    docs.find(
      (doc) =>
        Number(doc.menu_id) === Number(menu_id) && doc.periode === periode,
    ) || null;

  StatistiqueModel.find = async () => [...docs];

  StatistiqueModel.deleteMany = async (...args) => {
    deleteCalls.push(["deleteMany", ...args]);
    return { deletedCount: 0 };
  };

  StatistiqueModel.deleteOne = async (...args) => {
    deleteCalls.push(["deleteOne", ...args]);
    return { deletedCount: 0 };
  };

  StatistiqueModel.findByIdAndDelete = async (...args) => {
    deleteCalls.push(["findByIdAndDelete", ...args]);
    return null;
  };

  return { StatistiqueModel, docs, deleteCalls };
}

describe("StatistiqueService.appliquerDeltaStatistique / façades", () => {
  it("updateStatistiqueCommande crée un document (+1)", async () => {
    const { StatistiqueModel, created, finds } = createModelMock({
      existing: null,
    });
    const service = createStatistiqueService({ StatistiqueModel });

    const result = await service.updateStatistiqueCommande(COMMANDE, MENU);

    assert.equal(finds.length, 1);
    assert.deepEqual(finds[0], { menu_id: 1, periode: "2026-08" });
    assert.equal(created.length, 1);
    assert.equal(result.nombre_commandes, 1);
    assert.equal(result.chiffre_affaires, 110);
    assert.equal(result.nom_menu, "Menu Test");
    assert.equal(result.periode, "2026-08");
  });

  it("updateStatistiqueCommande incrémente un document existant (+1)", async () => {
    const existing = createDocument();
    const { StatistiqueModel, created } = createModelMock({ existing });
    const service = createStatistiqueService({ StatistiqueModel });

    const result = await service.updateStatistiqueCommande(COMMANDE, MENU);

    assert.equal(created.length, 0);
    assert.equal(result.nombre_commandes, 3);
    assert.equal(result.chiffre_affaires, 330);
    assert.equal(existing.saveCalls, 1);
  });

  it("retirerStatistiqueCommande décrémente un document (-1)", async () => {
    const existing = createDocument();
    const { StatistiqueModel, created } = createModelMock({ existing });
    const service = createStatistiqueService({ StatistiqueModel });

    const result = await service.retirerStatistiqueCommande(COMMANDE);

    assert.equal(created.length, 0);
    assert.equal(result.nombre_commandes, 1);
    assert.equal(result.chiffre_affaires, 110);
  });

  it("retirerStatistiqueCommande sans document : warning et no-op", async () => {
    const warnings = [];
    const { StatistiqueModel, created } = createModelMock({ existing: null });
    const service = createStatistiqueService({
      StatistiqueModel,
      logger: {
        warn: (...args) => warnings.push(args),
        error: () => {},
      },
    });

    const result = await service.retirerStatistiqueCommande(COMMANDE);

    assert.equal(result, null);
    assert.equal(created.length, 0);
    assert.equal(warnings.length, 1);
    assert.match(String(warnings[0][0]), /introuvable/);
  });

  it("empêche les valeurs négatives après décrément", async () => {
    const existing = createDocument({
      nombre_commandes: 0,
      chiffre_affaires: 50,
    });
    const { StatistiqueModel } = createModelMock({ existing });
    const service = createStatistiqueService({ StatistiqueModel });

    const result = await service.retirerStatistiqueCommande(COMMANDE);

    assert.equal(result.nombre_commandes, 0);
    assert.equal(result.chiffre_affaires, 0);
  });
});

describe("StatistiqueService.recalculerStatistiques", () => {
  const commandesActives = [
    {
      commande_id: 1,
      menu_id: 1,
      date_commande: "2026-07-10",
      prix_menu: 787,
      prix_livraison: 15,
      nom_menu: "Menu Entreprise Classique",
    },
    {
      commande_id: 7,
      menu_id: 1,
      date_commande: "2026-08-02",
      prix_menu: 472.5,
      prix_livraison: 0,
      nom_menu: "Menu Entreprise Classique",
    },
  ];

  it("ignore les commandes annulées si elles ne sont pas fournies", async () => {
    const { StatistiqueModel, docs } = createStoreMock();
    const service = createStatistiqueService({ StatistiqueModel });

    const rapport = await service.recalculerStatistiques(commandesActives);

    assert.equal(rapport.commandesLues, 2);
    assert.equal(rapport.agregatsCalcules, 2);
    assert.equal(docs.length, 2);
    assert.equal(
      docs.reduce((sum, doc) => sum + doc.nombre_commandes, 0),
      2,
    );
  });

  it("agrège par menu et période avec un CA correct", async () => {
    const { StatistiqueModel, docs } = createStoreMock();
    const service = createStatistiqueService({ StatistiqueModel });

    await service.recalculerStatistiques([
      ...commandesActives,
      {
        commande_id: 8,
        menu_id: 1,
        date_commande: "2026-08-15",
        prix_menu: 100,
        prix_livraison: 20,
        nom_menu: "Menu Entreprise Classique",
      },
    ]);

    const juillet = docs.find((doc) => doc.periode === "2026-07");
    const aout = docs.find((doc) => doc.periode === "2026-08");

    assert.equal(juillet.nombre_commandes, 1);
    assert.equal(juillet.chiffre_affaires, 802);
    assert.equal(aout.nombre_commandes, 2);
    assert.equal(aout.chiffre_affaires, 592.5);
  });

  it("remplace un document existant faux", async () => {
    const { StatistiqueModel, docs } = createStoreMock([
      {
        menu_id: 1,
        periode: "2026-08",
        nom_menu: "Ancien nom",
        nombre_commandes: 99,
        chiffre_affaires: 9999,
      },
    ]);
    const service = createStatistiqueService({ StatistiqueModel });

    const rapport = await service.recalculerStatistiques([
      {
        menu_id: 1,
        date_commande: "2026-08-02",
        prix_menu: 472.5,
        prix_livraison: 0,
        nom_menu: "Menu Entreprise Classique",
      },
    ]);

    assert.equal(rapport.documentsCrees, 0);
    assert.equal(rapport.documentsMisAJour, 1);
    assert.equal(docs[0].nombre_commandes, 1);
    assert.equal(docs[0].chiffre_affaires, 472.5);
    assert.equal(docs[0].nom_menu, "Menu Entreprise Classique");
    assert.equal(docs[0].saveCalls, 1);
  });

  it("crée un document absent", async () => {
    const { StatistiqueModel, docs } = createStoreMock();
    const service = createStatistiqueService({ StatistiqueModel });

    const rapport = await service.recalculerStatistiques([
      {
        menu_id: 1,
        date_commande: "2026-07-10",
        prix_menu: 787,
        prix_livraison: 15,
        nom_menu: "Menu Entreprise Classique",
      },
    ]);

    assert.equal(rapport.documentsCrees, 1);
    assert.equal(rapport.documentsMisAJour, 0);
    assert.equal(docs.length, 1);
    assert.equal(docs[0].periode, "2026-07");
    assert.equal(docs[0].chiffre_affaires, 802);
  });

  it("remet à zéro un document orphelin sans le supprimer", async () => {
    const { StatistiqueModel, docs, deleteCalls } = createStoreMock([
      {
        menu_id: 2,
        periode: "2026-08",
        nom_menu: "Menu Végétarien Gourmand",
        nombre_commandes: 1,
        chiffre_affaires: 256,
      },
    ]);
    const service = createStatistiqueService({ StatistiqueModel });

    const rapport = await service.recalculerStatistiques(commandesActives);

    const orphelin = docs.find((doc) => doc.menu_id === 2);
    assert.ok(orphelin);
    assert.equal(orphelin.nombre_commandes, 0);
    assert.equal(orphelin.chiffre_affaires, 0);
    assert.equal(rapport.documentsRemisAZero, 1);
    assert.equal(docs.length, 3);
    assert.equal(deleteCalls.length, 0);
  });

  it("est idempotent sur une deuxième exécution", async () => {
    const { StatistiqueModel, docs } = createStoreMock([
      {
        menu_id: 2,
        periode: "2026-08",
        nom_menu: "Menu Végétarien Gourmand",
        nombre_commandes: 1,
        chiffre_affaires: 256,
      },
    ]);
    const service = createStatistiqueService({ StatistiqueModel });

    const premier = await service.recalculerStatistiques(commandesActives);
    const savesApresPremier = docs.reduce(
      (sum, doc) => sum + (doc.saveCalls || 0),
      0,
    );

    const second = await service.recalculerStatistiques(commandesActives);
    const savesApresSecond = docs.reduce(
      (sum, doc) => sum + (doc.saveCalls || 0),
      0,
    );

    assert.deepEqual(premier, {
      commandesLues: 2,
      agregatsCalcules: 2,
      documentsCrees: 2,
      documentsMisAJour: 0,
      documentsRemisAZero: 1,
    });

    assert.deepEqual(second, {
      commandesLues: 2,
      agregatsCalcules: 2,
      documentsCrees: 0,
      documentsMisAJour: 0,
      documentsRemisAZero: 0,
    });

    assert.equal(savesApresSecond, savesApresPremier);
  });

  it("n'appelle aucune suppression de document", async () => {
    const { StatistiqueModel, deleteCalls } = createStoreMock([
      {
        menu_id: 9,
        periode: "2025-01",
        nom_menu: "Orphelin",
        nombre_commandes: 3,
        chiffre_affaires: 30,
      },
    ]);
    const service = createStatistiqueService({ StatistiqueModel });

    await service.recalculerStatistiques(commandesActives);

    assert.equal(deleteCalls.length, 0);
    assert.equal(typeof StatistiqueModel.deleteMany, "function");
  });
});
