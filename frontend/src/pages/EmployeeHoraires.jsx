import { useEffect, useState } from "react";

import horaireService from "../services/horaire.service.js";

import "../styles/pages.css";

function EmployeeHoraires() {
  const [horaires, setHoraires] = useState([]);

  const [horaireEdition, setHoraireEdition] = useState(null);

  const [nouvelHoraire, setNouvelHoraire] = useState({
    jour: "",
    heure_ouverture: "",
    heure_fermeture: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadHoraires() {
    try {
      const data = await horaireService.getHoraires();

      setHoraires(data);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    async function init() {
      await loadHoraires();
    }

    init();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setNouvelHoraire((ancien) => ({
      ...ancien,
      [name]: value,
    }));
  }

  function handleEditionChange(event) {
    const { name, value } = event.target;

    setHoraireEdition((ancien) => ({
      ...ancien,
      [name]: value,
    }));
  }

  async function handleCreate() {
    try {
      await horaireService.createHoraire(nouvelHoraire);

      setMessage("Horaire créé avec succès.");

      setNouvelHoraire({
        jour: "",
        heure_ouverture: "",
        heure_fermeture: "",
      });

      await loadHoraires();
    } catch (error) {
      setError(error.message);
    }
  }

  function handleModifier(horaire) {
    setHoraireEdition({
      ...horaire,
    });
  }

  async function handleUpdate() {
    try {
      await horaireService.updateHoraire(
        horaireEdition.horaire_id,
        horaireEdition,
      );

      setMessage("Horaire modifié avec succès.");

      setHoraireEdition(null);

      await loadHoraires();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDelete(id) {
    try {
      await horaireService.deleteHoraire(id);

      setMessage("Horaire supprimé avec succès.");

      await loadHoraires();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="section">
      <h1>Gestion des horaires</h1>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <div className="card">
        <h2>Ajouter un horaire</h2>

        <label>
          <span>Jour :</span>

          <input
            type="text"
            name="jour"
            value={nouvelHoraire.jour}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Heure d'ouverture :</span>

          <input
            type="time"
            name="heure_ouverture"
            value={nouvelHoraire.heure_ouverture}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Heure de fermeture :</span>

          <input
            type="time"
            name="heure_fermeture"
            value={nouvelHoraire.heure_fermeture}
            onChange={handleChange}
          />
        </label>

        <div className="card-actions">
          <button
            className="button button-compact"
            type="button"
            onClick={handleCreate}
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="cards">
        {horaires.map((horaire) => (
          <div className="card" key={horaire.horaire_id}>
            {horaireEdition?.horaire_id === horaire.horaire_id ? (
              <>
                <h3>Modifier l'horaire</h3>

                <label>
                  <span>Jour :</span>

                  <input
                    type="text"
                    name="jour"
                    value={horaireEdition.jour}
                    onChange={handleEditionChange}
                  />
                </label>

                <label>
                  <span>Ouverture :</span>

                  <input
                    type="time"
                    name="heure_ouverture"
                    value={horaireEdition.heure_ouverture}
                    onChange={handleEditionChange}
                  />
                </label>

                <label>
                  <span>Fermeture :</span>

                  <input
                    type="time"
                    name="heure_fermeture"
                    value={horaireEdition.heure_fermeture}
                    onChange={handleEditionChange}
                  />
                </label>

                <div className="card-actions">
                  <button className="button button-compact" onClick={handleUpdate}>
                    Enregistrer
                  </button>

                  <button
                    className="button button-compact"
                    onClick={() => setHoraireEdition(null)}
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>{horaire.jour}</h3>

                <p>Ouverture : {horaire.heure_ouverture}</p>

                <p>Fermeture : {horaire.heure_fermeture}</p>

                <div className="card-actions">
                  <button
                    className="button button-compact"
                    onClick={() => handleModifier(horaire)}
                  >
                    Modifier
                  </button>

                  <button
                    className="button button-compact"
                    onClick={() => handleDelete(horaire.horaire_id)}
                  >
                    Supprimer
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default EmployeeHoraires;
