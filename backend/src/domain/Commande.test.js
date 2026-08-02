const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const Commande = require("./Commande");

const MENU = {
  prix_par_personne: 10,
  nombre_personne_minimum: 10,
};

describe("Commande.calculerPrixMenu", () => {
  it("calcule le prix sans remise", () => {
    assert.equal(Commande.calculerPrixMenu(MENU, 10), 100);
  });

  it("applique une remise de 10 % si nb >= minimum + 5", () => {
    assert.equal(Commande.calculerPrixMenu(MENU, 15), 135);
  });

  it("n'applique pas de remise si nb === minimum + 4", () => {
    assert.equal(Commande.calculerPrixMenu(MENU, 14), 140);
  });

  it("arrondit à 2 décimales", () => {
    // 10.125 × 3 = 30.375 → toFixed(2) = 30.38
    const menu = { prix_par_personne: 10.125, nombre_personne_minimum: 2 };
    assert.equal(Commande.calculerPrixMenu(menu, 3), 30.38);
  });
});

describe("Commande.calculerPrixLivraison", () => {
  it("retourne 0 si distance absente, nulle ou négative", () => {
    assert.equal(Commande.calculerPrixLivraison(undefined), 0);
    assert.equal(Commande.calculerPrixLivraison(0), 0);
    assert.equal(Commande.calculerPrixLivraison(-1), 0);
  });

  it("applique la formule 5 + 0.59 × km", () => {
    assert.equal(Commande.calculerPrixLivraison(10), 10.9);
  });

  it("arrondit à 2 décimales", () => {
    assert.equal(Commande.calculerPrixLivraison(1), 5.59);
  });
});

describe("Commande.calculerTotal", () => {
  it("somme prix_menu et prix_livraison", () => {
    const commande = new Commande({ prix_menu: 100, prix_livraison: 10.9 });
    assert.equal(commande.calculerTotal(), 110.9);
  });
});

describe("Commande droits client", () => {
  it("autorise modification et annulation si statut En attente", () => {
    const commande = new Commande({ statut: "En attente" });
    assert.equal(commande.peutEtreModifieeParClient(), true);
    assert.equal(commande.peutEtreAnnuleeParClient(), true);
  });

  it("refuse modification et annulation pour les autres statuts", () => {
    for (const statut of ["Acceptée", "Annulée", "Terminée"]) {
      const commande = new Commande({ statut });
      assert.equal(commande.peutEtreModifieeParClient(), false);
      assert.equal(commande.peutEtreAnnuleeParClient(), false);
    }
  });
});

describe("Commande.initialiserCreation", () => {
  const date = new Date("2026-08-02T12:00:00.000Z");

  const input = {
    menu_id: 1,
    utilisateur_id: 10,
    date_prestation: "2026-09-01",
    heure_livraison: "12:00",
    adresse_livraison: "1 rue Test",
    nombre_personne: 15,
    distance_km: 10,
  };

  it("retourne une instance de Commande", () => {
    const commande = Commande.initialiserCreation(input, MENU, date);
    assert.ok(commande instanceof Commande);
  });

  it("initialise statut, numéro, date et prix", () => {
    const commande = Commande.initialiserCreation(input, MENU, date);

    assert.equal(commande.statut, "En attente");
    assert.equal(commande.numero_commande, `CMD-${date.getTime()}`);
    assert.equal(commande.date_commande, date);
    assert.equal(commande.prix_menu, 135);
    assert.equal(commande.prix_livraison, 10.9);
  });

  it("met pret_materiel et restitution_materiel à false par défaut", () => {
    const commande = Commande.initialiserCreation(input, MENU, date);
    assert.equal(commande.pret_materiel, false);
    assert.equal(commande.restitution_materiel, false);
  });

  it("conserve les valeurs de matériel fournies", () => {
    const commande = Commande.initialiserCreation(
      { ...input, pret_materiel: true, restitution_materiel: true },
      MENU,
      date,
    );
    assert.equal(commande.pret_materiel, true);
    assert.equal(commande.restitution_materiel, true);
  });
});
