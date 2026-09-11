/**
 * A2 Level Content — INDEX
 * Complete A2 Curated Content (Weeks 1 to 15)
 * Zero AI — 100% Curated from a.md / PLAN DE ESTUDIO.md
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
import { week10 } from './week-10'
import { week11 } from './week-11'
import { week12 } from './week-12'
import { week13 } from './week-13'
import { week14 } from './week-14'
import { week15 } from './week-15'

export const a2Content: LevelContent = {
  level: 'A2',
  totalWeeks: 15,
  blocks: [
    week01,
    week02,
    week03,
    week04,
    week05,
    week06,
    week07,
    week08,
    week09,
    week10,
    week11,
    week12,
    week13,
    week14,
    week15,
  ],
}
