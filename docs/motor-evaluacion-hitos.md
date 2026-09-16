# Especificación de Arquitectura: Motor de Evaluación por Hitos y Expediente Académico (Milestone Engine)

## 1. Visión y Fundamento Pedagógico
En la Escuela de Inglés Americana, el aprendizaje no es una acumulación pasiva de palabras, sino un recorrido estructurado con hitos de validación objetivos. 

El nivel **A1** divide sus 1,512 palabras en **4 hitos progresivos** (100, 500, 1,000 y 1,512 palabras dominadas) para combatir la deserción temprana mediante validaciones y picos de dopamina.
El nivel **A2** cuenta con **2 evaluaciones** (medio término y final), mientras que los niveles avanzados **B1 y B2** cuentan con una **evaluación final exhaustiva** de graduación.

---

## 2. Mapa Oficial de Evaluaciones

| Nivel | Hito / Tramo | Conteo Requerido | Tipo de Certificado | Umbral de Aprobación | Cooldown Reintento | Título / Reconocimiento |
|---|---|---|---|---|---|---|
| **A1** | `a1_100` | 100 palabras | Micro-acreditación | 75% | 24 horas | 🥉 *Primeros Pasos A1* |
| **A1** | `a1_500` | 500 palabras | Micro-acreditación | 75% | 24 horas | 🥈 *Fundamentos A1* |
| **A1** | `a1_1000` | 1,000 palabras | Micro-acreditación | 80% | 24 horas | 🥇 *Avanzado A1* |
| **A1** | `a1_final` | 1,512 palabras (Fin de Nivel) | Certificado Oficial | 80% | 48 horas | 🏆 **Certificado de Nivel A1 MCER** |
| **A2** | `a2_mid` | ~370 palabras (Medio Término) | Micro-acreditación | 75% | 24 horas | 📊 *Intermedio A2* |
| **A2** | `a2_final` | 734 palabras (Fin de Nivel) | Certificado Oficial | 80% | 48 horas | 🏆 **Certificado de Nivel A2 MCER** |
| **B1** | `b1_final` | 226 palabras (Fin de Nivel) | Certificado Oficial | 80% | 48 horas | 🏆 **Certificado de Nivel B1 MCER** |
| **B2** | `b2_final` | 84 palabras (Fin de Nivel) | Diploma de Honor | 85% | 48 horas | 🎓 **Diploma de Maestría B2 (Fluidez Profesional)** |

---

## 3. Modelo de Datos y Tipos (`@elp/types`)

```typescript
export type MilestoneType =
  | 'a1_100'
  | 'a1_500'
  | 'a1_1000'
  | 'a1_final'
  | 'a2_mid'
  | 'a2_final'
  | 'b1_final'
  | 'b2_final'

export type CertificateType = 'micro' | 'official' | 'honor'

export interface ExamMilestone {
  readonly id: MilestoneType
  readonly level: 'A1' | 'A2' | 'B1' | 'B2'
  readonly requiredMasteredWords: number
  readonly title: string
  readonly certificateType: CertificateType
  readonly passingScore: number
  readonly retakeCooldownHours: number
  readonly questionCount: number
}

export interface UserMilestoneRecord {
  readonly id: string
  readonly userId: string
  readonly milestoneId: MilestoneType
  readonly score: number                  // 0 - 100
  readonly isPassed: boolean
  readonly avgLatencyMs: number           // Telemetría de respuesta refleja cognitiva
  readonly completedAt: string            // Formato ISO
  readonly attemptsCount: number
  readonly certificateUrl?: string
}
```

---

## 4. Estructura de la Boleta de Calificaciones (Expediente Académico)

Cada evaluación arroja un reporte desglosado en cuatro ejes de rendimiento:
1. **Léxico y Vocabulario (40%)**: Precisión directa en definiciones, traducciones e IPA.
2. **Latencia Cognitiva (25%)**: Tiempos de respuesta < 4 segundos indican asimilación inconsciente (fluidez refleja). Tiempos > 7 segundos denotan traducción mental forzada.
3. **Comprensión en Contexto (25%)**: Selección adecuada de palabras dentro de oraciones complejas.
4. **Disciplina y Consistencia (10%)**: Bono por días de racha activa y retención SM-2 sostenida.

---

## 5. Implementación Futura (Fase 12)
- **Activador**: Escucha en `useSRSStore` y `sqlite.ts` sobre tarjetas dominadas (`interval >= 21` o `state === 'review'`).
- **Almacenamiento**: Tabla `local_milestone_records` en SQLite + sincronización a `milestone_records` en Supabase.
- **Interfaz**: Pantalla `apps/app/app/(app)/academic-record.tsx` con cronograma interactivo, medallas e insignia descargable.
