import { languageName, LANGUAGE_CODES } from "./languages.js";

// A small offline phrase dictionary so the app works end-to-end without any
// external API key. Keys are lowercase English phrases.
const PHRASEBOOK = {
  "hello world": {
    es: "Hola mundo",
    fr: "Bonjour le monde",
    de: "Hallo Welt",
    it: "Ciao mondo",
    pt: "Olá mundo",
    ja: "ハロー・ワールド",
    zh: "你好，世界",
  },
  hello: {
    es: "Hola",
    fr: "Bonjour",
    de: "Hallo",
    it: "Ciao",
    pt: "Olá",
    ja: "こんにちは",
    zh: "你好",
  },
  "good morning": {
    es: "Buenos días",
    fr: "Bonjour",
    de: "Guten Morgen",
    it: "Buongiorno",
    pt: "Bom dia",
    ja: "おはようございます",
    zh: "早上好",
  },
  "thank you": {
    es: "Gracias",
    fr: "Merci",
    de: "Danke",
    it: "Grazie",
    pt: "Obrigado",
    ja: "ありがとう",
    zh: "谢谢",
  },
  goodbye: {
    es: "Adiós",
    fr: "Au revoir",
    de: "Auf Wiedersehen",
    it: "Arrivederci",
    pt: "Adeus",
    ja: "さようなら",
    zh: "再见",
  },
};

export class TranslationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "TranslationError";
    this.status = status;
  }
}

function validate(text, targetLang) {
  if (typeof text !== "string" || text.trim() === "") {
    throw new TranslationError("`text` is required and must be a non-empty string.");
  }
  if (!LANGUAGE_CODES.has(targetLang)) {
    throw new TranslationError(`Unsupported target language: ${targetLang}`);
  }
}

function mockTranslate(text, targetLang) {
  const key = text.trim().toLowerCase().replace(/[.!?]+$/, "");
  const entry = PHRASEBOOK[key];
  if (entry && entry[targetLang]) {
    return entry[targetLang];
  }
  // Deterministic fallback so unknown phrases still return something sensible.
  return `[${targetLang}] ${text}`;
}

async function openAiTranslate(text, targetLang) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a translation engine. Translate the user's text into ${languageName(
            targetLang,
          )}. Respond with only the translation, no quotes or commentary.`,
        },
        { role: "user", content: text },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new TranslationError(`Upstream translation failed: ${detail}`, 502);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

export async function translate(text, targetLang) {
  validate(text, targetLang);
  const provider = process.env.OPENAI_API_KEY ? "openai" : "mock";
  const translation =
    provider === "openai"
      ? await openAiTranslate(text, targetLang)
      : mockTranslate(text, targetLang);

  return {
    text,
    targetLang,
    targetLanguage: languageName(targetLang),
    translation,
    provider,
  };
}
