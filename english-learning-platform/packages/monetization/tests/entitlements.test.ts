import { describe, it, expect } from 'vitest'
import {
  canAccessLevel,
  getAccessibleLevels,
  getLevelLockReason,
  canAccessWeek,
  getWeekLockReason,
  MAX_FREE_WEEKS,
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

describe('canAccessWeek y Gating de 1 Semana Gratis', () => {
  it('MAX_FREE_WEEKS está fijado exactamente en 1', () => {
    expect(MAX_FREE_WEEKS).toBe(1)
  })

  it('A1 Semana 1 es 100% GRATIS sin suscripción Pro', () => {
    expect(canAccessWeek('A1', 1, false)).toBe(true)
    expect(getWeekLockReason('A1', 1, false)).toBe('unlocked')
  })

  it('A1 Semana 2 se BLOQUEA si el usuario no tiene Pro (dispara paywall)', () => {
    expect(canAccessWeek('A1', 2, false)).toBe(false)
    expect(getWeekLockReason('A1', 2, false)).toBe('requires_purchase')
  })

  it('A1 Semanas 3 a 19 se BLOQUEAN si el usuario no tiene Pro', () => {
    for (let w = 3; w <= 19; w++) {
      expect(canAccessWeek('A1', w, false)).toBe(false)
      expect(getWeekLockReason('A1', w, false)).toBe('requires_purchase')
    }
  })

  it('A1 Semanas 2 a 19 se DESBLOQUEAN con Pro activo', () => {
    for (let w = 2; w <= 19; w++) {
      expect(canAccessWeek('A1', w, true)).toBe(true)
      expect(getWeekLockReason('A1', w, true)).toBe('unlocked')
    }
  })

  it('A2 cualquier semana se BLOQUEA si no tiene Pro', () => {
    const approvals = { A2: 'published' as const }
    expect(canAccessWeek('A2', 1, false, approvals)).toBe(false)
    expect(getWeekLockReason('A2', 1, false, approvals)).toBe('requires_purchase')
  })

  it('A2 se DESBLOQUEA con Pro si el contenido está publicado', () => {
    const approvals = { A2: 'published' as const }
    expect(canAccessWeek('A2', 1, true, approvals)).toBe(true)
    expect(getWeekLockReason('A2', 1, true, approvals)).toBe('unlocked')
  })

  it('B1 no desbloquea semana si sigue en curaduría docente aun teniendo Pro', () => {
    const approvals = { B1: 'curated' as const }
    expect(canAccessWeek('B1', 1, true, approvals)).toBe(false)
    expect(getWeekLockReason('B1', 1, true, approvals)).toBe('not_yet_available')
  })
})

