const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { loadActiveUserFromToken } = require("./activeUser");

describe("loadActiveUserFromToken", () => {
  it("retourne null si utilisateur_id est invalide", async () => {
    const findById = async () => {
      throw new Error("ne doit pas être appelé");
    };

    assert.equal(await loadActiveUserFromToken({}, { findById }), null);
    assert.equal(
      await loadActiveUserFromToken({ utilisateur_id: "x" }, { findById }),
      null,
    );
    assert.equal(
      await loadActiveUserFromToken({ utilisateur_id: 0 }, { findById }),
      null,
    );
  });

  it("retourne null si le compte est introuvable", async () => {
    const result = await loadActiveUserFromToken(
      { utilisateur_id: 1 },
      { findById: async () => null },
    );
    assert.equal(result, null);
  });

  it("retourne null si le compte est désactivé", async () => {
    const result = await loadActiveUserFromToken(
      { utilisateur_id: 2 },
      {
        findById: async () => ({
          utilisateur_id: 2,
          role_id: 1,
          email: "client@example.com",
          actif: 0,
        }),
      },
    );
    assert.equal(result, null);
  });

  it("retourne le profil si le compte est actif", async () => {
    const result = await loadActiveUserFromToken(
      { utilisateur_id: 3, email: "stale@example.com", role_id: 99 },
      {
        findById: async () => ({
          utilisateur_id: 3,
          role_id: 2,
          email: "employe@example.com",
          actif: 1,
        }),
      },
    );

    assert.deepEqual(result, {
      utilisateur_id: 3,
      role_id: 2,
      email: "employe@example.com",
    });
  });
});
