# Teacher Removal Part 1

## Title
Data Foundation, Shared Contracts, and Additive Migration Baseline

## Why This Part Exists
This part establishes the new database and shared code contracts required by every later part while keeping the current build working. It is the only part that is a hard prerequisite for the others. Parts 2, 3, and 4 should branch only after this part is merged.

The goal here is not to remove teacher behavior yet. The goal is to introduce the new data model in a backward-compatible way so the rest of the migration can be implemented in parallel without schema churn or merge conflicts.

## Order
- This part must be implemented first.
- Parts 2, 3, and 4 may start after this part is merged.
- Part 5 must not start until parts 2, 3, and 4 are merged.

## Product Invariants Introduced In This Part
- The future application roles are only `ADMIN` and `STUDENT`, but `TEACHER` stays temporarily until part 5 so the build does not break early.
- There will be exactly one active admin in the final system.
- Free users are not application users. They are `Lead` records.
- Free tests are identified via a protected system batch called `FREE-Batch`, but code must use a durable internal batch classification, not a raw string comparison.
- Free tests allow one total attempt per lead.
- Paid tests allow four total attempts per student.
- Published tests are immediately available and stay available until archived or deleted.

## Owned Write Scope
Only this part should edit these files or create these new foundational files:

- `prisma/schema.prisma`
- `prisma/migrations/**`
- `prisma/seed.ts`
- `lib/config/platform-policy.ts` (new)
- `lib/utils/contact-normalization.ts` or `lib/utils/phone.ts` (new)
- `lib/validations/contact.schema.ts` (new)
- `__tests__/lib/**` only for new foundational helper tests or additive test updates tied to the new schema contracts

## Files This Part Must Not Edit
Do not edit any of these files in part 1:

- `app/page.tsx`
- `app/(public)/**`
- `app/(auth)/**`
- `app/api/admin/**`
- `app/api/student/**`
- `app/api/arena/**`
- `app/api/teacher/**`
- `proxy.ts`
- `components/layout/**`
- `lib/services/test-service.ts`
- `lib/services/submission-service.ts`
- `lib/services/student-service.ts`
- `lib/services/analytics-service.ts`
- `lib/services/batch-service.ts`
- `lib/auth-context.tsx`

## Detailed Deliverables

### 1. Shared Policy File
Create a single shared policy file used by all later parts. Example file:

- `lib/config/platform-policy.ts`

It should define constants and identifiers that every later part will consume:

- `MAX_PAID_REATTEMPTS = 3`
- `MAX_PAID_TOTAL_ATTEMPTS = 4`
- `MAX_FREE_TOTAL_ATTEMPTS = 1`
- `FREE_BATCH_NAME = 'FREE-Batch'`
- `FREE_BATCH_CODE = 'FREE-BATCH'`
- `FREE_BATCH_KIND = 'FREE_SYSTEM'`

The intent is to remove magic numbers and hard-coded batch-name logic from downstream parts.

### 2. Additive Prisma Changes
Update `prisma/schema.prisma` with additive changes only. Do not remove teacher columns or the teacher enum yet.

Add the following:

- `createdById` on `Test` as a temporary nullable FK to `User`
- `attemptNumber Int @default(1)` on `TestSession`
- `phone` and `phoneNormalized` on `User`
- a new `BatchKind` enum, for example:
  - `FREE_SYSTEM`
  - `STANDARD`
- a new `kind` field on `Batch`
- a new `Lead` model
- a new `LeadTestSession` model

Recommended `Lead` fields:

- `id`
- `name`
- `email`
- `emailNormalized`
- `phone`
- `phoneNormalized`
- `isReviewed`
- `reviewedAt`
- `createdAt`
- `updatedAt`

Recommended `LeadTestSession` fields:

- `id`
- `testId`
- `leadId`
- `status`
- `startedAt`
- `serverDeadline`
- `submittedAt`
- `answers`
- `score`
- `totalMarks`
- `percentage`

Keep the existing `TestSession` model unchanged except for adding `attemptNumber`.

### 3. Additive Migration Strategy
Create migration files that only add or backfill data. Do not drop anything in this part.

Required migration work:

- add new nullable or additive columns
- add new tables and enums
- backfill `createdById` for every existing test to the canonical admin user
- backfill `attemptNumber = 1` for every existing `TestSession`
- initialize `Batch.kind = STANDARD` for existing batches
- create the protected `FREE-Batch` row if it does not exist
- populate `FREE-Batch.kind = FREE_SYSTEM`

### 4. Required Database Constraints
This part must also add the foundational uniqueness constraints needed later.

Required constraints:

- unique paid attempt constraint on `(testId, studentId, attemptNumber)` in `TestSession`
- partial unique index ensuring only one active paid session exists per `(testId, studentId)` where status is `IN_PROGRESS`
- unique free attempt constraint on `(testId, leadId)` in `LeadTestSession`
- partial unique index ensuring only one active free session exists per `(testId, leadId)` where status is `IN_PROGRESS`
- partial unique index enforcing one active admin only
- partial unique indexes preventing duplicate batch assignments and duplicate direct student assignments in `TestAssignment`

If Prisma cannot express a required partial unique index directly, create it via SQL in the migration.

### 5. Contact Normalization Utilities
Add shared normalization helpers that later parts will reuse.

This helper layer should:

- trim and lowercase emails
- normalize phone numbers to a stable storage format
- expose helper functions so part 3 and part 4 do not invent separate normalization rules

Do not bury this logic inside route handlers.

### 6. Validation Baseline
Add shared validation for lead contact capture.

This layer should include:

- name validation
- email validation
- phone validation
- reusable inferred types for lead creation

Do not modify the existing authenticated OTP flow validations yet beyond what is required to keep tests green.

### 7. Seed Updates
Update `prisma/seed.ts` so downstream development has consistent local data.

The seed after part 1 should:

- keep the current app bootable
- guarantee a canonical admin exists
- guarantee `FREE-Batch` exists and is system-classified
- add nullable-safe values for new required fields where necessary
- not delete teacher seed users yet

Teacher records may remain temporarily in seed data in part 1 if needed to keep current app flows stable.

## Build Safety Rules
- Do not delete `teacherId`
- Do not delete `scheduledAt`
- Do not remove `TEACHER` from the enum yet
- Do not remove any route or page
- Make all new fields either nullable or backfilled before enforcing non-null
- Keep the current application bootable without any downstream feature work

## Parallelization Contract For Later Parts
After this part merges, downstream agents may assume:

- `platform-policy.ts` exists and is the single source of truth for attempt limits and the free batch identity
- `Batch.kind` exists
- `Test.createdById` exists
- `Lead` and `LeadTestSession` exist
- `User.phone` and `User.phoneNormalized` exist
- contact normalization helpers exist
- the database can enforce free and paid attempt uniqueness

## Required Tests
Add tests only for foundational behavior:

- normalization helper tests
- policy constant import tests if useful
- migration-safe schema validation updates

Do not attempt to test feature flows that belong to later parts.

## Acceptance Criteria
- `npx prisma generate` succeeds
- migrations apply cleanly on local development data
- existing app still builds without requiring part 2, 3, or 4
- all new foundational files exist and are importable
- no UI behavior is changed yet

## Handoff To Other Parts
This part hands off the stable base needed by:

- part 2 for admin test creation, publish, and assignment rules
- part 3 for lead capture and free test sessions
- part 4 for paid reattempts, analytics, and admin leads

Part 1 is complete when the repository has the future data model available without breaking the current runtime.
