import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import avisService from "../services/avis.service";
import "../styles/pages.css";

function Home() {
  const [avis, setAvis] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAvis() {
      try {
        const data = await avisService.getAvis();

        const avisValides = data.filter(
          (avisClient) => avisClient.statut === "Validé",
        );

        setAvis(avisValides);
      } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);

        setError("Impossible de charger les avis clients.");
      }
    }

    loadAvis();
  }, []);

  return (
    <div>
      <section className="hero">
        <h2>Vite & Gourmand</h2>

        <p>Votre traiteur pour vos événements privés et professionnels.</p>

        <Link className="button" to="/menus">
          Découvrir nos menus
        </Link>
      </section>

      <section className="section">
        <h2>Notre savoir-faire</h2>

        <p>
          Nous proposons des menus adaptés à vos besoins, préparés avec des
          produits de qualité.
        </p>
      </section>

      <section className="section">
        <h2>Nos engagements</h2>

        <div className="cards">
          <div className="card">
            <h3>Produits frais</h3>
            <p>Des ingrédients sélectionnés avec soin.</p>
          </div>

          <div className="card">
            <h3>Menus personnalisés</h3>
            <p>Des solutions adaptées à chaque événement.</p>
          </div>

          <div className="card">
            <h3>Livraison</h3>
            <p>Un service pensé pour simplifier vos projets.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Avis clients</h2>

        {error && <p>{error}</p>}

        {avis.length === 0 ? (
          <p>Aucun avis disponible pour le moment.</p>
        ) : (
          <div className="cards">
            {avis.map((avisClient) => (
              <div className="card" key={avisClient.avis_id}>
                <h3>
                  {avisClient.prenom} {avisClient.nom}
                </h3>

                <p>
                  <strong>Note :</strong> {"⭐".repeat(avisClient.note)}
                </p>

                <p>{avisClient.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
