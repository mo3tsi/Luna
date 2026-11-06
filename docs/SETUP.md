# Setup guide

This assumes you've never deployed a web app before. It takes about 30–45 minutes the first time.

## What you'll create (all free)

1. A **GitHub** account — hosts your code.
2. A **Supabase** account — hosts your database and handles login/signup.
3. A **Vercel** account — hosts the live website your girlfriend will actually use.

None of these require a credit card for this project's scale.

---

## 1. Get the code running on your computer

### Install prerequisites
- [Node.js](https://nodejs.org) (LTS version) — this also installs `npm`.
- [Git](https://git-scm.com/downloads)
- A code editor — [VS Code](https://code.visualstudio.com) is free and beginner-friendly.

```bash
git clone https://github.com/mo3tsi/Luna.git
cd Luna
npm ci
```


---

## 2. Create your Supabase project (the database)

1. Go to [supabase.com](https://supabase.com) → **Start your project** → sign up (GitHub login is easiest).
2. Click **New project**. Pick any name (e.g. "luna"), set a database password (save it somewhere safe — a password manager is ideal), and choose the region closest to you.
3. Wait ~2 minutes for it to finish provisioning.
4. In the left sidebar, go to **SQL Editor** → **New query**.
5. Open `supabase/schema.sql` from this project, copy its entire contents, paste into the SQL editor, and click **Run**. This creates the tables and privacy rules. If Luna already has a database, run [the partner-sharing migration](../supabase/migrations/202611070001_partner_sharing.sql) instead.
6. In the left sidebar, go to **Settings → API**. You'll need two values from this page in the next step:
   - **Project URL**
   - **anon / public** key (NOT the `service_role` key — never put that one in the frontend)

### Turn off public signups (optional but recommended)
Since only you and your girlfriend will use this, you can disable open signups so nobody else can create an account if they ever find the URL:
- **Authentication → Providers → Email** — you can leave signups on temporarily until both of you have accounts, then in **Authentication → Settings**, you can restrict things further (e.g. disable new signups) once you're both set up.

---

## 3. Connect the app to your Supabase project

1. In your project folder, copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in your editor and paste in your Project URL and anon key from step 2.6:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
3. Run the app locally:
   ```bash
   npm run dev
   ```
4. Open the URL it prints (usually `http://localhost:5173`) in your browser. You should see the Luna sign-in screen.
5. For local signup testing, allow `http://localhost:5173/auth` in Supabase Auth redirect URLs and use a test account.

`.env` is ignored by Git. The frontend project URL and publishable/anon key are visible in the deployed bundle. Keep database passwords and privileged keys out of all frontend configuration.

---

## 4. Deploy Luna and enable signup

1. In [Vercel](https://vercel.com), import [mo3tsi/Luna](https://github.com/mo3tsi/Luna) as a Vite project, or open its existing project. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the Production environment, then deploy.
2. In Supabase Auth URL Configuration, set **Site URL** to the production HTTPS origin and add the exact confirmation redirect, such as `https://your-luna-domain.vercel.app/auth`, to **Redirect URLs**.
3. Keep email confirmation enabled and configure [custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp). Supabase's built-in email service only sends to project team addresses. Your girlfriend can create her own account after email delivery works.
4. Open the production URL on a phone. With synthetic test data, create a test account, follow its email link, log a period and a note, reload the calendar and reopen the note to confirm they persisted. With a second account, verify that only the shared summary appears after connecting and that it disappears after revocation.
5. Share the production URL. She can sign up, confirm her email, then tap **Log** to save her first entry. On a phone, use the browser's **Add to Home Screen** option where available.

### Getting you partner access
1. She signs in, goes to the **Partner** tab, clicks **Generate invite code**.
2. She sends you that code (text, in person, whatever you're both comfortable with).
3. You create your own account on the same site, go to **Partner**, paste the code into **Connect to someone who shared a code**.
4. You'll now see her (read-only) cycle phase and predicted dates on your **Partner** tab. She can revoke this at any time from her own **Partner** tab.

---

## Updating the app later

Whenever you change code:
```bash
git add .
git commit -m "Describe what changed"
git push
```
Vercel automatically redeploys within a minute or two of every push to `main`.

## Troubleshooting

- **Blank page / console errors about Supabase URL** — double check `.env` (locally) or the Vercel environment variables (in production) are set correctly, then redeploy/restart.
- **"Invite code is invalid, already used, or expired"** — codes are single-use; generate a fresh one.
- **Confirmation email never arrives** — check spam, custom SMTP configuration, and the Supabase Auth logs. If the link opens the wrong site, check **Site URL** and **Redirect URLs**.
