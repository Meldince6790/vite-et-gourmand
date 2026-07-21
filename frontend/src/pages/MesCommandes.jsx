import { useEffect, useState } from "react";

import commandeService from "../services/commande.service";
import "../styles/pages.css";

function MesCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCommandes() {
      try {
        const data = await commandeService.getMesCommandes();

        setCommandes(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);

        setError("Impossible de récupérer vos commandes.");
      }
    }

    loadCommandes();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="section">
      <h1>Mes commandes</h1>

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

              <p>
                <strong>Date de prestation :</strong> {commande.date_prestation}
              </p>

              <p>
                <strong>Heure de livraison :</strong> {commande.heure_livraison}
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MesCommandes;
