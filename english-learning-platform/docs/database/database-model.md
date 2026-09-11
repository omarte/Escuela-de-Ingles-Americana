# Database Model

## Tables

### `profiles`

One row per user. Extends `auth.users` from Supabase Auth.

| Column          | Type        | Description               |
| --------------- | ----------- | ------------------------- |
| `id`            | UUID (PK)   | Same as `auth.users.id`   |
| `display_name`  | TEXT        | 2–50 chars                |
| `current_level` | cefr_level  | A1, A2, B1, or B2         |
| `current_week`  | SMALLINT    | 1-based week within level |
| `streak_days`   | INT         | Consecutive study days    |
| `created_at`    | TIMESTAMPTZ |                           |
| `updated_at`    | TIMESTAMPTZ | Auto-updated              |

### `content_words`

Reference table for vocabulary item IDs.
Full word content lives in `packages/content/`.

| Column        | Type           | Description                         |
| ------------- | -------------- | ----------------------------------- |
| `id`          | TEXT (PK)      | Permanent ID (e.g. `voc_a1_go_001`) |
| `level`       | cefr_level     |                                     |
| `week`        | SMALLINT       |                                     |
| `topic`       | TEXT           |                                     |
| `status`      | content_status |                                     |
| `verified_by` | TEXT           | Curator username                    |
| `verified_at` | DATE           |                                     |
| `created_at`  | TIMESTAMPTZ    |                                     |

### `user_cards`

Current SRS state for each (user, vocabulary item) pair.

| Column               | Type         | Description                              |
| -------------------- | ------------ | ---------------------------------------- |
| `id`                 | UUID (PK)    |                                          |
| `user_id`            | UUID (FK)    | → profiles.id                            |
| `vocabulary_item_id` | TEXT (FK)    | → content_words.id                       |
| `state`              | card_state   | new/learning/review/relearning/dominated |
| `interval`           | INT          | Days until next review                   |
| `ease_factor`        | NUMERIC(4,2) | 1.30–2.50                                |
| `reps`               | INT          | Consecutive successes                    |
| `lapses`             | INT          | Failures in review state                 |
| `due_date`           | TIMESTAMPTZ  | When to show next                        |
| `last_reviewed`      | TIMESTAMPTZ  | Last review time                         |

**Unique constraint:** `(user_id, vocabulary_item_id)`

### `review_events`

Immutable append-only log. Never update or delete.

| Column               | Type        | Description        |
| -------------------- | ----------- | ------------------ |
| `id`                 | UUID (PK)   |                    |
| `user_id`            | UUID (FK)   |                    |
| `card_id`            | UUID (FK)   | → user_cards.id    |
| `vocabulary_item_id` | TEXT (FK)   | → content_words.id |
| `quality`            | SMALLINT    | 0–5 (SM-2 scale)   |
| `reviewed_at`        | TIMESTAMPTZ |                    |
| `previous_state`     | card_state  | Before this review |
| `next_state`         | card_state  | After this review  |
| `previous_interval`  | INT         | Before             |
| `next_interval`      | INT         | After              |

### `study_sessions`

Groups review events into a session.

| Column           | Type        | Description     |
| ---------------- | ----------- | --------------- |
| `id`             | UUID (PK)   |                 |
| `user_id`        | UUID (FK)   |                 |
| `started_at`     | TIMESTAMPTZ |                 |
| `ended_at`       | TIMESTAMPTZ | NULL if ongoing |
| `cards_reviewed` | INT         |                 |
| `cards_correct`  | INT         | quality >= 3    |
| `level`          | cefr_level  |                 |

## Enums

- `cefr_level`: A1, A2, B1, B2
- `content_status`: draft, review, approved, published, deprecated
- `card_state`: new, learning, review, relearning, dominated

## Row Level Security

All tables have RLS enabled. Users can only access their own data.
`content_words` is read-only for authenticated users.

## Type Generation

After applying migrations:

```bash
# Local Supabase
npx supabase gen types typescript --local > packages/database/src/generated/database.ts

# Cloud project
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > packages/database/src/generated/database.ts
```

The temporary types in `packages/database/src/generated/database.ts` must be
replaced with generated output before Phase 02.
