# Privacy model

This document explains, concretely, how Luna protects data — and where the honest limits of that protection are. The goal is that you and your girlfriend can trust the "privacy" claim because you can read exactly how it works, not just take it on faith.

## What Luna does differently from Flo

| | Flo (and most period apps) | Luna |
|---|---|---|
| Who can read your logs | Flo's servers, and per their privacy policy, potentially shared with analytics/marketing partners | Only you, by default |
| Partner access | Partner sees a broad shared view | Partner sees only phase + predicted dates — never notes, symptoms, or moods |
| Ads / trackers | Yes, third-party SDKs in many builds | None — this app has zero analytics or ad code |
| Data ownership | Locked in their app | One-click JSON export, one-click permanent delete |
| Who controls the server | Flo, Inc. | You (your own free Supabase + Vercel projects) |

## How access control actually works

Every table in the database has **Row Level Security (RLS)** turned on (see `supabase/schema.sql`). This is a Postgres feature that enforces access rules *inside the database itself* — it doesn't rely on the frontend app behaving correctly. Concretely:

- `cycles` and `daily_logs`: a policy allows a row to be read/written **only if** `auth.uid() = user_id`, i.e. only by the person who owns it. There is no code path — even a modified or malicious frontend — that lets someone query another person's `daily_logs` through the public API key.
- `partner_links`: an owner can always see their own invite/connection rows. A partner can only see a link row after they've been explicitly attached to it (by redeeming an invite code).
- Partner access is deliberately narrow: partners query a `partner_summary` **view**, which only exposes cycle-length averages and the most recent period start date — enough to compute phase and predictions, but structurally excludes `daily_logs.note` and symptom/mood detail. There's no way for a partner account to reach those columns even by inspecting network requests, because the view never selects them.
- Invite codes are single-use (`status` flips from `pending` to `accepted` on redemption) and can be revoked at any time by the owner, which immediately cuts off the `partner_summary` row for that link.

## Honest limits

No system is perfectly private, and it's worth being direct about the boundaries:

1. **The Supabase project owner (whoever creates the Supabase account — likely you) can view raw data via the Supabase dashboard.** RLS restricts the *public API* (what the app itself uses), not a person logged into the Supabase dashboard with the project's admin credentials. If this matters to you, consider:
   - Having your girlfriend create and own the Supabase project instead, with you as a collaborator only if she chooses.
   - Adding client-side encryption for the `note` field (encrypt in the browser before saving, decrypt after fetching) so even dashboard access shows ciphertext. This is listed as a roadmap item in the README — it's a meaningful upgrade if you want to close this gap.
2. **Supabase (the company) hosts the database.** Their infrastructure could theoretically be compelled by legal process or compromised by a breach, same as any hosted service. Self-hosting Supabase (or Postgres directly) removes this, at the cost of more setup complexity — see their [self-hosting docs](https://supabase.com/docs/guides/self-hosting) if you want to go further.
3. **Whoever controls the Vercel deployment and GitHub repo can modify the app's code**, which is a form of trust — same as installing any app. Keep the repo private and be the only one with deploy access unless you both agree otherwise.
4. **Browser/device security is outside this app's control.** If someone has physical access to an unlocked, signed-in device, they can see whatever's on screen — this is true of literally every app, but worth noting since it's often the actual privacy risk in practice.
5. **This is not medical-grade software.** Predictions are calendar-based estimates, not verified against or reviewed by clinicians. Don't rely on it for anything requiring medical accuracy (contraception decisions, fertility treatment, etc.) without also consulting a healthcare provider.

## Data deletion

The **Settings → Delete all my data** button removes all rows from `cycles` and `daily_logs` for that account immediately and permanently. It does not delete the auth account itself (email/password) — that can be done from the Supabase dashboard under **Authentication → Users** if you want to remove the account entirely.
