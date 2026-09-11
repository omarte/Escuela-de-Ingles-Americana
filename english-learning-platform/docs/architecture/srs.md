# SRS Architecture

## Overview

The SRS engine lives in `packages/srs/` and is a **pure TypeScript package**
with no React, no Supabase, and no side effects.

## State Machine

```
new → learning → review → dominated
              ↓         ↓
          relearning ←──┘ (on failure during review)
              ↓
           review (after relearning steps pass)
```

| State        | Meaning                                                 |
| ------------ | ------------------------------------------------------- |
| `new`        | Never studied                                           |
| `learning`   | Initial learning phase (short intervals: 1 day, 4 days) |
| `review`     | Long-term review (growing intervals)                    |
| `relearning` | Failed during review — rescue phase                     |
| `dominated`  | Interval >= 90 days — considered consolidated           |

## Phase 01 Status

✅ Interfaces defined (`ReviewInput`, `ReviewResult`, `SRSConfig`)
✅ `getDueCards` — scheduler (basic implementation)
✅ `createCard` — new card factory
✅ `calculateNextReview` — **STUB** (not SM-2)
✅ Tests for interfaces and scheduler

## Phase 04 — Full Implementation Required

The `calculateNextReview` stub in `src/algorithm.ts` must be replaced with the
full SM-2 modified algorithm. See the stub file for the formula reference and
the expected behavior.

Key behaviors to implement:

- Ease factor adjustment: `ef' = ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)`
- Interval growth: `I(n) = I(n-1) * ef` for review state
- Relearning: reset interval to 1 day, decrement ease factor
- Dominated: trigger when `interval >= config.dominatedThreshold`
- Daily limits: respect `maxNewCardsPerDay` and `maxReviewsPerDay`

## Config (Tunable)

```typescript
const DEFAULT_SRS_CONFIG = {
  minEaseFactor: 1.3,
  maxEaseFactor: 2.5,
  initialEaseFactor: 2.5,
  learningIntervals: [1, 4], // days
  passingQuality: 3,
  dominatedThreshold: 90, // days
  maxNewCardsPerDay: 20,
  maxReviewsPerDay: 100,
}
```

## Database Integration

SRS card state is persisted in:

- **Online:** `user_cards` table in Supabase (synced)
- **Offline:** `user_cards` table in expo-sqlite (local-first, Phase 05)

Review events are appended to `review_events` (immutable log, never deleted).
