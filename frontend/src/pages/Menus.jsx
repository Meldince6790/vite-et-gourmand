import { useEffect, useState } from "react";

import API_URL from "../api/api";
import MenuCard from "../components/MenuCard.jsx";
import "../styles/pages.css";

function Menus() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/menus`)
      .then((response) => response.json())
      .then((data) => setMenus(data))
      .catch((error) => {
        console.error("Erreur lors de la récupération des menus :", error);
      });
  }, []);

  return (
    <div>
      <section className="section">
        <h1>Nos menus</h1>

        <p>Découvrez nos propositions adaptées à vos événements.</p>

        <div className="menu-grid">
          {menus.length > 0 ? (
            menus.map((menu) => (
              <MenuCard
                key={menu.menu_id}
                title={menu.titre}
                description={menu.description}
                price={menu.prix_par_personne}
              />
            ))
          ) : (
            <p>Aucun menu disponible pour le moment.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Menus;
