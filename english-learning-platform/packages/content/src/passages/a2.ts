import type { ReadingPassage } from '@elp/types'

/**
 * Graded Reading Passages for Level A2.
 *
 * All passages are curated from source curricula (PLAN DE ESTUDIO.md / a.md)
 * and strictly constructed using only vocabulary taught in A1 and A2 weeks.
 * Zero AI generation policy strictly enforced.
 */
export const a2ReadingPassages: readonly ReadingPassage[] = [
  {
    id: 'rdg_a2_001',
    level: 'A2',
    week: 2,
    title: 'A Weekend Trip to the Beach',
    text: 'Last weekend, my family and I went to the beach for the first time this year. We packed our suitcases early in the morning and drove for two hours. When we arrived, the weather was sunny and warm, so we decided to swim in the sea before lunch. In the afternoon, we visited a small restaurant near the hotel and tried some delicious fresh fish. My brother wanted to buy a souvenir for our grandmother, so we walked around the local market. It was a simple trip, but we all felt relaxed and happy.',
    translation:
      'El fin de semana pasado, mi familia y yo fuimos a la playa por primera vez este año. Empacamos nuestras maletas temprano en la mañana y manejamos durante dos horas. Cuando llegamos, el clima estaba soleado y cálido, así que decidimos nadar en el mar antes del almuerzo. Por la tarde, visitamos un pequeño restaurante cerca del hotel y probamos un delicioso pescado fresco. Mi hermano quería comprar un recuerdo para nuestra abuela, así que caminamos por el mercado local. Fue un viaje sencillo, pero todos nos sentimos relajados y felices.',
    vocabularyIds: [
      'voc_a1_weekend_001',
      'voc_a1_family_001',
      'voc_a1_beach_001',
      'voc_a1_morning_001',
      'voc_a1_sunny_001',
      'voc_a1_warm_001',
      'voc_a1_sea_001',
      'voc_a1_lunch_001',
      'voc_a1_afternoon_001',
      'voc_a1_restaurant_001',
      'voc_a1_hotel_001',
      'voc_a1_fish_001',
      'voc_a1_brother_001',
      'voc_a1_grandmother-grandma_001',
      'voc_a1_market_001',
      'voc_a1_happy_001',
    ],
    difficulty: 2,
    comprehensionQuestions: [
      {
        question: 'What was the weather like when the family arrived at the beach?',
        options: ['Cold and rainy', 'Sunny and warm', 'Windy and cloudy'],
        correctOptionIndex: 1,
        explanation: "The text states: 'the weather was sunny and warm, so we decided to swim.'",
      },
      {
        question: 'Who did the brother want to buy a souvenir for?',
        options: ['His grandmother', 'His teacher', 'His friend'],
        correctOptionIndex: 0,
        explanation: "The author says: 'My brother wanted to buy a souvenir for our grandmother.'",
      },
    ],
    wordMappings: [
      { en: 'weekend', es: 'fin de semana', vocabularyId: 'voc_a1_weekend_001' },
      { en: 'family', es: 'familia', vocabularyId: 'voc_a1_family_001' },
      { en: 'beach', es: 'playa', vocabularyId: 'voc_a1_beach_001' },
      { en: 'suitcases', es: 'maletas' },
      { en: 'morning', es: 'mañana', vocabularyId: 'voc_a1_morning_001' },
      { en: 'sunny', es: 'soleado', vocabularyId: 'voc_a1_sunny_001' },
      { en: 'warm', es: 'cálido', vocabularyId: 'voc_a1_warm_001' },
      { en: 'sea', es: 'mar', vocabularyId: 'voc_a1_sea_001' },
      { en: 'lunch', es: 'almuerzo', vocabularyId: 'voc_a1_lunch_001' },
      { en: 'afternoon', es: 'tarde', vocabularyId: 'voc_a1_afternoon_001' },
      { en: 'restaurant', es: 'restaurante', vocabularyId: 'voc_a1_restaurant_001' },
      { en: 'hotel', es: 'hotel', vocabularyId: 'voc_a1_hotel_001' },
      { en: 'fish', es: 'pescado', vocabularyId: 'voc_a1_fish_001' },
      { en: 'brother', es: 'hermano', vocabularyId: 'voc_a1_brother_001' },
      { en: 'grandmother', es: 'abuela', vocabularyId: 'voc_a1_grandmother-grandma_001' },
      { en: 'market', es: 'mercado', vocabularyId: 'voc_a1_market_001' },
      { en: 'happy', es: 'felices', vocabularyId: 'voc_a1_happy_001' },
    ],
    verifiedBy: 'human-curator',
    verifiedAt: '2026-09-10',
    status: 'published',
  },
  {
    id: 'rdg_a2_002',
    level: 'A2',
    week: 1,
    title: 'Returning a Damaged Package',
    text: 'Yesterday afternoon, I received my online order by standard delivery, but the package was damaged. When I opened the box, the product was broken and missing a part. I immediately contacted customer service to file a complaint. The agent was polite and explained the return policy. She sent me a return label and said the company would process a full refund or an exchange once the courier receives the damaged item. Fortunately, the warranty covers damaged shipments.',
    translation:
      'Ayer por la tarde, recibí mi pedido en línea por entrega estándar, pero el paquete estaba dañado. Cuando abrí la caja, el producto estaba roto y le faltaba una pieza. Inmediatamente me comuniqué con servicio al cliente para presentar una queja. La agente fue educada y me explicó la política de devoluciones. Me envió una etiqueta de devolución y dijo que la empresa procesaría un reembolso completo o un cambio una vez que el mensajero reciba el artículo dañado. Afortunadamente, la garantía cubre los envíos dañados.',
    vocabularyIds: [
      'voc_a2_standard-delivery_033',
      'voc_a2_package-parcel_029',
      'voc_a2_damaged_016',
      'voc_a2_broken_017',
      'voc_a2_missing-part_019',
      'voc_a2_customer-service_007',
      'voc_a2_complaint_006',
      'voc_a2_refund_001',
      'voc_a2_exchange_002',
      'voc_a2_courier_031',
      'voc_a2_warranty_004',
    ],
    difficulty: 2,
    comprehensionQuestions: [
      {
        question: 'Why did the customer contact customer service?',
        options: [
          'The order was canceled',
          'The package was damaged and the product was broken',
          'The price was too high',
        ],
        correctOptionIndex: 1,
        explanation:
          "The customer states: 'the package was damaged... the product was broken and missing a part.'",
      },
      {
        question: 'What options did the company offer to resolve the issue?',
        options: [
          'Store credit only',
          'A full refund or an exchange',
          'A discount on the next purchase',
        ],
        correctOptionIndex: 1,
        explanation:
          "The agent explained that the company would 'process a full refund or an exchange.'",
      },
    ],
    wordMappings: [
      { en: 'standard delivery', es: 'entrega estándar', vocabularyId: 'voc_a2_standard-delivery_033' },
      { en: 'package', es: 'paquete', vocabularyId: 'voc_a2_package-parcel_029' },
      { en: 'damaged', es: 'dañado', vocabularyId: 'voc_a2_damaged_016' },
      { en: 'broken', es: 'roto', vocabularyId: 'voc_a2_broken_017' },
      { en: 'missing a part', es: 'le faltaba una pieza', vocabularyId: 'voc_a2_missing-part_019' },
      { en: 'customer service', es: 'servicio al cliente', vocabularyId: 'voc_a2_customer-service_007' },
      { en: 'complaint', es: 'queja', vocabularyId: 'voc_a2_complaint_006' },
      { en: 'refund', es: 'reembolso', vocabularyId: 'voc_a2_refund_001' },
      { en: 'exchange', es: 'cambio', vocabularyId: 'voc_a2_exchange_002' },
      { en: 'courier', es: 'mensajero', vocabularyId: 'voc_a2_courier_031' },
      { en: 'warranty', es: 'garantía', vocabularyId: 'voc_a2_warranty_004' },
    ],
    verifiedBy: 'human-curator',
    verifiedAt: '2026-09-10',
    status: 'published',
  },
  {
    id: 'rdg_a2_003',
    level: 'A2',
    week: 3,
    title: 'A Busy Day at the Office',
    text: "Today was a very busy day at the office. Our department had an urgent deadline for a new project report. In the morning, my supervisor called a meeting in the main conference room to discuss the client's feedback. My colleague and I prepared a detailed presentation with the latest spreadsheet data. Although we worked some overtime in the evening, everyone cooperated and we completed the approval on time. My supervisor thanked the whole team for their hard work.",
    translation:
      'Hoy fue un día muy ocupado en la oficina. Nuestro departamento tenía una fecha límite urgente para el informe de un nuevo proyecto. Por la mañana, mi supervisor convocó una reunión en la sala de conferencias principal para analizar los comentarios del cliente. Mi colega y yo preparamos una presentación detallada con los datos más recientes de la hoja de cálculo. Aunque trabajamos algunas horas extra por la noche, todos cooperaron y completamos la aprobación a tiempo. Mi supervisor agradeció a todo el equipo por su arduo trabajo.',
    vocabularyIds: [
      'voc_a2_department_126',
      'voc_a2_deadline_129',
      'voc_a2_report_136',
      'voc_a2_supervisor_128',
      'voc_a2_meeting-room_130',
      'voc_a2_colleague_127',
      'voc_a2_presentation_132',
      'voc_a2_spreadsheet_137',
      'voc_a2_overtime_145',
    ],
    difficulty: 3,
    comprehensionQuestions: [
      {
        question: 'Why was the day at the office especially busy?',
        options: [
          'A new employee started',
          'The department had an urgent deadline for a project report',
          'The computers stopped working',
        ],
        correctOptionIndex: 1,
        explanation:
          "The author says: 'Our department had an urgent deadline for a new project report.'",
      },
      {
        question: 'What did the colleagues do to meet the deadline?',
        options: [
          'Postponed the presentation',
          'Worked some overtime and prepared a detailed presentation',
          'Hired an external consultant',
        ],
        correctOptionIndex: 1,
        explanation:
          "The text mentions: 'prepared a detailed presentation... worked some overtime in the evening.'",
      },
    ],
    wordMappings: [
      { en: 'department', es: 'departamento', vocabularyId: 'voc_a2_department_126' },
      { en: 'deadline', es: 'fecha límite', vocabularyId: 'voc_a2_deadline_129' },
      { en: 'report', es: 'informe', vocabularyId: 'voc_a2_report_136' },
      { en: 'supervisor', es: 'supervisor', vocabularyId: 'voc_a2_supervisor_128' },
      { en: 'meeting', es: 'reunión' },
      { en: 'conference room', es: 'sala de conferencias', vocabularyId: 'voc_a2_meeting-room_130' },
      { en: 'colleague', es: 'colega', vocabularyId: 'voc_a2_colleague_127' },
      { en: 'presentation', es: 'presentación', vocabularyId: 'voc_a2_presentation_132' },
      { en: 'spreadsheet', es: 'hoja de cálculo', vocabularyId: 'voc_a2_spreadsheet_137' },
      { en: 'overtime', es: 'horas extra', vocabularyId: 'voc_a2_overtime_145' },
    ],
    verifiedBy: 'human-curator',
    verifiedAt: '2026-09-10',
    status: 'published',
  },
]
