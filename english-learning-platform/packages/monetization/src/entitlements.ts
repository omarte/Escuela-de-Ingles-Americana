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
 * Reglas de acceso, en una sola función auditable:
 * 1. A1 siempre es gratis, sin importar el entitlement.
 * 2. Cualquier otro nivel requiere `pro_access` activo.
 * 3. Aunque tenga `pro_access`, un nivel solo es accesible si su contenido
 *    ya está aprobado pedagógicamente (published/approved) — un pago NUNCA
 *    debe destapar contenido todavía en "curated".
 */
export function canAccessLevel(
  level: CEFRLevel,
  hasProEntitlement: boolean,
  approvalByLevel: ContentApprovalByLevel,
): boolean {
  if (level === 'A1') return true

  const approval = approvalByLevel[level]
  const isPedagogicallyApproved = approval !== undefined && LEVELS_VISIBLE_TO_STUDENTS.has(approval)

  return hasProEntitlement && isPedagogicallyApproved
}

/**
 * Devuelve la lista de niveles que el usuario puede estudiar hoy, dado su
 * entitlement y el estado real del contenido. Útil para pintar el selector
 * de niveles sin repetir la lógica de canAccessLevel en cada pantalla.
 */
export function getAccessibleLevels(
  hasProEntitlement: boolean,
  approvalByLevel: ContentApprovalByLevel,
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
  approvalByLevel: ContentApprovalByLevel,
): LevelLockReason {
  if (canAccessLevel(level, hasProEntitlement, approvalByLevel)) return 'unlocked'

  const approval = approvalByLevel[level]
  const isPedagogicallyApproved = approval !== undefined && LEVELS_VISIBLE_TO_STUDENTS.has(approval)

  if (!isPedagogicallyApproved) return 'not_yet_available'
  return 'requires_purchase'
}
