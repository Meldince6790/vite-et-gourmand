import { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";
import commandeService from "../services/commande.service";
import utilisateurService from "../services/utilisateur.service";
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

  if (error && commandes.length === 0) {
    return <p>{error}</p>;
  }

  return (
    <section className="section">
      <h1>Mon espace client</h1>

      {success && <p>{success}</p>}

      {error && <p>{error}</p>}

      <section>
        <h2>Mes informations</h2>

        <div className="card">
          {!isEditing ? (
            <>
              <p>
                <strong>Nom :</strong> {user.nom}
              </p>

              <p>
                <strong>Prénom :</strong> {user.prenom}
              </p>

              <p>
                <strong>Email :</strong> {user.email}
              </p>

              <p>
                <strong>Téléphone :</strong> {user.telephone}
              </p>

              <p>
                <strong>Ville :</strong> {user.ville}
              </p>

              <p>
                <strong>Pays :</strong> {user.pays}
              </p>

              <p>
                <strong>Adresse :</strong> {user.adresse_postale}
              </p>

              <button type="button" onClick={() => setIsEditing(true)}>
                Modifier mes informations
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
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

              <button type="submit">Enregistrer</button>

              <button type="button" onClick={() => setIsEditing(false)}>
                Annuler
              </button>
            </form>
          )}
        </div>
      </section>

      <section>
        <h2>Mes commandes</h2>

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
                  {commande.date_prestation}
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

                {commande.pret_materiel && (
                  <p>
                    <strong>Matériel :</strong> prêt demandé
                  </p>
                )}

                {commande.statut === "En attente" && (
                  <div>
                    <button type="button">Modifier</button>

                    <button type="button">Annuler</button>
                  </div>
                )}

                {commande.statut !== "En attente" && (
                  <button type="button">Voir le suivi</button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default ClientSpace;
