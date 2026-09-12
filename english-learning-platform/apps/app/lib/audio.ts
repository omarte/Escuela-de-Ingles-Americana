import * as Speech from 'expo-speech'
import { Platform } from 'react-native'

/**
 * Audio voice helper for English language pronunciation.
 * Configured with native English dialect and tuned speech rate (0.85x - 0.88x)
 * for optimal clarity in early CEFR levels (A1/A2).
 */
export async function speakEnglish(word: string): Promise<void> {
  if (!word || word.trim().length === 0) return

  const cleanText = word.trim()

  try {
    const isSpeaking = await Speech.isSpeakingAsync()
    if (isSpeaking) {
      await Speech.stop()
    }

    Speech.speak(cleanText, {
      language: 'en-US',
      rate: Platform.OS === 'ios' ? 0.85 : 0.88,
      pitch: 1.0,
    })
  } catch {
    // Graceful catch if audio service is unavailable or muted
  }
}
