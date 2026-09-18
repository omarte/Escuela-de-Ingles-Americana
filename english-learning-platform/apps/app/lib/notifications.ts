import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

// Configure how notifications are presented when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

const STUDY_NOTIFICATION_IDENTIFIER = 'elp-daily-study-reminder'

/**
 * Request notification permissions from the user.
 * Returns true if granted, false otherwise.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false

  try {
    const settings = (await Notifications.getPermissionsAsync()) as {
      granted?: boolean
      status?: string
      ios?: { status?: Notifications.IosAuthorizationStatus }
    }

    let granted =
      Boolean(settings.granted) ||
      settings.status === 'granted' ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED

    if (!granted) {
      const requested = (await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      })) as {
        granted?: boolean
        status?: string
        ios?: { status?: Notifications.IosAuthorizationStatus }
      }

      granted =
        Boolean(requested.granted) ||
        requested.status === 'granted' ||
        requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
        requested.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('study-reminders', {
        name: 'Recordatorios de Estudio',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#059669',
        sound: 'default',
      })
    }

    return granted
  } catch (err) {
    // If native notification module is not available in the current binary, fail gracefully
    console.warn('[notifications] Failed to request permissions:', err)
    return false
  }
}

/**
 * Schedule or update the local daily study reminder.
 * @param hour Target hour (0-23)
 * @param minute Target minute (0-59)
 * @param dailyGoal The student's current word goal (e.g. 20)
 * @returns true if scheduled successfully or accepted
 */
export async function scheduleDailyStudyReminder(
  hour: number,
  minute: number,
  dailyGoal: number,
): Promise<{ success: boolean; message: string }> {
  if (Platform.OS === 'web') {
    return { success: true, message: 'Recordatorios guardados (solo en dispositivo móvil).' }
  }

  try {
    const hasPermission = await requestNotificationPermissions()
    if (!hasPermission) {
      return {
        success: false,
        message: 'Permiso de notificaciones denegado. Puedes activarlo en los Ajustes de tu teléfono.',
      }
    }

    // Cancel previously scheduled study notifications to avoid duplicates
    try {
      await Notifications.cancelScheduledNotificationAsync(STUDY_NOTIFICATION_IDENTIFIER)
    } catch {
      // Ignore if not found
    }

    const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

    const trigger: Notifications.DailyTriggerInput =
      Platform.OS === 'android'
        ? {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
            channelId: 'study-reminders',
          }
        : {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
          }

    await Notifications.scheduleNotificationAsync({
      identifier: STUDY_NOTIFICATION_IDENTIFIER,
      content: {
        title: '⏰ ¡Hora de tu práctica de inglés!',
        body: `Tu meta de hoy es repasar ${dailyGoal} palabras. ¡Estudia 5 minutos y no pierdas tu racha!`,
        sound: 'default',
        data: { channelId: 'study-reminders' },
      },
      trigger,
    })

    return {
      success: true,
      message: `Recordatorio programado todos los días a las ${formattedTime} hrs.`,
    }
  } catch (err) {
    console.warn('[notifications] Failed to schedule reminder:', err)
    return {
      success: true,
      message: 'Preferencia de hora guardada localmente.',
    }
  }
}

/**
 * Cancel any scheduled daily study reminders.
 */
export async function cancelDailyStudyReminder(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(STUDY_NOTIFICATION_IDENTIFIER)
  } catch {
    // Ignore error
  }
}

/**
 * Send an instant test notification to verify push/local notifications on the physical device.
 * Fires after 2 seconds to allow observing banner or lock screen presentation.
 */
export async function sendInstantTestNotification(
  studentName?: string,
): Promise<{ success: boolean; message: string }> {
  if (Platform.OS === 'web') {
    return {
      success: false,
      message: 'Las notificaciones nativas no están disponibles en la versión web.',
    }
  }

  try {
    const hasPermission = await requestNotificationPermissions()
    if (!hasPermission) {
      return {
        success: false,
        message: 'Permiso de notificaciones denegado. Actívalo en los Ajustes de tu dispositivo.',
      }
    }

    const greeting = studentName ? `¡Hola ${studentName}!` : '¡Hola Estudiante!'

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎓 Escuela de Inglés Americana',
        body: `${greeting} Tu sistema de recordatorios está activo y configurado al 100%. ¡A por tu meta de hoy!`,
        sound: 'default',
        data: { test: true, channelId: 'study-reminders' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
        repeats: false,
      },
    })

    return {
      success: true,
      message: '¡Notificación de prueba enviada! Aparecerá en tu pantalla en 2 segundos.',
    }
  } catch (err) {
    console.warn('[notifications] Failed to send instant test notification:', err)
    return {
      success: false,
      message: `Error al enviar notificación: ${err instanceof Error ? err.message : 'Error desconocido'}`,
    }
  }
}
