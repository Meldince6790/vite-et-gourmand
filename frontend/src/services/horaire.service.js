import API_URL from "../api/api";

function getToken() {
  return localStorage.getItem("token");
}

const horaireService = {
  async getHoraires() {
    const response = await fetch(`${API_URL}/horaires`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des horaires.");
    }

    return await response.json();
  },

  async getHoraireById(id) {
    const response = await fetch(`${API_URL}/horaires/${id}`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération de l'horaire.");
    }

    return await response.json();
  },

  async createHoraire(horaire) {
    const response = await fetch(`${API_URL}/horaires`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(horaire),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la création de l'horaire.",
      );
    }

    return data;
  },

  async updateHoraire(id, horaire) {
    const response = await fetch(`${API_URL}/horaires/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(horaire),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la modification de l'horaire.",
      );
    }

    return data;
  },

  async deleteHoraire(id) {
    const response = await fetch(`${API_URL}/horaires/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la suppression de l'horaire.",
      );
    }

    return data;
  },
};

export default horaireService;
