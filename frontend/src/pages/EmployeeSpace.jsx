import { useEffect, useState } from "react";

import avisService from "../services/avis.service.js";
import commandeService from "../services/commande.service.js";

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

function EmployeeSpace() {
  const [avis, setAvis] = useState([]);
  const [commandes, setCommandes] = useState([]);

  const [statuts, setStatuts] = useState({});
  const [statutsCommandes, setStatutsCommandes] = useState({});

  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [rechercheClient, setRechercheClient] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const avisData = await avisService.getAvis();

        setAvis(avisData);

        const initialStatuts = {};

        avisData.forEach((item) => {
          initialStatuts[item.avis_id] = item.statut;
        });

        setStatuts(initialStatuts);

        const commandesData = await commandeService.getCommandes();

        setCommandes(commandesData);

        const initialStatutsCommandes = {};

        commandesData.forEach((commande) => {
          initialStatutsCommandes[commande.commande_id] = commande.statut;
        });

        setStatutsCommandes(initialStatutsCommandes);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchData();
  }, []);

  const commandesFiltrees = commandes.filter((commande) => {
    const correspondStatut =
      filtreStatut === "Tous" || commande.statut === filtreStatut;

    const nomComplet = `${commande.prenom} ${commande.nom}`.toLowerCase();

    const correspondClient = nomComplet.includes(rechercheClient.toLowerCase());

    return correspondStatut && correspondClient;
  });

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

      const data = await avisService.getAvis();

      setAvis(data);
    } catch (error) {
      setError(error.message);
    }
  }

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

      const data = await commandeService.getCommandes();

      setCommandes(data);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="section">
      <h1>Espace employé</h1>

      <p>Bienvenue dans votre espace de gestion.</p>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <h2>Avis clients</h2>

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
                Statut : <strong>{item.statut}</strong>
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
                onClick={() => handleUpdateAvis(item.avis_id)}
              >
                Modifier le statut
              </button>
            </div>
          ))}
        </div>
      )}

      <h2>Gestion des commandes</h2>

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

              <p>Date prestation : {commande.date_prestation}</p>

              <p>Heure : {commande.heure_livraison}</p>

              <p>Adresse : {commande.adresse_livraison}</p>

              <p>Nombre de personnes : {commande.nombre_personne}</p>

              <p>Prix menu : {commande.prix_menu} €</p>

              <p>Prix livraison : {commande.prix_livraison} €</p>

              <p>
                Statut : <strong>{commande.statut}</strong>
              </p>

              <select
                value={statutsCommandes[commande.commande_id] || ""}
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
                className="button"
                onClick={() => handleUpdateStatutCommande(commande.commande_id)}
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

export default EmployeeSpace;
