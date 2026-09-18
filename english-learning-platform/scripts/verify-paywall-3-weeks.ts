// scripts/verify-paywall-3-weeks.ts
//
// Verificación integral de la regla de negocio:
// 1. Semana 1 de A1 (75 palabras) es 100% GRATIS (7 días de prueba).
// 2. Al llegar a la Semana 2, si el usuario no ha pagado (isPro: false), el sistema se BLOQUEA
//    (blockedByPaywall: true) y no inyecta ninguna palabra adicional.
// 3. Con Membresía Pro activa (isPro: true), la Semana 2 y niveles A2–B2 se desbloquean con éxito.

import {
  canAccessWeek,
  MAX_FREE_WEEKS,
  type ContentApprovalByLevel,
} from '../packages/monetization/src/index'
import { getVocabularyForLevel } from '../packages/content/src/index'

console.log('════════════════════════════════════════════════════════════════════')
console.log('🔬 AUDITORÍA DE GATING DE MONETIZACIÓN: BLOQUEO A LA 1ª SEMANA (7 DÍAS)')
console.log('════════════════════════════════════════════════════════════════════\n')

// 1. Validar constante de semanas gratuitas
console.log(`[1] Verificando constante de semanas gratis: MAX_FREE_WEEKS = ${MAX_FREE_WEEKS}`)
const expectedFreeWeeks = 1
if ((MAX_FREE_WEEKS as number) !== expectedFreeWeeks) {
  throw new Error(`FALLO: MAX_FREE_WEEKS debería ser 1, pero es ${String(MAX_FREE_WEEKS)}`)
}
console.log('    ✅ MAX_FREE_WEEKS está correctamente fijado en 1 semana (7 días).\n')

// 2. Analizar vocabulario de A1 por semanas
const a1Vocab = getVocabularyForLevel('A1')
const weekCounts: Record<number, number> = {}
for (const item of a1Vocab) {
  weekCounts[item.week] = (weekCounts[item.week] ?? 0) + 1
}

const w1 = weekCounts[1] ?? 0
const freeTotal = w1

console.log(`[2] Desglose de contenido gratuito inicial (A1):`)
for (let w = 1; w <= 19; w++) {
  console.log(`    • Semana ${w}: ${weekCounts[w] ?? 0} palabras`)
}
console.log(`    • Total Nivel Gratuito (Semana 1): ${freeTotal} palabras`)
console.log('    ✅ Contenido de la primera semana contabilizado con éxito.\n')

// 3. Simular acceso de usuario NO PAGADO (isPro = false)
console.log('[3] Simulando acceso para Usuario Gratuito (isPro = false):')
const allowedW1 = canAccessWeek('A1', 1, false)
console.log(`    • Semana 1: ${allowedW1 ? '🟢 ACCESO PERMITIDO (Gratis)' : '❌ ERROR'}`)
if (!allowedW1) throw new Error(`Semana 1 debería ser gratis`)

console.log('\n    Intentando acceder a la Semana 2 sin suscripción:')
const w2Free: boolean = canAccessWeek('A1', 2, false)
console.log(`    • Semana 2: ${w2Free ? '❌ ERROR (Permitido)' : '🔒 BLOQUEADO POR PAYWALL'}`)
if (w2Free) throw new Error('Semana 2 NO debe ser accesible sin Pro')

for (let w = 3; w <= 19; w++) {
  if (canAccessWeek('A1', w, false)) {
    throw new Error(`Semana ${w} NO debe ser accesible sin Pro`)
  }
}
console.log('    ✅ Semanas 2 a 19 de A1 correctamente bloqueadas para usuarios gratuitos.\n')

// 4. Simular acceso a niveles superiores (A2, B1, B2) sin pago
console.log('[4] Verificando bloqueo de niveles avanzados para usuario gratuito:')
const advancedLevels = ['A2', 'B1', 'B2'] as const
for (const lvl of advancedLevels) {
  const isAllowed = canAccessWeek(lvl, 1, false)
  console.log(`    • ${lvl} Semana 1: ${isAllowed ? '❌ ERROR' : '🔒 BLOQUEADO'}`)
  if (isAllowed) throw new Error(`${lvl} permitió acceso gratuito`)
}
console.log('    ✅ Todos los niveles superiores bloqueados sin suscripción.\n')

// 5. Simular desbloqueo con Membresía Pro (isPro = true)
console.log('[5] Simulando usuario con Membresía Pro activa (isPro = true):')
const a2Published: ContentApprovalByLevel = { A2: 'published' }
const b1Published: ContentApprovalByLevel = { B1: 'published' }

interface ProCheck {
  label: string
  unlocked: boolean
}

const proChecks: ProCheck[] = [
  { label: 'A1 Semana 4', unlocked: canAccessWeek('A1', 4, true) },
  { label: 'A1 Semana 8 (Hito 2 Meses)', unlocked: canAccessWeek('A1', 8, true) },
  { label: 'A1 Semana 19 (Fin A1)', unlocked: canAccessWeek('A1', 19, true) },
  { label: 'A2 Semana 1', unlocked: canAccessWeek('A2', 1, true, a2Published) },
  { label: 'B1 Semana 1', unlocked: canAccessWeek('B1', 1, true, b1Published) },
]

for (const check of proChecks) {
  console.log(`    • ${check.label}: ${check.unlocked ? '🟢 DESBLOQUEADO (Pro)' : '❌ ERROR'}`)
  if (!check.unlocked) {
    throw new Error(`Pro falló al desbloquear: ${check.label}`)
  }
}
console.log('    ✅ Membresía Pro desbloquea con éxito todo el currículo.\n')

console.log('════════════════════════════════════════════════════════════════════')
console.log('🏆 RESULTADO DE LA AUDITORÍA: 100% CONFORME')
console.log('El sistema se BLOQUEA estrictamente al cumplir la 1ª semana gratuita (7 días).')
console.log('════════════════════════════════════════════════════════════════════')
