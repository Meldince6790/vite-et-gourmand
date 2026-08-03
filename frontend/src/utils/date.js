/**
 * Extrait la partie calendaire YYYY-MM-DD sans conversion de fuseau.
 * Compatible avec "2026-11-01", "2026-11-01T00:00:00.000Z", etc.
 */
export function extractDatePart(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) {
    return null;
  }

  return {
    year: match[1],
    month: match[2],
    day: match[3],
  };
}

/** Valeur pour input[type="date"] (YYYY-MM-DD) */
export function toDateInputValue(value) {
  const parts = extractDatePart(value);

  if (!parts) {
    return "";
  }

  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Affichage français JJ/MM/AAAA */
export function formatDateFr(value) {
  const parts = extractDatePart(value);

  if (!parts) {
    return "—";
  }

  return `${parts.day}/${parts.month}/${parts.year}`;
}
