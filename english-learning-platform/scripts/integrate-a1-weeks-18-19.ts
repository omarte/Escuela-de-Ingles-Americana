import fs from 'node:fs'
import path from 'node:path'

const contentDir = path.resolve(__dirname, '../packages/content/src/a1')
const mdPath = path.resolve(__dirname, '../../docs/curacion-docente/A1_Semanas_18_19.md')

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

// Week 18 has 104 words
// Week 19 has 50 words
const w18Rows = tableRows.slice(0, 104)
const w19Rows = tableRows.slice(104, 104 + 50)

function normalizePos(cat: string): string {
  const c = cat.toLowerCase().trim()
  if (c.includes('preposition')) return 'preposition'
  if (c.includes('conjunction')) return 'conjunction'
  if (c.includes('adverb phrase')) return 'adverb'
  if (c.includes('determiner')) return 'determiner'
  if (c.includes('adverb')) return 'adverb'
  if (c.includes('pronoun')) return 'pronoun'
  if (c.includes('verb')) return 'verb'
  if (c.includes('noun')) return 'noun'
  if (c.includes('adjective')) return 'adjective'
  return 'verb'
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
    if (match && match[1] && match[2]) {
      matchedCount++
      let block = match[1]
      const statusField = match[2]

      // clean existing pronunciation/example/exampleTranslation if any
      block = block.replace(/pronunciation:\s*['"][^'"]*['"],\s*/g, '')
      block = block.replace(/example:\s*['"][^'"]*['"],\s*/g, '')
      block = block.replace(/exampleTranslation:\s*['"][^'"]*['"],\s*/g, '')

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

updateWeekFile(18, w18Rows, 'week-18.ts')
updateWeekFile(19, w19Rows, 'week-19.ts')
