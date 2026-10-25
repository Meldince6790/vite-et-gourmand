/**
 * Photos de cartes catalogue (ressources locales versionnées).
 *
 * Priorité :
 * 1. Mapping par **titre** vers WebP dédiés (8 menus conservés)
 * 2. Placeholder générique pour tout menu futur non mappé
 */

/** Secours unique — même asset neutre que les plats. */
export const MENU_IMAGE_PLACEHOLDER = "/images/plats/plat-placeholder.svg";

/** Cibles dédiées — 8 menus du catalogue réduit. */
export const MENU_IMAGES_BY_TITLE = {
  "menu entreprise classique": "/images/menus/menu-01-entreprise-classique.webp",
  "menu vegetarien gourmand": "/images/menus/menu-02-vegetarien-gourmand.webp",
  "menu mariage vegan": "/images/menus/menu-03-mariage-vegan.webp",
  "menu cocktail dinatoire": "/images/menus/menu-04-cocktail-dinatoire.webp",
  "menu buffet traditionnel": "/images/menus/menu-05-buffet-traditionnel.webp",
  "menu gastronomique signature":
    "/images/menus/menu-06-gastronomique-signature.webp",
  "menu estival mediterraneen":
    "/images/menus/menu-08-estival-mediterraneen.webp",
  "menu brunch festif": "/images/menus/menu-15-brunch-festif.webp",
};

/** Images dédiées intégrées sous public/images/menus/. */
export const USE_DEDICATED_MENU_IMAGES = true;

export function normalizeMenuTitle(value) {
  return String(value || "")
    .replace(/œ/gi, "oe")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * @param {number|string|null|undefined} menuId
 * @param {{ theme?: string, regime?: string, titre?: string }} [options]
 */
export function getMenuImageSrc(menuId, options = {}) {
  if (USE_DEDICATED_MENU_IMAGES && options.titre) {
    const byTitle = MENU_IMAGES_BY_TITLE[normalizeMenuTitle(options.titre)];
    if (byTitle) {
      return byTitle;
    }
  }

  return MENU_IMAGE_PLACEHOLDER;
}

export default MENU_IMAGES_BY_TITLE;
