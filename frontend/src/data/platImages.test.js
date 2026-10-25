import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getPlatImageSrc,
  normalizePlatTitle,
  PLAT_IMAGE_PLACEHOLDER,
} from "./platImages.js";

describe("platImages", () => {
  it("associe les plats seed à leur WebP dédié", () => {
    assert.equal(
      getPlatImageSrc({ plat_id: 1, titre_plat: "Salade périgourdine" }),
      "/images/plats/plat-01-salade-perigourdine.webp",
    );
    assert.equal(
      getPlatImageSrc({
        plat_id: 8,
        titre_plat: "Mousse au chocolat végétale",
      }),
      "/images/plats/plat-08-mousse-chocolat-vegetale.webp",
    );
  });

  it("associe la Tarte Tatin à son WebP dédié", () => {
    assert.equal(
      getPlatImageSrc({ titre_plat: "Tarte Tatin" }),
      "/images/plats/plat-tarte-tatin.webp",
    );
  });

  it("associe les 10 plats enrichis à leur WebP dédié", () => {
    assert.equal(
      getPlatImageSrc({ titre_plat: "Mini bouchées saumon aneth" }),
      "/images/plats/plat-mini-bouchees-saumon-aneth.webp",
    );
    assert.equal(
      getPlatImageSrc({ titre_plat: "Quiche aux légumes du jardin" }),
      "/images/plats/plat-quiche-legumes-jardin.webp",
    );
    assert.equal(
      getPlatImageSrc({ titre_plat: "Filet de bœuf sauce poivre" }),
      "/images/plats/plat-filet-boeuf-sauce-poivre.webp",
    );
    assert.equal(
      getPlatImageSrc({ titre_plat: "Paris-Brest praliné" }),
      "/images/plats/plat-paris-brest-praline.webp",
    );
    assert.equal(
      getPlatImageSrc({ titre_plat: "Gaspacho andalou" }),
      "/images/plats/plat-gaspacho-andalou.webp",
    );
    assert.equal(
      getPlatImageSrc({ titre_plat: "Paella du traiteur" }),
      "/images/plats/plat-paella-traiteur.webp",
    );
    assert.equal(
      getPlatImageSrc({ titre_plat: "Clafoutis aux cerises" }),
      "/images/plats/plat-clafoutis-cerises.webp",
    );
    assert.equal(
      getPlatImageSrc({ titre_plat: "Soupe à l'oignon gratinée" }),
      "/images/plats/plat-soupe-oignon-gratinee.webp",
    );
    assert.equal(
      getPlatImageSrc({ titre_plat: "Blanquette de veau maison" }),
      "/images/plats/plat-blanquette-veau-maison.webp",
    );
  });

  it("utilise le placeholder uniquement pour un plat inconnu", () => {
    assert.equal(
      getPlatImageSrc({ titre_plat: "Plat futur inconnu" }),
      PLAT_IMAGE_PLACEHOLDER,
    );
  });

  it("préfère une URL / chemin DB explicite au mapping local", () => {
    assert.equal(
      getPlatImageSrc({
        plat_id: 1,
        titre_plat: "Salade périgourdine",
        photo: "/images/custom.webp",
      }),
      "/images/custom.webp",
    );
  });

  it("normalise les accents pour la clé titre", () => {
    assert.equal(
      normalizePlatTitle("  Velouté de Légumes de Saison "),
      "veloute de legumes de saison",
    );
  });
});
