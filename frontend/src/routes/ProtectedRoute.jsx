import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token");
  const isGuest = sessionStorage.getItem("guest") === "true";
  const location = useLocation();

  // ❌ Not logged in and not guest
  if (!token && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Guest restrictions
  if (isGuest && location.pathname !== "/scan") {
    return <Navigate to="/scan" replace />;
  }

  return children;
}
