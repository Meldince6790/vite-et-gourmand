import API_URL from "../api/api.js";

async function getUtilisateurs() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/utilisateurs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la récupération des utilisateurs.",
    );
  }

  return data;
}

async function createEmploye(utilisateur) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/utilisateurs/employe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(utilisateur),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la création du compte employé.",
    );
  }

  return data;
}

async function updateActif(id, actif) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/utilisateurs/${id}/actif`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      actif,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la modification du statut.",
    );
  }

  return data;
}

const utilisateurAdminService = {
  getUtilisateurs,
  createEmploye,
  updateActif,
};

export default utilisateurAdminService;
