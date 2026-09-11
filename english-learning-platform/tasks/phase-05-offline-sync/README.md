# Fase 05 — Sincronización Offline (Completada al 100%)

## Resumen Ejecutivo

La **Fase 05: Offline Sync** implementa una arquitectura offline-first con SQLite local embebido mediante `expo-sqlite` (con fallback de almacenamiento seguro para plataformas web/test), almacenamiento en espejo de las tablas críticas `local_user_cards`, `local_review_events` y `sync_metadata`, un motor de sincronización bidireccional con Supabase basado en reconciliación **Last-Write-Wins** y un store reactivo con control manual y automático de sincronización en la interfaz de usuario.

---

## Componentes Implementados

### 1. Esquema y Cliente SQLite Local (`apps/app/lib/db/`)

- **`schema.ts`**:
  - DDL para `local_user_cards` con banderas de sincronización (`sync_status`: `'synced' | 'dirty'`).
  - DDL para `local_review_events` con banderas de sincronización (`sync_status`: `'pending' | 'synced'`).
  - DDL para `sync_metadata` (clave-valor para seguimiento de puntos de corte `last_synced_at`).
  - Índices de alto rendimiento en `user_id`, `due_date` y `sync_status`.
  - Conversores tipados entre entidades del dominio SRS y filas SQLite.
- **`sqlite.ts`**:
  - Inicialización automática con PRAGMA WAL activado en plataformas nativas (`openDatabaseAsync`).
  - Mecanismo de fallback robusto para Web o entornos sin SQLite nativo.
  - Operaciones CRUD atómicas: lectura ordenada por fecha de vencimiento (`due_date`), inserción/actualización (`ON CONFLICT DO UPDATE`), recolección de tarjetas modificadas (`dirty`) y eventos pendientes (`pending`).

### 2. Motor de Reconciliación y Sincronización (`packages/database/src/sync.ts` & `apps/app/lib/db/syncEngine.ts`)

- **Algoritmo de Reconciliación (Last-Write-Wins)**:
  - Función pura `reconcileCardState` en `@elp/database` con suite de tests exhaustiva (5 escenarios de conflicto).
  - Si la tarjeta local no existe o está limpia (`synced`), la versión de Supabase gana.
  - Si la tarjeta local fue modificada offline (`dirty`), se comparan marcas de tiempo ISO `updated_at`: la más reciente prevalece. En caso de empate exacto, prevalece de manera determinista la versión remota.
- **Flujo de Sincronización en 4 Pasos (`syncUserData`)**:
  1. **Push Eventos**: Envía los `local_review_events` pendientes a la tabla inmutable `review_events` de Supabase.
  2. **Push Tarjetas**: Realiza `upsert` en `user_cards` de Supabase para todas las tarjetas locales con estado `dirty`.
  3. **Pull Cambios**: Consulta en Supabase tarjetas con `updated_at > last_synced_at`, reconcilia conflictos e inserta en la base local.
  4. **Checkpoint**: Guarda la marca de tiempo del inicio del ciclo de sincronización en `sync_metadata`.

### 3. Integración en Flujo de Repaso (`useSRSStore.ts`)

- **Latencia Cero en Estudio**: Toda acción de calificación de tarjeta escribe instantáneamente en la base SQLite local y en el estado en memoria, permitiendo estudiar en modo avión o sin cobertura.
- **Sincronización Oportunista**: Al calificar tarjetas o iniciar la aplicación, se disparan tareas en segundo plano no bloqueantes para sincronizar cambios si hay conexión activa con Supabase.

### 4. Interfaz de Usuario y Gestión de Estado (`useSyncStore.ts` & `profile.tsx`)

- **`useSyncStore`**: Store Zustand que gestiona `isOnline`, `isSyncing`, `lastSyncedAt`, `pendingCardsCount`, `pendingEventsCount` y `triggerSync()`.
- **`ProfileScreen`**:
  - Indicador visual de estado: modo offline autónomo vs. sincronización en la nube.
  - Contador en tiempo real de cambios locales pendientes de sincronizar.
  - Botón interactivo "Sincronizar Ahora" con indicador de carga `ActivityIndicator` y manejo de errores.

---

## Verificación y Calidad

- **Typecheck**: 7/7 paquetes pasando sin errores (`pnpm typecheck`).
- **Linter**: 0 advertencias o errores en todo el monorepo (`pnpm lint`).
- **Tests Unitarios**: 59 tests automatizados pasando en Vitest (`pnpm test`), incluyendo 5 pruebas unitarias específicas de resolución de conflictos Last-Write-Wins.
- **Formato**: 100% de archivos conformes con Prettier (`pnpm format:check`).
- **Validación de Contenido**: Política Cero IA respetada (`pnpm content:validate`).
