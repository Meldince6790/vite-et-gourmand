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
  const statistiques = await getStatistiques();

  return statistiques;
}

async function getChiffreAffaires(filters = {}) {
  const token = localStorage.getItem("token");

  const params = new URLSearchParams();

  if (filters.menu_id) {
    params.append("menu_id", filters.menu_id);
  }

  if (filters.periode) {
    params.append("periode", filters.periode);
  }

  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(`${API_URL}/statistiques${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la récupération du chiffre d'affaires.",
    );
  }

  return data;
}

const statistiqueService = {
  getStatistiques,
  getCommandesParMenu,
  getChiffreAffaires,
};

export default statistiqueService;
