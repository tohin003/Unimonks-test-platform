# Teacher Removal Part 5

## Title
Teacher Deletion, Auth Cleanup, and Destructive Finalization

## Why This Part Exists
This is the destructive cleanup pass. It removes all legacy teacher references after the replacement systems from parts 2, 3, and 4 are already in place.

This part must be last. It is the only part allowed to delete:

- teacher routes
- teacher pages
- teacher enum values
- teacher columns
- scheduled lifecycle columns
- retention cron

If this part is attempted too early, the build will break and downstream feature branches will fight over route/auth state.

## Order
- This part depends on parts 1, 2, 3, and 4 being merged.
- This part must run last.

## Owned Write Scope
Only this part should edit or delete these files and paths:

- `proxy.ts`
- `components/layout/route-guard.tsx`
- `components/layout/app-sidebar.tsx`
- `lib/auth-context.tsx`
- `app/(public)/login/page.tsx`
- `app/api/auth/**` only where role mappings or copy must change
- `app/api/teacher/**` (delete)
- `app/(auth)/teacher/**` (delete)
- `lib/validations/user.schema.ts`
- `lib/services/user-service.ts`
- `app/(auth)/admin/users/page.tsx`
- `app/(auth)/admin/batches/page.tsx`
- `app/(auth)/admin/batches/[batchId]/page.tsx`
- `app/(auth)/admin/dashboard/page.tsx`
- `lib/services/batch-service.ts` only for final teacher field removal cleanup if still needed
- `lib/services/test-lifecycle.ts`
- `app/api/cron/tests-retention/route.ts` (delete)
- `vercel.json`
- `prisma/schema.prisma`
- `prisma/migrations/**`
- `prisma/seed.ts`
- `README.md`
- `API_README.md`
- any obsolete archive docs if you want to update them
- `__tests__/lib/**` for final role and lifecycle cleanup

## Files This Part Must Not Edit
Do not redesign or re-scope the features delivered in parts 2, 3, and 4 here. This part is for removal, cleanup, and final hardening only.

In particular, do not introduce new product behavior in:

- admin test CRUD
- public free-test flow
- paid attempt limits
- admin leads business rules

## Functional Goal
At the end of this part:

- the repository contains no teacher role, route, page, or copy
- auth only understands `ADMIN` and `STUDENT`
- login is clearly for admin and enrolled students only
- batch management contains no teacher assignment
- user management cannot create teachers and cannot create additional admins
- there is no schedule-based lifecycle or retention cron
- destructive schema cleanup is complete

## Detailed Deliverables

### 1. Auth And Route Global Cleanup
Update the global auth/router layer.

Required files:

- `proxy.ts`
- `components/layout/route-guard.tsx`
- `components/layout/app-sidebar.tsx`
- `lib/auth-context.tsx`
- `app/(public)/login/page.tsx`

Required changes:

- remove teacher route maps
- remove teacher redirect targets
- remove teacher sidebar items
- remove teacher role from client types
- update login copy to say login is for admin and enrolled students only

### 2. Delete Teacher Routes And Pages
Delete:

- `app/api/teacher/**`
- `app/(auth)/teacher/**`

Before deleting, verify that:

- admin replacement routes exist
- admin replacement pages exist
- no live navigation points at teacher routes anymore

### 3. Final User-Management Cleanup
Update admin user management to reflect the final product.

Required changes:

- remove teacher from filters and dropdowns
- remove teacher creation paths
- remove multiple-admin creation from the UI
- protect the sole admin from accidental deactivation or deletion

This part owns the final cleanup in:

- `lib/validations/user.schema.ts`
- `lib/services/user-service.ts`
- `app/(auth)/admin/users/page.tsx`

### 4. Final Batch Cleanup
Remove all teacher UI and response remnants from batch management.

Required changes:

- no teacher column in batch lists
- no teacher assignment in batch create/edit
- no teacher detail in batch detail view
- protect `FREE-Batch` as a system batch from accidental rename/delete unless the product explicitly allows it

### 5. Final Destructive Prisma Cleanup
Now that replacement systems exist, apply the destructive schema cleanup.

Required cleanup:

- drop `Batch.teacherId`
- drop the teacher relation on `Batch`
- drop `Test.teacherId`
- make `Test.createdById` required
- drop `scheduledAt`
- remove `TEACHER` from `Role`
- remove teacher-side relations from `User`

Delete teacher users only after:

- all tests have been backfilled to admin ownership
- all sessions are invalidated
- no FK still points to teacher rows

If any historical audit-log retention issue exists, resolve it safely before deletion.

### 6. Remove Schedule-Based Lifecycle And Retention
Delete the old schedule/retention feature set.

Required changes:

- delete `app/api/cron/tests-retention/route.ts`
- remove cron config from `vercel.json`
- remove retention and schedule logic from `lib/services/test-lifecycle.ts`
- replace tests tied to lifecycle timing with tests tied to current delete helpers if any helpers remain

### 7. Seed And Docs Cleanup
Update:

- `prisma/seed.ts`
- `README.md`
- `API_README.md`

The repo documentation after this part must describe:

- admin and student only
- public landing page
- free leads and free mocks
- paid students and 4-attempt rule
- no teachers

### 8. Global Repo Sweep
Run a final grep and remove all remaining teacher references.

Required search terms:

- `TEACHER`
- `teacherId`
- `teacherName`
- `/teacher`
- `Teacher`
- `scheduledAt`
- `tests-retention`

Any remaining result must be either:

- deleted
- migrated
- or intentionally preserved in archived historical docs with clear labeling

## Build Safety Rules
- Do not start this part until the replacement systems are already merged
- Delete only after replacement routes/pages are verified
- Prefer one destructive migration wave here instead of spreading deletion across earlier parts

## Parallelization Contract
This part is intentionally not parallel. It should run after all additive work is in.

No other part should be active against this branch when part 5 lands, because this part is expected to touch:

- auth globals
- routing globals
- final schema cleanup
- final repo-wide deletions

## Required Tests
Update and run:

- auth tests to remove teacher expectations
- validation tests to remove teacher role support and schedule fields
- lifecycle tests to remove schedule-retention assumptions
- new grep-based or smoke tests if you use them

Run:

- `npx vitest run`
- `npm run build`

## Final Acceptance Criteria
- no teacher code, routes, pages, or UI copy remains in the active product
- only admin and student auth paths exist
- no schedule/retention cron remains
- the sole-admin constraint is enforced in practice
- the project builds and tests cleanly after destructive cleanup

## Final Exit Condition
Part 5 is complete when the codebase fully reflects the final UNIMONKS product:

- public landing page
- free lead-capture mocks
- paid student mocks with 4 total attempts
- one admin
- zero teacher concepts anywhere in active runtime code
