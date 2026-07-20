function MenuCard({ title, description, price }) {
  return (
    <div className="card menu-card">
      <h3>{title}</h3>

      <p>{description}</p>

      <p>
        <strong>{price} € / personne</strong>
      </p>

      <button>Voir le menu</button>
    </div>
  );
}

export default MenuCard;
