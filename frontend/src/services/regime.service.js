import API_URL from "../api/api";

function getToken() {
  return localStorage.getItem("token");
}

const regimeService = {
  async getRegimes() {
    const response = await fetch(`${API_URL}/regimes`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des régimes.");
    }

    return await response.json();
  },

  async getRegimeById(id) {
    const response = await fetch(`${API_URL}/regimes/${id}`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du régime.");
    }

    return await response.json();
  },

  async createRegime(regime) {
    const response = await fetch(`${API_URL}/regimes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(regime),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la création du régime.");
    }

    return data;
  },

  async updateRegime(id, regime) {
    const response = await fetch(`${API_URL}/regimes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(regime),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la modification du régime.",
      );
    }

    return data;
  },

  async deleteRegime(id) {
    const response = await fetch(`${API_URL}/regimes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la suppression du régime.",
      );
    }

    return data;
  },
};

export default regimeService;
