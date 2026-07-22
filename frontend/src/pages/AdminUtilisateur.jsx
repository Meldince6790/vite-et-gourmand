import { useEffect, useState } from "react";

import utilisateurAdminService from "../services/utilisateur.admin.service.js";

import "../styles/pages.css";

const employeInitial = {
  email: "",
  password: "",
  nom: "",
  prenom: "",
};

function AdminUtilisateur() {
  const [utilisateurs, setUtilisateurs] = useState([]);

  const [formulaire, setFormulaire] = useState({
    ...employeInitial,
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function chargerUtilisateurs() {
    try {
      const data = await utilisateurAdminService.getUtilisateurs();

      const employes = data.filter((utilisateur) => utilisateur.role_id === 2);

      setUtilisateurs(employes);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormulaire((ancien) => ({
      ...ancien,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await utilisateurAdminService.createEmploye(formulaire);

      setMessage("Compte employé créé avec succès.");

      setFormulaire({
        ...employeInitial,
      });

      await chargerUtilisateurs();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleToggleActif(utilisateur) {
    try {
      await utilisateurAdminService.updateActif(
        utilisateur.utilisateur_id,
        !utilisateur.actif,
      );

      setMessage("Statut du compte modifié avec succès.");

      await chargerUtilisateurs();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="section">
      <h1>Gestion des employés</h1>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <h2>Créer un compte employé</h2>

        <label>
          <span>Email :</span>

          <input
            type="email"
            name="email"
            value={formulaire.email}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Mot de passe :</span>

          <input
            type="password"
            name="password"
            value={formulaire.password}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Nom :</span>

          <input
            type="text"
            name="nom"
            value={formulaire.nom}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Prénom :</span>

          <input
            type="text"
            name="prenom"
            value={formulaire.prenom}
            onChange={handleChange}
          />
        </label>

        <button className="button" type="submit">
          Créer l'employé
        </button>
      </form>

      <h2>Employés existants</h2>

      <div className="cards">
        {utilisateurs.map((utilisateur) => (
          <div className="card" key={utilisateur.utilisateur_id}>
            <h3>{utilisateur.email}</h3>

            <p>
              {utilisateur.prenom || ""} {utilisateur.nom || ""}
            </p>

            <p>
              Statut :{" "}
              <strong>{utilisateur.actif ? "Actif" : "Désactivé"}</strong>
            </p>

            <button
              className="button"
              type="button"
              onClick={() => handleToggleActif(utilisateur)}
            >
              {utilisateur.actif ? "Désactiver" : "Réactiver"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminUtilisateur;
