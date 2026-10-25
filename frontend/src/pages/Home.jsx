import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import avisService from "../services/avis.service";
import "../styles/pages.css";

const AVANTAGES = [
  "25 ans d'expérience",
  "Menus pour particuliers et professionnels",
  "Classique, végétarien et végan",
];

function formatReviewerName(avisClient) {
  const prenom = (avisClient.prenom || "").trim();
  const nom = (avisClient.nom || "").trim();

  if (prenom && nom) {
    return `${prenom} ${nom.charAt(0).toUpperCase()}.`;
  }

  return `${prenom} ${nom}`.trim() || "Client";
}

function renderStars(note) {
  const valeur = Math.max(0, Math.min(5, Number(note) || 0));

  return "★".repeat(valeur) + "☆".repeat(5 - valeur);
}

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

        setAvis(avisValides.slice(0, 3));
      } catch (loadError) {
        console.error("Erreur lors de la récupération des avis :", loadError);

        setError("Impossible de charger les avis clients.");
      }
    }

    loadAvis();
  }, []);

  return (
    <div className="home">
      <section className="home-hero" aria-label="Présentation">
        <div className="home-hero-media">
          <img
            src="/images/hero-buffet.webp"
            alt="Buffet traiteur Vite & Gourmand avec assortiment de pièces cocktail"
            width="733"
            height="519"
          />
        </div>

        <div className="home-hero-content">
          <h2 className="home-hero-title">
            Des menus gourmands pour tous vos événements
          </h2>

          <p className="home-hero-text">
            Traiteur à Bordeaux depuis plus de 25 ans, nous accompagnons
            particuliers et professionnels dans l&apos;organisation de leurs
            événements grâce à des menus élaborés avec soin.
          </p>

          <ul className="home-advantages">
            {AVANTAGES.map((avantage) => (
              <li key={avantage}>
                <span className="home-advantage-check" aria-hidden="true">
                  ✓
                </span>
                <span>{avantage}</span>
              </li>
            ))}
          </ul>

          <Link className="button home-hero-cta" to="/menus">
            Découvrir nos menus
          </Link>
        </div>
      </section>

      <section className="home-reviews" aria-label="Avis clients">
        {error && <p className="home-reviews-empty">{error}</p>}

        {!error && avis.length === 0 && (
          <p className="home-reviews-empty">
            Aucun avis disponible pour le moment.
          </p>
        )}

        {avis.length > 0 && (
          <div className="home-reviews-grid">
            {avis.map((avisClient) => (
              <article className="home-review-card" key={avisClient.avis_id}>
                <p
                  className="home-review-stars"
                  aria-label={`Note : ${avisClient.note} sur 5`}
                >
                  {renderStars(avisClient.note)}
                </p>

                <p className="home-review-quote">{avisClient.description}</p>

                <p className="home-review-author">
                  {formatReviewerName(avisClient)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
