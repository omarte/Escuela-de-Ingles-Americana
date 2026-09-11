import type { CEFRLevel, SRSCard } from '@elp/types'

export interface StreakResult {
  readonly currentStreak: number
  readonly bestStreak: number
  readonly studiedToday: boolean
  readonly lastStudyDate: string | null
  readonly activeDates: readonly string[]
}

export interface LevelAdvancementResult {
  readonly currentLevel: CEFRLevel
  readonly nextLevel: CEFRLevel | null
  readonly totalLevelWords: number
  readonly wordsStarted: number
  readonly wordsMastered: number
  readonly masteryRatio: number
  readonly startedRatio: number
  readonly isEligible: boolean
  readonly remainingWordsToMaster: number
}

export interface WeekDefinition {
  readonly week: number
  readonly title?: string | undefined
  readonly wordIds: readonly string[]
}

export interface WeeklyBreakdownItem {
  readonly week: number
  readonly title?: string | undefined
  readonly totalWords: number
  readonly wordsStarted: number
  readonly wordsMastered: number
  readonly progressRatio: number
  readonly status: 'not_started' | 'in_progress' | 'completed'
}

const CEFR_ORDER: readonly CEFRLevel[] = ['A1', 'A2', 'B1', 'B2']

/**
 * Normalizes an ISO timestamp or date string to YYYY-MM-DD.
 */
function toDateString(d: string | Date): string {
  if (d instanceof Date) {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${String(year)}-${month}-${day}`
  }
  return d.slice(0, 10)
}

/**
 * Gets the day before a given YYYY-MM-DD date.
 */
function getPreviousDateString(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  if (year === undefined || month === undefined || day === undefined) {
    return dateStr
  }
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() - 1)
  return toDateString(date)
}

/**
 * Calculates current streak and best historical streak based on study activity dates.
 *
 * Rules:
 * - If user studied on referenceDate (default today): streak = 1 + consecutive preceding days.
 * - If user didn't study on referenceDate, but studied yesterday: streak is maintained from yesterday (studiedToday = false).
 * - If user missed yesterday and today: streak resets to 0.
 * - Multiple sessions on the same date are deduplicated.
 */
export function calculateStreak(
  studyDates: readonly string[],
  referenceDate?: string,
): StreakResult {
  if (studyDates.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      studiedToday: false,
      lastStudyDate: null,
      activeDates: [],
    }
  }

  // Deduplicate and sort dates ascending
  const uniqueDateSet = new Set<string>()
  for (const raw of studyDates) {
    if (raw && raw.length >= 10) {
      uniqueDateSet.add(toDateString(raw))
    }
  }

  const sortedDates = Array.from(uniqueDateSet).sort()
  if (sortedDates.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      studiedToday: false,
      lastStudyDate: null,
      activeDates: [],
    }
  }

  const todayStr = referenceDate ? toDateString(referenceDate) : toDateString(new Date())
  const yesterdayStr = getPreviousDateString(todayStr)
  const lastStudyDate = sortedDates[sortedDates.length - 1] ?? null
  const studiedToday = uniqueDateSet.has(todayStr)

  // 1. Calculate Current Streak
  let currentStreak = 0

  if (studiedToday) {
    currentStreak = 1
    let checkDate = yesterdayStr
    while (uniqueDateSet.has(checkDate)) {
      currentStreak++
      checkDate = getPreviousDateString(checkDate)
    }
  } else if (uniqueDateSet.has(yesterdayStr)) {
    // Yesterday completed, today is still pending
    currentStreak = 1
    let checkDate = getPreviousDateString(yesterdayStr)
    while (uniqueDateSet.has(checkDate)) {
      currentStreak++
      checkDate = getPreviousDateString(checkDate)
    }
  } else {
    currentStreak = 0
  }

  // 2. Calculate Best Streak across all history
  let bestStreak = 0
  let runningCount = 0
  let prevDate: string | null = null

  for (const dateStr of sortedDates) {
    if (!prevDate) {
      runningCount = 1
    } else {
      const expectedNext = getPreviousDateString(dateStr)
      if (expectedNext === prevDate) {
        runningCount++
      } else {
        runningCount = 1
      }
    }
    if (runningCount > bestStreak) {
      bestStreak = runningCount
    }
    prevDate = dateStr
  }

  bestStreak = Math.max(bestStreak, currentStreak)

  return {
    currentStreak,
    bestStreak,
    studiedToday,
    lastStudyDate,
    activeDates: sortedDates,
  }
}

/**
 * Calculates retention rate percentage based on quality of review events.
 * Quality >= 3 is considered a successful recall in SM-2.
 */
export function calculateRetentionRate(reviews: readonly { quality: number }[]): number {
  if (reviews.length === 0) {
    return 0
  }

  const successful = reviews.filter((r) => r.quality >= 3).length
  return Math.round((successful / reviews.length) * 100)
}

/**
 * Evaluates whether a user is eligible to graduate/advance to the next CEFR level.
 * Default requirement: At least 80% of words in the level are mastered (graduated).
 */
export function evaluateLevelAdvancement(params: {
  currentLevel: CEFRLevel
  totalLevelWords: number
  cards: readonly SRSCard[]
  masteryThresholdRatio?: number
}): LevelAdvancementResult {
  const { currentLevel, totalLevelWords, cards, masteryThresholdRatio = 0.8 } = params

  const currentIndex = CEFR_ORDER.indexOf(currentLevel)
  const nextLevel =
    currentIndex >= 0 && currentIndex < CEFR_ORDER.length - 1
      ? (CEFR_ORDER[currentIndex + 1] ?? null)
      : null

  const wordsStarted = cards.filter((c) => c.reps > 0 || c.state !== 'new').length
  const wordsMastered = cards.filter(
    (c) => c.state === 'review' || c.interval >= 21 || c.reps >= 4,
  ).length

  const safeTotal = Math.max(1, totalLevelWords)
  const masteryRatio = Math.min(1, wordsMastered / safeTotal)
  const startedRatio = Math.min(1, wordsStarted / safeTotal)

  const isEligible = nextLevel !== null && masteryRatio >= masteryThresholdRatio
  const targetMasteryCount = Math.ceil(safeTotal * masteryThresholdRatio)
  const remainingWordsToMaster = Math.max(0, targetMasteryCount - wordsMastered)

  return {
    currentLevel,
    nextLevel,
    totalLevelWords,
    wordsStarted,
    wordsMastered,
    masteryRatio,
    startedRatio,
    isEligible,
    remainingWordsToMaster,
  }
}

/**
 * Generates a week-by-week progress breakdown for a given CEFR level.
 */
export function calculateWeeklyBreakdown(
  weeks: readonly WeekDefinition[],
  cards: readonly SRSCard[],
): WeeklyBreakdownItem[] {
  const cardMap = new Map<string, SRSCard>()
  for (const card of cards) {
    cardMap.set(card.vocabularyItemId, card)
  }

  return weeks.map((w) => {
    let wordsStarted = 0
    let wordsMastered = 0

    for (const wordId of w.wordIds) {
      const card = cardMap.get(wordId)
      if (card) {
        if (card.reps > 0 || card.state !== 'new') {
          wordsStarted++
        }
        if (card.state === 'review' || card.interval >= 21 || card.reps >= 4) {
          wordsMastered++
        }
      }
    }

    const totalWords = w.wordIds.length
    const progressRatio = totalWords > 0 ? wordsStarted / totalWords : 0

    let status: WeeklyBreakdownItem['status'] = 'not_started'
    if (wordsMastered >= totalWords * 0.8 && totalWords > 0) {
      status = 'completed'
    } else if (wordsStarted > 0) {
      status = 'in_progress'
    }

    return {
      week: w.week,
      title: w.title,
      totalWords,
      wordsStarted,
      wordsMastered,
      progressRatio,
      status,
    }
  })
}
