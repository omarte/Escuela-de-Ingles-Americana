import fs from 'node:fs'
import path from 'node:path'

const contentDir = path.resolve(__dirname, '../packages/content/src/b1')
const mdPath = path.resolve(__dirname, '../../docs/curacion-docente/B1_Semanas_7_8_9.md')

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

// B1 Week 7: 23 words
// B1 Week 8: 15 words
// B1 Week 9: 24 words
const w7Rows = tableRows.slice(0, 23)
const w8Rows = tableRows.slice(23, 23 + 15)
const w9Rows = tableRows.slice(23 + 15, 23 + 15 + 24)

console.log(`w7: ${w7Rows.length}, w8: ${w8Rows.length}, w9: ${w9Rows.length}`)

function normalizePos(word: string, cat: string): string {
  const w = word.toLowerCase().trim()
  const c = cat.toLowerCase().trim()

  // Specific contextual corrections
  if (w === 'complain') return 'verb'
  if (w === 'admire') return 'verb'
  if (w === 'resent') return 'verb'
  if (w === 'supply') return 'noun'

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
    // Match either {"word": "..." or {word: '...'
    const itemRegex = new RegExp(
      `([{\\s]['"]?word['"]?\\s*:\\s*['"]${escapedWord}['"][\\s\\S]*?)(['"]?status['"]?\\s*:\\s*['"][^'"]+['"],?)`,
      'm'
    )
    const match = code.match(itemRegex)
    if (match?.[1] && match[2]) {
      matchedCount++
      let block = match[1]

      // clean existing pronunciation/example/exampleTranslation if any
      block = block.replace(/['"]?pronunciation['"]?:\s*['"][^\n]*?['"],\s*\n?\s*/g, '')
      block = block.replace(/['"]?example['"]?:\s*['"][^\n]*?['"],\s*\n?\s*/g, '')
      block = block.replace(/['"]?exampleTranslation['"]?:\s*['"][^\n]*?['"],\s*\n?\s*/g, '')

      // update partOfSpeech
      const targetPos = normalizePos(row.word, row.category)
      block = block.replace(/['"]?partOfSpeech['"]?:\s*['"][^'"]*['"],\s*/g, `partOfSpeech: '${targetPos}',\n      `)

      // standardize field keys in block
      block = block.replace(/["']id["']:/g, 'id:')
      block = block.replace(/["']word["']:/g, 'word:')
      block = block.replace(/["']translation["']:/g, 'translation:')
      block = block.replace(/["']partOfSpeech["']:/g, 'partOfSpeech:')
      block = block.replace(/["']level["']:/g, 'level:')
      block = block.replace(/["']week["']:/g, 'week:')
      block = block.replace(/["']topic["']:/g, 'topic:')
      block = block.replace(/["']verifiedBy["']:/g, 'verifiedBy:')
      block = block.replace(/["']verifiedAt["']:/g, 'verifiedAt:')
      block = block.replace(/["']source["']:/g, 'source:')

      const cleanIpa = row.ipa.replace(/'/g, "\\'")
      const cleanExample = row.example.replace(/'/g, "\\'")
      const cleanTrans = row.exampleTranslation.replace(/'/g, "\\'")

      const fields = `pronunciation: '${cleanIpa}',\n      example: '${cleanExample}',\n      exampleTranslation: '${cleanTrans}',\n      status: 'approved',`
      code = code.replace(match[0], block + fields)
    } else {
      console.warn(`Could not match word: "${row.word}" in week ${weekNum}`)
    }
  })

  // Clean top-level block keys if any JSON quotes remain
  code = code.replace(/"level":/g, 'level:')
  code = code.replace(/"week":/g, 'week:')
  code = code.replace(/"topic":/g, 'topic:')
  code = code.replace(/"vocabulary":/g, 'vocabulary:')

  fs.writeFileSync(filePath, code, 'utf-8')
  console.log(`Updated week ${weekNum} (${fileName}): ${matchedCount}/${rows.length} words matched.`)
}

updateWeekFile(7, w7Rows, 'week-07.ts')
updateWeekFile(8, w8Rows, 'week-08.ts')
updateWeekFile(9, w9Rows, 'week-09.ts')
