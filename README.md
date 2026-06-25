# PolyLingo-AI

An AI-powered multilingual translation app. Type text, pick a target language, and
get an instant translation.

It's a small npm-workspaces monorepo:

- `packages/server` — Express API (`/api/translate`, `/api/languages`, `/api/health`).
- `packages/client` — Vite + React UI with a Firebase Authentication + Firestore auth
  system (email, Google, Apple, guest, password reset, email verification, account
  deletion) and animated screens.

## Translation provider

By default the server uses a built-in offline phrasebook (no API key required) so the
app runs end-to-end out of the box. If `OPENAI_API_KEY` is set, the server uses OpenAI
instead (model configurable via `OPENAI_MODEL`, default `gpt-4o-mini`).

## Authentication

The client uses Firebase Authentication + Firestore. In development it talks to the
local **Firebase Emulator Suite** by default, so no real Firebase project or secrets are
required. User profiles are stored in Firestore under `users/{uid}`.

For production, copy `packages/client/.env.example` to `.env.local`, fill in your real
`VITE_FIREBASE_*` values, and set `VITE_USE_FIREBASE_EMULATOR=false`.

## Getting started

```bash
npm install        # install all workspaces (includes firebase-tools)
npm run dev:all    # start emulators + API (:3001) + client (:5173) together
```

Then open http://localhost:5173 (Emulator UI at http://localhost:4000).

To run without auth emulators (API + client only): `npm run dev`.

## Scripts

| Command            | Description                                       |
| ------------------ | ------------------------------------------------- |
| `npm run dev:all`  | Run Firebase emulators + server + client          |
| `npm run dev`      | Run server + client in watch/dev mode             |
| `npm run emulators`| Run the Firebase Auth + Firestore emulators       |
| `npm run build`    | Production build of the client                    |
| `npm test`         | Run automated tests (server)                      |
| `npm run lint`     | Lint all workspaces                               |
| `npm start`        | Run the API server only                           |
