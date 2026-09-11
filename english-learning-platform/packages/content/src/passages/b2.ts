import type { ReadingPassage } from '@elp/types'

/**
 * Graded Reading Passages for Level B2.
 *
 * Curated from institutional curriculum guidelines (PLAN DE ESTUDIO.md).
 * Strict Zero AI generation policy — 100% human-authored content.
 */
export const b2ReadingPassages: readonly ReadingPassage[] = [
  {
    id: 'rdg_b2_001',
    level: 'B2',
    week: 1,
    title: 'The Ethical Dilemma of Advanced Artificial Intelligence',
    text: 'The emergence of autonomous cognitive algorithms has created an unprecedented ethical paradox in contemporary society. While technological integration promises to streamline global industries and optimize efficiency, it forces philosophers and computer scientists to scrutinize the moral implications of automated judgment. The inherent ambiguity of human ethics cannot easily be reduced to binary logic. When algorithms make life-altering decisions regarding judicial sentencing, healthcare allocation, or employment, society must figure out where accountability truly lies. Without strict regulatory oversight and transparency, unchecked automation may perpetuate existing systemic biases and undermine public trust in scientific institutions.',
    translation:
      'La aparición de algoritmos cognitivos autónomos ha creado una paradoja ética sin precedentes en la sociedad contemporánea. Si bien la integración tecnológica promete optimizar las industrias globales y mejorar la eficiencia, obliga a filósofos y científicos de la computación a escudriñar las implicaciones morales del juicio automatizado. La ambigüedad inherente de la ética humana no se puede reducir fácilmente a una lógica binaria. Cuando los algoritmos toman decisiones trascendentales sobre sentencias judiciales, asignación de atención médica o empleo, la sociedad debe descifrar dónde reside verdaderamente la responsabilidad. Sin una supervisión regulatoria estricta y transparencia, la automatización descontrolada puede perpetuar los sesgos sistémicos existentes y socavar la confianza pública en las instituciones científicas.',
    vocabularyIds: [
      'voc_b2_abstract_001',
      'voc_b2_ambiguity_004',
      'voc_b2_paradox_005',
      'voc_b2_implication_006',
      'voc_b2_inherent_015',
      'voc_b2_scrutinize_103',
      'voc_b2_ethical_109',
      'voc_b2_unprecedented_111',
      'voc_b2_figure-out_075',
      'voc_b2_bring-about_072',
    ],
    difficulty: 4,
    comprehensionQuestions: [
      {
        question: 'Why is automated moral judgment considered problematic according to the author?',
        options: [
          'Because computers are too inexpensive',
          'Because human ethics contains inherent ambiguity that cannot easily be reduced to binary logic',
          'Because software engineers refuse to write algorithms',
        ],
        correctOptionIndex: 1,
        explanation:
          'The author explicitly highlights: The inherent ambiguity of human ethics cannot easily be reduced to binary logic.',
      },
      {
        question: 'What could happen if automation continues without regulatory transparency?',
        options: [
          'It may perpetuate systemic biases and undermine public trust',
          'It will automatically solve all judicial disputes',
          'It will cause society to abandon digital technology',
        ],
        correctOptionIndex: 0,
        explanation:
          'The text warns that unchecked automation may perpetuate existing systemic biases and undermine public trust.',
      },
    ],
    verifiedBy: 'curator_editorial_team',
    verifiedAt: '2026-09-10',
    status: 'published',
  },
  {
    id: 'rdg_b2_002',
    level: 'B2',
    week: 2,
    title: 'Strategic Leadership in International Mergers',
    text: 'Executing a multi-billion-dollar international merger requires far more than financial capital; it demands exceptional strategic leadership and diplomatic compromise. Corporate leaders must harmonize divergent organizational cultures while maintaining strict regulatory compliance across multiple jurisdictions. Throughout the negotiation phase, executives must come up with innovative structural frameworks that protect shareholder equity while respecting the vital interests of local stakeholders. When executives communicate with genuine transparency and hold themselves to rigorous standards of accountability, team members across both organizations look forward to the collaborative opportunities of the newly unified enterprise.',
    translation:
      'Ejecutar una fusión internacional multimillonaria requiere mucho más que capital financiero; exige un liderazgo estratégico excepcional y un compromiso diplomático. Los líderes corporativos deben armonizar culturas organizacionales divergentes manteniendo al mismo tiempo un estricto cumplimiento normativo en múltiples jurisdicciones. A lo largo de la fase de negociación, los ejecutivos deben idear marcos estructurales innovadores que protejan el patrimonio de los accionistas respetando a la vez los intereses vitales de las partes interesadas locales. Cuando los directivos se comunican con auténtica transparencia y se rigen por rigurosos estándares de rendición de cuentas, los integrantes de ambas organizaciones esperan con ilusión las oportunidades de colaboración de la empresa recién unificada.',
    vocabularyIds: [
      'voc_b2_leadership_031',
      'voc_b2_strategy_032',
      'voc_b2_stakeholder_033',
      'voc_b2_shareholder_034',
      'voc_b2_merger_039',
      'voc_b2_acquisition_040',
      'voc_b2_accountability_042',
      'voc_b2_transparency_043',
      'voc_b2_compliance_044',
      'voc_b2_come-up-with_063',
      'voc_b2_look-forward-to_061',
    ],
    difficulty: 4,
    comprehensionQuestions: [
      {
        question:
          'What critical demand does an international merger place on corporate executives beyond capital?',
        options: [
          'Increasing production costs',
          'Exceptional strategic leadership, cultural harmony, and regulatory compliance',
          'Ending communication with shareholders',
        ],
        correctOptionIndex: 1,
        explanation:
          'The passage states that mergers demand exceptional strategic leadership and diplomatic compromise, harmonizing cultures and maintaining compliance.',
      },
      {
        question: 'How can corporate leaders foster positive collaboration during a merger?',
        options: [
          'By avoiding accountability and hiding structural changes',
          'By communicating with genuine transparency and upholding high standards of accountability',
          'By canceling all stakeholder meetings',
        ],
        correctOptionIndex: 1,
        explanation:
          'The author notes that communicating with genuine transparency and rigorous accountability inspires teams to look forward to collaborative opportunities.',
      },
    ],
    verifiedBy: 'curator_editorial_team',
    verifiedAt: '2026-09-10',
    status: 'published',
  },
]
