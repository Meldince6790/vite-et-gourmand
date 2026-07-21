import API_URL from "../api/api.js";

async function createCommande(commande) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/commandes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(commande),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la création de la commande.",
    );
  }

  return data;
}

async function getMesCommandes() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/commandes/mes-commandes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la récupération des commandes.",
    );
  }

  return data;
}

async function getCommandes() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/commandes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la récupération des commandes.",
    );
  }

  return data;
}

async function updateStatut(id, statut) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/commandes/${id}/statut`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ statut }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la modification du statut.",
    );
  }

  return data;
}

// Modification d'une commande par un client
async function updateCommande(id, commande) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/commandes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(commande),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la modification de la commande.",
    );
  }

  return data;
}

// Annulation simple d'une commande par un client
async function annulerCommandeClient(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/commandes/${id}/annulation-client`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de l'annulation de la commande.",
    );
  }

  return data;
}

// Annulation par employé/admin
async function annulerCommande(id, annulation) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/commandes/${id}/annulation`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(annulation),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de l'annulation de la commande.",
    );
  }

  return data;
}

const commandeService = {
  createCommande,
  getMesCommandes,
  getCommandes,
  updateStatut,
  updateCommande,
  annulerCommande,
  annulerCommandeClient,
};

export default commandeService;
