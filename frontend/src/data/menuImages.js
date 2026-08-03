/**
 * Mapping frontend des photos de cartes catalogue.
 * Les clés correspondent aux menu_id de démonstration (database/vite_gourmand.sql).
 */
const MENU_IMAGES = {
  1: "/images/menus/menu-entreprise.webp",
  2: "/images/menus/menu-vegetarien.webp",
  3: "/images/menus/menu-vegan.webp",
};

export function getMenuImageSrc(menuId) {
  if (menuId == null) {
    return null;
  }

  return MENU_IMAGES[menuId] || MENU_IMAGES[String(menuId)] || null;
}

export default MENU_IMAGES;
