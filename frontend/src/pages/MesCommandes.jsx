import { useEffect, useState } from "react";

import commandeService from "../services/commande.service";
import "../styles/pages.css";

function MesCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [commandeEdition, setCommandeEdition] = useState(null);
  const [commandeAnnulation, setCommandeAnnulation] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadCommandes() {
    try {
      const data = await commandeService.getMesCommandes();

      setCommandes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error);

      setError("Impossible de récupérer vos commandes.");
    }
  }

  useEffect(() => {
    loadCommandes();
  }, []);

  function handleModifier(commande) {
    setCommandeEdition({
      ...commande,
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

      await loadCommandes();
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
      mode_contact_annulation: "Mail",
      motif_annulation: "",
    });
  }

  async function handleConfirmAnnulation() {
    try {
      await commandeService.annulerCommande(commandeAnnulation.commande_id, {
        mode_contact_annulation: commandeAnnulation.mode_contact_annulation,
        motif_annulation: commandeAnnulation.motif_annulation,
      });

      setMessage("Commande annulée avec succès.");

      setCommandeAnnulation(null);

      await loadCommandes();
    } catch (error) {
      setError(error.message);
    }
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="section">
      <h1>Mes commandes</h1>

      {message && <p>{message}</p>}

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

                  {commande.pret_materiel && (
                    <p>
                      <strong>Matériel :</strong> prêt demandé
                    </p>
                  )}

                  {commandeEdition === null &&
                    commandeAnnulation?.commande_id ===
                      commande.commande_id && (
                      <>
                        <label>
                          <span>Mode de contact :</span>

                          <select
                            value={commandeAnnulation.mode_contact_annulation}
                            onChange={(event) =>
                              setCommandeAnnulation((ancienne) => ({
                                ...ancienne,
                                mode_contact_annulation: event.target.value,
                              }))
                            }
                          >
                            <option value="Mail">Mail</option>
                            <option value="Téléphone">Téléphone</option>
                          </select>
                        </label>

                        <label>
                          <span>Motif d'annulation :</span>

                          <textarea
                            value={commandeAnnulation.motif_annulation}
                            onChange={(event) =>
                              setCommandeAnnulation((ancienne) => ({
                                ...ancienne,
                                motif_annulation: event.target.value,
                              }))
                            }
                          />
                        </label>

                        <button
                          className="button"
                          type="button"
                          onClick={handleConfirmAnnulation}
                        >
                          Confirmer l'annulation
                        </button>

                        <button
                          className="button"
                          type="button"
                          onClick={() => setCommandeAnnulation(null)}
                        >
                          Retour
                        </button>
                      </>
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
