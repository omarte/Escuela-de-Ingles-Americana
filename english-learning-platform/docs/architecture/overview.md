# Architecture Overview

## Project Goal

An offline-first, mobile-first English learning platform for Spanish speakers.
CEFR levels: A1 → A2 → B1 → B2.
Core pedagogy: spaced repetition vocabulary + reading comprehension progression.

## Architectural Decisions

### ADR-001: Monorepo (Turborepo + pnpm)

**Decision:** Turborepo with pnpm workspaces.
**Reason:** Content, SRS engine, UI, and app code evolve at different rates.
Monorepo allows safe cross-package refactoring with type safety.
Turborepo provides build caching across packages.

### ADR-002: Content as Code

**Decision:** Educational content is versioned TypeScript data in `packages/content/`.
**Reason:** Git history provides full audit trail. IDs are permanent.
Schema validation runs at commit time and in CI.
Enables offline-first by bundling content with the app.
**Constraint:** Content must be human-curated. AI generation is prohibited.

### ADR-003: Supabase for Backend

**Decision:** Supabase (PostgreSQL + Auth + RLS).
**Reason:** Auth + Row Level Security out of the box. Strongly typed SQL.
No need for a custom server. Scales to real user load.
Types generated from schema eliminate hand-maintenance.

### ADR-004: Temporary Hand-Written DB Types

**Decision:** `packages/database/src/generated/database.ts` contains temporary stubs.
**Reason:** Supabase CLI not yet configured in Phase 01.
**Action required:** Configure Supabase CLI and run `generate-types` before Phase 02.
Types clearly marked TEMPORARY. Will be replaced by `supabase gen types typescript`.

### ADR-005: SM-2 SRS Algorithm (Stub in Phase 01)

**Decision:** SRS package provides interfaces, types, and a minimal stub in Phase 01.
Full SM-2 modified algorithm is deferred to Phase 04.
**Reason:** Phase 01 is Foundation. Getting the interface contract right matters more
than the algorithm details at this stage.

### ADR-006: Offline-First

**Decision:** Content is bundled. SRS state is local-first (expo-sqlite), synced to Supabase.
**Reason:** Learners must be able to study without internet.
**Implementation:** Phase 03 (Offline Sync).

### ADR-007: Expo + React Native

**Decision:** Expo SDK + Expo Router for Android, iOS, and web from one codebase.
**Reason:** Single team, multiple platforms. EAS Build for distribution.

### ADR-008: Permanent Content IDs

**Decision:** Once a vocabulary item is published, its ID can never change.
**Format:** `voc_{level}_{slug}_{seq}` and `rdg_{level}_{seq}`
**Reason:** SRS history, review events, and offline SQLite all reference IDs.
Changing an ID breaks user data permanently.

## Layer Boundaries

```
┌─────────────────────────────────────────────────────────┐
│                     apps/app                            │
│  (Expo, React Native, Expo Router, Zustand, SQLite)     │
└────────────────────────┬────────────────────────────────┘
                         │ imports
         ┌───────────────┼───────────────────┐
         ▼               ▼                   ▼
   @elp/database    @elp/srs           @elp/content
   (Supabase)       (Algorithm)        (Vocabulary)
         │               │                   │
         └───────────────┴───────────────────┘
                         │ all import
                         ▼
                    @elp/types
                   @elp/validation
```

**Rules:**

- `@elp/types` has no dependencies
- `@elp/srs` has no React, no Supabase
- `@elp/content` has no app code
- `apps/app` does not define domain types (uses @elp/types)

## Phase Roadmap

| Phase               | Focus                                                   |
| ------------------- | ------------------------------------------------------- |
| **01 — Foundation** | Monorepo, packages, migrations, CI ← **Current**        |
| 02 — App Shell      | Expo app, routing, auth screens (no auth logic yet)     |
| 03 — Auth           | Supabase Auth integration, profile creation             |
| 04 — SRS Engine     | Full SM-2 algorithm, card creation, review flow         |
| 05 — Offline Sync   | SQLite local state, background sync                     |
| 06 — Content Import | Import A1 vocabulary from curators into content package |
| 07 — Reading        | Reading passage component, comprehension checks         |
| 08 — Progress       | Progress tracking, streak, level advancement            |
| 09 — A2 Content     | A2 vocabulary and reading (after A1 is published)       |
| 10 — B1/B2          | Higher levels (after A2 is published)                   |
