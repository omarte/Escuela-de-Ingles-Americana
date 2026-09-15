import fs from 'node:fs'
import path from 'node:path'

const contentDir = path.resolve(__dirname, '../packages/content/src')

// 1. Update B1 Readings in packages/content/src/passages/b1.ts
const b1PassagesPath = path.join(contentDir, 'passages/b1.ts')
let b1PassagesCode = fs.readFileSync(b1PassagesPath, 'utf-8')

const b1Updates: Record<string, { translation: string; explanations: [string, string, string] }> = {
  rdg_b1_001: {
    translation:
      'El mes pasado, Marco tuvo que tomar una decisión que cambiaría su vida. Le habían ofrecido un nuevo trabajo en otra ciudad, pero si lo aceptaba, tendría que dejar atrás a sus padres ancianos. Si se quedaba, sabía que probablemente se arrepentiría de perder una oportunidad tan buena. Habló con su hermana, quien le sugirió hacer una lista de razones para cada opción. "Si no lo intentas", le dijo, "siempre te preguntarás qué podría haber pasado". Después de pensarlo durante una semana, Marco se dio cuenta de que si sus padres lo necesitaban, siempre podría visitarlos seguido, y las videollamadas también ayudarían. Al final, decidió aceptar el trabajo. No fue una decisión fácil, pero se sintió seguro de que, pasara lo que pasara, aprendería algo valioso de ello.',
    explanations: [
      'El texto dice: "he would have to leave his elderly parents behind" — esa era la dificultad de la decisión.',
      'La hermana le dijo que hiciera "a list of reasons for each choice."',
      'El texto dice: "he decided to accept the job."',
    ],
  },
  rdg_b1_002: {
    translation:
      'En los últimos años, la forma en que trabaja la gente ha cambiado significativamente. Muchas empresas se han visto obligadas a reconsiderar cómo se usan sus oficinas, y el trabajo remoto, que antes se veía como algo inusual, ahora se considera normal para gran parte de la fuerza laboral. Según una encuesta reciente, más de la mitad de los empleados dice que preferiría trabajar desde casa al menos parte del tiempo. Algunas empresas ya han adaptado sus políticas, ofreciendo horarios flexibles y modalidades híbridas. Sin embargo, no todos se benefician por igual. Los trabajadores cuyos empleos requieren presencia física, como los de manufactura o salud, no han recibido la misma flexibilidad. Los críticos argumentan que esto crea un nuevo tipo de desigualdad entre quienes pueden trabajar desde cualquier lugar y quienes no. Mientras esta tendencia continúa, es probable que se necesiten introducir nuevas regulaciones para proteger a los trabajadores de ambos lados de esta brecha.',
    explanations: [
      'El texto dice: "more than half of employees say they would prefer to work from home at least part of the time."',
      'El texto especifica: "Workers whose jobs require physical presence, such as those in manufacturing or healthcare, have not been given the same flexibility."',
      'Los críticos dicen que "this creates a new kind of inequality."',
    ],
  },
  rdg_b1_003: {
    translation:
      'Cuando Elena se mudó a una nueva ciudad por trabajo, al principio le costó llevarse bien con sus nuevos colegas. Todos parecían ocupados y ella no sabía cómo romper el hielo. Un día, decidió sacar un tema que le interesaba a todos: el terrible café de la cocina de la oficina. Resultó ser la forma perfecta de iniciar una conversación. Pronto, la gente se reía y compartía anécdotas sobre sus peores experiencias con el café. Elena se dio cuenta de que había estado postergando hacer amigos por miedo a parecer tonta. Ahora espera con ganas los descansos para almorzar, e incluso descubrió cómo lidiar con la impresora de la oficina, que todos los demás evitan. A veces, las cosas más pequeñas te ayudan a encajar.',
    explanations: [
      'El texto dice: "Everyone seemed busy, and she didn\'t know how to break the ice."',
      'Ella habló sobre "the terrible coffee in the office kitchen."',
      'El texto dice: "she had been putting off making friends because she was afraid of looking silly."',
    ],
  },
  rdg_b1_004: {
    translation:
      'Toda empresa enfrenta momentos en los que una pequeña suposición lleva a una gran consecuencia. El año pasado, un equipo de marketing lanzó una campaña sin verificar bien sus datos, y el resultado fue decepcionante. Habían asumido que su público principal eran adultos jóvenes, pero el análisis reveló después que la mayoría de sus clientes en realidad tenían más de cuarenta años. Este factor cambió toda la estrategia. Sin embargo, lo que más impresionó a la gerencia fue la actitud del equipo: en lugar de culparse entre ellos, asumieron toda la responsabilidad y usaron la experiencia como una oportunidad de aprendizaje. Crearon un nuevo marco de trabajo para verificar suposiciones antes de cada futura campaña. Su iniciativa se ha convertido desde entonces en procedimiento estándar en toda la empresa, demostrando que un solo error, bien manejado, puede mejorar la estructura de una organización durante años.',
    explanations: [
      'El texto dice: "They had assumed that their main audience was young adults."',
      'El texto dice: "The team\'s attitude... is what impressed management the most."',
      'El texto dice: "They created a new framework for checking assumptions... has since become standard procedure."',
    ],
  },
  rdg_b1_005: {
    translation:
      'Algunos urbanistas argumentan que si los centros de las ciudades prohíben los autos privados, la calidad del aire mejorará drásticamente y las calles serán más seguras para los peatones. Señalan que varias ciudades europeas ya han probado esta idea con resultados prometedores. Sin embargo, los críticos afirman que dicha política perjudicaría a los negocios locales, ya que muchos clientes dependen de sus autos para llegar a tiendas alejadas del transporte público. Otros sugieren un punto medio: en lugar de una prohibición total, las ciudades podrían limitar el acceso de autos durante horas específicas o cobrar una tarifa por entrar a zonas concurridas. Es difícil probar cuál solución funciona mejor sin probarla directamente, pero la mayoría de los expertos coincide en que no hacer nada no es una opción. Mientras el tráfico y la contaminación sigan aumentando, es probable que más ciudades tengan que abordar este tema en la próxima década, les guste o no a los residentes.',
    explanations: [
      'El texto dice: "critics claim that such a policy would hurt local businesses."',
      'El texto propone: "cities could limit car access during specific hours."',
      'El texto dice: "most experts agree that doing nothing is not an option."',
    ],
  },
  rdg_b1_006: {
    translation:
      'En una época en la que la información viaja más rápido que nunca, saber qué fuentes son confiables se ha convertido en una habilidad esencial. Una encuesta reciente encontró que muchos lectores jóvenes obtienen sus noticias principalmente de redes sociales en lugar de medios tradicionales. Aunque esto hace que la información sea más accesible, también aumenta el riesgo de desinformación, ya que el contenido en las plataformas sociales rara vez se verifica antes de compartirse. Los periodistas advierten que el sesgo puede aparecer incluso en publicaciones respetadas, muchas veces a través de qué historias se cubren y cómo se redactan los titulares. Para leer de forma crítica, los expertos recomiendan verificar si una afirmación está respaldada por varias fuentes independientes, y ser cautelosos con artículos que parecen diseñados principalmente para provocar reacciones emocionales fuertes. La alfabetización mediática, sostienen, debería enseñarse en las escuelas igual que la lectura y la escritura.',
    explanations: [
      'El texto dice: "many young readers get their news mainly from social media."',
      'El texto dice: "experts recommend checking whether a claim is supported by multiple independent sources."',
      'El texto dice: "Media literacy... should be taught in schools just like reading and writing."',
    ],
  },
  rdg_b1_007: {
    translation:
      'Diego y Marta habían sido amigos cercanos durante años, pero un desacuerdo reciente sobre dinero casi termina con su amistad. Diego le había prestado dinero a Marta, y cuando ella no se lo devolvió a tiempo, él se quejó con un amigo en común en lugar de hablar con ella directamente. Marta se enteró y se sintió herida de que Diego no la hubiera confrontado personalmente. Cuando finalmente hablaron, Diego admitió que debería haber abordado el problema de inmediato en lugar de dejar que el resentimiento creciera. Marta se disculpó por olvidar la fecha límite y explicó que había estado pasando por un mes económicamente difícil. Al final, acordaron ser más abiertos entre ellos en el futuro, y Diego dijo que había aprendido que evitar una conversación generalmente hace que un problema pequeño se vuelva mucho más grande de lo que necesita ser.',
    explanations: [
      'El texto dice: "he complained to a mutual friend instead of talking to her directly."',
      'El texto dice: "Diego admitted that he should have addressed the issue right away."',
      'El texto dice: "avoiding a conversation usually makes a small problem much bigger than it needs to be."',
    ],
  },
  rdg_b1_008: {
    translation:
      'De todas las habilidades que buscan hoy los empleadores, la adaptabilidad podría ser la más subestimada. El conocimiento técnico se vuelve obsoleto más rápido que nunca, pero un trabajador versátil y dispuesto a aprender nuevas herramientas siempre será más valioso que uno que se resiste al cambio, sin importar cuánta experiencia tenga. Las empresas prefieren cada vez más a candidatos que muestran un patrón constante de resolver problemas desconocidos, por encima de aquellos con un conjunto de calificaciones impresionante pero limitado. Esto no significa que la experiencia no sea importante; más bien, sugiere que los profesionales más exitosos combinan un conocimiento profundo en un área con un enfoque flexible e integral hacia todo lo demás. En un mundo donde las industrias pueden transformarse en solo unos pocos años, la capacidad de adaptarse rápido puede resultar más significativa que cualquier habilidad técnica específica que alguien pueda enumerar en un currículum.',
    explanations: [
      'El texto dice: "adaptability might be the most underrated one."',
      'El texto dice: "Companies increasingly prefer candidates who show a consistent pattern of solving unfamiliar problems."',
      'El texto dice: "the most successful professionals combine deep knowledge in one area with a flexible, comprehensive approach."',
    ],
  },
}

// Update B1 readings via safe JSON parse & stringify
const eqBracket = b1PassagesCode.indexOf('= [')
const arrayStart = eqBracket !== -1 ? eqBracket + 2 : -1
const arrayEnd = b1PassagesCode.lastIndexOf(']')
if (arrayStart !== -1 && arrayEnd !== -1) {
  const jsonStr = b1PassagesCode.slice(arrayStart, arrayEnd + 1)
  const passages = JSON.parse(jsonStr)
  for (const p of passages) {
    if (b1Updates[p.id]) {
      p.translation = b1Updates[p.id].translation
      b1Updates[p.id].explanations.forEach((exp: string, idx: number) => {
        if (p.comprehensionQuestions && p.comprehensionQuestions[idx]) {
          p.comprehensionQuestions[idx].explanation = exp
        }
      })
    }
  }
  const prefix = b1PassagesCode.slice(0, arrayStart)
  b1PassagesCode = `${prefix}${JSON.stringify(passages, null, 2)}\n`
  fs.writeFileSync(b1PassagesPath, b1PassagesCode, 'utf-8')
  console.log('✅ B1 reading translations & explanations updated cleanly')
}

// 2. Update A1 Week 1 with IPA and quality examples
const a1w1Path = path.join(contentDir, 'a1/week-01.ts')
let a1w1Code = fs.readFileSync(a1w1Path, 'utf-8')

const a1QualitySamples: Record<string, { ipa: string; example: string; exampleTranslation: string }> = {
  'voc_a1_i_001': { ipa: '/aɪ/', example: 'I am a student.', exampleTranslation: 'Yo soy estudiante.' },
  'voc_a1_you_001': { ipa: '/juː/', example: 'You are my friend.', exampleTranslation: 'Tú eres mi amigo.' },
  'voc_a1_he_001': { ipa: '/hiː/', example: 'He is tall.', exampleTranslation: 'Él es alto.' },
  'voc_a1_she_001': { ipa: '/ʃiː/', example: 'She lives in Mexico.', exampleTranslation: 'Ella vive en México.' },
  'voc_a1_we_001': { ipa: '/wiː/', example: 'We are happy today.', exampleTranslation: 'Estamos felices hoy.' },
  'voc_a1_my_001': { ipa: '/maɪ/', example: 'This is my house.', exampleTranslation: 'Esta es mi casa.' },
  'voc_a1_this_001': { ipa: '/ðɪs/', example: 'This is my brother.', exampleTranslation: 'Este es mi hermano.' },
  'voc_a1_am_001': { ipa: '/æm/', example: 'I am from Canada.', exampleTranslation: 'Soy de Canadá.' },
  'voc_a1_is_001': { ipa: '/ɪz/', example: 'She is a doctor.', exampleTranslation: 'Ella es médica.' },
  'voc_a1_are_001': { ipa: '/ɑːr/', example: 'They are at home.', exampleTranslation: 'Ellos están en casa.' },
  'voc_a1_have_001': { ipa: '/hæv/', example: 'I have two brothers.', exampleTranslation: 'Tengo dos hermanos.' },
  'voc_a1_do_001': { ipa: '/duː/', example: 'I do my homework every day.', exampleTranslation: 'Hago mi tarea todos los días.' },
  'voc_a1_did_001': { ipa: '/dɪd/', example: 'She did the dishes.', exampleTranslation: 'Ella lavó los platos.' },
  'voc_a1_hello_001': { ipa: '/həˈloʊ/', example: 'Hello, how are you?', exampleTranslation: 'Hola, ¿cómo estás?' },
  'voc_a1_goodbye_001': { ipa: '/ˌɡʊdˈbaɪ/', example: 'Goodbye, see you tomorrow.', exampleTranslation: 'Adiós, nos vemos mañana.' },
  'voc_a1_good-morning_001': { ipa: '/ɡʊd ˈmɔːrnɪŋ/', example: 'Good morning, everyone!', exampleTranslation: '¡Buenos días a todos!' },
  'voc_a1_please_001': { ipa: '/pliːz/', example: 'Please, sit down.', exampleTranslation: 'Por favor, siéntate.' },
  'voc_a1_thank-you_001': { ipa: '/θæŋk juː/', example: 'Thank you for your help.', exampleTranslation: 'Gracias por tu ayuda.' },
  'voc_a1_sorry_001': { ipa: '/ˈsɑːri/', example: 'Sorry, I am late.', exampleTranslation: 'Perdón, llego tarde.' },
  'voc_a1_yes_001': { ipa: '/jɛs/', example: 'Yes, I understand.', exampleTranslation: 'Sí, entiendo.' },
  'voc_a1_no_001': { ipa: '/noʊ/', example: 'No, I don\'t have time.', exampleTranslation: 'No, no tengo tiempo.' },
  'voc_a1_one_001': { ipa: '/wʌn/', example: 'I have one sister.', exampleTranslation: 'Tengo una hermana.' },
  'voc_a1_ten_001': { ipa: '/tɛn/', example: 'The bus arrives in ten minutes.', exampleTranslation: 'El autobús llega en diez minutos.' },
  'voc_a1_what_001': { ipa: '/wʌt/', example: 'What is your name?', exampleTranslation: '¿Cómo te llamas?' },
  'voc_a1_where_001': { ipa: '/wɛr/', example: 'Where do you live?', exampleTranslation: '¿Dónde vives?' },
}

for (const [id, data] of Object.entries(a1QualitySamples)) {
  const blockRegex = new RegExp(`(id:\\s*'${id}',[\\s\\S]*?)(status:\\s*'approved',)`, 'm')
  const match = a1w1Code.match(blockRegex)
  if (match) {
    let itemCode = match[1]
    if (!itemCode.includes('pronunciation:')) {
      itemCode += `pronunciation: '${data.ipa}',\n      example: '${data.example.replace(/'/g, "\\'")}',\n      exampleTranslation: '${data.exampleTranslation.replace(/'/g, "\\'")}',\n      `
    }
    a1w1Code = a1w1Code.replace(match[0], itemCode + match[2])
  }
}
fs.writeFileSync(a1w1Path, a1w1Code, 'utf-8')
console.log('✅ A1 Week 1 quality sample updated')

// 3. POS corrections map: file -> list of { id, correctPos }
const posFixes: Record<string, Array<{ id: string; pos: string }>> = {
  'a1/week-03.ts': [
    { id: 'voc_a1_woman_001', pos: 'noun' },
    { id: 'voc_a1_meet_001', pos: 'verb' },
  ],
  'a1/week-05.ts': [
    { id: 'voc_a1_home_001', pos: 'noun' },
    { id: 'voc_a1_air-conditioner_001', pos: 'noun' },
    { id: 'voc_a1_address_001', pos: 'noun' },
  ],
  'a1/week-06.ts': [
    { id: 'voc_a1_waiter-waitress_001', pos: 'noun' },
  ],
  'a1/week-09.ts': [
    { id: 'voc_a1_sea_001', pos: 'noun' },
    { id: 'voc_a1_address_002', pos: 'noun' },
  ],
  'a1/week-11.ts': [
    { id: 'voc_a1_principal_001', pos: 'noun' },
  ],
  'a1/week-12.ts': [
    { id: 'voc_a1_reservation_001', pos: 'noun' },
    { id: 'voc_a1_drivers-license_001', pos: 'noun' },
  ],
  'a1/week-15.ts': [
    { id: 'voc_a1_hope_001', pos: 'verb' },
    { id: 'voc_a1_apologize_001', pos: 'verb' },
  ],
  'a1/week-16.ts': [
    { id: 'voc_a1_series_001', pos: 'noun' },
  ],
  'a1/week-17.ts': [
    { id: 'voc_a1_pair_001', pos: 'noun' },
    { id: 'voc_a1_service_001', pos: 'noun' },
    { id: 'voc_a1_direction_001', pos: 'noun' },
    { id: 'voc_a1_solar_001', pos: 'adjective' },
  ],
  'a2/week-01.ts': [
    { id: 'voc_a2_customer-service_007', pos: 'noun' },
    { id: 'voc_a2_standard-delivery_033', pos: 'noun' },
  ],
  'a2/week-02.ts': [
    { id: 'voc_a2_check-in_065', pos: 'noun' },
    { id: 'voc_a2_double-room_069', pos: 'noun' },
    { id: 'voc_a2_wake-up-call_076', pos: 'noun' },
    { id: 'voc_a2_mini-bar_077', pos: 'noun' },
    { id: 'voc_a2_overbooked_083', pos: 'adjective' },
    { id: 'voc_a2_embassy_098', pos: 'noun' },
    { id: 'voc_a2_consulate_099', pos: 'noun' },
  ],
  'a2/week-03.ts': [
    { id: 'voc_a2_stakeholder_163', pos: 'noun' },
  ],
  'a2/week-04.ts': [
    { id: 'voc_a2_chronic_213', pos: 'adjective' },
    { id: 'voc_a2_acute_214', pos: 'adjective' },
    { id: 'voc_a2_liver_218', pos: 'noun' },
    { id: 'voc_a2_nervous-system_225', pos: 'noun' },
    { id: 'voc_a2_digestive-system_226', pos: 'noun' },
    { id: 'voc_a2_nutrient_229', pos: 'noun' },
    { id: 'voc_a2_overweight_235', pos: 'adjective' },
    { id: 'voc_a2_underweight_236', pos: 'adjective' },
    { id: 'voc_a2_wellness_238', pos: 'noun' },
  ],
  'a2/week-06.ts': [
    { id: 'voc_a2_arguably_319', pos: 'adverb' },
    { id: 'voc_a2_tornado_336', pos: 'noun' },
    { id: 'voc_a2_hailstorm_341', pos: 'noun' },
  ],
  'a2/week-07.ts': [
    { id: 'voc_a2_certificate_381', pos: 'noun' },
    { id: 'voc_a2_extracurricular_404', pos: 'adjective' },
    { id: 'voc_a2_dropout_407', pos: 'noun' },
  ],
  'a2/week-09.ts': [
    { id: 'voc_a2_router_473', pos: 'noun' },
  ],
  'a2/week-11.ts': [
    { id: 'voc_a2_fuse_569', pos: 'noun' },
    { id: 'voc_a2_wiring_570', pos: 'noun' },
    { id: 'voc_a2_estimate_595', pos: 'noun' },
  ],
  'a2/week-12.ts': [
    { id: 'voc_a2_opponent_608', pos: 'noun' },
    { id: 'voc_a2_substitute_628', pos: 'noun' },
  ],
  'a2/week-13.ts': [
    { id: 'voc_a2_headline_645', pos: 'noun' },
    { id: 'voc_a2_influencer_673', pos: 'noun' },
    { id: 'voc_a2_viral_674', pos: 'adjective' },
    { id: 'voc_a2_trending_675', pos: 'adjective' },
    { id: 'voc_a2_live-stream_677', pos: 'noun' },
    { id: 'voc_a2_stand-up-comedy_682', pos: 'noun' },
  ],
  'b1/week-07.ts': [
    { id: 'voc_b1_supply_174', pos: 'noun' },
  ],
  'b1/week-08.ts': [
    { id: 'voc_b1_compliment_191', pos: 'verb' },
    { id: 'voc_b1_complain_192', pos: 'verb' },
    { id: 'voc_b1_admire_200', pos: 'verb' },
    { id: 'voc_b1_resent_202', pos: 'verb' },
  ],
  'b2/week-01.ts': [
    { id: 'voc_b2_rhetoric_005', pos: 'noun' },
  ],
}

// A1 Week 14 prepositions & determiners
const w14Adverbs = ['how-much', 'how-often', 'how-long', 'however', 'also', 'either', 'neither', 'up', 'down']
const w14Prepositions = ['above', 'below', 'inside', 'outside', 'onto', 'across', 'along', 'around', 'during', 'without', 'against', 'toward']
const w14Determiners = ['both', 'all', 'every', 'each', 'some', 'any', 'many', 'much', 'few', 'little', 'several', 'other', 'another', 'such']
const w14Conjunctions = ['than', 'while']

const a1w14Path = path.join(contentDir, 'a1/week-14.ts')
if (fs.existsSync(a1w14Path)) {
  let code = fs.readFileSync(a1w14Path, 'utf-8')
  w14Adverbs.forEach(word => {
    code = code.replace(new RegExp(`(word:\\s*['"]${word}['"][\\s\\S]*?partOfSpeech:\\s*['"])[^'"]+(['"])`, 'g'), `$1adverb$2`)
  })
  w14Prepositions.forEach(word => {
    code = code.replace(new RegExp(`(word:\\s*['"]${word}['"][\\s\\S]*?partOfSpeech:\\s*['"])[^'"]+(['"])`, 'g'), `$1preposition$2`)
  })
  w14Determiners.forEach(word => {
    code = code.replace(new RegExp(`(word:\\s*['"]${word}['"][\\s\\S]*?partOfSpeech:\\s*['"])[^'"]+(['"])`, 'g'), `$1determiner$2`)
  })
  w14Conjunctions.forEach(word => {
    code = code.replace(new RegExp(`(word:\\s*['"]${word}['"][\\s\\S]*?partOfSpeech:\\s*['"])[^'"]+(['"])`, 'g'), `$1conjunction$2`)
  })
  fs.writeFileSync(a1w14Path, code, 'utf-8')
  console.log('✅ A1 Week 14 POS fixed')
}

// A1 Week 15 adverbs
const w15Adverbs = [
  'carefully', 'loudly', 'quietly', 'suddenly', 'finally', 'immediately', 'recently', 'yet', 'again',
  'almost', 'only', 'just', 'even', 'maybe', 'perhaps', 'probably', 'certainly', 'actually', 'exactly',
  'especially', 'generally', 'rarely', 'hardly', 'enough', 'a lot', 'a little', 'more', 'less', 'most', 'least'
]
const a1w15Path = path.join(contentDir, 'a1/week-15.ts')
if (fs.existsSync(a1w15Path)) {
  let code = fs.readFileSync(a1w15Path, 'utf-8')
  w15Adverbs.forEach(word => {
    code = code.replace(new RegExp(`(word:\\s*['"]${word}['"][\\s\\S]*?partOfSpeech:\\s*['"])[^'"]+(['"])`, 'g'), `$1adverb$2`)
  })
  fs.writeFileSync(a1w15Path, code, 'utf-8')
  console.log('✅ A1 Week 15 POS fixed')
}

// A1 Week 18 abstract nouns
const w18Nouns = [
  'idea', 'opinion', 'decision', 'solution', 'problem', 'reason', 'result', 'effect', 'cause',
  'example', 'fact', 'information', 'rule', 'law', 'permission', 'freedom', 'responsibility',
  'duty', 'purpose', 'project', 'task', 'effort', 'chance', 'opportunity', 'risk', 'success',
  'failure', 'mistake', 'experience', 'knowledge', 'skill', 'ability', 'talent', 'memory',
  'imagination', 'attention', 'focus', 'courage', 'fear', 'faith', 'trust', 'doubt', 'truth',
  'lie', 'secret', 'agreement', 'conflict', 'peace', 'war', 'justice', 'equality', 'value'
]
const a1w18Path = path.join(contentDir, 'a1/week-18.ts')
if (fs.existsSync(a1w18Path)) {
  let code = fs.readFileSync(a1w18Path, 'utf-8')
  w18Nouns.forEach(word => {
    code = code.replace(new RegExp(`(word:\\s*['"]${word}['"][\\s\\S]*?partOfSpeech:\\s*['"])[^'"]+(['"])`, 'g'), `$1noun$2`)
  })
  fs.writeFileSync(a1w18Path, code, 'utf-8')
  console.log('✅ A1 Week 18 POS fixed')
}

// Apply granular POS fixes
for (const [relFile, fixes] of Object.entries(posFixes)) {
  const filePath = path.join(contentDir, relFile)
  if (fs.existsSync(filePath)) {
    let code = fs.readFileSync(filePath, 'utf-8')
    fixes.forEach(({ id, pos }) => {
      code = code.replace(new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?partOfSpeech:\\s*['"])[^'"]+(['"])`, 'm'), `$1${pos}$2`)
    })
    fs.writeFileSync(filePath, code, 'utf-8')
    console.log(`✅ ${relFile} POS fixes applied (${fixes.length} items)`)
  }
}

console.log('🎉 All curriculum corrections applied successfully!')
