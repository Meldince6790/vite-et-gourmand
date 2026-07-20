import { Link } from "react-router-dom";

import "../styles/pages.css";

function Home() {
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
    </div>
  );
}

export default Home;
