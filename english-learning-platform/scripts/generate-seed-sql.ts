import fs from 'node:fs'
import path from 'node:path'
import { a1Content, a2Content, b1Content, b2Content } from '../packages/content/src/index'

interface SeedRow {
  id: string
  level: string
  week: number
  topic: string
  status: string
  verifiedBy: string
  verifiedAt: string
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''")
}

function collectAllRows(): SeedRow[] {
  const rows: SeedRow[] = []
  const levels = [a1Content, a2Content, b1Content, b2Content]

  for (const lvl of levels) {
    for (const block of lvl.blocks) {
      for (const item of block.vocabulary) {
        rows.push({
          id: item.id,
          level: block.level,
          week: block.week,
          topic: block.topic,
          status: item.status,
          verifiedBy: item.verifiedBy,
          verifiedAt: item.verifiedAt,
        })
      }
    }
  }

  return rows
}

function generateSeedSql(): void {
  const rows = collectAllRows()
  const outputPath = path.resolve(__dirname, '../supabase/seed.sql')

  const header = `-- ─────────────────────────────────────────────────────────────────────────────
-- Supabase Database Seed File: content_words
-- Generated automatically from packages/content/
-- Total Vocabulary Items: ${rows.length}
-- Levels: A1, A2, B1, B2 (Escuela de Inglés Americana)
-- ─────────────────────────────────────────────────────────────────────────────

-- Disable RLS temporarily during initial seeding or run as postgres / service_role
`

  const chunkSize = 150
  const chunks: string[] = []

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize)
    const values = chunk
      .map(
        (r) =>
          `  ('${escapeSql(r.id)}', '${escapeSql(r.level)}'::cefr_level, ${r.week}, '${escapeSql(r.topic)}', '${escapeSql(r.status)}'::content_status, '${escapeSql(r.verifiedBy)}', '${escapeSql(r.verifiedAt)}')`,
      )
      .join(',\n')

    chunks.push(`INSERT INTO content_words (id, level, week, topic, status, verified_by, verified_at)
VALUES
${values}
ON CONFLICT (id) DO UPDATE SET
  level = EXCLUDED.level,
  week = EXCLUDED.week,
  topic = EXCLUDED.topic,
  status = EXCLUDED.status,
  verified_by = EXCLUDED.verified_by,
  verified_at = EXCLUDED.verified_at;
`)
  }

  const fullSql = header + '\n' + chunks.join('\n')
  fs.writeFileSync(outputPath, fullSql, 'utf-8')

  console.log(`✅ Seed SQL generated successfully: ${outputPath}`)
  console.log(`   Total items written: ${rows.length}`)
}

generateSeedSql()
