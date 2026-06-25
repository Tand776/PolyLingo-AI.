import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../auth/AuthContext.jsx";
import {
  validateEmail,
  validatePassword,
  validateDisplayName,
  validateConfirmPassword,
  friendlyAuthError,
} from "../auth/validation.js";
import AuthLayout from "../components/AuthLayout.jsx";
import FormField from "../components/FormField.jsx";
import SocialAuth from "../components/SocialAuth.jsx";
import Spinner from "../components/Spinner.jsx";

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  function validate() {
    const next = {
      displayName: validateDisplayName(form.displayName),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: validateConfirmPassword(form.password, form.confirm),
    };
    Object.keys(next).forEach((k) => next[k] == null && delete next[k]);
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        displayName: form.displayName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/verify-email");
    } catch (err) {
      setFormError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join PolyLingo-AI in seconds"
      footer={
        <span>
          Already have an account? <Link to="/login">Sign in</Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="displayName"
          label="Name"
          value={form.displayName}
          onChange={set("displayName")}
          error={errors.displayName}
          autoComplete="name"
          placeholder="Ada Lovelace"
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
        <FormField
          id="confirm"
          label="Confirm password"
          type="password"
          value={form.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
          autoComplete="new-password"
          placeholder="Re-enter your password"
        />

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
          {loading ? <Spinner label="Creating account…" /> : "Create account"}
        </button>
      </form>

      <SocialAuth onError={setFormError} />
    </AuthLayout>
  );
}
