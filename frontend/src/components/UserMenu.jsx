import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
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

        <button className="user-menu-link" type="button" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default UserMenu;
