# Fase 08 — Progreso, Rachas y Avance de Nivel (Completada al 100%)

## Resumen Ejecutivo

La **Fase 08: Progreso, Rachas y Avance de Nivel** implementó el motor centralizado de analítica de aprendizaje, cálculo de racha diaria determinista (`streaks`), tasa de retención, elegibilidad y ascenso de nivel CEFR, y desglose de dominio semanal de vocabulario.

La pantalla de Progreso (`apps/app/app/(app)/progress.tsx`) fue completamente renovada para mostrar métricas en tiempo real alimentadas por la base local SQLite y el perfil de usuario.

---

## Componentes y Arquitectura Desarrollados

### 1. Motor de Progreso y Rachas (`packages/srs/src/progress.ts`)

- **`calculateStreak(studyDates, referenceDate)`**:
  - Deduplicación de marcas temporales por día calendario (`YYYY-MM-DD`).
  - Detección de racha activa completada hoy (`studiedToday: true`).
  - Detección de racha en espera cuando se estudió ayer pero hoy sigue pendiente (`studiedToday: false`).
  - Reinicio automático a 0 tras $\ge 2$ días sin actividad de estudio.
  - Cálculo de la mejor racha histórica (`bestStreak`).
- **`calculateRetentionRate(reviews)`**:
  - Porcentaje de aciertos basado en calificaciones de calidad SM-2 (`quality >= 3`).
- **`evaluateLevelAdvancement(params)`**:
  - Evalúa tarjetas en memoria vs total del nivel (1,514 en A1).
  - Determina si el usuario alcanzó el umbral institucional del **80% de dominio** para ascender a la siguiente etapa (ej. A1 $\to$ A2).
  - Manejo de límite en B2 (`nextLevel: null`).
- **`calculateWeeklyBreakdown(weeks, cards)`**:
  - Mapeo de las semanas temáticas con estados `'completed' | 'in_progress' | 'not_started'`, ratios de progreso y conteo de palabras dominadas.

### 2. Capa de Base de Datos y Persistencia

- **`packages/database`**:
  - Función `updateUserProfile(client, userId, updates)` para persistir actualizaciones de nivel CEFR, semana actual y días de racha en Supabase.
  - Pruebas unitarias completas en `packages/database/tests/auth.test.ts`.
- **`apps/app/lib/db/sqlite.ts`**:
  - `getAllLocalReviewEvents(userId)`: Recupera todos los eventos de repaso registrados localmente.
  - `getLocalReviewDates(userId)`: Extrae fechas únicas de actividad para alimentar el cálculo de racha.
- **`apps/app/stores/useAuthStore.ts`**:
  - Método `updateProfile(updates)` para sincronizar cambios en memoria, almacenamiento persistente (AsyncStorage) y Supabase.

### 3. Store Reactivo y Pantallas de Usuario

- **`apps/app/stores/useProgressStore.ts`**:
  - Orquestador reactivo de métricas de progreso conectado a SQLite, SRS y Auth.
  - Acción `advanceLevel()` para promover al estudiante al siguiente nivel CEFR.
- **`apps/app/app/(app)/progress.tsx`**:
  - **Hero Card de Nivel Actual**: Muestra porcentaje de dominio, palabras dominadas sobre el total real (`1,514`), y botón de ascenso con modal de confirmación si cumple el criterio.
  - **Grid de 4 Estadísticas**: Palabras en memoria, racha con indicador de estado ("Completado hoy 🔥" vs "Pendiente hoy ⏳"), tiempo estimado de estudio y tasa de retención.
  - **Desglose Semanal**: Tarjetas interactivas para las 19 semanas de A1 con títulos temáticos, conteo de palabras y barras de progreso.
  - **Escalera CEFR**: Progreso relativo entre los niveles A1, A2, B1 y B2.
- **`apps/app/app/(app)/index.tsx`**:
  - Widget de racha en la cabecera sincronizado en tiempo real con las métricas calculadas.

---

## Verificaciones Ejecutadas

| Verificación                | Comando                   | Resultado                                 |
| :-------------------------- | :------------------------ | :---------------------------------------- |
| **Integridad de Tipos**     | `pnpm typecheck`          | ✅ 7/7 paquetes sin errores               |
| **Pruebas Unitarias**       | `pnpm test`               | ✅ 80 tests pasando (100% éxito)          |
| **Calidad de Código**       | `pnpm lint`               | ✅ 0 errores, 0 advertencias              |
| **Validación de Contenido** | `pnpm content:validate`   | ✅ 1,514 palabras y 3 lecturas A1 válidas |
| **Deduplicación Léxica**    | `pnpm content:duplicates` | ✅ 0 duplicados en A1                     |
| **Formato Prettier**        | `pnpm format:check`       | ✅ 100% de archivos conformes             |
