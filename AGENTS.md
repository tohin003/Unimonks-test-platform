# Teacher Removal Coordination Guide

## Goal
Restructure the platform from `ADMIN / TEACHER / STUDENT` into an `ADMIN / STUDENT` product for UNIMONKS CUET Coaching.

The final product must support:

- exactly one admin
- registered paid students using OTP login
- a public landing page at `/`
- free public mock tests with lead capture
- paid mock tests assigned batch-wise by admin
- no teacher routes, role, schema fields, or UI copy anywhere in the repository

## Product Invariants
- `TEACHER` is a legacy concept and must be removed completely by the end of part 5.
- Free users are not application users. They are stored as `Lead` records.
- Free users cannot log in.
- Admin and paid students continue to use OTP login.
- Landing page must show a top-right `Login` button.
- Paid tests allow `1 initial attempt + 3 reattempts = 4 total attempts`.
- Free tests allow exactly `1` total attempt per lead per free test.
- Published tests become immediately available and do not expire automatically.
- Free tests are identified through the protected system batch `FREE-Batch`, but implementation should use an internal durable batch classification rather than raw string checks everywhere.
- Hard deletion is allowed because that is an explicit product decision from the user.

## Delivery Order
The work is intentionally split so multiple agents can work in parallel without fighting over the same files.

Execution order:

1. `teacher_removal_part1.md`
2. `teacher_removal_part2.md`, `teacher_removal_part3.md`, and `teacher_removal_part4.md` in parallel after part 1 merges
3. `teacher_removal_part5.md` last

Do not start part 5 early.

## Canonical Plan Files
- `teacher_removal_part1.md`: additive schema foundation, shared policy/constants, normalization helpers, seed baseline
- `teacher_removal_part2.md`: admin test management convergence
- `teacher_removal_part3.md`: public landing page, free mocks, lead-capture flow
- `teacher_removal_part4.md`: paid attempt logic, analytics, admin leads
- `teacher_removal_part5.md`: teacher deletion, auth cleanup, destructive finalization

Every worker must read this file first and then read the specific part file they are implementing.

## Current Codebase Reality
These legacy areas already exist and are important context:

- teacher role and relations are still present in `prisma/schema.prisma`
- root `/` currently redirects to login in `app/page.tsx`
- teacher auth/routing is currently wired through:
  - `proxy.ts`
  - `components/layout/route-guard.tsx`
  - `components/layout/app-sidebar.tsx`
  - `lib/auth-context.tsx`
  - `app/(public)/login/page.tsx`
- teacher APIs currently live under `app/api/teacher/**`
- teacher pages currently live under `app/(auth)/teacher/**`
- scheduling and retention currently exist in:
  - `lib/services/test-lifecycle.ts`
  - `app/api/cron/tests-retention/route.ts`
- single-attempt assumptions currently exist in:
  - `lib/services/submission-service.ts`
  - `lib/services/student-service.ts`
  - `app/api/arena/start/route.ts`

## Shared Implementation Rules
- Do not edit files owned by another part.
- Do not remove teacher fields or routes until part 5.
- Prefer additive and backward-compatible changes in parts 1 through 4.
- If a part needs a new shared helper, put it in a neutral shared location only if the owning part document allows it.
- Do not silently change business rules outside the assigned part.
- Keep UI copy aligned with the product rules above.

## Parallel-Safe Ownership Summary

### Part 1 owns
- `prisma/schema.prisma`
- `prisma/migrations/**`
- `prisma/seed.ts`
- `lib/config/platform-policy.ts`
- shared normalization and contact validation helpers

### Part 2 owns
- `lib/services/test-service.ts`
- `lib/validations/test.schema.ts`
- `app/api/admin/tests/**` except analytics route owned by part 4
- admin test management pages and components

### Part 3 owns
- `app/page.tsx`
- public landing, SEO, public free mock pages
- `app/api/public/**`
- free test and lead capture services

### Part 4 owns
- `lib/services/submission-service.ts`
- `lib/services/student-service.ts`
- `lib/services/analytics-service.ts`
- `app/api/student/**`
- `app/api/arena/**`
- `app/(auth)/student/**`
- `app/api/admin/leads/**`
- `app/(auth)/admin/leads/**`
- admin test analytics route and page
- admin dashboard attempt/lead metrics

### Part 5 owns
- auth/router cleanup
- teacher route/page deletion
- final schema cleanup removing `TEACHER`, `teacherId`, and `scheduledAt`
- lifecycle/cron removal
- final admin batch/user cleanup
- repo-wide teacher copy removal

## Database End State
By the end of part 5, the database should reflect:

- `Role` contains only `ADMIN` and `STUDENT`
- `Test.createdById` replaces `Test.teacherId`
- `Batch.teacherId` is removed
- `Test.scheduledAt` is removed
- `TestSession.attemptNumber` exists
- one active admin is enforced
- `Lead` exists for public users
- `LeadTestSession` exists for free mock attempts

## Auth End State
- `/login` is for admin and enrolled students only
- free users never enter the OTP auth path
- landing page header contains a login button
- teacher role routing and UI disappear completely

## Before Opening a PR or Handing Off
Each worker should verify:

- their changes stay inside the part write scope
- they did not reintroduce teacher wording
- they did not assume a different attempt limit
- they did not add stringly typed free-batch logic where shared constants should be used
- the assigned part still builds against already-merged prerequisites

## Repo Sweep Terms For Final Cleanup
These terms should eventually disappear from product code by the end of part 5:

- `TEACHER`
- `teacherId`
- `teacherName`
- `/teacher`
- `scheduledAt`
- retention-specific lifecycle logic tied to test expiry
