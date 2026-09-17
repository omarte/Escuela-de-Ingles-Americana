import { getSpanishPhonetic } from './phonetics'

/**
 * Generador pedagógico de tips ortográficos y mnemotécnicos.
 * Analiza discrepancias entre lo escrito por el alumno y la palabra meta en inglés.
 */
export function generateSpellingTip(target: string, typed: string, translation: string): string {
  const cleanTarget = target.trim().toLowerCase()
  const cleanTyped = typed.trim().toLowerCase()
  const phoneticHelper = getSpanishPhonetic(cleanTarget)

  if (!cleanTyped) {
    return `"${translation}" se pronuncia /${phoneticHelper}/ y se escribe "${cleanTarget}". Repítela en voz alta.`
  }

  // Transposición (letras correctas pero orden cambiado)
  if (
    cleanTyped.length === cleanTarget.length &&
    cleanTyped.split('').sort().join('') === cleanTarget.split('').sort().join('')
  ) {
    return `Tienes las letras correctas pero en orden invertido. Secuencia exacta: "${cleanTarget}".`
  }

  // Patrón -ght
  if (cleanTarget.endsWith('ght') && !cleanTyped.endsWith('ght')) {
    return `Termina con el patrón mudo '-ght' ("${cleanTarget}"). Se pronuncia /${phoneticHelper}/.`
  }

  // k muda
  if (cleanTarget.startsWith('kn') && !cleanTyped.startsWith('kn')) {
    return `En "${cleanTarget}", la 'k' inicial es muda pero obligatoria.`
  }

  // w muda
  if (cleanTarget.startsWith('wr') && !cleanTyped.startsWith('wr')) {
    return `En "${cleanTarget}", la 'w' inicial es muda. Empieza directamente con el sonido /r/.`
  }

  // Doble ee
  if (cleanTarget.includes('ee') && cleanTyped.includes('i')) {
    return `En inglés usa doble 'ee' para el sonido /iː/: "${cleanTarget}".`
  }

  // ea
  if (cleanTarget.includes('ea') && !cleanTyped.includes('ea')) {
    return `Atención a la combinación vocálica 'ea': "${cleanTarget}".`
  }

  // -tion vs -cion
  if (cleanTarget.endsWith('tion') && cleanTyped.endsWith('cion')) {
    return `En inglés los sustantivos terminan en '-tion', no con 'c': "${cleanTarget}".`
  }

  // flu vs grip
  if (cleanTarget === 'flu') {
    return `"Flu" viene de 'influenza'. Recuerda no confundir con "grip" (agarrar).`
  }

  // Doble oo
  if (cleanTarget.includes('oo') && !cleanTyped.includes('oo')) {
    return `En inglés usa doble 'oo' para el sonido /uː/: "${cleanTarget}".`
  }

  // Letras muy incompletas (más de 2 letras faltantes)
  if (cleanTarget.length - cleanTyped.length >= 3) {
    return `Te faltaron ${cleanTarget.length - cleanTyped.length} letras. "${cleanTarget}" tiene ${cleanTarget.length} letras en total.`
  }

  // Consonantes dobles (bb, cc, dd, ff, gg, ll, mm, nn, pp, rr, ss, tt, zz)
  const doubleConsonantRegex = /([bcdfghjklmnpqrstvwxyz])\1/i
  const hasDoubleConsonantTarget = doubleConsonantRegex.test(cleanTarget)
  const hasDoubleConsonantTyped = doubleConsonantRegex.test(cleanTyped)
  if (hasDoubleConsonantTarget && !hasDoubleConsonantTyped) {
    return `Lleva consonante doble. Revisa la ortografía de "${cleanTarget}".`
  }

  // Letras faltantes
  if (cleanTyped.length < cleanTarget.length) {
    return `Te faltaron ${cleanTarget.length - cleanTyped.length} letra(s). "${cleanTarget}" tiene ${cleanTarget.length} letras en total.`
  }

  // Letras sobrantes
  if (cleanTyped.length > cleanTarget.length) {
    return `Escribiste letras de más. "${cleanTarget}" tiene únicamente ${cleanTarget.length} letras.`
  }

  return `"${translation}" se traduce como "${cleanTarget}" (${cleanTarget.length} letras). Suena aprox. /${phoneticHelper}/.`
}
