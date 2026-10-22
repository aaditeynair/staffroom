# Staffroom

**Absence and substitution management for school staff.**

When a teacher calls in sick, someone still has to teach their six periods. Staffroom
turns that scramble into a workflow: teachers request leave, admins approve it, the app
ranks who should cover each missed period, and everyone gets notified.

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-149ECA.svg)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E.svg)](https://supabase.com)

---

> ### ⚠️ Project status
>
> **This project is abandoned and very incomplete.**
>
> It is no longer actively maintained, no longer deployed, and is published as-is purely
> as a reference and as a starting point for anyone who wants to take it further. Large
> parts of the original deployment infrastructure no longer exist, several features are
> half-built, and there is no test suite.
>
> Expect to spend real time finishing it before it is usable in production. If you pick
> it up, issues and pull requests are welcome — but please don't expect a response.

---

## Table of contents

- [What it does](#what-it-does)
- [Features](#features)
- [The substitution engine](#the-substitution-engine)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Database schema](#database-schema)
- [Push notifications (optional)](#push-notifications-optional)
- [Roles](#roles)
- [Project structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## What it does

Staffroom models a school day as a **weekly timetable** (`base_timetable`) with optional
**daily overrides** (`daily_timetable`), and teachers as members of a **Junior** or
**Senior** division.

The core loop:

1. A **teacher** submits a leave request for a date, with a reason and a type (full day,
   morning, or afternoon).
2. An **admin** approves or rejects it. A confirmed absence marks the teacher unavailable
   for that entire day.
3. The admin opens the absence and Staffroom computes a **ranked list of substitute
   candidates for every period** the absent teacher was meant to teach.
4. The admin picks a **primary substitute and a fallback** for each period. The form
   won't submit until every period has both.
5. The substitute is notified. If they can't take it, they decline, and Staffroom
   **promotes the fallback** and recomputes.

---

## Features

### For teachers

- **Today's timetable** — the current day's periods, highlighting your own classes and
  any periods you're covering as a substitute.
- **Weekly timetable** — Monday to Friday, from the base timetable.
- **Leave requests** — request full day, morning, or afternoon leave with a reason.
  Duplicate requests for the same date are rejected.
- **Assigned substitutions** — see the substitutions you've been assigned, and request
  reassignment with a reason if you can't make it.
- **Push notifications** — optional, via OneSignal.
- **Installable PWA** — installable to the home screen on mobile.

### For admins

- **Dashboard** — today's absences, substitutions today, uncovered absences, and pending
  requests, with inline approve/reject.
- **Absence detail** — per-period substitute candidates, scored and colour-coded, with
  primary and fallback selection.
- **Substitution overview** — filterable table of upcoming substitutions, plus a form
  for creating manual substitutions outside the absence workflow.
- **Teacher management** — create, edit, and delete teacher accounts, send email
  invitations, and view an individual teacher's timetable, absences, and substitutions.
- **Timetable viewer** — the base timetable by teacher or by class.

---

## The substitution engine

The interesting part of the codebase is `lib/substitutionEngine.ts` — it doesn't just
list who's free, it *ranks* candidates so the least-loaded, most-appropriate teacher
gets picked.

**Availability.** A teacher is busy during a period if that period appears in their
`base_timetable` **or** their `daily_timetable` for that date. A teacher with a confirmed
absence that day is treated as busy for every period.

**Hard filters.** A candidate is discarded unless:

- they have at least **2 free periods** that day, and
- their longest run of consecutive busy periods is at most **4**.

The first rule stops you from dumping everything on someone who has a mostly free day;
the second stops you from stacking six periods onto a teacher who already has a heavy
block.

**Scoring.** Surviving candidates are scored:

| Signal | Points |
| --- | --- |
| Teaches the target class | +3 |
| Same division as the target class | +2 |
| At least 2 free periods that day | +1 |
| No heavy streak of busy periods | +1 |

Candidates are sorted by score descending. The UI shows the score as coloured dots —
green above 4, red at 2 or below, amber in between.

**Division matching.** A class name like `7B` resolves to a division by grade number:
grades 1–5 are Junior, 6 and up are Senior (`lib/getClassDivision.ts`).

**Fallback promotion.** Every substitution stores a `fallback` teacher. When a substitute
declines, `lib/getFallback.ts` recomputes the candidate list, excludes anyone who has
already declined that period, and promotes the previous fallback to substitute — then
picks a new fallback from the remaining candidates.

---

## Tech stack

| | |
| --- | --- |
| Framework | Next.js 15 (App Router, React Server Components) |
| UI | React 19, TypeScript |
| Styling | Material UI 7 + Tailwind CSS 4 |
| Backend | Supabase (Postgres, GoTrue auth, Row Level Security) |
| Notifications | OneSignal (optional) |
| Dates | Day.js |
| PWA | Web app manifest + OneSignal service worker |

---

## Quick start

**Prerequisites:** Node.js 20+, a Supabase project, and (optionally) a OneSignal app.

```bash
git clone https://github.com/aaditeynair/staffroom.git
cd staffroom
npm ci
cp .env.example .env.local   # then fill in your values
npm run dev
```

The app runs at <http://localhost:3000>.

```bash
npm run dev     # start the dev server
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Create the five tables described in [Database schema](#database-schema). This repo
   ships **no SQL migrations**, so you'll need to create them yourself.
3. Turn on **Row Level Security** and write policies for each table. This matters more
   than usual here: the admin UI writes directly through the browser's Supabase client,
   so RLS is the only thing enforcing who can read or modify teacher records.
4. Create a user in Supabase Auth, then insert a matching row into `teachers` with the
   same email and set `auth_id` to the auth user's UUID. The login page links the two
   automatically on first sign-in if `auth_id` is empty.
5. Set the teacher's `password_set` to `false` so they're routed to `/set-password` to
   choose a password.
6. Seed a `base_timetable` so there's something to schedule against.

---

## Environment variables

Copy `.env.example` to `.env.local`. Everything is read from the environment; no
credentials are committed to this repository.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon key (public by design) |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Service role key — **server-side only**, bypasses RLS |
| `SUPABASE_WEBHOOK_SECRET` | for webhooks | Bearer token the webhooks authenticate with |
| `NEXT_PUBLIC_ONESIGNAL_APP_ID` | no | OneSignal App ID for push notifications |
| `ONESIGNAL_REST_API_KEY` | no | OneSignal REST API key, used by the webhook routes |

---

## Database schema

No migrations are included. This is the shape the app expects.

### `teachers`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid / text | Primary key |
| `name` | text | Display name |
| `email` | text | Unique; used to match Supabase Auth users |
| `auth_id` | uuid | Links to `auth.users.id`; backfilled on first login |
| `role` | text | `admin`, `teacher`, or `admin-teacher` |
| `division` | text | `Junior` or `Senior` |
| `password_set` | boolean | `false` forces the user through `/set-password` |

### `absences`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid / text | Primary key |
| `teacher_id` | uuid / text | → `teachers.id` |
| `date` | date | The day of the absence |
| `leave_type` | text | Full day, morning, or afternoon |
| `reason` | text | Personal, Sick, or free text |
| `status` | text | `pending`, `confirmed`, or `rejected` |
| `dealt_with` | boolean | `true` once substitutions have been assigned |
| `created_at` | timestamptz | |

### `substitutions`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid / text | Primary key |
| `date` | date | |
| `period_number` | integer | Period within the day |
| `classes` | text[] | Classes being covered |
| `original_teacher` | uuid / text | → `teachers.id`, the absent teacher |
| `substitute_teacher` | uuid / text | → `teachers.id`, who is covering |
| `fallback` | uuid / text | → `teachers.id`, promoted if the substitute declines |
| `for_absence` | uuid / text | → `absences.id` |
| `accepted` | boolean | Whether the substitute has taken it |
| `reason` | text | Why it was reassigned, when it was |

### `base_timetable`

The recurring weekly timetable.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid / text | Primary key |
| `teacher_id` | uuid / text | → `teachers.id` |
| `day_of_week` | text | `Monday` … `Saturday` |
| `period_number` | integer | |
| `classes` | text[] | e.g. `['7B']` |
| `is_substitution` | boolean | Marks a period as a permanent substitution slot |

### `daily_timetable`

Overrides for a specific date.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid / text | Primary key |
| `teacher_id` | uuid / text | → `teachers.id` |
| `date` | date | |
| `period_number` | integer | |
| `classes` | text[] | |
| `is_substitute` | boolean | This teacher is covering, not teaching their own class |

---

## Push notifications (optional)

Staffroom can notify admins and substitutes via OneSignal. **This is entirely optional**
— if `NEXT_PUBLIC_ONESIGNAL_APP_ID` is unset, the app runs normally and simply never
sends a push notification.

Create a free app at [onesignal.com](https://onesignal.com), then register three
[Supabase Database Webhooks](https://supabase.com/docs/guides/database-webhooks):

| Event | Route |
| --- | --- |
| Insert on `absences` | `/api/webhooks/absence-creation` |
| Update on `absences` | `/api/webhooks/absence-status-change` |
| Insert on `substitutions` | `/api/webhooks/substitution-creation` |

Each route expects an `Authorization: Bearer <SUPABASE_WEBHOOK_SECRET>` header and
returns `401` without it. They use the service role key to look up recipients and the
OneSignal REST API to deliver the push. OneSignal's external user id is the Supabase
auth user's UUID, so `teachers.auth_id` is what maps a teacher to their device.

---

## Roles

| Role | Access |
| --- | --- |
| `admin` | Full access to the admin area and all teacher management |
| `admin-teacher` | Both the admin and teacher areas, in one navigation |
| `teacher` | The teacher area only |

Role checks live in `lib/auth.ts` (`requireRole`) and are enforced by the admin and
teacher layouts. Unauthenticated requests are redirected to `/login` by the Supabase
session middleware.

---

## Project structure

```
app/
  admin/                 Admin area (dashboard, teachers, substitutions, timetable)
  teacher/               Teacher area (dashboard, timetable, leave, substitutions)
  api/webhooks/          Supabase Database Webhook -> OneSignal push
  login/  set-password/  Auth flows
  layout.tsx  page.tsx   Root layout and role-based redirect
components/
  admin/  teacher(s)/    Feature components
  layout/                Drawer, header, navigation
  onesignal/             Push notification bootstrap
  ui/                    Profile, dialogs, password change
lib/
  auth.ts                Role guard
  substitutionEngine.ts  Candidate scoring
  fetchAvailableTeachers.ts  Per-period candidate generation
  getFallback.ts         Fallback promotion on decline
  getClassDivision.ts    Class name -> Junior/Senior
  supabase/              Browser, server, and middleware clients
```

---

## Deployment

The app is a standard Next.js application and deploys to Vercel without modification:

```bash
vercel
```

Set the environment variables from [.env.example](#environment-variables) in the
Vercel project settings. `SUPABASE_SERVICE_ROLE_KEY` and `ONESIGNAL_REST_API_KEY` are
server-only — never prefix them with `NEXT_PUBLIC_`.

---

## Contributing

Contributions are welcome, but please keep in mind that this project is unmaintained and
there is no roadmap. Before opening a large pull request, open an issue to discuss the
approach.

```bash
npm ci
npm run lint
npx tsc --noEmit
```

---

## License

[MIT](LICENSE) © 2026 Aaditey Nair
