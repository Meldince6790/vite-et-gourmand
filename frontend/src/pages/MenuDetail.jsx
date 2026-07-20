import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API_URL from "../api/api.js";
import "../styles/pages.css";

function MenuDetail() {
  const { id } = useParams();

  const [menu, setMenu] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/menus/${id}`)
      .then((response) => response.json())
      .then((data) => setMenu(data))
      .catch((error) => {
        console.error("Erreur lors de la récupération du menu :", error);
      });
  }, [id]);

  if (!menu) {
    return <p>Chargement du menu...</p>;
  }

  return (
    <section className="section">
      <h1>{menu.titre}</h1>

      <p>{menu.description}</p>

      <p>
        <strong>{menu.prix_par_personne} € / personne</strong>
      </p>

      <p>Régime : {menu.regime}</p>

      <p>Thème : {menu.theme}</p>

      <p>Minimum de personnes : {menu.nombre_personne_minimum}</p>
    </section>
  );
}

export default MenuDetail;
