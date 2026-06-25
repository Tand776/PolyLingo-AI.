# PolyLingo-AI

An AI-powered multilingual translation app. Type text, pick a target language, and
get an instant translation.

It's a small npm-workspaces monorepo:

- `packages/server` — Express API (`/api/translate`, `/api/languages`, `/api/health`).
- `packages/client` — Vite + React UI.

## Translation provider

By default the server uses a built-in offline phrasebook (no API key required) so the
app runs end-to-end out of the box. If `OPENAI_API_KEY` is set, the server uses OpenAI
instead (model configurable via `OPENAI_MODEL`, default `gpt-4o-mini`).

## Getting started

```bash
npm install        # install all workspaces
npm run dev        # start API (:3001) + client (:5173) together
```

Then open http://localhost:5173.

## Scripts

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Run server + client in watch/dev mode        |
| `npm run build`  | Production build of the client               |
| `npm test`       | Run automated tests (server)                 |
| `npm run lint`   | Lint all workspaces                          |
| `npm start`      | Run the API server only                      |
