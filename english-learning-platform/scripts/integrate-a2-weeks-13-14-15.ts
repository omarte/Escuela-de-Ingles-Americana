import fs from 'node:fs'
import path from 'node:path'

const contentDir = path.resolve(__dirname, '../packages/content/src/a2')
const mdPath = path.resolve(__dirname, '../../docs/curacion-docente/A2_Semanas_13_14_15.md')

if (!fs.existsSync(mdPath)) {
  console.error(`File not found: ${mdPath}`)
  process.exit(1)
}

interface TableRow {
  word: string
  category: string
  ipa: string
  example: string
  exampleTranslation: string
}

const mdContent = fs.readFileSync(mdPath, 'utf-8')
const tableRows: TableRow[] = mdContent
  .split('\n')
  .filter((line) => line.startsWith('|') && !line.includes('Palabra') && !line.includes('---'))
  .map((line): TableRow => {
    const cols = line.split('|').map((c) => c.trim())
    return {
      word: cols[1] ?? '',
      category: cols[2] ?? '',
      ipa: cols[3] ?? '',
      example: cols[4] ?? '',
      exampleTranslation: cols[5] ?? '',
    }
  })
  .filter((r) => r.word.length > 0)

console.log(`Found ${tableRows.length} total rows in markdown`)

// A2 Week 13: 40 words
// A2 Week 14: 42 words
// A2 Week 15: 48 words
const w13Rows = tableRows.slice(0, 40)
const w14Rows = tableRows.slice(40, 40 + 42)
const w15Rows = tableRows.slice(40 + 42, 40 + 42 + 48)

console.log(`w13: ${w13Rows.length}, w14: ${w14Rows.length}, w15: ${w15Rows.length}`)

function normalizePos(word: string, cat: string): string {
  const w = word.toLowerCase().trim()
  const c = cat.toLowerCase().trim()

  // Specific overrides for accuracy
  if (w === 'opponent') return 'noun'
  if (w === 'substitute (player)') return 'noun'
  if (w === 'treadmill') return 'noun'
  if (w === 'headline') return 'noun'
  if (w === 'influencer') return 'noun'
  if (w === 'viral') return 'adjective'
  if (w === 'trending') return 'adjective'
  if (w === 'bestselling') return 'adjective'
  if (w === 'live stream') return 'noun'
  if (w === 'stand-up comedy') return 'noun'

  if (c.includes('phrasal-verb') || c.includes('phrasal verb')) return 'phrasal-verb'
  if (c.includes('preposition')) return 'preposition'
  if (c.includes('conjunction')) return 'conjunction'
  if (c.includes('adverb')) return 'adverb'
  if (c.includes('pronoun')) return 'pronoun'
  if (c.includes('verb')) return 'verb'
  if (c.includes('adjective')) return 'adjective'
  if (c.includes('noun')) return 'noun'
  return 'noun'
}

function updateWeekFile(weekNum: number, rows: TableRow[], fileName: string): void {
  const filePath = path.join(contentDir, fileName)
  let code = fs.readFileSync(filePath, 'utf-8')
  let matchedCount = 0

  rows.forEach((row) => {
    const escapedWord = row.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const itemRegex = new RegExp(
      `(word:\\s*['"]${escapedWord}['"][\\s\\S]*?)(status:\\s*'approved',)`,
      'm'
    )
    const match = code.match(itemRegex)
    if (match?.[1] && match[2]) {
      matchedCount++
      let block = match[1]
      const statusField = match[2]

      // clean existing pronunciation/example/exampleTranslation if any
      block = block.replace(/pronunciation:\s*['"][^\n]*?['"],\s*\n?\s*/g, '')
      block = block.replace(/example:\s*['"][^\n]*?['"],\s*\n?\s*/g, '')
      block = block.replace(/exampleTranslation:\s*['"][^\n]*?['"],\s*\n?\s*/g, '')

      // update partOfSpeech
      const targetPos = normalizePos(row.word, row.category)
      block = block.replace(/partOfSpeech:\s*['"][^'"]*['"],\s*/g, `partOfSpeech: '${targetPos}',\n      `)

      const cleanIpa = row.ipa.replace(/'/g, "\\'")
      const cleanExample = row.example.replace(/'/g, "\\'")
      const cleanTrans = row.exampleTranslation.replace(/'/g, "\\'")

      const fields = `pronunciation: '${cleanIpa}',\n      example: '${cleanExample}',\n      exampleTranslation: '${cleanTrans}',\n      `
      code = code.replace(match[0], block + fields + statusField)
    } else {
      console.warn(`Could not match word: "${row.word}" in week ${weekNum}`)
    }
  })

  fs.writeFileSync(filePath, code, 'utf-8')
  console.log(`Updated week ${weekNum} (${fileName}): ${matchedCount}/${rows.length} words matched.`)
}

updateWeekFile(13, w13Rows, 'week-13.ts')
updateWeekFile(14, w14Rows, 'week-14.ts')
updateWeekFile(15, w15Rows, 'week-15.ts')
