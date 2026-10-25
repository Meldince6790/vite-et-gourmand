const { describe, it, afterEach } = require("node:test");
const assert = require("node:assert/strict");

const { RoutingService } = require("./routing.service");

function createService(fetchImpl, env = {}) {
  return new RoutingService({
    apiKey: env.apiKey ?? "test-key",
    baseUrl: env.baseUrl ?? "https://api.openrouteservice.org",
    catererLatitude: env.catererLatitude ?? 44.8378,
    catererLongitude: env.catererLongitude ?? -0.5792,
    timeoutMs: env.timeoutMs ?? 50,
    fetchImpl,
  });
}

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe("RoutingService", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("rejette si la clé API est absente", async () => {
    const service = createService(async () => jsonResponse(200, {}), {
      apiKey: "",
    });

    await assert.rejects(
      () => service.quoteDelivery("12 rue X, 33000 Bordeaux"),
      (error) => {
        assert.equal(error.statusCode, 503);
        assert.match(error.message, /temporairement indisponible/i);
        return true;
      },
    );
  });

  it("détecte Bordeaux et renvoie une livraison gratuite", async () => {
    const service = createService(async () =>
      jsonResponse(200, {
        features: [
          {
            geometry: { coordinates: [-0.573, 44.843] },
            properties: {
              layer: "address",
              locality: "Bordeaux",
              country_a: "FR",
              label: "12 rue Sainte-Catherine, 33000 Bordeaux",
            },
          },
        ],
      }),
    );

    const quote = await service.quoteDelivery(
      "12 rue Sainte-Catherine, 33000 Bordeaux",
    );

    assert.deepEqual(quote, {
      distance_km: 0,
      prix_livraison: 0,
      livraison_gratuite: true,
    });
  });

  it("calcule le tarif hors Bordeaux avec arrondis", async () => {
    let call = 0;
    const service = createService(async (url, options) => {
      call += 1;

      if (call === 1) {
        assert.match(String(url), /geocode\/search/);
        assert.match(String(url), /text=/);
        return jsonResponse(200, {
          features: [
            {
              geometry: { coordinates: [-0.68, 44.84] },
              properties: {
                layer: "address",
                locality: "Mérignac",
                country_a: "FR",
              },
            },
          ],
        });
      }

      assert.match(String(url), /directions\/driving-car/);
      assert.equal(options.method, "POST");
      const body = JSON.parse(options.body);
      assert.equal(body.units, "m");

      // 12345.6 m → 12.35 km ; 5 + 0.59*12.35 = 12.2865 → 12.29
      return jsonResponse(200, {
        routes: [{ summary: { distance: 12345.6 } }],
      });
    });

    const quote = await service.quoteDelivery(
      "45 avenue de la Libération, 33700 Mérignac",
    );

    assert.equal(quote.distance_km, 12.35);
    assert.equal(quote.prix_livraison, 12.29);
    assert.equal(quote.livraison_gratuite, false);
  });

  it("rejette un résultat de géocodage vide", async () => {
    const service = createService(async () =>
      jsonResponse(200, { features: [] }),
    );

    await assert.rejects(
      () => service.geocodeAddress("Adresse inexistante xyz"),
      (error) => {
        assert.equal(error.statusCode, 400);
        assert.match(error.message, /introuvable/i);
        return true;
      },
    );
  });

  it("rejette une adresse trop imprécise (ville seule)", async () => {
    const service = createService(async () =>
      jsonResponse(200, {
        features: [
          {
            geometry: { coordinates: [-0.58, 44.84] },
            properties: {
              layer: "locality",
              locality: "Bordeaux",
              country_a: "FR",
            },
          },
        ],
      }),
    );

    await assert.rejects(
      () => service.geocodeAddress("Bordeaux"),
      (error) => {
        assert.equal(error.statusCode, 400);
        assert.match(error.message, /imprécise/i);
        return true;
      },
    );
  });

  it("mappe un timeout sur une erreur 503", async () => {
    const service = createService(
      async () => {
        const error = new Error("aborted");
        error.name = "AbortError";
        throw error;
      },
      { timeoutMs: 1 },
    );

    await assert.rejects(
      () => service.geocodeAddress("12 rue Test, 33000 Bordeaux"),
      (error) => error.statusCode === 503,
    );
  });

  it("mappe un 401 ORS sur une erreur 503", async () => {
    const service = createService(async () => jsonResponse(401, { error: "x" }));

    await assert.rejects(
      () => service.geocodeAddress("12 rue Test, 33000 Bordeaux"),
      (error) => error.statusCode === 503,
    );
  });

  it("mappe un 500 ORS sur une erreur 503", async () => {
    const service = createService(async () => jsonResponse(500, { error: "x" }));

    await assert.rejects(
      () => service.geocodeAddress("12 rue Test, 33000 Bordeaux"),
      (error) => error.statusCode === 503,
    );
  });

  it("mappe une réponse directions invalide sur une erreur 503", async () => {
    let call = 0;
    const service = createService(async () => {
      call += 1;
      if (call === 1) {
        return jsonResponse(200, {
          features: [
            {
              geometry: { coordinates: [-0.68, 44.84] },
              properties: {
                layer: "address",
                locality: "Mérignac",
                country_a: "FR",
              },
            },
          ],
        });
      }

      return jsonResponse(200, { routes: [] });
    });

    await assert.rejects(
      () => service.quoteDelivery("1 rue Test, 33700 Mérignac"),
      (error) => error.statusCode === 503,
    );
  });

  it("isInBordeaux reconnaît la commune malgré les accents", () => {
    const service = createService(async () => jsonResponse(200, {}));

    assert.equal(
      service.isInBordeaux({
        locality: "Bordeaux",
        countryCode: "FR",
      }),
      true,
    );
    assert.equal(
      service.isInBordeaux({
        municipality: "Mérignac",
        countryCode: "FR",
      }),
      false,
    );
  });
});
