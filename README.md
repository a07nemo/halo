# Halo — your personal brand OS

**Hi, I'm Halo. I run the boring half of your creator life.** A female AI manager for creators — she captures ideas, schedules posts, negotiates brand deals, chases invoices, and remembers your superfans. Warm, motion-rich frontend on a real backend with accounts and per-user data.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · NextAuth (Google + email) · Prisma + SQLite · Anthropic Claude API (with smart mock fallback) · Recharts.

## Themes

Four editorial color themes, switchable in Settings and saved per user: **Bubblegum** (default), **Sunrise**, **Midnight**, and **Meadow**. Themes are driven by CSS variables (`[data-theme]`), so the whole app — landing page included — recolors instantly.

## Features

- **Landing page** — the Halo story, features, and sign-up.
- **Accounts** — sign up / log in with email + password (and Google, if configured). Every creator gets their own private data.
- **Dashboard** — a personal greeting from Halo, plus followers, active deals, pipeline value, deliverables, events, and scheduled posts.
- **Content Studio** — generate post ideas and captions/hashtags with Halo, then save them into a content pipeline (idea → draft → scheduled → published).
- **Calendar** — month view of shoots, meetings, launches, and deadlines; add events and link them to brand deals.
- **Analytics** — follower growth, reach, and engagement charts across platforms, plus auto-generated insights.
- **Deals & PR** — track brands, deal value, contacts, and per-deal deliverable checklists with status and due dates.
- **Connections** — link Instagram, TikTok, YouTube, and X (sandbox mode now; real sync when developer credentials are added).
- **Halo Chat** — a conversational assistant that knows your live deals, followers, and calendar.
- **Settings** — edit your creator profile so Halo's suggestions fit you.

## Demo login

After seeding, sign in with **email `demo@halo.app`** and **password `halo1234`** — the account comes preloaded with deals, posts, events, and analytics.

## Setup

You need [Node.js](https://nodejs.org) 18+ installed. From this folder:

```bash
npm install        # install dependencies
npm run db:reset   # generate Prisma client, (re)create the SQLite DB, seed demo data
npm run dev        # start the dev server
```

Then open **http://localhost:3000**. Use `db:reset` (not `setup`) whenever the data model changes — it rebuilds the database cleanly and reseeds the demo account.

## Enable real AI (optional)

Out of the box, the AI features (ideas, captions, chat) run on built-in smart mock responses, so everything works immediately. To power them with real Claude:

1. Open `.env`
2. Uncomment and set `ANTHROPIC_API_KEY="sk-ant-..."`
3. Restart `npm run dev`

The top bar shows **AI on** when a key is detected, **Demo mode** otherwise.

## Enable Google sign-in (optional)

Email/password works out of the box. To add the "Continue with Google" button:

1. Create an OAuth 2.0 Client ID at https://console.cloud.google.com
2. Add redirect URI `http://localhost:3000/api/auth/callback/google`
3. Put the values in `.env` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
4. Also set a real `NEXTAUTH_SECRET` (any long random string)
5. Restart `npm run dev`

The Google button appears automatically once credentials are detected.

## Connecting social platforms

The Connections page links Instagram, TikTok, YouTube, and X. Right now this runs in **sandbox mode** — connecting simulates the sign-in and loads sample follower data. Wiring real data requires a registered developer app per platform (Meta, TikTok for Developers, Google/YouTube, X API) and, for most, platform approval. The connect flow and data model are already built, so switching each platform to live is a contained change once credentials and approvals are in place.

## Deploy online (Vercel)

Halo runs great locally on SQLite. To put it on the web with [Vercel](https://vercel.com):

1. **Switch the database to Postgres.** Vercel's serverless filesystem is read-only, so SQLite won't persist. In `prisma/schema.prisma` change the datasource to `provider = "postgresql"`, then create a free Postgres database (Vercel Postgres, Neon, or Supabase) and copy its connection string.
2. **Push your code to GitHub**, then in Vercel click *New Project* and import the repo.
3. **Add environment variables** in the Vercel project settings:
   - `DATABASE_URL` — your Postgres connection string
   - `NEXTAUTH_SECRET` — any long random string
   - `NEXTAUTH_URL` — your deployed URL (e.g. `https://halo.vercel.app`)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional, for Google sign-in (add the deployed callback URL in Google Cloud)
   - `ANTHROPIC_API_KEY` — optional, for real Claude replies
4. **Deploy.** After the first deploy, run the database setup once against your Postgres URL: `npx prisma db push` then `npm run db:seed` (locally, with `DATABASE_URL` pointed at Postgres).

The `build` script already runs `prisma generate`, so Vercel builds cleanly.

## Useful scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run db:seed` | Re-seed demo data |
| `npm run db:reset` | Wipe + recreate + re-seed the database |

## Project structure

```
prisma/
  schema.prisma        # data model: Creator, Post, Deal, Deliverable, Event, Metric, ChatMessage
  seed.ts              # demo creator + deals + posts + events + 30 days of metrics
src/
  app/
    page.tsx           # Dashboard
    studio/            # Content Studio (AI ideas + captions)
    calendar/          # Calendar
    analytics/         # Analytics + charts
    deals/             # Deals & PR
    chat/              # Halo Chat
    api/               # Backend route handlers (REST)
  components/          # Sidebar, Topbar, shared UI
  lib/
    db.ts              # Prisma client
    ai.ts              # Claude integration + mock fallback
    ui.ts              # shared helpers, colors, formatters
```

## Notes

- Single-user demo: the backend resolves the first creator in the DB. The data model and API are structured so multi-user auth can be added later without reshaping the schema.
- All data persists in `dev.db` (SQLite) — safe to delete and re-seed with `npm run db:reset`.
