/**
 * B2 Level Content — INDEX
 * Curated thematic curriculum (Zero AI)
 * Based on institutional curriculum (PLAN DE ESTUDIO.md)
 */
import type { LevelContent } from '../types'
import { week01 } from './week-01'
import { week02 } from './week-02'
import { week03 } from './week-03'
import { week04 } from './week-04'

export { week01, week02, week03, week04 }

export const b2Content: LevelContent = {
  level: 'B2',
  totalWeeks: 4,
  blocks: [week01, week02, week03, week04],
}
