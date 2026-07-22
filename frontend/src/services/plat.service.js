import API_URL from "../api/api";

function getToken() {
  return localStorage.getItem("token");
}

const platService = {
  async getAllPlats() {
    const response = await fetch(`${API_URL}/plats`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des plats.");
    }

    return await response.json();
  },

  async getPlatById(id) {
    const response = await fetch(`${API_URL}/plats/${id}`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du plat.");
    }

    return await response.json();
  },

  async createPlat(plat) {
    const response = await fetch(`${API_URL}/plats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(plat),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la création du plat.");
    }

    return data;
  },

  async updatePlat(id, plat) {
    const response = await fetch(`${API_URL}/plats/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(plat),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la modification du plat.",
      );
    }

    return data;
  },

  async deletePlat(id) {
    const response = await fetch(`${API_URL}/plats/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la suppression du plat.");
    }

    return data;
  },

  async getMenusByPlat(id) {
    const response = await fetch(`${API_URL}/plats/${id}/menus`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des menus du plat.");
    }

    return await response.json();
  },

  async getAllergenesByPlat(id) {
    const response = await fetch(`${API_URL}/plats/${id}/allergenes`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des allergènes du plat.");
    }

    return await response.json();
  },

  async addAllergeneToPlat(platId, allergeneId) {
    const response = await fetch(`${API_URL}/plats/${platId}/allergenes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        allergene_id: allergeneId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'ajout de l'allergène.");
    }

    return data;
  },

  async removeAllergeneFromPlat(platId, allergeneId) {
    const response = await fetch(
      `${API_URL}/plats/${platId}/allergenes/${allergeneId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors du retrait de l'allergène.");
    }

    return data;
  },
};

export default platService;
