/**
 * Photos des plats (ressources locales versionnées).
 *
 * Règles :
 * - association explicite titre → WebP pour les 19 plats conservés ;
 * - sinon placeholder neutre — jamais de recyclage cyclique trompeur.
 *
 * La colonne MariaDB `plat.photo` (BLOB) n'est pas utilisée par le catalogue
 * public : les visuels viennent de ce mapping frontend.
 */

export const PLAT_IMAGE_PLACEHOLDER = "/images/plats/plat-placeholder.svg";

/** Correspondances justifiées titre_plat → asset (clés normalisées). */
const PLAT_IMAGES_BY_TITLE = {
  // Seed initial (ids 1–9)
  "salade perigourdine": "/images/plats/plat-01-salade-perigourdine.webp",
  "veloute de legumes de saison": "/images/plats/plat-02-veloute-legumes.webp",
  "tartare de legumes mediterraneens":
    "/images/plats/plat-03-tartare-legumes.webp",
  "filet de poulet sauce forestiere":
    "/images/plats/plat-04-poulet-sauce-forestiere.webp",
  "curry de legumes au lait de coco":
    "/images/plats/plat-05-curry-legumes-coco.webp",
  "risotto aux legumes": "/images/plats/plat-06-risotto-legumes.webp",
  "tarte aux pommes maison": "/images/plats/plat-07-tarte-pommes.webp",
  "mousse au chocolat vegetale":
    "/images/plats/plat-08-mousse-chocolat-vegetale.webp",
  "salade de fruits frais": "/images/plats/plat-09-salade-fruits.webp",

  // Enrichissement catalogue (10 plats supplémentaires)
  "mini bouchees saumon aneth":
    "/images/plats/plat-mini-bouchees-saumon-aneth.webp",
  "quiche aux legumes du jardin":
    "/images/plats/plat-quiche-legumes-jardin.webp",
  "filet de boeuf sauce poivre":
    "/images/plats/plat-filet-boeuf-sauce-poivre.webp",
  "paris-brest praline": "/images/plats/plat-paris-brest-praline.webp",
  "gaspacho andalou": "/images/plats/plat-gaspacho-andalou.webp",
  "paella du traiteur": "/images/plats/plat-paella-traiteur.webp",
  "clafoutis aux cerises": "/images/plats/plat-clafoutis-cerises.webp",
  "soupe a l'oignon gratinee":
    "/images/plats/plat-soupe-oignon-gratinee.webp",
  "blanquette de veau maison":
    "/images/plats/plat-blanquette-veau-maison.webp",
  "tarte tatin": "/images/plats/plat-tarte-tatin.webp",
};

/** Secours par plat_id pour le seed (1–9) si le titre changeait légèrement. */
const PLAT_IMAGES_BY_ID = {
  1: "/images/plats/plat-01-salade-perigourdine.webp",
  2: "/images/plats/plat-02-veloute-legumes.webp",
  3: "/images/plats/plat-03-tartare-legumes.webp",
  4: "/images/plats/plat-04-poulet-sauce-forestiere.webp",
  5: "/images/plats/plat-05-curry-legumes-coco.webp",
  6: "/images/plats/plat-06-risotto-legumes.webp",
  7: "/images/plats/plat-07-tarte-pommes.webp",
  8: "/images/plats/plat-08-mousse-chocolat-vegetale.webp",
  9: "/images/plats/plat-09-salade-fruits.webp",
};

export function normalizePlatTitle(value) {
  return String(value || "")
    .replace(/œ/gi, "oe")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Interprète une valeur `plat.photo` éventuelle (URL / data-URI / chemin).
 * Ignore les Buffer JSON et les chaînes vides.
 */
export function getDatabasePhotoSrc(photo) {
  if (typeof photo !== "string") {
    return null;
  }

  const value = photo.trim();
  if (value === "") {
    return null;
  }

  if (
    value.startsWith("data:") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  ) {
    return value;
  }

  // Ancien format : chaîne base64 brute (JPEG)
  return `data:image/jpeg;base64,${value}`;
}

function getLocalPlatImageSrc(plat) {
  const byTitle = PLAT_IMAGES_BY_TITLE[normalizePlatTitle(plat?.titre_plat)];
  if (byTitle) {
    return byTitle;
  }

  if (plat?.plat_id != null) {
    const byId =
      PLAT_IMAGES_BY_ID[plat.plat_id] ||
      PLAT_IMAGES_BY_ID[String(plat.plat_id)];
    if (byId) {
      return byId;
    }
  }

  return PLAT_IMAGE_PLACEHOLDER;
}

/**
 * @param {{ plat_id?: number|string, titre_plat?: string, photo?: unknown }} plat
 */
export function getPlatImageSrc(plat) {
  return getDatabasePhotoSrc(plat?.photo) || getLocalPlatImageSrc(plat);
}

export default PLAT_IMAGES_BY_TITLE;
