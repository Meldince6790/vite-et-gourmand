import { useEffect, useState } from "react";

import menuService from "../services/menu.service.js";
import platService from "../services/plat.service.js";
import regimeService from "../services/regime.service.js";
import themeService from "../services/theme.service.js";

import "../styles/pages.css";

const menuInitial = {
  titre: "",
  description: "",
  photo: "",
  conditions: "",
  nombre_personne_minimum: "",
  prix_par_personne: "",
  quantite_restante: "",
  regime_id: "",
  theme_id: "",
};

function EmployeeMenus() {
  const [menus, setMenus] = useState([]);
  const [plats, setPlats] = useState([]);
  const [regimes, setRegimes] = useState([]);
  const [themes, setThemes] = useState([]);

  const [menuFormulaire, setMenuFormulaire] = useState({
    ...menuInitial,
  });

  const [menuEdition, setMenuEdition] = useState(null);

  const [platsMenus, setPlatsMenus] = useState({});
  const [platSelection, setPlatSelection] = useState({});

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function chargerAssociationsMenus(menusData) {
    const associations = {};

    for (const menu of menusData) {
      const platsMenu = await menuService.getPlatsByMenuId(menu.menu_id);

      associations[menu.menu_id] = platsMenu;
    }

    setPlatsMenus(associations);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [menusData, platsData, regimesData, themesData] =
          await Promise.all([
            menuService.getAllMenus(),
            platService.getAllPlats(),
            regimeService.getRegimes(),
            themeService.getThemes(),
          ]);

        setMenus(menusData);
        setPlats(platsData);
        setRegimes(regimesData);
        setThemes(themesData);

        await chargerAssociationsMenus(menusData);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setMenuFormulaire((ancien) => ({
      ...ancien,
      [name]: value,
    }));
  }

  async function refreshMenus() {
    const data = await menuService.getAllMenus();

    setMenus(data);

    await chargerAssociationsMenus(data);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (menuEdition) {
        await menuService.updateMenu(menuEdition.menu_id, menuFormulaire);

        setMessage("Menu modifié avec succès.");
      } else {
        await menuService.createMenu(menuFormulaire);

        setMessage("Menu créé avec succès.");
      }

      setMenuFormulaire({
        ...menuInitial,
      });

      setMenuEdition(null);

      await refreshMenus();
    } catch (error) {
      setError(error.message);
    }
  }

  function handleModifier(menu) {
    setMenuEdition(menu);

    setMenuFormulaire({
      titre: menu.titre,
      description: menu.description || "",
      photo: menu.photo || "",
      conditions: menu.conditions || "",
      nombre_personne_minimum: menu.nombre_personne_minimum,
      prix_par_personne: menu.prix_par_personne,
      quantite_restante: menu.quantite_restante,
      regime_id: menu.regime_id,
      theme_id: menu.theme_id,
    });
  }

  async function handleSupprimer(id) {
    try {
      await menuService.deleteMenu(id);

      setMessage("Menu supprimé avec succès.");

      await refreshMenus();
    } catch (error) {
      setError(error.message);
    }
  }

  function handlePlatChange(menuId, platId) {
    setPlatSelection((ancien) => ({
      ...ancien,
      [menuId]: platId,
    }));
  }

  async function handleAjouterPlat(menuId) {
    try {
      await menuService.addPlatToMenu(menuId, platSelection[menuId]);

      setMessage("Plat ajouté au menu.");

      await refreshMenus();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleRetirerPlat(menuId, platId) {
    try {
      await menuService.removePlatFromMenu(menuId, platId);

      setMessage("Plat retiré du menu.");

      await refreshMenus();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="section">
      <h1>Gestion des menus</h1>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <form className="form form-employe" onSubmit={handleSubmit}>
        <h2>{menuEdition ? "Modifier un menu" : "Créer un menu"}</h2>

        <label>
          <span>Titre :</span>
          <input
            type="text"
            name="titre"
            value={menuFormulaire.titre}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Description :</span>
          <textarea
            name="description"
            value={menuFormulaire.description}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Conditions :</span>
          <textarea
            name="conditions"
            value={menuFormulaire.conditions}
            onChange={handleChange}
            placeholder="Ex : commander 7 jours avant, conserver au frais..."
          />
        </label>

        <label>
          <span>Photo :</span>
          <input
            type="text"
            name="photo"
            value={menuFormulaire.photo}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Nombre minimum :</span>
          <input
            type="number"
            name="nombre_personne_minimum"
            value={menuFormulaire.nombre_personne_minimum}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Prix par personne :</span>
          <input
            type="number"
            name="prix_par_personne"
            value={menuFormulaire.prix_par_personne}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Stock disponible :</span>
          <input
            type="number"
            name="quantite_restante"
            value={menuFormulaire.quantite_restante}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Régime :</span>
          <select
            name="regime_id"
            value={menuFormulaire.regime_id}
            onChange={handleChange}
          >
            <option value="">Choisir</option>

            {regimes.map((regime) => (
              <option key={regime.regime_id} value={regime.regime_id}>
                {regime.libelle}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Thème :</span>
          <select
            name="theme_id"
            value={menuFormulaire.theme_id}
            onChange={handleChange}
          >
            <option value="">Choisir</option>

            {themes.map((theme) => (
              <option key={theme.theme_id} value={theme.theme_id}>
                {theme.libelle}
              </option>
            ))}
          </select>
        </label>

        <button className="button button-compact" type="submit">
          {menuEdition ? "Modifier" : "Créer"}
        </button>
      </form>

      <h2>Menus existants</h2>

      <div className="cards">
        {menus.map((menu) => (
          <div className="card" key={menu.menu_id}>
            <h3>{menu.titre}</h3>

            <p>{menu.description}</p>

            {menu.conditions && (
              <p>
                <strong>Conditions :</strong> {menu.conditions}
              </p>
            )}

            <p>Régime : {menu.regime}</p>

            <p>Thème : {menu.theme}</p>

            <p>Prix : {menu.prix_par_personne} €</p>

            <p>
              Stock disponible : <strong>{menu.quantite_restante}</strong>
            </p>

            <h4>Plats :</h4>

            {platsMenus[menu.menu_id]?.map((plat) => (
              <p className="inline-action-row" key={plat.plat_id}>
                <span>{plat.titre_plat}</span>

                <button
                  className="button button-compact"
                  type="button"
                  onClick={() => handleRetirerPlat(menu.menu_id, plat.plat_id)}
                >
                  Retirer
                </button>
              </p>
            ))}

            <select
              value={platSelection[menu.menu_id] || ""}
              onChange={(event) =>
                handlePlatChange(menu.menu_id, event.target.value)
              }
            >
              <option value="">Ajouter un plat</option>

              {plats.map((plat) => (
                <option key={plat.plat_id} value={plat.plat_id}>
                  {plat.titre_plat}
                </option>
              ))}
            </select>

            <div className="card-actions">
              <button
                className="button button-compact"
                type="button"
                onClick={() => handleAjouterPlat(menu.menu_id)}
              >
                Ajouter
              </button>

              <button
                className="button button-compact"
                type="button"
                onClick={() => handleModifier(menu)}
              >
                Modifier
              </button>

              <button
                className="button button-compact"
                type="button"
                onClick={() => handleSupprimer(menu.menu_id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EmployeeMenus;
