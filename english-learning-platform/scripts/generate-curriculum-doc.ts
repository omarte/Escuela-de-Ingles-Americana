import fs from 'node:fs'
import path from 'node:path'
import {
  contentRegistry,
  readingPassagesRegistry,
} from '../packages/content/src/index'
import type { CEFRLevel } from '../packages/types/src/index'

const archiveDir = path.resolve(__dirname, '../../docs/archive/primer-lote-2026-09')
const grammarB1Path = path.join(archiveDir, 'grammar_b1.json')
const writingB2Path = path.join(archiveDir, 'writing_prompts_b2.json')

let grammarB1: any[] = []
if (fs.existsSync(grammarB1Path)) {
  grammarB1 = JSON.parse(fs.readFileSync(grammarB1Path, 'utf-8'))
}

let writingB2: any[] = []
if (fs.existsSync(writingB2Path)) {
  writingB2 = JSON.parse(fs.readFileSync(writingB2Path, 'utf-8'))
}

const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2']

const totalVocab = levels.reduce(
  (sum, lvl) => sum + contentRegistry[lvl].blocks.reduce((bSum, b) => bSum + b.vocabulary.length, 0),
  0
)

const totalReadings = levels.reduce((sum, lvl) => sum + (readingPassagesRegistry[lvl]?.length || 0), 0)

const lines: string[] = []

lines.push('# Dossier Curricular Completo (A1, A2, B1, B2)')
lines.push('### Escuela de Inglés Americana • Revisión y Verificación Docente')
lines.push('')
lines.push('> **Propósito:** Documento unificado de auditoría curricular para el cuerpo docente y comité académico. Contiene el inventario exhaustivo de vocabulario estructurado por semana, fonética nativa, oraciones contextuales bilingües, lecturas con comprensión, ejercicios de gramática aplicada y prompts de producción escrita con rúbrica pedagógica.')
lines.push('')
lines.push('---')
lines.push('')
lines.push('## 📊 Ficha Técnica del Currículo')
lines.push('')
lines.push('| Métrica | Valor | Descripción pedagógica |')
lines.push('|---|---|---|')
lines.push(`| **Marco Pedagógico** | MCER / CEFR | Niveles A1 (Acceso), A2 (Plataforma), B1 (Umbral), B2 (Avanzado) |`)
lines.push(`| **Vocabulario Total** | **${totalVocab.toLocaleString()} palabras** | Enriquecidas con IPA, categoría gramatical, traducción y ejemplo contextual |`)
lines.push(`| - Nivel A1 | ${contentRegistry['A1'].blocks.reduce((s, b) => s + b.vocabulary.length, 0)} palabras | 19 semanas temáticas (comunicación básica y supervivencia cotidiana) |`)
lines.push(`| - Nivel A2 | ${contentRegistry['A2'].blocks.reduce((s, b) => s + b.vocabulary.length, 0)} palabras | 15 semanas temáticas (descripciones, rutinas, pasado, viajes y trabajo) |`)
lines.push(`| - Nivel B1 | ${contentRegistry['B1'].blocks.reduce((s, b) => s + b.vocabulary.length, 0)} palabras | 9 semanas temáticas (opiniones, cultura, relaciones complejas y vida laboral) |`)
lines.push(`| - Nivel B2 | ${contentRegistry['B2'].blocks.reduce((s, b) => s + b.vocabulary.length, 0)} palabras | 5 semanas temáticas (negocios, debate formal, academia y liderazgo) |`)
lines.push(`| **Lecturas Contextuales** | **${totalReadings} lecturas** | Textos graduados con preguntas de opción múltiple y vocabulario enlazado |`)
lines.push(`| **Ejercicios de Gramática B1** | **${grammarB1.length} ejercicios** | 15 temas de gramática aplicada con huecos (*Fill in the blanks*) y explicación |`)
lines.push(`| **Prompts de Escritura B2** | **${writingB2.length} tareas** | Tareas de producción libre con rúbrica de evaluación docente (120-200 palabras) |`)
lines.push(`| **Algoritmo de Retención** | SuperMemo SM-2 | Repetición espaciada adaptativa según la curva del olvido |`)
lines.push(`| **Modelo de Contenido** | 100% Curaduría Humana | Sin generación sintética; supervisado para hispanohablantes |`)
lines.push('')
lines.push('---')
lines.push('')
lines.push('## 🎓 Principios Pedagógicos y Reglas de Curaduría (Single Source of Truth)')
lines.push('')
lines.push('### 1. Principio Rector: La Regla Inquebrantable del Léxico Acumulativo ($i+1$)')
lines.push('> **Política de Curaduría:** Ninguna lectura, micro-examen o ejemplo puede contener vocabulario que no haya sido introducido formalmente en la semana actual o en semanas anteriores.')
lines.push('')
lines.push('- **Semana $N$** solo puede usar vocabulario curricular de las **Semanas $1$ a $N$**.')
lines.push('- **Cero Excepciones:** Introducir palabras "del futuro" (ej. usar *dog* en la Semana 1 cuando se enseña en la Semana 10) genera el *Choque Nivel Cero* y destruye la autoeficacia del estudiante.')
lines.push('- **Guardia Automatizado:** Todo el contenido debe pasar el script `pnpm validate:cumulative` antes de integrarse. Si el script falla, el merge es rechazado automáticamente por el CI.')
lines.push('')
lines.push('### 2. Reubicación Oficial y Cronograma de Lecturas Contextuales')
lines.push('Para cumplir con la regla $i+1$ sin reescribir textos pedagógicos ya validados, las siguientes lecturas han sido asignadas a las semanas donde **el 100% de su vocabulario ya fue enseñado**:')
lines.push('')
lines.push('| ID de Lectura | Título | Nivel | Semana Original | **Semana Oficial Actual** | Vocabulario Límite que Determina la Semana |')
lines.push('| :--- | :--- | :---: | :---: | :---: | :--- |')
lines.push('| `rdg_a1_001` | My Daily Routine and Family | A1 | 1 | **10** | `dog` (Sem. 10), `wake up` (Sem. 8), `chicken/milk/rice` (Sem. 6) |')
lines.push('| `rdg_a1_002` | A Morning in the City | A1 | 9 | **12** | `bus` (Sem. 12), `doctor` (Sem. 11), `nature` (Sem. 10) |')
lines.push('| `rdg_a1_003` | Shopping at the Supermarket | A1 | 6 | **11** | `cashier` (Sem. 11), `supermarket` (Sem. 9) |')
lines.push('| `rdg_b2_001` | The Ethical Dilemma of Advanced AI | B2 | 1 | **5** | `scrutinise`, `ethical`, `unprecedented` (Sem. 5), `automation` (Sem. 3) |')
lines.push('| `rdg_b2_002` | Strategic Leadership in Mergers | B2 | 2 | **5** | `leadership`, `strategy`, `merger`, `compliance` (Sem. 5) |')
lines.push('')
lines.push('*(Nota pedagógica: Las preguntas de comprensión de lectura en las semanas iniciales de A1 deben contar con andamiaje bilingüe para evitar fricción con auxiliares interrogativos no enseñados aún).*')
lines.push('')
lines.push('### 3. Dinámicas Cognitivas Integradas en la Plataforma')
lines.push('Cada unidad lectiva se entrega a través de 4 fases cognitivas estructuradas:')
lines.push('')
lines.push('1. **Pre-Flight Warm-Up (1-2 min):** Activación de 5 a 8 palabras de la semana anterior antes de desbloquear nuevo contenido léxico.')
lines.push('2. **Sesión SRS con Telemetría Cognitiva:** El algoritmo SM-2 registra `latency_ms`. Si la respuesta tarda $> 7000$ ms, se detecta *fricción oculta* y la calidad efectiva se degrada a un máximo de 3 para programar un repaso más cercano.')
lines.push('3. **Bucle de Fijación Inmediata (Hot Re-injection):** Si una palabra presenta fallo (`quality < 3`) o fricción (`latency > 7s`), el sistema la re-inserta 2 posiciones adelante en la sesión activa para consolidarla en memoria operativa.')
lines.push('4. **Micro-Examen Contextual (Cloze):** Al completar la sesión, el alumno resuelve un micro-reto Cloze de 1 pregunta usando oraciones curadas de `@elp/content` con distractores deterministas del mismo nivel y categoría gramatical. **Cero IA sintética**.')
lines.push('5. **Feedback del Mentor Sincero:** Micro-encuesta de 1 tap post-sesión (`👍 Fácil`, `💡 Normal`, `⚠️ Me costó`) combinada con resumen transparente de palabras con fricción.')
lines.push('')
lines.push('### 4. Protocolo de "Modo Rescate" (Anti-Abandono)')
lines.push('- **Gatillo:** Si un alumno acumula **> 30 tarjetas pendientes de repaso**, el sistema oculta el contador abrumador.')
lines.push('- **Interfaz:** Muestra el banner *"🛡️ Modo Rescate activo: Sesión enfocada · Solo 10 palabras · Sin presión"*.')
lines.push('- **Priorización:** El motor selecciona exclusivamente las 10 tarjetas con menor factor de facilidad (`easeFactor`) para restaurar la confianza del estudiante de manera rápida.')
lines.push('')
lines.push('### 5. Telemetría Docente: El "Mapa de Calor" de Fricción')
lines.push('El equipo de curaduría curricular debe evaluar periódicamente la telemetría agregada de la plataforma:')
lines.push('')
lines.push('- **Métrica Clave:** `latency_ms > 7000` o `friction_flagged = true`.')
lines.push('- **Protocolo de Acción (Regla del 30%):** Si un término o reactivo supera el **30% de tasa de fricción** en los estudiantes:')
lines.push('  1. **Principio ético docente:** Jamás culpar al estudiante ni asumir desatención.')
lines.push('  2. **Auditoría del reactivo:** Verificar si la acepción en español es ambigua, si el audio fonético genera confusión, o si el ejemplo contextual utiliza estructuras complejas.')
lines.push('  3. **Ajuste curricular:** Refinar la traducción, el ejemplo o los distractores directamente en el archivo `week-XX.ts` y sincronizar la base de datos.')
lines.push('')
lines.push('---')
lines.push('')

// Detailed level loops
for (const lvl of levels) {
  const levelData = contentRegistry[lvl]
  const passages = readingPassagesRegistry[lvl] || []

  lines.push(`## 📘 Nivel ${lvl} (${lvl === 'A1' ? 'Principiante · Breakthrough' : lvl === 'A2' ? 'Elemental · Waystage' : lvl === 'B1' ? 'Intermedio · Threshold' : 'Intermedio Alto · Vantage'})`)
  lines.push('')

  const levelVocabCount = levelData.blocks.reduce((s, b) => s + b.vocabulary.length, 0)
  lines.push(`- **Semanas lectivas:** ${levelData.blocks.length} semanas`)
  lines.push(`- **Total vocabulario:** ${levelVocabCount} palabras`)
  lines.push(`- **Lecturas integradas:** ${passages.length} textos con evaluación`)
  lines.push('')

  // Weeks loop
  for (const block of levelData.blocks) {
    lines.push(`### Semana ${block.week}: ${block.topic}`)
    if (block.description) {
      lines.push(`*${block.description}*`)
      lines.push('')
    }
    lines.push(`Total de palabras en esta semana: **${block.vocabulary.length}**`)
    lines.push('')
    lines.push('| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |')
    lines.push('|---|---|---|---|---|---|---|')

    for (const v of block.vocabulary) {
      const cleanExample = (v.example || '').replace(/\|/g, '/')
      const cleanTrans = (v.exampleTranslation || '').replace(/\|/g, '/')
      const cleanEs = (v.translation || '').replace(/\|/g, '/')
      const cleanPron = v.pronunciation ? `\`${v.pronunciation}\`` : '—'
      lines.push(`| \`${v.id}\` | **${v.word}** | *${v.partOfSpeech}* | ${cleanPron} | ${cleanEs || '—'} | ${cleanExample || '—'} | ${cleanTrans || '—'} |`)
    }
    lines.push('')
  }

  // Reading Passages
  if (passages.length > 0) {
    lines.push(`### 📖 Lecturas de Comprensión · Nivel ${lvl}`)
    lines.push('')
    for (const p of passages) {
      lines.push(`#### ${p.title} (\`${p.id}\`)`)
      lines.push(`- **Nivel:** ${p.level} • **Semana Asignada:** Semana ${p.week} • **Dificultad:** ${p.difficulty}/5`)
      if (p.vocabularyIds && p.vocabularyIds.length > 0) {
        lines.push(`- **Vocabulario Enlazado (${p.vocabularyIds.length} términos):** ${p.vocabularyIds.map((id) => `\`${id}\``).join(', ')}`)
      }
      lines.push('')
      lines.push('**Texto en Inglés:**')
      lines.push('> ' + (p.text || '').replace(/\n/g, '\n> '))
      lines.push('')
      if (p.translation) {
        lines.push('**Traducción al Español:**')
        lines.push('> *' + p.translation.replace(/\n/g, '\n> *') + '*')
        lines.push('')
      }
      if (p.comprehensionQuestions && p.comprehensionQuestions.length > 0) {
        lines.push('**Preguntas de Comprensión:**')
        p.comprehensionQuestions.forEach((q, qIdx) => {
          lines.push(`${qIdx + 1}. **${q.question}**`)
          q.options.forEach((opt, oIdx) => {
            const isCorrect = oIdx === (q as any).correctOptionIndex || oIdx === (q as any).correctAnswer
            lines.push(`   - ${isCorrect ? '✅ ' : '▫️ '}${opt}`)
          })
          if (q.explanation) {
            lines.push(`   *Explicación:* ${q.explanation}`)
          }
          lines.push('')
        })
      }
    }
  }

  // If B1, append grammar
  if (lvl === 'B1' && grammarB1.length > 0) {
    lines.push('### ✍️ Banco de Gramática Aplicada B1 (Fill in the Blank)')
    lines.push('')
    lines.push('Este banco evalúa la precisión morfosintáctica en oraciones contextualizadas con pistas gramaticales y explicación en español.')
    lines.push('')
    lines.push('| ID | Tema Gramatical | Oración / Prompt | Traducción / Pista | Respuesta Correcta | Explicación Pedagógica |')
    lines.push('|---|---|---|---|---|---|')
    for (const g of grammarB1) {
      const cleanPrompt = (g.prompt || '').replace(/\|/g, '/')
      const cleanTrans = (g.promptTranslation || g.hint || '').replace(/\|/g, '/')
      const altStr = g.acceptedAlternatives && g.acceptedAlternatives.length > 0 ? ` *(alt: ${g.acceptedAlternatives.join(', ')})*` : ''
      lines.push(`| \`${g.id}\` | **${g.topic}** | ${cleanPrompt} | ${cleanTrans} | **${g.correctAnswer}${altStr}** | ${g.explanation} |`)
    }
    lines.push('')
  }

  // If B2, append writing prompts
  if (lvl === 'B2' && writingB2.length > 0) {
    lines.push('### 📝 Prompts de Expresión Escrita B2 (Writing Prompts)')
    lines.push('')
    lines.push('Tareas de producción textual libre con requerimientos de extensión (120-200 palabras) y rúbrica docente para retroalimentación.')
    lines.push('')
    for (const w of writingB2) {
      lines.push(`#### ${w.topic} (\`${w.id}\`)`)
      lines.push(`- **Tipo de texto:** *${w.type}*`)
      lines.push(`- **Extensión requerida:** ${w.minWords} – ${w.maxWords} palabras`)
      lines.push(`- **Gramática objetivo:** ${w.targetGrammar.join(', ')}`)
      lines.push(`**Instrucciones para el estudiante:**`)
      lines.push(`> ${w.instructions}`)
      lines.push('')
      if (w.topicTranslation) {
        lines.push(`*Traducción del tema:* ${w.topicTranslation}`)
        lines.push('')
      }
      if (w.rubricForTutor && w.rubricForTutor.length > 0) {
        lines.push(`**Criterios de Evaluación Docente / Rúbrica:**`)
        w.rubricForTutor.forEach((r: string) => {
          lines.push(`- 📌 ${r}`)
        })
        lines.push('')
      }
    }
  }

  lines.push('---')
  lines.push('')
}

// Final Teacher Sign-off section
lines.push('## ✍️ Hoja de Verificación y Aprobación Docente')
lines.push('')
lines.push('El cuerpo docente certifica que los contenidos aquí descritos han sido revisados en cuanto a:')
lines.push('1. **Pertinencia de nivel CEFR:** El léxico y las estructuras gramaticales corresponden fielmente a los descriptores oficiales de A1, A2, B1 y B2.')
lines.push('2. **Calidad de traducción:** Las acepciones al español reflejan el uso auténtico y funcional que un hispanohablante requiere.')
lines.push('3. **Naturalidad contextual:** Las oraciones modelo representan inglés contemporáneo, libre de arcaísmos o traducciones literales forzadas.')
lines.push('4. **Cumplimiento de la regla $i+1$:** Todas las lecturas y ejercicios se encuentran asignados a semanas donde el léxico completo ha sido enseñado previamente.')
lines.push('')
lines.push('| Nivel | Fecha de Revisión | Docente Revisor | Firma / Estado | Observaciones |')
lines.push('|---|---|---|---|---|')
lines.push('| **A1 (Principiante)** | ____/____/2026 | _________________________ | [  ] APROBADO  [  ] CORRECCIONES | ____________________ |')
lines.push('| **A2 (Elemental)** | ____/____/2026 | _________________________ | [  ] APROBADO  [  ] CORRECCIONES | ____________________ |')
lines.push('| **B1 (Intermedio)** | ____/____/2026 | _________________________ | [  ] APROBADO  [  ] CORRECCIONES | ____________________ |')
lines.push('| **B2 (Avanzado)** | ____/____/2026 | _________________________ | [  ] APROBADO  [  ] CORRECCIONES | ____________________ |')
lines.push('')
lines.push('© 2026 Escuela de Inglés Americana. Todos los derechos reservados.')

const targetFile = path.resolve(__dirname, '../../docs/curriculo-docente-a1-b2.md')
fs.writeFileSync(targetFile, lines.join('\n'), 'utf-8')
console.log(`✅ Dossier generado exitosamente: ${targetFile}`)
console.log(`📊 Tamaño generado: ${(fs.statSync(targetFile).size / 1024).toFixed(1)} KB`)
