import { useMemo, useState } from "react";

import { AuthContext } from "./auth.context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const utilisateur = localStorage.getItem("utilisateur");

    return utilisateur ? JSON.parse(utilisateur) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  function login(utilisateur) {
    setUser(utilisateur);
    setToken(utilisateur.token);

    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
    localStorage.setItem("token", utilisateur.token);
  }

  function updateUser(utilisateur) {
    setUser(utilisateur);

    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem("utilisateur");
    localStorage.removeItem("token");
  }

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      updateUser,
      logout,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
