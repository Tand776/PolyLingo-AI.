import { describe, it, expect } from "vitest";
import request from "supertest";
import { translate, TranslationError } from "../src/translate.js";
import { createApp } from "../src/index.js";

describe("translate()", () => {
  it("translates a known phrase using the offline phrasebook", async () => {
    const result = await translate("Hello world", "es");
    expect(result.translation).toBe("Hola mundo");
    expect(result.provider).toBe("mock");
    expect(result.targetLanguage).toBe("Spanish");
  });

  it("is case- and punctuation-insensitive for known phrases", async () => {
    const result = await translate("HELLO WORLD!", "fr");
    expect(result.translation).toBe("Bonjour le monde");
  });

  it("falls back deterministically for unknown phrases", async () => {
    const result = await translate("supercalifragilistic", "de");
    expect(result.translation).toBe("[de] supercalifragilistic");
  });

  it("rejects empty text", async () => {
    await expect(translate("", "es")).rejects.toBeInstanceOf(TranslationError);
  });

  it("rejects unsupported languages", async () => {
    await expect(translate("Hello", "xx")).rejects.toBeInstanceOf(TranslationError);
  });
});

describe("HTTP API", () => {
  const app = createApp();

  it("GET /api/health returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /api/languages lists supported languages", async () => {
    const res = await request(app).get("/api/languages");
    expect(res.status).toBe(200);
    expect(res.body.languages.length).toBeGreaterThan(0);
  });

  it("POST /api/translate returns a translation", async () => {
    const res = await request(app)
      .post("/api/translate")
      .send({ text: "Thank you", targetLang: "ja" });
    expect(res.status).toBe(200);
    expect(res.body.translation).toBe("ありがとう");
  });

  it("POST /api/translate validates input", async () => {
    const res = await request(app)
      .post("/api/translate")
      .send({ text: "", targetLang: "es" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });
});
