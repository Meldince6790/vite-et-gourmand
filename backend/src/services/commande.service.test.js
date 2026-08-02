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
  date_commande: "2026-08-02T12:00:00.000Z",
  heure_livraison: "12:00",
  adresse_livraison: "1 rue Test",
  prix_menu: 100,
  prix_livraison: 0,
  pret_materiel: false,
  restitution_materiel: false,
};

function createTransactionalDatabase({
  commitShouldFail = false,
  rollbackShouldFail = false,
} = {}) {
  const events = [];

  const connection = {
    beginTransaction: async () => {
      events.push("begin");
    },
    commit: async () => {
      if (commitShouldFail) {
        throw new Error("commit failed");
      }
      events.push("commit");
    },
    rollback: async () => {
      if (rollbackShouldFail) {
        throw new Error("rollback failed");
      }
      events.push("rollback");
    },
    release: () => {
      events.push("release");
    },
  };

  const database = {
    getConnection: async () => {
      events.push("getConnection");
      return connection;
    },
  };

  return { database, events, connection };
}

const CLIENT = {
  utilisateur_id: 10,
  email: "claire@example.com",
  nom: "Durand",
  prenom: "Claire",
};

function createMocks(overrides = {}) {
  const calls = {
    create: [],
    createConnections: [],
    updateStatut: [],
    updateAnnulation: [],
    update: [],
    decreaseStock: [],
    increaseStock: [],
    hasStock: [],
    updateStatistiqueCommande: [],
    retirerStatistiqueCommande: [],
    sendOrderConfirmationEmail: [],
    sendOrderCancellationEmail: [],
    findUtilisateurById: [],
    loggerErrors: [],
  };

  const commandeRepository = {
    findAll: async () => [],
    findById: async () => ORDER,
    findByUtilisateurId: async () => [],
    create: async (commande, connection = null) => {
      calls.create.push(commande);
      calls.createConnections.push(connection);
      return 42;
    },
    updateStatut: async (id, statut, connection = null) => {
      calls.updateStatut.push({ id, statut, connection });
      return true;
    },
    updateAnnulation: async (id, data, connection = null) => {
      calls.updateAnnulation.push({ id, data, connection });
      return true;
    },
    update: async (id, data, connection = null) => {
      calls.update.push({ id, data, connection });
      return true;
    },
    delete: async () => true,
    exists: async () => true,
    ...overrides.commandeRepository,
  };

  const menuModel = {
    findById: async () => MENU,
    hasStock: async (menuId, quantite, connection = null) => {
      calls.hasStock.push({ menuId, quantite, connection });
      return true;
    },
    decreaseStock: async (menuId, quantite, connection = null) => {
      calls.decreaseStock.push({ menuId, quantite, connection });
      return true;
    },
    increaseStock: async (menuId, quantite, connection = null) => {
      calls.increaseStock.push({ menuId, quantite, connection });
      return true;
    },
    ...overrides.menuModel,
  };

  const updateStatistiqueCommandeImpl =
    overrides.statistiqueService?.updateStatistiqueCommande ??
    (async () => undefined);

  const retirerStatistiqueCommandeImpl =
    overrides.statistiqueService?.retirerStatistiqueCommande ??
    (async () => undefined);

  const statistiqueService = {
    ...overrides.statistiqueService,
    updateStatistiqueCommande: async (commande, menu) => {
      calls.updateStatistiqueCommande.push({ commande, menu });
      return updateStatistiqueCommandeImpl(commande, menu);
    },
    retirerStatistiqueCommande: async (commande) => {
      calls.retirerStatistiqueCommande.push(commande);
      return retirerStatistiqueCommandeImpl(commande);
    },
  };

  const sendOrderConfirmationEmailImpl =
    overrides.emailService?.sendOrderConfirmationEmail ??
    (async () => ({ ok: true, provider: "log", id: "log-test" }));

  const sendOrderCancellationEmailImpl =
    overrides.emailService?.sendOrderCancellationEmail ??
    (async () => ({ ok: true, provider: "log", id: "log-cancel" }));

  const emailService = {
    ...overrides.emailService,
    sendOrderConfirmationEmail: async (payload) => {
      calls.sendOrderConfirmationEmail.push(payload);
      return sendOrderConfirmationEmailImpl(payload);
    },
    sendOrderCancellationEmail: async (payload) => {
      calls.sendOrderCancellationEmail.push(payload);
      return sendOrderCancellationEmailImpl(payload);
    },
  };

  const findUtilisateurByIdImpl =
    overrides.utilisateurModel?.findById ?? (async () => CLIENT);

  const utilisateurModel = {
    ...overrides.utilisateurModel,
    findById: async (id) => {
      calls.findUtilisateurById.push(id);
      return findUtilisateurByIdImpl(id);
    },
  };

  const logger = {
    error: (...args) => {
      calls.loggerErrors.push(args);
    },
    ...overrides.logger,
  };

  const transactional =
    overrides.database === undefined
      ? createTransactionalDatabase()
      : {
          database: overrides.database,
          events: overrides.events ?? [],
          connection: overrides.connection ?? null,
        };

  const service = new CommandeService({
    commandeRepository,
    menuModel,
    statistiqueService,
    CommandeDomain: overrides.CommandeDomain ?? Commande,
    database: transactional.database,
    emailService,
    utilisateurModel,
    logger,
  });

  return {
    service,
    calls,
    commandeRepository,
    menuModel,
    statistiqueService,
    emailService,
    utilisateurModel,
    logger,
    database: transactional.database,
    events: transactional.events,
    connection: transactional.connection,
  };
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
    const { service, calls, events, connection } = createMocks();
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
    assert.equal(calls.createConnections[0], connection);
    assert.deepEqual(calls.decreaseStock, [
      { menuId: 1, quantite: 10, connection },
    ]);
    assert.equal(calls.updateStatistiqueCommande.length, 1);
    assert.equal(calls.updateStatistiqueCommande[0].commande.commande_id, 42);
    // release avant stats : withTransaction libère la connexion avant le return.
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "commit",
      "release",
    ]);
    const statsIndex = calls.updateStatistiqueCommande.length - 1;
    assert.ok(statsIndex >= 0);
    assert.ok(events.indexOf("commit") < events.indexOf("release"));
  });

  it("exécute create et decreaseStock dans la même transaction puis Mongo après commit", async () => {
    const { database, events, connection } = createTransactionalDatabase();
    const order = [];
    const { service, calls } = createMocks({
      database,
      events,
      connection,
      commandeRepository: {
        create: async (commande, conn) => {
          order.push("create");
          calls.create.push(commande);
          calls.createConnections.push(conn);
          return 42;
        },
      },
      menuModel: {
        decreaseStock: async (menuId, quantite, conn) => {
          order.push("decrease");
          calls.decreaseStock.push({ menuId, quantite, connection: conn });
          return true;
        },
      },
      statistiqueService: {
        updateStatistiqueCommande: async (commande, menu) => {
          order.push("stats");
          calls.updateStatistiqueCommande.push({ commande, menu });
        },
      },
    });

    const id = await service.createCommande(baseInput());

    assert.equal(id, 42);
    assert.equal(calls.createConnections[0], connection);
    assert.equal(calls.decreaseStock[0].connection, connection);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "commit",
      "release",
    ]);
    assert.deepEqual(order, ["create", "decrease", "stats"]);
    assert.ok(events.indexOf("release") >= 0);
    // Ordre réel : begin → create → decrease → commit → release → stats
    assert.deepEqual(
      [
        events[1],
        order[0],
        order[1],
        events[2],
        events[3],
        order[2],
      ],
      ["begin", "create", "decrease", "commit", "release", "stats"],
    );
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

  it("rejette si decreaseStock échoue et provoque un rollback", async () => {
    const { service, calls, events } = createMocks({
      menuModel: { decreaseStock: async () => false },
    });

    await assert.rejects(() => service.createCommande(baseInput()), {
      message: "La mise à jour du stock a échoué.",
    });
    assert.equal(calls.create.length, 1);
    assert.equal(calls.updateStatistiqueCommande.length, 0);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "rollback",
      "release",
    ]);
    assert.equal(events.includes("commit"), false);
  });

  it("rollback sans decreaseStock ni stats si repository.create échoue", async () => {
    const { service, calls, events } = createMocks({
      commandeRepository: {
        create: async () => {
          throw new Error("insert failed");
        },
      },
    });

    await assert.rejects(() => service.createCommande(baseInput()), {
      message: "insert failed",
    });
    assert.equal(calls.decreaseStock.length, 0);
    assert.equal(calls.updateStatistiqueCommande.length, 0);
    assert.equal(calls.sendOrderConfirmationEmail.length, 0);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "rollback",
      "release",
    ]);
    assert.equal(events.includes("commit"), false);
  });

  it("envoie un e-mail de confirmation une fois après création réussie", async () => {
    const { database, events, connection } = createTransactionalDatabase();
    const order = [];
    const { service, calls } = createMocks({
      database,
      events,
      connection,
      emailService: {
        sendOrderConfirmationEmail: async () => {
          order.push("email");
          return { ok: true, provider: "log", id: "log-test" };
        },
      },
    });

    const id = await service.createCommande(baseInput());

    assert.equal(id, 42);
    assert.equal(calls.sendOrderConfirmationEmail.length, 1);
    assert.deepEqual(calls.findUtilisateurById, [10]);
    assert.equal(calls.sendOrderConfirmationEmail[0].to, CLIENT.email);
    assert.equal(calls.sendOrderConfirmationEmail[0].prenom, CLIENT.prenom);
    assert.equal(
      calls.sendOrderConfirmationEmail[0].commande.commande_id,
      42,
    );
    assert.equal(
      calls.sendOrderConfirmationEmail[0].commande.utilisateur_id,
      10,
    );
    assert.ok(events.includes("commit"));
    assert.ok(events.indexOf("release") >= 0);
    assert.ok(events.indexOf("commit") < events.indexOf("release"));
    // Mail uniquement après commit/release
    assert.deepEqual(
      [events[2], events[3], order[0]],
      ["commit", "release", "email"],
    );
  });

  it("crée la commande même si l'envoi d'e-mail échoue", async () => {
    const { service, calls } = createMocks({
      emailService: {
        sendOrderConfirmationEmail: async () => {
          throw new Error("smtp down");
        },
      },
    });

    const id = await service.createCommande(baseInput());

    assert.equal(id, 42);
    assert.equal(calls.create.length, 1);
    assert.equal(calls.sendOrderConfirmationEmail.length, 1);
    assert.equal(calls.loggerErrors.length, 1);
    assert.match(
      String(calls.loggerErrors[0][0]),
      /confirmation de commande/,
    );
  });

  it("n'envoie aucun e-mail si l'utilisateur est absent", async () => {
    const { service, calls } = createMocks({
      utilisateurModel: { findById: async () => undefined },
    });

    const id = await service.createCommande(baseInput());

    assert.equal(id, 42);
    assert.equal(calls.findUtilisateurById.length, 1);
    assert.equal(calls.sendOrderConfirmationEmail.length, 0);
  });

  it("n'envoie aucun e-mail si l'utilisateur n'a pas d'email", async () => {
    const { service, calls } = createMocks({
      utilisateurModel: {
        findById: async () => ({
          ...CLIENT,
          email: null,
        }),
      },
    });

    const id = await service.createCommande(baseInput());

    assert.equal(id, 42);
    assert.equal(calls.sendOrderConfirmationEmail.length, 0);
  });

  it("n'envoie aucun e-mail en cas de rollback transactionnel", async () => {
    const { service, calls, events } = createMocks({
      menuModel: { decreaseStock: async () => false },
    });

    await assert.rejects(() => service.createCommande(baseInput()), {
      message: "La mise à jour du stock a échoué.",
    });
    assert.equal(calls.sendOrderConfirmationEmail.length, 0);
    assert.equal(calls.findUtilisateurById.length, 0);
    assert.equal(events.includes("commit"), false);
    assert.ok(events.includes("rollback"));
  });

  it("n'envoie aucun e-mail si la validation métier échoue", async () => {
    const { service, calls } = createMocks({
      menuModel: { hasStock: async () => false },
    });

    await assert.rejects(() => service.createCommande(baseInput()), {
      message: "Le stock disponible est insuffisant pour cette commande.",
    });
    assert.equal(calls.create.length, 0);
    assert.equal(calls.sendOrderConfirmationEmail.length, 0);
    assert.equal(calls.findUtilisateurById.length, 0);
  });
});

describe("CommandeService.annulerCommandeClient", () => {
  it("annule la commande et restaure le stock", async () => {
    const { database, events, connection } = createTransactionalDatabase();
    const order = [];
    const { service, calls } = createMocks({
      database,
      events,
      connection,
      commandeRepository: {
        updateStatut: async (id, statut, conn) => {
          order.push("update");
          calls.updateStatut.push({ id, statut, connection: conn });
          return true;
        },
      },
      menuModel: {
        increaseStock: async (menuId, quantite, conn) => {
          order.push("increase");
          calls.increaseStock.push({ menuId, quantite, connection: conn });
          return true;
        },
      },
    });

    const result = await service.annulerCommandeClient(1, 10);

    assert.equal(result, true);
    assert.deepEqual(calls.updateStatut, [
      { id: 1, statut: "Annulée", connection },
    ]);
    assert.deepEqual(calls.increaseStock, [
      { menuId: 1, quantite: 10, connection },
    ]);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "commit",
      "release",
    ]);
    assert.deepEqual(
      ["begin", ...order, "commit", "release"],
      ["begin", "update", "increase", "commit", "release"],
    );
    assert.equal(calls.sendOrderCancellationEmail.length, 1);
    assert.equal(calls.sendOrderCancellationEmail[0].to, CLIENT.email);
    assert.equal(calls.sendOrderCancellationEmail[0].prenom, CLIENT.prenom);
    assert.equal(
      calls.sendOrderCancellationEmail[0].commande.statut,
      "Annulée",
    );
    assert.equal(
      calls.sendOrderCancellationEmail[0].commande.commande_id,
      ORDER.commande_id,
    );
    assert.equal(calls.retirerStatistiqueCommande.length, 1);
    assert.equal(calls.retirerStatistiqueCommande[0].commande_id, 1);
  });

  it("refuse l'annulation si le statut n'est pas En attente", async () => {
    const { service, calls, events } = createMocks({
      commandeRepository: {
        findById: async () => ({ ...ORDER, statut: "Acceptée" }),
      },
    });

    await assert.rejects(() => service.annulerCommandeClient(1, 10), {
      message: "Cette commande ne peut plus être annulée.",
    });
    assert.equal(calls.updateStatut.length, 0);
    assert.equal(calls.increaseStock.length, 0);
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.equal(events.includes("begin"), false);
  });

  it("refuse une seconde annulation client sans restock", async () => {
    let statutCourant = "En attente";
    const { service, calls, events } = createMocks({
      commandeRepository: {
        findById: async () => ({ ...ORDER, statut: statutCourant }),
        updateStatut: async (id, statut, connection = null) => {
          calls.updateStatut.push({ id, statut, connection });
          statutCourant = statut;
          return true;
        },
      },
    });

    await service.annulerCommandeClient(1, 10);
    const eventsAfterFirst = [...events];
    await assert.rejects(() => service.annulerCommandeClient(1, 10), {
      message: "Cette commande est déjà annulée.",
    });
    assert.equal(calls.increaseStock.length, 1);
    assert.equal(calls.sendOrderCancellationEmail.length, 1);
    assert.equal(calls.retirerStatistiqueCommande.length, 1);
    assert.equal(events.length, eventsAfterFirst.length);
  });

  it("rejette si increaseStock échoue à l'annulation client", async () => {
    const { service, calls, events } = createMocks({
      menuModel: { increaseStock: async () => false },
    });

    await assert.rejects(() => service.annulerCommandeClient(1, 10), {
      message: "La mise à jour du stock a échoué.",
    });
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "rollback",
      "release",
    ]);
  });

  it("rollback sans restock si updateStatut échoue à l'annulation client", async () => {
    const { service, calls, events } = createMocks({
      commandeRepository: {
        updateStatut: async () => {
          throw new Error("update failed");
        },
      },
    });

    await assert.rejects(() => service.annulerCommandeClient(1, 10), {
      message: "update failed",
    });
    assert.equal(calls.increaseStock.length, 0);
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "rollback",
      "release",
    ]);
  });

  it("conserve l'annulation SQL si Mongo échoue", async () => {
    const { service, calls } = createMocks({
      statistiqueService: {
        retirerStatistiqueCommande: async () => {
          throw new Error("mongo down");
        },
      },
    });

    const result = await service.annulerCommandeClient(1, 10);

    assert.equal(result, true);
    assert.equal(calls.updateStatut.length, 1);
    assert.equal(calls.retirerStatistiqueCommande.length, 1);
    assert.equal(calls.loggerErrors.length, 1);
    assert.match(String(calls.loggerErrors[0][0]), /statistiques MongoDB/);
  });
});

describe("CommandeService.annulerCommande", () => {
  const annulationData = {
    mode_contact_annulation: "Mail",
    motif_annulation: "Indisponible",
  };

  it("annule la commande employé et restaure le stock dans une transaction", async () => {
    const { database, events, connection } = createTransactionalDatabase();
    const order = [];
    const { service, calls } = createMocks({
      database,
      events,
      connection,
      commandeRepository: {
        updateAnnulation: async (id, data, conn) => {
          order.push("update");
          calls.updateAnnulation.push({ id, data, connection: conn });
          return true;
        },
      },
      menuModel: {
        increaseStock: async (menuId, quantite, conn) => {
          order.push("increase");
          calls.increaseStock.push({ menuId, quantite, connection: conn });
          return true;
        },
      },
    });

    const result = await service.annulerCommande(1, annulationData);

    assert.equal(result, true);
    assert.equal(calls.updateAnnulation[0].connection, connection);
    assert.equal(calls.increaseStock[0].connection, connection);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "commit",
      "release",
    ]);
    assert.deepEqual(
      ["begin", ...order, "commit", "release"],
      ["begin", "update", "increase", "commit", "release"],
    );
    assert.equal(calls.sendOrderCancellationEmail.length, 1);
    assert.equal(calls.sendOrderCancellationEmail[0].to, CLIENT.email);
    assert.equal(
      calls.sendOrderCancellationEmail[0].commande.statut,
      "Annulée",
    );
    assert.equal(calls.retirerStatistiqueCommande.length, 1);
  });

  it("refuse une seconde annulation employé sans restock", async () => {
    let statutCourant = "En attente";
    const { service, calls, events } = createMocks({
      commandeRepository: {
        findById: async () => ({ ...ORDER, statut: statutCourant }),
        updateAnnulation: async (id, data, connection = null) => {
          calls.updateAnnulation.push({ id, data, connection });
          statutCourant = "Annulée";
          return true;
        },
      },
    });

    await service.annulerCommande(1, annulationData);
    const eventsAfterFirst = [...events];
    await assert.rejects(() => service.annulerCommande(1, annulationData), {
      message: "Cette commande est déjà annulée.",
    });
    assert.equal(calls.increaseStock.length, 1);
    assert.equal(calls.sendOrderCancellationEmail.length, 1);
    assert.equal(calls.retirerStatistiqueCommande.length, 1);
    assert.equal(events.length, eventsAfterFirst.length);
  });

  it("rejette si increaseStock échoue à l'annulation employé", async () => {
    const { service, calls, events } = createMocks({
      menuModel: { increaseStock: async () => false },
    });

    await assert.rejects(() => service.annulerCommande(1, annulationData), {
      message: "La mise à jour du stock a échoué.",
    });
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "rollback",
      "release",
    ]);
  });

  it("rollback sans restock si updateAnnulation échoue", async () => {
    const { service, calls, events } = createMocks({
      commandeRepository: {
        updateAnnulation: async () => {
          throw new Error("update failed");
        },
      },
    });

    await assert.rejects(() => service.annulerCommande(1, annulationData), {
      message: "update failed",
    });
    assert.equal(calls.increaseStock.length, 0);
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "rollback",
      "release",
    ]);
  });

  it("rejette avec erreur métier si data est undefined", async () => {
    const { service, calls, events } = createMocks();

    await assert.rejects(() => service.annulerCommande(1, undefined), {
      message: "Le mode de contact est obligatoire.",
    });
    assert.equal(calls.updateAnnulation.length, 0);
    assert.equal(calls.updateStatut.length, 0);
    assert.equal(calls.increaseStock.length, 0);
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.equal(events.includes("begin"), false);
  });

  it("rejette avec erreur métier si data est null", async () => {
    const { service, calls, events } = createMocks();

    await assert.rejects(() => service.annulerCommande(1, null), {
      message: "Le mode de contact est obligatoire.",
    });
    assert.equal(calls.updateAnnulation.length, 0);
    assert.equal(calls.updateStatut.length, 0);
    assert.equal(calls.increaseStock.length, 0);
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.equal(events.includes("begin"), false);
  });

  it("rejette avec erreur métier si data est un objet vide", async () => {
    const { service, calls, events } = createMocks();

    await assert.rejects(() => service.annulerCommande(1, {}), {
      message: "Le mode de contact est obligatoire.",
    });
    assert.equal(calls.updateAnnulation.length, 0);
    assert.equal(calls.updateStatut.length, 0);
    assert.equal(calls.increaseStock.length, 0);
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.equal(events.includes("begin"), false);
  });

  it("rejette si le mode est présent sans motif", async () => {
    const { service, calls, events } = createMocks();

    await assert.rejects(
      () =>
        service.annulerCommande(1, {
          mode_contact_annulation: "Mail",
        }),
      { message: "Le motif d'annulation est obligatoire." },
    );
    assert.equal(calls.updateAnnulation.length, 0);
    assert.equal(calls.updateStatut.length, 0);
    assert.equal(calls.increaseStock.length, 0);
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.equal(events.includes("begin"), false);
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

  it("décrémente le delta de stock si le nombre de personnes augmente", async () => {
    const { database, events, connection } = createTransactionalDatabase();
    const order = [];
    const { service, calls } = createMocks({
      database,
      events,
      connection,
      menuModel: {
        hasStock: async (menuId, quantite, conn) => {
          order.push("hasStock");
          calls.hasStock.push({ menuId, quantite, connection: conn });
          return true;
        },
        decreaseStock: async (menuId, quantite, conn) => {
          order.push("decrease");
          calls.decreaseStock.push({ menuId, quantite, connection: conn });
          return true;
        },
      },
      commandeRepository: {
        update: async (id, data, conn) => {
          order.push("update");
          calls.update.push({ id, data, connection: conn });
          return true;
        },
      },
    });

    await service.updateCommande(1, 10, { nombre_personne: 15 });

    assert.deepEqual(calls.hasStock, [
      { menuId: 1, quantite: 5, connection },
    ]);
    assert.deepEqual(calls.decreaseStock, [
      { menuId: 1, quantite: 5, connection },
    ]);
    assert.equal(calls.update[0].connection, connection);
    assert.equal(calls.increaseStock.length, 0);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "commit",
      "release",
    ]);
    assert.deepEqual(
      ["begin", ...order, "commit", "release"],
      ["begin", "hasStock", "decrease", "update", "commit", "release"],
    );
  });

  it("rejette une hausse si le stock est insuffisant", async () => {
    const { service, calls, events } = createMocks({
      menuModel: { hasStock: async () => false },
    });

    await assert.rejects(
      () => service.updateCommande(1, 10, { nombre_personne: 15 }),
      { message: "Le stock disponible est insuffisant pour cette commande." },
    );
    assert.equal(calls.update.length, 0);
    assert.equal(calls.decreaseStock.length, 0);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "rollback",
      "release",
    ]);
  });

  it("rejette une hausse si decreaseStock échoue", async () => {
    const { service, calls, events } = createMocks({
      menuModel: { decreaseStock: async () => false },
    });

    await assert.rejects(
      () => service.updateCommande(1, 10, { nombre_personne: 15 }),
      { message: "La mise à jour du stock a échoué." },
    );
    assert.equal(calls.update.length, 0);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "rollback",
      "release",
    ]);
  });

  it("restitue le stock lors d'une baisse de quantité", async () => {
    const { database, events, connection } = createTransactionalDatabase();
    const order = [];
    const { service, calls } = createMocks({
      database,
      events,
      connection,
      commandeRepository: {
        findById: async () => ({ ...ORDER, nombre_personne: 15 }),
        update: async (id, data, conn) => {
          order.push("update");
          calls.update.push({ id, data, connection: conn });
          return true;
        },
      },
      menuModel: {
        increaseStock: async (menuId, quantite, conn) => {
          order.push("increase");
          calls.increaseStock.push({ menuId, quantite, connection: conn });
          return true;
        },
      },
    });

    await service.updateCommande(1, 10, { nombre_personne: 10 });

    assert.equal(calls.decreaseStock.length, 0);
    assert.deepEqual(calls.increaseStock, [
      { menuId: 1, quantite: 5, connection },
    ]);
    assert.equal(calls.update[0].connection, connection);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "commit",
      "release",
    ]);
    assert.deepEqual(
      ["begin", ...order, "commit", "release"],
      ["begin", "update", "increase", "commit", "release"],
    );
  });

  it("ne modifie pas le stock si le nombre de personnes est identique", async () => {
    const { service, calls, events } = createMocks();

    await service.updateCommande(1, 10, { nombre_personne: 10 });

    assert.equal(calls.hasStock.length, 0);
    assert.equal(calls.decreaseStock.length, 0);
    assert.equal(calls.increaseStock.length, 0);
    assert.equal(calls.update.length, 1);
    assert.equal(calls.update[0].connection, null);
    assert.equal(events.includes("begin"), false);
  });

  it("rejette une baisse si increaseStock échoue", async () => {
    const { service, calls, events } = createMocks({
      commandeRepository: {
        findById: async () => ({ ...ORDER, nombre_personne: 15 }),
      },
      menuModel: { increaseStock: async () => false },
    });

    await assert.rejects(
      () => service.updateCommande(1, 10, { nombre_personne: 10 }),
      { message: "La mise à jour du stock a échoué." },
    );
    assert.equal(calls.update.length, 1);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "rollback",
      "release",
    ]);
  });
});

describe("CommandeService.updateStatut", () => {
  it("rejette un statut invalide", async () => {
    const { service, events } = createMocks();

    await assert.rejects(() => service.updateStatut(1, "Inconnu"), {
      message: "Statut de commande invalide.",
    });
    assert.equal(events.includes("begin"), false);
  });

  it("restock une fois lors du passage à Annulée", async () => {
    const { database, events, connection } = createTransactionalDatabase();
    const order = [];
    const { service, calls } = createMocks({
      database,
      events,
      connection,
      commandeRepository: {
        updateStatut: async (id, statut, conn) => {
          order.push("update");
          calls.updateStatut.push({ id, statut, connection: conn });
          return true;
        },
      },
      menuModel: {
        increaseStock: async (menuId, quantite, conn) => {
          order.push("increase");
          calls.increaseStock.push({ menuId, quantite, connection: conn });
          return true;
        },
      },
    });

    await service.updateStatut(1, "Annulée");

    assert.deepEqual(calls.updateStatut, [
      { id: 1, statut: "Annulée", connection },
    ]);
    assert.deepEqual(calls.increaseStock, [
      { menuId: 1, quantite: 10, connection },
    ]);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "commit",
      "release",
    ]);
    assert.deepEqual(
      ["begin", ...order, "commit", "release"],
      ["begin", "update", "increase", "commit", "release"],
    );
    assert.equal(calls.sendOrderCancellationEmail.length, 1);
    assert.equal(
      calls.sendOrderCancellationEmail[0].commande.statut,
      "Annulée",
    );
    assert.equal(calls.retirerStatistiqueCommande.length, 1);
  });

  it("refuse le passage à Annulée si déjà annulée sans restock", async () => {
    const { service, calls, events } = createMocks({
      commandeRepository: {
        findById: async () => ({ ...ORDER, statut: "Annulée" }),
      },
    });

    await assert.rejects(() => service.updateStatut(1, "Annulée"), {
      message: "Cette commande est déjà annulée.",
    });
    assert.equal(calls.updateStatut.length, 0);
    assert.equal(calls.increaseStock.length, 0);
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.equal(events.includes("begin"), false);
  });

  it("ne touche pas au stock pour un autre statut", async () => {
    const { service, calls, events } = createMocks();

    await service.updateStatut(1, "Acceptée");

    assert.deepEqual(calls.updateStatut, [
      { id: 1, statut: "Acceptée", connection: null },
    ]);
    assert.equal(calls.increaseStock.length, 0);
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.equal(events.includes("begin"), false);
  });

  it("rejette si increaseStock échoue lors du passage à Annulée", async () => {
    const { service, calls, events } = createMocks({
      menuModel: { increaseStock: async () => false },
    });

    await assert.rejects(() => service.updateStatut(1, "Annulée"), {
      message: "La mise à jour du stock a échoué.",
    });
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "rollback",
      "release",
    ]);
  });

  it("rollback sans restock si updateStatut échoue lors du passage à Annulée", async () => {
    const { service, calls, events } = createMocks({
      commandeRepository: {
        updateStatut: async () => {
          throw new Error("update failed");
        },
      },
    });

    await assert.rejects(() => service.updateStatut(1, "Annulée"), {
      message: "update failed",
    });
    assert.equal(calls.increaseStock.length, 0);
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "rollback",
      "release",
    ]);
  });
});

describe("CommandeService statistiques annulation", () => {
  const baseInput = () => ({
    menu_id: 1,
    utilisateur_id: 10,
    date_prestation: "2026-09-01",
    heure_livraison: "12:00",
    adresse_livraison: "1 rue Test",
    nombre_personne: 10,
  });

  const annulationData = {
    mode_contact_annulation: "Mail",
    motif_annulation: "Indisponible",
  };

  it("crée puis annule : +1 puis -1 Mongo", async () => {
    const { service, calls } = createMocks();

    await service.createCommande(baseInput());
    await service.annulerCommandeClient(1, 10);

    assert.equal(calls.updateStatistiqueCommande.length, 1);
    assert.equal(calls.retirerStatistiqueCommande.length, 1);
  });

  it("n'appelle pas Mongo si déjà annulée", async () => {
    const { service, calls } = createMocks({
      commandeRepository: {
        findById: async () => ({ ...ORDER, statut: "Annulée" }),
      },
    });

    await assert.rejects(() => service.annulerCommande(1, annulationData), {
      message: "Cette commande est déjà annulée.",
    });
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
    assert.equal(calls.updateStatistiqueCommande.length, 0);
  });

  it("n'appelle pas Mongo en cas de rollback d'annulation", async () => {
    const { service, calls } = createMocks({
      menuModel: { increaseStock: async () => false },
    });

    await assert.rejects(() => service.updateStatut(1, "Annulée"), {
      message: "La mise à jour du stock a échoué.",
    });
    assert.equal(calls.retirerStatistiqueCommande.length, 0);
  });
});

describe("CommandeService e-mails d'annulation", () => {
  const annulationData = {
    mode_contact_annulation: "Mail",
    motif_annulation: "Indisponible",
  };

  it("n'envoie aucun e-mail si l'utilisateur est absent", async () => {
    const { service, calls } = createMocks({
      utilisateurModel: { findById: async () => undefined },
    });

    const result = await service.annulerCommandeClient(1, 10);

    assert.equal(result, true);
    assert.equal(calls.findUtilisateurById.length, 1);
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
  });

  it("n'envoie aucun e-mail si l'utilisateur n'a pas d'email", async () => {
    const { service, calls } = createMocks({
      utilisateurModel: {
        findById: async () => ({ ...CLIENT, email: "" }),
      },
    });

    const result = await service.annulerCommande(1, annulationData);

    assert.equal(result, true);
    assert.equal(calls.sendOrderCancellationEmail.length, 0);
  });

  it("conserve le succès d'annulation si l'envoi d'e-mail échoue", async () => {
    const { service, calls } = createMocks({
      emailService: {
        sendOrderCancellationEmail: async () => {
          throw new Error("smtp down");
        },
      },
    });

    const result = await service.updateStatut(1, "Annulée");

    assert.equal(result, true);
    assert.equal(calls.sendOrderCancellationEmail.length, 1);
    assert.equal(calls.loggerErrors.length, 1);
    assert.match(String(calls.loggerErrors[0][0]), /annulation de commande/);
  });

  it("n'envoie qu'un seul e-mail par voie d'annulation réussie", async () => {
    const { service, calls } = createMocks();

    await service.annulerCommandeClient(1, 10);
    assert.equal(calls.sendOrderCancellationEmail.length, 1);

    const { service: serviceEmploye, calls: callsEmploye } = createMocks();
    await serviceEmploye.annulerCommande(1, annulationData);
    assert.equal(callsEmploye.sendOrderCancellationEmail.length, 1);

    const { service: serviceStatut, calls: callsStatut } = createMocks();
    await serviceStatut.updateStatut(1, "Annulée");
    assert.equal(callsStatut.sendOrderCancellationEmail.length, 1);
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

describe("CommandeService.withTransaction", () => {
  it("commit et release en cas de succès", async () => {
    const { database, events, connection } = createTransactionalDatabase();
    const { service } = createMocks({ database });
    let receivedConnection = null;

    const result = await service.withTransaction(async (conn) => {
      events.push("work");
      receivedConnection = conn;
      return "ok";
    });

    assert.equal(result, "ok");
    assert.equal(receivedConnection, connection);
    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "work",
      "commit",
      "release",
    ]);
  });

  it("rollback et release si work échoue, sans commit", async () => {
    const { database, events } = createTransactionalDatabase();
    const { service } = createMocks({ database });
    const originalError = new Error("work failed");

    await assert.rejects(
      () =>
        service.withTransaction(async () => {
          events.push("work");
          throw originalError;
        }),
      (error) => error === originalError,
    );

    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "work",
      "rollback",
      "release",
    ]);
    assert.equal(events.includes("commit"), false);
  });

  it("tente un rollback et release si commit échoue", async () => {
    const { database, events } = createTransactionalDatabase({
      commitShouldFail: true,
    });
    const { service } = createMocks({ database });

    await assert.rejects(
      () =>
        service.withTransaction(async () => {
          events.push("work");
          return "ok";
        }),
      { message: "commit failed" },
    );

    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "work",
      "rollback",
      "release",
    ]);
    assert.equal(events.includes("commit"), false);
  });

  it("ne masque pas l'erreur d'origine si rollback échoue", async () => {
    const { database, events } = createTransactionalDatabase({
      rollbackShouldFail: true,
    });
    const { service } = createMocks({ database });
    const originalError = new Error("work failed");

    await assert.rejects(
      () =>
        service.withTransaction(async () => {
          events.push("work");
          throw originalError;
        }),
      (error) => error === originalError,
    );

    assert.deepEqual(events, [
      "getConnection",
      "begin",
      "work",
      "release",
    ]);
  });
});

