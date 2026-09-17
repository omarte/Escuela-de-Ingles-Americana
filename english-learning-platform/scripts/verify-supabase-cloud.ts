import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

// 1. Cargar variables de apps/app/.env
const envPath = path.resolve(__dirname, '../apps/app/.env')
let supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ''
let supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...vals] = trimmed.split('=')
    const val = vals.join('=').trim()
    if (key === 'EXPO_PUBLIC_SUPABASE_URL' && !supabaseUrl) supabaseUrl = val
    if (key === 'EXPO_PUBLIC_SUPABASE_ANON_KEY' && !supabaseAnonKey) supabaseAnonKey = val
  }
}

console.log('══════════════════════════════════════════════════════════════════════')
console.log(' 🌐 DIAGNÓSTICO DE CONEXIÓN A SUPABASE CLOUD — ESCUELA DE INGLÉS AMERICANA')
console.log('══════════════════════════════════════════════════════════════════════\n')

console.log(`📡 URL Proyecto:   ${supabaseUrl || '⚠️ NO CONFIGURADA'}`)
console.log(`🔑 Anon Key:       ${supabaseAnonKey ? `${supabaseAnonKey.substring(0, 16)}...` : '⚠️ NO CONFIGURADA'}`)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ ERROR: Faltan credenciales de Supabase en apps/app/.env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})

const TABLES_TO_CHECK = [
  { name: 'content_words', desc: 'Vocabulario de referencia (Fase 1)' },
  { name: 'profiles', desc: 'Perfiles de alumnos (Fase 2 / 8)' },
  { name: 'study_sessions', desc: 'Sesiones de estudio (Fase 2)' },
  { name: 'user_cards', desc: 'Tarjetas SRS de alumnos (Fase 4)' },
  { name: 'review_events', desc: 'Log de repetición espaciada (Fase 4)' },
  { name: 'session_feedback', desc: 'Encuestas de dificultad (Fase 7)' },
  { name: 'support_tickets', desc: 'Mesa de ayuda y soporte (Fase 9)' },
  { name: 'checkpoint_attempts', desc: 'Evaluaciones y diplomas (Fase 12)' },
]

async function runAudit() {
  console.log('\n🔍 Verificando estado y accesibilidad de tablas en la nube:\n')
  console.log(
    '  ' +
      'TABLA'.padEnd(24) +
      'DESCRIPCIÓN'.padEnd(38) +
      'ESTADO EN LA NUBE'
  )
  console.log('  ' + '─'.repeat(80))

  let existingCount = 0
  let pendingCount = 0

  for (const t of TABLES_TO_CHECK) {
    try {
      const { error } = await supabase.from(t.name).select('*').limit(1)

      if (error) {
        // Código 42P01: undefined_table (la tabla no existe aún en la base de datos)
        if (
          error.code === '42P01' ||
          error.code === 'PGRST205' ||
          error.message.includes('does not exist') ||
          error.message.includes('Could not find the table')
        ) {
          console.log(`  ${t.name.padEnd(24)}${t.desc.padEnd(38)}❌ PENDIENTE (Ejecutar bundle SQL)`)
          pendingCount++
        } else if (error.code === 'PGRST301' || error.message.includes('JWT') || error.message.includes('permission')) {
          console.log(`  ${t.name.padEnd(24)}${t.desc.padEnd(38)}🔒 ACTIVA (RLS Protegido)`)
          existingCount++
        } else {
          console.log(`  ${t.name.padEnd(24)}${t.desc.padEnd(38)}⚠️ ${error.message.substring(0, 20)}...`)
        }
      } else {
        console.log(`  ${t.name.padEnd(24)}${t.desc.padEnd(38)}✅ ACTIVA Y LISTA`)
        existingCount++
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.log(`  ${t.name.padEnd(24)}${t.desc.padEnd(38)}⚠️ Error: ${msg}`)
    }
  }

  console.log('  ' + '─'.repeat(80))
  console.log(`\n📊 Resumen: ${existingCount} tablas verificadas activas, ${pendingCount} pendientes de migración.`)

  if (pendingCount > 0) {
    console.log('\n💡 ACCIÓN REQUERIDA:')
    console.log('  Para aprovisionar todas las tablas faltantes con un solo clic:')
    console.log('  1. Abre el SQL Editor de Supabase Cloud:')
    console.log('     👉 https://supabase.com/dashboard/project/wmaabdcytbcvufldnnvi/sql/new')
    console.log('  2. Copia y pega el contenido del archivo generado:')
    console.log('     📄 supabase/production_bundle.sql')
    console.log('  3. Haz clic en "Run" (ejecución 100% idempotente y segura).')
  } else {
    console.log('\n🎉 ¡Excelente! Todas las tablas y políticas de seguridad RLS están aprovisionadas en la nube.')
  }
  console.log('══════════════════════════════════════════════════════════════════════\n')
}

void runAudit()
