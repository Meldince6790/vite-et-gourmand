import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import UserMenu from "./UserMenu.jsx";
import "../styles/navbar.css";

function Navbar() {
  const { user } = useAuth();

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

        {user ? (
          <li>
            <UserMenu />
          </li>
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
      </ul>
    </nav>
  );
}

export default Navbar;
