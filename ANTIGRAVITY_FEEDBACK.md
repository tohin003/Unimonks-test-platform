# Antigravity Frontend Review & UI Direction (Claymorphism)

## What Exists Right Now (Good Coverage)
- App shell with `AppSidebar` + `TopHeader` for authenticated routes.
- Teacher dashboard, tests list, and test builder UI.
- Admin users list UI.
- Student dashboard and results/AI feedback UI.
- Live test arena (question view + navigator).

## Gaps vs `project_plan.md`
- Role-aware navigation/routing is not enforced; all roles share the same sidebar.
- Admin batch detail is placeholder-only; core batch-scoped actions are not wired yet.
- AI import is UI-only and supports only `.docx` (no PDF support, no real file validation).
- Test builder lacks autosave, validation, and draft/publish workflow.
- Arena anti-cheat is partial (client-only warnings, no server-authoritative timing).
- Bulk actions are missing in admin tables (checkboxes exist but no actions).

## Additional Misses (Recheck)
- Teacher batch detail view doesn’t surface an explicit “Next Test” card.
- AI import dialog doesn’t accept PDF files; add PDF support and real file input handling.
- Logout is just a link; no actual auth/session clearing flow exists yet.
- `shadow-clay-outer` / `shadow-clay-inner` classes are used but not defined as utilities; add CSS utilities or switch to inline `style` where needed.
- `next-themes` `ThemeProvider` is missing even though `useTheme` is used in `components/ui/sonner.tsx`.

## Claymorphism Design Language (Target)
- Visual feel: soft, inflated surfaces, gentle shadows, and pastel gradients.
- Color palette: warm neutrals with muted highlights (cream, sand, pale teal, soft indigo).
- Surfaces: large radii, thicker borders, and dual shadows (outer + inner) to feel “pressed.”
- Depth: use layered cards and floating controls; avoid flat white rectangles.
- Texture: add a subtle noise overlay or grain gradient to large backgrounds.

## Concrete UI Direction (Avoid “AI-Generated” Look)
- Branding: create a simple logo mark and a distinctive top-left brand lockup.
- Typography: add a display font for headings (e.g., `Fraunces` or `Newsreader`) and keep a clean body font (e.g., `Sora` or `Space Grotesk`).
- Realistic copy: replace generic labels with real test/batch names, dates, and teacher names.
- Use consistent microcopy (button verbs, status labels, tooltips).
- Add distinctive UI moments: a “Live Now” badge, a “test starts in” pill, or a persistent “Focus Mode” toggle in arena.

## Color Theme Audit (Does It Complement the Design?)
- Base palette has shifted to warm clay neutrals, which is good.
- Some key screens still lean on saturated indigo gradients that break the claymorphism feel; align hero gradients to the clay palette.
- Pure white surfaces are still common; claymorphism should prefer warm surfaces and soft contrast.

## Claymorphism Palette Direction (Suggested)
- Base background: warm off-white (`#F6F1EA` or `#F8F5F1`).
- Surface cards: slightly darker warm neutral (`#EFE8DE`).
- Primary accent: muted clay/terracotta (`#C78D6B`) or dusty teal (`#7EA49A`).
- Secondary accent: soft lavender/stone (`#A7A0B8`).
- Borders: low-contrast warm gray (`rgba(100, 80, 60, 0.15)`).

## Component-Level Suggestions
- App shell: add breadcrumbs, role switcher, and a subtle background gradient for the main content area.
- Cards: use a claymorphic style with thicker borders + soft inset shadow.
- Tables: add sticky headers, row hover depth change, and inline actions (kebab menu).
- Arena: remove `TopHeader`, add a custom minimal top bar with timer + progress ring.
- Results page: use three info cards for Strengths / Improvements / Action Plan before the detailed review.
- Dashboards: replace fake chart with a real chart component and more meaningful data points.
- Admin users: make “Add New User” open a create form (page or sheet) and “Edit” open a side-drawer, matching the same claymorphic styling as the rest of the admin area.
- Auth: build a dedicated login page (`/login`) and ensure logout is accessible from the avatar menu and redirects to `/login`.
- Teacher dashboard: add a “My Batches” list/grid at the top; clicking a batch filters stats, recent tests, and analytics to that batch.
- Admin: add a batch picker and make all actions (create test, view results, manage users) operate within the selected batch context.
- Sidebar: replace “Results” with a clear label (e.g., “Student Dashboard” or “Student Results”) and route correctly.

## Design Tokens to Add (Example)
- Add to `app/globals.css`:
  - `--surface: #F8F5F1;`
  - `--surface-2: #F2EEE8;`
  - `--shadow-outer: 0 18px 40px rgba(39, 30, 15, 0.12);`
  - `--shadow-inner: inset 0 2px 6px rgba(255,255,255,0.7);`
  - `--border-soft: 1.5px solid rgba(121, 90, 60, 0.18);`

## Suggested Commands / Dependencies
- `npm run dev` to review changes live.
- `npm run lint` to keep formatting consistent.
- `npm install sonner nprogress` for toasts + route progress.
- `npm install recharts` for real charts.
- `npx shadcn@latest add breadcrumb` for header navigation.
- `npx shadcn@latest add toast` if using shadcn’s toast presets.

## Loading/Skeleton Coverage (Where To Add)
- Student dashboard → test interface route: keep the arena `loading.tsx` (already added) and add a lighter in‑page skeleton for slow “Next Test” widgets.
- Teacher dashboard: skeleton for batch list grid and batch detail cards when switching batches.
- My Tests table: skeleton rows while fetching tests + batch names.
- Test builder: skeleton for question list, editor panel, and settings panel while loading a draft or AI import results.
- Admin users/batches: skeleton for toolbar + table rows; show inline row skeletons for bulk fetches.
- Admin batch detail: skeleton for tabs (students/tests) and for metrics cards.
- Student results page: skeleton for the top summary card and the insights cards.
- Global: add `loading.tsx` for major route groups like `app/(auth)/` and `app/(public)/` to smooth initial layout load.

## Next Build Targets (Priority)
- Admin dashboard (metrics + user/batch summary cards).
- Teacher analytics page (`/teacher/tests/[testId]/analytics`).
- Student results enhancement with AI insight cards.
- Arena layout cleanup for minimalist focus (no sidebar/header).
- Role-aware navigation and auth routes.
- Batch-scoped dashboards for Teacher and Admin (select batch first, then show data).

## Status Recheck (Latest)
Implemented:
- Login and signup pages now exist at `/login` and `/signup`.
- Admin dashboard and batch management pages are present.
- Admin Users “Add New User” and “Edit” now open dialog/sheet forms.
- Top header has breadcrumbs, search, and a logout entry linking to `/login`.
- Student results now include Strengths / Improvements / Action Plan cards.
- Teacher dashboard is batch-first and includes a “Create Test for this batch” action.
- Teacher analytics page now exists under `/teacher/tests/[testId]/analytics`.
- My Tests now shows batch info and routes “Edit” and “Analytics” actions.
- Create Test includes batch selection + time limit, and AI modal includes batch + duration.
- Root route now redirects to `/login`.
- Arena now uses a minimalist top bar with focus warnings and a mobile palette sheet.
- Admin batches list links into a batch detail page.
- Sidebar label now says “Student Dashboard”.
- Dedicated test interface exists under `/arena/[testSessionId]` with MCQ view, right-side status panel, and navigator.
- Route-level skeleton loading added for the arena test interface.

Still Missing / Needs Fix:
- Teacher batch detail view should show “Next Test” explicitly.
- AI import should accept PDF files and provide real file selection/validation.
- Create Test page is missing scheduling controls (date + time window for the test).
- Logout needs real session clearing (not just a link).
- Teacher batch drill-in uses local state only; URL doesn’t change, so browser Back doesn’t return to batch list. Use a route (e.g., `/teacher/dashboard?batchId=...`) or nested route to make back/forward work.
- Admin batches “Create New Batch” button is non-functional (no route or modal).
- “Edit Test” route is just a query param; create page doesn’t load existing test data (edit flow not wired).
- Breadcrumb items render without links (no `href`), so they aren’t navigable.
