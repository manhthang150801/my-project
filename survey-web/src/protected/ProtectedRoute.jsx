import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const storedRoles = localStorage.getItem("roles");
  const roles = storedRoles ? JSON.parse(storedRoles) : [];

  if (!token || !roles.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }


  return children;
};

export default ProtectedRoute;

