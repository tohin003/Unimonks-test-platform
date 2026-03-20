# Teacher Removal Part 2

## Title
Admin Test Management Convergence

## Why This Part Exists
This part moves all test-authoring capabilities into the admin side without deleting teacher code yet. The output of this part is a complete admin-owned test management path for:

- test CRUD
- question CRUD
- batch assignment
- AI document import

This part is intentionally additive. The old teacher routes and pages remain in place until part 5 so the build stays stable while other parts are developed in parallel.

## Order
- This part depends on part 1.
- This part may run in parallel with parts 3 and 4 after part 1 is merged.
- This part must be merged before part 5.

## Owned Write Scope
Only this part should edit these files and paths:

- `lib/services/test-service.ts`
- `lib/validations/test.schema.ts`
- `app/api/admin/tests/route.ts`
- `app/api/admin/tests/[id]/route.ts`
- `app/api/admin/tests/[id]/questions/route.ts` (new)
- `app/api/admin/tests/[id]/questions/[qId]/route.ts` (new)
- `app/api/admin/tests/[id]/assign/route.ts` (new)
- `app/api/admin/tests/generate-from-doc/route.ts` (new)
- `app/(auth)/admin/tests/page.tsx`
- `app/(auth)/admin/tests/create/page.tsx` (new)
- `app/(auth)/admin/tests/create/**` if split into components
- any new admin-test-specific components

## Files This Part Must Not Edit
Do not edit these files in part 2:

- `prisma/schema.prisma`
- `prisma/migrations/**`
- `app/page.tsx`
- `app/(public)/**`
- `app/api/public/**`
- `lib/services/submission-service.ts`
- `lib/services/student-service.ts`
- `lib/services/analytics-service.ts`
- `app/api/admin/tests/[id]/analytics/route.ts`
- `app/(auth)/admin/tests/[testId]/analytics/**`
- `app/(auth)/student/**`
- `app/api/student/**`
- `app/api/arena/**`
- `proxy.ts`
- `components/layout/**`
- `app/api/teacher/**`
- `app/(auth)/teacher/**`

## Functional Goal
At the end of this part, the admin must be able to do everything the teacher previously did for test management, but through admin-only routes and pages.

That includes:

- creating draft tests
- editing draft tests
- importing questions from a document
- adding, editing, and deleting questions
- assigning tests to batches
- publishing tests immediately
- marking tests free or paid through the assignment rules

Analytics is not in scope for this part. Analytics belongs to part 4.

## Detailed Deliverables

### 1. Refactor Test Service To Admin Ownership
Refactor `lib/services/test-service.ts` so it no longer assumes teacher ownership.

Required changes:

- replace `teacherId`-scoped signatures with admin-scoped signatures
- use `createdById` when creating new tests
- stop using `scheduledAt` in create, update, list, get, or delete operations
- remove lifecycle purge calls
- remove scheduled edit locks
- make `DRAFT` the only editable state
- make `PUBLISHED` immutable
- keep `ARCHIVED` read-only

Delete behavior for this part:

- allow admin hard delete because that is the chosen product decision
- keep hard-delete implementation explicit and auditable

### 2. Free vs Paid Assignment Rule
This part owns the publish-time classification rule.

Use `Batch.kind`, not a raw batch-name string comparison.

Required backend rules:

- if any selected batch has `kind = FREE_SYSTEM`, then all selected batches must be `FREE_SYSTEM`
- if any selected batch is `STANDARD`, none may be `FREE_SYSTEM`
- a test assigned to `FREE_SYSTEM` is a free test
- a test assigned only to `STANDARD` batches is a paid test

Do not add a second source of truth if it can be derived from assignments.

### 3. Admin Test APIs
Build or expand these admin routes:

- `GET /api/admin/tests`
- `POST /api/admin/tests`
- `GET /api/admin/tests/:id`
- `PATCH /api/admin/tests/:id`
- `DELETE /api/admin/tests/:id`
- `GET /api/admin/tests/:id/questions`
- `POST /api/admin/tests/:id/questions`
- `PATCH /api/admin/tests/:id/questions/:qId`
- `DELETE /api/admin/tests/:id/questions/:qId`
- `POST /api/admin/tests/:id/assign`
- `POST /api/admin/tests/generate-from-doc`

Each route should:

- require admin auth
- use the refactored admin-scoped test service
- not reference teacher ownership or teacher access rules

### 4. Port The Existing Builder Instead Of Rewriting It
Do not redesign test building from scratch. Reuse the existing working teacher builder as the admin builder.

Recommended approach:

- create `/app/(auth)/admin/tests/create/page.tsx`
- adapt the current teacher builder to call admin endpoints
- remove schedule/date/time UI from the builder
- preserve working question editor behavior

Required UI behavior:

- `Save Draft`
- `Publish`
- `Assign To Batches`
- `Import via AI`

Publishing must mean immediate availability, not scheduled availability.

### 5. Admin Tests List Page
Upgrade `app/(auth)/admin/tests/page.tsx` from a read-only list/delete page into the admin hub.

Required improvements:

- create-test CTA
- edit existing draft CTA
- assignment visibility
- free vs paid indicator
- no teacher name or teacher email columns
- no scheduled date column

Do not add analytics links yet unless the analytics route and page from part 4 are already present.

### 6. AI Doc Import Route Migration
Port the teacher AI import route to an admin route.

Required changes:

- route path under `/api/admin/tests/generate-from-doc`
- no teacher role assumptions
- audit log should use admin actor identity
- re-use the current parsing and generation pipeline

### 7. Validation Updates
Update `lib/validations/test.schema.ts` to support the new admin flow.

Required changes:

- remove `scheduledAt` from create/update validation
- keep test metadata, settings, and question validations intact
- keep assignment validation aligned with batch-based free/paid rules

## Build Safety Rules
- Do not remove teacher routes or pages in this part
- Do not change auth or routing globals
- Do not change student attempt logic
- Do not change admin analytics service or route
- Keep old teacher pages compiling until part 5 deletes them

## Parallelization Contract
This part may assume the part 1 data model exists.

This part must not create merge conflicts with part 3 or part 4:

- part 3 owns public landing and free-mock flow
- part 4 owns paid attempt logic, student dashboard/results, admin analytics, and admin leads

If a button or link would depend on part 4 and is not ready yet, hide it until part 4 lands.

## Required Tests
Add or update tests for:

- admin test creation
- draft-only edit restrictions
- publish validation
- free-batch-only and paid-batch-only assignment rules
- admin AI import route validation

Do not add attempt-history tests here.

## Acceptance Criteria
- admin can create and publish tests without any teacher routes
- admin can assign tests to free or paid batches
- no admin test endpoint or page references teacher data
- no scheduling UI remains in admin test creation
- the repository still builds with teacher code still present

## Handoff To Other Parts
This part provides:

- the final admin test management surface used by the product
- the publish/assign classification rule consumed by part 3 and part 4

After this part is merged, part 5 can safely remove teacher test-management routes and pages.
