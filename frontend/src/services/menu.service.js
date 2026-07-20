import API_URL from "../api/api";

const menuService = {
  async getMenus() {
    const response = await fetch(`${API_URL}/menus`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des menus.");
    }

    return await response.json();
  },

  async getMenuById(id) {
    const response = await fetch(`${API_URL}/menus/${id}`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du menu.");
    }

    return await response.json();
  },
};

export default menuService;
