const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const CommandeRepository = require("./CommandeRepository");

function createFakeDatabase(result) {
  const calls = [];

  return {
    calls,
    query: async (sql, params) => {
      calls.push({ sql, params });
      return result;
    },
  };
}

describe("CommandeRepository", () => {
  describe("findAll", () => {
    it("retourne rows et exécute une seule requête avec jointure", async () => {
      const rows = [{ commande_id: 1, nom: "Dupont" }];
      const database = createFakeDatabase([rows]);
      const repo = new CommandeRepository(database);

      const result = await repo.findAll();

      assert.equal(result, rows);
      assert.equal(database.calls.length, 1);
      assert.match(database.calls[0].sql, /LEFT JOIN utilisateur/i);
      assert.equal(database.calls[0].params, undefined);
    });
  });

  describe("findById", () => {
    it("retourne rows[0] et passe l'id en paramètre", async () => {
      const row = { commande_id: 5 };
      const database = createFakeDatabase([[row]]);
      const repo = new CommandeRepository(database);

      const result = await repo.findById(5);

      assert.equal(result, row);
      assert.equal(database.calls.length, 1);
      assert.deepEqual(database.calls[0].params, [5]);
    });

    it("retourne undefined si aucune ligne", async () => {
      const database = createFakeDatabase([[]]);
      const repo = new CommandeRepository(database);

      const result = await repo.findById(999);

      assert.equal(result, undefined);
      assert.equal(database.calls.length, 1);
    });
  });

  describe("findByUtilisateurId", () => {
    it("retourne rows filtrées par utilisateur", async () => {
      const rows = [{ commande_id: 1 }, { commande_id: 2 }];
      const database = createFakeDatabase([rows]);
      const repo = new CommandeRepository(database);

      const result = await repo.findByUtilisateurId(10);

      assert.equal(result, rows);
      assert.equal(database.calls.length, 1);
      assert.deepEqual(database.calls[0].params, [10]);
    });
  });

  describe("create", () => {
    it("retourne insertId et respecte l'ordre exact des paramètres", async () => {
      const database = createFakeDatabase([{ insertId: 42 }]);
      const repo = new CommandeRepository(database);
      const commande = {
        numero_commande: "CMD-1",
        date_commande: "2026-08-02",
        date_prestation: "2026-09-01",
        heure_livraison: "12:00",
        adresse_livraison: "1 rue Test",
        distance_km: 12.34,
        informations_complementaires: "Accès code A123",
        prix_menu: 100,
        nombre_personne: 10,
        prix_livraison: 5.59,
        statut: "En attente",
        pret_materiel: false,
        restitution_materiel: true,
        utilisateur_id: 7,
        menu_id: 3,
      };

      const result = await repo.create(commande);

      assert.equal(result, 42);
      assert.equal(database.calls.length, 1);
      assert.match(database.calls[0].sql, /INSERT INTO commande/i);
      assert.match(database.calls[0].sql, /distance_km/i);
      assert.match(
        database.calls[0].sql,
        /informations_complementaires/i,
      );
      assert.deepEqual(database.calls[0].params, [
        "CMD-1",
        "2026-08-02",
        "2026-09-01",
        "12:00",
        "1 rue Test",
        12.34,
        "Accès code A123",
        100,
        10,
        5.59,
        "En attente",
        false,
        true,
        7,
        3,
      ]);
    });

    it("insère NULL si distance_km et informations_complementaires absentes", async () => {
      const database = createFakeDatabase([{ insertId: 1 }]);
      const repo = new CommandeRepository(database);

      await repo.create({
        numero_commande: "CMD-1",
        date_commande: "2026-08-02",
        date_prestation: "2026-09-01",
        heure_livraison: "12:00",
        adresse_livraison: "1 rue Test",
        prix_menu: 100,
        nombre_personne: 10,
        prix_livraison: 5.59,
        statut: "En attente",
        pret_materiel: false,
        restitution_materiel: true,
        utilisateur_id: 7,
        menu_id: 3,
      });

      assert.equal(database.calls[0].params[5], null);
      assert.equal(database.calls[0].params[6], null);
    });
  });

  describe("updateStatut", () => {
    it("retourne true si affectedRows > 0", async () => {
      const database = createFakeDatabase([{ affectedRows: 1 }]);
      const repo = new CommandeRepository(database);

      const result = await repo.updateStatut(1, "Acceptée");

      assert.equal(result, true);
      assert.equal(database.calls.length, 1);
      assert.deepEqual(database.calls[0].params, ["Acceptée", 1]);
    });

    it("retourne false si affectedRows === 0", async () => {
      const database = createFakeDatabase([{ affectedRows: 0 }]);
      const repo = new CommandeRepository(database);

      assert.equal(await repo.updateStatut(1, "Acceptée"), false);
      assert.equal(database.calls.length, 1);
    });
  });

  describe("updateAnnulation", () => {
    it("retourne un booléen et respecte l'ordre exact des paramètres", async () => {
      const database = createFakeDatabase([{ affectedRows: 1 }]);
      const repo = new CommandeRepository(database);
      const dateAnnulation = new Date("2026-08-02T12:00:00.000Z");

      const result = await repo.updateAnnulation(9, {
        mode_contact_annulation: "Mail",
        motif_annulation: "Indisponible",
        date_annulation: dateAnnulation,
      });

      assert.equal(result, true);
      assert.equal(database.calls.length, 1);
      assert.deepEqual(database.calls[0].params, [
        "Annulée",
        "Mail",
        "Indisponible",
        dateAnnulation,
        9,
      ]);
    });
  });

  describe("update", () => {
    it("retourne un booléen et respecte l'ordre exact des paramètres", async () => {
      const database = createFakeDatabase([{ affectedRows: 1 }]);
      const repo = new CommandeRepository(database);
      const commande = {
        date_prestation: "2026-09-02",
        heure_livraison: "13:00",
        adresse_livraison: "2 rue Test",
        distance_km: 8.5,
        informations_complementaires: "Sonner à l'interphone",
        nombre_personne: 12,
        prix_menu: 120,
        prix_livraison: 10.02,
        pret_materiel: true,
        restitution_materiel: false,
      };

      const result = await repo.update(4, commande);

      assert.equal(result, true);
      assert.equal(database.calls.length, 1);
      assert.match(database.calls[0].sql, /distance_km\s*=\s*\?/i);
      assert.match(
        database.calls[0].sql,
        /informations_complementaires\s*=\s*\?/i,
      );
      assert.match(database.calls[0].sql, /prix_livraison\s*=\s*\?/i);
      assert.deepEqual(database.calls[0].params, [
        "2026-09-02",
        "13:00",
        "2 rue Test",
        8.5,
        "Sonner à l'interphone",
        12,
        120,
        10.02,
        true,
        false,
        4,
      ]);
    });
  });

  describe("connexion optionnelle", () => {
    const commandeCreate = {
      numero_commande: "CMD-1",
      date_commande: "2026-08-02",
      date_prestation: "2026-09-01",
      heure_livraison: "12:00",
      adresse_livraison: "1 rue Test",
      distance_km: null,
      informations_complementaires: null,
      prix_menu: 100,
      nombre_personne: 10,
      prix_livraison: 5.59,
      statut: "En attente",
      pret_materiel: false,
      restitution_materiel: true,
      utilisateur_id: 7,
      menu_id: 3,
    };

    const commandeUpdate = {
      date_prestation: "2026-09-02",
      heure_livraison: "13:00",
      adresse_livraison: "2 rue Test",
      distance_km: null,
      informations_complementaires: null,
      nombre_personne: 12,
      prix_menu: 120,
      prix_livraison: 0,
      pret_materiel: true,
      restitution_materiel: false,
    };

    it("create utilise connection.query et n'appelle pas le pool", async () => {
      const database = createFakeDatabase([{ insertId: 1 }]);
      const connection = createFakeDatabase([{ insertId: 99 }]);
      const repo = new CommandeRepository(database);

      const result = await repo.create(commandeCreate, connection);

      assert.equal(result, 99);
      assert.equal(connection.calls.length, 1);
      assert.equal(database.calls.length, 0);
      assert.match(connection.calls[0].sql, /INSERT INTO commande/i);
    });

    it("updateStatut utilise connection.query et n'appelle pas le pool", async () => {
      const database = createFakeDatabase([{ affectedRows: 0 }]);
      const connection = createFakeDatabase([{ affectedRows: 1 }]);
      const repo = new CommandeRepository(database);

      const result = await repo.updateStatut(1, "Annulée", connection);

      assert.equal(result, true);
      assert.equal(connection.calls.length, 1);
      assert.equal(database.calls.length, 0);
      assert.deepEqual(connection.calls[0].params, ["Annulée", 1]);
    });

    it("updateAnnulation utilise connection.query et n'appelle pas le pool", async () => {
      const database = createFakeDatabase([{ affectedRows: 0 }]);
      const connection = createFakeDatabase([{ affectedRows: 1 }]);
      const repo = new CommandeRepository(database);
      const dateAnnulation = new Date("2026-08-02T12:00:00.000Z");

      const result = await repo.updateAnnulation(
        9,
        {
          mode_contact_annulation: "Mail",
          motif_annulation: "Indisponible",
          date_annulation: dateAnnulation,
        },
        connection,
      );

      assert.equal(result, true);
      assert.equal(connection.calls.length, 1);
      assert.equal(database.calls.length, 0);
      assert.deepEqual(connection.calls[0].params, [
        "Annulée",
        "Mail",
        "Indisponible",
        dateAnnulation,
        9,
      ]);
    });

    it("update utilise connection.query et n'appelle pas le pool", async () => {
      const database = createFakeDatabase([{ affectedRows: 0 }]);
      const connection = createFakeDatabase([{ affectedRows: 1 }]);
      const repo = new CommandeRepository(database);

      const result = await repo.update(4, commandeUpdate, connection);

      assert.equal(result, true);
      assert.equal(connection.calls.length, 1);
      assert.equal(database.calls.length, 0);
      assert.deepEqual(connection.calls[0].params, [
        "2026-09-02",
        "13:00",
        "2 rue Test",
        null,
        null,
        12,
        120,
        0,
        true,
        false,
        4,
      ]);
    });

    it("sans connexion, create continue d'utiliser le pool du constructeur", async () => {
      const database = createFakeDatabase([{ insertId: 42 }]);
      const repo = new CommandeRepository(database);

      const result = await repo.create(commandeCreate);

      assert.equal(result, 42);
      assert.equal(database.calls.length, 1);
    });
  });

  describe("delete", () => {
    it("retourne true si une ligne est supprimée", async () => {
      const database = createFakeDatabase([{ affectedRows: 1 }]);
      const repo = new CommandeRepository(database);

      assert.equal(await repo.delete(8), true);
      assert.equal(database.calls.length, 1);
      assert.deepEqual(database.calls[0].params, [8]);
      assert.match(database.calls[0].sql, /DELETE FROM commande/i);
    });
  });

  describe("exists", () => {
    it("retourne true si rows.length > 0", async () => {
      const database = createFakeDatabase([[{ commande_id: 1 }]]);
      const repo = new CommandeRepository(database);

      assert.equal(await repo.exists(1), true);
      assert.equal(database.calls.length, 1);
      assert.deepEqual(database.calls[0].params, [1]);
    });

    it("retourne false si aucune ligne", async () => {
      const database = createFakeDatabase([[]]);
      const repo = new CommandeRepository(database);

      assert.equal(await repo.exists(1), false);
      assert.equal(database.calls.length, 1);
    });
  });
});
