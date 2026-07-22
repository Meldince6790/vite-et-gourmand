import API_URL from "../api/api";

function getToken() {
  return localStorage.getItem("token");
}

const allergeneService = {
  async getAllergenes() {
    const response = await fetch(`${API_URL}/allergenes`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des allergènes.");
    }

    return await response.json();
  },

  async getAllergeneById(id) {
    const response = await fetch(`${API_URL}/allergenes/${id}`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération de l'allergène.");
    }

    return await response.json();
  },

  async createAllergene(allergene) {
    const response = await fetch(`${API_URL}/allergenes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(allergene),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la création de l'allergène.",
      );
    }

    return data;
  },

  async updateAllergene(id, allergene) {
    const response = await fetch(`${API_URL}/allergenes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(allergene),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la modification de l'allergène.",
      );
    }

    return data;
  },

  async deleteAllergene(id) {
    const response = await fetch(`${API_URL}/allergenes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la suppression de l'allergène.",
      );
    }

    return data;
  },
};

export default allergeneService;
