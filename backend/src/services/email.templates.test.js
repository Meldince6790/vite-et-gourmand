const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const templates = require("./email.templates");

describe("email.templates", () => {
  it("contactNotification retourne subject, text et html", () => {
    const result = templates.contactNotification({
      nom: "Claire Durand",
      email: "claire@example.com",
      message: "Bonjour,\nJe souhaite un devis.",
    });

    assert.equal(typeof result.subject, "string");
    assert.equal(typeof result.text, "string");
    assert.equal(typeof result.html, "string");
    assert.match(result.subject, /Claire Durand/);
    assert.match(result.text, /claire@example.com/);
    assert.match(result.text, /Je souhaite un devis/);
    assert.match(result.html, /Claire Durand/);
  });

  it("contactAcknowledgement retourne subject, text et html", () => {
    const result = templates.contactAcknowledgement({ nom: "Claire" });

    assert.match(result.subject, /reçu/i);
    assert.match(result.text, /Claire/);
    assert.match(result.html, /Claire/);
  });

  it("welcome retourne subject, text et html", () => {
    const result = templates.welcome({
      prenom: "Claire",
      nom: "Durand",
    });

    assert.match(result.subject, /Bienvenue/);
    assert.match(result.text, /Claire Durand/);
    assert.match(result.html, /Claire/);
  });

  it("orderConfirmation inclut les informations de commande", () => {
    const result = templates.orderConfirmation({
      prenom: "Claire",
      commande: {
        numero_commande: "CMD-123",
        statut: "En attente",
        date_prestation: "2026-09-01",
        nombre_personne: 12,
        prix_menu: 108,
        prix_livraison: 0,
      },
    });

    assert.match(result.subject, /CMD-123/);
    assert.match(result.text, /En attente/);
    assert.match(result.text, /108.00/);
    assert.match(result.html, /CMD-123/);
  });

  it("orderCancellation inclut le numéro de commande", () => {
    const result = templates.orderCancellation({
      prenom: "Claire",
      commande: {
        numero_commande: "CMD-123",
        statut: "Annulée",
      },
    });

    assert.match(result.subject, /CMD-123/);
    assert.match(result.text, /annulée/i);
    assert.match(result.html, /Annulée/);
  });
});
