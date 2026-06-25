import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Spinner from "../components/Spinner.jsx";

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="auth-loading">
        <Spinner size={28} label="Loading…" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
