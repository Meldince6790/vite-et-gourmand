import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import horaireService from "../services/horaire.service.js";

function formaterHoraire(horaire) {
  const ouverture = String(horaire.heure_ouverture || "").trim();
  const fermeture = String(horaire.heure_fermeture || "").trim();

  if (ouverture === "Fermé" && fermeture === "Fermé") {
    return `${horaire.jour} : Fermé`;
  }

  return `${horaire.jour} : ${ouverture} - ${fermeture}`;
}

function Footer() {
  const [horaires, setHoraires] = useState([]);

  useEffect(() => {
    let actif = true;

    async function loadHoraires() {
      try {
        const data = await horaireService.getHoraires();

        if (actif) {
          setHoraires(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des horaires :", error);
      }
    }

    loadHoraires();

    return () => {
      actif = false;
    };
  }, []);

  const milieu = Math.ceil(horaires.length / 2);
  const horairesGauche = horaires.slice(0, milieu);
  const horairesDroite = horaires.slice(milieu);

  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-column">
          <h3>Horaires</h3>

          {horaires.length === 0 ? (
            <p>Horaires indisponibles pour le moment.</p>
          ) : (
            <div className="footer-horaires">
              <ul className="footer-horaires-list">
                {horairesGauche.map((horaire) => (
                  <li key={horaire.horaire_id}>{formaterHoraire(horaire)}</li>
                ))}
              </ul>

              <ul className="footer-horaires-list">
                {horairesDroite.map((horaire) => (
                  <li key={horaire.horaire_id}>{formaterHoraire(horaire)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="footer-column">
          <h3>Informations</h3>

          <ul className="footer-links">
            <li>
              <Link to="/mentions-legales">Mentions légales</Link>
            </li>
            <li>
              <Link to="/cgv">Conditions Générales de Vente</Link>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Vite &amp; Gourmand</h3>
          <p>© 2026 Vite &amp; Gourmand</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
