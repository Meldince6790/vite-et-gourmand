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

  return { StatistiqueModel, created, finds };
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
