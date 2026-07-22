import API_URL from "../api/api";

function getToken() {
  return localStorage.getItem("token");
}

const themeService = {
  async getThemes() {
    const response = await fetch(`${API_URL}/themes`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des thèmes.");
    }

    return await response.json();
  },

  async getThemeById(id) {
    const response = await fetch(`${API_URL}/themes/${id}`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du thème.");
    }

    return await response.json();
  },

  async createTheme(theme) {
    const response = await fetch(`${API_URL}/themes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(theme),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la création du thème.");
    }

    return data;
  },

  async updateTheme(id, theme) {
    const response = await fetch(`${API_URL}/themes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(theme),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la modification du thème.",
      );
    }

    return data;
  },

  async deleteTheme(id) {
    const response = await fetch(`${API_URL}/themes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la suppression du thème.",
      );
    }

    return data;
  },
};

export default themeService;
