import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getMenuImageSrc,
  MENU_IMAGE_PLACEHOLDER,
  MENU_IMAGES_BY_TITLE,
  normalizeMenuTitle,
  USE_DEDICATED_MENU_IMAGES,
} from "./menuImages.js";

describe("menuImages", () => {
  it("active les images dédiées pour les 8 menus conservés", () => {
    assert.equal(USE_DEDICATED_MENU_IMAGES, true);
    assert.equal(
      getMenuImageSrc(1, { titre: "Menu Entreprise Classique" }),
      "/images/menus/menu-01-entreprise-classique.webp",
    );
    assert.equal(
      getMenuImageSrc(2, { titre: "Menu Végétarien Gourmand" }),
      "/images/menus/menu-02-vegetarien-gourmand.webp",
    );
    assert.equal(
      getMenuImageSrc(3, { titre: "Menu Mariage Végan" }),
      "/images/menus/menu-03-mariage-vegan.webp",
    );
    assert.equal(
      getMenuImageSrc(4, { titre: "Menu Cocktail Dinatoire" }),
      "/images/menus/menu-04-cocktail-dinatoire.webp",
    );
    assert.equal(
      getMenuImageSrc(5, { titre: "Menu Buffet Traditionnel" }),
      "/images/menus/menu-05-buffet-traditionnel.webp",
    );
    assert.equal(
      getMenuImageSrc(6, { titre: "Menu Gastronomique Signature" }),
      "/images/menus/menu-06-gastronomique-signature.webp",
    );
    assert.equal(
      getMenuImageSrc(8, { titre: "Menu Estival Méditerranéen" }),
      "/images/menus/menu-08-estival-mediterraneen.webp",
    );
    assert.equal(
      getMenuImageSrc(15, { titre: "Menu Brunch Festif" }),
      "/images/menus/menu-15-brunch-festif.webp",
    );
  });

  it("définit les 8 chemins dédiés cibles par titre", () => {
    assert.equal(Object.keys(MENU_IMAGES_BY_TITLE).length, 8);
    assert.equal(
      MENU_IMAGES_BY_TITLE[normalizeMenuTitle("Menu Brunch Festif")],
      "/images/menus/menu-15-brunch-festif.webp",
    );
    assert.equal(
      MENU_IMAGES_BY_TITLE[normalizeMenuTitle("Menu Estival Méditerranéen")],
      "/images/menus/menu-08-estival-mediterraneen.webp",
    );
  });

  it("utilise le placeholder générique pour un titre inconnu", () => {
    assert.equal(
      getMenuImageSrc(99, {
        titre: "Menu Inconnu Futur",
        regime: "Classique",
      }),
      MENU_IMAGE_PLACEHOLDER,
    );
    assert.equal(
      getMenuImageSrc(99, {
        titre: "Menu Inconnu Futur",
        regime: "Végétarien",
      }),
      MENU_IMAGE_PLACEHOLDER,
    );
    assert.equal(
      getMenuImageSrc(1, { titre: undefined }),
      MENU_IMAGE_PLACEHOLDER,
    );
    assert.equal(MENU_IMAGE_PLACEHOLDER, "/images/plats/plat-placeholder.svg");
  });
});
