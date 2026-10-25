/** Palette de données contrastée (distincte du vert/beige du site) */
export const CHART_MENU_PALETTE = [
  "#3B82F6", // bleu
  "#F59E0B", // orange
  "#EF4444", // rouge
  "#8B5CF6", // violet
  "#06B6D4", // cyan
  "#EC4899", // rose
  "#22C55E", // vert vif
  "#6366F1", // indigo
];

export const CHART_MENU_HOVER_PALETTE = [
  "#2563EB",
  "#D97706",
  "#DC2626",
  "#7C3AED",
  "#0891B2",
  "#DB2777",
  "#16A34A",
  "#4F46E5",
];

export const CHART_MENU_BORDER_PALETTE = [
  "#1D4ED8",
  "#B45309",
  "#B91C1C",
  "#6D28D9",
  "#0E7490",
  "#BE185D",
  "#15803D",
  "#4338CA",
];

/** Conservés pour compatibilité éventuelle ; dérivés de la 1re couleur data */
export const CHART_PRIMARY = CHART_MENU_PALETTE[0];
export const CHART_PRIMARY_HOVER = CHART_MENU_HOVER_PALETTE[0];
export const CHART_BORDER = CHART_MENU_BORDER_PALETTE[0];

export function colorsForCount(count) {
  return Array.from(
    { length: count },
    (_, index) => CHART_MENU_PALETTE[index % CHART_MENU_PALETTE.length],
  );
}

export function hoverColorsForCount(count) {
  return Array.from(
    { length: count },
    (_, index) => CHART_MENU_HOVER_PALETTE[index % CHART_MENU_HOVER_PALETTE.length],
  );
}

export function borderColorsForCount(count) {
  return Array.from(
    { length: count },
    (_, index) =>
      CHART_MENU_BORDER_PALETTE[index % CHART_MENU_BORDER_PALETTE.length],
  );
}
