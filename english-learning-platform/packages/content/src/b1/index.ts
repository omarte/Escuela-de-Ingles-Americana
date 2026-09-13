/**
 * B1 Level Content — INDEX
 * Curated thematic curriculum (Zero AI)
 * Based on institutional curriculum (PLAN DE ESTUDIO.md)
 */
import type { LevelContent } from '../types'
import { week01 } from './week-01'
import { week02 } from './week-02'
import { week03 } from './week-03'
import { week04 } from './week-04'
import { week05 } from './week-05'
import { week06 } from './week-06'
import { week07 } from './week-07'
import { week08 } from './week-08'
import { week09 } from './week-09'

export { week01, week02, week03, week04, week05, week06, week07, week08, week09 }

export const b1Content: LevelContent = {
  level: 'B1',
  totalWeeks: 9,
  blocks: [week01, week02, week03, week04, week05, week06, week07, week08, week09],
}
