# Luna

A private cycle & period tracker, built as a personal, ad-free alternative to apps like Flo. Log periods, symptoms, moods, and notes — and optionally share a read-only summary with one partner.

**Goals of this project:**
- Runs entirely on free-tier infrastructure — no subscriptions, no cost to operate.
- Privacy by construction, not just by policy — see [`docs/PRIVACY.md`](docs/PRIVACY.md) for exactly how.
- Simple enough for one person to run and understand end-to-end.

## Features

- 🩸 Log periods (start/end dates) and daily symptoms, mood, flow intensity, and private notes
- 📅 Automatic predictions: current cycle day, fertile window, ovulation date, next period estimate
- 💞 Partner sharing via one-time invite codes — partner sees only phase + predicted dates, never notes
- 📤 One-click data export (JSON) and one-click permanent data deletion
- 🔒 Database-enforced privacy (Postgres Row Level Security) — not just "the app promises not to look"

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS | Fast, beginner-friendly, huge community for troubleshooting |
| Backend | [Supabase](https://supabase.com) (Postgres + Auth) | Generous free tier, real auth, Row Level Security for genuine per-user data isolation |
| Hosting | [Vercel](https://vercel.com) (or Netlify) | Free tier, deploys straight from GitHub on every push |

Total monthly cost: **$0**, for personal-scale usage (two users).

## Getting started

See [`docs/SETUP.md`](docs/SETUP.md) for a full, step-by-step guide assuming zero prior experience — creating the free accounts, setting up the database, running locally, and deploying.

Quick version, if you're already comfortable with this stack:

```bash
git clone https://github.com/<your-username>/luna.git
cd luna
npm install
cp .env.example .env   # fill in your Supabase project URL + anon key
npm run dev
```

Run the SQL in [`supabase/schema.sql`](supabase/schema.sql) inside your Supabase project's SQL Editor before first use.

## Project structure

```
luna/
├── docs/
│   ├── SETUP.md            # step-by-step setup for beginners
│   ├── PRIVACY.md          # exactly how privacy is enforced, and its limits
│   └── ARCHITECTURE.md     # how the pieces fit together
├── supabase/
│   └── schema.sql          # database tables, RLS policies, invite-redeem function
├── src/
│   ├── pages/               # Dashboard, LogEntry, Partner, Settings, AuthPage
│   ├── components/          # Layout / nav shell
│   ├── contexts/            # AuthContext (Supabase session)
│   ├── lib/                 # Supabase client
│   └── utils/                # cycle prediction math
└── .env.example
```

## Roadmap ideas

- Client-side encryption of notes (so even you, via the Supabase dashboard, can't read them)
- Push/email reminders before predicted period start
- Symptom trend charts over multiple cycles
- PWA support for "install to home screen" on mobile

## License

MIT — see [`LICENSE`](LICENSE). This is a personal project; no warranty, and it is not a medical device or diagnostic tool.
