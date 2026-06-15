# Ask Alpha — Web Chat

A Claude-style chat web app for **Allegiance**'s "Ask Alpha" Dubai real-estate AI agent.
It's the front end for the [`ask-alpha-chat`](https://github.com/Ahmedmini2/ask-alpha-chat)
FastAPI backend (AWS Bedrock / Claude + Supabase Postgres). Premium Allegiance design,
rich result cards, Supabase login, and persistent per-user conversation history.

## Features

- **Conversational chat** against your Ask Alpha API (`POST /v1/chat`), with a Claude-like
  thinking indicator and a typewriter reveal (the backend replies in one shot — it doesn't stream).
- **Rich result cards** for everything the agent returns: project lists, project detail,
  market intelligence, investment analysis & metrics, project comparisons, developer profiles,
  nearby amenities, document quotes, promo-video jobs/status, avatar looks, brochures, and
  comparison PDFs.
- **History sidebar** grouped by date (Today / Yesterday / …), powered by the backend's
  `/v1/conversations` endpoints — survives refresh, scoped per signed-in user.
- **Supabase auth** (email/password + Google). The signed-in user's UUID is passed to the
  backend as `user_id`, **injected server-side** so a user can never read another user's history.
- **Allegiance brand system** — dark green `#06342C`, gold `#C1A777`, ivory paper, Playfair
  Display headings.

## Architecture

```
Browser ──> Next.js (this app)
              ├─ Supabase Auth (login only)            → user UUID
              └─ /api/* route handlers (server)        → inject user_id from session
                    └─> Ask Alpha API (/v1/chat, /v1/conversations, …)
                          └─> Supabase Postgres (history + property data)
```

The browser never calls the backend directly and never sees `ASK_ALPHA_API_URL` — all calls go
through the Next.js API proxy in [`app/api`](app/api), which validates the Supabase session and
sets `user_id` itself.

Key directories:

- [`app/api`](app/api) — server proxy routes (`chat`, `conversations`, `conversations/[id]/messages`)
- [`lib/askalpha.ts`](lib/askalpha.ts) — typed server client for the FastAPI backend
- [`lib/types.ts`](lib/types.ts) — the full API + card type contract (mirror of the backend)
- [`components/chat`](components/chat) — the chat shell (sidebar, thread, composer, …)
- [`components/cards`](components/cards) — one component per backend card type + the dispatcher
- [`lib/supabase`](lib/supabase) — Supabase browser/server clients + middleware session refresh

## Setup

1. **Install**
   ```bash
   npm install
   ```

2. **Environment** — copy `.env.example` to `.env.local` and set:
   ```bash
   ASK_ALPHA_API_URL=http://localhost:8000          # your backend (Railway URL in prod)
   NEXT_PUBLIC_SUPABASE_URL=https://pqzsdxcjyqjjvfsunzak.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_1afhTCU-pMRQGG6l59Quow_szI2kBwt
   ```
   > The Supabase values point at the **same** project the backend uses ("Projects DB"), so
   > logins line up with the `profiles` table and conversations are scoped per user.

3. **Run the backend** (`ask-alpha-chat`) locally on `:8000`, or point `ASK_ALPHA_API_URL` at
   your deployed Railway URL.

4. **Dev**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 — you'll be redirected to `/login`.

## Deploy (Vercel)

Push to a repo, import into Vercel, and set the three env vars above in the project settings
(use the production Railway URL for `ASK_ALPHA_API_URL`). Then add your Vercel domain to the
backend's `CORS_ORIGINS` — though strictly the browser only hits this app's own origin.

## Notes

- **Auth providers:** email/password works out of the box. Google sign-in requires the Google
  provider to be enabled in the Supabase dashboard (Authentication → Providers) with this app's
  `/auth/callback` URL allow-listed.
- **Agent-only features** (promo videos, brochures, comparison PDFs) are gated by the backend to
  signed-in agents (`profiles.role` + `ask_alpha_access`). The UI renders those cards whenever the
  backend returns them.
- **Streaming:** the backend returns the full reply in one response; the typewriter effect is a
  client-side flourish. If the backend later adds SSE, swap the call in `lib/api.ts` / the chat route.
```
