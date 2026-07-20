import MenuCard from "../components/MenuCard.jsx";
import "../styles/pages.css";

function Menus() {
  const menus = [
    {
      title: "Menu Classique",
      description: "Une sélection équilibrée pour tous vos événements.",
      price: 25,
    },
    {
      title: "Menu Prestige",
      description: "Une expérience gastronomique raffinée.",
      price: 45,
    },
    {
      title: "Menu Mariage",
      description: "Un menu pensé pour vos grandes occasions.",
      price: 60,
    },
  ];

  return (
    <div>
      <section className="section">
        <h1>Nos menus</h1>

        <p>Découvrez nos propositions adaptées à vos événements.</p>

        <div className="menu-grid">
          {menus.map((menu) => (
            <MenuCard
              key={menu.title}
              title={menu.title}
              description={menu.description}
              price={menu.price}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Menus;
