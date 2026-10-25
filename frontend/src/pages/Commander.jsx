import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import commandeService from "../services/commande.service";
import livraisonService from "../services/livraison.service";
import menuService from "../services/menu.service";
import "../styles/pages.css";

function Commander() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");
  const [estimating, setEstimating] = useState(false);
  const [livraisonError, setLivraisonError] = useState("");
  const [livraisonEstimate, setLivraisonEstimate] = useState(null);
  const [estimatedAddress, setEstimatedAddress] = useState("");

  const [commande, setCommande] = useState({
    adresse_livraison: "",
    date_prestation: "",
    heure_livraison: "",
    nombre_personne: 1,
    pret_materiel: false,
    informations_complementaires: "",
  });

  useEffect(() => {
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
  }, [id]);

  function invalidateLivraisonEstimate() {
    setLivraisonEstimate(null);
    setEstimatedAddress("");
    setLivraisonError("");
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    if (name === "adresse_livraison") {
      invalidateLivraisonEstimate();
    }

    setCommande({
      ...commande,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleEstimerLivraison() {
    const adresse = commande.adresse_livraison.trim();
    setLivraisonError("");
    setError("");

    if (!adresse) {
      setLivraisonError("L'adresse de livraison est obligatoire.");
      return;
    }

    setEstimating(true);

    try {
      const estimate = await livraisonService.estimerLivraison(adresse);
      setLivraisonEstimate(estimate);
      setEstimatedAddress(adresse);
    } catch (estimationError) {
      setLivraisonEstimate(null);
      setEstimatedAddress("");
      setLivraisonError(estimationError.message);
    } finally {
      setEstimating(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const adresse = commande.adresse_livraison.trim();
    const estimationValide =
      livraisonEstimate && estimatedAddress === adresse && !livraisonError;

    if (!estimationValide) {
      setError(
        "Calculez les frais de livraison pour l'adresse actuelle avant de valider.",
      );
      return;
    }

    try {
      const nouvelleCommande = {
        ...commande,
        adresse_livraison: adresse,
        utilisateur_id: user.utilisateur_id,
        menu_id: id,
      };

      delete nouvelleCommande.distance_km;
      delete nouvelleCommande.prix_livraison;

      await commandeService.createCommande(nouvelleCommande);

      navigate("/mes-commandes", { replace: true });
    } catch (submitError) {
      console.error("Erreur lors de la création de la commande :", submitError);

      setError(submitError.message);
    }
  }

  if (error && !menu) {
    return (
      <section className="section commander">
        <p className="commander-error">{error}</p>
      </section>
    );
  }

  if (!menu) {
    return (
      <section className="section commander">
        <p>Chargement...</p>
      </section>
    );
  }

  const nb = Number(commande.nombre_personne) || 0;
  const prixParPersonne = Number(menu.prix_par_personne);
  const minimum = Number(menu.nombre_personne_minimum);
  const prixBrut = prixParPersonne * nb;
  const remiseApplicable = nb >= minimum + 5;
  const prixMenu = Number(
    (remiseApplicable ? prixBrut * 0.9 : prixBrut).toFixed(2),
  );
  const adresseCourante = commande.adresse_livraison.trim();
  const estimationValide =
    Boolean(livraisonEstimate) &&
    estimatedAddress === adresseCourante &&
    !livraisonError;
  const adresseGuidance = !adresseCourante
    ? "Veuillez renseigner une adresse de livraison."
    : !estimationValide && !livraisonError && !estimating
      ? "Veuillez calculer les frais de livraison avant de valider la commande."
      : "";
  const prixLivraison = estimationValide
    ? Number(livraisonEstimate.prix_livraison)
    : null;
  const distanceKm = estimationValide
    ? Number(livraisonEstimate.distance_km)
    : null;
  const total =
    prixLivraison == null
      ? null
      : Number((prixMenu + prixLivraison).toFixed(2));
  const stockDisponible = Number(menu.quantite_restante) > 0;
  const clientLabel = [user?.prenom, user?.nom].filter(Boolean).join(" ");

  return (
    <section className="section commander">
      <header className="commander-header">
        <h1 className="commander-title">Commander un menu</h1>
        <p className="commander-intro">
          Complétez les informations ci-dessous afin de finaliser votre
          commande.
        </p>
      </header>

      {error ? <p className="commander-error" role="alert">{error}</p> : null}

      {!stockDisponible ? (
        <p className="commander-stock-empty">
          Indisponible pour le moment (stock épuisé). La validation sera refusée
          par le serveur.
        </p>
      ) : null}

      <form className="commander-form" onSubmit={handleSubmit}>
        <div className="commander-layout">
          <div className="commander-main">
            <article className="card commander-menu-card">
              <h2 className="commander-card-label">Menu sélectionné</h2>
              <h3 className="commander-menu-title">{menu.titre}</h3>
              <p className="commander-menu-summary">{menu.description}</p>
              <p className="commander-menu-meta">
                Min. {menu.nombre_personne_minimum} pers.
                {" — "}
                Prix unitaire : {menu.prix_par_personne} €
              </p>
            </article>

            <article className="card commander-fields-card">
              <h2 className="commander-card-label">
                Informations de commande
                {clientLabel ? ` pour ${clientLabel}` : ""}
              </h2>

              <div className="commander-client">
                <h3 className="commander-subsection-title">
                  Informations client
                </h3>
                <dl className="commander-client-list">
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
                    <dd>{user.telephone}</dd>
                  </div>
                </dl>
              </div>

              <div className="commander-fields form">
                <label htmlFor="date_prestation">
                  Date de prestation <span aria-hidden="true">*</span>
                  <input
                    id="date_prestation"
                    type="date"
                    name="date_prestation"
                    value={commande.date_prestation}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label htmlFor="heure_livraison">
                  Heure de livraison <span aria-hidden="true">*</span>
                  <input
                    id="heure_livraison"
                    type="time"
                    name="heure_livraison"
                    value={commande.heure_livraison}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label htmlFor="nombre_personne">
                  Nombre de personnes <span aria-hidden="true">*</span>
                  <input
                    id="nombre_personne"
                    type="number"
                    name="nombre_personne"
                    min="1"
                    value={commande.nombre_personne}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label
                  className="commander-checkbox-label"
                  htmlFor="pret_materiel"
                >
                  Prêt de matériel
                  <span className="commander-checkbox-control">
                    <input
                      id="pret_materiel"
                      type="checkbox"
                      name="pret_materiel"
                      checked={commande.pret_materiel}
                      onChange={handleChange}
                    />
                    <span className="commander-checkbox-text">
                      {commande.pret_materiel ? "Oui" : "Non"}
                    </span>
                  </span>
                </label>

                <label
                  className="commander-field-full"
                  htmlFor="adresse_livraison"
                >
                  Adresse de livraison <span aria-hidden="true">*</span>
                  <input
                    id="adresse_livraison"
                    name="adresse_livraison"
                    value={commande.adresse_livraison}
                    onChange={handleChange}
                    placeholder="Ex. 12 rue Sainte-Catherine, 33000 Bordeaux"
                    maxLength={255}
                    required
                  />
                  <span className="commander-field-help">
                    Indiquez le numéro, la rue, le code postal et la ville.
                  </span>
                  {adresseGuidance ? (
                    <p className="commander-livraison-error" role="status">
                      {adresseGuidance}
                    </p>
                  ) : null}
                </label>

                <div className="commander-field-full commander-livraison-actions">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={handleEstimerLivraison}
                    disabled={estimating || !adresseCourante}
                  >
                    {estimating
                      ? "Calcul en cours…"
                      : "Calculer les frais de livraison"}
                  </button>
                  {livraisonError ? (
                    <p className="commander-livraison-error" role="alert">
                      {livraisonError}
                    </p>
                  ) : null}
                </div>

                <label
                  className="commander-field-full"
                  htmlFor="informations_complementaires"
                >
                  Informations complémentaires
                  <textarea
                    id="informations_complementaires"
                    name="informations_complementaires"
                    value={commande.informations_complementaires}
                    onChange={handleChange}
                    maxLength={500}
                    rows={4}
                  />
                  <span className="commander-field-help">
                    Précisez ici toute information utile concernant la
                    prestation ou la livraison.
                  </span>
                </label>
              </div>
            </article>
          </div>

          <aside className="card commander-recap-card">
            <h2 className="commander-recap-title">Récapitulatif</h2>

            <p className="commande-recap-note">
              Estimation indicative. Le montant définitif est recalculé par le
              serveur à la validation.
            </p>

            <ul className="commande-recap">
              <li>
                <span>Menu sélectionné</span>
                <strong>{menu.titre}</strong>
              </li>
              <li>
                <span>Prix par personne</span>
                <strong>{prixParPersonne.toFixed(2)} €</strong>
              </li>
              <li>
                <span>Nombre de personnes</span>
                <strong>{nb}</strong>
              </li>
              {remiseApplicable ? (
                <li>
                  <span>Remise</span>
                  <strong>−10 %</strong>
                </li>
              ) : null}
              <li>
                <span>Prix du menu</span>
                <strong>{prixMenu.toFixed(2)} €</strong>
              </li>
              <li>
                <span>Distance</span>
                <strong>
                  {estimationValide ? `${distanceKm.toFixed(2)} km` : "—"}
                </strong>
              </li>
              <li>
                <span>Livraison</span>
                <strong>
                  {estimationValide
                    ? livraisonEstimate.livraison_gratuite
                      ? "0,00 € (Bordeaux)"
                      : `${prixLivraison.toFixed(2)} €`
                    : "À calculer"}
                </strong>
              </li>
              <li className="commande-recap-total">
                <span>Total</span>
                <strong>
                  {total == null ? "—" : `${total.toFixed(2)} €`}
                </strong>
              </li>
            </ul>

            <button
              type="submit"
              className="button commander-submit"
              disabled={!estimationValide || estimating}
            >
              Valider la commande
            </button>
          </aside>
        </div>
      </form>
    </section>
  );
}

export default Commander;
