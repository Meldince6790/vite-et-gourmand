import { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";
import commandeService from "../services/commande.service";
import avisService from "../services/avis.service";
import { formatDateFr, toDateInputValue } from "../utils/date.js";
import "../styles/pages.css";

const AVIS_FORM_INITIAL = {
  note: "5",
  description: "",
};

function aUnAvisActif(avisListe, utilisateurId) {
  return avisListe.some(
    (avis) =>
      Number(avis.utilisateur_id) === Number(utilisateurId) &&
      (avis.statut === "En attente" || avis.statut === "Validé"),
  );
}

function MesCommandes() {
  const { user } = useAuth();

  const [commandes, setCommandes] = useState([]);
  const [commandeEdition, setCommandeEdition] = useState(null);
  const [commandeAnnulation, setCommandeAnnulation] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [avisActifExistant, setAvisActifExistant] = useState(false);
  const [avisForm, setAvisForm] = useState(AVIS_FORM_INITIAL);
  const [avisError, setAvisError] = useState("");
  const [avisMessage, setAvisMessage] = useState("");
  const [avisSubmitting, setAvisSubmitting] = useState(false);

  const aCommandeTerminee = commandes.some(
    (commande) => commande.statut === "Terminée",
  );

  useEffect(() => {
    let actif = true;

    async function fetchDonnees() {
      try {
        const commandesData = await commandeService.getMesCommandes();

        if (!actif) {
          return;
        }

        setCommandes(commandesData);
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

      try {
        const avisData = await avisService.getAvis();

        if (!actif) {
          return;
        }

        setAvisActifExistant(
          aUnAvisActif(avisData, user?.utilisateur_id),
        );
      } catch (error) {
        if (actif) {
          console.error("Erreur lors de la récupération des avis :", error);
        }
      }
    }

    fetchDonnees();

    return () => {
      actif = false;
    };
  }, [user?.utilisateur_id]);

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
    const adresse = String(commandeEdition.adresse_livraison ?? "").trim();

    if (!adresse) {
      setError("L'adresse de livraison est obligatoire.");
      return;
    }

    if (adresse.length > 255) {
      setError(
        "L'adresse de livraison ne doit pas dépasser 255 caractères.",
      );
      return;
    }

    try {
      await commandeService.updateCommande(commandeEdition.commande_id, {
        ...commandeEdition,
        adresse_livraison: adresse,
      });

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

  function handleAvisChange(event) {
    const { name, value } = event.target;

    setAvisForm((ancien) => ({
      ...ancien,
      [name]: value,
    }));
  }

  async function handleSubmitAvis(event) {
    event.preventDefault();
    setAvisSubmitting(true);
    setAvisError("");
    setAvisMessage("");

    try {
      await avisService.createAvis({
        note: Number(avisForm.note),
        description: avisForm.description,
      });

      setAvisMessage(
        "Votre avis a été envoyé et sera publié après validation.",
      );
      setAvisForm(AVIS_FORM_INITIAL);
      setAvisActifExistant(true);
    } catch (error) {
      setAvisError(error.message);
    } finally {
      setAvisSubmitting(false);
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
                      placeholder="Ex. 12 rue Sainte-Catherine, 33000 Bordeaux"
                      maxLength={255}
                      required
                    />
                    <span className="field-help">
                      Indiquez le numéro, la rue, le code postal et la ville.
                      {commandeEdition.adresse_livraison !==
                      commande.adresse_livraison
                        ? " Les frais de livraison seront recalculés à l'enregistrement."
                        : ""}
                    </span>
                  </label>

                  <label>
                    <span>Informations complémentaires :</span>

                    <textarea
                      name="informations_complementaires"
                      value={
                        commandeEdition.informations_complementaires ?? ""
                      }
                      onChange={handleChange}
                      maxLength={500}
                      rows={3}
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
                    {formatDateFr(commande.date_prestation)}
                  </p>

                  <p>
                    <strong>Heure de livraison :</strong>{" "}
                    {commande.heure_livraison}
                  </p>

                  {commande.informations_complementaires ? (
                    <p>
                      <strong>Informations complémentaires :</strong>{" "}
                      {commande.informations_complementaires}
                    </p>
                  ) : null}

                  <p>
                    <strong>Nombre de personnes :</strong>{" "}
                    {commande.nombre_personne}
                  </p>

                  <p>
                    <strong>Prix du menu :</strong> {commande.prix_menu} €
                  </p>

                  <p>
                    <strong>Livraison :</strong> {commande.prix_livraison} €
                    {commande.distance_km != null &&
                    commande.distance_km !== ""
                      ? ` (${Number(commande.distance_km).toFixed(2)} km)`
                      : ""}
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

      {aCommandeTerminee && (
        <div className="section">
          <h2>Déposer un avis</h2>

          {avisMessage && (
            <p className="auth-success" role="status">
              {avisMessage}
            </p>
          )}

          {avisActifExistant ? (
            <p>Vous avez déjà déposé un avis.</p>
          ) : (
            <>
              {avisError && (
                <p className="auth-error" role="alert" id="avis-error">
                  {avisError}
                </p>
              )}

              <form
                className="form"
                onSubmit={handleSubmitAvis}
                aria-busy={avisSubmitting}
              >
                <label htmlFor="avis-note">Note</label>

                <select
                  id="avis-note"
                  name="note"
                  value={avisForm.note}
                  onChange={handleAvisChange}
                  required
                  disabled={avisSubmitting}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>

                <label htmlFor="avis-description">Commentaire</label>

                <textarea
                  id="avis-description"
                  name="description"
                  value={avisForm.description}
                  onChange={handleAvisChange}
                  maxLength={500}
                  required
                  disabled={avisSubmitting}
                  aria-describedby={avisError ? "avis-error" : undefined}
                />

                <button type="submit" disabled={avisSubmitting}>
                  {avisSubmitting ? "Envoi..." : "Envoyer mon avis"}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default MesCommandes;
