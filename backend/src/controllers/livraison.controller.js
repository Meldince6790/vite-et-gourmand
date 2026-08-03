const commandeService = require("../services/commande.service");
const routingService = require("../services/routing.service");
const { toClientErrorMessage } = require("../utils/safeErrorMessage");

const estimationHits = new Map();
const ESTIMATION_WINDOW_MS = 60_000;
const ESTIMATION_MAX_PER_WINDOW = 10;

function handleLivraisonError(res, error, defaultMessage) {
  console.error(error);

  const clientMessage = toClientErrorMessage(error, defaultMessage);

  if (error.statusCode === 503) {
    return res.status(503).json({
      message:
        clientMessage !== defaultMessage
          ? clientMessage
          : "Calcul des frais de livraison temporairement indisponible. Réessayez plus tard.",
    });
  }

  return res.status(error.statusCode || 400).json({
    message: clientMessage,
  });
}

function assertEstimationRateLimit(utilisateurId) {
  const now = Date.now();
  const key = String(utilisateurId);
  const recent = (estimationHits.get(key) || []).filter(
    (timestamp) => now - timestamp < ESTIMATION_WINDOW_MS,
  );

  if (recent.length >= ESTIMATION_MAX_PER_WINDOW) {
    const error = new Error(
      "Trop de demandes d'estimation. Réessayez dans une minute.",
    );
    error.statusCode = 429;
    throw error;
  }

  recent.push(now);
  estimationHits.set(key, recent);
}

const livraisonController = {
  async estimerLivraison(req, res) {
    try {
      assertEstimationRateLimit(req.user.utilisateur_id);

      const adresseLivraison = commandeService.normaliserAdresseLivraison(
        req.body?.adresse_livraison,
      );

      const quote = await routingService.quoteDelivery(adresseLivraison);

      return res.status(200).json({
        distance_km: quote.distance_km,
        prix_livraison: quote.prix_livraison,
        livraison_gratuite: quote.livraison_gratuite,
      });
    } catch (error) {
      return handleLivraisonError(
        res,
        error,
        "Erreur lors de l'estimation des frais de livraison.",
      );
    }
  },
};

module.exports = livraisonController;
