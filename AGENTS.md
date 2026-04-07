# AGENTS.md

This document is a guide for agents and contributors working in this repository.

## 1. Project Overview

TERAKOYA is a client-side worksheet generator for Japanese study and test preparation. It loads question records from a published Google Spreadsheet, lets the user filter and randomly select prompts, and renders an A4 worksheet optimized for browser printing.

- The product is a single-screen React + TypeScript + Vite application deployed to GitHub Pages under `/terakoya/`
- Core user flow: load a spreadsheet URL, narrow the candidate set by category and recent results, randomly select up to 20 prompts, preview the worksheet, then print it
- Worksheet content supports plain text, ruby annotations, and fill-in-the-blank tokens so the same source data can power both reading and writing exercises
- User choices such as the spreadsheet URL, filters, selected prompts, worksheet title, answer display mode, and visible meta boxes are persisted in `localStorage`
- TanStack Query handles spreadsheet fetching, Jotai stores local option state, and HeroUI/Tailwind provide the application UI layer

## 2. Specification Management

- `docs/SPEC.md` is the single source of truth (SSOT) for product specifications and expected behavior
- Divergence between implementation and either document is not allowed

## 3. Coding Guidelines

### General

- Prefer immutable updates; do not mutate React state, shared objects, or cached data in place
- Organize code by feature/domain with small, focused modules; split files before they become hard to navigate
- Handle errors explicitly; surface actionable messages in UI-facing code and avoid silent failures
- Validate user input and externally sourced data at boundaries; parse storage, URL, and DOM-derived data defensively
- Keep functions focused and avoid deep nesting where practical; choose clear names over clever abstractions

### TypeScript / React / Repository Specific

- Prefer functional, composable component design
- Keep side effects at boundaries (e.g., storage, navigation, keyboard handlers)
- Prioritize type safety
- Avoid `any` in principle
- Use `import type` for type-only imports
- Respect the existing path alias (`@/*` -> `src/*`)

## 4. ExecPlans

- Use an ExecPlan for complex features, significant refactors, or changes to user-facing behavior, external configuration, persisted storage, import/export formats, or other durable data contracts
- Start from the template at `plans/Plan.md`
- Store working ExecPlans under `plans/` using descriptive kebab-case file names; create the directory if it does not exist
- Treat `plans/` as local working material; only the template file is tracked unless a specific plan is intentionally committed
- Each ExecPlan should cover the problem, scope, risks, compatibility considerations, implementation phases, verification steps, and required spec/doc updates
- Treat shipped behavior and persisted data as compatibility boundaries; if a change can affect existing users or saved data, explicitly document migration, fallback, or rollback expectations
- Small fixes, isolated refactors, and docs-only changes do not require an ExecPlan

## 5. Tooling / Quality Gates

- ESLint is the current linter and is exposed through `npm run lint`
- `npm run build` runs `tsc -b && vite build`, so it is the current TypeScript build/type gate
- Vitest is configured for unit tests and is exposed through `npm test -- --run`
- The current GitHub Actions workflow builds the app and deploys GitHub Pages from `main`
- No dedicated `format:check` or standalone `typecheck` script exists in the current repository state; if either is added, update this file and `docs/SPEC.md` together
- Commits or merges with unresolved lint/test/build violations are not allowed
- Run verification commands from the repository root using one-shot commands rather than watch mode
- If lint/format/test tooling is introduced or changed, update this file and `docs/SPEC.md` as needed

## 6. Development Workflow

- Principle: one PR, one purpose
- Sync with the default branch before starting substantial work
- Create a descriptive feature/fix branch before implementation
- Prefer concise branch names such as `feat/...`, `fix/...`, `ci/...`, or `chore/...`
- Use an ExecPlan when the work is complex or changes behavior/storage contracts
- Make focused changes and add or update tests when feasible; if tests are infeasible, explain why in the PR
- Run `npm run build` early for TypeScript-heavy or config-related changes because it also executes `tsc -b`
- Before treating work as complete, run `npm run lint`, `npm run build`, and `npm test -- --run` when logic or parser behavior changed
- If a change requires spec updates, include them in the same PR as the implementation
- Do not mix unrelated refactors with feature/fix work
- Capture lasting project knowledge in the existing docs structure instead of scattering new top-level notes

## 7. Pull Request & Commit Guidelines

- Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- Commit message format: `<type>(<scope>): <subject>`
- Keep the subject concise and preferably under 80 characters
- Example scopes: `sidepanel`, `options`, `content`, `storage`, `docs`, `ci`
- An optional commit body may be added after a blank line when extra context, risk, or follow-up work should be recorded
- Limit commit types to the following:
  - `feat`: a new user-facing feature or capability
  - `fix`: a bug fix or regression fix
  - `docs`: documentation-only changes
  - `style`: formatting or style-only changes with no behavioral impact
  - `refactor`: internal code changes that do not change behavior
  - `test`: test-only additions or updates
  - `chore`: repository maintenance work that does not fit the categories above
  - `ci`: CI-related changes such as GitHub Actions workflows, CI scripts, and pipeline configuration
  - `perf`: performance improvements
  - `build`: changes that affect the build system or packaging flow
  - `types`: type-only changes
  - `revert`: reverts a previous commit
- PRs should clearly describe the problem, the approach taken, the validation performed, and any required spec or guide updates
- If behavior or UX changed, include screenshots or recordings when they materially help review
- If tests or docs were intentionally skipped, say so explicitly in the PR description with the reason

## 8. Pre-commit Checklist

- Review the diff and remove dead code or temporary trial-and-error changes before committing
- If behavior or UX changed, update `docs/SPEC.md` in the same change
- If storage shape, import/export data, or persistent settings changed, verify the migration or compatibility approach is documented
- Run `npm run lint`
- Run `npm test -- --run` when the change touches logic covered by tests or adds new tests
- Run `npm run build`
- Confirm the worktree only contains files intended for the commit

## 9. Maintenance

- Keep dependencies reasonably up to date
- Revisit and update this document as project conventions evolve
