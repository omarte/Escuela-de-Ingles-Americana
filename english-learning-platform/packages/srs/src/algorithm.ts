import type { CalculateNextReview, ReviewResult } from './types'
import { DEFAULT_SRS_CONFIG } from './types'
import type { CardState } from '@elp/types'

/**
 * Cognitive friction threshold in milliseconds.
 * Answers that take longer than this indicate hidden uncertainty even when correct.
 * References: discusion-pedagogica.md §9 (Telemetría de Latencia Cognitiva)
 */
const FRICTION_THRESHOLD_MS = 7_000

/**
 * Full SM-2 modified spaced repetition algorithm.
 *
 * Implements:
 * 1. Grade scale 0..5 validation.
 * 2. Latency degradation: if latencyMs > FRICTION_THRESHOLD_MS, caps effective
 *    quality at 3 (Correct but uncertain → tighter interval).
 * 3. Ease factor adjustment:
 *    EF' = clamp(EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)), minEase, maxEase)
 * 4. Learning steps progression (1 day → 4 days → graduation).
 * 5. Review interval growth (I(n) = round(I(n-1) * EF)).
 * 6. Lapse / failure handling: resets reps, increments lapses, enters 'relearning'.
 * 7. Dominated threshold: marks card as 'dominated' once interval reaches dominatedThreshold (default 90 days).
 *
 * @param input - Current card parameters and review quality
 * @param configOverrides - Custom settings (ease bounds, thresholds, etc.)
 */
export const calculateNextReview: CalculateNextReview = (input, configOverrides): ReviewResult => {
  const config = { ...DEFAULT_SRS_CONFIG, ...configOverrides }

  if (input.quality < 0 || input.quality > 5 || !Number.isInteger(input.quality)) {
    throw new Error('Review quality must be an integer between 0 and 5')
  }

  // ── Latency Degradation (Cognitive Friction Detection) ───────────────────
  // If the user took more than FRICTION_THRESHOLD_MS to answer, the correct
  // answer reflects hidden uncertainty rather than solid recall.
  // We cap the effective quality at 3 so the ease factor grows more slowly
  // and the next review is scheduled sooner.
  // This is transparent to the caller: the original quality is logged in
  // review_events for analytics; only the scheduling uses effectiveQuality.
  const hasFriction =
    input.latencyMs !== undefined && input.latencyMs > FRICTION_THRESHOLD_MS
  const effectiveQuality = hasFriction
    ? (Math.min(input.quality, 3) as typeof input.quality)
    : input.quality

  const q = effectiveQuality
  const passes = q >= config.passingQuality

  // 1. Calculate new Ease Factor (SM-2 formula)
  const delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
  const rawEaseFactor = input.easeFactor + delta
  const clampedEaseFactor = Math.min(
    config.maxEaseFactor,
    Math.max(config.minEaseFactor, rawEaseFactor),
  )
  const newEaseFactor = Math.round(clampedEaseFactor * 100) / 100

  let newInterval: number
  let newReps: number
  let newLapses: number
  let newState: CardState

  const step1 = config.learningIntervals[0] ?? 1
  const step2 = config.learningIntervals[1] ?? 4

  if (!passes) {
    // Failure (Grade 0, 1, or 2)
    newReps = 0
    newLapses = input.lapses + 1
    newInterval = step1

    if (input.currentState === 'review' || input.currentState === 'dominated') {
      newState = 'relearning'
    } else {
      newState = 'learning'
    }
  } else {
    // Success (Grade 3, 4, or 5)
    newReps = input.reps + 1
    newLapses = input.lapses

    if (input.currentState === 'new') {
      newInterval = step1
      newState = 'learning'
    } else if (input.currentState === 'learning' || input.currentState === 'relearning') {
      if (newReps === 1) {
        newInterval = step1
        newState = input.currentState
      } else if (newReps === 2) {
        newInterval = step2
        newState = input.currentState
      } else {
        // Graduate from learning/relearning to review (or dominated)
        newInterval = Math.max(1, Math.round(step2 * newEaseFactor))
        newState = newInterval >= config.dominatedThreshold ? 'dominated' : 'review'
      }
    } else {
      // Card is in 'review' or 'dominated'
      const baseInterval = input.interval > 0 ? input.interval : step2
      newInterval = Math.max(1, Math.round(baseInterval * newEaseFactor))
      newState = newInterval >= config.dominatedThreshold ? 'dominated' : 'review'
    }
  }

  // Calculate next due date
  const reviewedAtDate = new Date(input.reviewedAt)
  const dueDateObj = new Date(reviewedAtDate.getTime())
  dueDateObj.setUTCDate(dueDateObj.getUTCDate() + newInterval)

  return {
    state: newState,
    interval: newInterval,
    easeFactor: newEaseFactor,
    reps: newReps,
    lapses: newLapses,
    dueDate: dueDateObj.toISOString(),
  }
}
