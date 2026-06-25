import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [languages, setLanguages] = useState([]);
  const [text, setText] = useState("Hello world");
  const [targetLang, setTargetLang] = useState("es");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="app">
      <header className="hero">
        <h1>
          <span className="logo">🌐 PolyLingo</span>
          <span className="badge">AI</span>
        </h1>
        <p className="tagline">Translate anything into any language, instantly.</p>
      </header>

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
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={loading || !text.trim()}>
            {loading ? "Translating…" : "Translate"}
          </button>
        </div>
      </form>

      {error && <div className="alert error">{error}</div>}

      {result && (
        <div className="card result">
          <div className="result-head">
            <span className="result-lang">{result.targetLanguage}</span>
            <span className="result-provider">via {result.provider}</span>
          </div>
          <p className="result-text">{result.translation}</p>
        </div>
      )}
    </div>
  );
}
