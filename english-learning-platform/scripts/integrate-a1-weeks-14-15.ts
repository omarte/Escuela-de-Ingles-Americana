import fs from 'node:fs'
import path from 'node:path'

const contentDir = path.resolve(__dirname, '../packages/content/src/a1')
const mdPath = path.resolve(__dirname, '../../docs/curacion-docente/A1_Semanas_14_15.md')

if (!fs.existsSync(mdPath)) {
  console.error(`File not found: ${mdPath}`)
  process.exit(1)
}

const mdContent = fs.readFileSync(mdPath, 'utf-8')
const tableRows = mdContent
  .split('\n')
  .filter((line) => line.startsWith('|') && !line.includes('Palabra') && !line.includes('---'))
  .map((line) => {
    const cols = line.split('|').map((c) => c.trim())
    return {
      word: cols[1],
      category: cols[2],
      ipa: cols[3],
      example: cols[4],
      exampleTranslation: cols[5],
    }
  })

console.log(`Found ${tableRows.length} total rows in markdown`)

const w14Rows = tableRows.slice(0, 55)
const w15Rows = tableRows.slice(55, 55 + 62)

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
  return 'adverb'
}

function updateWeekFile(weekNum: number, rows: typeof tableRows, fileName: string) {
  const filePath = path.join(contentDir, fileName)
  let code = fs.readFileSync(filePath, 'utf-8')
  let matchedCount = 0

  rows.forEach((row) => {
    let wordTarget = row.word
    if (wordTarget === 'before') {
      code = code.replace(/word:\s*['"]before \(place\/time\)['"]/g, "word: 'before'")
      code = code.replace(/(id:\s*'voc_a1_before_002'[\s\S]*?partOfSpeech:\s*)'noun'/m, "$1'preposition'")
    } else if (wordTarget === 'while') {
      code = code.replace(/word:\s*['"]while \(conj\.\)['"]/g, "word: 'while'")
      code = code.replace(/(id:\s*'voc_a1_while_002'[\s\S]*?partOfSpeech:\s*)'noun'/m, "$1'conjunction'")
    }

    const escapedWord = wordTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const itemRegex = new RegExp(
      `(word:\\s*['"]${escapedWord}['"][\\s\\S]*?)(status:\\s*'approved',)`,
      'm'
    )
    const match = code.match(itemRegex)
    if (match) {
      matchedCount++
      let block = match[1]

      // clean existing pronunciation/example/exampleTranslation if any
      block = block.replace(/pronunciation:\s*['"][^'"]*['"],\s*/g, '')
      block = block.replace(/example:\s*['"][^'"]*['"],\s*/g, '')
      block = block.replace(/exampleTranslation:\s*['"][^'"]*['"],\s*/g, '')

      // update partOfSpeech if row has category
      const targetPos = normalizePos(row.category)
      block = block.replace(/partOfSpeech:\s*['"][^'"]*['"],\s*/g, `partOfSpeech: '${targetPos}',\n      `)

      const cleanIpa = row.ipa.replace(/'/g, "\\'")
      const cleanExample = row.example.replace(/'/g, "\\'")
      const cleanTrans = row.exampleTranslation.replace(/'/g, "\\'")

      const fields = `pronunciation: '${cleanIpa}',\n      example: '${cleanExample}',\n      exampleTranslation: '${cleanTrans}',\n      `
      code = code.replace(match[0], block + fields + match[2])
    } else {
      console.warn(`Could not match word: "${row.word}" in week ${weekNum}`)
    }
  })

  fs.writeFileSync(filePath, code, 'utf-8')
  console.log(`Updated week ${weekNum} (${fileName}): ${matchedCount}/${rows.length} words matched.`)
}

updateWeekFile(14, w14Rows, 'week-14.ts')
updateWeekFile(15, w15Rows, 'week-15.ts')
