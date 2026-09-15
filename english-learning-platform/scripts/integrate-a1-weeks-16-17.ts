import fs from 'node:fs'
import path from 'node:path'

const contentDir = path.resolve(__dirname, '../packages/content/src/a1')
const mdPath = path.resolve(__dirname, '../../docs/curacion-docente/A1_Semanas_16_17.md')

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
    let word = cols[1] ?? ''
    if (word === 'direction (rumbo)') {
      word = 'direction'
    }
    return {
      word,
      category: cols[2] ?? '',
      ipa: cols[3] ?? '',
      example: cols[4] ?? '',
      exampleTranslation: cols[5] ?? '',
    }
  })
  .filter((r) => r.word.length > 0)

console.log(`Found ${tableRows.length} total rows in markdown`)

// Week 16 has 105 words
// Week 17 has 109 words
const w16Rows = tableRows.slice(0, 105)
const w17Rows = tableRows.slice(105, 105 + 109)

function normalizePos(cat: string): string {
  const c = cat.toLowerCase().trim()
  if (c.includes('phrasal-verb') || c.includes('phrasal verb')) return 'phrasal-verb'
  if (c.includes('preposition')) return 'preposition'
  if (c.includes('conjunction')) return 'conjunction'
  if (c.includes('adverb phrase')) return 'adverb'
  if (c.includes('determiner')) return 'determiner'
  if (c.includes('adverb')) return 'adverb'
  if (c.includes('pronoun')) return 'pronoun'
  if (c.includes('verb')) return 'verb'
  if (c.includes('noun')) return 'noun'
  if (c.includes('adjective')) return 'adjective'
  return 'noun'
}

function updateWeekFile(weekNum: number, rows: typeof tableRows, fileName: string) {
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
    if (match?.[1] && match?.[2]) {
      matchedCount++
      let block = match[1]
      const statusField = match[2]

      // clean existing pronunciation/example/exampleTranslation if any
      block = block.replace(/pronunciation:\s*['"][^\n]*?['"],\s*\n?\s*/g, '')
      block = block.replace(/example:\s*['"][^\n]*?['"],\s*\n?\s*/g, '')
      block = block.replace(/exampleTranslation:\s*['"][^\n]*?['"],\s*\n?\s*/g, '')

      // update partOfSpeech if row has category
      if (row.category) {
        const targetPos = normalizePos(row.category)
        block = block.replace(/partOfSpeech:\s*['"][^'"]*['"],\s*/g, `partOfSpeech: '${targetPos}',\n      `)
      }

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

updateWeekFile(16, w16Rows, 'week-16.ts')
updateWeekFile(17, w17Rows, 'week-17.ts')
