import API_URL from "../api/api";

function getToken() {
  return localStorage.getItem("token");
}

const menuService = {
  async getMenus() {
    const response = await fetch(`${API_URL}/menus`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des menus.");
    }

    return await response.json();
  },

  async getAllMenus() {
    return await this.getMenus();
  },

  async findAll() {
    return await this.getMenus();
  },

  async getMenuById(id) {
    const response = await fetch(`${API_URL}/menus/${id}`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du menu.");
    }

    return await response.json();
  },

  async createMenu(menu) {
    const response = await fetch(`${API_URL}/menus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(menu),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la création du menu.");
    }

    return data;
  },

  async updateMenu(id, menu) {
    const response = await fetch(`${API_URL}/menus/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(menu),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la modification du menu.",
      );
    }

    return data;
  },

  async deleteMenu(id) {
    const response = await fetch(`${API_URL}/menus/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la suppression du menu.");
    }

    return data;
  },

  async getPlatsByMenu(id) {
    const response = await fetch(`${API_URL}/menus/${id}/plats`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des plats du menu.");
    }

    return await response.json();
  },

  async getPlatsByMenuId(id) {
    return await this.getPlatsByMenu(id);
  },

  async addPlatToMenu(menuId, platId) {
    const response = await fetch(`${API_URL}/menus/${menuId}/plats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        plat_id: platId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de l'ajout du plat au menu.",
      );
    }

    return data;
  },

  async removePlatFromMenu(menuId, platId) {
    const response = await fetch(`${API_URL}/menus/${menuId}/plats/${platId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors du retrait du plat du menu.",
      );
    }

    return data;
  },
};

export default menuService;
