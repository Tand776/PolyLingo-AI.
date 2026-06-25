import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { friendlyAuthError } from "../auth/validation.js";
import Spinner from "./Spinner.jsx";

export default function SocialAuth({ onError }) {
  const { loginWithGoogle, loginWithApple, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(null);

  async function run(kind, fn) {
    setBusy(kind);
    onError?.(null);
    try {
      await fn();
      navigate("/");
    } catch (err) {
      onError?.(friendlyAuthError(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="social-auth">
      <div className="divider"><span>or continue with</span></div>

      <div className="social-buttons">
        <button
          type="button"
          className="social-btn google"
          disabled={!!busy}
          onClick={() => run("google", loginWithGoogle)}
        >
          {busy === "google" ? <Spinner /> : <><span className="g-icon">G</span> Google</>}
        </button>

        <button
          type="button"
          className="social-btn apple"
          disabled={!!busy}
          onClick={() => run("apple", loginWithApple)}
        >
          {busy === "apple" ? <Spinner /> : <> Apple</>}
        </button>
      </div>

      <button
        type="button"
        className="guest-btn"
        disabled={!!busy}
        onClick={() => run("guest", loginAsGuest)}
      >
        {busy === "guest" ? <Spinner label="Entering…" /> : "Continue as guest"}
      </button>
    </div>
  );
}
