import express from "express";
import cors from "cors";
import { LANGUAGES } from "./languages.js";
import { translate, TranslationError } from "./translate.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", provider: process.env.OPENAI_API_KEY ? "openai" : "mock" });
  });

  app.get("/api/languages", (_req, res) => {
    res.json({ languages: LANGUAGES });
  });

  app.post("/api/translate", async (req, res) => {
    const { text, targetLang } = req.body ?? {};
    try {
      const result = await translate(text, targetLang);
      res.json(result);
    } catch (err) {
      if (err instanceof TranslationError) {
        res.status(err.status).json({ error: err.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  return app;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const port = process.env.PORT || 3001;
  createApp().listen(port, () => {
    console.log(`PolyLingo-AI server listening on http://localhost:${port}`);
  });
}
