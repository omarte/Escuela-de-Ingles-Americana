// packages/monetization/src/entitlements.ts
// Lógica PURA de qué nivel puede estudiar un usuario. No importa nada del SDK
// de RevenueCat aquí a propósito: esto se puede testear sin dispositivo,
// sin sandbox de Apple/Google, y sin mockear nada nativo.

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'D1' | 'D2'
export type ContentApprovalState = 'draft' | 'curated' | 'teacher_reviewed' | 'published' | 'approved'

export const PRO_ENTITLEMENT_ID = 'pro_access'

/**
 * Estado de aprobación pedagógica de cada nivel en el registro de contenido.
 * Esto viene de `packages/content`, NO de RevenueCat.
 */
export type ContentApprovalByLevel = Partial<Record<CEFRLevel, ContentApprovalState>>

const LEVELS_VISIBLE_TO_STUDENTS: ReadonlySet<ContentApprovalState> = new Set([
  'published',
  'approved',
])

/**
 * Número máximo de semanas que un estudiante puede estudiar 100% gratis
 * en el Nivel A1 (75 palabras curadas con fonética IPA y SM-2).
 * A partir de la Semana 2 se requiere Membresía Pro activa.
 */
export const MAX_FREE_WEEKS = 1

/**
 * Reglas de acceso, en una sola función auditable:
 * 1. A1 siempre es accesible para explorar (su acceso semanal se rige por canAccessWeek).
 * 2. Cualquier otro nivel requiere `pro_access` activo.
 * 3. Aunque tenga `pro_access`, un nivel solo es accesible si su contenido
 *    ya está aprobado pedagógicamente (published/approved) — un pago NUNCA
 *    debe destapar contenido todavía en "curated".
 */
export function canAccessLevel(
  level: CEFRLevel,
  hasProEntitlement: boolean,
  approvalByLevel: ContentApprovalByLevel = {},
): boolean {
  if (level === 'A1') return true

  const approval = approvalByLevel[level]
  const isPedagogicallyApproved = approval !== undefined && LEVELS_VISIBLE_TO_STUDENTS.has(approval)

  return hasProEntitlement && isPedagogicallyApproved
}

/**
 * Valida si un estudiante puede estudiar una semana específica dentro de un nivel.
 * - Nivel A1, Semana 1: 100% GRATIS (con o sin Pro).
 * - Nivel A1, Semanas 2 en adelante: Requiere `hasProEntitlement === true`.
 * - Niveles A2, B1, B2: Requiere `hasProEntitlement === true` y contenido aprobado.
 */
export function canAccessWeek(
  level: CEFRLevel,
  week: number,
  hasProEntitlement: boolean,
  approvalByLevel: ContentApprovalByLevel = {},
): boolean {
  // La primera semana de A1 siempre es gratuita
  if (level === 'A1' && week <= MAX_FREE_WEEKS) {
    return true
  }

  // Todo lo demás requiere Pro y validación de aprobación pedagógica
  if (!hasProEntitlement) {
    return false
  }

  // Para A1 semanas 4+, el nivel ya está aprobado
  if (level === 'A1') {
    return true
  }

  // Para A2+, verificar que el nivel esté publicado/aprobado
  const approval = approvalByLevel[level]
  return approval !== undefined && LEVELS_VISIBLE_TO_STUDENTS.has(approval)
}

/**
 * Devuelve la lista de niveles que el usuario puede estudiar hoy, dado su
 * entitlement y el estado real del contenido. Útil para pintar el selector
 * de niveles sin repetir la lógica de canAccessLevel en cada pantalla.
 */
export function getAccessibleLevels(
  hasProEntitlement: boolean,
  approvalByLevel: ContentApprovalByLevel = {},
): CEFRLevel[] {
  const allLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
  return allLevels.filter((level) => canAccessLevel(level, hasProEntitlement, approvalByLevel))
}

/**
 * Por qué un nivel está bloqueado, para decidir qué UI mostrar:
 * - "requires_purchase": el usuario necesita pagar (paywall).
 * - "not_yet_available": aunque pagara, el contenido no está listo (no mostrar paywall, mostrar "próximamente").
 * - "unlocked": ya tiene acceso.
 */
export type LevelLockReason = 'unlocked' | 'requires_purchase' | 'not_yet_available'

export function getLevelLockReason(
  level: CEFRLevel,
  hasProEntitlement: boolean,
  approvalByLevel: ContentApprovalByLevel = {},
): LevelLockReason {
  if (canAccessLevel(level, hasProEntitlement, approvalByLevel)) return 'unlocked'

  const approval = approvalByLevel[level]
  const isPedagogicallyApproved = approval !== undefined && LEVELS_VISIBLE_TO_STUDENTS.has(approval)

  if (!isPedagogicallyApproved) return 'not_yet_available'
  return 'requires_purchase'
}

/**
 * Determina la razón de bloqueo de una semana específica:
 * - "unlocked": la semana está accesible para estudiar.
 * - "requires_purchase": la semana pertenece al tier Pro (A1 sem 4+ o A2-B2) y el usuario no ha pagado.
 * - "not_yet_available": el contenido aún está en curaduría docente.
 */
export function getWeekLockReason(
  level: CEFRLevel,
  week: number,
  hasProEntitlement: boolean,
  approvalByLevel: ContentApprovalByLevel = {},
): LevelLockReason {
  if (canAccessWeek(level, week, hasProEntitlement, approvalByLevel)) {
    return 'unlocked'
  }

  if (level !== 'A1') {
    const approval = approvalByLevel[level]
    const isPedagogicallyApproved = approval !== undefined && LEVELS_VISIBLE_TO_STUDENTS.has(approval)
    if (!isPedagogicallyApproved) {
      return 'not_yet_available'
    }
  }

  return 'requires_purchase'
}

