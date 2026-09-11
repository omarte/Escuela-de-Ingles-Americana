Te voy a crear una estructura completa y profesional para tu app. Déjame generar todos los archivos necesarios:

<function_calls>
<invoke name="execute_command">
<parameter name="command">mkdir -p /home/claude/english-app/{apps/{mobile,web},packages/{shared,database,ui,config},docs}</parameter>
</invoke>
</function_calls>
<function_calls>
<invoke name="write_file">
<parameter name="path">/home/claude/english-app/STACK.md</parameter>
<parameter name="content"># Stack Tecnológico - English Learning App

## Arquitectura General

**Monorepo** con Turborepo para compartir código entre móvil y web.

## Frontend

### App Móvil: React Native + Expo

- **Framework**: Expo SDK 52+ (managed workflow)
- **Navegación**: Expo Router (file-based routing)
- **Estado global**: Zustand (ligero, simple, sin boilerplate)
- **Estilos**: NativeWind v4 (Tailwind CSS para React Native)
- **Animaciones**: React Native Reanimated
- **Almacenamiento local**: MMKV (rápido) + Expo SecureStore (para tokens)
- **Notificaciones**: Expo Notifications

### App Web: Next.js 15

- **Framework**: Next.js 15 (App Router)
- **Estado**: Zustand (mismo store que móvil)
- **Estilos**: Tailwind CSS v4
- **Formularios**: React Hook Form + Zod
- **PWA**: next-pwa (para instalación en móvil)

### Código Compartido

- **Tipos**: TypeScript estricto
- **Lógica de negocio**: packages/shared (algoritmo SRS, validaciones)
- **Componentes UI**: packages/ui (botones, inputs, cards adaptativos)
- **Esquemas**: packages/database (Drizzle ORM)

## Backend & Base de Datos

### Supabase (BaaS)

**¿Por qué Supabase y no Firebase?**

- PostgreSQL permite queries relacionales complejas (palabras ↔ niveles ↔ progreso)
- SQL es predecible y mantenible
- Incluye: Auth, Database, Storage, Realtime, Edge Functions
- Mejor para datos estructurados como un banco de palabras

**Estructura de datos principal:**

```sql
users (id, email, name, current_level, streak_days)
levels (id, code, name, description) -- A1, A2, B1, B2
weeks (id, level_id, number, theme, description)
words (id, level_id, week_id, english, spanish, example, audio_url)
paragraphs (id, level_id, week_id, content, difficulty)
user_progress (user_id, word_id, interval, ease_factor, next_review, last_review)
user_streaks (user_id, date, completed)
```

### Autenticación

- **Supabase Auth** (email/password + Google OAuth)
- **JWT** para API calls
- **Refresh tokens** con rotación automática

### API (cuando sea necesario)

- **Edge Functions** de Supabase (Deno) para lógica custom
- **REST API** con validación Zod
- **Rate limiting** integrado

## Repetición Espaciada (SRS)

**Algoritmo SM-2** (el mismo que Anki) implementado en `packages/shared`:

- Calcula intervalos de repaso basados en dificultad
- Almacena: ease_factor, interval, next_review
- Funciona offline (sincroniza cuando hay conexión)

## Almacenamiento de Contenido (Sin IA)

**Sistema de importación manual:**

- CSV/JSON para bulk import de palabras
- Panel de admin web para edición individual
- Versionado de contenido (cada cambio crea una versión nueva)
- Aprobación por administradores antes de publicar

## Herramientas de Desarrollo

- **TypeScript**: 5.4+ (strict mode)
- **ESLint**: Flat config con reglas personalizadas
- **Prettier**: Formateo automático
- **Husky**: Git hooks (pre-commit, commit-msg)
- **Commitlint**: Commits convencionales
- **Turborepo**: Build orchestration
- **pnpm**: Package manager (más rápido, menos espacio)

## Testing

- **Unit**: Vitest (rápido, compatible con Vite)
- **Integration**: Testing Library
- **E2E**: Playwright (web) + Maestro (mobile)
- **Coverage**: 80% mínimo en lógica crítica (SRS, validaciones)

## CI/CD

- **GitHub Actions**:
  - Lint + typecheck en cada PR
  - Tests automáticos
  - Build preview (Vercel para web, EAS para mobile)
  - Deploy automático en main

## Deploy

- **Web**: Vercel (integración nativa con Next.js)
- **Mobile**: EAS Build + Submit (App Store + Play Store)
- **Database**: Supabase Cloud (o self-hosted si es necesario)
- **Storage**: Supabase Storage (para audios e imágenes)

## Monitoreo

- **Errores**: Sentry (web + mobile)
- **Analytics**: PostHog (open source, self-hostable)
- **Performance**: Lighthouse CI (web) + Expo Performance (mobile)

## Seguridad

- **Row Level Security (RLS)** en Supabase
- **Input validation** con Zod en todos los endpoints
- **Rate limiting** en API
- **HTTPS** obligatorio
- **Environment variables** encriptadas

## Escalabilidad

- **Horizontal**: Supabase escala automáticamente
- **Cache**: Redis (via Upstash) para datos frecuentes
- **CDN**: Vercel Edge Network para assets estáticos
- **Offline-first**: App funciona sin conexión, sincroniza después

## Costos Estimados (inicio)

- **Supabase**: Free tier (suficiente para <500 usuarios)
- **Vercel**: Free tier (hobby)
- **EAS Build**: Free tier (30 builds/mes)
- **Total inicial**: $0/mes
- **Escala (1000+ usuarios)**: ~$50-100/mes

## Alternativas Consideradas

### ¿Por qué no Flutter?

- React Native comparte más código con Next.js
- Ecosistema JavaScript más maduro para web developers
- Mejor soporte para PWA

### ¿Por qué no Firebase?

- Firestore es NoSQL (peor para relaciones complejas)
- PostgreSQL es más flexible y predecible
- Supabase tiene mejor DX para developers SQL

### ¿Por qué no un backend custom (Node.js + Express)?

- Supabase ya incluye auth, database, storage, realtime
- Menos código que mantener
- Escalabilidad automática
- Más rápido de desarrollar

## Decisiones Arquitectónicas Claves

1. **Offline-first**: La app debe funcionar sin internet, sincroniza después
2. **Shared logic**: El algoritmo SRS vive en `packages/shared` (mismo código en móvil y web)
3. **Content as data**: Las palabras son datos, no código (fácil de actualizar sin redeploy)
4. **No AI dependency**: Todo el contenido es curado manualmente (control total)
5. **Progressive enhancement**: Web funciona sin JavaScript crítico
6. **Type safety**: TypeScript estricto en todo el monorepo
</parameter>

</invoke>
</function_calls>
<function_calls>
<invoke name="write_file">
<parameter name="path">/home/claude/english-app/PROJECT_RULES.md</parameter>
<parameter name="content"># Reglas del Proyecto

## Código

### TypeScript

- **Strict mode** activado en todos los paquetes
- **No `any`**: Usa `unknown` y type guards si es necesario
- **Interfaces** para objetos, **types** para unions/intersections
- **Enums** solo cuando sea estrictamente necesario (prefiere union types)

### Nomenclatura

```typescript
// Archivos
word-card.tsx          // kebab-case para componentes
use-srs-algorithm.ts   // kebab-case para hooks
srs-algorithm.ts       // kebab-case para lógica
types.ts               // tipos compartidos
constants.ts           // constantes

// Variables y funciones
const userName = ''    // camelCase
function calculateInterval() {} // camelCase

// Componentes
function WordCard() {} // PascalCase
function useAuth() {}  // camelCase (hooks)

// Tipos e interfaces
interface Word {}      // PascalCase
type Level = 'A1' | 'A2' // PascalCase

// Constantes
const MAX_WORDS_PER_DAY = 50 // UPPER_SNAKE_CASE
```

### Estructura de Componentes

```typescript
// 1. Imports (ordenados: React, libs, shared, local, types)
import { useState } from 'react'
import { View, Text } from 'react-native'
import { Button } from '@packages/ui'
import { Word } from './types'

// 2. Types
interface Props {
  word: Word
  onReview: (rating: number) => void
}

// 3. Componente
export function WordCard({ word, onReview }: Props) {
  // 3.1 Hooks
  const [showAnswer, setShowAnswer] = useState(false)
  
  // 3.2 Handlers
  const handleShowAnswer = () => setShowAnswer(true)
  
  // 3.3 Render
  return (
    <View>
      <Text>{word.english}</Text>
      {showAnswer && <Text>{word.spanish}</Text>}
    </View>
  )
}
```

### Estados

- **Local**: `useState` para UI state
- **Global**: Zustand para estado compartido (user, progress, settings)
- **Server**: TanStack Query para datos del servidor
- **URL**: Search params para filtros/paginación

### Errores

- **Error boundaries** en cada ruta/screen
- **Toast notifications** para errores no críticos
- **Logging** con Sentry en producción
- **User-friendly messages** (no stack traces)

## Base de Datos

### Supabase

- **Row Level Security (RLS)** en todas las tablas
- **Foreign keys** para integridad referencial
- **Indexes** en campos frecuentemente consultados
- **Migraciones** con Drizzle Kit (nunca editar schema manualmente)

### Queries

```typescript
// ✅ Bien: Tipado y seguro
const words = await db
  .select()
  .from(words)
  .where(eq(words.levelId, levelId))
  .limit(50)

// ❌ Mal: Sin tipado, propenso a errores
const words = await supabase
  .from('words')
  .select('*')
  .eq('level_id', levelId)
```

## API

### Edge Functions

- **Validación** con Zod en todos los inputs
- **Error handling** consistente (formato estándar)
- **Rate limiting** en endpoints públicos
- **CORS** configurado correctamente

### Formato de Respuesta

```typescript
// Success
{
  "data": { ... },
  "meta": { "page": 1, "total": 100 }
}

// Error
{
  "error": {
    "code": "WORD_NOT_FOUND",
    "message": "Word with id 'xyz' not found"
  }
}
```

## Testing

### Cobertura Mínima

- **Lógica crítica (SRS, validaciones)**: 90%
- **Componentes UI**: 70%
- **API endpoints**: 80%
- **E2E flows críticos**: 100% (login, study session, progress)

### Naming

```typescript
describe('SRS Algorithm', () => {
  it('should increase interval when answer is easy', () => {
    // Arrange
    const card = createMockCard({ interval: 1 })
    
    // Act
    const result = calculateNextReview(card, 5)
    
    // Assert
    expect(result.interval).toBe(3)
  })
})
```

## Git

### Commits

```bash
# Formato: tipo(scope): descripción
feat(study): add SRS algorithm implementation
fix(auth): resolve token refresh issue
docs(readme): update installation instructions
refactor(ui): extract button component
test(words): add unit tests for word card
chore(deps): update dependencies
```

### Branches

```bash
main              # Producción
develop           # Integración
feature/study-mode # Nueva funcionalidad
fix/login-bug     # Corrección de bug
release/v1.2.0    # Preparación de release
```

### Pull Requests

- **Título** descriptivo (qué hace, no cómo)
- **Descripción** con contexto y screenshots si aplica
- **Checklist** de self-review
- **Labels** (bug, feature, enhancement, etc.)
- **Assignees** (mínimo 1 reviewer)

## Performance

### Web

- **Lighthouse score**: 90+ en todas las métricas
- **Bundle size**: <200KB initial JS
- **Images**: WebP, lazy loading, responsive
- **Fonts**: Self-hosted, preload critical fonts

### Mobile

- **Startup time**: <2s en dispositivos de gama media
- **Memory**: <100MB en uso normal
- **Animations**: 60fps, usar Reanimated
- **Images**: Cached, optimizadas para resolución

## Accesibilidad

- **ARIA labels** en todos los elementos interactivos
- **Keyboard navigation** completa (web)
- **Screen reader** support (VoiceOver, TalkBack)
- **Color contrast**: WCAG AA mínimo
- **Touch targets**: 44x44px mínimo (mobile)

## Seguridad

- **No secrets** en el código (usar env variables)
- **HTTPS** obligatorio
- **Input sanitization** en todos los forms
- **SQL injection** prevention (usar ORM)
- **XSS** prevention (React lo hace por defecto)
- **CSRF** tokens en forms sensibles

## Documentación

- **README.md** en cada paquete
- **JSDoc** en funciones públicas
- **Storybook** para componentes UI
- **API docs** con OpenAPI/Swagger
- **Changelog** actualizado en cada release

## Dependencias

- **Auditar** con `pnpm audit` antes de instalar
- **Actualizar** mensualmente (Dependabot)
- **Minimizar** dependencias (preferir soluciones nativas)
- **Bundle size** importa (usar bundlephobia.com)

## Internacionalización (i18n)

- **Idiomas**: Español (default), Inglés, Portugués
- **Librería**: i18next
- **No strings hardcodeadas** en componentes
- **Date/time**: Formato localizado
- **Numbers**: Formato localizado

## Monitoreo

- **Errores**: Sentry (web + mobile)
- **Analytics**: PostHog (event tracking)
- **Performance**: Web Vitals (web), Expo Performance (mobile)
- **Uptime**: Status page pública
</parameter>

</invoke>
</function_calls>
<function_calls>
<invoke name="write_file">
<parameter name="path">/home/claude/english-app/TASKS.md</parameter>
<parameter name="content"># Tareas del Proyecto

## Fase 1: Setup Inicial (Semana 1-2)

### 1.1 Monorepo Setup

- [ ] Inicializar Turborepo con pnpm
- [ ] Configurar TypeScript base config
- [ ] Configurar ESLint flat config
- [ ] Configurar Prettier
- [ ] Configurar Husky + commitlint
- [ ] Crear estructura de carpetas base
- [ ] Agregar README.md con instrucciones de setup

### 1.2 Base de Datos

- [ ] Crear proyecto en Supabase
- [ ] Diseñar schema inicial (users, levels, weeks, words, paragraphs)
- [ ] Escribir migraciones con Drizzle Kit
- [ ] Configurar Row Level Security (RLS)
- [ ] Crear seeds con datos de A1 (primeras 100 palabras)
- [ ] Documentar schema en docs/DATABASE.md

### 1.3 Autenticación

- [ ] Configurar Supabase Auth (email/password + Google)
- [ ] Crear auth context en `packages/shared`
- [ ] Implementar login/register screens (mobile)
- [ ] Implementar login/register pages (web)
- [ ] Agregar protected routes
- [ ] Implementar password reset flow

### 1.4 CI/CD

- [ ] Configurar GitHub Actions para lint + typecheck
- [ ] Configurar tests automáticos
- [ ] Configurar Vercel para web (preview + production)
- [ ] Configurar EAS Build para mobile
- [ ] Agregar badges de status en README

**Entregable**: App base con auth funcionando en móvil y web

---

## Fase 2: Banco de Palabras (Semana 3-4)

### 2.1 CRUD de Palabras (Admin)

- [ ] Crear panel de administración web (Next.js)
- [ ] Implementar tabla de palabras con filtros (nivel, semana)
- [ ] Implementar formulario de creación/edición
- [ ] Agregar importación desde CSV/JSON
- [ ] Implementar exportación a CSV
- [ ] Agregar validación de duplicados
- [ ] Implementar soft delete (archivar, no borrar)

### 2.2 CRUD de Semanas

- [ ] Crear interfaz para gestionar semanas por nivel
- [ ] Implementar reordenamiento de semanas
- [ ] Agregar tema y descripción por semana
- [ ] Mostrar progreso de palabras por semana

### 2.3 CRUD de Párrafos

- [ ] Crear interfaz para gestionar párrafos
- [ ] Asociar párrafos a niveles y semanas
- [ ] Implementar editor de texto enriquecido
- [ ] Agregar campo de dificultad (1-5)
- [ ] Implementar preview de párrafo

### 2.4 Importación Masiva

- [ ] Crear script de importación desde el documento Word
- [ ] Parsear las 18 semanas de A1 (~1500 palabras)
- [ ] Validar formato antes de importar
- [ ] Mostrar progreso de importación
- [ ] Implementar rollback en caso de error
- [ ] Documentar formato CSV esperado

**Entregable**: Panel de admin funcional con todo el contenido de A1 importado

---

## Fase 3: Sistema de Estudio (Semana 5-7)

### 3.1 Algoritmo SRS

- [ ] Implementar SM-2 en `packages/shared`
- [ ] Crear tests unitarios (90%+ coverage)
- [ ] Documentar algoritmo en docs/SRS.md
- [ ] Implementar lógica de intervalos
- [ ] Implementar lógica de ease factor
- [ ] Agregar manejo de errores (cards vencidas, etc.)

### 3.2 Pantalla de Estudio (Mobile)

- [ ] Diseñar UI de tarjeta de palabra
- [ ] Implementar flip animation (front/back)
- [ ] Agregar botones de rating (Again, Hard, Good, Easy)
- [ ] Implementar progreso de sesión (X de Y palabras)
- [ ] Agregar modo "solo nuevas palabras"
- [ ] Implementar modo "solo repaso"
- [ ] Agregar audio de pronunciación (TTS o grabado)

### 3.3 Pantalla de Estudio (Web)

- [ ] Adaptar UI para desktop
- [ ] Agregar atajos de teclado (1-4 para rating)
- [ ] Implementar modo fullscreen
- [ ] Agregar estadísticas en tiempo real

### 3.4 Sincronización

- [ ] Implementar queue de cambios offline
- [ ] Sincronizar al volver online
- [ ] Manejar conflictos (última escritura gana)
- [ ] Agregar indicador de estado online/offline
- [ ] Implementar retry logic con exponential backoff

### 3.5 Gamificación Básica

- [ ] Implementar sistema de rachas (streak)
- [ ] Mostrar racha actual en home
- [ ] Agregar notificación de racha perdida
- [ ] Implementar logros básicos (7 días, 30 días, 100 palabras)
- [ ] Agregar animación de celebración

**Entregable**: Sistema de estudio completo con SRS funcionando offline

---

## Fase 4: Lectura de Párrafos (Semana 8-9)

### 4.1 Lector de Párrafos

- [ ] Diseñar UI de lector
- [ ] Implementar highlight de palabras desconocidas
- [ ] Agregar tap-to-translate (mostrar significado)
- [ ] Implementar modo "estudiar palabras nuevas"
- [ ] Agregar audio de párrafo (TTS)
- [ ] Implementar ajuste de tamaño de fuente

### 4.2 Integración con SRS

- [ ] Detectar palabras no estudiadas en párrafo
- [ ] Ofrecer agregar al mazo de estudio
- [ ] Marcar palabras como "conocidas"
- [ ] Implementar "estudiar palabras del párrafo"

### 4.3 Progresión

- [ ] Mostrar párrafos disponibles por nivel
- [ ] Implementar sistema de desbloqueo (completar X% del nivel)
- [ ] Agregar indicador de dificultad
- [ ] Implementar "marcar como leído"
- [ ] Mostrar historial de párrafos leídos

**Entregable**: Lector de párrafos integrado con sistema de estudio

---

## Fase 5: Progreso y Estadísticas (Semana 10-11)

### 5.1 Dashboard de Progreso

- [ ] Diseñar pantalla de estadísticas
- [ ] Implementar gráficos (palabras estudiadas, tiempo, rachas)
- [ ] Agregar vista semanal/mensual/anual
- [ ] Implementar comparación con semana anterior
- [ ] Agregar predicción de finalización de nivel

### 5.2 Sistema de Niveles

- [ ] Implementar cálculo de progreso por nivel
- [ ] Mostrar % de palabras dominadas por nivel
- [ ] Implementar "test de nivel" (evaluación rápida)
- [ ] Agregar recomendación de siguiente nivel
- [ ] Implementar historial de cambios de nivel

### 5.3 Reportes

- [ ] Implementar exportación de estadísticas (PDF/CSV)
- [ ] Agregar resumen semanal por email
- [ ] Implementar notificaciones de progreso
- [ ] Agregar "palabras más difíciles"
- [ ] Implementar "palabras más fáciles"

**Entregable**: Dashboard completo de progreso con gráficos y reportes

---

## Fase 6: Panel de Administrador Avanzado (Semana 12-13)

### 6.1 Gestión de Usuarios

- [ ] Crear lista de usuarios con filtros
- [ ] Implementar vista de detalle de usuario
- [ ] Agregar capacidad de resetear progreso
- [ ] Implementar ban/unban de usuarios
- [ ] Agregar búsqueda por email/nombre

### 6.2 Analytics

- [ ] Implementar métricas globales (usuarios activos, retención)
- [ ] Agregar gráficos de crecimiento
- [ ] Implementar cohort analysis
- [ ] Agregar heatmaps de actividad
- [ ] Implementar exportación de datos

### 6.3 Gestión de Contenido

- [ ] Implementar versionado de contenido
- [ ] Agregar sistema de aprobación (draft → published)
- [ ] Implementar rollback a versión anterior
- [ ] Agregar logs de cambios (quién, cuándo, qué)
- [ ] Implementar preview antes de publicar

### 6.4 Configuración

- [ ] Crear panel de configuración global
- [ ] Implementar feature flags
- [ ] Agregar mantenimiento mode
- [ ] Implementar announcement system (banners)
- [ ] Agregar configuración de emails

**Entregable**: Panel de admin completo para gestionar todo sin tocar código

---

## Fase 7: Pulido y Lanzamiento (Semana 14-16)

### 7.1 Testing

- [ ] Tests E2E de flows críticos (login, study, progress)
- [ ] Testing de accesibilidad (axe, Lighthouse)
- [ ] Testing de performance (Web Vitals, mobile startup)
- [ ] Testing de seguridad (OWASP checklist)
- [ ] Beta testing con 10-20 usuarios reales

### 7.2 Optimización

- [ ] Optimizar bundle size (web)
- [ ] Optimizar startup time (mobile)
- [ ] Implementar caching estratégico
- [ ] Optimizar queries de base de datos
- [ ] Agregar CDN para assets estáticos

### 7.3 Documentación

- [ ] Documentar API completa (OpenAPI)
- [ ] Crear guía de usuario (FAQ, tutoriales)
- [ ] Documentar arquitectura (diagramas)
- [ ] Crear video de onboarding
- [ ] Documentar proceso de deployment

### 7.4 Lanzamiento

- [ ] Configurar analytics (PostHog)
- [ ] Configurar monitoreo de errores (Sentry)
- [ ] Crear status page pública
- [ ] Preparar marketing materials
- [ ] Lanzar en App Store + Play Store
- [ ] Lanzar web en dominio personalizado

**Entregable**: App lanzada y funcionando en producción

---

## Fase 8: Post-Lanzamiento (Continuo)

### 8.1 Iteraciones

- [ ] Recopilar feedback de usuarios
- [ ] Priorizar bugs y features
- [ ] Implementar mejoras de UX
- [ ] Agregar más contenido (A2, B1, B2)
- [ ] Implementar features solicitadas

### 8.2 Escalabilidad

- [ ] Monitorear performance
- [ ] Optimizar queries lentas
- [ ] Implementar caching avanzado
- [ ] Preparar para 10x más usuarios
- [ ] Considerar self-hosting si es necesario

### 8.3 Monetización (Opcional)

- [ ] Implementar suscripciones (Stripe)
- [ ] Agregar plan free vs premium
- [ ] Implementar pagos in-app (mobile)
- [ ] Agregar sistema de referidos
- [ ] Crear landing page de pricing

---

## Prioridades

### Must Have (MVP)

1. Auth (login/register)
2. Banco de palabras (CRUD + importación)
3. Sistema de estudio (SRS)
4. Lectura de párrafos básica
5. Progreso básico (rachas)

### Should Have (v1.0)

1. Dashboard de estadísticas
2. Panel de admin completo
3. Offline mode
4. Audio de pronunciación
5. Gamificación (logros)

### Nice to Have (v1.1+)

1. Social features (leaderboards)
2. Compartición de progreso
3. Modo oscuro
4. Widgets (mobile)
5. Integración con calendarios

---

## Estimación de Tiempo

- **Fase 1-2**: 4 semanas (setup + contenido)
- **Fase 3-4**: 5 semanas (core features)
- **Fase 5-6**: 4 semanas (progreso + admin)
- **Fase 7**: 3 semanas (pulido + lanzamiento)
- **Total MVP**: ~16 semanas (4 meses)

**Nota**: Esto asume 1 developer full-time. Con 2 developers, se reduce a ~10 semanas.
</parameter>
</invoke>
</function_calls>
<function_calls>
<invoke name="write_file">
<parameter name="path">/home/claude/english-app/claude.md</parameter>
<parameter name="content"># Claude.md - Contexto del Proyecto

## ¿Qué es este proyecto?

App de aprendizaje de inglés basada en el método de vocabulario progresivo (A1 → A2 → B1 → B2). Incluye app móvil (iOS/Android) y web, con sistema de repetición espaciada (SRS) y banco de palabras curado manualmente (sin IA).

## Stack Tecnológico

### Frontend

- **Mobile**: React Native + Expo SDK 52+
- **Web**: Next.js 15 (App Router)
- **Shared**: TypeScript, Zustand, Tailwind/NativeWind

### Backend

- **BaaS**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **ORM**: Drizzle ORM
- **Validation**: Zod

### Herramientas

- **Monorepo**: Turborepo + pnpm
- **Testing**: Vitest + Testing Library + Playwright
- **CI/CD**: GitHub Actions
- **Deploy**: Vercel (web) + EAS (mobile)

## Estructura del Proyecto

```
english-app/
├── apps/
│   ├── mobile/          # Expo app (iOS/Android)
│   │   ├── app/         # Expo Router screens
│   │   ├── components/  # Componentes específicos de mobile
│   │   ├── hooks/       # Hooks específicos de mobile
│   │   └── lib/         # Utils específicas de mobile
│   │
│   └── web/             # Next.js app
│       ├── app/         # Next.js App Router
│       ├── components/  # Componentes específicos de web
│       └── lib/         # Utils específicas de web
│
├── packages/
│   ├── shared/          # Lógica compartida (SRS, types, utils)
│   │   ├── src/
│   │   │   ├── srs/     # Algoritmo de repetición espaciada
│   │   │   ├── types/   # Tipos TypeScript compartidos
│   │   │   ├── utils/   # Funciones utilitarias
│   │   │   └── constants/ # Constantes globales
│   │   └── package.json
│   │
│   ├── database/        # Schema y migraciones
│   │   ├── src/
│   │   │   ├── schema/  # Drizzle schema
│   │   │   ├── migrations/ # SQL migrations
│   │   │   └── seeds/   # Datos iniciales
│   │   └── package.json
│   │
│   ├── ui/              # Componentes UI compartidos
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   └── package.json
│   │
│   └── config/          # Configuraciones compartidas
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── docs/                # Documentación
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── SRS.md
│   └── API.md
│
├── scripts/             # Scripts de utilidad
│   ├── import-words.ts
│   ├── seed-database.ts
│   └── ...
│
├── turbo.json
├── package.json
└── README.md
```

## Comandos Útiles

### Setup

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar base de datos local (opcional)
pnpm db:start

# Ejecutar migraciones
pnpm db:migrate

# Cargar datos iniciales (A1 words)
pnpm db:seed
```

### Desarrollo

```bash
# Iniciar todo (mobile + web + database)
pnpm dev

# Solo mobile
pnpm dev:mobile

# Solo web
pnpm dev:web

# Solo database (si usas local)
pnpm db:start
```

### Testing

```bash
# Todos los tests
pnpm test

# Solo unit tests
pnpm test:unit

# Solo E2E tests
pnpm test:e2e

# Con coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

### Build

```bash
# Build todo
pnpm build

# Solo web
pnpm build:web

# Solo mobile (necesita EAS)
pnpm build:mobile

# Preview build
pnpm preview
```

### Linting y Formateo

```bash
# Lint todo
pnpm lint

# Fix lint errors
pnpm lint:fix

# Formatear código
pnpm format

# Typecheck
pnpm typecheck
```

### Base de Datos

```bash
# Generar migraciones después de cambiar schema
pnpm db:generate

# Aplicar migraciones
pnpm db:migrate

# Reset database (⚠️ borra todos los datos)
pnpm db:reset

# Studio (UI para ver datos)
pnpm db:studio
```

## Variables de Entorno

### apps/web/.env.local

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
```

### apps/mobile/.env

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App
EXPO_PUBLIC_APP_ENV=development
```

## Decisiones Arquitectónicas

### 1. ¿Por qué Supabase y no Firebase?

- PostgreSQL permite queries relacionales complejas
- SQL es más predecible y mantenible
- Mejor para datos estructurados (palabras ↔ niveles ↔ progreso)
- Row Level Security (RLS) integrado

### 2. ¿Por qué Zustand y no Redux?

- Menos boilerplate
- Más simple de entender
- Suficiente para nuestro caso de uso
- Funciona igual en móvil y web

### 3. ¿Por qué Drizzle y no Prisma?

- Más ligero y rápido
- Mejor tipado (type-safe queries)
- SQL-like syntax (más familiar)
- Mejor para monorepos

### 4. ¿Por qué Turborepo?

- Build caching (rápido)
- Remote caching (compartir builds)
- Task orchestration (paralelización)
- Integración nativa con pnpm

### 5. ¿Por qué NativeWind?

- Tailwind en React Native
- Comparte estilos con web
- Más rápido que StyleSheet
- Mejor DX

## Reglas Importantes

### Código

- **TypeScript strict** en todo
- **No `any`** (usa `unknown` + type guards)
- **Componentes funcionales** (no class components)
- **Hooks** para lógica reutilizable
- **Zod** para validación en API

### Base de Datos

- **RLS** en todas las tablas
- **Migraciones** con Drizzle Kit (nunca editar manualmente)
- **Foreign keys** para integridad
- **Indexes** en campos consultados

### Testing

- **Unit tests** para lógica crítica (SRS, validaciones)
- **Integration tests** para componentes UI
- **E2E tests** para flows críticos
- **80% coverage** mínimo

### Git

- **Commits convencionales** (feat, fix, docs, etc.)
- **PRs** con descripción y checklist
- **Branches**: main, develop, feature/*, fix/*
- **No force push** en main/develop

## Flujo de Trabajo Típico

### Agregar nueva feature

1. Crear branch: `git checkout -b feature/nombre-feature`
2. Implementar cambios
3. Agregar tests
4. Correr `pnpm lint` y `pnpm typecheck`
5. Correr `pnpm test`
6. Commit: `git commit -m "feat(scope): descripción"`
7. Push y crear PR
8. Esperar review y merge

### Agregar palabras al banco

1. Preparar CSV con formato: `english,spanish,example,level,week`
2. Correr script: `pnpm import-words ./words.csv`
3. Verificar en Supabase Studio
4. Probar en la app

### Deploy

1. Merge a `main`
2. GitHub Actions corre tests automáticamente
3. Vercel deploya web automáticamente
4. EAS build mobile (manual o automático)
5. Submit a App Store / Play Store

## Problemas Comunes

### "Module not found" en monorepo

```bash
# Reconstruir paquetes
pnpm build:packages

# Limpiar cache
pnpm clean
pnpm install
```

### Errores de TypeScript en packages compartidos

```bash
# Regenerar tipos
pnpm typecheck

# Verificar tsconfig.json en cada paquete
```

### Supabase RLS bloquea queries

```sql
-- Verificar políticas en Supabase Dashboard
-- Asegurar que user está autenticado
-- Revisar logs en Supabase Dashboard > Database > Logs
```

### Tests fallan en CI pero no local

```bash
# Limpiar cache de CI
# Verificar variables de entorno en GitHub Secrets
# Correr tests con mismo Node version que CI
```

## Recursos

### Documentación

- [Expo Docs](https://docs.expo.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Turborepo](https://turbo.build/repo/docs)

### Internos

- `docs/ARCHITECTURE.md` - Diagramas y decisiones
- `docs/DATABASE.md` - Schema y relaciones
- `docs/SRS.md` - Algoritmo de repetición espaciada
- `docs/API.md` - Endpoints y formatos

## Contacto y Soporte

- **Issues**: GitHub Issues del repositorio
- **Discusiones**: GitHub Discussions
- **Urgencias**: Slack/Discord del equipo

---

**Última actualización**: 2026-02-11
**Versión del proyecto**: 0.1.0 (MVP en desarrollo)
</parameter>
</invoke>
</function_calls>
<function_calls>
<invoke name="write_file">
<parameter name="path">/home/claude/english-app/.gitignore</parameter>
<parameter name="content"># Dependencies
node_modules/
.pnp
.pnp.js

# Testing

coverage/
*.lcov

# Next.js

.next/
out/
build/
dist/

# Expo

.expo/
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# Turbo

.turbo

# Environment

.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs

npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS

.DS_Store
Thumbs.db

# IDE

.vscode/
.idea/
*.swp
*.swo
*~

# Misc

*.tsbuildinfo
next-env.d.ts

# Database

*.db
*.sqlite
*.sqlite3
migrations/

# Supabase

.supabase/

# EAS

.eas/

# Temporary files

tmp/
temp/
</parameter>
</invoke>
</function_calls>
<function_calls>
<invoke name="write_file">
<parameter name="path">/home/claude/english-app/package.json</parameter>
<parameter name="content">{
  "name": "english-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "dev:web": "turbo dev --filter=web",
    "dev:mobile": "turbo dev --filter=mobile",
    "build": "turbo build",
    "build:web": "turbo build --filter=web",
    "build:mobile": "turbo build --filter=mobile",
    "build:packages": "turbo build --filter=./packages/*",
    "lint": "turbo lint",
    "lint:fix": "turbo lint:fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "test:unit": "turbo test:unit",
    "test:e2e": "turbo test:e2e",
    "test:coverage": "turbo test:coverage",
    "test:watch": "turbo test:watch",
    "clean": "turbo clean && rm -rf node_modules",
    "db:generate": "turbo db:generate",
    "db:migrate": "turbo db:migrate",
    "db:seed": "turbo db:seed",
    "db:studio": "turbo db:studio",
    "db:reset": "turbo db:reset",
    "import-words": "tsx scripts/import-words.ts",
    "prepare": "husky install"
  },
  "devDependencies": {
    "@commitlint/cli": "^18.4.3",
    "@commitlint/config-conventional": "^18.4.3",
    "@types/node": "^20.10.0",
    "husky": "^8.0.3",
    "prettier": "^3.1.0",
    "tsx": "^4.6.2",
    "turbo": "^1.11.0",
    "typescript": "^5.3.2"
  },
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
</parameter>
</invoke>
</function_calls>
<function_calls>
<invoke name="write_file">
<parameter name="path">/home/claude/english-app/turbo.json</parameter>
<parameter name="content">{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "lint:fix": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "test:unit": {
      "dependsOn": ["^build"]
    },
    "test:e2e": {
      "dependsOn": ["^build"]
    },
    "test:coverage": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:watch": {
      "cache": false,
      "persistent": true
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "db:seed": {
      "cache": false
    },
    "db:studio": {
      "cache": false,
      "persistent": true
    },
    "db:reset": {
      "cache": false
    },
    "clean": {
      "cache": false
    }
  }
}
</parameter>
</invoke>
</function_calls>
<function_calls>
<invoke name="write_file">
<parameter name="path">/home/claude/english-app/tsconfig.json</parameter>
<parameter name="content">{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "useUnknownInCatchVariables": true
  },
  "exclude": ["node_modules", "build", "dist", ".next", ".expo"]
}
</parameter>
</invoke>
</function_calls>
<function_calls>
<invoke name="write_file">
<parameter name="path">/home/claude/english-app/.env.example</parameter>
<parameter name="content"># Supabase
NEXT_PUBLIC_SUPABASE_URL=<https://your-project.supabase.co>
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App

NEXT_PUBLIC_APP_URL=<http://localhost:3000>
NEXT_PUBLIC_APP_ENV=development

# Optional: Local database (if not using Supabase cloud)

DATABASE_URL=postgresql://user:password@localhost:5432/english_app
</parameter>
</invoke>
</function_calls>
<function_calls>
<invoke name="write_file">
<parameter name="path">/home/claude/english-app/README.md</parameter>
<parameter name="content"># English Learning App

App de aprendizaje de inglés basada en el método de vocabulario progresivo (A1 → A2 → B1 → B2). Incluye app móvil (iOS/Android) y web, con sistema de repetición espaciada y banco de palabras curado manualmente.

## 🚀 Características

- **Sistema de Repetición Espaciada (SRS)**: Algoritmo SM-2 (como Anki) para memorización eficiente
- **Banco de Palabras**: ~1500 palabras para A1, organizadas en 18 semanas temáticas
- **Lectura de Párrafos**: Textos graduados por nivel con traducción integrada
- **Progreso y Estadísticas**: Dashboard con rachas, palabras dominadas, tiempo de estudio
- **Offline-First**: Funciona sin internet, sincroniza cuando hay conexión
- **Multiplataforma**: iOS, Android y Web con código compartido

## 🛠️ Stack Tecnológico

- **Mobile**: React Native + Expo
- **Web**: Next.js 15
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Monorepo**: Turborepo + pnpm
- **ORM**: Drizzle
- **Estado**: Zustand
- **Estilos**: Tailwind CSS + NativeWind

## 📦 Instalación

### Requisitos

- Node.js 18+
- pnpm 8+
- Cuenta de Supabase (o PostgreSQL local)

### Setup

```bash
# Clonar repositorio
git clone https://github.com/your-org/english-app.git
cd english-app

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar migraciones de base de datos
pnpm db:migrate

# Cargar datos iniciales (palabras de A1)
pnpm db:seed

# Iniciar desarrollo
pnpm dev
```

## 📱 Uso

### Desarrollo

```bash
# Todo (mobile + web)
pnpm dev

# Solo web
pnpm dev:web

# Solo mobile
pnpm dev:mobile
```

### Testing

```bash
# Todos los tests
pnpm test

# Con coverage
pnpm test:coverage
```

### Build

```bash
# Build todo
pnpm build

# Solo web
pnpm build:web
```

## 📚 Documentación

- [STACK.md](./STACK.md) - Stack tecnológico completo y decisiones
- [PROJECT_RULES.md](./PROJECT_RULES.md) - Reglas de código y convenciones
- [TASKS.md](./TASKS.md) - Tareas organizadas por fases
- [claude.md](./claude.md) - Contexto para Claude/AI assistants
- [docs/](./docs/) - Documentación técnica detallada

## 🗂️ Estructura

```
english-app/
├── apps/
│   ├── mobile/          # Expo app (iOS/Android)
│   └── web/             # Next.js app
├── packages/
│   ├── shared/          # Lógica compartida (SRS, types)
│   ├── database/        # Schema y migraciones
│   ├── ui/              # Componentes UI compartidos
│   └── config/          # Configuraciones compartidas
├── docs/                # Documentación
└── scripts/             # Scripts de utilidad
```

## 🎯 Roadmap

### MVP (Mes 1-2)

- [x] Setup del monorepo
- [ ] Autenticación
- [ ] Banco de palabras (CRUD + importación)
- [ ] Sistema de estudio (SRS)
- [ ] Lectura básica de párrafos

### v1.0 (Mes 3-4)

- [ ] Dashboard de progreso
- [ ] Panel de administrador
- [ ] Offline mode
- [ ] Audio de pronunciación
- [ ] Gamificación básica

### v1.1+ (Futuro)

- [ ] Social features
- [ ] Modo oscuro
- [ ] Widgets mobile
- [ ] Más niveles (A2, B1, B2)

## 🤝 Contribuir

1. Fork el repositorio
2. Crear branch para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

### Reglas de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: Nueva feature
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan código)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Cambios en build, CI, dependencias

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](./LICENSE) para más información.

## 📞 Contacto

- **Issues**: [GitHub Issues](https://github.com/your-org/english-app/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/your-org/english-app/discussions)

---

**Hecho con ❤️ para aprender inglés de forma eficiente**
</parameter>
</invoke>
</function_calls>
<function_calls>
<invoke name="write_file">
<parameter name="path">/home/claude/english-app/docs/ARCHITECTURE.md</parameter>
<parameter name="content"># Arquitectura del Sistema

## Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTES                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Mobile     │  │     Web      │  │   Admin      │      │
│  │ (Expo/RN)    │  │  (Next.js)   │  │  (Next.js)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                 │
│                    ┌──────┴──────┐                          │
│                    │   Shared    │                          │
│                    │   Logic     │                          │
│                    │  (packages) │                          │
│                    └──────┬──────┘                          │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            │ HTTPS
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                    SUPABASE                                  │
├───────────────────────────┼─────────────────────────────────┤
│                           │                                 │
│  ┌────────────────────────┴────────────────────────┐       │
│  │              Supabase Client                    │       │
│  │  (Auth, Database, Storage, Realtime)            │       │
│  └────────────────────────┬────────────────────────┘       │
│                           │                                 │
│  ┌────────────────────────┴────────────────────────┐       │
│  │              PostgreSQL Database                │       │
│  │                                                 │       │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │       │
│  │  │  users   │  │  words   │  │ progress │     │       │
│  │  └──────────┘  └──────────┘  └──────────┘     │       │
│  │                                                 │       │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │       │
│  │  │  levels  │  │  weeks   │  │paragraphs│     │       │
│  │  └──────────┘  └──────────┘  └──────────┘     │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────┐       │
│  │           Edge Functions (Deno)                 │       │
│  │  (Lógica custom, integraciones, webhooks)       │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────┐       │
│  │              Storage (S3-compatible)            │       │
│  │  (Audios, imágenes, exports)                    │       │
│  └─────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Capas

### 1. Capa de Presentación (Clients)

#### Mobile (Expo/React Native)

- **Responsabilidad**: UI nativa, gestos, notificaciones push, offline
- **Tecnologías**: React Native, Expo Router, NativeWind, Zustand
- **Comunicación**: Supabase Client SDK

#### Web (Next.js)

- **Responsabilidad**: UI responsive, SEO, PWA, admin panel
- **Tecnologías**: Next.js 15, Tailwind CSS, React Hook Form
- **Comunicación**: Supabase Client SDK + Server Components

#### Shared Logic (packages/shared)

- **Responsabilidad**: Lógica de negocio compartida (SRS, validaciones)
- **Tecnologías**: TypeScript puro
- **Consumidores**: Mobile, Web, Admin

### 2. Capa de Datos (Supabase)

#### PostgreSQL

- **Responsabilidad**: Persistencia de datos, integridad referencial
- **Características**: Row Level Security (RLS), indexes, foreign keys
- **Acceso**: Directo desde clientes (con RLS) o via Edge Functions

#### Auth

- **Responsabilidad**: Autenticación y autorización
- **Métodos**: Email/password, OAuth (Google)
- **Tokens**: JWT con refresh automático

#### Storage

- **Responsabilidad**: Archivos (audios, imágenes, exports)
- **Acceso**: URLs públicas o privadas con firma

#### Edge Functions

- **Responsabilidad**: Lógica custom que no puede ir en el cliente
- **Casos de uso**: Webhooks, integraciones externas, batch processing
- **Runtime**: Deno (TypeScript nativo)

### 3. Capa de Infraestructura

#### Vercel (Web)

- **Responsabilidad**: Hosting de Next.js, CDN, edge functions
- **Características**: Deploy automático, preview deployments, analytics

#### EAS (Mobile)

- **Responsabilidad**: Build y submit de apps móviles
- **Características**: Cloud builds, OTA updates, crash reporting

#### GitHub Actions (CI/CD)

- **Responsabilidad**: Tests, linting, builds automáticos
- **Triggers**: Push, pull requests, scheduled

## Flujos de Datos

### Flujo 1: Estudio de Palabras (SRS)

```
Usuario abre app
    ↓
App carga palabras pendientes de repaso (Supabase query)
    ↓
App muestra tarjeta (front: inglés)
    ↓
Usuario voltea tarjeta (back: español + ejemplo)
    ↓
Usuario califica (Again/Hard/Good/Easy)
    ↓
App calcula próximo repaso (algoritmo SM-2 en packages/shared)
    ↓
App guarda progreso en Supabase (user_progress table)
    ↓
Si offline: guarda en queue local, sincroniza después
```

### Flujo 2: Lectura de Párrafos

```
Usuario selecciona párrafo
    ↓
App carga párrafo + palabras asociadas (Supabase query)
    ↓
App muestra párrafo con palabras desconocidas resaltadas
    ↓
Usuario toca palabra desconocida
    ↓
App muestra traducción (popup)
    ↓
Usuario puede agregar palabra a estudio
    ↓
App marca párrafo como leído (Supabase update)
```

### Flujo 3: Importación de Palabras (Admin)

```
Admin prepara CSV con palabras
    ↓
Admin sube CSV en panel de administración
    ↓
Web valida formato (Zod schema)
    ↓
Web inserta palabras en Supabase (batch insert)
    ↓
Supabase dispara trigger (opcional: notificar usuarios)
    ↓
Palabras disponibles para todos los usuarios
```

## Seguridad

### Row Level Security (RLS)

```sql
-- Ejemplo: Usuarios solo ven su propio progreso
CREATE POLICY "Users can view own progress"
ON user_progress
FOR SELECT
USING (auth.uid() = user_id);

-- Ejemplo: Admins pueden ver todo
CREATE POLICY "Admins can view all progress"
ON user_progress
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Validación de Input

```typescript
// En Edge Functions o Web
import { z } from 'zod'

const WordSchema = z.object({
  english: z.string().min(1).max(100),
  spanish: z.string().min(1).max(100),
  example: z.string().max(500).optional(),
  levelId: z.string().uuid(),
  weekId: z.string().uuid(),
})

// Validar antes de insertar
const validated = WordSchema.parse(input)
```

## Escalabilidad

### Horizontal

- **Supabase**: Escala automáticamente (hasta cierto punto)
- **Vercel**: Edge network global, auto-scaling
- **EAS**: Cloud builds paralelos

### Vertical

- **Database**: Indexes, query optimization, connection pooling
- **Cache**: Redis (Upstash) para datos frecuentes
- **CDN**: Vercel Edge Network para assets estáticos

### Offline-First

- **Queue**: Cambios locales se guardan en MMKV/AsyncStorage
- **Sync**: Al volver online, sincroniza con Supabase
- **Conflict Resolution**: Última escritura gana (o merge manual si es necesario)

## Monitoreo

### Errores

- **Sentry**: Captura errores en web y mobile
- **Supabase Logs**: Logs de base de datos y Edge Functions

### Performance

- **Web Vitals**: Lighthouse CI en cada deploy
- **Expo Performance**: Métricas nativas de mobile
- **Supabase Analytics**: Query performance

### Analytics

- **PostHog**: Event tracking, user journeys
- **Supabase Dashboard**: Usuarios activos, storage, API calls

## Costos Estimados

### Free Tier (hasta 500 usuarios)

- **Supabase**: $0/mes (500MB DB, 1GB storage, 50K auth users)
- **Vercel**: $0/mes (100GB bandwidth, 100K serverless invocations)
- **EAS**: $0/mes (30 builds/mes)
- **Total**: $0/mes

### Growth (1000-5000 usuarios)

- **Supabase Pro**: $25/mes (8GB DB, 100GB storage)
- **Vercel Pro**: $20/mes (1TB bandwidth)
- **EAS Production**: $99/mes (unlimited builds)
- **Total**: ~$144/mes

### Scale (10000+ usuarios)

- **Supabase Team**: $599/mes (custom limits)
- **Vercel Enterprise**: Custom pricing
- **Self-hosted Supabase**: Opción para reducir costos
- **Total**: $500-2000/mes

## Decisiones de Diseño

### 1. ¿Por qué offline-first?

- **UX**: App funciona en cualquier lugar (metro, avión, etc.)
- **Performance**: Menos llamadas a API, más rápido
- **Resiliencia**: No depende 100% de conexión a internet

### 2. ¿Por qué shared logic?

- **Consistencia**: Mismo algoritmo SRS en móvil y web
- **Mantenibilidad**: Cambios en un solo lugar
- **Testing**: Tests unitarios de lógica crítica

### 3. ¿Por qué Supabase en vez de backend custom?

- **Velocidad**: Auth, DB, storage listos desde día 1
- **Costo**: Free tier generoso, escala gradual
- **Seguridad**: RLS integrado, mejores prácticas por defecto

### 4. ¿Por qué monorepo?

- **Code sharing**: Tipos, utils, componentes compartidos
- **Consistencia**: Mismo estilo, mismas herramientas
- **Atomic changes**: Cambios en múltiples paquetes en un PR

## Futuras Mejoras

### Corto Plazo

- [ ] Implementar caching con Redis
- [ ] Agregar más tests E2E
- [ ] Optimizar queries lentas
- [ ] Agregar feature flags

### Mediano Plazo

- [ ] Implementar GraphQL (opcional)
- [ ] Agregar webhooks para integraciones
- [ ] Implementar multi-tenancy (si es SaaS B2B)
- [ ] Agregar más idiomas (portugués, francés)

### Largo Plazo

- [ ] Self-hosted option para enterprise
- [ ] AI-powered features (pronunciación, escritura)
- [ ] Marketplace de contenido (profesores pueden vender cursos)
- [ ] API pública para terceros
</parameter>

</invoke>
</function_calls>
<function_calls>
<invoke name="write_file">
<parameter name="path">/home/claude/english-app/docs/DATABASE.md</parameter>
<parameter name="content"># Base de Datos

## Schema

### Tablas Principales

#### users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  current_level TEXT DEFAULT 'A1',
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  role TEXT DEFAULT 'user', -- 'user' | 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### levels

```sql
CREATE TABLE levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- 'A1', 'A2', 'B1', 'B2'
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO levels (code, name, description, order_index) VALUES
  ('A1', 'Principiante', 'Vocabulario básico y frases simples', 1),
  ('A2', 'Elemental', 'Situaciones cotidianas y párrafos cortos', 2),
  ('B1', 'Intermedio', 'Textos de opinión y noticias simples', 3),
  ('B2', 'Intermedio Alto', 'Artículos y ficción moderna', 4);
```

#### weeks

```sql
CREATE TABLE weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  theme TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(level_id, number)
);

-- Index para queries frecuentes
CREATE INDEX idx_weeks_level ON weeks(level_id);
```

#### words

```sql
CREATE TABLE words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  english TEXT NOT NULL,
  spanish TEXT NOT NULL,
  example TEXT,
  audio_url TEXT,
  image_url TEXT,
  is_irregular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes para performance
CREATE INDEX idx_words_level ON words(level_id);
CREATE INDEX idx_words_week ON words(week_id);
CREATE INDEX idx_words_english ON words(english);

-- RLS: Todos pueden ver palabras (son públicas)
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Words are viewable by everyone"
ON words FOR SELECT
USING (true);

-- Solo admins pueden modificar
CREATE POLICY "Only admins can insert words"
ON words FOR INSERT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only admins can update words"
ON words FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only admins can delete words"
ON words FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### paragraphs

```sql
CREATE TABLE paragraphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
  audio_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_paragraphs_level ON paragraphs(level_id);
```

#### user_progress

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  word_id UUID REFERENCES words(id) ON DELETE CASCADE,
  
  -- SRS Fields (SM-2 Algorithm)
  interval INTEGER DEFAULT 0, -- días hasta próximo repaso
  ease_factor REAL DEFAULT 2.5, -- factor de facilidad (mínimo 1.3)
  repetitions INTEGER DEFAULT 0, -- número de repaso
