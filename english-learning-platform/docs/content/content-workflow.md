# Content Workflow

## Curation Process

Content follows a strict 4-stage lifecycle managed by human curators:

```
1. draft → 2. review → 3. approved → 4. published
```

AI is PROHIBITED from generating content at any stage.

## How to Add a New Week

1. **Create week file**

   ```
   packages/content/src/a1/week-XX.ts
   ```

2. **Fill vocabulary items** following the format in `content-model.md`
   - Use IDs from the word bank in `a.md`
   - Set `status: 'draft'`
   - Set `verifiedBy` to your GitHub username

3. **Import in level index**

   ```typescript
   // packages/content/src/a1/index.ts
   import { weekXX } from './week-XX'
   // Add to blocks array
   ```

4. **Validate**

   ```bash
   pnpm content:validate
   pnpm content:duplicates
   ```

5. **Open PR** with status `draft`
   - Another curator reviews → changes status to `review`
   - Lead curator approves → changes status to `approved`

6. **Publish** — change status to `published` in the same PR or a separate deploy PR

## ID Assignment

1. Look up word in `a.md`
2. Determine slug: lowercase, hyphens only (no numbers)
3. Find next available sequence for that slug:
   - Search existing content for `voc_{level}_{slug}_`
   - Increment the highest seq found, or start at `001`
4. Write the permanent ID — never change it after publication

## Curator Checklist

Before marking a word as `review`:

- [ ] Word is in the A1/A2 vocabulary bank (`a.md`)
- [ ] Translation is the most common Spanish equivalent
- [ ] Example sentence is natural, simple English
- [ ] Example translation is accurate Spanish
- [ ] Part of speech is correct
- [ ] Week and topic match the planned week structure
- [ ] ID format is correct: `voc_{level}_{slug}_{seq}`
- [ ] `verifiedBy` is your username
- [ ] `verifiedAt` is today's date (YYYY-MM-DD)
- [ ] `pnpm content:validate` passes with no errors

## Bulk Import

For large batches (full week at once):

1. Draft the content in a spreadsheet
2. Convert to TypeScript format manually (NO AI assistance)
3. Run validation
4. Open PR with `status: 'draft'` for all items
5. Review items one by one before merging
