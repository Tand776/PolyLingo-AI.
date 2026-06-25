import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../auth/AuthContext.jsx";
import { validateEmail, friendlyAuthError } from "../auth/validation.js";
import AuthLayout from "../components/AuthLayout.jsx";
import FormField from "../components/FormField.jsx";
import SocialAuth from "../components/SocialAuth.jsx";
import Spinner from "../components/Spinner.jsx";

export default function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    const e = validateEmail(email);
    if (e) next.email = e;
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate("/");
    } catch (err) {
      setFormError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue translating"
      footer={
        <span>
          New here? <Link to="/register">Create an account</Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          autoComplete="current-password"
          placeholder="Your password"
        />

        <div className="form-row-end">
          <Link to="/forgot-password" className="text-link">Forgot password?</Link>
        </div>

        <AnimatePresence>
          {formError && (
            <motion.div
              className="alert error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {formError}
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? <Spinner label="Signing in…" /> : "Sign in"}
        </button>
      </form>

      <SocialAuth onError={setFormError} />
    </AuthLayout>
  );
}
