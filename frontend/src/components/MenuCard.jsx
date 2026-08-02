import { Link } from "react-router-dom";

function MenuCard({
  id,
  title,
  description,
  price,
  theme,
  regime,
  minPersonnes,
  quantiteRestante,
  imageSrc,
}) {
  const stockDisponible = Number(quantiteRestante) > 0;
  const hasImage = typeof imageSrc === "string" && imageSrc.trim() !== "";

  return (
    <article className="card menu-card">
      <h3 className="menu-card-title">{title}</h3>

      <div className="menu-card-tags">
        <p>
          <strong>Thème :</strong> {theme}
        </p>
        <p>
          <strong>Régime :</strong> {regime}
        </p>
      </div>

      <div className="menu-card-photo" aria-hidden={hasImage ? undefined : true}>
        {hasImage ? (
          <img
            src={imageSrc}
            alt={`Illustration du menu ${title}`}
            loading="lazy"
            width="1200"
            height="750"
          />
        ) : (
          <div className="menu-card-placeholder">Photo non disponible</div>
        )}
      </div>

      <p className="menu-card-description">{description}</p>

      <div className="menu-card-metrics">
        <span className="menu-card-min">
          <span className="menu-card-min-full">
            Minimum : {minPersonnes} personne
            {Number(minPersonnes) > 1 ? "s" : ""}
          </span>
          <span className="menu-card-min-short">Min. {minPersonnes} pers</span>
        </span>
        <span className="menu-card-price">
          <span className="menu-card-price-full">{price} € / personne</span>
          <span className="menu-card-price-short">{price}€/pers</span>
        </span>
      </div>

      <p className={`menu-card-stock${stockDisponible ? "" : " is-empty"}`}>
        {stockDisponible ? (
          <>Stock disponible : {quantiteRestante} commande(s)</>
        ) : (
          <span className="menu-card-stock-empty">
            Indisponible (stock épuisé)
          </span>
        )}
      </p>

      <Link className="menu-card-link" to={`/menus/${id}`}>
        Voir le détail
      </Link>
    </article>
  );
}

export default MenuCard;
