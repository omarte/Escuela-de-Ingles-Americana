import { a1Content } from '../packages/content/src/index'

console.log('=== ESTADO DE CURADURÍA A1 ===')
let totalVocab = 0
let totalCurated = 0

for (const block of a1Content.blocks) {
  const withPron = block.vocabulary.filter((v) => !!v.pronunciation).length
  const total = block.vocabulary.length
  totalVocab += total
  totalCurated += withPron
  const pct = Math.round((withPron / total) * 100)
  const statusIcon = pct === 100 ? '✅' : pct > 0 ? '⚠️' : '❌'
  console.log(
    `${statusIcon} Semana ${String(block.week).padStart(2, '0')}: ${withPron}/${total} palabras (${pct}%)`
  )
}

console.log('--------------------------------')
console.log(
  `TOTAL A1: ${totalCurated}/${totalVocab} palabras curadas (${Math.round((totalCurated / totalVocab) * 100)}%)`
)
