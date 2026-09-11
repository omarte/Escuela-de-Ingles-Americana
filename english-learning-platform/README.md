# English Learning Platform

## Development Environment

Read **CLAUDE.md** first. It contains all rules for working on this project.

## Quick Start

```bash
# Install dependencies
pnpm install

# Validate content
pnpm content:validate

# Run all tests
pnpm test

# Typecheck
pnpm typecheck

# Lint
pnpm lint
```

## Project Structure

```
english-learning-platform/
├── apps/
│   └── app/              # Expo mobile app (React Native + Expo Router)
├── packages/
│   ├── content/          # Educational content (HUMAN CURATED ONLY)
│   ├── database/         # Supabase client + types
│   ├── srs/              # Spaced repetition system engine
│   ├── types/            # Shared TypeScript domain types
│   ├── ui/               # Shared UI components
│   └── validation/       # Zod schemas
├── supabase/
│   └── migrations/       # PostgreSQL migrations
├── scripts/
│   ├── validate-content.ts
│   └── check-duplicates.ts
└── docs/
    ├── architecture/
    └── content/
```

## Key Commands

| Command                   | Description                        |
| ------------------------- | ---------------------------------- |
| `pnpm install`            | Install all workspace dependencies |
| `pnpm dev`                | Start all apps in dev mode         |
| `pnpm build`              | Build all packages and apps        |
| `pnpm test`               | Run all tests                      |
| `pnpm typecheck`          | TypeScript strict check            |
| `pnpm lint`               | ESLint across workspace            |
| `pnpm content:validate`   | Validate content schema and IDs    |
| `pnpm content:duplicates` | Check for duplicate vocabulary     |
| `pnpm format`             | Format all files with Prettier     |

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Regenerating Supabase Types

After applying database migrations:

```bash
pnpm --filter @elp/database generate-types
```

This requires Supabase CLI to be installed and a local or cloud project configured.

## Documentation

- [Architecture Overview](docs/architecture/overview.md)
- [Content Model](docs/content/content-model.md)
- [Content Workflow](docs/content/content-workflow.md)
- [Database Model](docs/database/database-model.md)
- [SRS Architecture](docs/architecture/srs.md)
- [Project Rules](CLAUDE.md)
