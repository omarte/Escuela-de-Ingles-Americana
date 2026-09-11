Sí. Tomando como base los documentos que compartiste, **yo mantendría la idea de Turborepo + Expo + Supabase + contenido versionado**, pero haría algunos ajustes para que la aplicación pueda crecer durante años sin depender de IA para el contenido.

Tu proyecto ya tiene una base muy buena: el método A1→B2, vocabulario por semanas, lectura contextual y repetición espaciada. Además, el análisis previo recomienda explícitamente el enfoque de **contenido como código + curaduría humana + “Cero IA” en el vocabulario + offline-first**.

# Mi recomendación tecnológica

## 1. Stack que elegiría

| Capa                     | Tecnología                            | Motivo                                      |
| ------------------------ | ------------------------------------- | ------------------------------------------- |
| 📱 Mobile                | **Expo + React Native + Expo Router** | Android + iOS                               |
| 🌐 Web                   | **Expo Web** inicialmente             | Reutilizar prácticamente toda la aplicación |
| 🎨 UI                    | React Native + NativeWind             | UI consistente                              |
| 🧠 Estado                | Zustand                               | Simple y escalable                          |
| 📦 Datos locales         | SQLite                                | Offline-first                               |
| ☁️ Backend               | **Supabase**                          | PostgreSQL + Auth + Storage + API           |
| 🔐 Seguridad             | Supabase Auth + RLS                   | Usuarios y permisos                         |
| 🧮 SRS                   | TypeScript propio                     | Control total del algoritmo                 |
| 📚 Contenido             | JSON/TypeScript versionado en Git     | Cero IA y trazabilidad                      |
| 🖥️ Panel administración | Expo Web inicialmente                 | Una sola plataforma                         |
| 🏗️ Monorepo             | **Turborepo + pnpm**                  | Compartir código                            |
| 🧪 Testing               | Vitest + React Native Testing Library | Unit/integration                            |
| 🔎 Validación            | Zod                                   | Validar contenido y datos                   |
| 🚀 CI/CD                 | GitHub Actions + EAS                  | Automatización                              |
| 📊 Analytics             | PostHog o similar, opcional           | Métricas de aprendizaje                     |

Expo Router actualmente permite utilizar rutas basadas en archivos para React Native **y web**, por lo que encaja especialmente bien con tu objetivo de una misma aplicación para Android, iOS y navegador. ([Expo documentation][1])

### ¿Por qué no haría Next.js desde el principio?

Tu documento anterior planteaba **Expo + Next.js**, pero yo cambiaría ligeramente esa decisión.

Para el **producto educativo principal**, empezaría con:

> **Expo + React Native + Expo Router → Android + iOS + Web**

Así evitamos construir dos frontends.

Expo actualmente permite exportar la aplicación a web y trabajar con Expo Router para navegación, renderizado estático y SEO. ([Expo documentation][2])

**Más adelante**, si necesitas una web pública muy orientada a SEO:

```text
Web pública / landing / blog
        ↓
      Next.js

Aplicación educativa
        ↓
Expo / React Native / Web
```

Pero no empezaría pagando esa complejidad desde el día 1.

---

# 2. Arquitectura que te recomiendo

La veo así:

```text
                    ┌──────────────────────┐
                    │      MOBILE         │
                    │  iOS + Android      │
                    │      Expo            │
                    └──────────┬───────────┘
                               │
                               │
                    ┌──────────▼───────────┐
                    │         WEB          │
                    │    Expo Web          │
                    └──────────┬───────────┘
                               │
                         Shared Code
                               │
        ┌──────────────────────▼──────────────────────┐
        │                  PACKAGES                    │
        │                                              │
        │  UI   SRS   Content   Types   Validation     │
        └──────────────────────┬──────────────────────┘
                               │
                ┌──────────────▼───────────────┐
                │           SUPABASE            │
                │                               │
                │ PostgreSQL                    │
                │ Auth                          │
                │ Storage                       │
                │ RLS                           │
                │ Edge Functions                │
                └───────────────────────────────┘
```

Supabase es especialmente adecuado aquí porque te proporciona PostgreSQL, Auth, Storage y funciones server-side, mientras que RLS permite controlar qué datos puede consultar o modificar cada alumno. ([Supabase][3])

---

# 3. La decisión más importante: separar CONTENIDO de SOFTWARE

Esto para mí es fundamental.

No quiero que las 5.000, 10.000 o 50.000 palabras terminen mezcladas dentro de la lógica de la aplicación.

Tu proyecto debería tener:

```text
SOFTWARE
   ↓
cómo funciona la aplicación

CONTENIDO
   ↓
qué aprende el alumno
```

Porque el software puede permanecer estable mientras el banco de inglés crece.

Tu documentación ya apunta precisamente hacia esto mediante `packages/content/*.json`.

---

# 4. Estructura de carpetas que recomiendo

Yo empezaría con esta:

```text
english-learning-platform/
│
├── apps/
│   │
│   ├── mobile/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login.tsx
│   │   │   │   └── register.tsx
│   │   │   │
│   │   │   ├── (tabs)/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── study.tsx
│   │   │   │   ├── reading.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   └── profile.tsx
│   │   │   │
│   │   │   ├── study/
│   │   │   │   ├── [sessionId].tsx
│   │   │   │   └── result.tsx
│   │   │   │
│   │   │   └── _layout.tsx
│   │   │
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── store/
│   │   └── app.json
│   │
│   └── web/
│       └── ...
│
├── packages/
│   │
│   ├── content/
│   │   ├── schema/
│   │   │   ├── word.schema.ts
│   │   │   ├── lesson.schema.ts
│   │   │   └── reading.schema.ts
│   │   │
│   │   ├── a1/
│   │   │   ├── week-01.json
│   │   │   ├── week-02.json
│   │   │   └── ...
│   │   │
│   │   ├── a2/
│   │   ├── b1/
│   │   └── b2/
│   │
│   ├── srs/
│   │   ├── algorithm.ts
│   │   ├── scheduler.ts
│   │   ├── states.ts
│   │   └── types.ts
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── WordCard.tsx
│   │   └── ...
│   │
│   ├── types/
│   │   ├── user.ts
│   │   ├── vocabulary.ts
│   │   ├── lesson.ts
│   │   └── progress.ts
│   │
│   ├── validation/
│   │   ├── content.ts
│   │   └── users.ts
│   │
│   ├── database/
│   │   ├── client.ts
│   │   └── types.ts
│   │
│   └── config/
│
├── supabase/
│   ├── migrations/
│   ├── seed/
│   ├── functions/
│   │   ├── sync-progress/
│   │   └── admin-content/
│   │
│   └── tests/
│       └── database/
│
├── scripts/
│   ├── validate-content.ts
│   ├── import-content.ts
│   ├── export-content.ts
│   └── check-duplicates.ts
│
├── docs/
│   ├── architecture/
│   ├── pedagogy/
│   ├── content/
│   ├── database/
│   └── decisions/
│
├── tasks/
│   ├── backlog.md
│   ├── roadmap.md
│   ├── sprint-01.md
│   └── completed/
│
├── .claude/
│   ├── rules/
│   └── commands/
│
├── CLAUDE.md
├── PROJECT.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
└── .gitignore
```

---

# 5. El banco de palabras debe ser independiente

Aquí es donde quiero hacer una modificación importante a tu planteamiento anterior.

**No usaría únicamente JSON como fuente final.**

Usaría este flujo:

```text
             CURADOR HUMANO
                    │
                    ▼
             CSV / Markdown
                    │
                    ▼
          script de validación
                    │
             ┌──────┴──────┐
             │             │
          ERROR           OK
             │             │
             ▼             ▼
          rechazar       JSON
                           │
                           ▼
                       Git
                           │
                    ┌──────┴──────┐
                    │             │
                  Mobile         Web
                    │             │
                    └──────┬──────┘
                           ▼
                       Supabase
```

Esto permite agregar:

```text
word
translation
partOfSpeech
level
week
topic
example
pronunciation
variants
irregularForms
notes
verifiedBy
verifiedAt
source
status
```

Por ejemplo:

```json
{
  "id": "a1-go-001",
  "word": "go",
  "translation": "ir",
  "partOfSpeech": "verb",
  "level": "A1",
  "week": 19,
  "topic": "irregular-verbs",
  "example": "I go to school every day.",
  "irregularForms": {
    "base": "go",
    "past": "went",
    "participle": "gone"
  },
  "verifiedBy": "human",
  "verifiedAt": "2026-09-10",
  "status": "published"
}
```

Y aquí aparece algo muy importante:

## No dependes de IA para crecer

Un profesor/curador puede agregar:

```text
+ 50 palabras
+ 100 palabras
+ 1.000 palabras
+ nuevo tema
+ nuevo nivel
+ nuevos textos
```

sin tocar el código de la aplicación.

---

# 6. Quiero agregar un `content_id` permanente

Esto te va a ahorrar muchos problemas.

Nunca uses simplemente:

```text
week + word
```

como identidad.

Usa:

```text
a1-word-go-v1
```

o mejor:

```text
voc_a1_go_001
```

Así, si posteriormente modificas:

```text
go → ir
```

o cambias el ejemplo, **la palabra sigue siendo la misma entidad**.

Esto es importantísimo para no destruir el historial SRS del alumno.

---

# 7. Base de datos

Yo separaría claramente:

### Contenido

```text
content_words
content_lessons
content_readings
content_levels
content_weeks
content_topics
```

### Usuario

```text
profiles
user_settings
user_progress
user_streaks
```

### SRS

```text
user_cards
review_events
study_sessions
```

### Administración

```text
content_reviews
content_versions
audit_logs
admin_users
```

Una estructura simplificada:

```text
profiles
   │
   ├── user_cards
   │       │
   │       └── content_words
   │
   ├── review_events
   │
   └── study_sessions


content_levels
      │
      └── content_weeks
              │
              ├── content_words
              └── content_readings
```

---

# 8. El SRS debe ser independiente

Esto también lo mantendría de tu propuesta original.

Tu algoritmo actualmente contempla:

```text
new
   ↓
learning
   ↓
review
   ↓
relearning
   ↓
dominated
```

y utiliza intervalos progresivos y Ease Factor.

Yo lo convertiría en un paquete completamente independiente:

```text
packages/srs/
```

De modo que puedas hacer:

```typescript
import { scheduleReview } from "@english/srs";
```

y que funcione igual en:

```text
Android
iOS
Web
tests
backend
```

### Nunca mezclaría SRS con React

Mal:

```text
StudyScreen.tsx
   ├── UI
   ├── Supabase
   ├── algoritmo SRS
   └── estadísticas
```

Bien:

```text
StudyScreen
     ↓
study service
     ↓
SRS engine
     ↓
database
```

---

# 9. Offline-first: para mí es obligatorio

Este proyecto se presta muchísimo a esto.

El alumno debería poder estar en un avión, metro o sin internet y seguir estudiando.

```text
                 INTERNET
                    │
             ┌──────▼──────┐
             │   Supabase   │
             └──────┬──────┘
                    │
                  sync
                    │
             ┌──────▼──────┐
             │ SQLite local│
             └──────┬──────┘
                    │
             ┌──────▼──────┐
             │     APP     │
             └─────────────┘
```

Por ejemplo:

```text
Alumno estudia
      ↓
se guarda localmente
      ↓
review_event
      ↓
sin internet → continúa
      ↓
internet vuelve
      ↓
sincronización
      ↓
Supabase
```

Así el contenido base A1/B2 puede estar incluido en el paquete de la aplicación, mientras que el progreso personal se sincroniza con Supabase.

Esto coincide con la recomendación previa de tu análisis: **offline-first real**, con el banco de palabras empaquetado en la aplicación.

---

# 10. Comprensión lectora: no la trataría como simple vocabulario

Aquí creo que tu aplicación puede diferenciarse bastante.

El método original dice algo fundamental: después de completar el vocabulario, el alumno debe utilizarlo en párrafos completos y no limitarse a memorizar tarjetas.

Por eso crearía:

```text
Reading Engine
```

con:

```text
Reading
 ├── level
 ├── week
 ├── title
 ├── text
 ├── vocabulary
 ├── questions
 ├── answers
 ├── difficulty
 └── verified
```

Y la experiencia:

```text
┌──────────────────────────────┐
│ Week 4                       │
│ Reading                      │
│                              │
│ The house is small...        │
│                              │
│     [Read again]             │
│                              │
│ What does Anna have?         │
│                              │
│ ○ A car                      │
│ ○ A garden                   │
│ ○ A restaurant               │
│                              │
│              [Continue →]    │
└──────────────────────────────┘
```

Sin IA.

Las preguntas pueden ser creadas y verificadas por humanos.

---

# 11. Y aquí introduciría otro concepto: `Comprehension`

No quiero que la aplicación mida únicamente:

```text
Vocabulary: 80%
```

sino:

```text
Vocabulary
Reading
Comprehension
Retention
Consistency
```

Por ejemplo:

```text
A1 — Semana 8

Vocabulary       █████████░ 89%
Reading          ████████░░ 82%
Comprehension    ███████░░░ 74%
Retention        █████████░ 91%
Consistency      ██████████ 96%
```

Eso te permite decirle al alumno:

> "Conoces las palabras, pero necesitas trabajar comprensión."

Es pedagógicamente mucho más interesante.

---

# 12. Cómo ampliar el banco sin IA

Esta sería mi arquitectura definitiva:

```text
                    NUEVA PALABRA
                          │
                          ▼
                   CURADOR HUMANO
                          │
                          ▼
                 Content Proposal
                          │
                          ▼
               VALIDACIÓN AUTOMÁTICA
                          │
             ┌────────────┴────────────┐
             │                         │
           ERROR                       OK
             │                         │
             ▼                         ▼
         corregir                 revisión humana
                                       │
                                       ▼
                                    APPROVED
                                       │
                                       ▼
                                    PUBLISHED
                                       │
                                       ▼
                                  CONTENT JSON
                                       │
                                       ▼
                                     Git
                                       │
                          ┌────────────┴──────────┐
                          ▼                       ▼
                       Mobile                    Web
```

La computadora puede ayudarte con:

* detectar duplicados;
* detectar IDs repetidos;
* comprobar campos obligatorios;
* comprobar que A1 no tenga palabras marcadas B2;
* comprobar referencias rotas;
* comprobar JSON;
* detectar palabras sin traducción;
* detectar lecturas sin preguntas;
* detectar preguntas sin respuestas;
* generar reportes de calidad.

Pero **no genera ni decide el contenido pedagógico**.

Eso mantiene tu regla:

> **IA = herramienta de desarrollo, nunca autoridad pedagógica.**

El documento que analizamos justamente recomienda campos como `verifiedBy`, `verifiedAt` y nivel léxico para la curaduría humana.

---

# 13. `PROJECT.md`

Yo pondría aquí la visión general del proyecto.

```md
# English Learning Platform

## Vision

Plataforma educativa para aprender inglés mediante:

- vocabulario progresivo
- repetición espaciada
- lectura contextual
- comprensión
- progresión A1 → B2

## Principios

1. Content first
2. Human-curated content
3. No AI-generated educational content
4. Offline-first
5. Mobile + Web
6. Accessibility
7. Data ownership
8. Reproducible builds

## Levels

A1
A2
B1
B2

## Core learning loop

Learn → Review → Read → Understand → Repeat → Progress
```

Tu plan pedagógico ya establece A1→B2 y la importancia de avanzar mediante vocabulario + lectura contextual.

---

# 14. `CLAUDE.md`

Este archivo es especialmente importante si vas a desarrollar usando Claude Code.

Yo lo haría bastante estricto.

```md
# CLAUDE.md

## Project

English Learning Platform.

This is an educational application for English learners.

## Core rule

DO NOT generate educational vocabulary or learning content using AI.

AI may be used for:
- software development
- refactoring
- tests
- documentation
- debugging
- infrastructure

AI MUST NOT:
- invent vocabulary
- invent translations
- invent definitions
- assign CEFR levels
- create examples for production content
- approve educational content

All educational content must be human-curated.

## Architecture

Monorepo:
- Expo
- React Native
- Expo Router
- TypeScript
- Supabase
- PostgreSQL
- Turborepo
- pnpm

## Content

Content lives in:

packages/content/

Content must be:
- version controlled
- schema validated
- human verified
- immutable by content ID

Never change a content ID after publication.

## SRS

SRS logic lives in:

packages/srs/

Never implement SRS logic inside UI components.

## Database

All database changes require:
- Supabase migration
- RLS policies
- tests

Never expose service-role credentials to clients.

## Offline

Learning sessions must work offline.

Review events are persisted locally and synchronized later.

## Code rules

- TypeScript strict mode
- No `any` unless explicitly justified
- Prefer small functions
- Prefer pure functions
- No business logic inside UI components
- Validate external data with Zod
- Add tests for business logic

## Before finishing a task

Run:

pnpm lint
pnpm typecheck
pnpm test
pnpm content:validate
```

Y añadiría una regla importantísima:

```md
## NEVER

Never modify production educational content
without an explicit human-approved content change.
```

---

# 15. `.claude/rules/`

Incluso iría un paso más allá.

```text
.claude/
│
├── rules/
│   ├── architecture.md
│   ├── content.md
│   ├── database.md
│   ├── testing.md
│   ├── security.md
│   └── ui.md
│
└── commands/
    ├── validate-content.md
    ├── new-feature.md
    ├── run-tests.md
    └── review.md
```

Esto evita que `CLAUDE.md` se convierta en un documento gigantesco.

---

# 16. Sistema de tareas

No utilizaría una lista gigante de tareas.

Haría:

```text
tasks/
├── roadmap.md
├── backlog.md
│
├── phase-01-foundation/
├── phase-02-auth/
├── phase-03-vocabulary/
├── phase-04-srs/
├── phase-05-reading/
├── phase-06-comprehension/
├── phase-07-offline/
├── phase-08-admin/
├── phase-09-progress/
└── phase-10-production/
```

Y cada tarea:

```md
# TASK-0042 — Implementar WordCard

## Objective

Crear tarjeta de vocabulario reutilizable.

## Requirements

- English word
- Spanish translation
- Example
- Level
- Week
- Reveal interaction

## Acceptance Criteria

- [ ] Works on Android
- [ ] Works on iOS
- [ ] Works on Web
- [ ] Accessible
- [ ] Unit tests
- [ ] No business logic in component

## Dependencies

TASK-0010
TASK-0021

## Status

TODO
```

---

# 17. Roadmap que yo seguiría

No intentaría construir todo de una vez.

### Fase 1 — Foundation

```text
Turborepo
Expo
TypeScript
pnpm
Supabase
CI/CD
ESLint
Prettier
Vitest
```

### Fase 2 — Contenido

```text
Content schema
A1 JSON
A2 JSON
validator
duplicate checker
content IDs
```

Ya tienes una base considerable aquí: el análisis reporta A1 con 1.483 palabras y A2 con 734.

### Fase 3 — Usuario

```text
Register
Login
Profile
Level
Progress
```

### Fase 4 — Flashcards

```text
WordCard
Answer
Again
Hard
Good
Easy
```

### Fase 5 — SRS

```text
new
learning
review
relearning
dominated
```

### Fase 6 — Reading

```text
A1 reading
A2 reading
vocabulary highlighting
```

### Fase 7 — Comprehension

```text
questions
answers
score
progress
```

### Fase 8 — Offline

```text
SQLite
sync queue
conflict resolution
```

### Fase 9 — Admin

```text
content editor
review
approve
publish
versions
```

### Fase 10 — B1/B2

```text
B1
B2
advanced readings
topics
```

Tu documentación actualmente identifica precisamente que B1/B2 necesitan todavía el banco concreto y que también falta construir sistemáticamente las lecturas de A1/A2.

---

# 18. Una decisión que cambiaría respecto al documento anterior

Hay una cosa que **no haría todavía**:

### ❌ No metería todo el contenido pedagógico directamente en Supabase como fuente principal

Prefiero:

```text
Git
 ↓
Content JSON
 ↓
Validation
 ↓
Build
 ↓
App
```

y Supabase para:

```text
usuarios
progreso
SRS
sesiones
estadísticas
sincronización
administración
```

Es decir:

```text
             CONTENT
               │
               ▼
             Git
               │
               ▼
        ┌──────────────┐
        │    APP       │
        └──────────────┘

             USER DATA
               │
               ▼
           Supabase
```

Eso te da **control histórico absoluto del contenido**.

---

# 19. Seguridad

En Supabase yo impondría RLS desde el primer día.

Por ejemplo:

```text
student A
   ↓
solo puede ver/modificar
   ↓
sus propios:
- progress
- cards
- reviews
- sessions
```

No confiaría solamente en que el frontend filtre los datos.

Supabase recomienda habilitar RLS para las tablas expuestas y definir políticas específicas por operación; además, las credenciales `service_role` deben permanecer exclusivamente del lado servidor. ([Supabase][4])

---

# 20. Mi stack definitivo

Si hoy tuviera que iniciar este proyecto desde cero, elegiría:

```text
┌──────────────────────────────────────────┐
│              FRONTEND                    │
│                                          │
│ React Native                             │
│ Expo                                     │
│ Expo Router                              │
│ TypeScript                               │
│ NativeWind                               │
│ Zustand                                  │
│                                          │
│ Android + iOS + Web                      │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│              SHARED                      │
│                                          │
│ @app/content                             │
│ @app/srs                                 │
│ @app/ui                                  │
│ @app/types                               │
│ @app/validation                          │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│              BACKEND                     │
│                                          │
│ Supabase                                 │
│ PostgreSQL                               │
│ Auth                                     │
│ RLS                                      │
│ Storage                                  │
│ Edge Functions                           │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│              CONTENT                     │
│                                          │
│ JSON                                     │
│ Git                                      │
│ Human curated                            │
│ Schema validated                         │
│ Versioned                                │
│ No AI-generated educational content      │
└──────────────────────────────────────────┘
```

Y Supabase Edge Functions pueden encargarse de lógica server-side puntual cuando realmente haga falta, manteniendo TypeScript como lenguaje común. ([Supabase][5])

## En resumen

**Mi recomendación es NO construir simplemente "una app de flashcards".**

Construiría un **motor educativo modular**:

```text
                 ENGLISH LEARNING ENGINE
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
   Vocabulary           Reading         Comprehension
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ▼
                         SRS
                          │
                          ▼
                       Progress
                          │
                          ▼
                    Student Profile
```

Y la gran ventaja es que mañana puedes pasar de:

```text
2.217 palabras
```

a:

```text
5.000
10.000
20.000
50.000
```

sin reescribir la aplicación. El contenido simplemente continúa creciendo mediante el proceso de **curaduría humana → validación → versionado → publicación**.

Además, tu propio material ya plantea que B1 y B2 deben ampliar el vocabulario hacia noticias, argumentación, vocabulario académico y posteriormente vocabulario abstracto/técnico.

**Ese es el punto que yo convertiría en el principio arquitectónico central del proyecto: el software debe ser estable; el conocimiento debe poder crecer indefinidamente.**

[1]: https://docs.expo.dev/versions/latest/sdk/router/?utm_source=chatgpt.com "Router - Expo Documentation"
[2]: https://docs.expo.dev/workflow/web/?utm_source=chatgpt.com "Develop websites with Expo - Expo Documentation"
[3]: https://supabase.com/docs?utm_source=chatgpt.com "Supabase Docs"
[4]: https://supabase.com/docs/guides/database/postgres/row-level-security?utm_source=chatgpt.com "Row Level Security | Supabase Docs"
[5]: https://supabase.com/docs/guides/functions/quickstart?utm_source=chatgpt.com "Getting Started with Edge Functions | Supabase Docs"

Sí. Te recomiendo darle a Claude un **prompt inicial muy controlado**, para que primero construya la arquitectura y no empiece a inventar funcionalidades o contenido educativo.

Puedes copiar y pegar este prompt directamente en Claude Code:

# PROMPT — Inicialización del proyecto English Learning Platform

Quiero que inicialices desde cero la estructura de un proyecto llamado **English Learning Platform**, una aplicación educativa para aprender inglés disponible en:

* Android
* iOS
* Web

El objetivo principal de esta primera etapa NO es desarrollar todas las funcionalidades, sino **crear una arquitectura sólida, escalable y mantenible sobre la cual podamos construir el producto posteriormente**.

## 1. Stack tecnológico obligatorio

Utiliza:

* TypeScript
* React Native
* Expo
* Expo Router
* Expo Web
* pnpm
* Turborepo
* Supabase
* PostgreSQL
* Zustand
* SQLite para almacenamiento local/offline
* Zod para validación
* Vitest para tests
* React Native Testing Library
* ESLint
* Prettier
* GitHub Actions

La aplicación debe utilizar una arquitectura monorepo.

## 2. Arquitectura principal

Crear esta estructura inicial:

```text
english-learning-platform/
│
├── apps/
│   └── app/
│       ├── app/
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   ├── (auth)/
│       │   ├── (app)/
│       │   └── settings/
│       │
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── store/
│       ├── db/
│       ├── constants/
│       └── types/
│
├── packages/
│   ├── content/
│   │   ├── schema/
│   │   ├── levels/
│   │   │   ├── a1/
│   │   │   ├── a2/
│   │   │   ├── b1/
│   │   │   └── b2/
│   │   ├── readings/
│   │   └── index.ts
│   │
│   ├── srs/
│   │   ├── src/
│   │   └── tests/
│   │
│   ├── types/
│   │   └── src/
│   │
│   ├── validation/
│   │   └── src/
│   │
│   ├── ui/
│   │   └── src/
│   │
│   ├── database/
│   │   └── src/
│   │
│   └── config/
│
├── supabase/
│   ├── migrations/
│   ├── seed/
│   ├── functions/
│   └── tests/
│
├── scripts/
│   ├── validate-content.ts
│   ├── check-duplicates.ts
│   ├── import-content.ts
│   └── export-content.ts
│
├── docs/
│   ├── architecture/
│   ├── content/
│   ├── database/
│   └── product/
│
├── tasks/
│   ├── roadmap.md
│   ├── backlog.md
│   └── phase-01-foundation/
│
├── .claude/
│   ├── rules/
│   └── commands/
│
├── CLAUDE.md
├── PROJECT.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
├── .gitignore
├── .env.example
└── .prettierrc
```

Puedes adaptar pequeños detalles de la estructura si alguna decisión técnica lo requiere, pero debes mantener la separación entre:

1. Aplicación
2. Contenido educativo
3. Lógica SRS
4. Tipos
5. Validación
6. Base de datos
7. Infraestructura
8. Documentación
9. Tasks

---

# 3. PRINCIPIO FUNDAMENTAL DEL PROYECTO

Este proyecto debe estar diseñado como un **English Learning Engine**, no como una simple aplicación de flashcards.

La arquitectura debe permitir evolucionar hacia:

```text
Vocabulary
    ↓
Learning
    ↓
Spaced Repetition
    ↓
Reading
    ↓
Comprehension
    ↓
Retention
    ↓
Progress
```

El sistema debe poder crecer desde aproximadamente:

```text
A1 → A2 → B1 → B2
```

hasta miles o decenas de miles de palabras y lecciones sin tener que modificar la arquitectura principal de la aplicación.

---

# 4. REGLA CRÍTICA: NO IA PARA CONTENIDO EDUCATIVO

Esta es una regla de arquitectura y producto.

## PROHIBIDO

La inteligencia artificial NO debe utilizarse para generar automáticamente contenido educativo de producción.

No utilizar IA para:

* crear palabras
* crear traducciones
* crear definiciones
* determinar niveles CEFR
* crear ejemplos educativos
* crear lecturas
* crear preguntas de comprensión
* aprobar contenido
* clasificar contenido
* modificar contenido pedagógico automáticamente

Todo el contenido educativo de producción debe ser:

```text
Human curated
        ↓
Validated
        ↓
Human reviewed
        ↓
Approved
        ↓
Published
```

La IA sí puede utilizarse durante el desarrollo del software para:

* escribir código
* refactorizar
* crear tests
* documentación técnica
* debugging
* revisar arquitectura
* automatización de desarrollo

Pero nunca debe convertirse en una fuente automática de contenido educativo de producción.

Esta regla debe aparecer explícitamente en:

* `CLAUDE.md`
* `PROJECT.md`
* reglas de `.claude/rules/content.md`
* documentación de arquitectura

---

# 5. SISTEMA DE CONTENIDO

El contenido educativo debe estar separado del código de la aplicación.

La aplicación debe poder consumir contenido estructurado como:

```text
packages/content/
```

El contenido debe ser versionado mediante Git.

Cada elemento educativo debe tener un ID permanente.

Ejemplo:

```text
voc_a1_go_001
voc_a1_house_002
voc_a2_environment_001
```

Una vez publicado un ID, NO debe cambiarse.

Esto es importante porque posteriormente el sistema SRS tendrá referencias a esos IDs.

---

# 6. Modelo inicial de Vocabulary

Crear los tipos y schemas necesarios para representar una palabra.

Como mínimo:

```ts
interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  partOfSpeech: string;
  level: CEFRLevel;
  week: number;
  topic: string;
  example: string;
  pronunciation?: string;
  variants?: string[];
  irregularForms?: Record<string, string>;
  notes?: string;
  verifiedBy: string;
  verifiedAt: string;
  source?: string;
  status: ContentStatus;
}
```

Crear los enums/tipos necesarios para:

```text
A1
A2
B1
B2
```

y estados:

```text
draft
review
approved
published
deprecated
```

Utilizar Zod para validar el contenido.

---

# 7. CONTENIDO NO DEBE ESTAR HARDCODED EN LA UI

No quiero algo como:

```tsx
const words = [
  "house",
  "car",
  "book"
];
```

dentro de componentes React.

La UI debe consumir contenido mediante una capa de dominio/repository.

Ejemplo conceptual:

```text
UI
 ↓
Content Repository
 ↓
Content Package
 ↓
Validated Content
```

Esto permitirá cambiar la fuente de contenido posteriormente sin modificar la UI.

---

# 8. SRS

Crear `packages/srs`.

La lógica de Spaced Repetition debe ser:

* independiente de React
* independiente de Expo
* independiente de Supabase
* fácilmente testeable
* basada en funciones puras cuando sea posible

Estados iniciales:

```text
new
learning
review
relearning
dominated
```

No implementar todavía un sistema complejo si no es necesario.

Crear solamente:

* tipos
* interfaces
* funciones base
* tests
* documentación

La lógica SRS nunca debe vivir dentro de componentes visuales.

---

# 9. DATABASE

Preparar Supabase/PostgreSQL.

Separar conceptualmente:

## Content

```text
content_levels
content_topics
content_words
content_lessons
content_readings
content_versions
```

## User

```text
profiles
user_settings
user_progress
user_streaks
```

## SRS

```text
user_cards
review_events
study_sessions
```

## Admin / governance

```text
content_reviews
audit_logs
admin_users
```

No es necesario implementar toda la lógica todavía.

Crear solamente la base arquitectónica, tipos, migraciones iniciales y documentación necesaria.

---

# 10. SEGURIDAD

Supabase debe utilizar:

* Authentication
* PostgreSQL
* Row Level Security

Nunca exponer credenciales de service role en la aplicación cliente.

Crear `.env.example`.

Nunca incluir secretos reales en Git.

---

# 11. OFFLINE FIRST

El aprendizaje debe poder funcionar sin conexión.

Arquitectura objetivo:

```text
React Native
      ↓
Local SQLite
      ↓
Learning Session
      ↓
Review Events
      ↓
Sync
      ↓
Supabase
```

En esta primera etapa no es necesario implementar toda la sincronización.

Pero la arquitectura debe estar preparada para ello.

---

# 12. UI

Crear una base mínima de navegación utilizando Expo Router.

Debe existir una estructura preparada para:

```text
/auth
/app
/settings
```

Dentro de `(app)` preparar conceptualmente:

```text
home
learn
vocabulary
reading
progress
profile
```

No desarrollar todavía todas las pantallas.

Crear únicamente placeholders limpios y funcionales.

---

# 13. TESTING

Preparar:

* Vitest
* React Native Testing Library

Los primeros tests deben comprobar:

1. validación del contenido
2. IDs válidos
3. detección de duplicados
4. funcionamiento básico del paquete SRS
5. imports de packages
6. configuración básica del proyecto

---

# 14. CONTENT VALIDATION

Crear scripts:

```text
pnpm content:validate
pnpm content:duplicates
```

El sistema debe detectar:

* IDs duplicados
* palabras duplicadas cuando corresponda
* campos obligatorios ausentes
* niveles inválidos
* estados inválidos
* semanas inválidas
* contenido no verificado
* referencias rotas

La validación debe ejecutarse automáticamente en CI.

---

# 15. CLAUDE.md

Crear un `CLAUDE.md` completo para que futuros agentes de IA entiendan las reglas del proyecto.

Debe incluir especialmente:

```text
DO NOT generate educational content using AI.

DO NOT modify production educational content without explicit
human approval.

Keep educational content separated from application code.

Keep SRS logic separated from UI.

Use TypeScript strict mode.

Prefer pure functions.

Validate external data with Zod.

Database changes require migrations.

RLS is mandatory for user-owned data.

Never expose Supabase service-role credentials.

Offline learning is a core architectural requirement.
```

---

# 16. DOCUMENTACIÓN

Crear:

```text
README.md
PROJECT.md
docs/architecture/overview.md
docs/content/content-model.md
docs/content/content-workflow.md
docs/database/database-model.md
```

La documentación debe explicar claramente:

* qué es el proyecto
* arquitectura
* separación software/contenido
* flujo de contenido
* SRS
* offline-first
* base de datos
* reglas de desarrollo

---

# 17. TASKS

Crear un roadmap inicial.

Fases:

```text
Phase 01 — Foundation
Phase 02 — Authentication
Phase 03 — Vocabulary
Phase 04 — SRS
Phase 05 — Reading
Phase 06 — Comprehension
Phase 07 — Offline
Phase 08 — Admin Content
Phase 09 — Progress
Phase 10 — Production
```

Cada task debe incluir:

```text
Objective
Requirements
Acceptance Criteria
Dependencies
Status
```

En esta primera ejecución solamente preparar las tasks de Foundation y dejar las demás como roadmap/backlog.

---

# 18. REGLAS DE DESARROLLO

Crear:

```text
.claude/rules/architecture.md
.claude/rules/content.md
.claude/rules/database.md
.claude/rules/testing.md
.claude/rules/security.md
.claude/rules/ui.md
```

Estas reglas deben ser concretas y accionables.

---

# 19. GIT

Crear un `.gitignore` correcto para:

* Node
* Expo
* React Native
* macOS
* Windows
* VS Code
* environment files
* build artifacts

Crear también:

```text
.env.example
```

Nunca crear `.env` con secretos reales.

---

# 20. CALIDAD DEL CÓDIGO

Configurar:

```text
TypeScript strict
ESLint
Prettier
Vitest
```

Evitar:

```ts
any
```

salvo que exista una justificación explícita.

Preferir:

* funciones pequeñas
* composición
* tipos explícitos
* separación de responsabilidades
* dependency inversion cuando sea útil
* código testeable
* lógica de negocio independiente de UI

---

# 21. IMPORTANTE: NO SOBREDESARROLLAR

En esta primera tarea NO quiero:

* sistema completo de autenticación
* sistema completo SRS
* dashboard complejo
* diseño visual definitivo
* gamificación
* pagos
* notificaciones
* IA
* generación automática de contenido
* sistema administrativo completo

Primero quiero una **foundation sólida**.

---

# 22. ORDEN DE EJECUCIÓN

Trabaja en este orden:

### Paso 1

Analiza la arquitectura.

### Paso 2

Crea el monorepo.

### Paso 3

Configura pnpm + Turborepo.

### Paso 4

Configura Expo + React Native + Expo Router.

### Paso 5

Configura TypeScript.

### Paso 6

Configura ESLint + Prettier.

### Paso 7

Crea los packages.

### Paso 8

Crea schemas de contenido.

### Paso 9

Crea paquete SRS base.

### Paso 10

Crea configuración Supabase.

### Paso 11

Crea documentación.

### Paso 12

Crea `.claude/rules`.

### Paso 13

Crea `CLAUDE.md`.

### Paso 14

Crea tasks de Foundation.

### Paso 15

Configura tests.

### Paso 16

Configura GitHub Actions.

### Paso 17

Ejecuta las validaciones.

---

# 23. CRITERIO DE FINALIZACIÓN

No consideres terminada esta tarea hasta que:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm content:validate
```

funcionen correctamente.

Si alguno falla, corrígelo antes de terminar.

---

# 24. REGLA FINAL

Antes de crear código nuevo, comprueba si la funcionalidad pertenece a:

```text
apps/
packages/content/
packages/srs/
packages/types/
packages/validation/
packages/database/
supabase/
scripts/
```

No mezcles responsabilidades.

La prioridad de esta primera etapa es:

```text
Arquitectura > mantenibilidad > escalabilidad > seguridad > funcionalidad
```

No sacrifiques la arquitectura por implementar rápidamente funcionalidades.

Al terminar:

1. muestra el árbol final de archivos
2. explica brevemente las decisiones arquitectónicas
3. muestra los comandos disponibles
4. muestra qué quedó implementado
5. muestra qué quedó pendiente
6. indica cualquier decisión que requiera aprobación humana

No generes contenido educativo real durante esta tarea.

**Consejo:** este prompt está pensado para que Claude haga la **Phase 01 — Foundation** y no intente construir toda la aplicación de golpe. Después podemos darle prompts independientes para `Vocabulary`, `SRS`, `Reading`, `Offline`, etc., reduciendo bastante el riesgo de que la arquitectura se degrade.
