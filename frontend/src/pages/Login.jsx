import "../styles/pages.css";

function Login() {
  return (
    <div className="login-container">
      <h1>Connexion</h1>

      <form className="login-form">
        <label htmlFor="email">Email</label>

        <input id="email" type="email" name="email" />

        <label htmlFor="password">Mot de passe</label>

        <input id="password" type="password" name="password" />

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;
