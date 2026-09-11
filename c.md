Perfecto, voy a diseñar la arquitectura completa del proyecto. Te recomiendo un stack moderno, escalable y que permita mantener el banco de palabras como **contenido curado manualmente** (sin IA), que es tu requisito clave.

## 🎯 Stack tecnológico recomendado

**Monorepo con Turborepo** para compartir código entre móvil y web:

| Capa | Tecnología | Razón |
| --- | --- | --- |
| **App móvil** | Expo (React Native) | iOS + Android con una sola base, ecosistema maduro |
| **App web** | Next.js 14 (App Router) | SSR, SEO, PWA listo |
| **Backend / DB** | Supabase (PostgreSQL + Auth + Storage) | Gratis hasta escalar, tiempo real, auth listo |
| **ORM** | Drizzle ORM | Type-safe, rápido, migraciones simples |
| **Estilos** | NativeWind (móvil) + Tailwind (web) | Mismo lenguaje visual en ambas plataformas |
| **Estado** | Zustand + TanStack Query | Ligero, sin boilerplate |
| **Validación** | Zod | Compartido entre front y back |
| **Repetición espaciada** | Algoritmo SM-2 propio | Como Anki, sin dependencias externas |
| **Testing** | Vitest + Playwright | Rápido y confiable |
| **Contenido** | Archivos JSON/TS versionados | Editables manualmente, sin IA |

La clave de tu requisito "sin IA": el banco de palabras vive en **archivos JSON/TypeScript dentro del repo**, versionados con Git. Los curadores (tú o colaboradores) editan esos archivos directamente. La app los importa, no los genera.

Voy a crear toda la estructura:

<tool_call>
<tool_call>
<invoke name="bash">
<parameter name="command">mkdir -p /home/claude/english-app && cd /home/claude/english-app && mkdir -p apps/mobile apps/web packages/{ui,database,validators,content,spaced-repetition,config} tooling/{typescript,eslint} docs && tree -L 3</parameter>
</invoke>
</tool_call>
<invoke name="bash">
<parameter name="command">cd /home/claude/english-app && cat > README.md << 'EOF'

# English Progress - App Móvil y Web

Aplicación educativa para aprender inglés mediante el método progresivo por vocabulario (A1 → A2 → B1 → B2), con sistema de repetición espaciada integrado.

## 🎯 Principios clave

1. **Sin IA para contenido**: El banco de palabras es curado manualmente por humanos y versionado en Git.
2. **Offline-first**: El usuario puede estudiar sin conexión; los datos se sincronizan cuando hay red.
3. **Una sola fuente de verdad**: Lógica de negocio compartida entre móvil y web.
4. **Escalable por niveles**: La estructura soporta añadir nuevos niveles (C1, C2) y bancos de palabras sin tocar la app.

## 🏗️ Stack tecnológico

### Frontend

- **Móvil**: Expo (React Native) con Expo Router
- **Web**: Next.js 14 (App Router)
- **Estilos**: NativeWind (móvil) + Tailwind CSS (web)
- **Estado**: Zustand (local) + TanStack Query (servidor)

### Backend y datos

- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **ORM**: Drizzle ORM (type-safe)
- **Validación**: Zod (compartida)

### Contenido (la parte crítica)

- **Banco de palabras**: Archivos JSON/TS en `packages/content/`
- **Edición**: Manual, por humanos, versionada con Git
- **Importación**: Scripts que cargan el contenido a la DB o lo empaquetan para offline

### Calidad

- **Testing**: Vitest (unit) + Playwright (e2e)
- **Linting**: ESLint + Prettier
- **TypeScript**: Estricto en todo el monorepo

## 📁 Estructura del monorepo

```
apps/
  mobile/          # App Expo (iOS + Android)
  web/             # App Next.js (web + PWA)

packages/
  ui/              # Componentes compartidos (botones, cards, etc.)
  database/        # Esquema Drizzle, migraciones, queries
  validators/      # Schemas Zod compartidos
  content/         # ⭐ BANCO DE PALABRAS (JSON/TS, editado manualmente)
  spaced-repetition/  # Algoritmo SM-2 (lógica pura, testeable)
  config/          # Configuraciones compartidas (tsconfig, etc.)

tooling/
  typescript/      # tsconfig base
  eslint/          # Config ESLint compartida
```

## 🚀 Comandos

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev:web          # Next.js en localhost:3000
pnpm dev:mobile       # Expo en simulador/dispositivo

# Build
pnpm build:web
pnpm build:mobile

# Testing
pnpm test             # Todos los tests
pnpm test:content     # Valida el banco de palabras

# Scripts de contenido
pnpm content:validate # Verifica integridad del banco
pnpm content:stats    # Estadísticas del banco (palabras por nivel, semana, etc.)
pnpm content:sync     # Sincroniza contenido JSON → DB de Supabase
```

## 📋 Reglas críticas

1. **NUNCA usar IA para generar o modificar el banco de palabras** (`packages/content/`).
2. Todo cambio en el banco pasa por PR con revisión humana.
3. El algoritmo de repetición espaciada debe tener 100% de cobertura de tests.
4. Accesibilidad WCAG AA obligatoria en web y móvil.
5. TypeScript estricto (`strict: true`) en todo el monorepo.

## 📖 Documentación

- [Arquitectura](docs/architecture.md)
- [Guía de contribución al banco de palabras](docs/content-guide.md)
- [Algoritmo de repetición espaciada](docs/spaced-repetition.md)
- [Roadmap](docs/roadmap.md)
EOF
cat README.md | head -20</parameter>
</invoke>

</tool_call>
<invoke name="bash">
<parameter name="command">cd /home/claude/english-app && cat > project-rules.md << 'EOF'

# Reglas del proyecto

## 🚨 Reglas absolutas (no negociables)

### 1. Contenido sin IA

- **PROHIBIDO** usar IA (GPT, Claude, Gemini, etc.) para generar, traducir o modificar palabras del banco.
- Todo el contenido de `packages/content/` debe ser curado manualmente por hablantes nativos o profesores certificados.
- Cada palabra debe tener: traducción verificada, ejemplo escrito por humano, etiqueta de nivel revisada.
- Los PRs que modifiquen el banco requieren al menos 1 revisión de un curador humano.

### 2. Type safety

- TypeScript estricto en todo el monorepo (`strict: true`, `noImplicitAny: true`).
- Prohibido usar `any` excepto con justificación explícita en comentario.
- Los schemas Zod son la fuente de verdad para validación de datos.

### 3. Testing

- El algoritmo de repetición espaciada requiere 100% de cobertura.
- Los schemas de contenido deben validarse en CI antes de merge.
- Tests de integración para flujos críticos: estudio, sync, progreso.

### 4. Accesibilidad

- Web: WCAG 2.1 AA mínimo.
- Móvil: VoiceOver (iOS) y TalkBack (Android) soportados.
- Contraste mínimo 4.5:1, navegación por teclado completa.

## 📐 Convenciones de código

### Nomenclatura

- **Archivos**: kebab-case (`spaced-repetition.ts`)
- **Componentes**: PascalCase (`FlashCard.tsx`)
- **Funciones/variables**: camelCase (`calculateNextReview`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_REVIEW_INTERVAL`)
- **Tipos**: PascalCase (`UserProgress`)
- **Enums**: PascalCase con valores en UPPER_SNAKE_CASE

### Estructura de componentes

```tsx
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Componente principal
// 5. Subcomponentes (si aplica)
// 6. Export
```

### Commits

Formato Conventional Commits:

```
feat(content): add week 19 irregular verbs
fix(spaced-repetition): correct interval calculation
docs(rules): clarify AI prohibition
test(database): add migration tests
```

## 🗂️ Organización del contenido

El banco de palabras vive en `packages/content/` con esta estructura:

```
packages/content/
  levels/
    a1/
      week-01-pronouns-and-greetings.json
      week-02-time-expressions.json
      ...
    a2/
    b1/
    b2/
  paragraphs/
    a1/
    a2/
  metadata/
    levels.json        # Definición de niveles
    progress-rules.json # Reglas de avance entre niveles
```

Cada archivo de semana tiene este formato:

```json
{
  "level": "A1",
  "week": 1,
  "theme": "Pronouns, greetings and basic verbs",
  "themeEs": "Pronombres, saludos y verbos básicos",
  "words": [
    {
      "id": "a1_w01_001",
      "en": "hello",
      "es": "hola",
      "example": "Hello, how are you?",
      "exampleEs": "Hola, ¿cómo estás?",
      "pos": "interjection",
      "tags": ["greeting", "basic"],
      "verifiedBy": "curator-name",
      "verifiedAt": "2026-09-11"
    }
  ]
}
```

## 🔒 Seguridad y privacidad

- Datos de usuario cifrados en tránsito (TLS) y en reposo.
- No almacenar datos de menores sin consentimiento parental.
- Logs sin información personal identificable (PII).
- Rate limiting en todos los endpoints públicos.

## 🌍 Internacionalización

- La app soporta UI en español e inglés.
- El contenido de aprendizaje es siempre inglés-español (no se traduce la UI del contenido).
- Usar `next-intl` (web) y `i18n-js` (móvil) con archivos de traducción separados.

## 📦 Deploy

- **Web**: Vercel (automático desde main)
- **Móvil**: EAS Build (Expo) → App Store + Google Play
- **Preview**: Cada PR genera preview de web y build de móvil para testing

## 🚫 Anti-patrones (evitar)

- ❌ Componentes con más de 300 líneas
- ❌ Lógica de negocio en componentes UI
- ❌ useEffect para datos que pueden ser TanStack Query
- ❌ Estados globales para datos que deberían ser locales
- ❌ Comentarios que explican "qué" hace el código (el código debe ser autoexplicativo)
- ❌ dependencias de IA en runtime para funcionalidad core
EOF
cat project-rules.md | wc -l</parameter>
</invoke>

</tool_call>
<invoke name="bash">
<parameter name="command">cd /home/claude/english-app && cat > tasks.md << 'EOF'

# Roadmap de tareas

Roadmap dividido en fases. Cada fase debe estar completa antes de avanzar a la siguiente.
Estimación total: 12-16 semanas con 1-2 desarrolladores.

---

## 🏁 Fase 0: Setup inicial (Semana 1)

### Objetivo

Monorepo funcionando con todas las herramientas base.

- [ ] Inicializar monorepo con Turborepo + pnpm
- [ ] Configurar TypeScript estricto compartido (`tooling/typescript/base.json`)
- [ ] Configurar ESLint + Prettier compartidos (`tooling/eslint/`)
- [ ] Configurar Husky + lint-staged para pre-commit hooks
- [ ] Configurar CI base (GitHub Actions): lint + type-check
- [ ] Crear estructura de carpetas inicial
- [ ] Documentar setup en README
- [ ] **Entregable**: `pnpm install && pnpm build` funciona sin errores

---

## 🗄️ Fase 1: Base de datos y esquema (Semana 2)

### Objetivo

Esquema de Supabase definido y migraciones funcionando.

- [ ] Crear proyecto Supabase (dev + prod)
- [ ] Definir esquema Drizzle:
  - [ ] `users` (auth vía Supabase)
  - [ ] `user_profiles` (nivel actual, preferencias)
  - [ ] `levels` (A1, A2, B1, B2)
  - [ ] `weeks` (semanas por nivel)
  - [ ] `words` (palabras con metadata)
  - [ ] `user_word_progress` (estado de cada palabra por usuario)
  - [ ] `user_study_sessions` (historial de estudio)
  - [ ] `paragraphs` (textos de práctica)
- [ ] Crear migraciones iniciales
- [ ] Seeds de prueba
- [ ] Tests de esquema (que las migraciones apliquen y reviertan)
- [ ] **Entregable**: DB local corriendo con esquema completo

---

## 📚 Fase 2: Importar banco de palabras A1 (Semanas 2-3)

### Objetivo

Todo el banco A1 del documento Word convertido a JSON estructurado.

- [ ] Definir schema JSON del banco (`packages/content/schema.ts`)
- [ ] Convertir las 18 semanas de A1 a archivos JSON
- [ ] Script de validación (`pnpm content:validate`)
  - [ ] Verifica IDs únicos
  - [ ] Verifica campos requeridos
  - [ ] Verifica que no hay duplicados
  - [ ] Verifica que ejemplos existen
- [ ] Script de estadísticas (`pnpm content:stats`)
- [ ] Script de sync a Supabase (`pnpm content:sync`)
- [ ] Revisión manual de cada semana por curador humano
- [ ] **Entregable**: ~1.500 palabras A1 validadas y en DB

---

## 🧠 Fase 3: Algoritmo de repetición espaciada (Semana 3)

### Objetivo

Implementación del algoritmo SM-2 (como Anki) con 100% de cobertura.

- [ ] Investigar y documentar algoritmo SM-2
- [ ] Implementar función `calculateNextReview(card, quality)`
- [ ] Implementar función `getCardsForReview(userId, date)`
- [ ] Implementar función `updateCardProgress(cardId, quality)`
- [ ] Tests unitarios exhaustivos:
  - [ ] Tarjeta nueva → primer intervalo
  - [ ] Calidad 0-3 → resetea intervalo
  - [ ] Calidad 4 → intervalo corto
  - [ ] Calidad 5 → aumenta ease factor
  - [ ] Tarjetas vencidas se priorizan
  - [ ] Límites diarios (new, learning, review)
- [ ] 100% cobertura de tests
- [ ] **Entregable**: Paquete `spaced-repetition` testeado y documentado

---

## 🔐 Fase 4: Autenticación (Semana 4)

### Objetivo

Auth funcional en móvil y web.

- [ ] Integrar Supabase Auth
- [ ] Email + password (básico)
- [ ] OAuth: Google, Apple (móvil), GitHub
- [ ] Magic link (opcional, fase posterior)
- [ ] Pantallas de login/register en móvil
- [ ] Pantallas de login/register en web
- [ ] Manejo de sesión persistente
- [ ] Logout
- [ ] Recuperación de contraseña
- [ ] **Entregable**: Usuario puede registrarse y loguearse en ambas plataformas

---

## 🎴 Fase 5: Pantalla de estudio - Flashcards (Semanas 4-5)

### Objetivo

El corazón de la app: estudiar palabras con flashcards.

- [ ] Componente `FlashCard` (móvil + web)
  - [ ] Muestra palabra en inglés
  - [ ] Flip para ver traducción
  - [ ] Muestra ejemplo
  - [ ] Botones de calidad (0-5 simplificado: Otra vez, Dificil, Bien, Fácil)
- [ ] Pantalla de sesión de estudio
  - [ ] Muestra tarjetas pendientes del día
  - [ ] Progreso de la sesión (X de Y)
  - [ ] Nuevas tarjetas vs repasos
- [ ] Integración con algoritmo SM-2
- [ ] Guardar progreso en DB
- [ ] Modo offline (estudiar sin conexión, sync después)
- [ ] Animaciones de flip (móvil) y transiciones
- [ ] Audio de pronunciación (TTS o grabaciones)
- [ ] **Entregable**: Usuario puede estudiar 20-30 tarjetas por sesión

---

## 📊 Fase 6: Dashboard y progreso (Semana 6)

### Objetivo

El usuario ve su avance y estadísticas.

- [ ] Dashboard principal:
  - [ ] Nivel actual (A1, A2, etc.)
  - [ ] Semana actual dentro del nivel
  - [ ] Tarjetas estudiadas hoy / semana / total
  - [ ] Racha de días consecutivos
  - [ ] Gráfico de actividad (últimos 30 días)
- [ ] Pantalla de detalle por nivel:
  - [ ] Progreso por semana (% completado)
  - [ ] Palabras dominadas vs en aprendizaje
- [ ] Pantalla de detalle por semana:
  - [ ] Lista de palabras de la semana
  - [ ] Estado de cada una (nueva, aprendiendo, dominada)
- [ ] Notificaciones diarias (push móvil + web)
- [ ] **Entregable**: Usuario ve su progreso claramente

---

## 📖 Fase 7: Lectura de párrafos (Semana 7)

### Objetivo

Practicar lectura con los párrafos del método.

- [ ] Pantalla de lectura de párrafos
  - [ ] Muestra párrafo del nivel actual
  - [ ] Tap en palabra → muestra traducción y ejemplo
  - [ ] Marcar palabra como "no conozco" → la añade a Anki
  - [ ] Marcar párrafo como "leído sin esfuerzo"
- [ ] Importar párrafos A1 y A2 del documento
- [ ] Sistema de "desbloqueo" de párrafos según progreso
- [ ] Modo audio: text-to-speech del párrafo
- [ ] **Entregable**: Usuario puede leer párrafos de su nivel y extraer palabras nuevas

---

## 🎯 Fase 8: Sistema de niveles y avance (Semana 8)

### Objetivo

Lógica para avanzar de A1 → A2 → B1 → B2.

- [ ] Criterios de avance implementados:
  - [ ] 90%+ de palabras de la semana en estado "dominado"
  - [ ] Test de autoevaluación (quiz) aprobado con 80%+
  - [ ] X párrafos del nivel leídos sin esfuerzo
- [ ] Pantalla de "evaluación de nivel"
  - [ ] Quiz con 30 palabras aleatorias del nivel
  - [ ] Resultado y recomendación
- [ ] Desbloqueo automático del siguiente nivel
- [ ] Notificación de "¡Subiste de nivel!"
- [ ] **Entregable**: Usuario avanza de nivel cuando cumple criterios

---

## 🌐 Fase 9: Web específica (Semana 9)

### Objetivo

Aprovechar capacidades web (SEO, PWA, compartir).

- [ ] Landing page pública:
  - [ ] Explicación del método
  - [ ] Demo de flashcard
  - [ ] CTA para registrarse
- [ ] SEO: meta tags, sitemap, OpenGraph
- [ ] PWA: instalable, offline, iconos
- [ ] Compartir progreso en redes
- [ ] Modo invitado (probar sin registrarse, 1 semana)
- [ ] **Entregable**: Web pública lista para marketing

---

## 📱 Fase 10: Móvil específico (Semana 10)

### Objetivo

Aprovechar capacidades móviles.

- [ ] Notificaciones push configurables
- [ ] Widgets (iOS/Android) con resumen del día
- [ ] Modo offline robusto (sync cuando hay red)
- [ ] Gestos: swipe para calidad, tap para flip
- [ ] Haptic feedback en respuestas
- [ ] Soporte a tablets (layout adaptativo)
- [ ] **Entregable**: App móvil lista para App Store y Play Store

---

## 🧪 Fase 11: Testing y QA (Semana 11)

### Objetivo

Calidad antes de lanzamiento.

- [ ] Tests e2e con Playwright (web):
  - [ ] Registro → login → estudiar → ver progreso
  - [ ] Flujo completo de avance de nivel
- [ ] Tests e2e con Maestro o Detox (móvil)
- [ ] Beta testing con 20-50 usuarios reales
- [ ] Recopilar feedback y priorizar fixes
- [ ] Performance: Lighthouse 90+ (web), 60fps (móvil)
- [ ] Accesibilidad: auditoría WCAG AA
- [ ] **Entregable**: App estable y probada

---

## 🚀 Fase 12: Lanzamiento (Semana 12)

### Objetivo

Publicar en tiendas y web.

- [ ] Deploy web a Vercel (producción)
- [ ] Build móvil con EAS (producción)
- [ ] Submit a App Store (iOS)
- [ ] Submit a Google Play (Android)
- [ ] Documentación pública (guía de usuario)
- [ ] Analytics básicos (Mixpanel o PostHog)
- [ ] Sistema de feedback in-app
- [ ] **Entregable**: App pública y disponible

---

## 🔮 Fase 13+: Futuro (post-lanzamiento)

### Banco A2, B1, B2

- [ ] Curar banco A2 (~1.000 palabras)
- [ ] Curar banco B1 (~1.000 palabras)
- [ ] Curar banco B2 (~1.500-2.000 palabras)
- [ ] Añadir párrafos de práctica por nivel

### Funcionalidades avanzadas

- [ ] Modo "extraer palabras de texto propio" (usuario pega texto, la app identifica palabras desconocidas)
- [ ] Comunidad: compartir listas de palabras, párrafos propios
- [ ] Gamificación: logros, desafíos semanales
- [ ] Modo grupo/clase (profesores asignan contenido a alumnos)
- [ ] API pública para integrar con otros sistemas
- [ ] Exportar progreso a CSV/PDF

### Internacionalización

- [ ] UI en portugués, francés, alemán
- [ ] Bancos de palabras para otros idiomas (inglés-portugués, etc.)

---

## 📋 Backlog (ideas para evaluar después)

- [ ] Pronunciación con reconocimiento de voz
- [ ] Dictados interactivos
- [ ] Conversación con chatbot (¡aquí sí IA, pero opcional y no core)
- [ ] Modo "inmersión": cambiar idioma de la app gradualmente
- [ ] Importar contenido de Anki existente
- [ ] Integración con lectores de eBooks

---

## 🎯 Criterios de "Done" por fase

Cada fase se considera terminada cuando:

1. ✅ Todas las tareas marcadas están completas
2. ✅ Tests pasando en CI
3. ✅ Code review aprobado por al menos 1 persona
4. ✅ Documentación actualizada
5. ✅ Demo funcional mostrada al equipo

---

## 📊 Métricas de éxito (post-lanzamiento)

- **Retención D7**: 40%+ de usuarios vuelven al día 7
- **Retención D30**: 20%+ de usuarios vuelven al día 30
- **Sesiones/usuario/semana**: 4+
- **NPS**: 40+
- **Palabras aprendidas/usuario/mes**: 100+
EOF
cat tasks.md | wc -l</parameter>
</invoke>

</tool_call>
<invoke name="bash">
<parameter name="command">cd /home/claude/english-app && cat > claude.md << 'EOF'

# Claude.md - Contexto del proyecto para asistentes IA

Este archivo proporciona contexto a Claude (y otros asistentes IA) sobre el proyecto English Progress.
**Lée este archivo completo antes de hacer cualquier cambio significativo.**

---

## 🎯 Qué es este proyecto

App educativa para aprender inglés mediante método progresivo por vocabulario (A1 → A2 → B1 → B2).
Tiene versión móvil (Expo/React Native) y web (Next.js), compartiendo lógica de negocio en un monorepo.

El método se basa en:

1. Banco de palabras curado manualmente, organizado por niveles y semanas temáticas
2. Sistema de repetición espaciada (algoritmo SM-2, como Anki)
3. Lectura de párrafos graduados para fijar vocabulario en contexto
4. Criterios claros de avance entre niveles

---

## 🚨 REGLA ABSOLUTA: NO USAR IA PARA CONTENIDO

**PROHIBIDO** usar IA (incluyéndote a ti, Claude) para:

- Generar palabras nuevas para el banco
- Traducir palabras del banco
- Escribir ejemplos del banco
- Modificar el contenido de `packages/content/`

**PERMITIDO** usar IA para:

- Escribir código de la app
- Revisar código
- Sugerir mejoras de UX/UI
- Optimizar queries de base de datos
- Escribir tests
- Documentar el proyecto

**Razón**: El banco de palabras es curado por humanos (profesores/hablantes nativos). La calidad y precisión del contenido es responsabilidad humana, no algorítmica.

Si te piden modificar `packages/content/levels/**/*.json`, **declina amablemente** y sugiere que un curador humano lo haga.

---

## 🏗️ Arquitectura

### Monorepo con Turborepo + pnpm

```
apps/
  mobile/          # Expo (React Native) - iOS + Android
  web/             # Next.js 14 - Web + PWA

packages/
  ui/              # Componentes compartidos
  database/        # Drizzle schema + queries
  validators/      # Zod schemas
  content/         # ⭐ BANCO DE PALABRAS (NO MODIFICAR CON IA)
  spaced-repetition/  # Algoritmo SM-2
  config/          # Configs compartidas

tooling/
  typescript/      # tsconfig base
  eslint/          # ESLint compartido
```

### Flujo de datos

```
Usuario interactúa con UI (mobile/web)
  ↓
UI llama a funciones de negocio (packages/*)
  ↓
Funciones validan con Zod (packages/validators)
  ↓
Queries a Supabase vía Drizzle (packages/database)
  ↓
Supabase devuelve datos
  ↓
TanStack Query cachea y UI actualiza
```

### Offline-first

- El banco de palabras se empaqueta con la app (no se descarga en runtime)
- El progreso del usuario se guarda localmente (SQLite en móvil, IndexedDB en web)
- Cuando hay conexión, se sincroniza con Supabase
- Conflictos se resuelven con "última escritura gana" + merge de progreso

---

## 📚 Banco de palabras (la parte crítica)

### Ubicación

`packages/content/levels/{a1,a2,b1,b2}/week-NN-theme.json`

### Formato de cada archivo

```json
{
  "level": "A1",
  "week": 1,
  "theme": "Pronouns, greetings and basic verbs",
  "themeEs": "Pronombres, saludos y verbos básicos",
  "words": [
    {
      "id": "a1_w01_001",
      "en": "hello",
      "es": "hola",
      "example": "Hello, how are you?",
      "exampleEs": "Hola, ¿cómo estás?",
      "pos": "interjection",
      "tags": ["greeting", "basic"],
      "verifiedBy": "curator-name",
      "verifiedAt": "2026-09-11"
    }
  ]
}
```

### Reglas del banco

- Cada palabra tiene ID único: `{level}_w{week}_{number}`
- Campos requeridos: `id`, `en`, `es`, `example`, `pos`, `verifiedBy`, `verifiedAt`
- `pos` (part of speech): noun, verb, adjective, adverb, preposition, conjunction, pronoun, interjection, article, determiner
- `tags`: array libre para categorización adicional
- `verifiedBy`: nombre del curador humano que aprobó la entrada
- `verifiedAt`: fecha ISO de verificación

### Scripts disponibles

```bash
pnpm content:validate   # Valida integridad de todo el banco
pnpm content:stats      # Estadísticas (palabras por nivel, semana, etc.)
pnpm content:sync       # Sincroniza JSON → Supabase
pnpm content:check-duplicates  # Busca duplicados
```

---

## 🧠 Algoritmo de repetición espaciada

### Ubicación

`packages/spaced-repetition/`

### Algoritmo

SM-2 (SuperMemo 2), el mismo que usa Anki.

### Funciones principales

```typescript
// Calcula próxima revisión basado en calidad de respuesta (0-5)
function calculateNextReview(card: Card, quality: number): Card

// Obtiene tarjetas que el usuario debe estudiar hoy
function getCardsForReview(userId: string, date: Date): Card[]

// Actualiza progreso después de estudiar una tarjeta
function updateCardProgress(cardId: string, quality: number): Card
```

### Estados de una tarjeta

- `new`: nunca estudiada
- `learning`: en proceso de aprendizaje (intervalos cortos)
- `review`: en fase de repaso (intervalos largos)
- `relearning`: olvidada, vuelve a aprendizaje
- `dominated`: intervalo > 21 días y facilidad > 2.5

### Métricas por tarjeta

- `interval`: días hasta próxima revisión
- `ease`: factor de facilidad (default 2.5, mínimo 1.3)
- `reps`: número de repasos exitosos
- `lapses`: número de veces que fue olvidada
- `dueDate`: fecha de próxima revisión
- `lastReviewed`: fecha de última revisión

### Tests obligatorios

100% de cobertura. Casos críticos:

- Tarjeta nueva → primer intervalo 1 día
- Calidad 0-3 → resetea a learning
- Calidad 4 → intervalo = ease * interval anterior
- Calidad 5 → aumenta ease en 0.15
- Ease nunca baja de 1.3
- Intervalos crecen exponencialmente en review

---

## 🗄️ Base de datos (Supabase)

### Tablas principales

```sql
users
  id (uuid, PK)
  email
  created_at
  current_level (A1, A2, B1, B2)
  current_week (int)

user_word_progress
  user_id (FK)
  word_id (FK)
  state (new, learning, review, relearning, dominated)
  interval (int)
  ease (float)
  reps (int)
  lapses (int)
  due_date (timestamp)
  last_reviewed (timestamp)
  PRIMARY KEY (user_id, word_id)

user_study_sessions
  id (uuid, PK)
  user_id (FK)
  started_at (timestamp)
  ended_at (timestamp)
  cards_reviewed (int)
  cards_correct (int)

words
  id (text, PK)  -- viene del banco de contenido
  level (text)
  week (int)
  en (text)
  es (text)
  example (text)
  example_es (text)
  pos (text)
  tags (text[])

paragraphs
  id (uuid, PK)
  level (text)
  text (text)
  word_ids (text[])  -- palabras del banco que aparecen
```

### Políticas RLS (Row Level Security)

- Usuarios solo ven/editan su propio progreso
- Tabla `words` es pública (lectura)
- Tabla `paragraphs` es pública (lectura)

---

## 🎨 Convenciones de código

### TypeScript

```typescript
// ✅ BIEN
interface UserProgress {
  userId: string;
  wordId: string;
  state: CardState;
  interval: number;
  ease: number;
}

type CardState = 'new' | 'learning' | 'review' | 'relearning' | 'dominated';

// ❌ MAL
interface any {
  userId: any;
  wordId: any;
}
```

### Componentes React

```tsx
// ✅ BIEN: componente pequeño, enfocado
interface FlashCardProps {
  word: Word;
  onRate: (quality: number) => void;
  isFlipped: boolean;
}

export function FlashCard({ word, onRate, isFlipped }: FlashCardProps) {
  // ...
}

// ❌ MAL: componente gigante con lógica de negocio
export function StudyScreen() {
  // 500 líneas de lógica + UI mezclada
}
```

### Nomenclatura

- Archivos: `kebab-case.ts`
- Componentes: `PascalCase.tsx`
- Funciones: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- Tipos: `PascalCase`
- Enums: `PascalCase` con valores `UPPER_SNAKE_CASE`

---

## 🧪 Testing

### Herramientas

- **Unit/Integration**: Vitest
- **E2E web**: Playwright
- **E2E móvil**: Maestro (preferido) o Detox

### Cobertura mínima

- `packages/spaced-repetition/`: 100%
- `packages/validators/`: 100%
- `packages/database/`: 80%+
- `apps/**/components/`: 70%+
- `apps/**/screens/`: 50%+ (tests de integración)

### Comandos

```bash
pnpm test                    # Todos los tests
pnpm test:watch              # Modo watch
pnpm test:coverage           # Con reporte de cobertura
pnpm test:e2e:web            # Playwright
pnpm test:e2e:mobile         # Maestro
pnpm test:content            # Valida banco de palabras
```

---

## 🚀 Comandos útiles

```bash
# Desarrollo
pnpm dev:web                 # Next.js en localhost:3000
pnpm dev:mobile              # Expo en simulador
pnpm dev                     # Ambos en paralelo

# Build
pnpm build:web
pnpm build:mobile
pnpm build                   # Ambos

# Linting
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check

# Type checking
pnpm typecheck

# Base de datos
pnpm db:generate             # Generar migraciones Drizzle
pnpm db:migrate              # Aplicar migraciones
pnpm db:seed                 # Seeds de prueba
pnpm db:studio               # Drizzle Studio (UI de DB)

# Contenido
pnpm content:validate
pnpm content:stats
pnpm content:sync
```

---

## 📋 Checklist antes de hacer un PR

- [ ] ¿Mi código pasa `pnpm typecheck`?
- [ ] ¿Mi código pasa `pnpm lint`?
- [ ] ¿Añadí tests para funcionalidad nueva?
- [ ] ¿Los tests existentes siguen pasando?
- [ ] ¿Actualicé la documentación si cambió el comportamiento?
- [ ] ¿Seguí las convenciones de nomenclatura?
- [ ] ¿Evité usar `any`?
- [ ] **Si toqué `packages/content/`**: ¿DECLINÉ el cambio y sugerí un curador humano?

---

## 🆘 Cuando pedir ayuda

Pregunta (a humano o a IA) cuando:

- No estás seguro de la arquitectura de una funcionalidad nueva
- Hay un bug difícil de reproducir
- Necesitas optimizar una query lenta
- No sabes cómo testear un caso edge
- Hay conflicto de merge complejo

**NO preguntes** (hazlo directamente):

- Cambios de estilo/formato (Prettier lo decide)
- Typos en comentarios
- Imports no usados
- Renombrar variables por claridad

---

## 📚 Recursos internos

- [Reglas del proyecto](./project-rules.md) - Reglas absolutas y convenciones
- [Roadmap](./tasks.md) - Tareas por fase
- [README](./README.md) - Overview del proyecto
- [docs/architecture.md](./docs/architecture.md) - Diagramas de arquitectura
- [docs/content-guide.md](./docs/content-guide.md) - Guía para curadores de contenido
- [docs/spaced-repetition.md](./docs/spaced-repetition.md) - Documentación del algoritmo

---

## 🎯 Prioridades al desarrollar

1. **Correctud** > Velocidad (mejor lento y bien que rápido y mal)
2. **Type safety** > Código corto (mejor verbose y seguro)
3. **Tests** > Features nuevas (no merges sin tests)
4. **UX del estudiante** > Features bonitas (la app debe ser útil, no solo linda)
5. **Contenido curado** > Contenido generado (calidad sobre cantidad)

---

## 💬 Tono de comunicación

Cuando ayudes con este proyecto:

- Sé directo y práctico
- Muestra código, no solo explicaciones
- Si hay trade-offs, explícalos brevemente
- Si algo viola las reglas del proyecto, señálalo claramente
- Si te piden algo prohibido (ej: generar contenido con IA), declina amablemente y explica por qué

---

**Última actualización**: 2026-09-11
**Mantenedor principal**: [Tu nombre]
**Contacto**: [Tu email]
EOF
cat claude.md | wc -l</parameter>
</invoke>
</tool_call>
<invoke name="bash">
<parameter name="command">cd /home/claude/english-app && cat > docs/architecture.md << 'EOF'

# Arquitectura del sistema

## Diagrama de alto nivel

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTES                              │
├──────────────────────────┬──────────────────────────────────┤
│   Expo Mobile App        │   Next.js Web App                │
│   (iOS + Android)        │   (Browser + PWA)                │
│                          │                                   │
│   ┌──────────────────┐   │   ┌──────────────────┐          │
│   │  UI Components   │   │   │  UI Components   │          │
│   │  (NativeWind)    │   │   │  (Tailwind)      │          │
│   └────────┬─────────┘   │   └────────┬─────────┘          │
│            │              │            │                     │
│   ┌────────▼─────────────▼────────────▼─────────┐          │
│   │   Shared Business Logic (packages/*)        │          │
│   │   - spaced-repetition                       │          │
│   │   - validators                              │          │
│   │   - content (banco de palabras)             │          │
│   └────────┬────────────────────────────────────┘          │
│            │                                                │
│   ┌────────▼─────────┐                         ┌──────────┐│
│   │  Local Storage   │                         │  Sync    ││
│   │  (SQLite/IDB)    │◄───────────────────────►│  Layer   ││
│   └──────────────────┘                         └────┬─────┘│
└─────────────────────────────────────────────────────┼──────┘
                                                      │
                                                      ▼
                              ┌──────────────────────────────┐
                              │      Supabase (Backend)      │
                              ├──────────────────────────────┤
                              │  PostgreSQL (datos usuario)  │
                              │  Auth (login/registro)       │
                              │  Storage (audio, imágenes)   │
                              │  Realtime (sync)             │
                              └──────────────────────────────┘
```

## Flujo de datos: estudiar una tarjeta

```
1. Usuario abre pantalla de estudio
        │
        ▼
2. App consulta tarjetas pendientes
   (TanStack Query → local cache → Supabase si no hay cache)
        │
        ▼
3. spaced-repetition.getDueCards(userId, today)
        │
        ▼
4. UI muestra primera tarjeta (FlashCard component)
        │
        ▼
5. Usuario califica (0-5)
        │
        ▼
6. spaced-repetition.updateProgress(cardId, quality)
   → calcula nuevo interval, ease, dueDate
        │
        ▼
7. Guardar en local storage (offline-first)
        │
        ▼
8. Sync en background con Supabase
   → user_word_progress actualizado
        │
        ▼
9. UI muestra siguiente tarjeta
```

## Flujo de datos: avance de nivel

```
1. Usuario completa semana 18 de A1
        │
        ▼
2. App verifica criterios de avance:
   - 90%+ palabras de A1 en estado "dominated"
   - Quiz de evaluación aprobado (80%+)
   - X párrafos A1 leídos sin esfuerzo
        │
        ▼
3. Si cumple todos → desbloquea A2
        │
        ▼
4. user.current_level = 'A2'
   user.current_week = 1
        │
        ▼
5. UI notifica: "¡Subiste a A2!"
   Carga banco de palabras A2
```

## Estructura de paquetes

### packages/content

**Propósito**: Banco de palabras curado manualmente.
**No contiene**: Lógica de app, solo datos estáticos.
**Formato**: JSON versionado con Git.
**Regla crítica**: NO modificar con IA.

### packages/spaced-repetition

**Propósito**: Algoritmo SM-2 puro (sin dependencias de UI/DB).
**Input**: Card + quality → Output: Card actualizada.
**Tests**: 100% cobertura obligatoria.

### packages/database

**Propósito**: Esquema Drizzle + queries tipadas.
**Contiene**: Tablas, relaciones, funciones de query.
**No contiene**: Lógica de negocio (eso va en spaced-repetition o validators).

### packages/validators

**Propósito**: Schemas Zod para validación de datos.
**Uso**: Frontend valida antes de enviar, backend valida al recibir.
**Ejemplos**: LoginSchema, WordSchema, ProgressSchema.

### packages/ui

**Propósito**: Componentes compartidos entre móvil y web.
**Adaptación**: Usa NativeWind en móvil, Tailwind en web.
**Ejemplos**: Button, Card, Input, FlashCard.

## Decisiones arquitectónicas clave

### ¿Por qué monorepo?

- Compartir lógica de negocio (spaced-repetition, validators) entre móvil y web
- Un solo lugar para cambios de esquema de datos
- Testing unificado
- Deploy coordinado

### ¿Por qué offline-first?

- Estudiantes pueden estudiar en cualquier lugar (metro, avión, zonas sin señal)
- Reduce carga en servidor
- Mejor UX (sin loading spinners constantes)
- Sync eventual es suficiente para este caso de uso

### ¿Por qué Supabase en vez de backend propio?

- Auth listo (email, OAuth)
- PostgreSQL robusto
- Realtime para sync
- Storage para audio/imágenes
- Gratis hasta escalar
- Menos código de mantenimiento

### ¿Por qué Drizzle en vez de Prisma?

- Más rápido en runtime
- SQL-like (más control)
- Mejor para edge functions
- Type inference superior

### ¿Por qué SM-2 en vez de otro algoritmo?

- Probado por décadas (Anki lo usa)
- Simple de implementar
- Efectivo para memorización a largo plazo
- Comunidad grande (recursos, discusiones)

## Escalabilidad

### Horizontal

- Supabase escala automáticamente (hasta cierto punto)
- Web en Vercel escala sin configuración
- Móvil no tiene límite de usuarios

### Vertical (cuando crezcamos)

- Migrar Supabase a plan Pro si > 50k usuarios
- CDN para banco de palabras si > 100k palabras
- Background jobs para sync masivo
- Sharding de user_word_progress si > 10M rows

## Seguridad

### Autenticación

- Supabase Auth (JWT)
- Refresh tokens rotativos
- Sesiones persistentes configurables

### Autorización

- RLS (Row Level Security) en Supabase
- Usuarios solo ven sus datos
- Admins tienen acceso especial (tabla admins separada)

### Contenido

- Banco de palabras es público (lectura)
- Solo curadores autorizados pueden modificar (vía PR, no vía app)
- Audit log de cambios en contenido

### Rate limiting

- Supabase lo maneja automáticamente
- Endpoints críticos (login, sync) tienen límites adicionales

## Monitoreo

### Métricas clave

- Errores por minuto (Sentry)
- Tiempo de respuesta de API (Supabase dashboard)
- Retención de usuarios (Mixpanel/PostHog)
- Progreso promedio por nivel (analytics propio)

### Alertas

- Error rate > 1%
- API latency > 2s
- Sync failures > 5%
- DB connection pool > 80%

## Disaster recovery

### Backups

- Supabase hace backups automáticos (diarios, retenidos 7 días)
- Banco de palabras versionado en Git (fuente de verdad)
- Scripts de restauración documentados

### Plan de contingencia

1. Si Supabase cae → app sigue funcionando offline
2. Si web cae → app móvil sigue funcionando
3. Si móvil falla → web como respaldo
4. Si todo falla → backups de Supabase + Git
EOF
cat docs/architecture.md | wc -l</parameter>
</invoke>

</tool_call>
<invoke name="bash">
<parameter name="command">cd /home/claude/english-app && cat > docs/content-guide.md << 'EOF'

# Guía para curadores de contenido

Este documento explica cómo añadir, modificar y verificar palabras en el banco.
**Recuerda: todo el contenido es curado por humanos, nunca por IA.**

---

## 🎯 Principios del banco de palabras

1. **Calidad sobre cantidad**: mejor 1.000 palabras bien curadas que 5.000 con errores.
2. **Frecuencia real**: las palabras deben ser de alta frecuencia en inglés real (usar Oxford 3000/5000 como referencia).
3. **Contexto útil**: los ejemplos deben mostrar la palabra en contexto natural.
4. **Traducción precisa**: la traducción al español debe ser la más común, no la más literal.
5. **Nivel correcto**: cada palabra debe estar en el nivel que corresponde (A1, A2, B1, B2).

---

## 📁 Estructura de archivos

```
packages/content/
  levels/
    a1/
      week-01-pronouns-and-greetings.json
      week-02-time-expressions.json
      ...
      week-18-action-verbs.json
    a2/
      week-01-shopping.json
      ...
    b1/
    b2/
  paragraphs/
    a1/
      paragraph-01-introductions.json
      ...
    a2/
    b1/
    b2/
  metadata/
    levels.json
    progress-rules.json
```

---

## 📝 Formato de archivo de semana

```json
{
  "level": "A1",
  "week": 1,
  "theme": "Pronouns, greetings and basic verbs",
  "themeEs": "Pronombres, saludos y verbos básicos",
  "words": [
    {
      "id": "a1_w01_001",
      "en": "hello",
      "es": "hola",
      "example": "Hello, how are you?",
      "exampleEs": "Hola, ¿cómo estás?",
      "pos": "interjection",
      "tags": ["greeting", "basic"],
      "verifiedBy": "maria-garcia",
      "verifiedAt": "2026-09-11"
    }
  ]
}
```

### Campos requeridos

| Campo | Tipo | Descripción | Ejemplo |
| --- | --- | --- | --- |
| `id` | string | ID único: `{level}_w{week}_{number}` | `"a1_w01_001"` |
| `en` | string | Palabra/frase en inglés | `"hello"` |
| `es` | string | Traducción al español | `"hola"` |
| `example` | string | Oración de ejemplo en inglés | `"Hello, how are you?"` |
| `exampleEs` | string | Traducción del ejemplo | `"Hola, ¿cómo estás?"` |
| `pos` | string | Parte de la oración | `"interjection"` |
| `verifiedBy` | string | Nombre del curador | `"maria-garcia"` |
| `verifiedAt` | string | Fecha de verificación (ISO) | `"2026-09-11"` |

### Campos opcionales

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `tags` | string[] | Etiquetas para categorización |
| `audio` | string | Ruta a archivo de audio (si existe) |
| `notes` | string | Notas del curador (no se muestra al usuario) |
| `relatedWords` | string[] | IDs de palabras relacionadas |

---

## ✅ Checklist de verificación

Antes de aprobar una palabra, verifica:

### Ortografía y gramática

- [ ] Palabra en inglés está bien escrita
- [ ] Ejemplo en inglés es gramaticalmente correcto
- [ ] Traducción al español es correcta
- [ ] Traducción del ejemplo es correcta

### Calidad

- [ ] Palabra es de alta frecuencia (aparece en Oxford 3000 o NGSL)
- [ ] Traducción es la más común (no la más literal)
- [ ] Ejemplo muestra la palabra en contexto natural
- [ ] Ejemplo es simple y claro (apropiado para el nivel)

### Nivel

- [ ] Palabra corresponde al nivel (A1, A2, B1, B2)
- [ ] Ejemplo es apropiado para el nivel
- [ ] No hay palabras del nivel en el ejemplo (si es A1, el ejemplo no debe tener palabras B1)

### Metadata

- [ ] ID es único (no duplicado en todo el banco)
- [ ] `pos` es correcto (noun, verb, adjective, etc.)
- [ ] `verifiedBy` es tu nombre
- [ ] `verifiedAt` es la fecha de hoy

---

## 🔍 Cómo verificar frecuencia de una palabra

### Herramientas recomendadas

1. **Oxford 3000/5000**: <https://www.oxfordlearnersdictionaries.com/wordlist/>
2. **NGSL (New General Service List)**: <https://www.newgeneralservicelist.org/>
3. **COCA (Corpus of Contemporary American English)**: <https://www.english-corpora.org/coca/> (requiere registro gratuito)
4. **Google Ngram Viewer**: <https://books.google.com/ngrams> (para verificar uso histórico)

### Regla general

- **A1**: Top 500 palabras más frecuentes
- **A2**: Palabras 500-1500
- **B1**: Palabras 1500-3000
- **B2**: Palabras 3000-6000

---

## 🎨 Estilo de ejemplos

### Buenos ejemplos

```json
{
  "en": "kitchen",
  "es": "cocina",
  "example": "My mother is cooking in the kitchen.",
  "exampleEs": "Mi madre está cocinando en la cocina."
}
```

✅ Contexto natural, simple, muestra uso real.

```json
{
  "en": "decide",
  "es": "decidir",
  "example": "I can't decide what to wear today.",
  "exampleEs": "No puedo decidir qué usar hoy."
}
```

✅ Muestra el verbo en contexto, con estructura común (decide + what + infinitive).

### Malos ejemplos

```json
{
  "en": "kitchen",
  "es": "cocina",
  "example": "The kitchen is a room where food is prepared.",
  "exampleEs": "La cocina es un room donde food is prepared."
}
```

❌ Definición de diccionario, no uso natural. Traducción incompleta.

```json
{
  "en": "decide",
  "es": "decidir",
  "example": "The committee decided to implement the new policy.",
  "exampleEs": "El comité decidió implementar la nueva política."
}
```

❌ Muy formal para A1. Vocabulario del ejemplo muy avanzado (committee, implement, policy).

---

## 🚫 Qué NO hacer

### ❌ No usar IA para generar contenido

- No pidas a ChatGPT/Claude/Gemini que genere palabras
- No uses traductores automáticos sin verificación humana
- No copies contenido de otros diccionarios sin verificar

### ❌ No añadir palabras de baja frecuencia

- Palabras muy técnicas o especializadas (excepto en B2 temático)
- Arcaísmos o slang muy local
- Palabras que un estudiante nunca encontrará en textos comunes

### ❌ No mezclar niveles

- No pongas palabras B1 en A1 "porque son fáciles"
- Cada nivel tiene su propósito y su público

### ❌ No saltarse la verificación

- Toda palabra debe ser verificada por un humano
- No marques `verifiedBy` si no verificaste tú mismo

---

## 🔄 Proceso de PR para contenido

1. **Crear rama**: `content/add-a2-week-05` o `content/fix-a1-week-03`
2. **Modificar archivos** en `packages/content/`
3. **Ejecutar validación**: `pnpm content:validate`
4. **Verificar estadísticas**: `pnpm content:stats`
5. **Crear PR** con descripción:
   - Qué añadiste/cambiaste
   - Por qué (justificación de frecuencia/nivel)
   - Quién verificó (tu nombre + al menos 1 revisor)
6. **Review** por otro curador
7. **Merge** solo después de aprobación

---

## 📊 Estadísticas del banco

Comando: `pnpm content:stats`

Salida esperada:

```
📚 English Progress - Content Statistics

Levels:
  A1: 1,483 words (18 weeks)
  A2: 0 words (0 weeks)
  B1: 0 words (0 weeks)
  B2: 0 words (0 weeks)

Total: 1,483 words

Parts of speech:
  noun: 623 (42%)
  verb: 412 (28%)
  adjective: 234 (16%)
  adverb: 89 (6%)
  other: 125 (8%)

Verification status:
  ✅ Verified: 1,483 (100%)
  ⚠️  Pending: 0 (0%)
```

---

## 🆘 Recursos para curadores

### Diccionarios recomendados

- **Oxford Learner's Dictionaries**: <https://www.oxfordlearnersdictionaries.com/>
- **Cambridge Dictionary**: <https://dictionary.cambridge.org/>
- **WordReference**: <https://www.wordreference.com/> (para discusiones de traducción)
- **Linguee**: <https://www.linguee.com/> (para ejemplos en contexto)

### Listas de frecuencia

- **Oxford 3000/5000**: <https://www.oxfordlearnersdictionaries.com/wordlist/>
- **NGSL**: <https://www.newgeneralservicelist.org/>
- **GSL (General Service List)**: <http://www.west-rd.com/west/papers/gsl_complete.txt>

### Gramática de referencia

- **English Grammar Profile**: <https://www.englishgrammarprofiling.com/>
- **British Council Grammar**: <https://learnenglish.britishcouncil.org/grammar>

---

## 💬 Contacto

¿Dudas sobre si una palabra debe estar en cierto nivel? ¿No sabes cómo traducir algo?

- **Slack**: #content-curators
- **Email**: <content@englishprogress.app>
- **Reunión semanal**: Jueves 10am (opcional, para discutir casos difíciles)

---

**Recuerda**: La calidad del banco es la calidad de la app. Cada palabra que añades será estudiada por miles de estudiantes. Tómate tu tiempo, verifica bien, y no tengas prisa.
EOF
cat docs/content-guide.md | wc -l</parameter>
</invoke>
</tool_call>
<invoke name="bash">
<parameter name="command">cd /home/claude/english-app && cat > docs/spaced-repetition.md << 'EOF'

# Algoritmo de repetición espaciada

Documentación del algoritmo SM-2 implementado en `packages/spaced-repetition/`.

---

## 📚 ¿Qué es SM-2?

SM-2 (SuperMemo 2) es un algoritmo de repetición espaciada desarrollado por Piotr Woźniak en 1987. Es el algoritmo que usa Anki y es uno de los más probados y efectivos para memorización a largo plazo.

### Idea central

- Si respondes bien una tarjeta, el intervalo hasta la próxima revisión aumenta.
- Si respondes mal, el intervalo se resetea a 1 día (o menos).
- Cada tarjeta tiene un "factor de facilidad" (ease) que ajusta qué tan rápido crecen los intervalos.

---

## 🧮 El algoritmo

### Inputs

- **Card**: tarjeta con estado actual (interval, ease, reps, lapses, dueDate)
- **Quality**: calidad de respuesta (0-5)
  - 0: No recuerdo nada
  - 1: Casi nada
  - 2: Con esfuerzo
  - 3: Correcto, pero difícil
  - 4: Correcto, con duda menor
  - 5: Perfecto, fácil

### Outputs

- **Card actualizada**: con nuevo interval, ease, reps, lapses, dueDate

### Fórmulas

#### Si quality < 3 (respuesta incorrecta o muy difícil)

```
reps = 0
interval = 1 día
lapses += 1
```

La tarjeta vuelve a estado "learning".

#### Si quality >= 3 (respuesta correcta)

```
if reps == 0:
    interval = 1
elif reps == 1:
    interval = 6
else:
    interval = round(interval * ease)

reps += 1
```

#### Actualizar ease (solo si quality >= 3)

```
ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
ease = max(1.3, ease)  // ease mínimo es 1.3
```

#### Calcular dueDate

```
dueDate = today + interval días
```

---

## 📊 Ejemplo paso a paso

### Tarjeta nueva (primera vez)

```
Card: { interval: 0, ease: 2.5, reps: 0, lapses: 0 }
Quality: 4 (correcto, con duda menor)

→ reps = 1
→ interval = 1 (primera respuesta correcta)
→ ease = 2.5 + (0.1 - (5-4) * (0.08 + (5-4) * 0.02))
       = 2.5 + (0.1 - 1 * 0.10)
       = 2.5 + 0.0
       = 2.5
→ dueDate = tomorrow
```

### Segunda revisión (día 2)

```
Card: { interval: 1, ease: 2.5, reps: 1, lapses: 0 }
Quality: 5 (perfecto)

→ reps = 2
→ interval = 6 (segunda respuesta correcta)
→ ease = 2.5 + (0.1 - (5-5) * (0.08 + 0))
       = 2.5 + 0.1
       = 2.6
→ dueDate = today + 6 días
```

### Tercera revisión (día 8)

```
Card: { interval: 6, ease: 2.6, reps: 2, lapses: 0 }
Quality: 2 (con esfuerzo, casi incorrecto)

→ reps = 0 (reset)
→ interval = 1
→ lapses = 1
→ ease = 2.6 (no cambia porque quality < 3)
→ dueDate = tomorrow
```

La tarjeta volvió a "learning" porque fue difícil.

---

## 🎯 Estados de una tarjeta

| Estado | Condición | Interval típico |
| --- | --- | --- |
| `new` | Nunca estudiada | 0 |
| `learning` | reps == 0 o quality < 3 recientemente | 1-3 días |
| `review` | reps > 0 y quality >= 3 | 6+ días (crece exponencialmente) |
| `relearning` | quality < 3 después de estar en review | 1-3 días |
| `dominated` | interval > 21 días y ease > 2.5 | 21+ días |

---

## 🧪 Tests obligatorios

### Casos críticos a testear

```typescript
describe('calculateNextReview', () => {
  test('tarjeta nueva con quality 5 → interval 1 día', () => {
    const card = newCard();
    const result = calculateNextReview(card, 5);
    expect(result.interval).toBe(1);
    expect(result.reps).toBe(1);
  });

  test('tarjeta nueva con quality 2 → resetea a learning', () => {
    const card = newCard();
    const result = calculateNextReview(card, 2);
    expect(result.interval).toBe(1);
    expect(result.reps).toBe(0);
    expect(result.lapses).toBe(1);
  });

  test('segunda respuesta correcta → interval 6 días', () => {
    const card = { ...newCard(), reps: 1, interval: 1 };
    const result = calculateNextReview(card, 4);
    expect(result.interval).toBe(6);
    expect(result.reps).toBe(2);
  });

  test('tercera respuesta correcta → interval crece por ease', () => {
    const card = { ...newCard(), reps: 2, interval: 6, ease: 2.5 };
    const result = calculateNextReview(card, 4);
    expect(result.interval).toBe(15); // round(6 * 2.5)
    expect(result.reps).toBe(3);
  });

  test('quality 5 aumenta ease en 0.1', () => {
    const card = { ...newCard(), reps: 1, interval: 1, ease: 2.5 };
    const result = calculateNextReview(card, 5);
    expect(result.ease).toBe(2.6);
  });

  test('quality 3 no cambia ease', () => {
    const card = { ...newCard(), reps: 1, interval: 1, ease: 2.5 };
    const result = calculateNextReview(card, 3);
    expect(result.ease).toBe(2.5);
  });

  test('ease nunca baja de 1.3', () => {
    const card = { ...newCard(), reps: 1, interval: 1, ease: 1.3 };
    const result = calculateNextReview(card, 0);
    expect(result.ease).toBe(1.3);
  });

  test('quality < 3 resetea reps a 0', () => {
    const card = { ...newCard(), reps: 5, interval: 30 };
    const result = calculateNextReview(card, 2);
    expect(result.reps).toBe(0);
  });
});
```

### Cobertura requerida: 100%

---

## 📦 Implementación en TypeScript

### Estructura de archivos

```
packages/spaced-repetition/
  src/
    index.ts              # Export público
    types.ts              # Tipos: Card, CardState, Quality
    calculate.ts          # calculateNextReview
    get-due-cards.ts      # getCardsForReview
    update-progress.ts    # updateCardProgress
    constants.ts          # MAX_INTERVAL, MIN_EASE, etc.
  tests/
    calculate.test.ts
    get-due-cards.test.ts
    update-progress.test.ts
  package.json
  tsconfig.json
```

### Tipos principales

```typescript
export type CardState = 'new' | 'learning' | 'review' | 'relearning' | 'dominated';

export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

export interface Card {
  id: string;
  userId: string;
  wordId: string;
  state: CardState;
  interval: number;      // días
  ease: number;          // factor de facilidad
  reps: number;          // repasos exitosos consecutivos
  lapses: number;        // veces que fue olvidada
  dueDate: Date;         // próxima revisión
  lastReviewed: Date | null;
}
```

---

## 🎛️ Configuración

### Constantes ajustables

```typescript
export const MAX_INTERVAL = 365;        // máximo 1 año entre repasos
export const MIN_EASE = 1.3;            // ease mínimo
export const DEFAULT_EASE = 2.5;        // ease inicial
export const NEW_CARDS_PER_DAY = 20;    // límite de tarjetas nuevas/día
export const REVIEWS_PER_DAY = 100;     // límite de repasos/día
export const DOMINATED_THRESHOLD = 21;  // días para considerar "dominada"
```

Estas constantes pueden ser configurables por el usuario en futuras versiones.

---

## 📈 Métricas de progreso

### Para el usuario

- **Tarjetas estudiadas hoy**: X
- **Racha de días**: Y días consecutivos
- **Tarjetas dominadas**: Z de W totales
- **Tiempo de estudio**: T minutos hoy

### Para analytics

- **Retention rate**: % de usuarios que vuelven después de 7/30/90 días
- **Average ease**: ease promedio de tarjetas en review (si es bajo, el contenido es muy difícil)
- **Lapse rate**: % de tarjetas que se olvidan (si es alto, el contenido es muy difícil o el algoritmo necesita ajuste)
- **Session length**: duración promedio de sesión de estudio

---

## 🔬 Referencias

- **SuperMemo 2 original**: <https://www.supermemo.com/en/archives1990-2015/english/ol/sm2>
- **Anki manual**: <https://docs.ankiweb.net/getting-started.html>
- **Spaced repetition theory**: <https://ncase.me/remember/>
- **Piotr Woźniak papers**: <https://www.supermemo.com/en/archives1990-2015/english/ol/supermemo>

---

## 🐛 Problemas conocidos y limitaciones

### Limitaciones de SM-2

1. **No considera hora del día**: si estudias mañana y noche, el algoritmo no lo sabe.
2. **No distingue entre "casi correcto" y "correcto con duda"**: quality 3 y 4 son similares.
3. **Ease puede crecer demasiado**: si siempre respondes 5, ease sube mucho y los intervalos se hacen muy largos.

### Mitigaciones

1. **Límite de intervalos**: MAX_INTERVAL = 365 días.
2. **Límite de ease**: MIN_EASE = 1.3, pero no hay MAX_EASE (podría añadirse).
3. **Límite de tarjetas nuevas**: NEW_CARDS_PER_DAY = 20 para no saturar.

### Futuras mejoras

- **FSRS (Free Spaced Repetition Scheduler)**: algoritmo más moderno que SM-2, usado por Anki 23+.
- **Adaptación por hora del día**: considerar si el usuario estudia mañana o noche.
- **Ajuste de ease más agresivo**: si lapse rate es alto, bajar ease más rápido.

---

## 💡 Consejos para usuarios

### Para estudiantes

- Estudia todos los días, aunque sea 10 minutos.
- No acumules tarjetas: si tienes 100 pendientes, haz 20 hoy y 20 mañana.
- Sé honesto con la calidad: si dudaste, pon 3, no 5.
- Si una palabra es muy difícil, no la saltes: repítela hasta que la domines.

### Para desarrolladores

- No cambies el algoritmo sin medir impacto en retention rate.
- Testea con datos reales antes de hacer cambios grandes.
- Documenta cualquier cambio en el algoritmo en este archivo.
- Considera A/B testing si quieres probar variantes del algoritmo.
EOF
cat docs/spaced-repetition.md | wc -l</parameter>
</invoke>

</tool_call>
<invoke name="bash">
<parameter name="command">cd /home/claude/english-app && tree -L 4</parameter>
</invoke>
</tool_call>
<invoke name="bash">
<parameter name="command">cd /home/claude/english-app && wc -l README.md project-rules.md tasks.md claude.md docs/*.md</parameter>
</invoke>
</tool_call>
<invoke name="bash">
<parameter name="command">mkdir -p /mnt/user-data/outputs && cp -r /home/claude/english-app/* /mnt/user-data/outputs/ && ls -la /mnt/user-data/outputs/</parameter>
</invoke>
</tool_call>

1. Repositorios de GitHub (Formato .txt directo)En GitHub existen varios proyectos de código abierto que alojan listas de palabras y traducciones limpias en archivos de texto:NeuromancerAI / Spanish-dictionary: Contiene un archivo de texto plano llamado english-spanish-2017-12-12.txt listo para descargar de forma directa. Está estructurado línea por línea con palabras en inglés y su traducción. [1] (<https://github.com/NeuromancerAI/Spanish-dictionary-/blob/master/english-spanish-2017-12-12.txt)doozan> / spanish_data: Este repositorio recopila datos de Wiktionary y Tatoeba. En la raíz o en sus carpetas de datos puedes encontrar archivos con extensión .data o .txt (como es_merged_50k.txt) que vinculan vocabulario en inglés y español. [1] (<https://github.com/doozan/spanish_data)sezinarseven> / dictionary-english-spanish: Un proyecto sencillo que incluye de forma separada los archivos english.txt y spanish.txt con correspondencia mutua. [1] (<https://github.com/sezinarseven/dictionary-english-spanish)2>. Plataformas de diccionarios abiertosFreeDict: Es uno de los proyectos de diccionarios libres más grandes. Aunque sus descargas principales usan formatos indexados para software (como TEI, StarDict o Dictd), sus bases de datos de origen son archivos de texto plano que puedes clonar directamente desde sus repositorios oficiales en GitHub. [1] (<https://freedict.org/es/downloads/)Internet> Archive: Si buscas opciones masivas de texto derivadas de escaneos OCR, puedes ir a páginas como la del Super Diccionario Español Inglés. En el panel lateral derecho de descargas, selecciona la opción "FULL TEXT" para bajar todo el contenido parseado en un único archivo .txt. [1] (<https://archive.org/details/SuperDiccionario>)

Excelente aporte. Estos repositorios y plataformas son recursos valiosos, pero debemos manejarlos con mucho cuidado para no violar la **Regla Absoluta #1 del proyecto**: *El contenido debe ser curado manualmente por humanos, con calidad y contexto, nunca importado masivamente de forma automática.*

Aquí te explico cómo integrar estos recursos de forma segura y alineada con la arquitectura que acabamos de diseñar:

---

### ⚠️ El riesgo de la importación masiva

Repositorios como `doozan/spanish_data` (Wiktionary/Tatoeba) o archivos OCR de Internet Archive contienen mucho "ruido":

- Traducciones literales sin contexto.
- Palabras en desuso, jerga muy local o términos hiper-técnicos.
- Falta total de **oraciones de ejemplo** (`example` / `exampleEs`), que son el corazón de nuestro método de aprendizaje.
- Ausencia de los metadatos críticos que definimos: `pos` (parte de la oración), `verifiedBy` y `verifiedAt`.

Si hacemos un script que simplemente convierta esos `.txt` a nuestro JSON, estaremos llenando la app de contenido de baja calidad, lo que arruinará la experiencia del estudiante.

---

### ✅ El uso correcto: "Referencia, no importación"

Estos archivos deben usarse como **material de consulta para el curador humano**, no como fuente de datos cruda. Por ejemplo:

1. **Validación cruzada**: Un curador está dudando entre traducir "schedule" como "horario" o "cronograma". Consulta estos repositorios para ver el uso más frecuente.
2. **Detección de frecuencia**: Usar listas como la de `NeuromancerAI` para confirmar que una palabra está dentro del top 3.000 (nivel B1 o inferior).
3. **Inspiración de ejemplos**: Buscar en Tatoeba cómo se usa una palabra en una oración real, pero **el curador debe reescribir y simplificar** esa oración para que se ajuste al nivel A1/A2 del estudiante.

---

### 🛠️ Propuesta: Herramienta de "Curación Asistida" (Human-in-the-loop)

Para hacer el trabajo del curador más rápido sin sacrificar la calidad, podemos crear un script local en el monorepo que facilite el proceso, pero que **exija la intervención humana** en cada paso.

Podemos agregar este comando al proyecto: `pnpm content:curate`

**Cómo funcionaría:**

1. El curador ejecuta el comando en la terminal.
2. El script le pide pegar un bloque de texto (ej. 20 palabras en formato `inglés, español`).
3. El script genera un archivo temporal `draft-week.json`.
4. **El curador debe abrir ese archivo y manualmente:**
   - Asignar el `pos` (sustantivo, verbo, etc.).
   - **Escribir** una oración de ejemplo en inglés (`example`).
   - **Escribir** la traducción de esa oración (`exampleEs`).
   - Cambiar el estado de `verified: false` a `verified: true` y poner su nombre en `verifiedBy`.
5. Solo después de eso, el script de `pnpm content:validate` permitirá que el archivo se mueva a la carpeta final y se haga commit a Git.

---

### 📋 Próximos pasos recomendados

Si estás de acuerdo con este enfoque, puedo proceder a crear:

1. **El script de curación asistida** (`packages/content/scripts/curate.ts`) que ayude a formatear datos crudos pero fuerce la revisión humana de ejemplos y metadatos.
2. **El archivo de esquema Zod** (`packages/validators/src/content.ts`) que definirá estrictamente la estructura del JSON, rechazando cualquier palabra que no tenga `example`, `exampleEs` y `verifiedBy`.
3. **Un archivo de ejemplo real** en `packages/content/levels/a1/week-01-pronouns-and-greetings.json` con 10-15 palabras perfectamente curadas, para que sirva como plantilla dorada ("gold standard") de cómo debe verse el trabajo de un curador.

¿Te parece bien este flujo de trabajo para mantener la calidad alta sin caer en la tentación de importar basura automática? Dime por cuál de los 3 puntos anteriores quieres que empiece a codificar.

Me parece perfecro, de esa manera no perdemos la calidad del contenido ya que sera curado y revisado por un humano.
Empieza con el punto 3 para tener una plantilla dorada de como deve ser el contenido,

# PRD - Sistema de Repetición Espaciada (Spaced Repetition System)

**Versión:** 1.0 | **Última actualización:** 10 de Septiembre de 2026
**Autor:** Sistema de IA Claude | **Propósito:** Implementar algoritmo de aprendizaje adaptativo tipo SM-2 con validación humana

---

## 1. Resumen Ejecutivo

Este documento define los requerimientos funcionales y técnicos para la implementación del sistema de repetición espaciada (SRS) en la aplicación de aprendizaje de idiomas. El sistema utilizará una variante del algoritmo **SuperMemo 2 (SM-2)** adaptado para un entorno moderno de desarrollo de software, con enfoque en calidad de contenido y validación humana.

---

## 2. Objetivos del Producto

1. **Optimizar la retención de vocabulario** mediante repasos programados en intervalos crecientes.
2. **Personalizar el aprendizaje** adaptando la dificultad a la capacidad de cada usuario.
3. **Mantener calidad humana** en el contenido: todas las palabras deben tener ejemplos reales y validados.
4. **Integración seamless** con el monorepo actual (Next.js, TypeScript, Supabase, Vercel).
5. **Escalabilidad** para soportar miles de usuarios y millones de tarjetas.

---

## 3. Arquitectura del Sistema

### Stack Tecnológico

- **Lenguaje**: TypeScript 5.x
- **Framework**: Next.js 14+ (App Router)
- **Base de Datos**: Supabase (PostgreSQL)
- **Estado Global**: Zustand o React Context
- **Algoritmo**: SuperMemo 2 (modificado)
- **Validación**: Esquemas Zod + Curación humana

### Estructura del Monorepo

```
enough-app/
  apps/
    web/                  # Next.js frontend
  packages/
    api/                  # Supabase Edge Functions
    card-engine/          # Lógica del algoritmo (TypeScript)
    content/              # Archivos JSON de niveles/semanas
    ui/                   # Componentes compartidos
    validators/           # Schemas Zod
```

---

## 4. Flujo de Usuario

### 4.1. Nueva Sesión de Estudio

1. **Solicitud**: Usuario inicia sesión y selecciona "Estudiar".
2. **Identificación de tarjetas**: El sistema consulta las tablas `cards`, `card_progress` y `learning_sessions`.
3. **Selección de tarjetas**: Se obtienen:
   - Tarjetas `new` con `dueDate` <= hoy.
   - Tarjetas `learning` con `dueDate` <= hoy.
   - Tarjetas `relearning` con `dueDate` <= hoy.
   - Tarjetas `review` con `dueDate` <= hoy.
   - Tarjetas `dominated` (opcional, según configuración).
4. **Límites diarios**: Se aplican las reglas:
   - `newCardsPerDay = 20` (máximo)
   - `reviewsPerDay = 100` (máximo)
   - Límite de sesiones (2-3 al día)
5. **Presentación**: Se muestran las tarjetas en orden aleatorio.

### 4.2. Interacción con la Tarjeta

1. **Mostar palabra**: Se muestra `frontText` (inglés).
2. **Revelar respuesta**: Al hacer clic en "Show", se revela `backText` (español) y `example`.
3. **Evaluación**: El usuario selecciona una calidad (0-5):
   - **5 - Perfect**: Lo sé perfectamente.
   - **4 - Good**: Lo sé bien, seguro.
   - **3 - Okay**: Lo recuerdo con dificultad.
   - **2 - Hard**: Lo sabía pero me costó.
   - **1 - Doubt**: No lo sabía bien.
   - **0 - Wrong**: Lo olvidé por completo.
4. **Actualización**: El sistema actualiza el estado de la tarjeta.

### 4.3. Fin de Sesión

1. **Cálculo de métricas**: Se calculan horas, palabras, streak, etc.
2. **Guardado**: Se actualiza `learning_sessions` y `user_stats`.
3. **Retroalimentación**: Se muestra pantalla de resumen con estadísticas.

---

## 5. Lógica del Algoritmo (SM-2 Modificado)

### 5.1. Estados de las Tarjetas

- **`new`** (Nueva): Recién agregada, primera vez viendo la palabra.
- **`learning`** (Aprendiendo): En fase inicial de aprendizaje (primeros repasos).
- **`review`** (Repaso): Tarjeta establecida, intervalos crecientes.
- **`relearning`** (Reaprendiendo): Tarjeta olvidada recientemente, necesita refuerzo rápido.
- **`dominated`** (Dominada): Palabras muy conocidas, repasos muy espaciados.

### 5.2. Fases de Aprendizaje

#### Fase 1: Tarjetas Nuevas (New)

- **Criterio**: `state === 'new'`
- **Acción**: Al responder correctamente (Quality 3-5), pasa a `learning` con interval 1 día.
- **Límite**: `newCardsPerDay = 20`

#### Fase 2: Aprendizaje (Learning)

- **Criterio**: `state === 'learning'`
- **Intervalos iniciales**:
  - 1ª respuesta (correcta): 1 día
  - 2ª respuesta (correcta): 6 días
  - 3ª respuesta (correcta): 15 días
  - 4ª respuesta (correcta): 30 días
  - 5ª respuesta (correcta): 60 días
- **Acción**: Si respuesta es correcta, interval crece exponencialmente.
- **Acción**: Si respuesta es incorrecta (0-2), pasa a `relearning`.

#### Fase 3: Repaso (Review)

- **Criterio**: `state === 'review'`
- **Fórmula**:
  `interval = round(previousInterval * ease * learningModifier)`
- **Modifier**: 1.0 si calidad >= 4, 0.5 si calidad = 3
- **Límite superior**: `interval <= MAX_INTERVAL = 365 días`
- **Acción**: Si calidad < 3, pasa a `relearning`.

#### Fase 4: Reaprendizaje (Relearning)

- **Criterio**: `state === 'relearning'` (interval < 3 días)
- **Objetivo**: Refuerzo rápido.
- **Acción**: Intervalo se duplica hasta alcanzar 3 días.
- **Acción**: Al lograr calidad >= 3 por 3 veces consecutivas, vuelve a `review`.

#### Fase 5: Dominadas (Dominated)

- **Criterio**: `interval > DOMINATED_THRESHOLD = 21 días` Y `ease > 2.5`
- **Acción**: Etiquetar como `dominated` pero **no** mostrar frecuentemente (opcional).

### 5.3. Cálculo de Ease

- **`ease = ease + (0.1 - (5 - quality) * 0.08)`**
- **Límites**: `1.3 <= ease <= 2.5`
- **Impacto**: Ease alto → intervalos crecen más rápido.

---

## 6. Esquemas de Base de Datos (Supabase
