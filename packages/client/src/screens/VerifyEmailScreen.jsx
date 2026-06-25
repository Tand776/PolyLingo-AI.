import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import Spinner from "../components/Spinner.jsx";

export default function VerifyEmailScreen() {
  const { user, resendVerification, reloadUser, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(null);

  async function handleResend() {
    setBusy("resend");
    setStatus(null);
    try {
      await resendVerification();
      setStatus({ type: "ok", msg: "Verification email sent." });
    } catch {
      setStatus({ type: "err", msg: "Could not send email. Try again shortly." });
    } finally {
      setBusy(null);
    }
  }

  async function handleRefresh() {
    setBusy("refresh");
    setStatus(null);
    await reloadUser();
    if (user?.emailVerified) {
      navigate("/");
    } else {
      setStatus({ type: "err", msg: "Not verified yet. Check your inbox." });
    }
    setBusy(null);
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We sent a verification link to ${user?.email || "your inbox"}`}
      footer={
        <button type="button" className="text-link as-button" onClick={logout}>
          Sign out
        </button>
      }
    >
      <motion.div
        className="verify-illustration"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
      >
        ✉️
      </motion.div>

      <p className="verify-help">
        Click the link in the email to activate your account, then come back and refresh.
      </p>

      {status && <div className={`alert ${status.type === "ok" ? "success" : "error"}`}>{status.msg}</div>}

      <button type="button" className="primary-btn" onClick={handleRefresh} disabled={!!busy}>
        {busy === "refresh" ? <Spinner label="Checking…" /> : "I've verified — continue"}
      </button>
      <button type="button" className="secondary-btn" onClick={handleResend} disabled={!!busy}>
        {busy === "resend" ? <Spinner label="Sending…" /> : "Resend email"}
      </button>
    </AuthLayout>
  );
}
