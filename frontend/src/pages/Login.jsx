import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import authService from "../services/auth.service";
import "../styles/pages.css";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const utilisateur = await authService.login(email, password);

      login(utilisateur);

      navigate("/");
    } catch (error) {
      console.error(error);

      setError(error.message);
    }
  }

  return (
    <div className="login-container">
      <h1>Connexion</h1>

      {error && <p>{error}</p>}

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>

        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">Mot de passe</label>

        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;
