# BITNBUILD

BITNBUILD is a game-inspired hackathon platform built with Next.js 14 App Router, Supabase, Tailwind CSS, Recharts, Zustand, QR scanning/generation, PDF export, and Resend email broadcasts.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and fill Supabase plus Resend values.

3. Run the Supabase SQL in order:

```text
supabase/migrations/001_initial_schema.sql
supabase/seed.sql
```

4. Enable Supabase Realtime for `scores`, `announcements`, and `check_in_logs` if your hosted project does not apply publication changes automatically.

5. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Public Site

The default route `/` is the BITNBUILD landing page with a navbar, countdown, CTA, about, domains, timeline, prizes, sponsors, FAQ, and contact sections.

The preloader looks for this optional video:

```text
public/bitnbuild-cutscene.mp4
```

Drop your opening cutscene there. When the video ends, the page flashes white and reveals the hero section. If the video is missing, the site skips ahead automatically.

## Seed Logins

- Admin: `admin@bitnbuild.com` / `Admin@1234`
- Judges: `judge1@bitnbuild.com`, `judge2@bitnbuild.com`, `judge3@bitnbuild.com` / `Judge@1234`
- Mentors: `mentor1@bitnbuild.com`, `mentor2@bitnbuild.com` / `Mentor@1234`
- Participants: `trainer1@bitnbuild.com` through `trainer10@bitnbuild.com` / `Trainer@1234`

## Performance Notes

- Public `/` no longer redirects to `/login`.
- Global auth/theme/toast providers were moved out of the root layout so the landing page ships much less client JavaScript.
- The landing page is static-first; only countdown and intro preloader are client components.
- Heavy authenticated modules stay behind dashboard routes.

## Implemented Areas

- Role-based Supabase auth routing through `middleware.ts`
- Admin analytics, trainer registry, team/round/room/problem statement views
- Bulk CSV parser scaffold for trainer creation
- QR generation route and scanner UI
- Real-time leaderboard hook subscribed to `scores`
- Announcement composer, history, realtime announcement hook, and Resend email route
- Allocation generation API using domain-aware judge/mentor/room matching
- Allocation PDF export with `@react-pdf/renderer`
- Judge mobile-first scanner/search, schedule, and scoring form
- Participant trainer card, QR card, announcements, schedule, profile, PS selection, and selected PS view
- Pokemon-inspired theme globals, trading-card surfaces, Pokedex sidebar, type badges, HP bars, and Pokeball loader
- Supabase schema, RLS policies, score aggregation trigger, and `get_leaderboard()` RPC

## Notes

The app is production-buildable with:

```bash
npm run build
```

Supabase Auth admin user creation for CSV imports requires a server-side invite/create-user implementation using the service role key. The UI parser and validation are in place, and the project already includes service-role server client utilities for completing that workflow.
