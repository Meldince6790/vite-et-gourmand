import API_URL from "../api/api.js";

async function updateProfil(utilisateur) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/utilisateurs/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(utilisateur),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la modification du profil.",
    );
  }

  return data.utilisateur;
}

const utilisateurService = {
  updateProfil,
};

export default utilisateurService;
