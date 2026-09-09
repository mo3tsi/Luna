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



`npm install` downloads all the code libraries the app depends on. This can take a minute or two.

---

## 2. Create your Supabase project (the database)

1. Go to [supabase.com](https://supabase.com) → **Start your project** → sign up (GitHub login is easiest).
2. Click **New project**. Pick any name (e.g. "luna"), set a database password (save it somewhere safe — a password manager is ideal), and choose the region closest to you.
3. Wait ~2 minutes for it to finish provisioning.
4. In the left sidebar, go to **SQL Editor** → **New query**.
5. Open `supabase/schema.sql` from this project, copy its entire contents, paste into the SQL editor, and click **Run**. This creates all the tables and the privacy rules (Row Level Security policies) described in `docs/PRIVACY.md`.
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
5. Create an account for your girlfriend (or yourself, to test) using the "New here? Create an account" link. Supabase will send a confirmation email — check the inbox of the email address you used.

`.env` is listed in `.gitignore`, so it will never be uploaded to GitHub — your Supabase keys stay private.

---

## 4. Push the code to GitHub

1. Go to [github.com](https://github.com) → sign up if you haven't.
2. Click **New repository**. Name it `luna`, keep it **Private** (recommended, since this is personal), don't initialize with a README (you already have one).
3. Back in your terminal, inside the project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Luna"
   git branch -M main
   git remote add origin https://github.com/<your-username>/luna.git
   git push -u origin main
   ```
4. Refresh your GitHub repo page — your code should now be there. Double-check `.env` is **not** in the file list (it shouldn't be, thanks to `.gitignore`).

---

## 5. Deploy so your girlfriend can actually use it

1. Go to [vercel.com](https://vercel.com) → sign up with your GitHub account.
2. Click **Add New → Project**, then **Import** your `luna` GitHub repo.
3. Vercel will detect it's a Vite project automatically. Before deploying, add your environment variables (**Environment Variables** section):
   - `VITE_SUPABASE_URL` = same value as your `.env`
   - `VITE_SUPABASE_ANON_KEY` = same value as your `.env`
4. Click **Deploy**. In about a minute, you'll get a live URL like `luna-yourname.vercel.app`.
5. Share that URL with your girlfriend. She creates her own account there — that's the account that owns her cycle data.

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
- **Confirmation email never arrives** — check spam, or in Supabase go to **Authentication → Users** and manually confirm the account while testing.
