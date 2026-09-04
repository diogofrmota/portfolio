Personal website and apps built with Next.js.

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and provide the Google OAuth, Neon, and
TMDB values needed by the apps. Secrets must remain in local or Vercel
environment variables and must never be committed.

The apps share one Neon Postgres database. Apply pending schema migrations with:

```bash
npm run db:migrate
```

`DATABASE_URL` is the pooled runtime connection. `DATABASE_URL_UNPOOLED` is the
direct connection preferred by the migration runner. TVSync also requires a
server-only `TMDB_API_KEY` for live discovery and search; without it, the route
renders a small preview catalogue.

All product data is namespaced within that database: TVSync stores libraries,
ratings, and episode progress; Couple Planner stores a shared two-person space;
and Fithub stores each user's fitness state. The apps use one Google account and
the shared `app_users` table, while keeping each app's records isolated.
