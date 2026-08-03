import API_URL from "../api/api.js";

async function estimerLivraison(adresse_livraison) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/livraison/estimation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ adresse_livraison }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de l'estimation des frais de livraison.",
    );
  }

  return data;
}

const livraisonService = {
  estimerLivraison,
};

export default livraisonService;
