import { useEffect, useState } from "react";

import menuService from "../services/menu.service";
import themeService from "../services/theme.service";
import regimeService from "../services/regime.service";
import MenuCard from "../components/MenuCard.jsx";
import { getMenuImageSrc } from "../data/menuImages.js";
import "../styles/pages.css";

const FILTRES_VIDES = {
  theme: "",
  regime: "",
  prixMaximum: "",
  nombrePersonnes: "",
};

function filtrerMenus(menus, filtres) {
  return menus.filter((menu) => {
    if (filtres.theme && menu.theme !== filtres.theme) {
      return false;
    }

    if (filtres.regime && menu.regime !== filtres.regime) {
      return false;
    }

    if (filtres.prixMaximum !== "") {
      const prixMaximum = Number(filtres.prixMaximum);

      if (
        Number.isNaN(prixMaximum) ||
        Number(menu.prix_par_personne) > prixMaximum
      ) {
        return false;
      }
    }

    if (filtres.nombrePersonnes !== "") {
      const nombrePersonnes = Number(filtres.nombrePersonnes);

      if (
        Number.isNaN(nombrePersonnes) ||
        Number(menu.nombre_personne_minimum) > nombrePersonnes
      ) {
        return false;
      }
    }

    return true;
  });
}

function Menus() {
  const [menus, setMenus] = useState([]);
  const [menusFiltres, setMenusFiltres] = useState([]);
  const [themes, setThemes] = useState([]);
  const [regimes, setRegimes] = useState([]);
  const [filtres, setFiltres] = useState(FILTRES_VIDES);
  const [error, setError] = useState("");
  const [filtresAppliques, setFiltresAppliques] = useState(false);

  useEffect(() => {
    async function loadCatalogue() {
      try {
        const [menusData, themesData, regimesData] = await Promise.all([
          menuService.getMenus(),
          themeService.getThemes(),
          regimeService.getRegimes(),
        ]);

        setMenus(menusData);
        setMenusFiltres(menusData);
        setThemes(themesData);
        setRegimes(regimesData);
      } catch (error) {
        console.error("Erreur lors du chargement du catalogue :", error);

        setError("Impossible de charger les menus.");
      }
    }

    loadCatalogue();
  }, []);

  function handleFiltreChange(event) {
    const { name, value } = event.target;

    setFiltres((precedents) => ({
      ...precedents,
      [name]: value,
    }));
  }

  function handleAppliquer(event) {
    event.preventDefault();

    setMenusFiltres(filtrerMenus(menus, filtres));
    setFiltresAppliques(true);
  }

  function handleReinitialiser() {
    setFiltres(FILTRES_VIDES);
    setMenusFiltres(menus);
    setFiltresAppliques(false);
  }

  return (
    <div className="catalogue">
      <header className="catalogue-header">
        <div className="catalogue-header-main">
          <h1 className="catalogue-title">Catalogue des menus</h1>

          {error && <p className="catalogue-error">{error}</p>}

          {!error && (
            <form className="menu-filters" onSubmit={handleAppliquer}>
              <h2>Filtres</h2>

              <div className="menu-filters-grid">
                <label htmlFor="filtre-theme">
                  Thème
                  <select
                    id="filtre-theme"
                    name="theme"
                    value={filtres.theme}
                    onChange={handleFiltreChange}
                  >
                    <option value="">Tous les thèmes</option>
                    {themes.map((theme) => (
                      <option key={theme.theme_id} value={theme.libelle}>
                        {theme.libelle}
                      </option>
                    ))}
                  </select>
                </label>

                <label htmlFor="filtre-regime">
                  Régime alimentaire
                  <select
                    id="filtre-regime"
                    name="regime"
                    value={filtres.regime}
                    onChange={handleFiltreChange}
                  >
                    <option value="">Tous les régimes</option>
                    {regimes.map((regime) => (
                      <option key={regime.regime_id} value={regime.libelle}>
                        {regime.libelle}
                      </option>
                    ))}
                  </select>
                </label>

                <label htmlFor="filtre-personnes">
                  Nb min. pers.
                  <input
                    id="filtre-personnes"
                    type="number"
                    name="nombrePersonnes"
                    min="1"
                    step="1"
                    value={filtres.nombrePersonnes}
                    onChange={handleFiltreChange}
                    placeholder="Ex. 15"
                  />
                </label>

                <label htmlFor="filtre-prix">
                  Prix maximum (€ / pers.)
                  <input
                    id="filtre-prix"
                    type="number"
                    name="prixMaximum"
                    min="0"
                    step="0.01"
                    value={filtres.prixMaximum}
                    onChange={handleFiltreChange}
                    placeholder="Ex. 40"
                  />
                </label>
              </div>

              <div className="menu-filters-actions">
                <button
                  type="button"
                  className="menu-filters-reset"
                  onClick={handleReinitialiser}
                >
                  Réinitialiser
                </button>

                <button type="submit" className="button menu-filters-apply">
                  Appliquer
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="catalogue-hero-media">
          <img
            src="/images/catalogue-hero.webp"
            alt="Buffet traiteur pour le catalogue des menus"
            width="710"
            height="210"
          />
        </div>
      </header>

      <section className="catalogue-results" aria-label="Menus disponibles">
        <h2 className="catalogue-results-title">Menus</h2>

        <div className="menu-grid">
          {menusFiltres.length > 0 ? (
            menusFiltres.map((menu) => (
              <MenuCard
                key={menu.menu_id}
                id={menu.menu_id}
                title={menu.titre}
                description={menu.description}
                price={menu.prix_par_personne}
                theme={menu.theme}
                regime={menu.regime}
                minPersonnes={menu.nombre_personne_minimum}
                quantiteRestante={menu.quantite_restante}
                imageSrc={getMenuImageSrc(menu.menu_id)}
              />
            ))
          ) : (
            <p className="menu-filters-empty">
              {filtresAppliques
                ? "Aucun menu ne correspond à vos critères."
                : "Aucun menu disponible pour le moment."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Menus;
