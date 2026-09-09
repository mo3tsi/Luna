# Architecture

```
┌─────────────────┐        HTTPS         ┌──────────────────────────┐
│   Browser        │ ───────────────────▶ │   Vercel (static hosting) │
│  (you / partner) │ ◀─────────────────── │   serves the built React  │
└────────┬─────────┘                      │   app (HTML/JS/CSS)       │
         │                                └──────────────────────────┘
         │  Supabase JS client (auth + queries),
         │  using the public "anon" key
         ▼
┌─────────────────────────────────────────────────────────┐
│  Supabase project                                          │
│  ┌───────────────┐   ┌───────────────────────────────┐  │
│  │  Auth          │   │  Postgres database              │  │
│  │  (email/pw,    │   │  - profiles                     │  │
│  │  sessions,     │──▶│  - cycles                       │  │
│  │  JWT tokens)   │   │  - daily_logs                   │  │
│  └───────────────┘   │  - partner_links                │  │
│                       │  - partner_summary (view)       │  │
│                       │  Row Level Security on every table │
│                       └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Request flow example: viewing today's prediction

1. Browser loads the static React app from Vercel.
2. `AuthContext` asks Supabase for the current session (a JWT stored in local browser storage after login).
3. `Dashboard.tsx` queries `profiles` and `cycles` tables through the Supabase JS client, sending the JWT along.
4. Postgres checks the RLS policy on each table (`auth.uid() = user_id`) before returning any rows — this check happens inside the database, not in app code.
5. `utils/cyclePredictions.ts` runs a pure calendar calculation client-side on the returned dates — no server-side "prediction API" needed.

## Why no custom backend server?

Supabase's auto-generated REST API (via `@supabase/supabase-js`) plus Postgres RLS removes the need to write and host a traditional backend (e.g. Node/Express) for this app's scope. That means:
- Fewer moving parts for a beginner to maintain.
- No server to pay for or keep patched — Supabase's free tier handles it.
- Security logic lives in one place (SQL policies) rather than being re-implemented in application code, which is both simpler and harder to accidentally get wrong.

If the app grows features that need custom server-side logic (e.g. sending email reminders), Supabase **Edge Functions** (also free-tier eligible) are the natural next step rather than standing up a separate server.

## Key files

| File | Role |
|---|---|
| `supabase/schema.sql` | Source of truth for tables, RLS policies, and the `redeem_invite` function |
| `src/lib/supabaseClient.ts` | Single Supabase client instance, configured from environment variables |
| `src/contexts/AuthContext.tsx` | Tracks login session across the app; used by `RequireAuth` in `App.tsx` |
| `src/utils/cyclePredictions.ts` | All prediction math — isolated so it's easy to test or refine independently of UI |
| `src/pages/*` | One file per screen; each talks to Supabase directly for its own data needs |
