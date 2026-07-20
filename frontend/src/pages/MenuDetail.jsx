import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import menuService from "../services/menu.service";
import "../styles/pages.css";

function MenuDetail() {
  const { id } = useParams();

  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await menuService.getMenuById(id);

        setMenu(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du menu :", error);

        setError("Impossible de charger ce menu.");
      }
    }

    loadMenu();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

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

      <h2>Composition du menu</h2>

      <ul>
        {menu.plats.map((plat) => (
          <li key={plat.plat_id}>{plat.titre_plat}</li>
        ))}
      </ul>
    </section>
  );
}

export default MenuDetail;
