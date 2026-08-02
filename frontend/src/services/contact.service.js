import API_URL from "../api/api.js";

async function sendContact({ nom, email, message }) {
  const response = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nom, email, message }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible d’envoyer le message pour le moment.",
    );
  }

  return data;
}

const contactService = {
  sendContact,
};

export default contactService;
