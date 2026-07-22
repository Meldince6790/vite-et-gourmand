import API_URL from "../api/api.js";

async function getStatistiques() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/statistiques`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la récupération des statistiques.",
    );
  }

  return data;
}

async function getCommandesParMenu() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/statistiques/commandes-par-menu`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la récupération des commandes par menu.",
    );
  }

  return data;
}

async function getChiffreAffairesAnnuel() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/statistiques/chiffre-affaires/annuel`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération du chiffre d'affaires annuel.",
    );
  }

  return data;
}

async function getChiffreAffairesParPeriode() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/statistiques/chiffre-affaires/periode`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération du chiffre d'affaires par période.",
    );
  }

  return data;
}

async function getChiffreAffairesParMenu() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/statistiques/chiffre-affaires/menu`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération du chiffre d'affaires par menu.",
    );
  }

  return data;
}

async function getChiffreAffairesFiltre(filters = {}) {
  const token = localStorage.getItem("token");

  const params = new URLSearchParams();

  if (filters.menu_id) {
    params.append("menu_id", filters.menu_id);
  }

  if (filters.periode_debut) {
    params.append("periode_debut", filters.periode_debut);
  }

  if (filters.periode_fin) {
    params.append("periode_fin", filters.periode_fin);
  }

  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(
    `${API_URL}/statistiques/chiffre-affaires/filtre${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération du chiffre d'affaires filtré.",
    );
  }

  return data;
}

const statistiqueService = {
  getStatistiques,
  getCommandesParMenu,
  getChiffreAffairesAnnuel,
  getChiffreAffairesParPeriode,
  getChiffreAffairesParMenu,
  getChiffreAffairesFiltre,
};

export default statistiqueService;
