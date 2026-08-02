import { useEffect, useState } from "react";

import commandeService from "../services/commande.service.js";
import { formatDateFr } from "../utils/date.js";

import "../styles/pages.css";

const STATUTS_COMMANDES = [
  "En attente",
  "Acceptée",
  "En préparation",
  "En cours de livraison",
  "Livrée",
  "En attente du retour de matériel",
  "Terminée",
  "Annulée",
];

function EmployeeCommandes() {
  const [commandes, setCommandes] = useState([]);

  const [statutsCommandes, setStatutsCommandes] = useState({});
  const [annulations, setAnnulations] = useState({});

  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [rechercheClient, setRechercheClient] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let actif = true;

    async function fetchCommandes() {
      try {
        const data = await commandeService.getCommandes();

        if (!actif) {
          return;
        }

        setCommandes(data);

        const nouveauxStatuts = {};

        data.forEach((commande) => {
          nouveauxStatuts[commande.commande_id] = commande.statut;
        });

        setStatutsCommandes(nouveauxStatuts);
      } catch (error) {
        if (actif) {
          setError(error.message);
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
      const data = await commandeService.getCommandes();

      setCommandes(data);

      const nouveauxStatuts = {};

      data.forEach((commande) => {
        nouveauxStatuts[commande.commande_id] = commande.statut;
      });

      setStatutsCommandes(nouveauxStatuts);
    } catch (error) {
      setError(error.message);
    }
  }

  const commandesFiltrees = commandes.filter((commande) => {
    const correspondStatut =
      filtreStatut === "Tous" || commande.statut === filtreStatut;

    const nomComplet =
      `${commande.prenom || ""} ${commande.nom || ""}`.toLowerCase();

    const correspondClient = nomComplet.includes(rechercheClient.toLowerCase());

    return correspondStatut && correspondClient;
  });

  function handleStatutCommandeChange(id, statut) {
    setStatutsCommandes((ancien) => ({
      ...ancien,
      [id]: statut,
    }));
  }

  async function handleUpdateStatutCommande(id) {
    try {
      await commandeService.updateStatut(id, statutsCommandes[id]);

      setMessage("Statut de commande modifié avec succès.");

      await refreshCommandes();
    } catch (error) {
      setError(error.message);
    }
  }

  function handleAnnulationChange(id, champ, valeur) {
    setAnnulations((ancien) => ({
      ...ancien,
      [id]: {
        ...ancien[id],
        [champ]: valeur,
      },
    }));
  }

  async function handleAnnulerCommande(id) {
    const annulation = annulations[id];

    if (
      !annulation?.mode_contact_annulation ||
      !annulation?.motif_annulation?.trim()
    ) {
      setError(
        "Veuillez renseigner le mode de contact et le motif d'annulation.",
      );
      return;
    }

    try {
      await commandeService.annulerCommande(id, {
        mode_contact_annulation: annulation.mode_contact_annulation,
        motif_annulation: annulation.motif_annulation.trim(),
      });

      setMessage("Commande annulée avec succès.");
      setError("");

      setAnnulations((ancien) => {
        const copie = { ...ancien };

        delete copie[id];

        return copie;
      });

      await refreshCommandes();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="section">
      <h1>Gestion des commandes</h1>

      {error && <p>{error}</p>}

      {message && <p>{message}</p>}

      <div className="filters">
        <label>
          <span>Filtrer par statut :</span>

          <select
            value={filtreStatut}
            onChange={(event) => setFiltreStatut(event.target.value)}
          >
            <option value="Tous">Tous</option>

            {STATUTS_COMMANDES.map((statut) => (
              <option key={statut} value={statut}>
                {statut}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Rechercher un client :</span>

          <input
            type="text"
            value={rechercheClient}
            onChange={(event) => setRechercheClient(event.target.value)}
            placeholder="Nom ou prénom"
          />
        </label>
      </div>

      {commandesFiltrees.length === 0 ? (
        <p>Aucune commande disponible.</p>
      ) : (
        <div className="cards">
          {commandesFiltrees.map((commande) => (
            <div className="card" key={commande.commande_id}>
              <h3>Commande #{commande.commande_id}</h3>

              <p>
                Client : {commande.prenom} {commande.nom}
              </p>

              <p>
                Date prestation : {formatDateFr(commande.date_prestation)}
              </p>

              <p>Heure : {commande.heure_livraison}</p>

              <p>Adresse : {commande.adresse_livraison}</p>

              <p>Nombre de personnes : {commande.nombre_personne}</p>

              <p>Prix menu : {commande.prix_menu} €</p>

              <p>Prix livraison : {commande.prix_livraison} €</p>

              <p>
                Statut actuel : <strong>{commande.statut}</strong>
              </p>

              <div className="card-actions">
                <select
                  value={
                    statutsCommandes[commande.commande_id] || commande.statut
                  }
                  onChange={(event) =>
                    handleStatutCommandeChange(
                      commande.commande_id,
                      event.target.value,
                    )
                  }
                >
                  {STATUTS_COMMANDES.map((statut) => (
                    <option key={statut} value={statut}>
                      {statut}
                    </option>
                  ))}
                </select>

                <button
                  className="button button-compact"
                  type="button"
                  onClick={() =>
                    handleUpdateStatutCommande(commande.commande_id)
                  }
                >
                  Modifier le statut
                </button>
              </div>

              {commande.statut !== "Annulée" &&
                commande.statut !== "Terminée" && (
                  <div className="commande-annulation">
                    <label className="field-stack">
                      <span>Mode de contact :</span>

                      <select
                        value={
                          annulations[commande.commande_id]
                            ?.mode_contact_annulation || ""
                        }
                        onChange={(event) =>
                          handleAnnulationChange(
                            commande.commande_id,
                            "mode_contact_annulation",
                            event.target.value,
                          )
                        }
                      >
                        <option value="">Choisir</option>
                        <option value="Téléphone">Téléphone</option>
                        <option value="Mail">Mail</option>
                      </select>
                    </label>

                    <label className="field-stack">
                      <span>Motif d'annulation :</span>

                      <input
                        type="text"
                        value={
                          annulations[commande.commande_id]?.motif_annulation ||
                          ""
                        }
                        onChange={(event) =>
                          handleAnnulationChange(
                            commande.commande_id,
                            "motif_annulation",
                            event.target.value,
                          )
                        }
                      />
                    </label>

                    <div className="card-actions">
                      <button
                        className="button button-compact"
                        type="button"
                        onClick={() =>
                          handleAnnulerCommande(commande.commande_id)
                        }
                      >
                        Annuler la commande
                      </button>
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default EmployeeCommandes;
