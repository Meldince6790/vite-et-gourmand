import { useEffect, useState } from "react";

import statistiqueService from "../services/statistique.service.js";
import menuService from "../services/menu.service.js";

import ChiffreAffairesPeriodeChart from "../components/ChiffreAffairesPeriodeChart.jsx";
import ChiffreAffairesMenuChart from "../components/ChiffreAffairesMenuChart.jsx";

import "../styles/pages.css";

function AdminChiffreAffaires() {
  const [chiffreAffaires, setChiffreAffaires] = useState(null);

  const [chiffreAffairesPeriode, setChiffreAffairesPeriode] = useState([]);

  const [chiffreAffairesMenu, setChiffreAffairesMenu] = useState([]);

  const [chiffreAffairesFiltre, setChiffreAffairesFiltre] = useState([]);

  const [menus, setMenus] = useState([]);

  const [filtres, setFiltres] = useState({
    menu_id: "",
    periode_debut: "",
    periode_fin: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchChiffreAffaires() {
      try {
        const annuel = await statistiqueService.getChiffreAffairesAnnuel();

        const periode = await statistiqueService.getChiffreAffairesParPeriode();

        const menu = await statistiqueService.getChiffreAffairesParMenu();

        const menusDisponibles = await menuService.getMenus();

        setChiffreAffaires(annuel);

        setChiffreAffairesPeriode(periode);

        setChiffreAffairesMenu(menu);

        setMenus(menusDisponibles);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchChiffreAffaires();
  }, []);

  function handleChange(event) {
    setFiltres({
      ...filtres,
      [event.target.name]: event.target.value,
    });
  }

  async function rechercherChiffreAffaires() {
    try {
      const resultat =
        await statistiqueService.getChiffreAffairesFiltre(filtres);

      setChiffreAffairesFiltre(resultat);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="section">
      <h1>Chiffre d'affaires</h1>

      <p>Consultez le chiffre d'affaires généré par les menus proposés.</p>

      {error && <p className="error">{error}</p>}

      {chiffreAffaires && (
        <div className="cards">
          <div className="card">
            <h2>Chiffre d'affaires {chiffreAffaires.annee}</h2>

            <p>
              Total généré :{" "}
              <strong>
                {Number(chiffreAffaires.chiffre_affaires_total).toFixed(2)} €
              </strong>
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Calcul du chiffre d'affaires</h2>

        <div className="form-group">
          <label htmlFor="menu_id">Menu :</label>

          <select
            id="menu_id"
            name="menu_id"
            value={filtres.menu_id}
            onChange={handleChange}
          >
            <option value="">Tous les menus</option>

            {menus.map((menu) => (
              <option key={menu.menu_id} value={menu.menu_id}>
                {menu.titre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="periode_debut">Période début :</label>

          <input
            id="periode_debut"
            type="month"
            name="periode_debut"
            value={filtres.periode_debut}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="periode_fin">Période fin :</label>

          <input
            id="periode_fin"
            type="month"
            name="periode_fin"
            value={filtres.periode_fin}
            onChange={handleChange}
          />
        </div>

        <button className="button" onClick={rechercherChiffreAffaires}>
          Calculer
        </button>

        {chiffreAffairesFiltre.length > 0 && (
          <div className="cards">
            {chiffreAffairesFiltre.map((statistique) => (
              <div className="card" key={statistique.menu}>
                <h3>{statistique.menu}</h3>

                <p>
                  CA généré :{" "}
                  <strong>
                    {Number(statistique.chiffre_affaires).toFixed(2)} €
                  </strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="charts-container">
        {chiffreAffairesPeriode.length > 0 && (
          <div className="chart-wrapper">
            <ChiffreAffairesPeriodeChart
              chiffreAffaires={chiffreAffairesPeriode}
            />
          </div>
        )}

        {chiffreAffairesMenu.length > 0 && (
          <div className="chart-wrapper">
            <ChiffreAffairesMenuChart chiffreAffaires={chiffreAffairesMenu} />
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminChiffreAffaires;
