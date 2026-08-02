const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { CommandeService } = require("./commande.service");
const Commande = require("../domain/Commande");

const MENU = {
  menu_id: 1,
  prix_par_personne: 10,
  nombre_personne_minimum: 10,
};

const ORDER = {
  commande_id: 1,
  utilisateur_id: 10,
  menu_id: 1,
  statut: "En attente",
  nombre_personne: 10,
  date_prestation: "2026-09-01",
  heure_livraison: "12:00",
  adresse_livraison: "1 rue Test",
  pret_materiel: false,
  restitution_materiel: false,
};

function createMocks(overrides = {}) {
  const calls = {
    create: [],
    updateStatut: [],
    update: [],
    decreaseStock: [],
    increaseStock: [],
    updateStatistiqueCommande: [],
  };

  const commandeRepository = {
    findAll: async () => [],
    findById: async () => ORDER,
    findByUtilisateurId: async () => [],
    create: async (commande) => {
      calls.create.push(commande);
      return 42;
    },
    updateStatut: async (id, statut) => {
      calls.updateStatut.push({ id, statut });
      return true;
    },
    updateAnnulation: async () => true,
    update: async (id, data) => {
      calls.update.push({ id, data });
      return true;
    },
    delete: async () => true,
    exists: async () => true,
    ...overrides.commandeRepository,
  };

  const menuModel = {
    findById: async () => MENU,
    hasStock: async () => true,
    decreaseStock: async (menuId, quantite) => {
      calls.decreaseStock.push({ menuId, quantite });
    },
    increaseStock: async (menuId, quantite) => {
      calls.increaseStock.push({ menuId, quantite });
    },
    ...overrides.menuModel,
  };

  const statistiqueService = {
    updateStatistiqueCommande: async (commande, menu) => {
      calls.updateStatistiqueCommande.push({ commande, menu });
    },
    ...overrides.statistiqueService,
  };

  const service = new CommandeService({
    commandeRepository,
    menuModel,
    statistiqueService,
    CommandeDomain: overrides.CommandeDomain ?? Commande,
  });

  return { service, calls, commandeRepository, menuModel, statistiqueService };
}

describe("CommandeService.getCommandeById", () => {
  it("returns the order for the owning client (role_id 1)", async () => {
    const { service } = createMocks();
    const result = await service.getCommandeById(1, {
      role_id: 1,
      utilisateur_id: 10,
    });
    assert.equal(result, ORDER);
  });

  it("rejects with Commande introuvable. for a different client (role_id 1)", async () => {
    const { service } = createMocks();
    await assert.rejects(
      () =>
        service.getCommandeById(1, { role_id: 1, utilisateur_id: 99 }),
      { message: "Commande introuvable." },
    );
  });

  it("returns the order for an employee (role_id 2)", async () => {
    const { service } = createMocks();
    const result = await service.getCommandeById(1, {
      role_id: 2,
      utilisateur_id: 99,
    });
    assert.equal(result, ORDER);
  });

  it("returns the order for an administrator (role_id 3)", async () => {
    const { service } = createMocks();
    const result = await service.getCommandeById(1, {
      role_id: 3,
      utilisateur_id: 99,
    });
    assert.equal(result, ORDER);
  });

  it("rejects with Commande introuvable. when the order is missing", async () => {
    const { service } = createMocks({
      commandeRepository: { findById: async () => undefined },
    });
    await assert.rejects(
      () =>
        service.getCommandeById(1, { role_id: 1, utilisateur_id: 10 }),
      { message: "Commande introuvable." },
    );
  });

  it("rejects with Commande introuvable. for an unsupported role", async () => {
    const { service } = createMocks();
    await assert.rejects(
      () =>
        service.getCommandeById(1, { role_id: 99, utilisateur_id: 10 }),
      { message: "Commande introuvable." },
    );
  });
});

describe("CommandeService.createCommande", () => {
  const baseInput = () => ({
    menu_id: 1,
    utilisateur_id: 10,
    date_prestation: "2026-09-01",
    heure_livraison: "12:00",
    adresse_livraison: "1 rue Test",
    nombre_personne: 10,
  });

  it("crée une commande avec succès", async () => {
    const { service, calls } = createMocks();
    const input = baseInput();

    const id = await service.createCommande(input);

    assert.equal(id, 42);
    assert.equal(calls.create.length, 1);
    assert.equal(calls.create[0].statut, "En attente");
    assert.equal(calls.create[0].prix_menu, 100);
    assert.equal(calls.create[0].prix_livraison, 0);
    assert.match(calls.create[0].numero_commande, /^CMD-/);
    assert.equal(calls.create[0].pret_materiel, false);
    assert.equal(calls.create[0].restitution_materiel, false);
    assert.deepEqual(calls.decreaseStock, [{ menuId: 1, quantite: 10 }]);
    assert.equal(calls.updateStatistiqueCommande.length, 1);
    assert.equal(calls.updateStatistiqueCommande[0].commande.commande_id, 42);
  });

  it("rejette si le menu est introuvable", async () => {
    const { service, calls } = createMocks({
      menuModel: { findById: async () => undefined },
    });

    await assert.rejects(() => service.createCommande(baseInput()), {
      message: "Menu introuvable.",
    });
    assert.equal(calls.create.length, 0);
  });

  it("rejette si la date de prestation est manquante", async () => {
    const { service, calls } = createMocks();
    const input = baseInput();
    delete input.date_prestation;

    await assert.rejects(() => service.createCommande(input), {
      message: "La date de prestation est obligatoire.",
    });
    assert.equal(calls.create.length, 0);
  });

  it("rejette si l'heure de livraison est manquante", async () => {
    const { service, calls } = createMocks();
    const input = baseInput();
    delete input.heure_livraison;

    await assert.rejects(() => service.createCommande(input), {
      message: "L'heure de livraison est obligatoire.",
    });
    assert.equal(calls.create.length, 0);
  });

  it("rejette si l'adresse de livraison est manquante", async () => {
    const { service, calls } = createMocks();
    const input = baseInput();
    delete input.adresse_livraison;

    await assert.rejects(() => service.createCommande(input), {
      message: "L'adresse de livraison est obligatoire.",
    });
    assert.equal(calls.create.length, 0);
  });

  it("rejette si le nombre de personnes est inférieur ou égal à 0", async () => {
    const { service, calls } = createMocks();

    await assert.rejects(
      () => service.createCommande({ ...baseInput(), nombre_personne: 0 }),
      { message: "Le nombre de personnes doit être supérieur à zéro." },
    );
    assert.equal(calls.create.length, 0);
  });

  it("rejette si le stock est insuffisant", async () => {
    const { service, calls } = createMocks({
      menuModel: { hasStock: async () => false },
    });

    await assert.rejects(() => service.createCommande(baseInput()), {
      message: "Le stock disponible est insuffisant pour cette commande.",
    });
    assert.equal(calls.create.length, 0);
  });
});

describe("CommandeService.annulerCommandeClient", () => {
  it("annule la commande et restaure le stock", async () => {
    const { service, calls } = createMocks();

    const result = await service.annulerCommandeClient(1, 10);

    assert.equal(result, true);
    assert.deepEqual(calls.updateStatut, [{ id: 1, statut: "Annulée" }]);
    assert.deepEqual(calls.increaseStock, [{ menuId: 1, quantite: 10 }]);
  });

  it("refuse l'annulation si le statut n'est pas En attente", async () => {
    const { service, calls } = createMocks({
      commandeRepository: {
        findById: async () => ({ ...ORDER, statut: "Acceptée" }),
      },
    });

    await assert.rejects(() => service.annulerCommandeClient(1, 10), {
      message: "Cette commande ne peut plus être annulée.",
    });
    assert.equal(calls.updateStatut.length, 0);
    assert.equal(calls.increaseStock.length, 0);
  });
});

describe("CommandeService.updateCommande", () => {
  it("refuse la modification si le statut n'est pas En attente", async () => {
    const { service, calls } = createMocks({
      commandeRepository: {
        findById: async () => ({ ...ORDER, statut: "Acceptée" }),
      },
    });

    await assert.rejects(
      () => service.updateCommande(1, 10, { nombre_personne: 12 }),
      { message: "Cette commande ne peut plus être modifiée." },
    );
    assert.equal(calls.update.length, 0);
  });

  it("recalcule le prix du menu", async () => {
    const { service, calls } = createMocks();

    await service.updateCommande(1, 10, { nombre_personne: 15 });

    assert.equal(calls.update.length, 1);
    assert.equal(calls.update[0].id, 1);
    assert.equal(calls.update[0].data.nombre_personne, 15);
    assert.equal(calls.update[0].data.prix_menu, 135);
  });
});

describe("CommandeService.updateStatut", () => {
  it("rejette un statut invalide", async () => {
    const { service } = createMocks();

    await assert.rejects(() => service.updateStatut(1, "Inconnu"), {
      message: "Statut de commande invalide.",
    });
  });
});

describe("CommandeService délégation au domaine", () => {
  it("délègue la création à Commande.initialiserCreation", async () => {
    const calls = [];
    const date = new Date("2026-08-02T12:00:00.000Z");

    class FakeCommande {
      static initialiserCreation(input, menu) {
        calls.push({ method: "initialiserCreation", input, menu });
        return Commande.initialiserCreation(input, menu, date);
      }
    }

    const { service, calls: repoCalls } = createMocks({
      CommandeDomain: FakeCommande,
    });

    const input = {
      menu_id: 1,
      utilisateur_id: 10,
      date_prestation: "2026-09-01",
      heure_livraison: "12:00",
      adresse_livraison: "1 rue Test",
      nombre_personne: 10,
    };

    await service.createCommande(input);

    assert.equal(calls.length, 1);
    assert.equal(calls[0].method, "initialiserCreation");
    assert.equal(repoCalls.create[0].numero_commande, `CMD-${date.getTime()}`);
    assert.equal(repoCalls.create[0].statut, "En attente");
  });

  it("délègue le calcul du prix à Commande.calculerPrixMenu", async () => {
    const calls = [];

    class FakeCommande {
      constructor(data) {
        Object.assign(this, data);
      }

      peutEtreModifieeParClient() {
        return true;
      }

      static calculerPrixMenu(menu, nombrePersonne) {
        calls.push({ menu, nombrePersonne });
        return 999.99;
      }
    }

    const { service, calls: repoCalls } = createMocks({
      CommandeDomain: FakeCommande,
    });

    await service.updateCommande(1, 10, { nombre_personne: 15 });

    assert.equal(calls.length, 1);
    assert.equal(calls[0].nombrePersonne, 15);
    assert.equal(repoCalls.update[0].data.prix_menu, 999.99);
  });

  it("délègue l'annulation client à peutEtreAnnuleeParClient", async () => {
    const calls = [];

    class FakeCommande {
      constructor(data) {
        Object.assign(this, data);
        calls.push("constructed");
      }

      peutEtreAnnuleeParClient() {
        calls.push("peutEtreAnnuleeParClient");
        return false;
      }
    }

    const { service, calls: repoCalls } = createMocks({
      CommandeDomain: FakeCommande,
    });

    await assert.rejects(() => service.annulerCommandeClient(1, 10), {
      message: "Cette commande ne peut plus être annulée.",
    });

    assert.deepEqual(calls, ["constructed", "peutEtreAnnuleeParClient"]);
    assert.equal(repoCalls.updateStatut.length, 0);
  });

  it("délègue la modification client à peutEtreModifieeParClient", async () => {
    const calls = [];

    class FakeCommande {
      constructor(data) {
        Object.assign(this, data);
      }

      peutEtreModifieeParClient() {
        calls.push("peutEtreModifieeParClient");
        return false;
      }
    }

    const { service, calls: repoCalls } = createMocks({
      CommandeDomain: FakeCommande,
    });

    await assert.rejects(
      () => service.updateCommande(1, 10, { nombre_personne: 12 }),
      { message: "Cette commande ne peut plus être modifiée." },
    );

    assert.deepEqual(calls, ["peutEtreModifieeParClient"]);
    assert.equal(repoCalls.update.length, 0);
  });
});

