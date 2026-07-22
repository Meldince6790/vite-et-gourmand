import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import "../styles/navbar.css";

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();

    navigate("/");
  }

  return (
    <div className="user-menu">
      <button className="user-menu-button" type="button">
        Bonjour {user.prenom} ▼
      </button>

      <div className="user-menu-dropdown">
        {user.role_id === 1 && (
          <>
            <NavLink className="user-menu-link" to="/espace-client">
              Mon espace client
            </NavLink>

            <NavLink className="user-menu-link" to="/mes-commandes">
              Mes commandes
            </NavLink>
          </>
        )}

        {user.role_id === 2 && (
          <NavLink className="user-menu-link" to="/espace-employe">
            Espace employé
          </NavLink>
        )}

        {user.role_id === 3 && (
          <NavLink className="user-menu-link" to="/espace-admin">
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
