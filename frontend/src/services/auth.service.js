import API_URL from "../api/api";

const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la connexion.");
    }

    return data;
  },

  async register(data) {
    const toOptional = (value) => {
      if (typeof value !== "string") {
        return value ?? null;
      }

      const trimmed = value.trim();
      return trimmed === "" ? null : trimmed;
    };

    const response = await fetch(`${API_URL}/utilisateurs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom: data.nom,
        prenom: data.prenom,
        telephone: toOptional(data.telephone),
        adresse_postale: toOptional(data.adresse_postale),
        email: data.email,
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erreur lors de l'inscription.");
    }

    return result;
  },
};

export default authService;
