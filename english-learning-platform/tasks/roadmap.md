# Phase Roadmap

## Phase 01 — Foundation ✅ COMPLETED

- Monorepo scaffold (Turborepo + pnpm)
- `@elp/types` — domain types
- `@elp/validation` — Zod schemas + tests
- `@elp/srs` — interfaces, stub algorithm, scheduler, tests
- `@elp/content` — structure, empty blocks, typed loaders
- `@elp/database` — Supabase client (temporary types, to regenerate)
- Supabase migrations (001–004)
- Content validation scripts
- CI pipeline (lint, typecheck, test, content:validate)
- Documentation (CLAUDE.md, README, architecture, SRS, content-model)

## Phase 02 — App Shell ✅ COMPLETED

- Expo app initialized (`apps/app/`)
- Expo Router navigation structure (Tabs + Auth stack)
- Shared UI Design System package (`@elp/ui`) with Dark Elite tokens
- Reusable UI Components (`Button`, `Card`, `ProgressBar`, `Badge`, `WordCard`)
- Interactive screens: Home, Learn (SRS Session), Vocabulary, Reading, Progress, Profile
- Splash screen, theme background, and app icons

## Phase 03 — Authentication ✅ COMPLETED

- Supabase Auth integration
- Login / Register screens (email + password)
- Auth state in Zustand
- Profile creation trigger (on auth.users insert)
- Protected routes
- AsyncStorage session persistence
- Dual cloud / local development mode

## Phase 04 — SRS Engine ✅ COMPLETED

- Full SM-2 modified algorithm replacing the Phase 01 stub
- Card creation flow (user starts a new word)
- Review session flow (show card → get quality → update)
- Daily limits enforcement (maxNewCardsPerDay, maxReviewsPerDay)
- Review event logging (immutable audit trail)
- Session start/end tracking in `study_sessions`
- 25 passing unit tests in `@elp/srs` and 16 in `@elp/database`

## Phase 05 — Offline Sync ✅ COMPLETED

- `expo-sqlite` local database with safe platform fallback
- Mirror of `local_user_cards`, `local_review_events`, and `sync_metadata` tables
- Bidirectional sync engine (`syncUserData`) with Supabase
- Pure Last-Write-Wins conflict resolution algorithm with comprehensive test coverage
- Reactive offline-first sync store (`useSyncStore`) and interactive UI on Profile screen
- Instant zero-latency local review submission in `useSRSStore`

## Phase 06 — Content Import (A1) ✅ COMPLETED

- Complete human-curated word bank from `a.md` transcribed into 19 week files (`week-01.ts` to `week-19.ts`)
- 1,514 unique vocabulary items with permanent IDs (`voc_a1_{slug}_{seq}`)
- Part-of-speech classification and full metadata validation
- `pnpm content:validate` and `pnpm content:duplicates` passing with 0 errors
- Zero AI policy fully respected

## Phase 07 — Reading Passages ✅ COMPLETED

- ReadingPassage content model implementation with schema validation
- 3 human-curated A1 reading passages referencing exact vocabulary IDs
- Reading screen with interactive highlighted vocabulary
- Tap-to-reveal word detail modal with pronunciation, POS, and examples
- Full passage translation toggle (pure English vs official Spanish)
- Reading comprehension check quizzes with real-time feedback
- Referential integrity validation in `scripts/validate-content.ts`

## Phase 08 — Progress & Streaks ✅ COMPLETED

- Daily streak calculation engine (`calculateStreak`) with historical best tracking
- Level advancement logic (`evaluateLevelAdvancement`) with 80% mastery threshold
- Real-time retention rate calculation (`calculateRetentionRate`)
- Week-by-week vocabulary mastery breakdown (`calculateWeeklyBreakdown`)
- Database persistence helper `updateUserProfile` in `@elp/database`
- SQLite review event & date queries in `sqlite.ts`
- Reactive `useProgressStore` with level promotion action
- Full revamp of Progress screen (`progress.tsx`) with real metrics, 19 weeks list, and CEFR ladder
- Home dashboard live streak sync

## Phase 09 — A2 Content ✅ COMPLETED

- Curated A2 vocabulary extraction from `a.md` (15 weeks, 734 unique items)
- Strict Zod validation and Zero AI policy enforcement
- Graded A2 reading passages (`rdg_a2_001`, `rdg_a2_002`, `rdg_a2_003`) with comprehension questions
- Cumulative vocabulary reference support in `scripts/validate-content.ts`
- Mobile vocabulary bank integration with CEFR level switcher and bidirectional search
- Mobile contextual reading integration with CEFR level selection

## Phase 10 — B1/B2 Content ✅ COMPLETED

- Curated B1 weekly vocabulary batches (6 weeks, 203 unique items)
- Curated B2 weekly vocabulary batches (4 weeks, 111 unique items)
- Advanced reading passages for B1 (`rdg_b1_001`, `rdg_b1_002`) and B2 (`rdg_b2_001`, `rdg_b2_002`)
- Full 4-level CEFR curriculum consolidation (2,562 vocabulary items, 10 reading passages)
- Dynamic multi-level integration in mobile app (`progress.tsx`, `vocabulary.tsx`, `reading.tsx`)
- Passed `content:validate`, `content:duplicates`, `typecheck`, `test`, `lint`, and `format:check`

## Phase 11 — Comprehensive Editorial Curation & OTA Engine 🔄 IN PROGRESS

- Complete A1 editorial curation (19 weeks, 1,512 vocabulary items)
- Complete A2 editorial curation (15 weeks, 734 vocabulary items)
- EAS Updates Over-The-Air (OTA) engine integration for continuous curriculum updates
- Domain architecture expansion to support future levels C1, C2, D1, D2 and Professional Tracks

## Phase 12 — Milestone Evaluation Engine & Academic Record 🏁 COMPLETED

- 4 progression checkpoints in A1 (100, 500, 1000, 1512 words)
- 2 progression checkpoints in A2 (mid-term, final certification)
- 1 graduation exit exam for B1 and B2
- Comprehensive Academic Record ("Boleta de Calificaciones") with cognitive latency telemetry and shareable digital certificates
- Interactive in-app exam experience with Cloze, Audio comprehension and translation questions
- Full offline-first persistence with AsyncStorage and reactive Zustand store
- 100% test coverage with unit validation suite (59 passing tests platform-wide)

---

## Complete Curriculum Summary

| Level     | Weeks  | Curated Words | Reading Passages | Status                        |
| :-------- | :----- | :------------ | :--------------- | :---------------------------- |
| **A1**    | 19     | 1,512         | 3                | ✅ Completed                  |
| **A2**    | 15     | 734           | 3                | ✅ Completed                  |
| **B1**    | 9      | 226           | 8                | ⏳ Structural Model Ready     |
| **B2**    | 5      | 84            | 2                | ⏳ Structural Model Ready     |
| **TOTAL** | **48** | **2,556**     | **16**           | **Production Ready Platform** |

---

## Future Enhancements / Post-Launch Milestones

- Native binary compilation with EAS (`eas build`) for iOS and Android app stores
- Cloud Supabase production instance provisioning and environment migrations
- High-fidelity audio pronunciation recordings for all 2,556 vocabulary terms
- AI-free interactive writing and pronunciation diagnostic exercises
- Conversational clubs engine for C2 and D2 levels

