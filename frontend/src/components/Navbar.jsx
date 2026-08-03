import { useEffect, useId, useState } from "react";
import { NavLink } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import UserMenu from "./UserMenu.jsx";
import "../styles/navbar.css";

function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function closeMenu() {
    setIsOpen(false);
  }

  function toggleMenu() {
    setIsOpen((ouvert) => !ouvert);
  }

  return (
    <nav className={`navbar${isOpen ? " is-open" : ""}`}>
      <button
        type="button"
        className="navbar-toggle"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
        onClick={toggleMenu}
      >
        <span className="navbar-toggle-bar" aria-hidden="true" />
        <span className="navbar-toggle-bar" aria-hidden="true" />
        <span className="navbar-toggle-bar" aria-hidden="true" />
      </button>

      <ul id={menuId} className={`navbar-list${isOpen ? " is-open" : ""}`}>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
            to="/"
            onClick={closeMenu}
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
            onClick={closeMenu}
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
            onClick={closeMenu}
          >
            Contact
          </NavLink>
        </li>

        {user ? (
          <li>
            <UserMenu onNavigate={closeMenu} />
          </li>
        ) : (
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
              to="/login"
              onClick={closeMenu}
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
