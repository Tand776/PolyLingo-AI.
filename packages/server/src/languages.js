export const LANGUAGES = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
];

export const LANGUAGE_CODES = new Set(LANGUAGES.map((l) => l.code));

export function languageName(code) {
  return LANGUAGES.find((l) => l.code === code)?.name ?? code;
}
