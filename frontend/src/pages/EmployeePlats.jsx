import { useEffect, useState } from "react";

import platService from "../services/plat.service.js";
import allergeneService from "../services/allergene.service.js";

import "../styles/pages.css";

function EmployeePlats() {
  const [plats, setPlats] = useState([]);
  const [allergenes, setAllergenes] = useState([]);

  const [platEdition, setPlatEdition] = useState(null);

  const [nouveauPlat, setNouveauPlat] = useState({
    titre_plat: "",
    photo: "",
  });

  const [allergeneSelection, setAllergeneSelection] = useState({});

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const platsData = await platService.getAllPlats();
      const allergenesData = await allergeneService.getAllergenes();

      const platsComplets = await Promise.all(
        platsData.map(async (plat) => {
          const allergenesPlat = await platService.getAllergenesByPlat(
            plat.plat_id,
          );

          return {
            ...plat,
            allergenes: allergenesPlat,
          };
        }),
      );

      setPlats(platsComplets);
      setAllergenes(allergenesData);

      setError("");
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    async function init() {
      await loadData();
    }

    init();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setNouveauPlat((ancien) => ({
      ...ancien,
      [name]: value,
    }));
  }

  function handleEditionChange(event) {
    const { name, value } = event.target;

    setPlatEdition((ancien) => ({
      ...ancien,
      [name]: value,
    }));
  }

  async function handleCreate() {
    try {
      setError("");
      setMessage("");

      await platService.createPlat(nouveauPlat);

      setMessage("Plat créé avec succès.");

      setNouveauPlat({
        titre_plat: "",
        photo: "",
      });

      await loadData();
    } catch (error) {
      setError(error.message);
    }
  }

  function handleModifier(plat) {
    setPlatEdition({
      ...plat,
    });
  }

  async function handleUpdate() {
    try {
      setError("");
      setMessage("");

      await platService.updatePlat(platEdition.plat_id, platEdition);

      setMessage("Plat modifié avec succès.");

      setPlatEdition(null);

      await loadData();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDelete(id) {
    try {
      setError("");
      setMessage("");

      await platService.deletePlat(id);

      setMessage("Plat supprimé avec succès.");

      await loadData();
    } catch (error) {
      setError(error.message);
    }
  }

  function handleAllergeneChange(platId, allergeneId) {
    setAllergeneSelection((ancien) => ({
      ...ancien,
      [platId]: allergeneId,
    }));
  }

  async function handleAddAllergene(platId) {
    try {
      setError("");
      setMessage("");

      const allergeneId = allergeneSelection[platId];

      if (!allergeneId) {
        throw new Error("Veuillez sélectionner un allergène.");
      }

      await platService.addAllergeneToPlat(platId, allergeneId);

      setMessage("Allergène ajouté avec succès.");

      await loadData();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleRemoveAllergene(platId, allergeneId) {
    try {
      setError("");
      setMessage("");

      await platService.removeAllergeneFromPlat(platId, allergeneId);

      setMessage("Allergène retiré avec succès.");

      await loadData();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="section">
      <h1>Gestion des plats</h1>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <div className="card">
        <h2>Ajouter un plat</h2>

        <label>
          <span>Nom du plat :</span>

          <input
            type="text"
            name="titre_plat"
            value={nouveauPlat.titre_plat}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Photo :</span>

          <input
            type="text"
            name="photo"
            value={nouveauPlat.photo}
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
        {plats.map((plat) => (
          <div className="card" key={plat.plat_id}>
            {platEdition?.plat_id === plat.plat_id ? (
              <>
                <h3>Modifier le plat</h3>

                <label>
                  <span>Nom :</span>

                  <input
                    type="text"
                    name="titre_plat"
                    value={platEdition.titre_plat}
                    onChange={handleEditionChange}
                  />
                </label>

                <label>
                  <span>Photo :</span>

                  <input
                    type="text"
                    name="photo"
                    value={platEdition.photo || ""}
                    onChange={handleEditionChange}
                  />
                </label>

                <div className="card-actions">
                  <button
                    className="button button-compact"
                    type="button"
                    onClick={handleUpdate}
                  >
                    Enregistrer
                  </button>

                  <button
                    className="button button-compact"
                    type="button"
                    onClick={() => setPlatEdition(null)}
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>{plat.titre_plat}</h3>

                {plat.photo && <img src={plat.photo} alt={plat.titre_plat} />}

                <div className="card-actions">
                  <button
                    className="button button-compact"
                    type="button"
                    onClick={() => handleModifier(plat)}
                  >
                    Modifier
                  </button>

                  <button
                    className="button button-compact"
                    type="button"
                    onClick={() => handleDelete(plat.plat_id)}
                  >
                    Supprimer
                  </button>
                </div>

                <h4>Allergènes</h4>

                {plat.allergenes?.length > 0 ? (
                  plat.allergenes.map((allergene) => (
                    <p className="inline-action-row" key={allergene.allergene_id}>
                      <span>{allergene.libelle}</span>

                      <button
                        className="button button-compact"
                        type="button"
                        onClick={() =>
                          handleRemoveAllergene(
                            plat.plat_id,
                            allergene.allergene_id,
                          )
                        }
                      >
                        Retirer
                      </button>
                    </p>
                  ))
                ) : (
                  <p>Aucun allergène associé.</p>
                )}

                <select
                  value={allergeneSelection[plat.plat_id] || ""}
                  onChange={(event) =>
                    handleAllergeneChange(plat.plat_id, event.target.value)
                  }
                >
                  <option value="">Choisir un allergène</option>

                  {allergenes.map((allergene) => (
                    <option
                      key={allergene.allergene_id}
                      value={allergene.allergene_id}
                    >
                      {allergene.libelle}
                    </option>
                  ))}
                </select>

                <div className="card-actions">
                  <button
                    className="button button-compact"
                    type="button"
                    onClick={() => handleAddAllergene(plat.plat_id)}
                  >
                    Ajouter allergène
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

export default EmployeePlats;
