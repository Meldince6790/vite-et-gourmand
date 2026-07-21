import API_URL from "../api/api.js";

async function getAvis() {
  const response = await fetch(`${API_URL}/avis`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de la récupération des avis.");
  }

  return data;
}

async function createAvis(avis) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/avis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(avis),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de la création de l'avis.");
  }

  return data;
}

const avisService = {
  getAvis,
  createAvis,
};

export default avisService;
