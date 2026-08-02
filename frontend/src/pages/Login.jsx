import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import authService from "../services/auth.service";
import "../styles/pages.css";

const FORM_INSCRIPTION_INITIAL = {
  nom: "",
  prenom: "",
  telephone: "",
  adresse: "",
  email: "",
  password: "",
  confirmation: "",
};

function estTexteRenseigne(value) {
  return typeof value === "string" && value.trim() !== "";
}

function estEmailValide(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function estMotDePasseValide(password) {
  return (
    typeof password === "string" &&
    password.length >= 10 &&
    password.length <= 255 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function validerInscription(form) {
  if (!estTexteRenseigne(form.nom)) {
    return "Le nom est obligatoire.";
  }

  if (!estTexteRenseigne(form.prenom)) {
    return "Le prénom est obligatoire.";
  }

  if (!estTexteRenseigne(form.email)) {
    return "L'adresse e-mail est obligatoire.";
  }

  if (!estEmailValide(form.email)) {
    return "L'adresse e-mail n'est pas valide.";
  }

  if (!estTexteRenseigne(form.password)) {
    return "Le mot de passe est obligatoire.";
  }

  if (!estMotDePasseValide(form.password)) {
    return "Le mot de passe ne respecte pas les règles de sécurité.";
  }

  if (!estTexteRenseigne(form.confirmation)) {
    return "La confirmation du mot de passe est obligatoire.";
  }

  if (form.confirmation !== form.password) {
    return "La confirmation ne correspond pas au mot de passe.";
  }

  return null;
}

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [onglet, setOnglet] = useState("connexion");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [formInscription, setFormInscription] = useState(
    FORM_INSCRIPTION_INITIAL,
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function changerOnglet(nouvelOnglet) {
    setOnglet(nouvelOnglet);
    setError("");
    if (nouvelOnglet === "inscription") {
      setSuccess("");
    }
  }

  function handleInscriptionChange(event) {
    const { name, value } = event.target;

    setFormInscription((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const utilisateur = await authService.login(email, password);

      login(utilisateur);

      if (utilisateur.role_id === 3) {
        navigate("/espace-admin");
      } else if (utilisateur.role_id === 2) {
        navigate("/espace-employe");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  async function handleInscriptionSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const erreurLocale = validerInscription(formInscription);

    if (erreurLocale) {
      setError(erreurLocale);
      return;
    }

    try {
      const result = await authService.register({
        nom: formInscription.nom,
        prenom: formInscription.prenom,
        telephone: formInscription.telephone,
        adresse_postale: formInscription.adresse,
        email: formInscription.email,
        password: formInscription.password,
      });

      setFormInscription(FORM_INSCRIPTION_INITIAL);
      setSuccess(result.message || "Utilisateur créé avec succès.");
      setOnglet("connexion");
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  return (
    <div className="login-container">
      <h1>Mon compte</h1>

      <div className="auth-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={onglet === "connexion"}
          className={
            onglet === "connexion" ? "auth-tab auth-tab-active" : "auth-tab"
          }
          onClick={() => changerOnglet("connexion")}
        >
          Connexion
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={onglet === "inscription"}
          className={
            onglet === "inscription" ? "auth-tab auth-tab-active" : "auth-tab"
          }
          onClick={() => changerOnglet("inscription")}
        >
          Inscription
        </button>
      </div>

      {success && <p className="auth-success">{success}</p>}
      {error && <p className="auth-error">{error}</p>}

      {onglet === "connexion" && (
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <h2 className="auth-subtitle">Connexion</h2>

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />

          <button type="submit">Se connecter</button>
        </form>
      )}

      {onglet === "inscription" && (
        <form className="login-form" onSubmit={handleInscriptionSubmit}>
          <h2 className="auth-subtitle">Inscription</h2>

          <label htmlFor="nom">Nom</label>
          <input
            id="nom"
            type="text"
            name="nom"
            value={formInscription.nom}
            onChange={handleInscriptionChange}
            autoComplete="family-name"
          />

          <label htmlFor="prenom">Prénom</label>
          <input
            id="prenom"
            type="text"
            name="prenom"
            value={formInscription.prenom}
            onChange={handleInscriptionChange}
            autoComplete="given-name"
          />

          <label htmlFor="telephone">Téléphone</label>
          <input
            id="telephone"
            type="tel"
            name="telephone"
            value={formInscription.telephone}
            onChange={handleInscriptionChange}
            autoComplete="tel"
          />

          <label htmlFor="adresse">Adresse</label>
          <input
            id="adresse"
            type="text"
            name="adresse"
            value={formInscription.adresse}
            onChange={handleInscriptionChange}
            autoComplete="street-address"
          />

          <label htmlFor="email-inscription">E-mail</label>
          <input
            id="email-inscription"
            type="email"
            name="email"
            value={formInscription.email}
            onChange={handleInscriptionChange}
            autoComplete="email"
          />

          <label htmlFor="password-inscription">Mot de passe</label>
          <input
            id="password-inscription"
            type="password"
            name="password"
            value={formInscription.password}
            onChange={handleInscriptionChange}
            autoComplete="new-password"
          />

          <label htmlFor="confirmation">Confirmation</label>
          <input
            id="confirmation"
            type="password"
            name="confirmation"
            value={formInscription.confirmation}
            onChange={handleInscriptionChange}
            autoComplete="new-password"
          />

          <div className="auth-password-rules">
            <p>Règles mot de passe :</p>
            <ul>
              <li>minimum 10 caractères</li>
              <li>une majuscule</li>
              <li>une minuscule</li>
              <li>un chiffre</li>
              <li>un caractère spécial</li>
            </ul>
          </div>

          <button type="submit">Créer mon compte</button>
        </form>
      )}
    </div>
  );
}

export default Login;
