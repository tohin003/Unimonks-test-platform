# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains the Next.js App Router routes, including `page.tsx`, `layout.tsx`, and `globals.css`.
- `app/(auth)/` groups authenticated routes; `app/arena/` is a dedicated arena route segment.
- `components/` holds shared React components; `components/ui/` is reserved for shadcn/ui primitives.
- `hooks/` contains custom React hooks (use the `useX` naming pattern).
- `lib/` houses utilities and helpers; `@/lib` is available via the TypeScript path alias.
- `public/` stores static assets; `reference_images/` keeps design references.
- Key configs live at `eslint.config.mjs`, `next.config.ts`, `postcss.config.mjs`, and `tsconfig.json`.

## Build, Test, and Development Commands
- `npm run dev` starts the Next.js dev server at `http://localhost:3000`.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint with the Next.js core-web-vitals and TypeScript rules.

## Coding Style & Naming Conventions
- Use TypeScript, React Server Components where appropriate, and keep `strict` typing intact.
- Follow existing formatting: 2-space indentation, semicolons, and double quotes.
- Use Next.js conventions for route files: `page.tsx`, `layout.tsx`, `loading.tsx`.
- Prefer absolute imports with aliases like `@/components`, `@/lib`, and `@/hooks`.

## Testing Guidelines
- No test framework is configured yet. If you add tests, use `*.test.ts(x)` or `*.spec.ts(x)` and place them next to the module or in a `__tests__/` folder.
- Add a test script to `package.json` and document how to run it.

## Commit & Pull Request Guidelines
- The Git history is empty, so no convention is established yet. Use Conventional Commits (e.g., `feat: add arena timer`, `fix: handle null session`) to set a standard.
- PRs should include a clear summary, testing or linting results, and screenshots for UI changes. Link relevant issues or tasks when available.

## Configuration & Secrets
- If environment variables are needed, use `.env.local` and document required keys in `README.md`.
