import { useState } from "react";

import contactService from "../services/contact.service";
import "../styles/pages.css";

const FORM_INITIAL = {
  nom: "",
  email: "",
  message: "",
};

function Contact() {
  const [form, setForm] = useState(FORM_INITIAL);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((ancien) => ({
      ...ancien,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const result = await contactService.sendContact({
        nom: form.nom,
        email: form.email,
        message: form.message,
      });

      setSuccess(result.message || "Message envoyé avec succès.");
      setForm(FORM_INITIAL);
    } catch (err) {
      setError(
        err.message || "Impossible d’envoyer le message pour le moment.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <section className="section">
        <h1>Contact</h1>

        <p>Une question ou un projet ? Contactez notre équipe.</p>

        {success && <p className="auth-success">{success}</p>}

        {error && <p className="auth-error">{error}</p>}

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="nom">Nom</label>

          <input
            id="nom"
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <label htmlFor="message">Message</label>

          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Contact;
