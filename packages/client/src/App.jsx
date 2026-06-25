import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Spinner from "./components/Spinner.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen.jsx";
import VerifyEmailScreen from "./screens/VerifyEmailScreen.jsx";
import TranslatorScreen from "./screens/TranslatorScreen.jsx";

function PublicOnly({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) {
    return (
      <div className="auth-loading">
        <Spinner size={28} label="Loading…" />
      </div>
    );
  }
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PublicOnly><LoginScreen /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><RegisterScreen /></PublicOnly>} />
        <Route path="/forgot-password" element={<PublicOnly><ForgotPasswordScreen /></PublicOnly>} />
        <Route path="/verify-email" element={<ProtectedRoute><VerifyEmailScreen /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><TranslatorScreen /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
