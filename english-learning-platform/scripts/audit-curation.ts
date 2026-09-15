import {
  a1Content,
  a2Content,
  b1Content,
  b2Content,
} from '../packages/content/src/index'

const levels = [
  { name: 'A1', content: a1Content },
  { name: 'A2', content: a2Content },
  { name: 'B1', content: b1Content },
  { name: 'B2', content: b2Content },
]

let grandTotalVocab = 0
let grandTotalCurated = 0

for (const { name, content } of levels) {
  console.log(`\n=== ESTADO DE CURADURÍA ${name} ===`)
  let levelVocab = 0
  let levelCurated = 0

  for (const block of content.blocks) {
    const withPron = block.vocabulary.filter((v) => !!v.pronunciation).length
    const total = block.vocabulary.length
    levelVocab += total
    levelCurated += withPron
    const pct = Math.round((withPron / total) * 100)
    const statusIcon = pct === 100 ? '✅' : pct > 0 ? '⚠️' : '❌'
    console.log(
      `${statusIcon} Semana ${String(block.week).padStart(2, '0')}: ${withPron}/${total} palabras (${pct}%)`
    )
  }

  grandTotalVocab += levelVocab
  grandTotalCurated += levelCurated
  const levelPct = Math.round((levelCurated / levelVocab) * 100)
  console.log('--------------------------------')
  console.log(
    `SUBTOTAL ${name}: ${levelCurated}/${levelVocab} palabras curadas (${levelPct}%)`
  )
}

console.log('\n================================')
console.log(
  `TOTAL GENERAL MONOREPO: ${grandTotalCurated}/${grandTotalVocab} palabras (${Math.round((grandTotalCurated / grandTotalVocab) * 100)}%)`
)
