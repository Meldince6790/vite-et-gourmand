import { Link } from "react-router-dom";

import "../styles/pages.css";

function AdminSpace() {
  return (
    <section className="section">
      <h1>Espace Administrateur</h1>

      <p>
        Bienvenue dans votre espace administrateur. Vous disposez de tous les
        droits de gestion employé ainsi que des fonctionnalités administratives.
      </p>

      <div className="cards">
        <div className="card">
          <h2>Gestion des employés</h2>

          <p>Créez et désactivez les comptes employés de l'entreprise.</p>

          <Link className="button" to="/espace-admin/utilisateurs">
            Gérer les comptes employés
          </Link>
        </div>

        <div className="card">
          <h2>Statistiques</h2>

          <p>Analysez les commandes par menu grâce aux données statistiques.</p>

          <Link className="button" to="/espace-admin/statistiques">
            Voir les statistiques
          </Link>
        </div>

        <div className="card">
          <h2>Chiffre d'affaires</h2>

          <p>
            Consultez le chiffre d'affaires généré par menu avec des filtres.
          </p>

          <Link className="button" to="/espace-admin/chiffre-affaires">
            Voir le chiffre d'affaires
          </Link>
        </div>

        <div className="card">
          <h2>Commandes</h2>

          <p>Consultez et gérez les commandes clients.</p>

          <Link className="button" to="/espace-employe/commandes">
            Gérer les commandes
          </Link>
        </div>

        <div className="card">
          <h2>Avis clients</h2>

          <p>Consultez et modérez les avis déposés par les clients.</p>

          <Link className="button" to="/espace-employe/avis">
            Gérer les avis
          </Link>
        </div>

        <div className="card">
          <h2>Menus</h2>

          <p>Créez et modifiez les menus proposés.</p>

          <Link className="button" to="/espace-employe/menus">
            Gérer les menus
          </Link>
        </div>

        <div className="card">
          <h2>Plats</h2>

          <p>Gérez les plats et leurs allergènes.</p>

          <Link className="button" to="/espace-employe/plats">
            Gérer les plats
          </Link>
        </div>

        <div className="card">
          <h2>Horaires</h2>

          <p>Gérez les horaires d'ouverture du service.</p>

          <Link className="button" to="/espace-employe/horaires">
            Gérer les horaires
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AdminSpace;
