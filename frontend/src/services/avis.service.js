import API_URL from "../api/api.js";

async function getAvis() {
  const token = localStorage.getItem("token");
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/avis`, { headers });

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

async function updateAvis(id, avis) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/avis/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(avis),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la modification de l'avis.",
    );
  }

  return data;
}

async function deleteAvis(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/avis/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de la suppression de l'avis.");
  }

  return data;
}

const avisService = {
  getAvis,
  createAvis,
  updateAvis,
  deleteAvis,
};

export default avisService;
