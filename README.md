# EurekaHACKS Application Portal

A themed application portal for EurekaHACKS, built as a pre-interview take-home. Hackers apply through a multi-step form; organizers review, score, and decide on applications from an admin dashboard, with decision emails sent from the same screen.

**Live:** https://eureka-vedh.vercel.app/

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database setup](#database-setup)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
- [Design decisions](#design-decisions)
- [Security model](#security-model)
- [Known limitations](#known-limitations)
- [Deployment](#deployment)
- [Scripts](#scripts)

---

## Overview

The portal has two halves:

**Public side** --> a landing page and a five-step application form. The theme is an expedition through a forest: applying is a trail you walk rather than a form you fill out. Progress is a trail marker, the steps are named Trailhead → The Expedition → Eureka, and the hero is an animated canvas waterfall.

**Organizer side** --> an access-gated dashboard listing every submitted application, with search, status filtering, sorting, and summary stats. Opening an applicant gives a 1–10 score, reviewer notes, and accept / reject / waitlist actions. Deciding sends a templated email and logs it.

---

## Features

### Applicant

- **Five-step form** --> Basics, School, Experience, Project, Motivation. 16 fields chunked so no step is a wall of inputs.
- **Per-step validation** -->  errors surface inline, before you can advance.
- **Autosave with draft resume** --> writes to `localStorage` and Supabase on a 1.5s debounce. Close the tab mid-question, come back, and your answers are still there.
- **Live save indicator** --> "Saving draft…" → "Saved just now".
- **Success state** with a summary of what was submitted.

### Organizer

- **Access gate** --> code-protected entry point (see [Security model](#security-model)).
- **Dashboard** --> all submitted applications, drafts excluded.
- **Search** across name, email, and school.
- **Filter** by status: all / pending / accepted / rejected / waitlisted.
- **Sort** by newest, oldest, score high→low, score low→high, or name.
- **Stats bar** --> totals per status, count reviewed, average score.
- **Applicant profile** --> full application, 1–10 score selector, reviewer notes.
- **Decisions** --> accept / reject / waitlist, with optimistic UI.
- **Decision emails** --> rendered from a template, previewed in a modal before sending, logged to `email_logs` with the full HTML body as an audit trail.

### Design

- Custom design system (`Button`, `Input`, `Modal`, `StatusBadge`) for consistent UI across both halves.
- Animated canvas waterfall in the hero --> gravity-accelerated droplets, spray, splash, and rising mist.
- Four animated SVG scenes (river, canopy, clearing, dusk) used as section backgrounds.
- Hand-inked outline treatment on sequenced cards; hairline rules elsewhere.
- Respects `prefers-reduced-motion`.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 + TypeScript | Type safety across the app/DB boundary |
| Build | Vite 5 | Fast dev server, minimal config |
| Styling | Tailwind CSS 3 | Custom theme tokens for the forest palette |
| Icons | lucide-react | Consistent stroke weights |
| Database | Supabase (Postgres) | Shared source of truth between applicant and reviewer |
| Email | Resend via Vercel serverless function | Keeps the API key server-side |
| Hosting | Vercel | Static frontend + serverless API in one deploy |
| Routing | Native hash routing | Four routes; no dependency needed |

---

## Getting started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Resend account (optional --> the app degrades gracefully without it)

### Install

```bash
git clone https://github.com/vedh-sonawane/eurekawebdev.git
cd eurekawebdev
npm install
```

### Configure

Create a `.env` in the project root --> see [Environment variables](#environment-variables).

### Run

```bash
npm run dev
```

Open http://localhost:5173

> **Note:** the `/api/send-email` route is a Vercel serverless function and does not run under `vite dev`. Email sending will fail locally unless you use `vercel dev` instead. Everything else works.

---

## Environment variables

| Variable | Scope | Required | Description |
|---|---|---|---|
| `VITE_SUPABASE_URL` | client | yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | client | yes | Supabase anon/public key |
| `RESEND_API_KEY` | **server only** | no | Resend API key, read by `/api/send-email` |

`.env` example:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
RESEND_API_KEY=re_your_key
```

> ⚠️ **Never prefix the Resend key with `VITE_`.** Vite inlines any `VITE_*` variable into the client bundle, which would publish a key capable of sending mail as you. It belongs in Vercel's environment variables as `RESEND_API_KEY`, server-side only.

`.env` is gitignored and must stay that way.

---

## Database setup

Two migrations live in `supabase/migrations/`. Run them in order via the Supabase SQL editor or CLI:

```bash
supabase db push
```

### `applications`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK, `gen_random_uuid()` |
| `full_name`, `email`, `school`, `grade`, `location` | text | Basics |
| `programming_experience`, `previous_hackathons`, `technologies` | text | Experience |
| `best_project`, `github_link`, `portfolio_link`, `project_description` | text | Project |
| `motivation`, `contribution`, `additional_info` | text | Motivation |
| `status` | text | `pending` \| `accepted` \| `rejected` \| `waitlisted`, default `pending` |
| `score` | int | nullable --> `null` means *not yet reviewed* |
| `reviewer_notes` | text | nullable |
| `submitted_at` | timestamptz | **`null` = draft, non-null = submitted** |
| `created_at`, `updated_at` | timestamptz | |

### `email_logs`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `application_id` | uuid | FK → `applications`, cascade delete |
| `recipient_email`, `recipient_name` | text | |
| `subject`, `body_html` | text | Full rendered email, kept for audit |
| `decision` | text | `accepted` \| `rejected` \| `waitlisted` |
| `sent_at` | timestamptz | |

Both tables have RLS **enabled** with permissive prototype policies --> see [Security model](#security-model).

---

## Project structure

```
├── api/
│   └── send-email.ts          Vercel serverless fn → Resend (server-side key)
├── supabase/migrations/       applications + email_logs schema
└── src/
    ├── main.tsx               entry
    ├── App.tsx                hash router (#/apply, #/admin)
    ├── index.css              theme tokens + utility classes
    ├── hooks/
    │   └── useLocalStorage.ts generic typed localStorage hook
    ├── lib/
    │   ├── supabase.ts        client, Application type, ApplicationStatus union
    │   ├── emailTemplates.ts  decision emails → HTML
    │   └── emailSender.ts     logs to email_logs, POSTs /api/send-email
    └── components/
        ├── LandingPage.tsx
        ├── ApplicationForm.tsx      5-step form, validation, autosave
        ├── ProgressTrail.tsx        step indicator
        ├── ApplicationComplete.tsx  success state
        ├── ForestEnvironment.tsx    canvas waterfall (hero only)
        ├── ForestScene.tsx          SVG scenes: river/canopy/clearing/dusk
        ├── MentorsSection.tsx
        ├── ExecSection.tsx
        ├── ui/                      Button, Input, Modal, StatusBadge
        └── admin/
            ├── AdminAccess.tsx      access-code gate
            ├── AdminDashboard.tsx   list, search, filter, sort, stats
            ├── ApplicantProfile.tsx score, notes, decisions
            └── EmailPreviewModal.tsx
```

---

## How it works

### Routing

No router library. `App.tsx` reads `window.location.hash`, listens for `hashchange`, and maps to a `Route` union type:

| Hash | Route |
|---|---|
| *(none)* | `home` |
| `#/apply` | `apply` |
| `#/admin` | `admin-access`, or `admin-dashboard` if already authenticated |

Hash routing needs zero server rewrite config on static hosting.

**Admin discovery:** triple-click the compass in the footer. An easter egg, not a security boundary.

### Applicant flow

1. Typing updates `data` state.
2. A 1.5s debounce fires → writes `localStorage['eurekahacks_draft']` **and** upserts to Supabase with `submitted_at: null`.
3. The first autosave `INSERT`s and stores the returned id in `recordId`; every later save `UPDATE`s that row. This is what stops a new row being created per keystroke.
4. Reload → a mount effect restores `data` and `recordId` from localStorage.
5. Submit → validate → `UPDATE` with `submitted_at: new Date()` → clear the draft → success screen.

If the Supabase write throws, the catch is intentionally empty: localStorage already succeeded, so the user loses nothing.

### Reviewer flow

1. Access code → `localStorage.isExecutive = 'true'`.
2. Dashboard fetches `.select('*').not('submitted_at', 'is', null)` --> **drafts never appear**.
3. Filter, search, and sort run client-side in a `useMemo`.
4. Score + notes + decision → `UPDATE` Supabase → optimistic local state update.
5. If the status changed to a decision state, `sendDecisionEmail` renders the template, inserts a row into `email_logs`, then POSTs `/api/send-email`, which calls Resend with the server-side key.

---

## Design decisions

**Five steps, not one long form.** Sixteen fields in one column is a wall. Each step validates before advancing so errors surface near where you made them.

**Autosave on a 1.5s debounce.** Applications get abandoned; drafts are the fix. Debounced because saving per keystroke is a request per character --> 1.5s is roughly the pause between thoughts.

**A draft is the same row as a submission**, keyed on `submitted_at IS NULL`. One table, one lifecycle, no separate drafts table and no promotion step. The dashboard's `.not('submitted_at', 'is', null)` is the only thing keeping half-typed rows off an organizer's screen.

**Draft state in both localStorage and Supabase.** localStorage is instant and survives network failure; Supabase survives a device change. They serve different failure modes.

**`score` is nullable, not `0`.** `null` means *not reviewed*; `0` would mean *reviewed and scored zero*. The "reviewed" stat counts `score !== null` *that only works if null is preserved.

**Optimistic UI on decisions.** The badge changes immediately rather than waiting on a round trip. Across 200 applications that latency compounds.

**Email preview before sending.** Decisions are irreversible and emotional. Showing the exact email is a guardrail.

**Canvas for the waterfall, SVG for the scenes.** The waterfall runs ~400 particles a frame with gravity, a canvas job. The static scenes are declarative shapes that scale: SVG with SMIL, no JS.

**The theme lives in the copy.** "Trailhead", "The Expedition", "Eureka", a trail-marker progress bar, a wooden admin gate. A palette alone isn't a theme.

---

## Security model

> **This is a prototype access layer, not authentication.** It is documented as such in the UI and in the migration comments.

Current state:

- The admin gate compares against a hardcoded code and sets `localStorage.isExecutive = 'true'`. Setting that flag manually in DevTools bypasses it entirely.
- RLS is **enabled** on both tables, but policies grant `anon` full CRUD.
- The Supabase anon key ships in the client bundle by design.

Taken together: **anyone who can read the JS bundle can read, edit, or delete every application.** This was an accepted trade for a prototype with fake data. it allowed the full review flow to be built without an auth system.

### Path to production

1. Add Supabase Auth (email magic link) for organizers.
2. Add an `organizers` table mapping `user_id` → role.
3. Rewrite policies:
   - `applications` INSERT: stays open to `anon` (hackers apply without accounts).
   - `applications` SELECT/UPDATE/DELETE: require `auth.uid() IN (SELECT user_id FROM organizers)`.
   - `email_logs`: organizer-only across the board.
4. Delete the client-side code check and the hint that reveals the demo code after two failed attempts.

---

## Known limitations

- **Auth is simulated** --> see above. This is the first thing to fix.
- **The access gate reveals the demo code** after two failed attempts. Intentional for demoing, indefensible in production.
- **No CSV export.**
- **No bulk actions** --> an organizer can't accept 40 waitlisted applicants at once.
- **Abandoned drafts accumulate.** Someone types a name and leaves → a row forever. Needs a TTL or cleanup job.
- **All rows fetched at once.** Fine at 500 applications; past a few thousand this needs `.range()` pagination and list windowing.
- **No test coverage.** First targets would be `validateStep` and the draft restore path.
- **`/api/send-email` doesn't run under `vite dev`** --> use `vercel dev` to test emails locally.

---

## Deployment

Deployed on Vercel from `main`.

1. Import the repo into Vercel.
2. Framework preset: **Vite**. Build: `npm run build`. Output: `dist`.
3. Add environment variables under Settings → Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY` *(no `VITE_` prefix)*
4. Deploy. `api/send-email.ts` is picked up automatically as a serverless function.

`npm run build` runs a full type check. *A typeScript error fails the deploy. Run it locally before pushing.

---

## Scripts

```bash
npm run dev        # Vite dev server
npm run build      # production build (type-checks; fails on TS errors)
npm run preview    # serve the production build locally
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

---

## Notes

Mentor and executive listings on the landing page are **placeholder data** for demonstration purposes and do not represent real EurekaHACKS staff.

Built by Vedh Sonawane as a pre-interview build for the EurekaHACKS web development team.