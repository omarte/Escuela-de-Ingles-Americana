# Archivo Histórico: Primer Lote (Septiembre 2026)

Este directorio contiene los artefactos originales de diseño y auditoría inicial del `primer lote` para los niveles B1 y B2:
- `words_b1.json` (226 palabras, 9 semanas)
- `words_b2.json` (72 palabras, 4 semanas)
- `readings_b1.json` (8 lecturas con preguntas de comprensión)
- `grammar_b1.json` (45 ejercicios de gramática)
- `writing_prompts_b2.json` (13 prompts de redacción con rúbricas)

## Estado: INTEGRADO EN PRODUCCIÓN
Todo este material ha sido formalmente migrado, validado con esquemas Zod e incorporado al código fuente activo del monorepo:
- Vocabulario B1: `packages/content/src/b1/week-01.ts` hasta `week-09.ts`
- Vocabulario B2: `packages/content/src/b2/week-01.ts` hasta `week-05.ts` (incluyendo 12 palabras rescatadas de negocios y conceptos académicos)
- Lecturas B1: `packages/content/src/passages/b1.ts` (`rdg_b1_001` a `rdg_b1_008`)
- Lecturas B2: `packages/content/src/passages/b2.ts` (`rdg_b2_001` y `rdg_b2_002`)

Para consultar el mapeo de IDs y referencias léxicas, véase:
[docs/migration-b1-b2-vocab-mapping.md](../../migration-b1-b2-vocab-mapping.md)
