import { useEffect, useState } from "react";

import statistiqueService from "../services/statistique.service.js";

import StatistiquesChart from "../components/StatistiquesChart.jsx";

import "../styles/pages.css";

function AdminStatistiques() {
  const [statistiques, setStatistiques] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStatistiques() {
      try {
        const data = await statistiqueService.getCommandesParMenu();

        setStatistiques(data);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchStatistiques();
  }, []);

  return (
    <section className="section">
      <h1>Statistiques des commandes</h1>

      <p>Comparaison du nombre de commandes réalisées par menu.</p>

      {error && <p className="error">{error}</p>}

      {statistiques.length > 0 ? (
        <StatistiquesChart statistiques={statistiques} />
      ) : (
        !error && <p>Aucune statistique disponible pour le moment.</p>
      )}
    </section>
  );
}

export default AdminStatistiques;
