# Teacher Removal Part 3

## Title
Public Landing Page, Free Mock Catalog, and Lead-Capture Test Flow

## Why This Part Exists
This part builds the public-facing product layer:

- SEO-indexable landing page
- top-right login for admin and paid students
- free mock test catalog
- lead capture before free attempt
- public free-test arena and results flow

This part must not depend on teacher removal. It should be implemented additively so the logged-in app continues to work while the public product is introduced.

## Order
- This part depends on part 1.
- This part may run in parallel with parts 2 and 4 after part 1 is merged.
- This part must be merged before part 5, because part 5 will finalize public/auth cleanup.

## Owned Write Scope
Only this part should edit these files and paths:

- `app/page.tsx`
- `app/layout.tsx` only for metadata and public SEO updates
- `app/(public)/layout.tsx` only if needed to support the new public experience
- new public marketing pages under `app/**` as needed
- new public mock-test pages under `app/**` as needed
- `app/api/public/**` (new)
- `lib/services/free-test-service.ts` (new)
- `lib/services/lead-capture-service.ts` (new)
- `lib/validations/public-test.schema.ts` (new)
- new public/marketing components under `components/**`
- `public/**` only for landing-page assets if needed

## Files This Part Must Not Edit
Do not edit these files in part 3:

- `prisma/schema.prisma`
- `prisma/migrations/**`
- `lib/services/test-service.ts`
- `lib/services/submission-service.ts`
- `lib/services/student-service.ts`
- `lib/services/analytics-service.ts`
- `app/api/admin/**`
- `app/(auth)/admin/**`
- `app/(auth)/student/**`
- `app/api/student/**`
- `app/api/arena/**`
- `app/api/teacher/**`
- `app/(auth)/teacher/**`
- `proxy.ts`
- `components/layout/app-sidebar.tsx`
- `components/layout/route-guard.tsx`
- `lib/auth-context.tsx`
- `app/(public)/login/page.tsx`

## Functional Goal
At the end of this part, the public website must support:

- a landing page for UNIMONKS CUET Coaching
- a `Login` button at top-right that links to the existing login page
- a free mock catalog based on tests assigned to `FREE-Batch`
- lead capture before free attempt
- exactly one total free attempt per lead per free test
- a public result page after submission

Free users must not become authenticated users and must not use OTP login.

## Detailed Deliverables

### 1. Replace Root Redirect With Marketing Landing Page
Replace `app/page.tsx`, which currently redirects to `/login`, with a real landing page.

Required landing-page sections:

- hero
- free mock test CTA
- premium locked section
- why UNIMONKS
- CTA/contact section
- FAQ

The header must include:

- brand/logo on the left
- `Login` on the top right

The `Login` button must route to `/login`, but this part should not modify the login page internals.

### 2. SEO And Metadata
Update `app/layout.tsx` metadata and add SEO support for discoverability.

Required work:

- title and description aligned to UNIMONKS CUET Coaching
- Open Graph metadata
- Twitter metadata
- canonical support
- `robots.ts`
- `sitemap.ts`
- structured data for an educational/coaching organization

### 3. Public Free Mock Catalog
Add public pages and APIs to list only free tests.

The free catalog should:

- list only published tests whose assignments map exclusively to the system free batch
- not expose paid-only tests
- show locked premium cards separately for marketing purposes

Do not infer free/public availability with raw batch names. Use the `Batch.kind` contract from part 1.

### 4. Lead Capture Before Free Start
Before a free mock starts, require:

- full name
- valid email
- valid phone number

Required backend behavior:

- normalize email and phone using part 1 utilities
- if the email matches an existing active student, do not create a visible lead record
- return a clear response instructing the user to use login instead of starting as a free lead
- if the email does not match a student, create or update the `Lead`

Recommended response code for registered students:

- `REGISTERED_STUDENT_USE_LOGIN`

That keeps free leads and paid students cleanly separated.

### 5. Free Session Creation
Create a public session-start API using `LeadTestSession`.

Required behavior:

- if an active free session exists for that lead and test, resume it
- if a completed or timed-out free session already exists, block the new attempt
- if no free session exists, create one
- use `MAX_FREE_TOTAL_ATTEMPTS = 1`

The public free session flow must be independent of the authenticated student `TestSession` flow.

### 6. Public Free Arena
Build the public free-test play flow.

Required behavior:

- same server-authoritative timer model
- per-question answer save or batch save
- submit and score
- free results page after submit

You may reuse arena UI components if that reduces duplication, but do not edit authenticated student arena files owned by part 4.

If code sharing is needed, extract shared presentational components into new files owned by part 3 and consumed by part 4 later.

### 7. Locked Premium Section
The public landing page must also surface a locked premium section.

Required behavior:

- premium mock cards are visible but visually locked
- clicking them must not enter a test
- the CTA should drive the visitor toward enrollment/contact
- it must not rely on login for anonymous free visitors

### 8. Public Result CTA
After a free test result is shown, include strong conversion CTAs:

- enroll to unlock premium mock tests
- contact UNIMONKS
- explore the paid offering

## Build Safety Rules
- Do not modify the OTP login flow in this part
- Do not touch student authenticated routes
- Do not remove any teacher code
- Do not change admin pages
- All public additions must be additive and must coexist with the current app

## Parallelization Contract
This part depends only on part 1.

This part must not overlap with:

- part 2 admin test management files
- part 4 student paid-attempt files and admin leads files
- part 5 auth/router cleanup and destructive removal

If a shared utility is needed and does not exist in part 1, stop and add a note instead of silently editing another part's files.

## Required Tests
Add tests for:

- lead-capture validation
- registered-student email short-circuit
- free-session single-attempt enforcement
- free-session resume behavior
- free catalog listing only free tests

## Acceptance Criteria
- `/` is a real landing page
- landing header contains a top-right `Login` button
- free users can discover and start a free test only after lead capture
- registered students are redirected toward login instead of becoming leads
- free attempts are limited to one total attempt per lead per test
- no authenticated app flow is broken

## Handoff To Other Parts
This part provides:

- the public top-of-funnel product experience
- the free lead-capture pipeline
- the free test attempt flow

Part 4 will later consume `Lead` data on the admin side, and part 5 will later finalize auth copy and teacher cleanup.
