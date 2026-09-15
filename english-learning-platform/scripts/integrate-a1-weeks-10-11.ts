import fs from 'node:fs'
import path from 'node:path'

const contentDir = path.resolve(__dirname, '../packages/content/src/a1')
const mdPath = path.resolve(__dirname, '../../docs/curacion-docente/A1_Semanas_10_11.md')

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
      ipa: cols[2],
      example: cols[3],
      exampleTranslation: cols[4],
    }
  })

console.log(`Found ${tableRows.length} total rows in markdown`)

const w10Rows = tableRows.slice(0, 80)
const w11Rows = tableRows.slice(80, 80 + 66)

function updateWeekFile(weekNum: number, rows: typeof tableRows, fileName: string) {
  const filePath = path.join(contentDir, fileName)
  let code = fs.readFileSync(filePath, 'utf-8')

  rows.forEach((row) => {
    const escapedWord = row.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const itemRegex = new RegExp(
      `(word:\\s*['"]${escapedWord}['"][\\s\\S]*?)(status:\\s*'approved',)`,
      'm'
    )
    const match = code.match(itemRegex)
    if (match) {
      let block = match[1]
      // clean existing pronunciation/example if any
      block = block.replace(/pronunciation:\s*['"][^'"]*['"],\s*/g, '')
      block = block.replace(/example:\s*['"][^'"]*['"],\s*/g, '')
      block = block.replace(/exampleTranslation:\s*['"][^'"]*['"],\s*/g, '')

      const cleanIpa = row.ipa.replace(/'/g, "\\'")
      const cleanExample = row.example.replace(/'/g, "\\'")
      const cleanTrans = row.exampleTranslation.replace(/'/g, "\\'")

      const fields = `pronunciation: '${cleanIpa}',\n      example: '${cleanExample}',\n      exampleTranslation: '${cleanTrans}',\n      `
      code = code.replace(match[0], block + fields + match[2])
    } else {
      console.warn(`Could not match word: ${row.word} in week ${weekNum}`)
    }
  })

  fs.writeFileSync(filePath, code, 'utf-8')
  console.log(`✅ Updated ${rows.length} words in ${fileName}`)
}

updateWeekFile(10, w10Rows, 'week-10.ts')
updateWeekFile(11, w11Rows, 'week-11.ts')
console.log('🎉 Weeks 10 and 11 successfully integrated!')
