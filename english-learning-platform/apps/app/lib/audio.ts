import * as Speech from 'expo-speech'
import { Platform } from 'react-native'
import { useStudyPreferencesStore } from '../stores/useStudyPreferencesStore'

/**
 * Audio voice helper for English language pronunciation.
 * Configured with native English dialect and tuned speech rate:
 * - US_STANDARD: 0.85x - 0.88x (Natural fluent pacing)
 * - US_SLOW: 0.72x - 0.75x (Phonetic study clarity)
 */
export async function speakEnglish(word: string, customRate?: number): Promise<void> {
  if (!word || word.trim().length === 0) return

  const cleanText = word.trim()
  const variant = useStudyPreferencesStore.getState().pronunciationVariant

  let rate: number
  if (customRate !== undefined) {
    rate = customRate
  } else if (variant === 'US_SLOW') {
    rate = Platform.OS === 'ios' ? 0.72 : 0.75
  } else {
    rate = Platform.OS === 'ios' ? 0.85 : 0.88
  }

  try {
    const isSpeaking = await Speech.isSpeakingAsync()
    if (isSpeaking) {
      await Speech.stop()
    }

    Speech.speak(cleanText, {
      language: 'en-US',
      rate,
      pitch: 1.0,
    })
  } catch {
    // Graceful catch if audio service is unavailable or muted
  }
}

/**
 * Audio voice helper for Spanish language pronunciation.
 * Used for audio stimulus and reinforcement without revealing English spelling.
 */
export async function speakSpanish(text: string): Promise<void> {
  if (!text || text.trim().length === 0) return

  const cleanText = text.trim()

  try {
    const isSpeaking = await Speech.isSpeakingAsync()
    if (isSpeaking) {
      await Speech.stop()
    }

    Speech.speak(cleanText, {
      language: 'es-ES',
      rate: Platform.OS === 'ios' ? 0.88 : 0.9,
      pitch: 1.0,
    })
  } catch {
    // Graceful catch if audio service is unavailable
  }
}

