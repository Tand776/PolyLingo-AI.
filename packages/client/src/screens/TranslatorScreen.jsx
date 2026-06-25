import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../auth/AuthContext.jsx";
import { friendlyAuthError } from "../auth/validation.js";
import Spinner from "../components/Spinner.jsx";

export default function TranslatorScreen() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [languages, setLanguages] = useState([]);
  const [text, setText] = useState("Hello world");
  const [targetLang, setTargetLang] = useState("es");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/languages")
      .then((r) => r.json())
      .then((d) => setLanguages(d.languages ?? []))
      .catch(() => setError("Could not load languages"));
  }, []);

  async function handleTranslate(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Translation failed");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteAccount();
      navigate("/login");
    } catch (err) {
      setError(friendlyAuthError(err));
      setDeleting(false);
    }
  }

  const displayName = user?.isAnonymous
    ? "Guest"
    : user?.displayName || user?.email || "You";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="logo">🌐 PolyLingo</span>
          <span className="badge">AI</span>
        </div>

        <div className="account">
          <button
            className="avatar-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <span className="avatar">{initial}</span>
            <span className="account-name">{displayName}</span>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="account-menu"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
              >
                <div className="account-info">
                  <strong>{displayName}</strong>
                  {user?.email && <span>{user.email}</span>}
                  <span className="provider-tag">
                    {user?.isAnonymous ? "guest session" : "signed in"}
                  </span>
                </div>
                <button className="menu-item" onClick={logout}>Sign out</button>
                <button
                  className="menu-item danger"
                  onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}
                >
                  Delete account
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {user && !user.isAnonymous && !user.emailVerified && (
        <div className="banner warn">
          Your email isn't verified.{" "}
          <button className="text-link as-button" onClick={() => navigate("/verify-email")}>
            Verify now
          </button>
        </div>
      )}

      {user?.isAnonymous && (
        <div className="banner info">
          You're browsing as a guest.{" "}
          <button className="text-link as-button" onClick={() => navigate("/register")}>
            Create an account
          </button>{" "}
          to save your work.
        </div>
      )}

      <main className="translator">
        <p className="tagline">Translate anything into any language, instantly.</p>

        <form className="card" onSubmit={handleTranslate}>
          <label className="field">
            <span>Text to translate</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Type something…"
            />
          </label>

          <div className="row">
            <label className="field grow">
              <span>Target language</span>
              <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="primary-btn translate-btn" disabled={loading || !text.trim()}>
              {loading ? <Spinner label="Translating…" /> : "Translate"}
            </button>
          </div>
        </form>

        {error && <div className="alert error">{error}</div>}

        <AnimatePresence>
          {result && (
            <motion.div
              className="card result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="result-head">
                <span className="result-lang">{result.targetLanguage}</span>
                <span className="result-provider">via {result.provider}</span>
              </div>
              <p className="result-text">{result.translation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !deleting && setConfirmDelete(false)}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Delete account?</h2>
              <p>This permanently removes your account and profile. This cannot be undone.</p>
              <div className="modal-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button className="danger-btn" onClick={handleDelete} disabled={deleting}>
                  {deleting ? <Spinner label="Deleting…" /> : "Delete forever"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
