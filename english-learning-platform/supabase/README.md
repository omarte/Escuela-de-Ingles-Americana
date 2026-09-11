# Guía de Migraciones y Base de Datos PostgreSQL / Supabase

Esta carpeta contiene el esquema de base de datos relacional de la **Escuela de Inglés Americana**, diseñado para PostgreSQL 15+ y optimizado para Supabase con Row Level Security (RLS) habilitado en el 100% de las tablas.

---

## 1. Orden de Ejecución de Migraciones

Las migraciones deben ejecutarse estrictamente en orden secuencial:

| Archivo                          | Propósito                                                     | Tablas y Tipos Creados                                                                                           |
| :------------------------------- | :------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------- |
| `001_create_content_tables.sql`  | Enums de dominio y tabla de referencia léxica                 | `cefr_level`, `content_status`, `part_of_speech`, `content_words`                                                |
| `002_create_user_tables.sql`     | Perfiles de usuario vinculados a `auth.users`                 | `profiles`, `study_sessions`, trigger de `updated_at`                                                            |
| `003_create_srs_tables.sql`      | Estado de tarjetas SRS y registro inmutable de eventos        | `card_state`, `user_cards`, `review_events`                                                                      |
| `004_enable_rls.sql`             | Políticas de seguridad de nivel de fila (RLS)                 | Políticas SELECT/INSERT/UPDATE para `profiles`, `user_cards`, `review_events`, `study_sessions`, `content_words` |
| `005_create_profile_trigger.sql` | Trigger automático al registrarse un usuario en Supabase Auth | Función `public.handle_new_user()` y trigger `on_auth_user_created` en `auth.users`                              |

---

## 2. Población de Datos Iniciales (Seed Data)

El archivo `seed.sql` contiene los **2,562 términos de vocabulario curados** para poblar la tabla `content_words` en los 4 niveles (A1, A2, B1, B2).

### Regenerar el archivo `seed.sql`:

Si se actualiza el contenido en `packages/content/`, puedes regenerar el archivo SQL con:

```bash
pnpm db:generate-seed
```

---

## 3. Métodos de Despliegue en Supabase

### Opción A: A través de Supabase CLI (Recomendado)

```bash
# 1. Iniciar sesión en Supabase CLI
supabase login

# 2. Vincular con tu proyecto remoto
supabase link --project-ref TU_PROJECT_REF

# 3. Aplicar las migraciones
supabase db push

# 4. Poblar el vocabulario inicial
supabase db reset # (aplica migraciones + seed.sql automáticamente)
# O ejecutar directamente el seed:
psql "$DATABASE_URL" -f supabase/seed.sql
```

### Opción B: A través del Dashboard Web de Supabase

1. Ingresa a tu proyecto en [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Ve a la sección **SQL Editor**.
3. Abre y ejecuta los archivos en orden:
   - Copia y ejecuta `001_create_content_tables.sql`
   - Copia y ejecuta `002_create_user_tables.sql`
   - Copia y ejecuta `003_create_srs_tables.sql`
   - Copia y ejecuta `004_enable_rls.sql`
   - Copia y ejecuta `005_create_profile_trigger.sql`
   - Copia y ejecuta `seed.sql`

---

## 4. Consultas de Verificación Post-Despliegue

Ejecuta estas consultas en el SQL Editor para verificar la integridad del sistema:

```sql
-- 1. Verificar total de palabras cargadas (debe retornar 2,562)
SELECT count(*) AS total_palabras FROM content_words;

-- 2. Desglose de vocabulario por nivel MCER
SELECT level, count(*) AS total_por_nivel
FROM content_words
GROUP BY level
ORDER BY level;
-- Esperado: A1 (1514), A2 (734), B1 (203), B2 (111)

-- 3. Verificar que RLS esté activo en todas las tablas públicas
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
-- Esperado: rowsecurity = true para todas las tablas

-- 4. Probar trigger de creación de perfil
-- Al registrarse un usuario en auth.users, debe crearse automáticamente una fila en public.profiles con su UUID correspondiente.
SELECT id, display_name, current_level, created_at
FROM public.profiles
LIMIT 5;
```
