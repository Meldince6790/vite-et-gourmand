const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const {
  isTechnicalErrorMessage,
  toClientErrorMessage,
} = require("./safeErrorMessage");

describe("safeErrorMessage", () => {
  it("détecte les messages SQL / techniques", () => {
    assert.equal(
      isTechnicalErrorMessage("ER_DUP_ENTRY: Duplicate entry 'a' for key 'email'"),
      true,
    );
    assert.equal(
      isTechnicalErrorMessage("connect ECONNREFUSED 127.0.0.1:3306"),
      true,
    );
    assert.equal(isTechnicalErrorMessage("Unknown column 'foo' in 'field list'"), true);
    assert.equal(
      isTechnicalErrorMessage(
        "Cannot read properties of undefined (reading 'x')",
      ),
      true,
    );
    assert.equal(isTechnicalErrorMessage("TypeError: x is not a function"), true);
  });

  it("conserve les messages métier français", () => {
    assert.equal(isTechnicalErrorMessage("Menu introuvable."), false);
    assert.equal(
      isTechnicalErrorMessage("Le nombre de personnes doit être supérieur à zéro."),
      false,
    );
  });

  it("remplace un message technique par le message générique", () => {
    assert.equal(
      toClientErrorMessage(
        new Error("ER_BAD_FIELD_ERROR: Unknown column 'x'"),
        "Erreur lors de l'opération.",
      ),
      "Erreur lors de l'opération.",
    );
  });

  it("conserve un message métier", () => {
    assert.equal(
      toClientErrorMessage(new Error("Plat introuvable."), "Erreur générique."),
      "Plat introuvable.",
    );
  });
});

describe("safeErrorMessage : erreurs du pilote SQL", () => {
  const { isSqlDriverError } = require("./safeErrorMessage");

  it("masque une erreur identifiée par sqlState / sqlMessage / code ER_", () => {
    const error = Object.assign(
      new Error(
        "You have an error in your SQL syntax; check the manual near 'WHERE avis_id = '1'' at line 1",
      ),
      { code: "ER_PARSE_ERROR", sqlState: "42000", sqlMessage: "x" },
    );

    assert.equal(isSqlDriverError(error), true);
    assert.equal(toClientErrorMessage(error, "Erreur générique."), "Erreur générique.");
  });

  it("ne confond pas une erreur métier avec une erreur SQL", () => {
    assert.equal(isSqlDriverError(new Error("Avis introuvable.")), false);
    assert.equal(isSqlDriverError(null), false);
  });
});
