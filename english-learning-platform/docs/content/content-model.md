# Content Model

## Overview

All educational content is stored as TypeScript data in `packages/content/`.
Content is human-curated — no AI generation is permitted.

## Vocabulary Item Structure

```typescript
interface VocabularyItem {
  id: string // PERMANENT: voc_{level}_{slug}_{seq}
  word: string // English word or phrase
  translation: string // Spanish translation
  partOfSpeech: PartOfSpeech
  level: CEFRLevel // 'A1' | 'A2' | 'B1' | 'B2'
  week: number // Week number (1-based)
  topic: string // Thematic topic slug
  example: string // Example sentence in English
  exampleTranslation: string // Spanish translation of example
  pronunciation?: string // IPA or simplified guide
  variants?: string[] // Spelling variants
  irregularForms?: IrregularForms // For irregular verbs
  notes?: string // Curator notes (not shown to learners)
  verifiedBy: string // Curator username
  verifiedAt: string // YYYY-MM-DD
  source?: string // Source reference
  status: ContentStatus // draft → review → approved → published
}
```

## ID Format

| Component | Rules                      | Example |
| --------- | -------------------------- | ------- |
| prefix    | `voc_`                     | `voc_`  |
| level     | a1, a2, b1, b2 (lowercase) | `a1_`   |
| slug      | letters and hyphens only   | `go_`   |
| seq       | exactly 3 digits           | `001`   |

Full example: `voc_a1_go_001`

## ID Rules (CRITICAL)

1. IDs are **permanent** once published
2. IDs must be **globally unique** (validated by CI)
3. IDs must **never be regenerated** automatically
4. If a word is deprecated, the row stays with `status: 'deprecated'`
5. Never delete a published item — user SRS history references the ID

## Content Status Lifecycle

```
draft → review → approved → published → deprecated
```

- **draft**: Created, not yet reviewed
- **review**: Curator has finished, awaiting second verification
- **approved**: Verified, ready to publish
- **published**: Live in the app
- **deprecated**: No longer shown to new users; existing SRS history preserved

## File Organization

```
packages/content/src/
├── a1/
│   ├── index.ts       ← Level index, imports all weeks
│   ├── week-01.ts     ← Family & basic pronouns (week 1)
│   ├── week-02.ts     ← Colors & numbers
│   └── ...
├── a2/
│   ├── index.ts
│   └── ...
├── b1/ ...
├── b2/ ...
├── types.ts           ← ContentBlock, LevelContent, ContentRegistry
└── index.ts           ← Public API: loaders, registry
```

## Week File Format

```typescript
// packages/content/src/a1/week-01.ts
import type { ContentBlock } from '../types'

export const week01: ContentBlock = {
  level: 'A1',
  week: 1,
  topic: 'family',
  description: 'Basic family vocabulary and personal pronouns',
  vocabulary: [
    {
      id: 'voc_a1_mother_001',
      word: 'mother',
      translation: 'madre',
      partOfSpeech: 'noun',
      level: 'A1',
      week: 1,
      topic: 'family',
      example: 'My mother is at home.',
      exampleTranslation: 'Mi madre está en casa.',
      verifiedBy: 'curator-username',
      verifiedAt: '2024-01-15',
      status: 'published',
    },
    // ...
  ],
}
```

## Vocabulary Source

The word bank for A1 and A2 is in:
`d:\escuela de ingles Americana\a.md`

- A1: ~1,483 words organized by theme
- A2: ~734 words

This file is the **human reference** for curators. The actual content for the app
must be transcribed into week files following this content model.

## Topic Slugs (A1 Planned)

Based on the word bank structure in `a.md`:

| Week | Topic                   | Target Words |
| ---- | ----------------------- | ------------ |
| 1    | family                  | ~80          |
| 2    | body                    | ~60          |
| 3    | home                    | ~90          |
| 4    | food                    | ~100         |
| 5    | clothing                | ~70          |
| 6    | colors-numbers          | ~60          |
| 7    | time-calendar           | ~80          |
| 8    | places-city             | ~90          |
| 9    | transport               | ~60          |
| 10   | daily-routine-verbs     | ~100         |
| 11   | weather-nature          | ~70          |
| 12   | sports-hobbies          | ~80          |
| 13   | health                  | ~70          |
| 14   | school-work             | ~90          |
| 15   | technology              | ~60          |
| 16   | money-shopping          | ~70          |
| 17   | emotions-feelings       | ~60          |
| 18   | common-adjectives       | ~80          |
| 19   | prepositions-connectors | ~50          |
| 20   | review-mixed            | ~63          |
