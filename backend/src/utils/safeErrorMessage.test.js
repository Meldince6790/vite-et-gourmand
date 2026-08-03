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
