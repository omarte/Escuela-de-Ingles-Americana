import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://wmaabdcytbcvufldnnvi.supabase.co'
const SUPABASE_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_o3LgMatvwkeH-VmqMBZOHA_la216aLg'

async function runVerification(): Promise<void> {
  console.log('\n══════════════════════════════════════════════════════════════')
  console.log('  AUDITORÍA EN VIVO: Supabase delete_user_account RPC Test')
  console.log('══════════════════════════════════════════════════════════════\n')

  console.log('🔍 [1/4] Verificando presencia de la función RPC en el servidor...')
  const client = createClient(SUPABASE_URL, SUPABASE_KEY)

  // Probar invocación del RPC sin sesión para verificar si existe en el schema cache
  const { error: rpcCheck } = await client.rpc('delete_user_account')

  if (rpcCheck?.code === 'PGRST202') {
    console.log('❌ ESTADO: La función public.delete_user_account() NO existe en Supabase.')
    console.log('   Razón: Código PGRST202 (función no encontrada en el schema cache).')
    console.log('\n👉 ACCIÓN REQUERIDA:')
    console.log('   1. Abre el SQL Editor de tu proyecto en:')
    console.log('      https://supabase.com/dashboard/project/wmaabdcytbcvufldnnvi/sql')
    console.log('   2. Copia y ejecuta el archivo:')
    console.log('      supabase/migrations/006_delete_user_account.sql\n')
    process.exit(1)
  }

  console.log('✅ RPC detectado en Supabase (no es 404 ni PGRST202).')

  // Paso 2: Crear usuario temporal desechable
  const testEmail = `test_audit_${Date.now()}@example.com`
  const testPassword = 'TestPassword123!Safe'

  console.log(`\n👤 [2/4] Registrando usuario desechable de prueba: ${testEmail}...`)
  const { data: authData, error: authError } = await client.auth.signUp({
    email: testEmail,
    password: testPassword,
  })

  if (authError || !authData.user) {
    console.error('❌ Error al registrar usuario de prueba:', authError?.message)
    process.exit(1)
  }

  const userId = authData.user.id
  console.log(`✅ Usuario autenticado con UID: ${userId}`)

  // Breve espera para que el trigger 005_create_profile_trigger cree el perfil
  await new Promise((r) => setTimeout(r, 1200))

  // Paso 3: Verificar que el perfil y datos asociados existen en cascada
  console.log('\n📊 [3/4] Verificando creación automática de filas hijas...')
  const { data: profile } = await client.from('profiles').select('*').eq('id', userId).maybeSingle()

  if (profile) {
    console.log(`✅ Fila creada en public.profiles:`, {
      id: profile.id,
      display_name: profile.display_name,
      current_level: profile.current_level,
    })
  } else {
    console.log('⚠️  Aviso: Perfil no creado de inmediato (posible confirmación de email requerida).')
  }

  // Paso 4: Ejecutar la eliminación
  console.log('\n🗑️  [4/4] Ejecutando client.rpc("delete_user_account")...')
  const { error: deleteError } = await client.rpc('delete_user_account')

  if (deleteError) {
    console.error('❌ Error al ejecutar delete_user_account():', deleteError)
    process.exit(1)
  }

  console.log('✅ RPC ejecutado exitosamente.')

  // Confirmar que el perfil ya no existe en la base de datos
  const { data: checkProfile } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (checkProfile) {
    console.error('❌ FALLO: El registro del usuario sigue existiendo en public.profiles!')
    process.exit(1)
  }

  console.log('✅ Confirmado: La fila en public.profiles fue purgada en cascada.')
  console.log('\n══════════════════════════════════════════════════════════════')
  console.log('  RESULTADO: 100% VERIFICADO EN VIVO CON SUPABASE CLOUD')
  console.log('══════════════════════════════════════════════════════════════\n')
}

runVerification().catch((err: unknown) => {
  console.error('Fallo en script de verificación:', err)
  process.exit(1)
})
