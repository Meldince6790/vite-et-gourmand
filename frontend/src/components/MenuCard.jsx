import { Link } from "react-router-dom";

function MenuCard({ id, title, description, price }) {
  return (
    <div className="card menu-card">
      <h3>{title}</h3>

      <p>{description}</p>

      <p>
        <strong>{price} € / personne</strong>
      </p>

      <Link to={`/menus/${id}`}>
        <button>Voir le menu</button>
      </Link>
    </div>
  );
}

export default MenuCard;
