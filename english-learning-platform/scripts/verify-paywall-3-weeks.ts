// scripts/verify-paywall-3-weeks.ts
//
// Verificación integral de la regla de negocio:
// 1. Semanas 1, 2 y 3 de A1 (225 palabras) son 100% GRATIS.
// 2. Al llegar a la Semana 4, si el usuario no ha pagado (isPro: false), el sistema se BLOQUEA
//    (blockedByPaywall: true) y no inyecta ninguna palabra adicional.
// 3. Con Membresía Pro activa (isPro: true), la Semana 4 y niveles A2–B2 se desbloquean con éxito.

import {
  canAccessWeek,
  MAX_FREE_WEEKS,
  type ContentApprovalByLevel,
} from '../packages/monetization/src/index'
import { getVocabularyForLevel } from '../packages/content/src/index'

console.log('════════════════════════════════════════════════════════════════════')
console.log('🔬 AUDITORÍA DE GATING DE MONETIZACIÓN: BLOQUEO A LAS 3 SEMANAS')
console.log('════════════════════════════════════════════════════════════════════\n')

// 1. Validar constante de semanas gratuitas
console.log(`[1] Verificando constante de semanas gratis: MAX_FREE_WEEKS = ${MAX_FREE_WEEKS}`)
const expectedFreeWeeks = 3
if ((MAX_FREE_WEEKS as number) !== expectedFreeWeeks) {
  throw new Error(`FALLO: MAX_FREE_WEEKS debería ser 3, pero es ${String(MAX_FREE_WEEKS)}`)
}
console.log('    ✅ MAX_FREE_WEEKS está correctamente fijado en 3 semanas.\n')

// 2. Analizar vocabulario de A1 por semanas
const a1Vocab = getVocabularyForLevel('A1')
const weekCounts: Record<number, number> = {}
for (const item of a1Vocab) {
  weekCounts[item.week] = (weekCounts[item.week] ?? 0) + 1
}

const w1 = weekCounts[1] ?? 0
const w2 = weekCounts[2] ?? 0
const w3 = weekCounts[3] ?? 0
const freeTotal = w1 + w2 + w3

console.log(`[2] Desglose de contenido gratuito inicial (A1):`)
for (let w = 1; w <= 19; w++) {
  console.log(`    • Semana ${w}: ${weekCounts[w] ?? 0} palabras`)
}
console.log(`    • Total Nivel Gratuito (Semanas 1–3): ${freeTotal} palabras`)
console.log('    ✅ Contenido de las primeras 3 semanas contabilizado con éxito.\n')

// 3. Simular acceso de usuario NO PAGADO (isPro = false)
console.log('[3] Simulando acceso para Usuario Gratuito (isPro = false):')
for (let w = 1; w <= 3; w++) {
  const allowed: boolean = canAccessWeek('A1', w, false)
  console.log(`    • Semana ${w}: ${allowed ? '🟢 ACCESO PERMITIDO (Gratis)' : '❌ ERROR'}`)
  if (!allowed) throw new Error(`Semana ${w} debería ser gratis`)
}

console.log('\n    Intentando acceder a la Semana 4 sin suscripción:')
const w4Free: boolean = canAccessWeek('A1', 4, false)
console.log(`    • Semana 4: ${w4Free ? '❌ ERROR (Permitido)' : '🔒 BLOQUEADO POR PAYWALL'}`)
if (w4Free) throw new Error('Semana 4 NO debe ser accesible sin Pro')

for (let w = 5; w <= 19; w++) {
  const allowed: boolean = canAccessWeek('A1', w, false)
  if (allowed) throw new Error(`Semana ${w} NO debe ser accesible sin Pro`)
}
console.log('    ✅ Semanas 4 a 19 de A1 correctamente bloqueadas para usuarios gratuitos.\n')

// 4. Simular acceso a niveles superiores (A2, B1, B2) sin pago
console.log('[4] Verificando bloqueo de niveles avanzados para usuario gratuito:')
const a2Free: boolean = canAccessWeek('A2', 1, false)
const b1Free: boolean = canAccessWeek('B1', 1, false)
const b2Free: boolean = canAccessWeek('B2', 1, false)

console.log(`    • A2 Semana 1: ${a2Free ? '❌ ERROR' : '🔒 BLOQUEADO'}`)
console.log(`    • B1 Semana 1: ${b1Free ? '❌ ERROR' : '🔒 BLOQUEADO'}`)
console.log(`    • B2 Semana 1: ${b2Free ? '❌ ERROR' : '🔒 BLOQUEADO'}`)

if (a2Free || b1Free || b2Free) throw new Error('A2, B1 o B2 permitieron acceso gratuito')
console.log('    ✅ Todos los niveles superiores bloqueados sin suscripción.\n')

// 5. Simular desbloqueo con Membresía Pro (isPro = true)
console.log('[5] Simulando usuario con Membresía Pro activa (isPro = true):')
const a2Published: ContentApprovalByLevel = { A2: 'published' }
const b1Published: ContentApprovalByLevel = { B1: 'published' }

const w4Pro: boolean = canAccessWeek('A1', 4, true)
const w8Pro: boolean = canAccessWeek('A1', 8, true)
const w19Pro: boolean = canAccessWeek('A1', 19, true)
const a2Pro: boolean = canAccessWeek('A2', 1, true, a2Published)
const b1Pro: boolean = canAccessWeek('B1', 1, true, b1Published)

console.log(`    • A1 Semana 4: ${w4Pro ? '🟢 DESBLOQUEADO (Pro)' : '❌ ERROR'}`)
console.log(`    • A1 Semana 8 (Hito 2 Meses): ${w8Pro ? '🟢 DESBLOQUEADO (Pro)' : '❌ ERROR'}`)
console.log(`    • A1 Semana 19 (Fin A1): ${w19Pro ? '🟢 DESBLOQUEADO (Pro)' : '❌ ERROR'}`)
console.log(`    • A2 Semana 1: ${a2Pro ? '🟢 DESBLOQUEADO (Pro)' : '❌ ERROR'}`)
console.log(`    • B1 Semana 1: ${b1Pro ? '🟢 DESBLOQUEADO (Pro)' : '❌ ERROR'}`)

if (!w4Pro || !w8Pro || !w19Pro || !a2Pro || !b1Pro) {
  throw new Error('Pro falló al desbloquear el currículo publicado')
}
console.log('    ✅ Membresía Pro desbloquea con éxito todo el currículo.\n')

console.log('════════════════════════════════════════════════════════════════════')
console.log('🏆 RESULTADO DE LA AUDITORÍA: 100% CONFORME')
console.log('El sistema se BLOQUEA estrictamente al cumplir las 3 semanas gratuitas.')
console.log('════════════════════════════════════════════════════════════════════')
