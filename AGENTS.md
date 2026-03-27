# Repository Guidelines

## Project Structure & Module Organization
- Root entrypoint files: `package.json`, `astro.config.mjs`, `tsconfig.json`, and `README.md`.
- Source code: `src/`.
  - `src/pages/`: route entry files (`.astro`, `.md`) served by Astro.
  - `src/components/`: reusable UI components.
  - `src/layouts/`: shared page layout wrappers.
- Static assets: `public/` (copied directly to output).
- Built output: `dist/` (generated, do not edit).
- Generated typing artifacts: `.astro/` (generated, do not edit manually).
- Project context: this repository is the public homepage for the Prowl macOS app.

## Authoritative Source for Prowl References
- The app source repository is `https://github.com/onevcat/Prowl`.
- When validating product details, feature wording, or behavior references, first check local app source if available:
  - prefer `../Prowl`
  - fallback to `../supacode`
- If neither local path has the needed context, use the GitHub repository above.

## Build, Test, and Development Commands
- `npm install`: install dependencies from `package.json`.
- `npm run dev`: start local dev server at `http://localhost:4321`.
- `npm run build`: run Astro production build, output to `./dist`.
- `npm run preview`: preview the build locally.
- `npm run astro <subcommand>`: invoke Astro CLI directly, e.g. `npm run astro check`.

## Coding Style & Naming Conventions
- Use existing conventions: 2-space indentation, semicolons, double quotes in JS/TS imports and strings, especially inside `.astro` scripts.
- Keep `.astro` components and layout names in PascalCase; prefer kebab-case filenames for routes.
- Keep CSS class names readable and scoped (`kebab-case`), and place page-local styles in-page unless intentionally shared.
- Keep TypeScript strict-friendly types when adding script logic.
- No dedicated formatter/lint configuration exists in the repo; keep style consistent with surrounding files.

## Testing Guidelines
- No dedicated test command is currently configured.
- Before opening PRs, run:
  - `npm run build` for compile and type-check validation.
  - Manual smoke checks via `npm run dev` on primary pages (including `src/pages/index.astro` and `src/pages/details.astro`).
- If adding tests later, use `*.test.ts` naming and colocate test files with related code.

## Commit & Pull Request Guidelines
- The repository currently has no explicit commit convention file; use Conventional Commits:
  - `type(scope?): subject`
  - Examples: `feat(home): refine hero copy`, `fix: correct link path`.
- Keep commits small and scoped.
- PR description should include:
  - what changed and why,
  - verification commands run,
  - screenshot for UI-visible changes,
  - related issue/task reference if available.

## Security & Configuration Tips
- Do not commit secrets or environment files (for example, `.env`, `.env.production`).
- Avoid committing `dist/` unless intentionally vendoring build output.
- Validate external URLs and image paths, since the site is rendered and distributed as static assets.
