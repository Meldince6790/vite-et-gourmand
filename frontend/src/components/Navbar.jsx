import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();

    navigate("/");
  }

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
            to="/"
          >
            Accueil
          </NavLink>
        </li>

        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
            to="/menus"
          >
            Menus
          </NavLink>
        </li>

        {user ? (
          <>
            <li>
              <span className="navbar-link">Bonjour {user.prenom}</span>
            </li>

            {user.role_id === 1 && (
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "navbar-link active" : "navbar-link"
                  }
                  to="/mes-commandes"
                >
                  Mes commandes
                </NavLink>
              </li>
            )}

            <li>
              <button
                className="navbar-link"
                type="button"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
              to="/login"
            >
              Connexion
            </NavLink>
          </li>
        )}

        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
            to="/contact"
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
