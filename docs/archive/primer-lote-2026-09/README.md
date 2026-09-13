# Archivo Histórico: Primer Lote (Septiembre 2026)

Este directorio contiene los artefactos originales de diseño y auditoría inicial del `primer lote` para los niveles B1 y B2:
- `words_b1.json` (226 palabras, 9 semanas)
- `words_b2.json` (72 palabras, 4 semanas)
- `readings_b1.json` (8 lecturas con preguntas de comprensión)
- `grammar_b1.json` (45 ejercicios de gramática)
- `writing_prompts_b2.json` (13 prompts de redacción con rúbricas)

## Estado: INTEGRADO EN PRODUCCIÓN
Todo este material ha sido formalmente migrado, validado con esquemas Zod e incorporado al código fuente activo del monorepo:
- Vocabulario B1: `packages/content/src/b1/week-01.ts` hasta `week-09.ts` (226 palabras).
- Vocabulario B2: `packages/content/src/b2/week-01.ts` hasta `week-05.ts` (84 palabras totales).
- Lecturas B1: `packages/content/src/passages/b1.ts` (`rdg_b1_001` a `rdg_b1_008`).
- Lecturas B2: `packages/content/src/passages/b2.ts` (`rdg_b2_001` y `rdg_b2_002`).

### ⚠️ Nota sobre la Semana 5 de B2 (72 → 84 palabras)
La ampliación de B2 de 72 a 84 palabras **no representa una relajación del criterio pedagógico** (el cual estipula que B2 debe ser deliberadamente conciso y enfocado en matices de registro y redacción formal). Esta adición fue una **medida reactiva de integridad referencial**: las lecturas existentes `rdg_b2_001` y `rdg_b2_002` utilizaban conceptos centrales (`merger`, `acquisition`, `accountability`, `transparency`, `compliance`, `abstract`, `inherent`, etc.) que habrían quedado huérfanos sin traducción ni interactividad en la app de haber sido eliminados. En lugar de mutilar el contenido pedagógico de esas lecturas, dichos términos se formalizaron como vocabulario de soporte legítimo en la Semana 5.

Para consultar el mapeo detallado de IDs y referencias léxicas, véase:
[docs/migration-b1-b2-vocab-mapping.md](../../migration-b1-b2-vocab-mapping.md)
