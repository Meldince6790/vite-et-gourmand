import { useEffect, useId, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import "../styles/navbar.css";

function UserMenu({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleLogout() {
    setIsOpen(false);
    onNavigate?.();
    logout();
    navigate("/");
  }

  function handleLinkClick() {
    setIsOpen(false);
    onNavigate?.();
  }

  function toggleMenu() {
    setIsOpen((ouvert) => !ouvert);
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu-button"
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={toggleMenu}
      >
        Bonjour {user.prenom} ▼
      </button>

      <div
        id={menuId}
        className={`user-menu-dropdown${isOpen ? " is-open" : ""}`}
        hidden={!isOpen}
      >
        {user.role_id === 1 && (
          <>
            <NavLink
              className="user-menu-link"
              to="/espace-client"
              onClick={handleLinkClick}
            >
              Mon espace client
            </NavLink>

            <NavLink
              className="user-menu-link"
              to="/mes-commandes"
              onClick={handleLinkClick}
            >
              Mes commandes
            </NavLink>
          </>
        )}

        {user.role_id === 2 && (
          <NavLink
            className="user-menu-link"
            to="/espace-employe"
            onClick={handleLinkClick}
          >
            Espace employé
          </NavLink>
        )}

        {user.role_id === 3 && (
          <NavLink
            className="user-menu-link"
            to="/espace-admin"
            onClick={handleLinkClick}
          >
            Administration
          </NavLink>
        )}

        <button className="user-menu-link" type="button" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default UserMenu;
