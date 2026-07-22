import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const roleAutorise =
      allowedRoles.includes(user.role_id) ||
      (user.role_id === 3 && allowedRoles.includes(2));

    if (!roleAutorise) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
