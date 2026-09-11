# Fase 09 — Contenido A2, Vocabulario Curado, Pasajes de Lectura e Integración de App (Completada al 100%)

## Resumen Ejecutivo

La **Fase 09: Importación y Curación de Contenido Nivel A2** expandió la base de conocimiento educativo del sistema incorporando el currículo completo de nivel A2 para hispanohablantes conforme al currículo institucional (`a.md` líneas 666–944 y `PLAN DE ESTUDIO.md` línea 862).

Bajo la estricta **Política de Cero IA**, la totalidad de los 734 términos únicos de vocabulario y las lecturas graduadas fueron extraídos y estructurados directamente de los materiales institucionales aprobados, garantizando fidelidad pedagógica y conformidad absoluta con `VocabularyItemSchema` y `ReadingPassageSchema`.

---

## Componentes Desarrollados e Integrados

### 1. Extracción y Deduplicación Curada (`scripts/import-a2-content.cjs`)

- Parser automatizado de las 15 semanas temáticas de A2 desde `a.md`:
  - Semana 1: Compras y devoluciones (65 términos)
  - Semana 2: Viajes: aeropuerto, hotel y emergencias (56 términos)
  - Semana 3: Trabajo y oficina (61 términos)
  - Semana 4: Salud y cuerpo (síntomas y citas médicas) (59 términos)
  - Semana 5: Conectores narrativos para contar historias (48 términos)
  - Semana 6: Expresar opiniones (44 términos)
  - Semana 7: Clima y desastres naturales (34 términos)
  - Semana 8: Educación y estudios superiores (46 términos)
  - Semana 9: Relaciones y emociones complejas (44 términos)
  - Semana 10: Tecnología intermedia: redes y seguridad (39 términos)
  - Semana 11: Cocina y recetas (60 términos)
  - Semana 12: Mantenimiento del hogar y reparaciones (53 términos)
  - Semana 13: Deportes y vida activa (44 términos)
  - Semana 14: Cultura, medios y entretenimiento (44 términos)
  - Semana 15: Personalidad y carácter (48 términos)
- **Deduplicación rigurosa**: 11 términos duplicados dentro de A2 y frente al vocabulario base de A1 fueron filtrados, alcanzando exactamente **734 ítems de vocabulario únicos** (meta oficial del plan de estudio).
- Asignación estricta de partes de la oración (`partOfSpeech`) al enum permitido de Zod (`noun`, `verb`, `adjective`, `adverb`, `preposition`, `conjunction`, `phrasal-verb`).

### 2. Paquete de Contenido A2 (`packages/content/src/a2/`)

- Generación de 15 archivos semanales modulares (`week-01.ts` a `week-15.ts`) con tipado estricto `ContentBlock`.
- Creación de `packages/content/src/a2/index.ts` registrando `a2Content: LevelContent` con sus 15 bloques y total de semanas.
- Actualización de `packages/content/src/index.ts` para exponer `a2Content` y actualizar `getVocabularyForLevel` para abarcar ítems con estados `published` y `approved`.

### 3. Pasajes de Lectura Graduados para A2 (`packages/content/src/passages/a2.ts`)

- Implementación de 3 lecturas graduadas calibradas para A2 con preguntas de comprensión validadas por `ReadingPassageSchema`:
  1. `rdg_a2_001`: _A Weekend Trip to the Beach_ (Semana 2, dificultad 2/5, 96 palabras, referencias léxicas fundacionales A1/A2).
  2. `rdg_a2_002`: _Returning a Damaged Package_ (Semana 1, dificultad 2/5, 78 palabras, compras, logística y reclamos).
  3. `rdg_a2_003`: _A Busy Day at the Office_ (Semana 3, dificultad 3/5, 87 palabras, ambiente laboral y oficina).
- Registro en `packages/content/src/passages/index.ts` en `readingPassagesRegistry.A2`.
- Actualización de `scripts/validate-content.ts` para habilitar referencias léxicas acumulativas (permitiendo a pasajes A2 apoyarse en vocabulario fundacional A1 y A2).

### 4. Integración en la Aplicación Móvil (`apps/app`)

- **Banco de Vocabulario (`apps/app/app/(app)/vocabulary.tsx`)**:
  - Conectado reactivamente a `getVocabularyForLevel(selectedLevel)`.
  - Selector de niveles A1/A2/B1/B2 con soporte activo para explorar los 734 términos de A2 y los 1,514 de A1.
  - Búsqueda bidireccional en inglés y español con paginación fluida de 100 tarjetas y contadores dinámicos.
  - Estado vacío descriptivo para niveles en preparación (B1 y B2).
- **Lectura Contextual (`apps/app/app/(app)/reading.tsx`)**:
  - Selector de niveles interactivo (A1, A2, B1, B2) integrado en cabecera.
  - Carga reactiva de pasajes según el nivel seleccionado con sincronización de tarjetas de vocabulario interactivo y preguntas de comprensión.

---

## Verificaciones y Pruebas Ejecutadas

| Verificación                    | Comando                   | Resultado                                            |
| :------------------------------ | :------------------------ | :--------------------------------------------------- |
| **Validación de Contenido Zod** | `pnpm content:validate`   | ✅ 2,248 ítems de vocabulario, 6 lecturas, 0 errores |
| **Deduplicación Léxica**        | `pnpm content:duplicates` | ✅ 0 duplicados a nivel intra-nivel                  |
| **Integridad de Tipos**         | `pnpm typecheck`          | ✅ 7/7 paquetes exitosos (`turbo run typecheck`)     |
| **Pruebas Unitarias**           | `pnpm test`               | ✅ 80/80 pruebas unitarias aprobadas                 |
| **Linting**                     | `pnpm lint`               | ✅ 0 errores de ESLint en los 7 paquetes             |
| **Formato de Código**           | `pnpm format:check`       | ✅ 100% de archivos en conformidad con Prettier      |

---

## Próximos Pasos (Fase 10)

Proceder con la **Fase 10: Importación de Contenido B1 y B2, Pasajes Avanzados y Consolidación Curricular** según el roadmap del proyecto.
