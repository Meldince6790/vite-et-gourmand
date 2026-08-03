import { Link } from "react-router-dom";

import "../styles/pages.css";

function EmployeeSpace() {
  return (
    <section className="section">
      <h1>Espace employé</h1>

      <p>Bienvenue dans votre espace de gestion.</p>

      <div className="cards">
        <div className="card card-dashboard">
          <div className="card-body">
            <h2>Commandes</h2>

            <p>Consultez et gérez les commandes clients.</p>
          </div>

          <Link className="button" to="/espace-employe/commandes">
            Gérer les commandes
          </Link>
        </div>

        <div className="card card-dashboard">
          <div className="card-body">
            <h2>Avis clients</h2>

            <p>Consultez et modérez les avis déposés par les clients.</p>
          </div>

          <Link className="button" to="/espace-employe/avis">
            Gérer les avis
          </Link>
        </div>

        <div className="card card-dashboard">
          <div className="card-body">
            <h2>Menus</h2>

            <p>Créez et modifiez les menus proposés.</p>
          </div>

          <Link className="button" to="/espace-employe/menus">
            Gérer les menus
          </Link>
        </div>

        <div className="card card-dashboard">
          <div className="card-body">
            <h2>Plats</h2>

            <p>Gérez les plats et leurs allergènes.</p>
          </div>

          <Link className="button" to="/espace-employe/plats">
            Gérer les plats
          </Link>
        </div>

        <div className="card card-dashboard">
          <div className="card-body">
            <h2>Horaires</h2>

            <p>Gérez les horaires d'ouverture du service.</p>
          </div>

          <Link className="button" to="/espace-employe/horaires">
            Gérer les horaires
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EmployeeSpace;
