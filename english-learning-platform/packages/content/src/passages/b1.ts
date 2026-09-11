import type { ReadingPassage } from '@elp/types'

/**
 * Graded Reading Passages for Level B1.
 *
 * Curated from institutional curriculum guidelines (PLAN DE ESTUDIO.md).
 * Strict Zero AI generation policy — 100% human-authored content.
 */
export const b1ReadingPassages: readonly ReadingPassage[] = [
  {
    id: 'rdg_b1_001',
    level: 'B1',
    week: 1,
    title: 'The Global Transition to Renewable Energy',
    text: 'In recent years, the global transition to renewable energy has accelerated rapidly. Many countries are investing heavily in solar power and wind turbines to replace traditional fossil fuels. The primary motivation is the urgent need to combat climate change and reduce greenhouse gas emissions. Burning coal and oil has caused severe damage to the atmosphere and endangered natural ecosystems. Consequently, sustainable technologies are no longer seen merely as an alternative, but as a fundamental necessity for economic and environmental survival. While the initial investment in clean energy infrastructure is high, the long-term benefits for the planet and public health are undeniable.',
    translation:
      'En los últimos años, la transición global hacia la energía renovable se ha acelerado rápidamente. Muchos países están invirtiendo fuertemente en energía solar y turbinas eólicas para reemplazar los combustibles fósiles tradicionales. La motivación principal es la urgente necesidad de combatir el cambio climático y reducir las emisiones de gases de efecto invernadero. La quema de carbón y petróleo ha causado graves daños a la atmósfera y ha puesto en peligro los ecosistemas naturales. En consecuencia, las tecnologías sostenibles ya no se consideran simplemente como una alternativa, sino como una necesidad fundamental para la supervivencia económica y ambiental. Si bien la inversión inicial en infraestructura de energía limpia es alta, los beneficios a largo plazo para el planeta y la salud pública son innegables.',
    vocabularyIds: [
      'voc_b1_renewable-energy_005',
      'voc_b1_solar-power_006',
      'voc_b1_wind-turbine_007',
      'voc_b1_fossil-fuel_010',
      'voc_b1_greenhouse-effect_009',
      'voc_b1_climate-change_002',
      'voc_b1_sustainable_023',
      'voc_b1_emission_028',
      'voc_b1_investment_041',
      'voc_b1_environment_001',
      'voc_b1_consequently_142',
      'voc_b1_therefore_141',
    ],
    difficulty: 3,
    comprehensionQuestions: [
      {
        question: 'What is the primary motivation for transitioning to renewable energy?',
        options: [
          'To decrease the number of wind turbines',
          'To combat climate change and reduce greenhouse gas emissions',
          'To increase the consumption of coal and oil',
        ],
        correctOptionIndex: 1,
        explanation:
          'The text states: The primary motivation is the urgent need to combat climate change and reduce greenhouse gas emissions.',
      },
      {
        question: 'Why are sustainable technologies considered a fundamental necessity?',
        options: [
          'Because fossil fuel damage threatens ecosystems and economic survival',
          'Because clean infrastructure is completely free to build',
          'Because cities have run out of electricity',
        ],
        correctOptionIndex: 0,
        explanation:
          'The author explains that emissions caused severe damage to ecosystems, making sustainable tech a necessity for survival.',
      },
    ],
    wordMappings: [
      { en: 'renewable energy', es: 'energía renovable', vocabularyId: 'voc_b1_renewable-energy_005' },
      { en: 'solar power', es: 'energía solar', vocabularyId: 'voc_b1_solar-power_006' },
      { en: 'wind turbines', es: 'turbinas eólicas', vocabularyId: 'voc_b1_wind-turbine_007' },
      { en: 'fossil fuels', es: 'combustibles fósiles', vocabularyId: 'voc_b1_fossil-fuel_010' },
      { en: 'climate change', es: 'cambio climático', vocabularyId: 'voc_b1_climate-change_002' },
      { en: 'greenhouse gas emissions', es: 'emisiones de gases de efecto invernadero', vocabularyId: 'voc_b1_emission_028' },
      { en: 'ecosystems', es: 'ecosistemas' },
      { en: 'sustainable', es: 'sostenibles', vocabularyId: 'voc_b1_sustainable_023' },
      { en: 'Consequently', es: 'En consecuencia', vocabularyId: 'voc_b1_consequently_142' },
      { en: 'investment', es: 'inversión', vocabularyId: 'voc_b1_investment_041' },
      { en: 'environment', es: 'ambiental', vocabularyId: 'voc_b1_environment_001' },
    ],
    verifiedBy: 'curator_editorial_team',
    verifiedAt: '2026-09-10',
    status: 'published',
  },
  {
    id: 'rdg_b1_002',
    level: 'B1',
    week: 3,
    title: 'The Impact of Automation and Remote Work',
    text: 'The widespread adoption of cloud computing and digital platforms has revolutionized modern employment. Today, many professionals work remotely, using artificial intelligence and automation tools to perform complex tasks in minutes. This digital transformation has significantly improved productivity and allowed employees to maintain a flexible lifestyle. However, this shift also introduces unprecedented challenges. Organizations must now allocate substantial resources toward cybersecurity to safeguard sensitive user data and preserve customer privacy. Furthermore, leaders must ensure that digital transformation does not undermine team cohesion or employee well-being.',
    translation:
      'La adopción generalizada de la computación en la nube y las plataformas digitales ha revolucionado el empleo moderno. Hoy en día, muchos profesionales trabajan de forma remota, utilizando herramientas de inteligencia artificial y automatización para realizar tareas complejas en minutos. Esta transformación digital ha mejorado significativamente la productividad y ha permitido a los empleados mantener un estilo de vida flexible. Sin embargo, este cambio también introduce desafíos sin precedentes. Las organizaciones ahora deben destinar recursos sustanciales a la ciberseguridad para proteger los datos sensibles de los usuarios y preservar la privacidad del cliente. Además, los líderes deben asegurarse de que la transformación digital no socave la cohesión del equipo ni el bienestar de los empleados.',
    vocabularyIds: [
      'voc_b1_automation_075',
      'voc_b1_artificial-intelligence_073',
      'voc_b1_platform_094',
      'voc_b1_cloud-computing_084',
      'voc_b1_cybersecurity_076',
      'voc_b1_privacy_077',
      'voc_b1_innovation_101',
      'voc_b1_well-being_107',
      'voc_b1_lifestyle_130',
      'voc_b1_however_137',
      'voc_b1_furthermore_135',
    ],
    difficulty: 3,
    comprehensionQuestions: [
      {
        question: 'What benefit has digital transformation provided to employees?',
        options: [
          'It eliminated all computer networks',
          'It improved productivity and enabled a flexible lifestyle',
          'It forced everyone back to traditional offices',
        ],
        correctOptionIndex: 1,
        explanation:
          'The passage explicitly mentions: This digital transformation has significantly improved productivity and allowed employees to maintain a flexible lifestyle.',
      },
      {
        question: 'What major challenge do organizations face with remote work?',
        options: [
          'They must invest heavily in cybersecurity to protect data and privacy',
          'They can no longer use cloud computing',
          'They do not have internet bandwidth',
        ],
        correctOptionIndex: 0,
        explanation:
          'The text highlights that organizations must allocate substantial resources toward cybersecurity to safeguard sensitive data and privacy.',
      },
    ],
    wordMappings: [
      { en: 'cloud computing', es: 'computación en la nube', vocabularyId: 'voc_b1_cloud-computing_084' },
      { en: 'digital platforms', es: 'plataformas digitales', vocabularyId: 'voc_b1_platform_094' },
      { en: 'artificial intelligence', es: 'inteligencia artificial', vocabularyId: 'voc_b1_artificial-intelligence_073' },
      { en: 'automation', es: 'automatización', vocabularyId: 'voc_b1_automation_075' },
      { en: 'digital transformation', es: 'transformación digital' },
      { en: 'productivity', es: 'productividad' },
      { en: 'lifestyle', es: 'estilo de vida', vocabularyId: 'voc_b1_lifestyle_130' },
      { en: 'However', es: 'Sin embargo', vocabularyId: 'voc_b1_however_137' },
      { en: 'cybersecurity', es: 'ciberseguridad', vocabularyId: 'voc_b1_cybersecurity_076' },
      { en: 'privacy', es: 'privacidad', vocabularyId: 'voc_b1_privacy_077' },
      { en: 'Furthermore', es: 'Además', vocabularyId: 'voc_b1_furthermore_135' },
      { en: 'well-being', es: 'bienestar', vocabularyId: 'voc_b1_well-being_107' },
    ],
    verifiedBy: 'curator_editorial_team',
    verifiedAt: '2026-09-10',
    status: 'published',
  },
]
