# Project Backlog

This document tracks upcoming tasks, ideas, and debt across all phases.

## High Priority (Post-Curriculum / Production Launch)

- [ ] Connect and deploy to production Supabase cloud project
- [ ] Configure EAS build pipeline for Android (APK/AAB) and iOS (IPA)
- [ ] Record human native audio pronunciation files for vocabulary repository
- [ ] Implement end-to-end smoke tests on real devices/emulators

## Completed — Phase 10: B1/B2 Content Import & Curriculum Consolidation ✅

- [x] Curated and structured 6 weeks of B1 vocabulary (203 unique items) in `packages/content/src/b1/`
- [x] Curated and structured 4 weeks of B2 vocabulary (111 unique items) in `packages/content/src/b2/`
- [x] Authored advanced graded reading passages for B1 (`rdg_b1_001`, `rdg_b1_002`) with comprehension questions
- [x] Authored advanced graded reading passages for B2 (`rdg_b2_001`, `rdg_b2_002`) with comprehension questions
- [x] Consolidated full 4-level CEFR registry in `packages/content/src/passages/index.ts`
- [x] Updated Progress screen (`progress.tsx`) with dynamic CEFR totals: A1 (1,514), A2 (734), B1 (203), B2 (111)
- [x] Connected Vocabulary screen (`vocabulary.tsx`) for live browsing of all 4 CEFR levels
- [x] Connected Reading screen (`reading.tsx`) with 4-level navigation and live quizzes
- [x] Verified full curriculum with 2,562 vocabulary items and 10 reading passages (0 errors)

## Completed — Phase 09: A2 Content Import ✅

- [x] Extracted and parsed 15 weeks of curated A2 vocabulary from `a.md`
- [x] Deduplicated against A1 and within A2 to produce exactly 734 unique vocabulary items
- [x] Generated modular files `packages/content/src/a2/week-01.ts` to `week-15.ts` and `index.ts`
- [x] Authored 3 graded A2 reading passages with comprehension questions in `packages/content/src/passages/a2.ts`
- [x] Extended `scripts/validate-content.ts` with cumulative CEFR level hierarchy reference verification
- [x] Connected mobile Vocabulary screen to `@elp/content` with level switcher and bidirectional search
- [x] Connected mobile Reading screen to multi-level registry with interactive level switcher
- [x] Passed `pnpm content:validate`, `pnpm content:duplicates`, `pnpm typecheck`, `pnpm test`, and `pnpm lint`

- [x] Implemented pure progress algorithms in `@elp/srs` (`calculateStreak`, `calculateRetentionRate`, `evaluateLevelAdvancement`, `calculateWeeklyBreakdown`)
- [x] Added 15 unit tests in `packages/srs/tests/progress.test.ts`
- [x] Implemented `updateUserProfile` in `@elp/database` with unit tests
- [x] Added SQLite review event & date retrieval helpers in `apps/app/lib/db/sqlite.ts`
- [x] Created `useProgressStore` with reactive metrics and `advanceLevel` action
- [x] Revamped Progress screen (`progress.tsx`) with real live metrics, 19-week breakdown, and interactive advancement
- [x] Connected Home dashboard streak widget to live progress store metrics

## Completed — Phase 07: Reading Passages ✅

- [x] Implemented `ReadingPassage` and `ComprehensionQuestion` models and Zod schemas
- [x] Curated 3 A1 reading passages with human verification, linked to exact vocabulary IDs
- [x] Built interactive Reading screen with tokenized highlighted vocabulary
- [x] Built tap-to-reveal word detail modal (pronunciation, part of speech, translation, example)
- [x] Added full passage translation toggle (English <-> Spanish)
- [x] Integrated reading comprehension check quizzes with instant visual feedback
- [x] Extended `scripts/validate-content.ts` with referential integrity checks for passage vocabulary IDs

## Completed — Phase 06: Content Import A1 ✅

- [x] Transcribed 19 weekly curated batches from `a.md` into `packages/content/src/a1/`
- [x] Generated permanent IDs (`voc_a1_{slug}_{seq}`) for 1,514 unique vocabulary items
- [x] Filtered intra-level duplicate occurrences so each term is studied once in its best thematic context
- [x] Passed all content validations: `pnpm content:validate` and `pnpm content:duplicates`

## Completed — Phase 05: Offline Sync ✅

- [x] Installed and configured `expo-sqlite` in `apps/app` with safe platform fallback
- [x] Created local SQLite schema mirroring `user_cards`, `review_events`, and `sync_metadata`
- [x] Implemented bidirectional sync engine between SQLite and Supabase with Last-Write-Wins conflict resolution
- [x] Added 5 unit tests in `@elp/database/tests/sync.test.ts` verifying all conflict resolution branches
- [x] Integrated offline-first writes with zero latency in `useSRSStore`
- [x] Implemented `useSyncStore` and connected interactive offline status & manual sync trigger on Profile screen

## Completed — Phase 04: SRS Engine ✅

- [x] Implemented full modified SM-2 algorithm in `@elp/srs` with ease factor clamping (1.30-2.50)
- [x] Implemented multi-step learning intervals (1d -> 4d -> graduation) and lapse handling (relearning)
- [x] Implemented queue builder respecting `maxNewCardsPerDay` and `maxReviewsPerDay`
- [x] Added 25 unit tests in `@elp/srs/tests/srs.test.ts`
- [x] Added typed persistence helpers in `@elp/database` (`getUserCards`, `upsertUserCard`, `logReviewEvent`, `startStudySession`, `finishStudySession`)
- [x] Created `useSRSStore` in `apps/app` supporting dual-mode persistence (Supabase + AsyncStorage)
- [x] Connected Learn screen to real SRS engine with tap-to-flip, SM-2 ratings, and session summary screen
- [x] Connected Home dashboard to live due card counters

- [x] Created `005_create_profile_trigger.sql` for automatic profile creation on `auth.users` insert
- [x] Configured Supabase Auth client integration with AsyncStorage adapter in `@elp/database` and `apps/app`
- [x] Connected Login / Register screens with reactive `useAuthStore` (Zustand)
- [x] Implemented route protection guard in Expo Router root layout (`apps/app/app/_layout.tsx`)
- [x] Implemented dual-mode operation (Live Supabase + Local Dev / Demo mode)
- [x] Added 11 unit tests in `@elp/database/tests/auth.test.ts` (34 total tests passing)

- [x] Initialized Expo app (`apps/app`) with Expo Router and TypeScript
- [x] Configured `apps/app/package.json` with workspace dependencies (`@elp/types`, `@elp/ui`, etc.)
- [x] Configured navigation tabs: Home, Learn, Vocabulary, Reading, Progress, Profile
- [x] Created shared UI package `@elp/ui` with design tokens (colors, fonts, spacing, radii)
- [x] Created reusable UI components (`Button`, `Card`, `ProgressBar`, `Badge`, `WordCard`)
- [x] Created interactive screens with responsive mobile/web layout

## Content & Curation (All 4 CEFR Levels Complete)

- [x] Transcribe and curate A1 word bank (1,514 words across 19 weeks)
- [x] Transcribe and curate A2 word bank (734 words across 15 weeks)
- [x] Transcribe and curate B1 word bank (203 words across 6 weeks)
- [x] Transcribe and curate B2 word bank (111 words across 4 weeks)
- [x] Implement reading passages schema and referential validator (10 passages total)
- [ ] Review and approval tooling / admin CMS for future content expansions

## Infrastructure & Tooling

- [ ] Connect Supabase local development environment (`supabase start`)
- [ ] Automate type generation from Supabase schema (`pnpm --filter @elp/database generate-types`)
- [ ] Setup GitHub Actions CI status badge in README
- [ ] Setup test coverage reporting thresholds

## Technical Debt / Hardening

- [ ] As content scales past 10,000 items, optimize linear search in `packages/content/src/index.ts` with a pre-indexed Map.
- [ ] Add performance benchmarks for SRS scheduler with large card decks (10k+ cards).
