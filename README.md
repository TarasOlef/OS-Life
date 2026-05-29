# OS-Life

OS-Life is a private personal Progressive Web App that acts as the command center for the parts of life that are worth managing: dashboard, training, nutrition, sleep, body tracking, focus, personal finances, and investments.

The product starts local-first. This sprint intentionally avoids Supabase, Drizzle, Postgres, authentication, OpenAI calls, and market data APIs. The goal is to make the app feel useful with local browser data before connecting a backend.

## Why It Exists

Most personal dashboards become bloated. OS-Life is intentionally narrow: fast daily visibility, simple inputs, useful local summaries, and no unnecessary modules.

## Local-First Strategy

Data flows through this architecture:

```text
UI components
feature hooks
service/repository functions
repository interfaces
localStorage repository implementation
```

The current implementation stores data in `localStorage` with the `os-life:*` namespace. Later, a Supabase repository implementation can replace local repositories without rewriting most UI components.

## Modules

- General dashboard
- Gym and training
- Nutrition and future AI calorie estimation from food images
- Sleep tracking
- Body tracking and future AI physique feedback
- Focus and productivity
- Personal finances
- Investment portfolio tracking
- Settings and local data management

## Tech Stack

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui-style primitives
- Zod for validation
- Recharts for charts
- localStorage for temporary persistence
- PWA-ready structure
- Vercel-ready deployment

## Interface Direction

OS-Life uses an iOS-first interface style: large numbers, minimal labels, soft grouped cards, native-feeling bottom navigation, bottom-sheet forms, and subtle motion. The app should feel like a premium mobile health/fitness tool that expands cleanly to desktop.

## Current Sprint Scope

- Premium landing/start page at `/`
- App routes for `/dashboard`, `/nutrition`, `/training`, `/sleep`, `/body`, `/focus`, `/finances`, `/investments`, and `/settings`
- Desktop sidebar and mobile bottom navigation
- Reusable components: `AppShell`, `Sidebar`, `MobileNav`, `PageHeader`, `MetricCard`, `DashboardCard`, `SectionTitle`, `EmptyState`, `QuickActionButton`, `DemoChart`, `AddEntryDialog`, `StatTrend`, and `ModuleSummaryCard`
- Local repositories for daily logs, nutrition, training, body, focus, finances, and investments
- Usable local forms, lists, delete actions, summaries, and charts
- Local calculation services for dashboard, nutrition, training, sleep, body, focus, finances, and investments
- Dashboard life score, priority, recent signals, and weekly trend from local data
- Nutrition daily totals, recent meals, macro summary, and weekly calories/protein charts
- Training multi-set workout logging, weekly summary, and PR-like max-weight summaries
- Sleep recovery message, best/worst night, averages, and weekly chart
- Body check-ins, measurement summary, monthly count, and weight trend
- Focus totals, average quality, top project, and weekly chart
- Finance spend summaries, category chart, and weekly spend chart
- Investment portfolio value, gain/loss, gain/loss percentage, and allocation chart
- Settings page with local data clearing
- Basic PWA manifest and icon

## Environment Variables

No environment variables are required for this local-first sprint.

Future server-only variables:

```bash
OPENAI_API_KEY=
MARKET_DATA_API_KEY=
DATABASE_URL=
```

Future public Supabase variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do not add real values to `.env.example`.

## Public Repo Security Rules

- Never commit real API keys.
- Never commit `.env.local`, `.env`, or `.env.*.local`.
- Never hardcode secrets.
- Do not use `NEXT_PUBLIC_` for secret keys.
- OpenAI API calls must happen server-side only in a future sprint.
- Market data API calls must happen server-side only in a future sprint.
- Future database credentials must stay server-side only.

## Planned AI Features

- AI food image calorie estimation
- AI macro estimation from food photos
- AI physique feedback from body progress photos

These features must be implemented through server-side routes. The browser must never receive `OPENAI_API_KEY`.

## Planned Investment Market Data

Live prices will be added later through a server-side market data route. The browser must never receive `MARKET_DATA_API_KEY`.

## Future Supabase/Postgres Plan

When the local MVP feels right, add Supabase Auth, Postgres schema, RLS policies, and Supabase repository implementations behind the existing repository interfaces. UI components should continue talking to feature hooks instead of direct backend clients.

## Setup

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run format
```

## Roadmap

See `docs/ROADMAP.md`.

## Commit Convention

Use short conventional commits:

```bash
feat: initialize local-first OS-Life PWA
fix: improve local repository validation
docs: update public repo security rules
```
