# LiveRank

## Routes
- `/admin` — open admin scoring dashboard.
- `/participant` — read-only live leaderboard.

## Supabase
1. Open Supabase SQL Editor.
2. Run `supabase-schema.sql`.
3. Add your real participants with `INSERT INTO public.participants (name) VALUES ...`.
4. Create `.env` from `.env.example` and add your Supabase project URL and publishable/anon key.

The Admin page includes **Reset Event**, which keeps participant names but sets all scores to 0 and clears score history.

## Local development
```bash
npm install
npm run dev
```
For phone testing on the same Wi-Fi:
```bash
npm run dev -- --host 0.0.0.0
```

## Vercel deployment
1. Push this folder to GitHub (do not commit `.env`).
2. Import the repository into Vercel.
3. Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel Project Settings → Environment Variables.
4. Deploy.
5. Share `https://YOUR-DOMAIN/participant` with participants and use `https://YOUR-DOMAIN/admin` for admins.
