import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import horaireService from "../services/horaire.service.js";

const JOURS_COURTS = {
  Lundi: "Lundi",
  Mardi: "Mar",
  Mercredi: "Mer",
  Jeudi: "Jeu",
  Vendredi: "Ven",
  Samedi: "Samedi",
  Dimanche: "Dimanche",
};

function formaterHeure(valeur) {
  return String(valeur || "")
    .trim()
    .replace(":", "h");
}

function formaterPlageJours(jours) {
  if (jours.length === 1) {
    return JOURS_COURTS[jours[0]] || jours[0];
  }

  const debut = JOURS_COURTS[jours[0]] || jours[0];
  const fin = JOURS_COURTS[jours[jours.length - 1]] || jours[jours.length - 1];

  return `${debut} - ${fin}`;
}

function formaterGroupeHoraire(groupe) {
  const plage = formaterPlageJours(groupe.jours);
  const ouverture = String(groupe.ouverture || "").trim();
  const fermeture = String(groupe.fermeture || "").trim();

  if (ouverture === "Fermé" && fermeture === "Fermé") {
    return `${plage} : Fermé`;
  }

  return `${plage} : ${formaterHeure(ouverture)} - ${formaterHeure(fermeture)}`;
}

/** Regroupe les jours consécutifs aux mêmes horaires (géométrie maquette). */
function regrouperHoraires(horaires) {
  const groupes = [];

  for (const horaire of horaires) {
    const dernier = groupes[groupes.length - 1];

    if (
      dernier &&
      dernier.ouverture === horaire.heure_ouverture &&
      dernier.fermeture === horaire.heure_fermeture
    ) {
      dernier.jours.push(horaire.jour);
      continue;
    }

    groupes.push({
      key: horaire.horaire_id,
      jours: [horaire.jour],
      ouverture: horaire.heure_ouverture,
      fermeture: horaire.heure_fermeture,
    });
  }

  return groupes;
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

  const groupesHoraires = regrouperHoraires(horaires);

  return (
    <footer className="footer">
      <div className="footer-columns">
        <h3 className="footer-title">Horaires</h3>

        <div className="footer-column footer-column-mentions">
          <Link to="/mentions-legales">Mentions légales</Link>
        </div>

        <div className="footer-column footer-column-cgv">
          <Link to="/cgv">Conditions Générales de Vente</Link>
        </div>

        {horaires.length === 0 ? (
          <p className="footer-horaires-empty">
            Horaires indisponibles pour le moment.
          </p>
        ) : (
          <ul className="footer-horaires-list">
            {groupesHoraires.map((groupe) => (
              <li key={groupe.key}>{formaterGroupeHoraire(groupe)}</li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}

export default Footer;
