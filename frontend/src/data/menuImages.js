/**
 * Photos de cartes catalogue.
 * - IDs 1–3 : images dédiées du seed initial
 * - Autres menus : réutilisation des mêmes assets libres (Unsplash/Pexels)
 *   selon le régime puis le thème, pour éviter les cartes sans visuel.
 */
const MENU_IMAGES_BY_ID = {
  1: "/images/menus/menu-entreprise.webp",
  2: "/images/menus/menu-vegetarien.webp",
  3: "/images/menus/menu-vegan.webp",
};

const IMAGE_ENTREPRISE = "/images/menus/menu-entreprise.webp";
const IMAGE_VEGETARIEN = "/images/menus/menu-vegetarien.webp";
const IMAGE_VEGAN = "/images/menus/menu-vegan.webp";

function normalizeLabel(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * @param {number|string|null|undefined} menuId
 * @param {{ theme?: string, regime?: string }} [options]
 */
export function getMenuImageSrc(menuId, options = {}) {
  if (menuId != null && MENU_IMAGES_BY_ID[menuId]) {
    return MENU_IMAGES_BY_ID[menuId];
  }

  if (menuId != null && MENU_IMAGES_BY_ID[String(menuId)]) {
    return MENU_IMAGES_BY_ID[String(menuId)];
  }

  const regime = normalizeLabel(options.regime);
  if (regime.includes("vegan")) {
    return IMAGE_VEGAN;
  }
  if (regime.includes("vegetarien")) {
    return IMAGE_VEGETARIEN;
  }

  const theme = normalizeLabel(options.theme);
  if (theme.includes("mariage")) {
    return IMAGE_VEGAN;
  }
  if (theme.includes("entreprise")) {
    return IMAGE_ENTREPRISE;
  }
  if (theme.includes("evenement") || theme.includes("prive")) {
    return IMAGE_VEGETARIEN;
  }

  // Secours : image générique plutôt qu'une carte vide
  return IMAGE_ENTREPRISE;
}

export default MENU_IMAGES_BY_ID;
