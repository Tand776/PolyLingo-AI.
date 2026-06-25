# PolyLingo-AI

AI-powered multilingual translation app. npm-workspaces monorepo:

- `packages/server` — Express API (port `3001`): `/api/translate`, `/api/languages`, `/api/health`.
- `packages/client` — Vite + React UI (port `5173`), proxies `/api` → `:3001`.

Standard commands are documented in `README.md` and the root `package.json` scripts
(`dev`, `build`, `test`, `lint`).

## Cursor Cloud specific instructions

- Dependencies install at the repo root with `npm install` (npm workspaces hoist into
  the root `node_modules`); there is no need to install inside each package.
- `npm run dev` starts the API (`:3001`) and the client (`:5173`) together via
  `concurrently`. The client must be reached at `http://localhost:5173`; it proxies
  `/api/*` to the server. Hitting `:5173` directly for API calls works because of the
  Vite proxy.
- The server runs with a built-in offline phrasebook by default (`provider: "mock"`),
  so the app is fully functional with no secrets. Known demo phrases include
  "hello world", "hello", "good morning", "thank you", "goodbye"; unknown input falls
  back to `[<lang>] <text>`. To use real AI translation, set `OPENAI_API_KEY` (and
  optionally `OPENAI_MODEL`) in the environment before starting the server.
