# Teacher Removal Part 4

## Title
Paid Student Attempt Limits, Attempt Analytics, and Admin Leads

## Why This Part Exists
This part handles the operational heart of the new product:

- paid student reattempts
- attempt history and analytics
- admin lead management
- hiding leads whose email matches registered students

This part is separate from part 3 on purpose. Part 3 owns public lead capture and free-test entry. Part 4 owns the internal admin lead queue and the authenticated student attempt experience.

## Order
- This part depends on part 1.
- This part may run in parallel with parts 2 and 3 after part 1 is merged.
- This part must be merged before part 5.

## Owned Write Scope
Only this part should edit these files and paths:

- `lib/services/submission-service.ts`
- `lib/services/student-service.ts`
- `lib/services/analytics-service.ts`
- `lib/services/lead-admin-service.ts` (new)
- `app/api/student/**`
- `app/api/arena/**`
- `app/(auth)/student/**`
- `app/api/admin/leads/**` (new)
- `app/(auth)/admin/leads/**` (new)
- `app/api/admin/tests/[id]/analytics/route.ts` (new)
- `app/(auth)/admin/tests/[testId]/analytics/**` (new)
- `app/api/admin/analytics/overview/route.ts`
- `app/(auth)/admin/dashboard/page.tsx`

## Files This Part Must Not Edit
Do not edit these files in part 4:

- `prisma/schema.prisma`
- `prisma/migrations/**`
- `app/page.tsx`
- `app/(public)/**`
- `app/api/public/**`
- `lib/services/test-service.ts`
- `app/api/admin/tests/route.ts`
- `app/api/admin/tests/[id]/route.ts`
- `app/api/admin/tests/[id]/questions/**`
- `app/api/admin/tests/[id]/assign/route.ts`
- `app/api/admin/tests/generate-from-doc/route.ts`
- `app/(auth)/admin/tests/page.tsx`
- `app/(auth)/admin/tests/create/**`
- `app/api/teacher/**`
- `app/(auth)/teacher/**`
- `proxy.ts`
- `components/layout/**`
- `lib/auth-context.tsx`

## Functional Goal
At the end of this part:

- a paid student can take up to four total attempts per paid mock test
- only one in-progress paid attempt may exist at a time for a student/test pair
- the student dashboard and results pages show attempt history
- admin analytics can see latest-attempt summaries plus full attempt history
- admin can review new leads and mark them with a checkbox
- any lead whose email matches a registered student is hidden from the actionable lead queue

## Detailed Deliverables

### 1. Paid Attempt Limit Logic
Refactor `lib/services/submission-service.ts`.

Required paid-attempt behavior:

- if an `IN_PROGRESS` session exists, resume it
- if no `IN_PROGRESS` session exists, count completed attempts
- if completed attempts are less than `MAX_PAID_TOTAL_ATTEMPTS`, create a new session with `attemptNumber = completedAttempts + 1`
- if completed attempts are already at the limit, return `ATTEMPT_LIMIT_REACHED`

Remove old behavior tied to:

- `ALREADY_COMPLETED`
- `NOT_STARTED`
- `WINDOW_CLOSED`
- `scheduledAt`

Do not change free-test session logic here. That belongs to part 3.

### 2. Paid Student Dashboard And Results
Refactor `lib/services/student-service.ts` and the authenticated student pages.

Required data changes:

- remove `teacherName`
- remove `scheduledAt`
- return `attemptsUsed`
- return `attemptsRemaining`
- return `canStartAttempt`
- return `hasInProgressSession`
- return `latestAttempt`
- return `bestAttempt`
- return `attemptHistory`

Required UI changes:

- show `Attempt X of 4`
- show `Reattempt` when remaining attempts exist
- show `Resume` when an in-progress attempt exists
- show `Attempt limit reached` after the 4th total attempt
- results page must show the current attempt number and prior attempts for the same test

### 3. Admin Test Analytics
Extend `lib/services/analytics-service.ts` and add the admin analytics route and page.

Required analytics semantics:

- `totalAttempts` counts every completed attempt
- `uniqueStudents` counts distinct students
- summary leaderboards use the latest completed attempt per student
- detailed drilldown shows all attempts per student in attempt-number order

Per-question analytics rule:

- use latest completed attempt per student for summary correctness metrics
- optionally expose all-attempt raw counts in the detailed payload if needed

Do not reintroduce teacher-scoped analytics.

### 4. Admin Leads Queue
Build `GET /api/admin/leads` and the `/admin/leads` page.

Required lead fields in the admin table:

- lead name
- lead email
- lead phone
- source test
- current score or session summary if available
- createdAt
- reviewed checkbox

Filtering requirements:

- search by name, email, phone
- filter reviewed vs unreviewed
- sort newest first by default

### 5. Lead Deduplication Against Registered Students
This is a hard product rule.

Required backend behavior:

- when fetching leads for the admin queue, exclude any lead whose normalized email matches an existing registered student
- do not merely hide this in the UI; hide it in the backend query

Recommended behavior:

- preserve the lead in the database if useful for reporting
- omit it from the actionable queue returned by `/api/admin/leads`

### 6. Reviewed Checkbox Flow
The admin page must allow a simple checkbox-driven workflow.

Required behavior:

- checking the box marks `isReviewed = true`
- optionally store `reviewedAt`
- unchecking the box can revert the lead back to unreviewed if the product wants that flexibility

Audit logging for lead review state changes is recommended.

### 7. Admin Dashboard Additions
Update the admin dashboard to show:

- total students
- total tests
- total attempts
- active sessions
- new leads count
- optionally reviewed-today count

Do not show teacher metrics anymore once this part lands, even if teacher code still exists elsewhere.

## Build Safety Rules
- Do not touch public landing or free-test routes
- Do not touch admin test CRUD files owned by part 2
- Do not delete teacher routes or teacher pages
- Keep the authenticated student app buildable even before part 5 deletes old teacher code

## Parallelization Contract
This part assumes part 1 has already provided:

- `attemptNumber`
- `Lead`
- `LeadTestSession`
- normalized contact helpers
- attempt-limit constants

This part must not create conflicts with:

- part 2 admin CRUD pages
- part 3 public free-flow pages and APIs
- part 5 destructive teacher removal

If analytics buttons in admin test pages are added by part 2 later, they should target the route/page implemented here.

## Required Tests
Add or update tests for:

- 4-total-attempt paid limit
- in-progress session resume behavior
- correct `attemptNumber` assignment
- attempt history ordering
- lead exclusion when email matches a student
- lead review checkbox state change
- admin analytics latest-attempt summary logic

## Acceptance Criteria
- paid students can take up to 4 total attempts
- no second active paid session can be created for the same test/student pair
- results and dashboard show attempt history correctly
- admin can see and review actionable leads
- leads matching student emails are not shown in the lead queue
- admin analytics reflects reattempt behavior clearly

## Handoff To Other Parts
This part provides:

- the final paid-student attempt model
- the final admin lead-management experience
- the final admin analytics behavior

Part 5 can only remove teacher analytics/pages and finalize auth cleanup after this part is merged.
