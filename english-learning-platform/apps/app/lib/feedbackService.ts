import AsyncStorage from '@react-native-async-storage/async-storage'
import type { FrictionLevel } from '@elp/types'
import { toLocalDateString } from '@elp/srs'
import { supabase } from './supabase'

export interface SessionFeedbackRecord {
  id: string
  userId: string
  sessionDate: string
  frictionLevel: FrictionLevel
  createdAt: string
  synced: boolean
}

const FEEDBACK_STORAGE_KEY_PREFIX = '@elp_session_feedback_'

/**
 * Persiste la respuesta de dificultad post-sesión del alumno.
 * 1. Almacena en AsyncStorage local de forma inmediata (Offline-first).
 * 2. Si hay conexión y usuario autenticado, sincroniza con la tabla session_feedback de Supabase Cloud.
 */
export async function saveSessionFeedback(
  userId: string,
  level: FrictionLevel,
  date: Date = new Date()
): Promise<SessionFeedbackRecord> {
  const dateStr = toLocalDateString(date)
  const recordId = `fb_${dateStr}_${userId.substring(0, 8)}`

  const record: SessionFeedbackRecord = {
    id: recordId,
    userId,
    sessionDate: dateStr,
    frictionLevel: level,
    createdAt: new Date().toISOString(),
    synced: false,
  }

  // 1. Persistencia local
  const storageKey = `${FEEDBACK_STORAGE_KEY_PREFIX}${userId}`
  try {
    const raw = await AsyncStorage.getItem(storageKey)
    const existing: SessionFeedbackRecord[] = raw ? JSON.parse(raw) : []
    const filtered = existing.filter((item) => item.sessionDate !== dateStr)
    const updated = [record, ...filtered]
    await AsyncStorage.setItem(storageKey, JSON.stringify(updated))
  } catch {
    // Ignorar fallo de escritura local
  }

  // 2. Sincronización remota con Supabase Cloud
  if (supabase && userId && userId !== 'demo-user') {
    void (async () => {
      try {
        const { error } = await supabase.from('session_feedback').upsert(
          {
            user_id: userId,
            session_date: dateStr,
            friction_level: level,
          },
          { onConflict: 'user_id,session_date' }
        )

        if (!error) {
          // Marcar como sincronizado localmente
          try {
            const raw = await AsyncStorage.getItem(storageKey)
            if (raw) {
              const list: SessionFeedbackRecord[] = JSON.parse(raw)
              const syncedList = list.map((item) =>
                item.sessionDate === dateStr ? { ...item, synced: true } : item
              )
              await AsyncStorage.setItem(storageKey, JSON.stringify(syncedList))
            }
          } catch {
            // Ignorar
          }
        }
      } catch {
        // Red no disponible o usuario offline — el registro queda guardado localmente
      }
    })()
  }

  return record
}

/**
 * Obtiene el historial de retroalimentación del alumno.
 */
export async function getSessionFeedbackHistory(
  userId: string
): Promise<SessionFeedbackRecord[]> {
  const storageKey = `${FEEDBACK_STORAGE_KEY_PREFIX}${userId}`
  try {
    const raw = await AsyncStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as SessionFeedbackRecord[]) : []
  } catch {
    return []
  }
}
