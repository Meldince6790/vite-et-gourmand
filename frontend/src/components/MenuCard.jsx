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
}) {
  const stockDisponible = Number(quantiteRestante) > 0;

  return (
    <div className="card menu-card">
      <div className="menu-card-photo" aria-hidden="true">
        <div className="menu-card-placeholder">Photo non disponible</div>
      </div>

      <h3>{title}</h3>

      <p className="menu-card-description">{description}</p>

      <p>
        <strong>Thème :</strong> {theme}
      </p>

      <p>
        <strong>Régime :</strong> {regime}
      </p>

      <p>
        <strong>Minimum :</strong> {minPersonnes} personne(s)
      </p>

      <p>
        <strong>{price} € / personne</strong>
      </p>

      <p>
        <strong>Stock :</strong>{" "}
        {stockDisponible ? (
          <>{quantiteRestante} commande(s) disponible(s)</>
        ) : (
          <span className="menu-card-stock-empty">
            Indisponible (stock épuisé)
          </span>
        )}
      </p>

      <Link to={`/menus/${id}`}>
        <button type="button">Voir le menu</button>
      </Link>
    </div>
  );
}

export default MenuCard;
