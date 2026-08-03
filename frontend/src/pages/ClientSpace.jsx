import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import commandeService from "../services/commande.service";
import utilisateurService from "../services/utilisateur.service";
import { formatDateFr } from "../utils/date.js";
import "../styles/pages.css";

function ClientSpace() {
  const { user, updateUser } = useAuth();

  const [commandes, setCommandes] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [profil, setProfil] = useState({
    nom: user.nom || "",
    prenom: user.prenom || "",
    telephone: user.telephone || "",
    ville: user.ville || "",
    pays: user.pays || "",
    adresse_postale: user.adresse_postale || "",
  });

  useEffect(() => {
    async function loadCommandes() {
      try {
        const data = await commandeService.getMesCommandes();

        setCommandes(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);

        setError("Impossible de récupérer vos commandes.");
      }
    }

    loadCommandes();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfil({
      ...profil,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const utilisateur = await utilisateurService.updateProfil(profil);

      updateUser({
        ...user,
        ...utilisateur,
      });

      setSuccess("Informations mises à jour avec succès.");
      setError("");
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la modification du profil :", error);

      setError(error.message);
      setSuccess("");
    }
  }

  return (
    <section className="section client-space">
      <h1>Mon espace client</h1>

      <p className="client-space-intro">
        Retrouvez vos informations personnelles et un aperçu de vos commandes.
        Vous pouvez mettre à jour vos coordonnées à tout moment.
      </p>

      {success && <p className="auth-success">{success}</p>}

      {error && <p className="auth-error">{error}</p>}

      <section className="client-profile">
        <h2>Mes informations</h2>

        <p className="client-profile-help">
          Ces informations sont utilisées pour le suivi de vos commandes et la
          communication avec Vite &amp; Gourmand.
        </p>

        <div className="card client-profile-card">
          {!isEditing ? (
            <>
              <dl className="client-profile-list">
                <div>
                  <dt>Nom</dt>
                  <dd>{user.nom}</dd>
                </div>

                <div>
                  <dt>Prénom</dt>
                  <dd>{user.prenom}</dd>
                </div>

                <div>
                  <dt>Email</dt>
                  <dd>{user.email}</dd>
                </div>

                <div>
                  <dt>Téléphone</dt>
                  <dd>{user.telephone || "—"}</dd>
                </div>

                <div>
                  <dt>Ville</dt>
                  <dd>{user.ville || "—"}</dd>
                </div>

                <div>
                  <dt>Pays</dt>
                  <dd>{user.pays || "—"}</dd>
                </div>

                <div className="client-profile-full">
                  <dt>Adresse</dt>
                  <dd>{user.adresse_postale || "—"}</dd>
                </div>
              </dl>

              <button
                type="button"
                className="button client-profile-edit"
                onClick={() => setIsEditing(true)}
              >
                Modifier mes informations
              </button>
            </>
          ) : (
            <form className="form client-profile-form" onSubmit={handleSubmit}>
              <label htmlFor="nom">Nom</label>

              <input
                id="nom"
                name="nom"
                value={profil.nom}
                onChange={handleChange}
                required
              />

              <label htmlFor="prenom">Prénom</label>

              <input
                id="prenom"
                name="prenom"
                value={profil.prenom}
                onChange={handleChange}
                required
              />

              <label htmlFor="email">Email</label>

              <input id="email" type="email" value={user.email} disabled />

              <label htmlFor="telephone">Téléphone</label>

              <input
                id="telephone"
                name="telephone"
                value={profil.telephone}
                onChange={handleChange}
              />

              <label htmlFor="ville">Ville</label>

              <input
                id="ville"
                name="ville"
                value={profil.ville}
                onChange={handleChange}
              />

              <label htmlFor="pays">Pays</label>

              <input
                id="pays"
                name="pays"
                value={profil.pays}
                onChange={handleChange}
              />

              <label htmlFor="adresse_postale">Adresse postale</label>

              <input
                id="adresse_postale"
                name="adresse_postale"
                value={profil.adresse_postale}
                onChange={handleChange}
              />

              <div className="client-profile-actions">
                <button type="submit" className="button">
                  Enregistrer
                </button>

                <button
                  type="button"
                  className="client-profile-cancel"
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section>
        <h2>Mes commandes</h2>

        <p>
          <Link className="button" to="/mes-commandes">
            Gérer mes commandes
          </Link>
        </p>

        {commandes.length === 0 ? (
          <p>Aucune commande trouvée.</p>
        ) : (
          <div className="cards">
            {commandes.map((commande) => (
              <div className="card" key={commande.commande_id}>
                <h3>{commande.numero_commande}</h3>

                <p>
                  <strong>Statut :</strong> {commande.statut}
                </p>

                <p>
                  <strong>Date de prestation :</strong>{" "}
                  {formatDateFr(commande.date_prestation)}
                </p>

                <p>
                  <strong>Heure :</strong> {commande.heure_livraison}
                </p>

                <p>
                  <strong>Adresse :</strong> {commande.adresse_livraison}
                </p>

                <p>
                  <strong>Nombre de personnes :</strong>{" "}
                  {commande.nombre_personne}
                </p>

                <p>
                  <strong>Prix menu :</strong> {commande.prix_menu} €
                </p>

                <p>
                  <strong>Livraison :</strong> {commande.prix_livraison} €
                </p>

                {Boolean(commande.pret_materiel) ? (
                  <p>
                    <strong>Matériel :</strong> prêt demandé
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default ClientSpace;
