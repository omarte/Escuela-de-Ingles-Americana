import { describe, it, expect } from 'vitest'
import {
  canAccessLevel,
  getAccessibleLevels,
  getLevelLockReason,
} from '../src/entitlements'

describe('canAccessLevel', () => {
  it('A1 siempre es accesible, con o sin entitlement', () => {
    expect(canAccessLevel('A1', false, {})).toBe(true)
    expect(canAccessLevel('A1', true, {})).toBe(true)
  })

  it('A2 requiere pro_access, incluso si el contenido está aprobado', () => {
    const approvals = { A2: 'published' as const }
    expect(canAccessLevel('A2', false, approvals)).toBe(false)
    expect(canAccessLevel('A2', true, approvals)).toBe(true)
  })

  it("CRÍTICO: pagar NUNCA destapa un nivel todavía en 'curated'", () => {
    const approvals = { B1: 'curated' as const, B2: 'curated' as const }
    // Este es exactamente el escenario que motivó toda la migración de contenido:
    // un usuario Pro pagando no debe ver B1/B2 hasta que un profesor los apruebe.
    expect(canAccessLevel('B1', true, approvals)).toBe(false)
    expect(canAccessLevel('B2', true, approvals)).toBe(false)
  })

  it("B1 se desbloquea automáticamente para usuarios Pro en cuanto pasa a 'published', sin nuevo cobro", () => {
    const approvals = { B1: 'published' as const }
    expect(canAccessLevel('B1', true, approvals)).toBe(true)
  })

  it("'teacher_reviewed' por sí solo NO es suficiente para mostrarse al alumno", () => {
    // teacher_reviewed es un paso intermedio explícito antes de 'published'.
    const approvals = { B1: 'teacher_reviewed' as const }
    expect(canAccessLevel('B1', true, approvals)).toBe(false)
  })

  it('sin entrada de aprobación para el nivel, se trata como no disponible', () => {
    expect(canAccessLevel('C1', true, {})).toBe(false)
  })
})

describe('getAccessibleLevels', () => {
  it('devuelve solo A1 para un usuario free sin niveles aprobados más allá de A1/A2', () => {
    const approvals = { A2: 'published' as const }
    expect(getAccessibleLevels(false, approvals)).toEqual(['A1'])
  })

  it('devuelve A1 y A2 para un usuario Pro cuando B1/B2 siguen en curaduría', () => {
    const approvals = {
      A2: 'published' as const,
      B1: 'curated' as const,
      B2: 'curated' as const,
    }
    expect(getAccessibleLevels(true, approvals)).toEqual(['A1', 'A2'])
  })

  it('devuelve todos los niveles aprobados para un usuario Pro una vez B1/B2 publiquen', () => {
    const approvals = {
      A2: 'published' as const,
      B1: 'published' as const,
      B2: 'approved' as const,
    }
    expect(getAccessibleLevels(true, approvals)).toEqual(['A1', 'A2', 'B1', 'B2'])
  })
})

describe('getLevelLockReason', () => {
  it("distingue entre 'necesita pagar' y 'todavía no existe', para no mostrar el paywall equivocado", () => {
    const approvals = { A2: 'published' as const, B1: 'curated' as const }

    // A2 está listo pedagógicamente pero el usuario no pagó -> mostrar paywall
    expect(getLevelLockReason('A2', false, approvals)).toBe('requires_purchase')

    // B1 no está listo pedagógicamente, con o sin pago -> mostrar "próximamente", NUNCA el paywall
    expect(getLevelLockReason('B1', true, approvals)).toBe('not_yet_available')
    expect(getLevelLockReason('B1', false, approvals)).toBe('not_yet_available')
  })

  it('un nivel ya desbloqueado no debe mostrar ningún candado', () => {
    const approvals = { A2: 'published' as const }
    expect(getLevelLockReason('A2', true, approvals)).toBe('unlocked')
  })
})
