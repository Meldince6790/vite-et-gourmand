import { useEffect, useState } from "react";

import commandeService from "../services/commande.service";
import "../styles/pages.css";

function toDateInputValue(value) {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 10);
}

function MesCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [commandeEdition, setCommandeEdition] = useState(null);
  const [commandeAnnulation, setCommandeAnnulation] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let actif = true;

    async function fetchCommandes() {
      try {
        const data = await commandeService.getMesCommandes();

        if (!actif) {
          return;
        }

        setCommandes(data);
        setError("");
      } catch (error) {
        if (actif) {
          console.error(
            "Erreur lors de la récupération des commandes :",
            error,
          );

          setError("Impossible de récupérer vos commandes.");
        }
      }
    }

    fetchCommandes();

    return () => {
      actif = false;
    };
  }, []);

  async function refreshCommandes() {
    try {
      const data = await commandeService.getMesCommandes();

      setCommandes(data);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }

  function handleModifier(commande) {
    setCommandeEdition({
      ...commande,
      date_prestation: toDateInputValue(commande.date_prestation),
    });
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setCommandeEdition((ancienne) => ({
      ...ancienne,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSave() {
    try {
      await commandeService.updateCommande(
        commandeEdition.commande_id,
        commandeEdition,
      );

      setMessage("Commande modifiée avec succès.");
      setCommandeEdition(null);

      await refreshCommandes();
    } catch (error) {
      setError(error.message);
    }
  }

  function handleCancelEdit() {
    setCommandeEdition(null);
  }

  function handleAnnuler(commande) {
    setCommandeAnnulation({
      commande_id: commande.commande_id,
    });
  }

  async function handleConfirmAnnulation() {
    try {
      await commandeService.annulerCommandeClient(
        commandeAnnulation.commande_id,
      );

      setMessage("Commande annulée avec succès.");

      setCommandeAnnulation(null);

      await refreshCommandes();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="section">
      <h1>Mes commandes</h1>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      {commandes.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        <div className="cards">
          {commandes.map((commande) => (
            <div className="card" key={commande.commande_id}>
              <h3>{commande.numero_commande}</h3>

              <p>
                <strong>Statut :</strong> {commande.statut}
              </p>

              {commandeEdition?.commande_id === commande.commande_id ? (
                <>
                  <label>
                    <span>Date de prestation :</span>

                    <input
                      type="date"
                      name="date_prestation"
                      value={commandeEdition.date_prestation}
                      onChange={handleChange}
                    />
                  </label>

                  <label>
                    <span>Heure de livraison :</span>

                    <input
                      type="time"
                      name="heure_livraison"
                      value={commandeEdition.heure_livraison}
                      onChange={handleChange}
                    />
                  </label>

                  <label>
                    <span>Adresse de livraison :</span>

                    <input
                      type="text"
                      name="adresse_livraison"
                      value={commandeEdition.adresse_livraison}
                      onChange={handleChange}
                    />
                  </label>

                  <label>
                    <span>Nombre de personnes :</span>

                    <input
                      type="number"
                      name="nombre_personne"
                      value={commandeEdition.nombre_personne}
                      onChange={handleChange}
                    />
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      name="pret_materiel"
                      checked={commandeEdition.pret_materiel}
                      onChange={handleChange}
                    />

                    <span>Prêt de matériel</span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      name="restitution_materiel"
                      checked={commandeEdition.restitution_materiel}
                      onChange={handleChange}
                    />

                    <span>Restitution du matériel</span>
                  </label>

                  <button className="button" type="button" onClick={handleSave}>
                    Enregistrer
                  </button>

                  <button
                    className="button"
                    type="button"
                    onClick={handleCancelEdit}
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <>
                  <p>
                    <strong>Date de prestation :</strong>{" "}
                    {commande.date_prestation}
                  </p>

                  <p>
                    <strong>Heure de livraison :</strong>{" "}
                    {commande.heure_livraison}
                  </p>

                  <p>
                    <strong>Nombre de personnes :</strong>{" "}
                    {commande.nombre_personne}
                  </p>

                  <p>
                    <strong>Prix du menu :</strong> {commande.prix_menu} €
                  </p>

                  <p>
                    <strong>Livraison :</strong> {commande.prix_livraison} €
                  </p>

                  {Boolean(commande.pret_materiel) ? (
                    <p>
                      <strong>Matériel :</strong> prêt demandé
                    </p>
                  ) : null}

                  {commande.statut === "En attente" &&
                    commandeAnnulation?.commande_id ===
                      commande.commande_id && (
                      <button
                        className="button"
                        type="button"
                        onClick={handleConfirmAnnulation}
                      >
                        Confirmer l'annulation
                      </button>
                    )}

                  {commande.statut === "En attente" &&
                    commandeAnnulation === null && (
                      <>
                        <button
                          className="button"
                          type="button"
                          onClick={() => handleModifier(commande)}
                        >
                          Modifier
                        </button>

                        <button
                          className="button"
                          type="button"
                          onClick={() => handleAnnuler(commande)}
                        >
                          Annuler la commande
                        </button>
                      </>
                    )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MesCommandes;
