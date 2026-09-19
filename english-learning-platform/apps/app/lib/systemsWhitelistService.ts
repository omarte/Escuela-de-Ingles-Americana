import AsyncStorage from '@react-native-async-storage/async-storage'

// Storage Keys
const STORAGE_KEY_WHITELIST = '@elp/systems_whitelist_emails'
const STORAGE_KEY_PRO_GRANTED = '@elp/systems_institutional_pro_granted'
const STORAGE_KEY_PRO_ACTIVATED_EMAIL = '@elp/systems_institutional_activated_email'

// Master Activation Codes (Sistemas)
export const VALID_ACTIVATION_CODES = [
  'SISTEMAS-EIA-2026',
  'VIP-BETA-2026',
  'BECA-AMERICANA-100',
  'OZMAR-TESTER-PRO',
]

// Default pre-authorized tester accounts (10 slots)
export const DEFAULT_WHITELISTED_EMAILS: readonly string[] = [
  'ozmartinezpaz@gmail.com',
  'soporte@escueladeinglesamericana.com',
  'sistemas@escueladeinglesamericana.com',
  'evaluador1@gmail.com',
  'evaluador2@gmail.com',
  'evaluador3@gmail.com',
  'evaluador4@gmail.com',
  'evaluador5@gmail.com',
  'evaluador6@gmail.com',
  'evaluador7@gmail.com',
]

type WhitelistChangeListener = (isPro: boolean) => void
const listeners = new Set<WhitelistChangeListener>()

function notifyListeners(isPro: boolean): void {
  listeners.forEach((listener) => {
    try {
      listener(isPro)
    } catch {
      // safe notify
    }
  })
}

export const systemsWhitelistService = {
  /**
   * Obtiene la lista actual de correos en la lista blanca de Sistemas.
   */
  async getWhitelistedEmails(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_WHITELIST)
      if (!raw) {
        // Inicializar con la lista por defecto
        await AsyncStorage.setItem(STORAGE_KEY_WHITELIST, JSON.stringify(DEFAULT_WHITELISTED_EMAILS))
        return [...DEFAULT_WHITELISTED_EMAILS]
      }
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : [...DEFAULT_WHITELISTED_EMAILS]
    } catch {
      return [...DEFAULT_WHITELISTED_EMAILS]
    }
  },

  /**
   * Agrega un nuevo correo a la lista blanca de Sistemas.
   */
  async addWhitelistedEmail(email: string): Promise<{ success: boolean; message: string; emails: string[] }> {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Por favor ingresa un correo electrónico válido.', emails: [] }
    }

    try {
      const currentList = await this.getWhitelistedEmails()
      if (currentList.some((e) => e.toLowerCase() === cleanEmail)) {
        return { success: true, message: 'El correo ya se encuentra en la lista blanca.', emails: currentList }
      }

      const updatedList = [cleanEmail, ...currentList]
      await AsyncStorage.setItem(STORAGE_KEY_WHITELIST, JSON.stringify(updatedList))
      return { success: true, message: `Correo ${cleanEmail} agregado exitosamente a la lista blanca.`, emails: updatedList }
    } catch (err) {
      return { success: false, message: 'No se pudo guardar el correo en almacenamiento.', emails: [] }
    }
  },

  /**
   * Remueve un correo de la lista blanca de Sistemas.
   */
  async removeWhitelistedEmail(email: string): Promise<{ success: boolean; message: string; emails: string[] }> {
    const cleanEmail = email.trim().toLowerCase()
    try {
      const currentList = await this.getWhitelistedEmails()
      const updatedList = currentList.filter((e) => e.toLowerCase() !== cleanEmail)
      await AsyncStorage.setItem(STORAGE_KEY_WHITELIST, JSON.stringify(updatedList))
      return { success: true, message: `Correo ${cleanEmail} removido de la lista blanca.`, emails: updatedList }
    } catch {
      return { success: false, message: 'No se pudo actualizar la lista blanca.', emails: [] }
    }
  },

  /**
   * Restablece la lista blanca a los 10 valores por defecto.
   */
  async resetToDefaults(): Promise<string[]> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_WHITELIST, JSON.stringify(DEFAULT_WHITELISTED_EMAILS))
      return [...DEFAULT_WHITELISTED_EMAILS]
    } catch {
      return [...DEFAULT_WHITELISTED_EMAILS]
    }
  },

  /**
   * Verifica si un correo específico está en la lista blanca de Sistemas.
   */
  async checkEmailInWhitelist(email?: string | null): Promise<boolean> {
    if (!email) return false
    const cleanEmail = email.trim().toLowerCase()
    const currentList = await this.getWhitelistedEmails()
    return currentList.some((e) => e.toLowerCase() === cleanEmail)
  },

  /**
   * Valida un correo de usuario contra la lista blanca y le otorga Pro si coincide.
   */
  async validateAndGrantByEmail(email?: string | null): Promise<{ success: boolean; isWhitelisted: boolean; message: string }> {
    if (!email || !email.includes('@')) {
      return {
        success: false,
        isWhitelisted: false,
        message: 'No se detectó un correo electrónico de usuario válido para validar.',
      }
    }

    const cleanEmail = email.trim().toLowerCase()
    const isWhitelisted = await this.checkEmailInWhitelist(cleanEmail)

    if (isWhitelisted) {
      await AsyncStorage.setItem(STORAGE_KEY_PRO_GRANTED, 'true')
      await AsyncStorage.setItem(STORAGE_KEY_PRO_ACTIVATED_EMAIL, cleanEmail)
      notifyListeners(true)
      return {
        success: true,
        isWhitelisted: true,
        message: `¡Acceso Autorizado! Tu correo (${cleanEmail}) está registrado en la lista blanca del Dpto. de Sistemas. Membresía Pro Institucional activada de por vida.`,
      }
    }

    return {
      success: false,
      isWhitelisted: false,
      message: `El correo ${cleanEmail} no está en la lista de evaluadores autorizados. Puedes ingresar una clave de activación o solicitar registro al Dpto. de Sistemas.`,
    }
  },

  /**
   * Valida un código de activación institucional y otorga Pro si es correcto.
   */
  async validateActivationCode(code: string, userEmail?: string | null): Promise<{ success: boolean; message: string }> {
    const cleanCode = code.trim().toUpperCase()
    if (!cleanCode) {
      return { success: false, message: 'Por favor ingresa un código de activación institucional.' }
    }

    const isValid = VALID_ACTIVATION_CODES.includes(cleanCode)
    if (isValid) {
      await AsyncStorage.setItem(STORAGE_KEY_PRO_GRANTED, 'true')
      if (userEmail) {
        const cleanEmail = userEmail.trim().toLowerCase()
        await AsyncStorage.setItem(STORAGE_KEY_PRO_ACTIVATED_EMAIL, cleanEmail)
        // Auto-add to whitelist
        await this.addWhitelistedEmail(cleanEmail)
      }
      notifyListeners(true)
      return {
        success: true,
        message: '¡Código Institucional Válido! Se ha activado la Membresía Pro de por vida asignada por el Departamento de Sistemas.',
      }
    }

    return {
      success: false,
      message: 'Código de activación incorrecto o expirado. Verifica con el Departamento de Sistemas.',
    }
  },

  /**
   * Verifica si el dispositivo actual tiene la licencia institucional activa.
   */
  async isInstitutionalProActive(currentEmail?: string | null): Promise<boolean> {
    try {
      // 1. Verificar si el correo actual está directamente en la lista blanca
      if (currentEmail && (await this.checkEmailInWhitelist(currentEmail))) {
        return true
      }

      // 2. Verificar si se activó por flag persistente
      const granted = await AsyncStorage.getItem(STORAGE_KEY_PRO_GRANTED)
      return granted === 'true'
    } catch {
      return false
    }
  },

  /**
   * Revoca la licencia institucional en este dispositivo.
   */
  async revokeInstitutionalPro(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_PRO_GRANTED)
      await AsyncStorage.removeItem(STORAGE_KEY_PRO_ACTIVATED_EMAIL)
      notifyListeners(false)
    } catch {
      // safe ignore
    }
  },

  /**
   * Suscripción a cambios de estado institucional para actualizar UI en tiempo real.
   */
  subscribe(listener: WhitelistChangeListener): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}
