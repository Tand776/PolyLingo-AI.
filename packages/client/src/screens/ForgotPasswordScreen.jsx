import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../auth/AuthContext.jsx";
import { validateEmail, friendlyAuthError } from "../auth/validation.js";
import AuthLayout from "../components/AuthLayout.jsx";
import FormField from "../components/FormField.jsx";
import Spinner from "../components/Spinner.jsx";

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    const err = validateEmail(email);
    setError(err);
    if (err) return;
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (ex) {
      setFormError(friendlyAuthError(ex));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a reset link"
      footer={<Link to="/login">Back to sign in</Link>}
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            className="success-panel"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="success-check">✓</div>
            <p>
              If an account exists for <strong>{email}</strong>, a reset link is on its way.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FormField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              error={error}
              autoComplete="email"
              placeholder="you@example.com"
            />

            {formError && <div className="alert error">{formError}</div>}

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? <Spinner label="Sending…" /> : "Send reset link"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
