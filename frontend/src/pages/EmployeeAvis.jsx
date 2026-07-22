import { useEffect, useState } from "react";

import avisService from "../services/avis.service.js";

import "../styles/pages.css";

function EmployeeAvis() {
  const [avis, setAvis] = useState([]);
  const [statuts, setStatuts] = useState({});

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let actif = true;

    async function fetchAvis() {
      try {
        const avisData = await avisService.getAvis();

        if (!actif) {
          return;
        }

        setAvis(avisData);

        const initialStatuts = {};

        avisData.forEach((item) => {
          initialStatuts[item.avis_id] = item.statut;
        });

        setStatuts(initialStatuts);
      } catch (error) {
        if (actif) {
          setError(error.message);
        }
      }
    }

    fetchAvis();

    return () => {
      actif = false;
    };
  }, []);

  function handleStatutChange(id, statut) {
    setStatuts((ancien) => ({
      ...ancien,
      [id]: statut,
    }));
  }

  async function handleUpdateAvis(id) {
    try {
      await avisService.updateAvis(id, {
        statut: statuts[id],
      });

      setMessage("Avis modifié avec succès.");

      const avisData = await avisService.getAvis();

      setAvis(avisData);

      const nouveauxStatuts = {};

      avisData.forEach((item) => {
        nouveauxStatuts[item.avis_id] = item.statut;
      });

      setStatuts(nouveauxStatuts);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="section">
      <h1>Gestion des avis</h1>

      {error && <p>{error}</p>}

      {message && <p>{message}</p>}

      {avis.length === 0 ? (
        <p>Aucun avis disponible.</p>
      ) : (
        <div className="cards">
          {avis.map((item) => (
            <div className="card" key={item.avis_id}>
              <h3>
                {item.prenom} {item.nom}
              </h3>

              <p>Note : {item.note}/5</p>

              <p>{item.description}</p>

              <p>
                Statut actuel : <strong>{item.statut}</strong>
              </p>

              <select
                value={statuts[item.avis_id] || ""}
                onChange={(event) =>
                  handleStatutChange(item.avis_id, event.target.value)
                }
              >
                <option value="En attente">En attente</option>
                <option value="Validé">Validé</option>
                <option value="Refusé">Refusé</option>
              </select>

              <button
                className="button"
                type="button"
                onClick={() => handleUpdateAvis(item.avis_id)}
              >
                Modifier le statut
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default EmployeeAvis;
