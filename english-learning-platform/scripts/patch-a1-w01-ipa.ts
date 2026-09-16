import fs from 'node:fs'
import path from 'node:path'

const week01Path = path.resolve(__dirname, '../packages/content/src/a1/week-01.ts')
let code = fs.readFileSync(week01Path, 'utf-8')

const ipaData: Record<string, { id: string; ipa: string; example: string; exampleTranslation: string }> = {
  it: { id: 'voc_a1_it_001', ipa: '/ɪt/', example: 'It is a sunny day.', exampleTranslation: 'Es un día soleado.' },
  they: { id: 'voc_a1_they_001', ipa: '/ðeɪ/', example: 'They are my brothers.', exampleTranslation: 'Ellos son mis hermanos.' },
  your: { id: 'voc_a1_your_001', ipa: '/jɔːr/', example: 'What is your name?', exampleTranslation: '¿Cuál es tu nombre?' },
  his: { id: 'voc_a1_his_001', ipa: '/hɪz/', example: 'His car is blue.', exampleTranslation: 'Su carro es azul.' },
  her: { id: 'voc_a1_her_001', ipa: '/hɜːr/', example: 'Her sister is a teacher.', exampleTranslation: 'Su hermana es maestra.' },
  its: { id: 'voc_a1_its_001', ipa: '/ɪts/', example: 'The cat licked its paw.', exampleTranslation: 'El gato lamió su pata.' },
  our: { id: 'voc_a1_our_001', ipa: '/ˈaʊər/', example: 'Our house is near the school.', exampleTranslation: 'Nuestra casa está cerca de la escuela.' },
  their: { id: 'voc_a1_their_001', ipa: '/ðɛr/', example: 'Their office is closed.', exampleTranslation: 'Su oficina está cerrada.' },
  mine: { id: 'voc_a1_mine_001', ipa: '/maɪn/', example: 'This book is mine.', exampleTranslation: 'Este libro es mío.' },
  that: { id: 'voc_a1_that_001', ipa: '/ðæt/', example: 'That house is very big.', exampleTranslation: 'Esa casa es muy grande.' },
  these: { id: 'voc_a1_these_001', ipa: '/ðiːz/', example: 'These shoes are comfortable.', exampleTranslation: 'Estos zapatos son cómodos.' },
  those: { id: 'voc_a1_those_001', ipa: '/ðoʊz/', example: 'Those trees are tall.', exampleTranslation: 'Esos árboles son altos.' },
  was: { id: 'voc_a1_was_001', ipa: '/wʌz/', example: 'He was happy yesterday.', exampleTranslation: 'Él estaba feliz ayer.' },
  were: { id: 'voc_a1_were_001', ipa: '/wɜːr/', example: 'They were in the park.', exampleTranslation: 'Ellos estaban en el parque.' },
  be: { id: 'voc_a1_be_001', ipa: '/biː/', example: 'You should be patient.', exampleTranslation: 'Deberías ser paciente.' },
  been: { id: 'voc_a1_been_001', ipa: '/bɪn/', example: 'I have been busy today.', exampleTranslation: 'He estado ocupado hoy.' },
  being: { id: 'voc_a1_being_001', ipa: '/ˈbiːɪŋ/', example: 'She is being very polite.', exampleTranslation: 'Ella está siendo muy educada.' },
  has: { id: 'voc_a1_has_001', ipa: '/hæz/', example: 'She has two dogs.', exampleTranslation: 'Ella tiene dos perros.' },
  had: { id: 'voc_a1_had_001', ipa: '/hæd/', example: 'We had a good time.', exampleTranslation: 'La pasamos bien.' },
  having: { id: 'voc_a1_having_001', ipa: '/ˈhævɪŋ/', example: 'They are having lunch.', exampleTranslation: 'Ellos están almorzando.' },
  does: { id: 'voc_a1_does_001', ipa: '/dʌz/', example: 'He does his homework every evening.', exampleTranslation: 'Él hace su tarea cada noche.' },
  doing: { id: 'voc_a1_doing_001', ipa: '/ˈduːɪŋ/', example: 'What are you doing now?', exampleTranslation: '¿Qué estás haciendo ahora?' },
  done: { id: 'voc_a1_done_001', ipa: '/dʌn/', example: 'The project is finally done.', exampleTranslation: 'El proyecto finalmente está terminado.' },
  hi: { id: 'voc_a1_hi_001', ipa: '/haɪ/', example: 'Hi, how can I help you?', exampleTranslation: 'Hola, ¿cómo te puedo ayudar?' },
  bye: { id: 'voc_a1_bye_001', ipa: '/baɪ/', example: 'Bye, see you tomorrow!', exampleTranslation: '¡Chao, nos vemos mañana!' },
  'good afternoon': { id: 'voc_a1_good-afternoon_001', ipa: '/ˌɡʊd ˌæftərˈnuːn/', example: 'Good afternoon, Mr. Davis.', exampleTranslation: 'Buenas tardes, señor Davis.' },
  'good evening': { id: 'voc_a1_good-evening_001', ipa: '/ˌɡʊd ˈiːvnɪŋ/', example: 'Good evening, welcome to our restaurant.', exampleTranslation: 'Buenas noches, bienvenidos a nuestro restaurante.' },
  'good night': { id: 'voc_a1_good-night_001', ipa: '/ˌɡʊd ˈnaɪt/', example: 'Good night, sleep well.', exampleTranslation: 'Buenas noches, que duermas bien.' },
  thanks: { id: 'voc_a1_thanks_001', ipa: '/θæŋks/', example: 'Thanks for your assistance.', exampleTranslation: 'Gracias por tu ayuda.' },
  'excuse me': { id: 'voc_a1_excuse-me_001', ipa: '/ɪkˈskjuːz miː/', example: 'Excuse me, where is the station?', exampleTranslation: 'Disculpe, ¿dónde está la estación?' },
  ok: { id: 'voc_a1_ok_001', ipa: '/oʊˈkeɪ/', example: 'Is it ok if I call you later?', exampleTranslation: '¿Está bien si te llamo más tarde?' },
  welcome: { id: 'voc_a1_welcome_001', ipa: '/ˈwɛlkəm/', example: 'Welcome to our team.', exampleTranslation: 'Bienvenido a nuestro equipo.' },
  'nice to meet you': { id: 'voc_a1_nice-to-meet-you_001', ipa: '/ˌnaɪs tu ˈmiːt ju/', example: 'Hello Sarah, nice to meet you.', exampleTranslation: 'Hola Sarah, mucho gusto.' },
  'how are you': { id: 'voc_a1_how-are-you_001', ipa: '/ˌhaʊ ɑːr ˈjuː/', example: 'How are you feeling today?', exampleTranslation: '¿Cómo te sientes hoy?' },
  fine: { id: 'voc_a1_fine_001', ipa: '/faɪn/', example: 'I am fine, thank you.', exampleTranslation: 'Estoy bien, gracias.' },
  two: { id: 'voc_a1_two_001', ipa: '/tuː/', example: 'I have two tickets for the concert.', exampleTranslation: 'Tengo dos boletos para el concierto.' },
  three: { id: 'voc_a1_three_001', ipa: '/θriː/', example: 'We have three meetings today.', exampleTranslation: 'Tenemos tres reuniones hoy.' },
  four: { id: 'voc_a1_four_001', ipa: '/fɔːr/', example: 'There are four chairs around the table.', exampleTranslation: 'Hay cuatro sillas alrededor de la mesa.' },
  five: { id: 'voc_a1_five_001', ipa: '/faɪv/', example: 'She works five days a week.', exampleTranslation: 'Ella trabaja cinco días a la semana.' },
  six: { id: 'voc_a1_six_001', ipa: '/sɪks/', example: 'The store opens at six in the morning.', exampleTranslation: 'La tienda abre a las seis de la mañana.' },
  seven: { id: 'voc_a1_seven_001', ipa: '/ˈsɛvən/', example: 'He has seven cousins in California.', exampleTranslation: 'Él tiene siete primos en California.' },
  eight: { id: 'voc_a1_eight_001', ipa: '/eɪt/', example: 'The train leaves at eight o\'clock.', exampleTranslation: 'El tren sale a las ocho en punto.' },
  nine: { id: 'voc_a1_nine_001', ipa: '/naɪn/', example: 'She bought nine apples at the market.', exampleTranslation: 'Ella compró nueve manzanas en el mercado.' },
  eleven: { id: 'voc_a1_eleven_001', ipa: '/ɪˈlɛvən/', example: 'There are eleven players on each soccer team.', exampleTranslation: 'Hay once jugadores en cada equipo de fútbol.' },
  twelve: { id: 'voc_a1_twelve_001', ipa: '/twɛlv/', example: 'A year has twelve months.', exampleTranslation: 'Un año tiene doce meses.' },
  thirteen: { id: 'voc_a1_thirteen_001', ipa: '/ˌθɜːrˈtiːn/', example: 'My daughter turns thirteen next month.', exampleTranslation: 'Mi hija cumple trece años el próximo mes.' },
  fourteen: { id: 'voc_a1_fourteen_001', ipa: '/ˌfɔːrˈtiːn/', example: 'The trip lasted fourteen days.', exampleTranslation: 'El viaje duró catorce días.' },
  fifteen: { id: 'voc_a1_fifteen_001', ipa: '/ˌfɪfˈtiːn/', example: 'The bus arrives in fifteen minutes.', exampleTranslation: 'El autobús llega en quince minutos.' },
  sixteen: { id: 'voc_a1_sixteen_001', ipa: '/ˌsɪksˈtiːn/', example: 'You can drive when you are sixteen.', exampleTranslation: 'Puedes conducir cuando tienes dieciséis años.' },
  seventeen: { id: 'voc_a1_seventeen_001', ipa: '/ˌsɛvənˈtiːn/', example: 'There are seventeen students in the class.', exampleTranslation: 'Hay diecisiete estudiantes en la clase.' },
  eighteen: { id: 'voc_a1_eighteen_001', ipa: '/ˌeɪˈtiːn/', example: 'He became an adult at eighteen.', exampleTranslation: 'Él se convirtió en adulto a los dieciocho años.' },
  nineteen: { id: 'voc_a1_nineteen_001', ipa: '/ˌnaɪnˈtiːn/', example: 'Room nineteen is on the second floor.', exampleTranslation: 'La habitación diecinueve está en el segundo piso.' },
  twenty: { id: 'voc_a1_twenty_001', ipa: '/ˈtwɛnti/', example: 'I walked twenty blocks this morning.', exampleTranslation: 'Caminé veinte cuadras esta mañana.' },
  who: { id: 'voc_a1_who_001', ipa: '/huː/', example: 'Who is the manager of this store?', exampleTranslation: '¿Quién es el gerente de esta tienda?' },
  when: { id: 'voc_a1_when_001', ipa: '/wɛn/', example: 'When does the class start?', exampleTranslation: '¿Cuándo empieza la clase?' },
  why: { id: 'voc_a1_why_001', ipa: '/waɪ/', example: 'Why is the door locked?', exampleTranslation: '¿Por qué está cerrada la puerta?' },
  how: { id: 'voc_a1_how_001', ipa: '/haʊ/', example: 'How do you spell your last name?', exampleTranslation: '¿Cómo se escribe tu apellido?' },
  which: { id: 'voc_a1_which_001', ipa: '/wɪtʃ/', example: 'Which bus goes to downtown?', exampleTranslation: '¿Cuál autobús va al centro?' },
  name: { id: 'voc_a1_name_001', ipa: '/neɪm/', example: 'Please write your full name here.', exampleTranslation: 'Por favor escribe tu nombre completo aquí.' },
  age: { id: 'voc_a1_age_001', ipa: '/eɪdʒ/', example: 'State your age on the application form.', exampleTranslation: 'Indica tu edad en el formulario de solicitud.' },
  and: { id: 'voc_a1_and_001', ipa: '/ænd/', example: 'She likes coffee and tea.', exampleTranslation: 'A ella le gusta el café y el té.' },
  or: { id: 'voc_a1_or_001', ipa: '/ɔːr/', example: 'Do you prefer morning or afternoon?', exampleTranslation: '¿Prefieres la mañana o la tarde?' },
  but: { id: 'voc_a1_but_001', ipa: '/bʌt/', example: 'The hotel was small but clean.', exampleTranslation: 'El hotel era pequeño pero limpio.' },
  a: { id: 'voc_a1_a_001', ipa: '/ə/', example: 'He is reading a fascinating book.', exampleTranslation: 'Él está leyendo un libro fascinante.' },
  an: { id: 'voc_a1_an_001', ipa: '/æn/', example: 'She ate an apple before working out.', exampleTranslation: 'Ella comió una manzana antes de entrenar.' },
  the: { id: 'voc_a1_the_001', ipa: '/ðə/', example: 'The weather is great today.', exampleTranslation: 'El clima está excelente hoy.' },
  not: { id: 'voc_a1_not_001', ipa: '/nɑːt/', example: 'I am not available this afternoon.', exampleTranslation: 'No estoy disponible esta tarde.' },
  very: { id: 'voc_a1_very_001', ipa: '/ˈvɛri/', example: 'The coffee is very hot.', exampleTranslation: 'El café está muy caliente.' },
  too: { id: 'voc_a1_too_001', ipa: '/tuː/', example: 'The shoes are too tight for me.', exampleTranslation: 'Los zapatos son demasiado apretados para mí.' },
  here: { id: 'voc_a1_here_001', ipa: '/hɪr/', example: 'Please sign your name right here.', exampleTranslation: 'Por favor firma tu nombre justo aquí.' },
  there: { id: 'voc_a1_there_001', ipa: '/ðɛr/', example: 'The library is over there.', exampleTranslation: 'La biblioteca está allá.' },
}

let patched = 0

for (const data of Object.values(ipaData)) {
  const needle = `id: '${data.id}',`
  const index = code.indexOf(needle)
  if (index === -1) {
    console.warn(`Could not find id: ${data.id}`)
    continue
  }

  // Find the next `status: 'approved',` after needle
  const statusStr = "status: 'approved',"
  const statusIndex = code.indexOf(statusStr, index)
  if (statusIndex === -1 || statusIndex - index > 600) {
    console.warn(`Could not find status after id: ${data.id}`)
    continue
  }

  const cleanIpa = data.ipa.replace(/'/g, "\\'")
  const cleanEx = data.example.replace(/'/g, "\\'")
  const cleanTr = data.exampleTranslation.replace(/'/g, "\\'")

  const replacement = `pronunciation: '${cleanIpa}',\n      example: '${cleanEx}',\n      exampleTranslation: '${cleanTr}',\n      status: 'approved',`

  code = code.slice(0, statusIndex) + replacement + code.slice(statusIndex + statusStr.length)
  patched++
}

fs.writeFileSync(week01Path, code, 'utf-8')
console.log(`Cleanly patched ${patched}/${Object.keys(ipaData).length} items in week-01.ts!`)
