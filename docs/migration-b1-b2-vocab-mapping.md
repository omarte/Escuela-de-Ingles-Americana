# Registro Histórico de Migración de Vocabulario y Lecturas B1/B2
**Fecha:** Septiembre 2026  
**Propósito:** Documentar la sustitución del borrador inicial por el currículo curado del `primer lote`, la resolución de 70 duplicados cruzados, y el rescate de vocabulario clave para las lecturas de nivel B2.

---

## 1. Contexto de la Migración

El registro de contenido inicial en `packages/content/src/b1` y `b2` contenía 70 colisiones léxicas con los niveles A1 y A2 (palabras idénticas como `environment`, `pollution`, `however`, `moreover`, `cybersecurity`, etc., enseñadas sin diferenciación pedagógica).

Para resolverlo, se diseñó el currículo de **`primer lote`**:
- **B1**: 9 semanas temáticas (226 palabras), 8 lecturas graduadas, 45 ejercicios de gramática.
- **B2**: 4 semanas especializadas (72 palabras base + 9 términos rescatados de negocios y registro académico), 13 prompts de redacción.
- **Verificación cruzada:** 0 duplicados contra A1 y A2.

---

## 2. Inventario y Mapeo de Referencias en Lecturas de Producción

Antes de la sustitución, las lecturas existentes en `packages/content/src/passages/` contenían 44 referencias a IDs de vocabulario. A continuación se detalla la resolución de cada una:

### B1: Lecturas Antiguas vs. Nuevas Lecturas Curadas
Las 2 lecturas del borrador antiguo (`rdg_b1_001` y `rdg_b1_002`) estaban construidas sobre el vocabulario con colisiones (energía renovable y tecnología digital de A1/A2). Se reemplazan por las **8 lecturas completas** del `primer lote` (`rdg_b1_001` a `rdg_b1_008`), calibradas semana a semana:

| ID anterior | Palabra | Destino / Resolución |
| :--- | :--- | :--- |
| `voc_b1_renewable-energy_005` | renewable energy | Vive en A2 (`voc_a2_renewable-energy_348`). |
| `voc_b1_solar-power_006` | solar power | Descartada con la lectura antigua de energía. |
| `voc_b1_wind-turbine_007` | wind turbine | Descartada con la lectura antigua de energía. |
| `voc_b1_fossil-fuel_010` | fossil fuel | Vive en A2 (`voc_a2_fossil-fuel_366`). |
| `voc_b1_greenhouse-effect_009` | greenhouse effect | Vive en A2 (`voc_a2_greenhouse-effect_346`). |
| `voc_b1_climate-change_002` | climate change | Vive en A2 (`voc_a2_climate-change_344`). |
| `voc_b1_sustainable_023` | sustainable | Descartada con la lectura antigua. |
| `voc_b1_emission_028` | emission | Vive en A2 (`voc_a2_emission_365`). |
| `voc_b1_investment_041` | investment | Integrada en B1 Semana 7 (`voc_b1_investment_168`). |
| `voc_b1_environment_001` | environment | Vive en A1 (`voc_a1_environment_001`). |
| `voc_b1_consequently_142` | consequently | Vive en A2 (`voc_a2_consequently_268`). |
| `voc_b1_therefore_141` | therefore | Descartada (cubierta por conectores en A2/B1). |
| `voc_b1_automation_075` | automation | Integrada en B2 Semana 3 (`voc_b2_automation_046`). |
| `voc_b1_artificial-intelligence_073` | artificial intelligence | Vive en A2 (`voc_a2_artificial-intellige_483`). |
| `voc_b1_platform_094` | platform | Vive en A1 (`voc_a1_platform_001`). |
| `voc_b1_cloud-computing_084` | cloud computing | Descartada con lectura antigua. |
| `voc_b1_cybersecurity_076` | cybersecurity | Vive en A2 (`voc_a2_cybersecurity_462`). |
| `voc_b1_privacy_077` | privacy | Descartada con lectura antigua. |
| `voc_b1_innovation_101` | innovation | Integrada en B1 Semana 3 (`voc_b1_innovation_072`). |
| `voc_b1_well-being_107` | well-being | Descartada con lectura antigua. |
| `voc_b1_lifestyle_130` | lifestyle | Descartada con lectura antigua. |
| `voc_b1_however_137` | however | Vive en A1 (`voc_a1_however_001`). |
| `voc_b1_furthermore_135` | furthermore | Vive en A2 (`voc_a2_furthermore_279`). |

---

### B2: Lecturas Preservadas y Vocabulario Rescatado

Las lecturas `rdg_b2_001` (*"The Ethical Dilemma of Advanced Artificial Intelligence"*) y `rdg_b2_002` (*"Strategic Leadership in International Mergers"*) se **preservan íntegras**. 

Para evitar vaciar su contenido pedagógico, se rescataron 9 términos clave del ámbito académico y de negocios internacionales, incorporándolos al banco B2 con IDs propios:

| ID en lectura | Palabra | Resolución en la Migración | ID Final en Registro |
| :--- | :--- | :--- | :--- |
| `voc_b2_abstract_001` | abstract | **Rescatada en B2 Semana 5 (Registro Académico)** | `voc_b2_abstract_073` |
| `voc_b2_ambiguity_004` | ambiguity | Presente en B2 Semana 1 | `voc_b2_ambiguity_004` |
| `voc_b2_paradox_005` | paradox | Presente en B2 Semana 1 | `voc_b2_paradox_005` |
| `voc_b2_implication_006` | implication | Presente en B2 Semana 1 | `voc_b2_implication_006` |
| `voc_b2_inherent_015` | inherent | **Rescatada en B2 Semana 5 (Registro Académico)** | `voc_b2_inherent_074` |
| `voc_b2_scrutinize_103` | scrutinize | Presente en B2 Semana 1 (*scrutinise*) | `voc_b2_scrutinise_003` |
| `voc_b2_ethical_109` | ethical | Presente en B2 Semana 2 | `voc_b2_ethical_022` |
| `voc_b2_unprecedented_111` | unprecedented | Presente en B2 Semana 3 | `voc_b2_unprecedented_042` |
| `voc_b2_figure-out_075` | figure out | Presente en B1 Semana 1 | `voc_b1_figure-out_014` |
| `voc_b2_bring-about_072` | bring about | Presente en B1 Semana 1 | `voc_b1_bring-about_020` |
| `voc_b2_leadership_031` | leadership | **Rescatada en B2 Semana 5 (Estrategia y Negocios)** | `voc_b2_leadership_075` |
| `voc_b2_strategy_032` | strategy | **Rescatada en B2 Semana 5 (Estrategia y Negocios)** | `voc_b2_strategy_076` |
| `voc_b2_stakeholder_033` | stakeholder | Referencia a nivel previo A2 | `voc_a2_stakeholder_163` |
| `voc_b2_shareholder_034` | shareholder | Presente en B1 Semana 7 (Economía) | `voc_b1_shareholder_172` |
| `voc_b2_merger_039` | merger | **Rescatada en B2 Semana 5 (Estrategia y Negocios)** | `voc_b2_merger_077` |
| `voc_b2_acquisition_040` | acquisition | **Rescatada en B2 Semana 5 (Estrategia y Negocios)** | `voc_b2_acquisition_078` |
| `voc_b2_accountability_042` | accountability | **Rescatada en B2 Semana 5 (Estrategia y Negocios)** | `voc_b2_accountability_079` |
| `voc_b2_transparency_043` | transparency | **Rescatada en B2 Semana 5 (Estrategia y Negocios)** | `voc_b2_transparency_080` |
| `voc_b2_compliance_044` | compliance | **Rescatada en B2 Semana 5 (Estrategia y Negocios)** | `voc_b2_compliance_081` |
| `voc_b2_come-up-with_063` | come up with | Presente en B1 Semana 1 (Phrasal verbs) | `voc_b1_come-up-with_022` |
| `voc_b2_look-forward-to_061` | look forward to | Presente en B1 Semana 1 (Phrasal verbs) | `voc_b1_look-forward-to_002` |

---

## 3. Estándar de Identificadores (Schema Enforcement)

Para lecturas, el identificador normativo exigido por el esquema Zod (`ReadingPassageSchema`) y por `validate-content.ts` es:
```regex
^rdg_(a1|a2|b1|b2)_\d{3}$
```
Por lo tanto, todos los archivos que contenían `read_b1_001` fueron normalizados a `rdg_b1_001` para asegurar consistencia absoluta en todo el sistema.
