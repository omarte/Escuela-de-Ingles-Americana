# CLAUDE.md — Rules for AI Assistants

This file governs how AI assistants (Claude, Gemini, etc.) should work with this repository.
Read this file completely before making any changes.

---

## ⚠️ ABSOLUTE RULE — NEVER VIOLATE

> **AI MUST NEVER generate, modify, classify, translate, validate, or approve educational content.**
>
> This includes: words, translations, example sentences, pronunciations, reading passages,
> comprehension questions, definitions, phonetic guides, or any content destined for learners.
>
> Content lives in `packages/content/` and must be created exclusively by human curators.

---

## Project Overview

English Learning Platform — A1 through B2 CEFR vocabulary and reading app.
Mobile-first (Expo + React Native), offline-capable, content-as-code architecture.

**Workspace:** `d:\escuela de ingles Americana\`
**Vocabulary source:** `a.md` in the workspace root (A1: ~1,483 words, A2: ~734 words)
**Content is NOT in code yet.** The words in `a.md` must be transcribed by human curators
following the content model in `docs/content/content-model.md`.

---

## Architecture

### Monorepo Structure

```
apps/app/              → Expo mobile app
packages/content/      → Educational content (human-curated only)
packages/database/     → Supabase client + types
packages/srs/          → Spaced repetition engine
packages/types/        → Shared TypeScript types
packages/ui/           → Shared UI components
packages/validation/   → Zod schemas
supabase/migrations/   → PostgreSQL migrations
scripts/               → Validation scripts
```

### Rules by Layer

#### packages/types/

- Single source of truth for domain types
- No runtime dependencies
- All types are readonly interfaces
- IDs are permanent strings

#### packages/content/

- HUMAN CURATION ONLY — no AI content generation
- Every item must have `verifiedBy` (real curator username) and `verifiedAt` (YYYY-MM-DD)
- IDs follow `voc_{level}_{slug}_{seq}` format and are PERMANENT once published
- Status must follow: `draft → review → approved → published`
- Run `pnpm content:validate` after any content change

#### packages/srs/

- Pure TypeScript — no React, no Supabase
- Phase 01: interfaces + types + scheduler + stub algorithm
- Phase 04: full SM-2 implementation
- Algorithm must be pure functions (no side effects)

#### packages/database/

- Types come from Supabase generated output
- Temporary hand-written types in `src/generated/database.ts` — marked TEMPORARY
- Run `pnpm --filter @elp/database generate-types` after every migration

#### apps/app/

- No business logic in UI components
- Business logic belongs in hooks or store actions
- Use `@elp/types` for all domain types — never redefine them locally

---

## TypeScript Rules

- `strict: true` — always
- No `any` — use `unknown` + type guards
- No type assertions (`as X`) unless absolutely necessary and documented
- All public functions must have explicit return types
- `noUncheckedIndexedAccess: true` — array access returns `T | undefined`

---

## Content ID Rules

Vocabulary IDs are **permanent**. Once published, an ID can never be changed or reused.

| Format                     | Example         |
| -------------------------- | --------------- |
| `voc_{level}_{slug}_{seq}` | `voc_a1_go_001` |
| `rdg_{level}_{seq}`        | `rdg_a1_001`    |

- level: a1, a2, b1, b2 (lowercase)
- slug: letters and hyphens only, no numbers, no uppercase
- seq: exactly 3 digits

---

## Test Rules

- Tests use `vitest`
- Test fixtures must be marked `TEST_ONLY` and clearly synthetic
- Never use real vocabulary words in test fixtures
- Tests must pass before any PR can merge

---

## What Phase 01 Includes (Do Not Exceed Scope)

✅ Monorepo scaffold
✅ Types package
✅ Validation package
✅ SRS package (interfaces + stub + tests)
✅ Content package (structure + empty blocks)
✅ Database package (client + temporary types)
✅ Supabase migrations
✅ Content validation scripts
✅ CI pipeline
✅ Documentation

❌ Authentication UI
❌ Full SRS algorithm (Phase 04)
❌ Real educational content (ongoing — human curators)
❌ Gamification
❌ Notifications
❌ Payments
❌ Admin dashboard

---

## Before Making Changes

1. Run `pnpm typecheck` to confirm the baseline passes
2. Run `pnpm test` to confirm tests pass
3. After content changes: `pnpm content:validate`
4. After migrations: `pnpm --filter @elp/database generate-types`

---

## Questions & Decisions

See `docs/architecture/overview.md` for architectural decisions and rationale.
See `tasks/roadmap.md` for the full project roadmap.
