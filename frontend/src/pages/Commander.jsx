import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import commandeService from "../services/commande.service";
import menuService from "../services/menu.service";
import "../styles/pages.css";

function Commander() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [commande, setCommande] = useState({
    adresse_livraison: "",
    date_prestation: "",
    heure_livraison: "",
    nombre_personne: 1,
    pret_materiel: false,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function loadMenu() {
      try {
        const data = await menuService.getMenuById(id);

        setMenu(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du menu :", error);

        setError("Impossible de charger le menu.");
      }
    }

    loadMenu();
  }, [id, navigate, user]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setCommande({
      ...commande,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const nouvelleCommande = {
        ...commande,
        utilisateur_id: user.utilisateur_id,
        menu_id: id,
      };

      await commandeService.createCommande(nouvelleCommande);

      setSuccess("Commande créée avec succès.");
      setError("");
    } catch (error) {
      console.error("Erreur lors de la création de la commande :", error);

      setError(error.message);
      setSuccess("");
    }
  }

  if (error && !menu) {
    return <p>{error}</p>;
  }

  if (!menu) {
    return <p>Chargement...</p>;
  }

  const prixMenu =
    Number(menu.prix_par_personne) * Number(commande.nombre_personne || 0);

  return (
    <section className="section">
      <h1>Commander un menu</h1>

      {success && <p>{success}</p>}

      {error && <p>{error}</p>}

      <h2>{menu.titre}</h2>

      <p>{menu.description}</p>

      <p>
        <strong>{menu.prix_par_personne} € / personne</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <h3>Informations client</h3>

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

        <h3>Informations prestation</h3>

        <label htmlFor="adresse_livraison">Adresse de livraison</label>

        <input
          id="adresse_livraison"
          name="adresse_livraison"
          value={commande.adresse_livraison}
          onChange={handleChange}
          required
        />

        <label htmlFor="date_prestation">Date de prestation</label>

        <input
          id="date_prestation"
          type="date"
          name="date_prestation"
          value={commande.date_prestation}
          onChange={handleChange}
          required
        />

        <label htmlFor="heure_livraison">Heure de livraison</label>

        <input
          id="heure_livraison"
          type="time"
          name="heure_livraison"
          value={commande.heure_livraison}
          onChange={handleChange}
          required
        />

        <label htmlFor="nombre_personne">Nombre de personnes</label>

        <input
          id="nombre_personne"
          type="number"
          name="nombre_personne"
          min="1"
          value={commande.nombre_personne}
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            name="pret_materiel"
            checked={commande.pret_materiel}
            onChange={handleChange}
          />

          <span> Prêt de matériel</span>
        </label>

        <h3>Résumé</h3>

        <p>
          Prix menu estimé :<strong> {prixMenu.toFixed(2)} €</strong>
        </p>

        <button type="submit">Valider la commande</button>
      </form>
    </section>
  );
}

export default Commander;
