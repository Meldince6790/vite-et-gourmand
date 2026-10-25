const Commande = require("../domain/Commande");

const PRECISE_LAYERS = new Set([
  "address",
  "street",
  "venue",
  "housenumber",
]);

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeLabel(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

class RoutingService {
  constructor({
    apiKey = process.env.ORS_API_KEY,
    baseUrl = process.env.ORS_BASE_URL || "https://api.openrouteservice.org",
    catererLatitude = process.env.CATERER_LATITUDE,
    catererLongitude = process.env.CATERER_LONGITUDE,
    catererAddress = process.env.CATERER_ADDRESS,
    timeoutMs = process.env.ORS_TIMEOUT_MS || 8000,
    fetchImpl = globalThis.fetch,
    CommandeDomain = Commande,
  } = {}) {
    this.apiKey = apiKey;
    this.baseUrl = String(baseUrl || "").replace(/\/$/, "");
    this.catererLatitude = Number(catererLatitude);
    this.catererLongitude = Number(catererLongitude);
    this.catererAddress = catererAddress || null;
    this.timeoutMs = Number(timeoutMs) || 8000;
    this.fetchImpl = fetchImpl;
    this.Commande = CommandeDomain;
  }

  ensureConfigured() {
    if (!this.apiKey || String(this.apiKey).trim() === "") {
      throw createHttpError(
        "Calcul des frais de livraison temporairement indisponible. Réessayez plus tard.",
        503,
      );
    }

    if (
      !Number.isFinite(this.catererLatitude) ||
      !Number.isFinite(this.catererLongitude)
    ) {
      throw createHttpError(
        "Calcul des frais de livraison temporairement indisponible. Réessayez plus tard.",
        503,
      );
    }
  }

  getCatererOrigin() {
    return {
      latitude: this.catererLatitude,
      longitude: this.catererLongitude,
      label: this.catererAddress,
    };
  }

  async requestJson(url, options = {}) {
    this.ensureConfigured();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImpl(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          Authorization: this.apiKey,
          ...(options.headers || {}),
        },
      });

      if (response.status === 401 || response.status === 403) {
        throw createHttpError(
          "Calcul des frais de livraison temporairement indisponible. Réessayez plus tard.",
          503,
        );
      }

      if (response.status >= 500) {
        throw createHttpError(
          "Calcul des frais de livraison temporairement indisponible. Réessayez plus tard.",
          503,
        );
      }

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        throw createHttpError(
          "Calcul des frais de livraison temporairement indisponible. Réessayez plus tard.",
          503,
        );
      }

      if (!response.ok) {
        throw createHttpError(
          "Calcul des frais de livraison temporairement indisponible. Réessayez plus tard.",
          503,
        );
      }

      return payload;
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }

      if (error.name === "AbortError") {
        throw createHttpError(
          "Calcul des frais de livraison temporairement indisponible. Réessayez plus tard.",
          503,
        );
      }

      throw createHttpError(
        "Calcul des frais de livraison temporairement indisponible. Réessayez plus tard.",
        503,
      );
    } finally {
      clearTimeout(timer);
    }
  }

  async geocodeAddress(address) {
    const trimmed = String(address || "").trim();

    if (!trimmed) {
      throw createHttpError("L'adresse de livraison est obligatoire.", 400);
    }

    const url = new URL(`${this.baseUrl}/geocode/search`);
    url.searchParams.set("text", trimmed);
    url.searchParams.set("boundary.country", "FR");
    url.searchParams.set("size", "1");
    url.searchParams.set("lang", "fr");

    const payload = await this.requestJson(url.toString(), { method: "GET" });
    const feature = payload?.features?.[0];

    if (!feature?.geometry?.coordinates) {
      throw createHttpError(
        "Adresse de livraison introuvable. Vérifiez la saisie.",
        400,
      );
    }

    const [longitude, latitude] = feature.geometry.coordinates;
    const properties = feature.properties || {};
    const layer = normalizeLabel(properties.layer);

    if (!PRECISE_LAYERS.has(layer)) {
      throw createHttpError(
        "Adresse trop imprécise. Indiquez le numéro, la rue, le code postal et la ville.",
        400,
      );
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw createHttpError(
        "Adresse de livraison introuvable. Vérifiez la saisie.",
        400,
      );
    }

    return {
      latitude,
      longitude,
      layer,
      locality: properties.locality || properties.localadmin || null,
      municipality: properties.municipality || properties.localadmin || null,
      county: properties.county || null,
      country: properties.country || null,
      countryCode: properties.country_a || properties.country_code || null,
      label: properties.label || trimmed,
      postalCode: properties.postalcode || null,
    };
  }

  isInBordeaux(result) {
    if (!result) {
      return false;
    }

    const countryCode = normalizeLabel(result.countryCode);
    const country = normalizeLabel(result.country);
    const inFrance =
      countryCode === "fr" || country === "france" || countryCode === "";

    if (!inFrance && country) {
      return false;
    }

    const candidates = [
      result.locality,
      result.municipality,
      result.county,
    ].map(normalizeLabel);

    return candidates.some((value) => value === "bordeaux");
  }

  async calculateRoadDistanceKm(origin, destination) {
    if (
      !origin ||
      !destination ||
      !Number.isFinite(origin.longitude) ||
      !Number.isFinite(origin.latitude) ||
      !Number.isFinite(destination.longitude) ||
      !Number.isFinite(destination.latitude)
    ) {
      throw createHttpError(
        "Calcul des frais de livraison temporairement indisponible. Réessayez plus tard.",
        503,
      );
    }

    const url = `${this.baseUrl}/v2/directions/driving-car/json`;
    const payload = await this.requestJson(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [
          [origin.longitude, origin.latitude],
          [destination.longitude, destination.latitude],
        ],
        units: "m",
        instructions: false,
        geometry: false,
      }),
    });

    const distanceMeters = payload?.routes?.[0]?.summary?.distance;

    if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
      throw createHttpError(
        "Calcul des frais de livraison temporairement indisponible. Réessayez plus tard.",
        503,
      );
    }

    return Math.round((distanceMeters / 1000) * 100) / 100;
  }

  async quoteDelivery(address) {
    const geocoded = await this.geocodeAddress(address);

    if (this.isInBordeaux(geocoded)) {
      return {
        distance_km: 0,
        prix_livraison: 0,
        livraison_gratuite: true,
      };
    }

    const distanceKm = await this.calculateRoadDistanceKm(
      this.getCatererOrigin(),
      geocoded,
    );
    const prixLivraison = this.Commande.calculerPrixLivraison(distanceKm);

    return {
      distance_km: distanceKm,
      prix_livraison: prixLivraison,
      livraison_gratuite: false,
    };
  }
}

const routingService = new RoutingService();

module.exports = routingService;
module.exports.RoutingService = RoutingService;
module.exports.createHttpError = createHttpError;
