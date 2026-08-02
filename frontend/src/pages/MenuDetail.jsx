import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import menuService from "../services/menu.service";
import "../styles/pages.css";

function getPhotoSrc(photo) {
  if (typeof photo === "string" && photo.trim() !== "") {
    if (photo.startsWith("data:") || photo.startsWith("http")) {
      return photo;
    }

    return `data:image/jpeg;base64,${photo}`;
  }

  return null;
}

function MenuDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

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

  function handleCommander() {
    if (!user) {
      navigate("/login");

      return;
    }

    navigate(`/commander/${id}`);
  }

  if (error) {
    return (
      <section className="section menu-detail">
        <p className="menu-detail-error">{error}</p>
      </section>
    );
  }

  if (!menu) {
    return (
      <section className="section menu-detail">
        <p>Chargement du menu...</p>
      </section>
    );
  }

  const plats = Array.isArray(menu.plats) ? menu.plats : [];
  const stockDisponible = Number(menu.quantite_restante) > 0;
  const seuilRemise = Number(menu.nombre_personne_minimum) + 5;

  return (
    <section className="section menu-detail">
      <h1>{menu.titre}</h1>

      <p className="menu-detail-description">{menu.description}</p>

      <div className="menu-detail-meta">
        <p>
          <strong>Thème :</strong> {menu.theme}
        </p>
        <p>
          <strong>Régime :</strong> {menu.regime}
        </p>
        <p>
          <strong>Prix :</strong> {menu.prix_par_personne} € / personne
        </p>
        <p>
          <strong>Minimum de personnes :</strong>{" "}
          {menu.nombre_personne_minimum}
        </p>
        <p>
          <strong>Quantité restante :</strong>{" "}
          {stockDisponible ? (
            <>{menu.quantite_restante} commande(s) disponible(s)</>
          ) : (
            <span className="menu-detail-stock-empty">
              Indisponible pour le moment (stock épuisé)
            </span>
          )}
        </p>
      </div>

      <div className="menu-detail-conditions">
        <h2>Conditions</h2>
        <p>
          {menu.conditions && String(menu.conditions).trim() !== ""
            ? menu.conditions
            : "Aucune condition particulière renseignée."}
        </p>
        <p className="menu-detail-remise">
          Remise de 10 % sur le prix du menu à partir de {seuilRemise}{" "}
          personnes.
        </p>
      </div>

      <div className="menu-detail-plats">
        <h2>Composition du menu</h2>

        {plats.length === 0 ? (
          <p>Aucun plat n’est associé à ce menu pour le moment.</p>
        ) : (
          <ul className="menu-detail-plat-list">
            {plats.map((plat) => {
              const photoSrc = getPhotoSrc(plat.photo);
              const allergenes = Array.isArray(plat.allergenes)
                ? plat.allergenes
                : [];

              return (
                <li key={plat.plat_id} className="menu-detail-plat">
                  <div
                    className="menu-detail-plat-photo"
                    aria-hidden={photoSrc ? undefined : true}
                  >
                    {photoSrc ? (
                      <img src={photoSrc} alt="" />
                    ) : (
                      <div className="menu-detail-plat-placeholder">
                        Photo non disponible
                      </div>
                    )}
                  </div>

                  <div className="menu-detail-plat-content">
                    <h3>{plat.titre_plat}</h3>

                    <p>
                      <strong>Allergènes :</strong>{" "}
                      {allergenes.length > 0
                        ? allergenes.map((a) => a.libelle).join(", ")
                        : "Aucun allergène renseigné"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button
        type="button"
        className="button menu-detail-commander"
        onClick={handleCommander}
      >
        Commander
      </button>
    </section>
  );
}

export default MenuDetail;
