# PolyLingo-AI

AI-powered multilingual translation app. npm-workspaces monorepo:

- `packages/server` — Express API (port `3001`): `/api/translate`, `/api/languages`, `/api/health`.
- `packages/client` — Vite + React UI (port `5173`), proxies `/api` → `:3001`. Includes a
  Firebase Authentication + Firestore auth system (`src/auth/*`, `src/screens/*`).

Standard commands are documented in `README.md` and the root `package.json` scripts
(`dev`, `build`, `test`, `lint`, `emulators`, `dev:all`).

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

### Authentication (Firebase) — local development

- Auth is wired to the **Firebase Local Emulator Suite** by default in dev, so NO real
  Firebase project or secrets are needed. `packages/client/.env.development` sets
  `VITE_USE_FIREBASE_EMULATOR=true` and a `demo-polylingo` config; `src/firebase.js`
  connects to the Auth (`:9099`) and Firestore (`:8080`) emulators when that flag is true.
- Run everything together with `npm run dev:all` (emulators + API + client), or run
  `npm run emulators` separately from `npm run dev`. Emulator UI: `http://localhost:4000`.
- The Firestore emulator requires Java (a JRE is already present in this image as
  `java`). The Auth emulator is pure Node. First `emulators:start` downloads the
  Firestore JAR + Emulator UI (needs network).
- The Vite dev server reads `.env.development` only at startup — if you change env flags,
  restart the client. Firebase emulator data is in-memory and resets when the emulators stop.
- Useful emulator REST checks (bypass security rules with `Authorization: Bearer owner`):
  list auth users via `POST :9099/identitytoolkit.googleapis.com/v1/projects/demo-polylingo/accounts:query`;
  read profiles via `GET :8080/v1/projects/demo-polylingo/databases/(default)/documents/users`.
- Google/Apple sign-in use `signInWithPopup`; against the emulator this opens a local
  popup where you create a fake provider account (no real OAuth).
- For production, set real `VITE_FIREBASE_*` values (see `.env.example`) and
  `VITE_USE_FIREBASE_EMULATOR=false`.
