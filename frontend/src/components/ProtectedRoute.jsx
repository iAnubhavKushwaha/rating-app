import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  console.log("ProtectedRoute user:", user, "Roles required:", roles);

  if (!user) {
    console.warn("No user, redirecting to /login");
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    console.warn("User role not allowed:", user.role);
    return <Navigate to="/" />;
  }

  return children;
};
