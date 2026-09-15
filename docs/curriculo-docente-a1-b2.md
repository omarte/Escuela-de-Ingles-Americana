# Dossier Curricular Completo (A1, A2, B1, B2)
### Escuela de Inglés Americana • Revisión y Verificación Docente

> **Propósito:** Documento unificado de auditoría curricular para el cuerpo docente y comité académico. Contiene el inventario exhaustivo de vocabulario estructurado por semana, fonética nativa, oraciones contextuales bilingües, lecturas con comprensión, ejercicios de gramática aplicada y prompts de producción escrita con rúbrica pedagógica.

---

## 📊 Ficha Técnica del Currículo

| Métrica | Valor | Descripción pedagógica |
|---|---|---|
| **Marco Pedagógico** | MCER / CEFR | Niveles A1 (Acceso), A2 (Plataforma), B1 (Umbral), B2 (Avanzado) |
| **Vocabulario Total** | **2556 palabras** | Enriquecidas con IPA, categoría gramatical, traducción y ejemplo contextual |
| - Nivel A1 | 1512 palabras | 19 semanas temáticas (comunicación básica y supervivencia cotidiana) |
| - Nivel A2 | 734 palabras | 15 semanas temáticas (descripciones, rutinas, pasado, viajes y trabajo) |
| - Nivel B1 | 226 palabras | 9 semanas temáticas (opiniones, cultura, relaciones complejas y vida laboral) |
| - Nivel B2 | 84 palabras | 5 semanas temáticas (negocios, debate formal, academia y liderazgo) |
| **Lecturas Contextuales** | **16 lecturas** | Textos graduados con preguntas de opción múltiple y vocabulario enlazado |
| **Ejercicios de Gramática B1** | **45 ejercicios** | 15 temas de gramática aplicada con huecos (*Fill in the blanks*) y explicación |
| **Prompts de Escritura B2** | **13 tareas** | Tareas de producción libre con rúbrica de evaluación docente (120-200 palabras) |
| **Algoritmo de Retención** | SuperMemo SM-2 | Repetición espaciada adaptativa según la curva del olvido |
| **Modelo de Contenido** | 100% Curaduría Humana | Sin generación sintética; supervisado para hispanohablantes |

---

## 🎓 Principios Pedagógicos y Reglas de Curaduría (Single Source of Truth)

### 1. Principio Rector: La Regla Inquebrantable del Léxico Acumulativo ($i+1$)
> **Política de Curaduría:** Ninguna lectura, micro-examen o ejemplo puede contener vocabulario que no haya sido introducido formalmente en la semana actual o en semanas anteriores.

- **Semana $N$** solo puede usar vocabulario curricular de las **Semanas $1$ a $N$**.
- **Cero Excepciones:** Introducir palabras "del futuro" (ej. usar *dog* en la Semana 1 cuando se enseña en la Semana 10) genera el *Choque Nivel Cero* y destruye la autoeficacia del estudiante.
- **Guardia Automatizado:** Todo el contenido debe pasar el script `pnpm validate:cumulative` antes de integrarse. Si el script falla, el merge es rechazado automáticamente por el CI.

### 2. Reubicación Oficial y Cronograma de Lecturas Contextuales
Para cumplir con la regla $i+1$ sin reescribir textos pedagógicos ya validados, las siguientes lecturas han sido asignadas a las semanas donde **el 100% de su vocabulario ya fue enseñado**:

| ID de Lectura | Título | Nivel | Semana Original | **Semana Oficial Actual** | Vocabulario Límite que Determina la Semana |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `rdg_a1_001` | My Daily Routine and Family | A1 | 1 | **10** | `dog` (Sem. 10), `wake up` (Sem. 8), `chicken/milk/rice` (Sem. 6) |
| `rdg_a1_002` | A Morning in the City | A1 | 9 | **12** | `bus` (Sem. 12), `doctor` (Sem. 11), `nature` (Sem. 10) |
| `rdg_a1_003` | Shopping at the Supermarket | A1 | 6 | **11** | `cashier` (Sem. 11), `supermarket` (Sem. 9) |
| `rdg_b2_001` | The Ethical Dilemma of Advanced AI | B2 | 1 | **5** | `scrutinise`, `ethical`, `unprecedented` (Sem. 5), `automation` (Sem. 3) |
| `rdg_b2_002` | Strategic Leadership in Mergers | B2 | 2 | **5** | `leadership`, `strategy`, `merger`, `compliance` (Sem. 5) |

*(Nota pedagógica: Las preguntas de comprensión de lectura en las semanas iniciales de A1 deben contar con andamiaje bilingüe para evitar fricción con auxiliares interrogativos no enseñados aún).*

### 3. Dinámicas Cognitivas Integradas en la Plataforma
Cada unidad lectiva se entrega a través de 4 fases cognitivas estructuradas:

1. **Pre-Flight Warm-Up (1-2 min):** Activación de 5 a 8 palabras de la semana anterior antes de desbloquear nuevo contenido léxico.
2. **Sesión SRS con Telemetría Cognitiva:** El algoritmo SM-2 registra `latency_ms`. Si la respuesta tarda $> 7000$ ms, se detecta *fricción oculta* y la calidad efectiva se degrada a un máximo de 3 para programar un repaso más cercano.
3. **Bucle de Fijación Inmediata (Hot Re-injection):** Si una palabra presenta fallo (`quality < 3`) o fricción (`latency > 7s`), el sistema la re-inserta 2 posiciones adelante en la sesión activa para consolidarla en memoria operativa.
4. **Micro-Examen Contextual (Cloze):** Al completar la sesión, el alumno resuelve un micro-reto Cloze de 1 pregunta usando oraciones curadas de `@elp/content` con distractores deterministas del mismo nivel y categoría gramatical. **Cero IA sintética**.
5. **Feedback del Mentor Sincero:** Micro-encuesta de 1 tap post-sesión (`👍 Fácil`, `💡 Normal`, `⚠️ Me costó`) combinada con resumen transparente de palabras con fricción.

### 4. Protocolo de "Modo Rescate" (Anti-Abandono)
- **Gatillo:** Si un alumno acumula **> 30 tarjetas pendientes de repaso**, el sistema oculta el contador abrumador.
- **Interfaz:** Muestra el banner *"🛡️ Modo Rescate activo: Sesión enfocada · Solo 10 palabras · Sin presión"*.
- **Priorización:** El motor selecciona exclusivamente las 10 tarjetas con menor factor de facilidad (`easeFactor`) para restaurar la confianza del estudiante de manera rápida.

### 5. Telemetría Docente: El "Mapa de Calor" de Fricción
El equipo de curaduría curricular debe evaluar periódicamente la telemetría agregada de la plataforma:

- **Métrica Clave:** `latency_ms > 7000` o `friction_flagged = true`.
- **Protocolo de Acción (Regla del 30%):** Si un término o reactivo supera el **30% de tasa de fricción** en los estudiantes:
  1. **Principio ético docente:** Jamás culpar al estudiante ni asumir desatención.
  2. **Auditoría del reactivo:** Verificar si la acepción en español es ambigua, si el audio fonético genera confusión, o si el ejemplo contextual utiliza estructuras complejas.
  3. **Ajuste curricular:** Refinar la traducción, el ejemplo o los distractores directamente en el archivo `week-XX.ts` y sincronizar la base de datos.

---

## 📘 Nivel A1 (Principiante · Breakthrough)

- **Semanas lectivas:** 19 semanas
- **Total vocabulario:** 1512 palabras
- **Lecturas integradas:** 3 textos con evaluación

### Semana 1: Semana 1 – Pronombres, verbos SER/ESTAR/TENER/HACER y saludos
Total de palabras en esta semana: **96**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_i_001` | **I** | *pronoun* | `/aɪ/` | yo | I am a student. | Yo soy estudiante. |
| `voc_a1_you_001` | **you** | *pronoun* | `/juː/` | tú / usted | You are my friend. | Tú eres mi amigo. |
| `voc_a1_he_001` | **he** | *pronoun* | `/hiː/` | él | He is tall. | Él es alto. |
| `voc_a1_she_001` | **she** | *pronoun* | `/ʃiː/` | ella | She lives in Mexico. | Ella vive en México. |
| `voc_a1_it_001` | **it** | *pronoun* | — | eso / ello | — | — |
| `voc_a1_we_001` | **we** | *pronoun* | `/wiː/` | nosotros | We are happy today. | Estamos felices hoy. |
| `voc_a1_they_001` | **they** | *pronoun* | — | ellos | — | — |
| `voc_a1_my_001` | **my** | *determiner* | `/maɪ/` | mi | This is my house. | Esta es mi casa. |
| `voc_a1_your_001` | **your** | *determiner* | — | tu | — | — |
| `voc_a1_his_001` | **his** | *pronoun* | — | su (de él) | — | — |
| `voc_a1_her_001` | **her** | *determiner* | — | su (de ella) | — | — |
| `voc_a1_its_001` | **its** | *determiner* | — | su (de eso) | — | — |
| `voc_a1_our_001` | **our** | *determiner* | — | nuestro | — | — |
| `voc_a1_their_001` | **their** | *determiner* | — | su (de ellos) | — | — |
| `voc_a1_mine_001` | **mine** | *pronoun* | — | mío | — | — |
| `voc_a1_this_001` | **this** | *pronoun* | `/ðɪs/` | este/esto | This is my brother. | Este es mi hermano. |
| `voc_a1_that_001` | **that** | *pronoun* | — | ese/eso | — | — |
| `voc_a1_these_001` | **these** | *pronoun* | — | estos | — | — |
| `voc_a1_those_001` | **those** | *pronoun* | — | esos | — | — |
| `voc_a1_am_001` | **am** | *verb* | `/æm/` | soy/estoy | I am from Canada. | Soy de Canadá. |
| `voc_a1_is_001` | **is** | *verb* | `/ɪz/` | es/está | She is a doctor. | Ella es médica. |
| `voc_a1_are_001` | **are** | *verb* | `/ɑːr/` | son/están | They are at home. | Ellos están en casa. |
| `voc_a1_was_001` | **was** | *verb* | — | era/estaba | — | — |
| `voc_a1_were_001` | **were** | *verb* | — | eran/estaban | — | — |
| `voc_a1_be_001` | **be** | *verb* | — | ser/estar | — | — |
| `voc_a1_been_001` | **been** | *verb* | — | sido/estado | — | — |
| `voc_a1_being_001` | **being** | *verb* | — | siendo | — | — |
| `voc_a1_have_001` | **have** | *verb* | `/hæv/` | tener | I have two brothers. | Tengo dos hermanos. |
| `voc_a1_has_001` | **has** | *verb* | — | tiene | — | — |
| `voc_a1_had_001` | **had** | *verb* | — | tenía/tuvo | — | — |
| `voc_a1_having_001` | **having** | *verb* | — | teniendo | — | — |
| `voc_a1_do_001` | **do** | *verb* | `/duː/` | hacer | I do my homework every day. | Hago mi tarea todos los días. |
| `voc_a1_does_001` | **does** | *verb* | — | hace | — | — |
| `voc_a1_did_001` | **did** | *verb* | `/dɪd/` | hizo | She did the dishes. | Ella lavó los platos. |
| `voc_a1_doing_001` | **doing** | *verb* | — | haciendo | — | — |
| `voc_a1_done_001` | **done** | *verb* | — | hecho | — | — |
| `voc_a1_hello_001` | **hello** | *interjection* | `/həˈloʊ/` | hola | Hello, how are you? | Hola, ¿cómo estás? |
| `voc_a1_hi_001` | **hi** | *interjection* | — | hola | — | — |
| `voc_a1_goodbye_001` | **goodbye** | *interjection* | `/ˌɡʊdˈbaɪ/` | adiós | Goodbye, see you tomorrow. | Adiós, nos vemos mañana. |
| `voc_a1_bye_001` | **bye** | *interjection* | — | chao | — | — |
| `voc_a1_good-morning_001` | **good morning** | *interjection* | `/ɡʊd ˈmɔːrnɪŋ/` | buenos días | Good morning, everyone! | ¡Buenos días a todos! |
| `voc_a1_good-afternoon_001` | **good afternoon** | *interjection* | — | buenas tardes | — | — |
| `voc_a1_good-evening_001` | **good evening** | *interjection* | — | buenas noches (saludo) | — | — |
| `voc_a1_good-night_001` | **good night** | *interjection* | — | buenas noches (despedida) | — | — |
| `voc_a1_please_001` | **please** | *interjection* | `/pliːz/` | por favor | Please, sit down. | Por favor, siéntate. |
| `voc_a1_thank-you_001` | **thank you** | *interjection* | `/θæŋk juː/` | gracias | Thank you for your help. | Gracias por tu ayuda. |
| `voc_a1_thanks_001` | **thanks** | *interjection* | — | gracias | — | — |
| `voc_a1_sorry_001` | **sorry** | *interjection* | `/ˈsɑːri/` | perdón | Sorry, I am late. | Perdón, llego tarde. |
| `voc_a1_excuse-me_001` | **excuse me** | *interjection* | — | disculpe | — | — |
| `voc_a1_yes_001` | **yes** | *interjection* | `/jɛs/` | sí | Yes, I understand. | Sí, entiendo. |
| `voc_a1_no_001` | **no** | *interjection* | `/noʊ/` | no | No, I don't have time. | No, no tengo tiempo. |
| `voc_a1_ok_001` | **ok** | *interjection* | — | de acuerdo | — | — |
| `voc_a1_welcome_001` | **welcome** | *interjection* | — | bienvenido | — | — |
| `voc_a1_nice-to-meet-you_001` | **nice to meet you** | *interjection* | — | mucho gusto | — | — |
| `voc_a1_how-are-you_001` | **how are you** | *interjection* | — | ¿cómo estás? | — | — |
| `voc_a1_fine_001` | **fine** | *noun* | — | bien | — | — |
| `voc_a1_one_001` | **one** | *noun* | `/wʌn/` | uno | I have one sister. | Tengo una hermana. |
| `voc_a1_two_001` | **two** | *noun* | — | dos | — | — |
| `voc_a1_three_001` | **three** | *noun* | — | tres | — | — |
| `voc_a1_four_001` | **four** | *noun* | — | cuatro | — | — |
| `voc_a1_five_001` | **five** | *noun* | — | cinco | — | — |
| `voc_a1_six_001` | **six** | *noun* | — | seis | — | — |
| `voc_a1_seven_001` | **seven** | *noun* | — | siete | — | — |
| `voc_a1_eight_001` | **eight** | *noun* | — | ocho | — | — |
| `voc_a1_nine_001` | **nine** | *noun* | — | nueve | — | — |
| `voc_a1_ten_001` | **ten** | *noun* | `/tɛn/` | diez | The bus arrives in ten minutes. | El autobús llega en diez minutos. |
| `voc_a1_eleven_001` | **eleven** | *noun* | — | once | — | — |
| `voc_a1_twelve_001` | **twelve** | *noun* | — | doce | — | — |
| `voc_a1_thirteen_001` | **thirteen** | *noun* | — | trece | — | — |
| `voc_a1_fourteen_001` | **fourteen** | *noun* | — | catorce | — | — |
| `voc_a1_fifteen_001` | **fifteen** | *noun* | — | quince | — | — |
| `voc_a1_sixteen_001` | **sixteen** | *noun* | — | dieciséis | — | — |
| `voc_a1_seventeen_001` | **seventeen** | *noun* | — | diecisiete | — | — |
| `voc_a1_eighteen_001` | **eighteen** | *noun* | — | dieciocho | — | — |
| `voc_a1_nineteen_001` | **nineteen** | *noun* | — | diecinueve | — | — |
| `voc_a1_twenty_001` | **twenty** | *noun* | — | veinte | — | — |
| `voc_a1_what_001` | **what** | *pronoun* | `/wʌt/` | qué | What is your name? | ¿Cómo te llamas? |
| `voc_a1_who_001` | **who** | *pronoun* | — | quién | — | — |
| `voc_a1_where_001` | **where** | *noun* | `/wɛr/` | dónde | Where do you live? | ¿Dónde vives? |
| `voc_a1_when_001` | **when** | *noun* | — | cuándo | — | — |
| `voc_a1_why_001` | **why** | *noun* | — | por qué | — | — |
| `voc_a1_how_001` | **how** | *noun* | — | cómo | — | — |
| `voc_a1_which_001` | **which** | *pronoun* | — | cuál | — | — |
| `voc_a1_name_001` | **name** | *noun* | — | nombre | — | — |
| `voc_a1_age_001` | **age** | *noun* | — | edad | — | — |
| `voc_a1_and_001` | **and** | *conjunction* | — | y | — | — |
| `voc_a1_or_001` | **or** | *conjunction* | — | o | — | — |
| `voc_a1_but_001` | **but** | *conjunction* | — | pero | — | — |
| `voc_a1_a_001` | **a** | *article* | — | un/una | — | — |
| `voc_a1_an_001` | **an** | *article* | — | un/una (ante vocal) | — | — |
| `voc_a1_the_001` | **the** | *article* | — | el/la | — | — |
| `voc_a1_not_001` | **not** | *adverb* | — | no | — | — |
| `voc_a1_very_001` | **very** | *adverb* | — | muy | — | — |
| `voc_a1_too_001` | **too** | *adverb* | — | también | — | — |
| `voc_a1_here_001` | **here** | *adverb* | — | aquí | — | — |
| `voc_a1_there_001` | **there** | *adverb* | — | allí | — | — |

### Semana 2: Semana 2 – Números, días, meses y expresiones de tiempo
Total de palabras en esta semana: **88**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_twenty-one_001` | **twenty-one** | *noun* | `/ˈtwɛntiˌwʌn/` | veintiuno | I am twenty-one years old. | Tengo veintiún años. |
| `voc_a1_thirty_001` | **thirty** | *noun* | `/ˈθɜrti/` | treinta | My mother is thirty years old. | Mi madre tiene treinta años. |
| `voc_a1_forty_001` | **forty** | *noun* | `/ˈfɔrti/` | cuarenta | The trip takes forty minutes. | El viaje toma cuarenta minutos. |
| `voc_a1_fifty_001` | **fifty** | *noun* | `/ˈfɪfti/` | cincuenta | There are fifty students in the school. | Hay cincuenta estudiantes en la escuela. |
| `voc_a1_sixty_001` | **sixty** | *noun* | `/ˈsɪksti/` | sesenta | An hour has sixty minutes. | Una hora tiene sesenta minutos. |
| `voc_a1_seventy_001` | **seventy** | *noun* | `/ˈsɛvənti/` | setenta | My grandfather is seventy years old. | Mi abuelo tiene setenta años. |
| `voc_a1_eighty_001` | **eighty** | *noun* | `/ˈeɪti/` | ochenta | She wants eighty dollars for the bike. | Ella quiere ochenta dólares por la bicicleta. |
| `voc_a1_ninety_001` | **ninety** | *noun* | `/ˈnaɪnti/` | noventa | The book has ninety pages. | El libro tiene noventa páginas. |
| `voc_a1_hundred_001` | **hundred** | *noun* | `/ˈhʌndrəd/` | cien | I have a hundred dollars. | Tengo cien dólares. |
| `voc_a1_thousand_001` | **thousand** | *noun* | `/ˈθaʊzənd/` | mil | The city has a thousand houses. | La ciudad tiene mil casas. |
| `voc_a1_first_001` | **first** | *noun* | `/fɜrst/` | primero | This is my first day at work. | Este es mi primer día de trabajo. |
| `voc_a1_second_001` | **second** | *noun* | `/ˈsɛkənd/` | segundo | Take the second door on the left. | Toma la segunda puerta a la izquierda. |
| `voc_a1_third_001` | **third** | *noun* | `/θɜrd/` | tercero | This is his third book. | Este es su tercer libro. |
| `voc_a1_fourth_001` | **fourth** | *noun* | `/fɔrθ/` | cuarto | We live on the fourth floor. | Vivimos en el cuarto piso. |
| `voc_a1_fifth_001` | **fifth** | *noun* | `/fɪfθ/` | quinto | Today is her fifth birthday. | Hoy es su quinto cumpleaños. |
| `voc_a1_last_001` | **last** | *noun* | `/læst/` | último | This is the last question. | Esta es la última pregunta. |
| `voc_a1_monday_001` | **Monday** | *noun* | `/ˈmʌndeɪ/` | lunes | I have class on Monday. | Tengo clase el lunes. |
| `voc_a1_tuesday_001` | **Tuesday** | *noun* | `/ˈtuzdeɪ/` | martes | We meet every Tuesday. | Nos reunimos todos los martes. |
| `voc_a1_wednesday_001` | **Wednesday** | *noun* | `/ˈwɛnzdeɪ/` | miércoles | The store is closed on Wednesday. | La tienda está cerrada el miércoles. |
| `voc_a1_thursday_001` | **Thursday** | *noun* | `/ˈθɜrzdeɪ/` | jueves | I work late on Thursday. | Trabajo hasta tarde el jueves. |
| `voc_a1_friday_001` | **Friday** | *noun* | `/ˈfraɪdeɪ/` | viernes | We go to the movies on Friday. | Vamos al cine el viernes. |
| `voc_a1_saturday_001` | **Saturday** | *noun* | `/ˈsætərdeɪ/` | sábado | I clean the house on Saturday. | Limpio la casa el sábado. |
| `voc_a1_sunday_001` | **Sunday** | *noun* | `/ˈsʌndeɪ/` | domingo | We rest on Sunday. | Descansamos el domingo. |
| `voc_a1_day_001` | **day** | *noun* | `/deɪ/` | día | Have a nice day! | ¡Que tengas un buen día! |
| `voc_a1_week_001` | **week** | *noun* | `/wik/` | semana | I see her once a week. | La veo una vez por semana. |
| `voc_a1_weekend_001` | **weekend** | *noun* | `/ˈwikˌɛnd/` | fin de semana | What are your plans for the weekend? | ¿Cuáles son tus planes para el fin de semana? |
| `voc_a1_january_001` | **January** | *noun* | `/ˈdʒænjuˌɛri/` | enero | My birthday is in January. | Mi cumpleaños es en enero. |
| `voc_a1_february_001` | **February** | *noun* | `/ˈfɛbruˌɛri/` | febrero | It is very cold in February. | Hace mucho frío en febrero. |
| `voc_a1_march_001` | **March** | *noun* | `/mɑrtʃ/` | marzo | Spring starts in March. | La primavera empieza en marzo. |
| `voc_a1_april_001` | **April** | *noun* | `/ˈeɪprəl/` | abril | It rains a lot in April. | Llueve mucho en abril. |
| `voc_a1_may_001` | **May** | *noun* | `/meɪ/` | mayo | We got married in May. | Nos casamos en mayo. |
| `voc_a1_june_001` | **June** | *noun* | `/dʒun/` | junio | School finishes in June. | La escuela termina en junio. |
| `voc_a1_july_001` | **July** | *noun* | `/dʒʊˈlaɪ/` | julio | We go to the beach in July. | Vamos a la playa en julio. |
| `voc_a1_august_001` | **August** | *noun* | `/ˈɔgəst/` | agosto | August is the hottest month. | Agosto es el mes más caluroso. |
| `voc_a1_september_001` | **September** | *noun* | `/sɛpˈtɛmbər/` | septiembre | Classes start in September. | Las clases empiezan en septiembre. |
| `voc_a1_october_001` | **October** | *noun* | `/ɑkˈtoʊbər/` | octubre | The leaves fall in October. | Las hojas caen en octubre. |
| `voc_a1_november_001` | **November** | *noun* | `/noʊˈvɛmbər/` | noviembre | It gets dark early in November. | Oscurece temprano en noviembre. |
| `voc_a1_december_001` | **December** | *noun* | `/dɪˈsɛmbər/` | diciembre | We celebrate the holidays in December. | Celebramos las fiestas en diciembre. |
| `voc_a1_spring_001` | **spring** | *noun* | `/sprɪŋ/` | primavera | The flowers grow in spring. | Las flores crecen en primavera. |
| `voc_a1_summer_001` | **summer** | *noun* | `/ˈsʌmər/` | verano | We swim a lot in summer. | Nadamos mucho en verano. |
| `voc_a1_autumn-fall_001` | **autumn / fall** | *noun* | `/ˈɔtəm/` | otoño | The weather is cool in autumn. | El clima es fresco en otoño. |
| `voc_a1_winter_001` | **winter** | *noun* | `/ˈwɪntər/` | invierno | It snows every winter here. | Nieva todos los inviernos aquí. |
| `voc_a1_season_001` | **season** | *noun* | `/ˈsizən/` | estación | Which season do you like best? | ¿Cuál estación te gusta más? |
| `voc_a1_today_001` | **today** | *noun* | `/təˈdeɪ/` | hoy | Today is a sunny day. | Hoy es un día soleado. |
| `voc_a1_tomorrow_001` | **tomorrow** | *noun* | `/təˈmɑroʊ/` | mañana | I will call you tomorrow. | Te llamaré mañana. |
| `voc_a1_yesterday_001` | **yesterday** | *verb* | `/ˈjɛstərˌdeɪ/` | ayer | I saw her yesterday. | La vi ayer. |
| `voc_a1_morning_001` | **morning** | *noun* | `/ˈmɔrnɪŋ/` | mañana (parte del día) | I drink coffee every morning. | Bebo café todas las mañanas. |
| `voc_a1_afternoon_001` | **afternoon** | *noun* | `/ˌæftərˈnun/` | tarde | We have lunch in the afternoon. | Almorzamos por la tarde. |
| `voc_a1_evening_001` | **evening** | *noun* | `/ˈivnɪŋ/` | noche (temprana) | I read books in the evening. | Leo libros por la noche (temprano). |
| `voc_a1_night_001` | **night** | *noun* | `/naɪt/` | noche | The stars are bright at night. | Las estrellas brillan de noche. |
| `voc_a1_oclock_001` | **o'clock** | *noun* | `/əˈklɑk/` | en punto | It is three o'clock. | Son las tres en punto. |
| `voc_a1_hour_001` | **hour** | *noun* | `/ˈaʊər/` | hora | The movie lasts one hour. | La película dura una hora. |
| `voc_a1_minute_001` | **minute** | *noun* | `/ˈmɪnɪt/` | minuto | Wait a minute, please. | Espera un minuto, por favor. |
| `voc_a1_second_002` | **second (time)** | *noun* | `/ˈsɛkənd/` | segundo (tiempo) | Give me one second. | Dame un segundo. |
| `voc_a1_time_001` | **time** | *noun* | `/taɪm/` | tiempo/hora | What time is it? | ¿Qué hora es? |
| `voc_a1_early_001` | **early** | *noun* | `/ˈɜrli/` | temprano | I woke up early today. | Me desperté temprano hoy. |
| `voc_a1_late_001` | **late** | *noun* | `/leɪt/` | tarde | Sorry, I am late. | Perdón, llego tarde. |
| `voc_a1_always_001` | **always** | *adverb* | `/ˈɔlweɪz/` | siempre | She always drinks tea. | Ella siempre bebe té. |
| `voc_a1_never_001` | **never** | *adverb* | `/ˈnɛvər/` | nunca | He never eats meat. | Él nunca come carne. |
| `voc_a1_sometimes_001` | **sometimes** | *adverb* | `/ˈsʌmˌtaɪmz/` | a veces | Sometimes I walk to work. | A veces camino al trabajo. |
| `voc_a1_often_001` | **often** | *adverb* | `/ˈɔfən/` | a menudo | We often visit our grandmother. | A menudo visitamos a nuestra abuela. |
| `voc_a1_usually_001` | **usually** | *adverb* | `/ˈjuʒuəli/` | usualmente | I usually wake up at seven. | Usualmente me despierto a las siete. |
| `voc_a1_half_001` | **half** | *noun* | `/hæf/` | medio/media | It is half past two. | Son las dos y media. |
| `voc_a1_quarter_001` | **quarter** | *noun* | `/ˈkwɔrtər/` | cuarto (fracción) | It is a quarter to five. | Son las cinco menos cuarto. |
| `voc_a1_past_001` | **past** | *noun* | `/pæst/` | pasado / y (hora) | It is ten past six. | Son las seis y diez. |
| `voc_a1_to_001` | **to (time)** | *noun* | `/tu/` | menos (hora) | It is five to nine. | Son las nueve menos cinco. |
| `voc_a1_date_001` | **date** | *noun* | `/deɪt/` | fecha | What is today's date? | ¿Cuál es la fecha de hoy? |
| `voc_a1_year_001` | **year** | *noun* | `/jɪr/` | año | This year has been busy. | Este año ha estado ocupado. |
| `voc_a1_month_001` | **month** | *noun* | `/mʌnθ/` | mes | Next month is my birthday. | El próximo mes es mi cumpleaños. |
| `voc_a1_calendar_001` | **calendar** | *noun* | `/ˈkæləndər/` | calendario | I have a calendar on my desk. | Tengo un calendario en mi escritorio. |
| `voc_a1_birthday_001` | **birthday** | *noun* | `/ˈbɜrθˌdeɪ/` | cumpleaños | Happy birthday! | ¡Feliz cumpleaños! |
| `voc_a1_holiday_001` | **holiday** | *noun* | `/ˈhɑlɪˌdeɪ/` | día festivo | Christmas is my favorite holiday. | La Navidad es mi día festivo favorito. |
| `voc_a1_vacation_001` | **vacation** | *noun* | `/veɪˈkeɪʃən/` | vacaciones | We are on vacation this week. | Estamos de vacaciones esta semana. |
| `voc_a1_soon_001` | **soon** | *adverb* | `/sun/` | pronto | See you soon! | ¡Nos vemos pronto! |
| `voc_a1_later_001` | **later** | *adverb* | `/ˈleɪtər/` | más tarde | I will finish it later. | Lo terminaré más tarde. |
| `voc_a1_before_001` | **before** | *noun* | `/bɪˈfɔr/` | antes | Wash your hands before dinner. | Lávate las manos antes de cenar. |
| `voc_a1_after_001` | **after** | *noun* | `/ˈæftər/` | después | We go home after work. | Vamos a casa después del trabajo. |
| `voc_a1_still_001` | **still** | *adverb* | `/stɪl/` | todavía | She is still sleeping. | Ella todavía está durmiendo. |
| `voc_a1_already_001` | **already** | *adverb* | `/ɔlˈrɛdi/` | ya | I have already finished my homework. | Ya terminé mi tarea. |
| `voc_a1_ago_001` | **ago** | *noun* | `/əˈgoʊ/` | hace (tiempo) | I moved here two years ago. | Me mudé aquí hace dos años. |
| `voc_a1_since_001` | **since** | *noun* | `/sɪns/` | desde | I have lived here since 2020. | Vivo aquí desde 2020. |
| `voc_a1_until_001` | **until** | *noun* | `/ənˈtɪl/` | hasta | We waited until midnight. | Esperamos hasta la medianoche. |
| `voc_a1_while_001` | **while** | *conjunction* | `/waɪl/` | mientras | She called while I was cooking. | Ella llamó mientras yo cocinaba. |
| `voc_a1_noon_001` | **noon** | *noun* | `/nun/` | mediodía | We eat lunch at noon. | Almorzamos al mediodía. |
| `voc_a1_midnight_001` | **midnight** | *noun* | `/ˈmɪdˌnaɪt/` | medianoche | The party ends at midnight. | La fiesta termina a medianoche. |
| `voc_a1_century_001` | **century** | *noun* | `/ˈsɛntʃəri/` | siglo | This building is one century old. | Este edificio tiene un siglo de antigüedad. |
| `voc_a1_decade_001` | **decade** | *noun* | `/ˈdɛkeɪd/` | década | I have lived here for a decade. | He vivido aquí por una década. |
| `voc_a1_weekday_001` | **weekday** | *noun* | `/ˈwikˌdeɪ/` | día de semana | I work every weekday. | Trabajo todos los días de la semana (laborales). |

### Semana 3: Semana 3 – Familia y personas
Total de palabras en esta semana: **90**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_mother-mom_001` | **mother / mom** | *noun* | `/ˈmʌðər/` | madre / mamá | My mother cooks every day. | Mi madre cocina todos los días. |
| `voc_a1_father-dad_001` | **father / dad** | *noun* | `/ˈfɑðər/` | padre / papá | My father works in a bank. | Mi padre trabaja en un banco. |
| `voc_a1_parents_001` | **parents** | *noun* | `/ˈpɛrənts/` | padres | My parents live in Mexico. | Mis padres viven en México. |
| `voc_a1_brother_001` | **brother** | *noun* | `/ˈbrʌðər/` | hermano | I have one brother. | Tengo un hermano. |
| `voc_a1_sister_001` | **sister** | *noun* | `/ˈsɪstər/` | hermana | My sister is a doctor. | Mi hermana es médica. |
| `voc_a1_sibling_001` | **sibling** | *noun* | `/ˈsɪblɪŋ/` | hermano/a | Do you have any siblings? | ¿Tienes hermanos? |
| `voc_a1_son_001` | **son** | *noun* | `/sʌn/` | hijo | Their son is ten years old. | Su hijo tiene diez años. |
| `voc_a1_daughter_001` | **daughter** | *noun* | `/ˈdɔtər/` | hija | Their daughter goes to this school. | Su hija va a esta escuela. |
| `voc_a1_child_001` | **child** | *noun* | `/tʃaɪld/` | niño/a | She is a happy child. | Ella es una niña feliz. |
| `voc_a1_children_001` | **children** | *noun* | `/ˈtʃɪldrən/` | niños | They have three children. | Tienen tres hijos. |
| `voc_a1_baby_001` | **baby** | *noun* | `/ˈbeɪbi/` | bebé | The baby is sleeping. | El bebé está durmiendo. |
| `voc_a1_husband_001` | **husband** | *noun* | `/ˈhʌzbənd/` | esposo | Her husband is a teacher. | Su esposo es maestro. |
| `voc_a1_wife_001` | **wife** | *noun* | `/waɪf/` | esposa | His wife works from home. | Su esposa trabaja desde casa. |
| `voc_a1_grandmother-grandma_001` | **grandmother / grandma** | *noun* | `/ˈgrændˌmʌðər/` | abuela | My grandmother tells great stories. | Mi abuela cuenta buenas historias. |
| `voc_a1_grandfather-grandpa_001` | **grandfather / grandpa** | *noun* | `/ˈgrændˌfɑðər/` | abuelo | My grandfather likes to fish. | A mi abuelo le gusta pescar. |
| `voc_a1_grandparents_001` | **grandparents** | *noun* | `/ˈgrændˌpɛrənts/` | abuelos | We visit our grandparents on Sundays. | Visitamos a nuestros abuelos los domingos. |
| `voc_a1_aunt_001` | **aunt** | *noun* | `/ænt/` | tía | My aunt lives in Canada. | Mi tía vive en Canadá. |
| `voc_a1_uncle_001` | **uncle** | *noun* | `/ˈʌŋkəl/` | tío | My uncle has a farm. | Mi tío tiene una granja. |
| `voc_a1_cousin_001` | **cousin** | *noun* | `/ˈkʌzən/` | primo/a | My cousin is my best friend. | Mi primo es mi mejor amigo. |
| `voc_a1_nephew_001` | **nephew** | *noun* | `/ˈnɛfju/` | sobrino | My nephew is very smart. | Mi sobrino es muy inteligente. |
| `voc_a1_niece_001` | **niece** | *noun* | `/nis/` | sobrina | My niece loves to dance. | A mi sobrina le encanta bailar. |
| `voc_a1_family_001` | **family** | *noun* | `/ˈfæməli/` | familia | My family is small. | Mi familia es pequeña. |
| `voc_a1_friend_001` | **friend** | *noun* | `/frɛnd/` | amigo/a | She is my best friend. | Ella es mi mejor amiga. |
| `voc_a1_boyfriend_001` | **boyfriend** | *noun* | `/ˈbɔɪˌfrɛnd/` | novio | Her boyfriend is very kind. | Su novio es muy amable. |
| `voc_a1_girlfriend_001` | **girlfriend** | *noun* | `/ˈgɜrlˌfrɛnd/` | novia | His girlfriend studies medicine. | Su novia estudia medicina. |
| `voc_a1_man_001` | **man** | *noun* | `/mæn/` | hombre | The man is waiting outside. | El hombre está esperando afuera. |
| `voc_a1_woman_001` | **woman** | *noun* | `/ˈwʊmən/` | mujer | The woman is reading a book. | La mujer está leyendo un libro. |
| `voc_a1_boy_001` | **boy** | *noun* | `/bɔɪ/` | niño | The boy is playing soccer. | El niño está jugando fútbol. |
| `voc_a1_girl_001` | **girl** | *noun* | `/gɜrl/` | niña | The girl likes to sing. | A la niña le gusta cantar. |
| `voc_a1_people_001` | **people** | *noun* | `/ˈpipəl/` | gente | There are many people here. | Hay mucha gente aquí. |
| `voc_a1_person_001` | **person** | *noun* | `/ˈpɜrsən/` | persona | She is a very kind person. | Ella es una persona muy amable. |
| `voc_a1_adult_001` | **adult** | *noun* | `/əˈdʌlt/` | adulto | This movie is for adults. | Esta película es para adultos. |
| `voc_a1_teenager_001` | **teenager** | *noun* | `/ˈtiˌneɪdʒər/` | adolescente | My teenager sleeps a lot. | Mi adolescente duerme mucho. |
| `voc_a1_neighbor_001` | **neighbor** | *noun* | `/ˈneɪbər/` | vecino | Our neighbor is very friendly. | Nuestro vecino es muy amigable. |
| `voc_a1_guest_001` | **guest** | *noun* | `/gɛst/` | invitado | We have a guest tonight. | Tenemos un invitado esta noche. |
| `voc_a1_stranger_001` | **stranger** | *noun* | `/ˈstreɪndʒər/` | desconocido | Don't talk to strangers. | No hables con extraños. |
| `voc_a1_couple_001` | **couple** | *noun* | `/ˈkʌpəl/` | pareja | That couple lives next door. | Esa pareja vive al lado. |
| `voc_a1_twins_001` | **twins** | *noun* | `/twɪnz/` | gemelos | They are twins. | Ellos son gemelos. |
| `voc_a1_married_001` | **married** | *noun* | `/ˈmɛrid/` | casado | They got married last year. | Se casaron el año pasado. |
| `voc_a1_single_001` | **single** | *noun* | `/ˈsɪŋgəl/` | soltero | My brother is still single. | Mi hermano todavía está soltero. |
| `voc_a1_divorced_001` | **divorced** | *noun* | `/dɪˈvɔrst/` | divorciado | Her parents are divorced. | Sus padres están divorciados. |
| `voc_a1_old_001` | **old** | *noun* | `/oʊld/` | viejo | My grandfather is very old. | Mi abuelo es muy viejo. |
| `voc_a1_young_001` | **young** | *noun* | `/jʌŋ/` | joven | She looks very young. | Ella se ve muy joven. |
| `voc_a1_tall_001` | **tall** | *noun* | `/tɔl/` | alto | My brother is very tall. | Mi hermano es muy alto. |
| `voc_a1_short_001` | **short (person)** | *noun* | `/ʃɔrt/` | bajo (estatura) | My sister is short. | Mi hermana es baja. |
| `voc_a1_surname-last-name_001` | **surname / last name** | *noun* | `/ˈsɜrˌneɪm/` | apellido | What is your surname? | ¿Cuál es tu apellido? |
| `voc_a1_nickname_001` | **nickname** | *noun* | `/ˈnɪkˌneɪm/` | apodo | His nickname is Tony. | Su apodo es Tony. |
| `voc_a1_american_001` | **American** | *noun* | `/əˈmɛrɪkən/` | estadounidense | She is American. | Ella es estadounidense. |
| `voc_a1_english_001` | **English** | *noun* | `/ˈɪŋglɪʃ/` | inglés/a | He is English. | Él es inglés. |
| `voc_a1_spanish_001` | **Spanish** | *noun* | `/ˈspænɪʃ/` | español/a | My mother is Spanish. | Mi madre es española. |
| `voc_a1_french_001` | **French** | *noun* | `/frɛntʃ/` | francés/a | They are French. | Ellos son franceses. |
| `voc_a1_german_001` | **German** | *noun* | `/ˈdʒɜrmən/` | alemán/a | Her husband is German. | Su esposo es alemán. |
| `voc_a1_chinese_001` | **Chinese** | *noun* | `/tʃaɪˈniz/` | chino/a | My neighbor is Chinese. | Mi vecino es chino. |
| `voc_a1_japanese_001` | **Japanese** | *noun* | `/ˌdʒæpəˈniz/` | japonés/a | This teacher is Japanese. | Esta maestra es japonesa. |
| `voc_a1_mexican_001` | **Mexican** | *noun* | `/ˈmɛksəkən/` | mexicano/a | I am Mexican. | Soy mexicano. |
| `voc_a1_canadian_001` | **Canadian** | *noun* | `/kəˈneɪdiən/` | canadiense | My cousin is Canadian. | Mi primo es canadiense. |
| `voc_a1_brazilian_001` | **Brazilian** | *noun* | `/brəˈzɪljən/` | brasileño/a | She has a Brazilian friend. | Ella tiene una amiga brasileña. |
| `voc_a1_country_001` | **country** | *noun* | `/ˈkʌntri/` | país | Which country are you from? | ¿De qué país eres? |
| `voc_a1_nationality_001` | **nationality** | *noun* | `/ˌnæʃəˈnælɪti/` | nacionalidad | What is your nationality? | ¿Cuál es tu nacionalidad? |
| `voc_a1_language_001` | **language** | *noun* | `/ˈlæŋgwɪdʒ/` | idioma | English is a difficult language. | El inglés es un idioma difícil. |
| `voc_a1_introduce_001` | **introduce** | *verb* | `/ˌɪntrəˈdus/` | presentar | Let me introduce my sister. | Déjame presentarte a mi hermana. |
| `voc_a1_meet_001` | **meet** | *verb* | `/mit/` | conocer/encontrarse | Nice to meet you. | Mucho gusto en conocerte. |
| `voc_a1_relative_001` | **relative** | *noun* | `/ˈrɛlətɪv/` | pariente | We have relatives in Spain. | Tenemos parientes en España. |
| `voc_a1_only-child_001` | **only child** | *noun* | `/ˈoʊnli tʃaɪld/` | hijo único | She is an only child. | Ella es hija única. |
| `voc_a1_widow_001` | **widow** | *noun* | `/ˈwɪdoʊ/` | viuda | My grandmother is a widow. | Mi abuela es viuda. |
| `voc_a1_widower_001` | **widower** | *noun* | `/ˈwɪdoʊər/` | viudo | He became a widower last year. | Él se volvió viudo el año pasado. |
| `voc_a1_engaged_001` | **engaged** | *noun* | `/ɪnˈgeɪdʒd/` | comprometido | They are engaged now. | Ahora están comprometidos. |
| `voc_a1_wedding_001` | **wedding** | *noun* | `/ˈwɛdɪŋ/` | boda | The wedding is in June. | La boda es en junio. |
| `voc_a1_love_001` | **love** | *noun* | `/lʌv/` | amor | I love my family. | Amo a mi familia. |
| `voc_a1_hate_001` | **hate** | *noun* | `/heɪt/` | odio | She doesn't hate anyone. | Ella no odia a nadie. |
| `voc_a1_kiss_001` | **kiss** | *noun* | `/kɪs/` | beso | He gave her a kiss. | Él le dio un beso. |
| `voc_a1_hug_001` | **hug** | *noun* | `/hʌg/` | abrazo | She gave me a big hug. | Ella me dio un gran abrazo. |
| `voc_a1_smile_001` | **smile** | *noun* | `/smaɪl/` | sonrisa | She has a beautiful smile. | Ella tiene una sonrisa hermosa. |
| `voc_a1_laugh_001` | **laugh** | *noun* | `/læf/` | risa | We laugh a lot together. | Nos reímos mucho juntos. |
| `voc_a1_cry_001` | **cry** | *verb* | `/kraɪ/` | llorar | The baby started to cry. | El bebé empezó a llorar. |
| `voc_a1_care_001` | **care** | *verb* | `/kɛr/` | cuidar | She cares about her family. | Ella se preocupa por su familia. |
| `voc_a1_help_001` | **help** | *verb* | `/hɛlp/` | ayudar | Can you help me, please? | ¿Puedes ayudarme, por favor? |
| `voc_a1_visit_001` | **visit** | *verb* | `/ˈvɪzɪt/` | visitar | We visit our aunt every summer. | Visitamos a nuestra tía cada verano. |
| `voc_a1_call_001` | **call (phone)** | *verb* | `/kɔl/` | llamar | I will call you tonight. | Te llamaré esta noche. |
| `voc_a1_invite_001` | **invite** | *verb* | `/ɪnˈvaɪt/` | invitar | We invited our neighbors. | Invitamos a nuestros vecinos. |
| `voc_a1_everyone_001` | **everyone** | *noun* | `/ˈɛvriˌwʌn/` | todos | Everyone is welcome. | Todos son bienvenidos. |
| `voc_a1_someone_001` | **someone** | *noun* | `/ˈsʌmˌwʌn/` | alguien | Someone is at the door. | Alguien está en la puerta. |
| `voc_a1_no-one_001` | **no one** | *noun* | `/ˈnoʊ wʌn/` | nadie | No one answered the phone. | Nadie contestó el teléfono. |
| `voc_a1_anybody_001` | **anybody** | *noun* | `/ˈɛniˌbɑdi/` | alguien/nadie | Is anybody home? | ¿Hay alguien en casa? |
| `voc_a1_myself_001` | **myself** | *noun* | `/maɪˈsɛlf/` | yo mismo | I made this cake myself. | Hice este pastel yo mismo. |
| `voc_a1_yourself_001` | **yourself** | *noun* | `/jɔrˈsɛlf/` | tú mismo | Did you do this yourself? | ¿Hiciste esto tú mismo? |
| `voc_a1_himself_001` | **himself** | *noun* | `/hɪmˈsɛlf/` | él mismo | He introduced himself. | Él se presentó (a sí mismo). |
| `voc_a1_herself_001` | **herself** | *noun* | `/hərˈsɛlf/` | ella misma | She lives by herself. | Ella vive sola. |
| `voc_a1_ourselves_001` | **ourselves** | *noun* | `/ɑrˈsɛlvz/` | nosotros mismos | We did it ourselves. | Lo hicimos nosotros mismos. |
| `voc_a1_themselves_001` | **themselves** | *noun* | `/ðɛmˈsɛlvz/` | ellos mismos | They enjoyed themselves at the party. | Ellos se divirtieron en la fiesta. |

### Semana 4: Semana 4 – Colores, formas y adjetivos básicos
Total de palabras en esta semana: **89**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_red_001` | **red** | *adjective* | `/rɛd/` | rojo | I like your red shirt. | Me gusta tu camisa roja. |
| `voc_a1_blue_001` | **blue** | *adjective* | `/blu/` | azul | The sky is blue today. | El cielo está azul hoy. |
| `voc_a1_green_001` | **green** | *adjective* | `/grin/` | verde | She has green eyes. | Ella tiene ojos verdes. |
| `voc_a1_yellow_001` | **yellow** | *adjective* | `/ˈjɛloʊ/` | amarillo | The banana is yellow. | El plátano es amarillo. |
| `voc_a1_orange_001` | **orange (color)** | *adjective* | `/ˈɔrɪndʒ/` | naranja | I bought an orange jacket. | Compré una chaqueta naranja. |
| `voc_a1_purple_001` | **purple** | *adjective* | `/ˈpɜrpəl/` | morado | Her dress is purple. | Su vestido es morado. |
| `voc_a1_pink_001` | **pink** | *adjective* | `/pɪŋk/` | rosado | The flowers are pink. | Las flores son rosadas. |
| `voc_a1_black_001` | **black** | *adjective* | `/blæk/` | negro | He is wearing black shoes. | Él lleva zapatos negros. |
| `voc_a1_white_001` | **white** | *adjective* | `/waɪt/` | blanco | The walls are white. | Las paredes son blancas. |
| `voc_a1_brown_001` | **brown** | *adjective* | `/braʊn/` | marrón | My dog has brown fur. | Mi perro tiene pelaje marrón. |
| `voc_a1_gray-grey_001` | **gray / grey** | *adjective* | `/greɪ/` | gris | The sky is gray before rain. | El cielo está gris antes de la lluvia. |
| `voc_a1_color-colour_001` | **color / colour** | *adjective* | `/ˈkʌlər/` | color | What color is your car? | ¿De qué color es tu carro? |
| `voc_a1_circle_001` | **circle** | *noun* | `/ˈsɜrkəl/` | círculo | Draw a circle here. | Dibuja un círculo aquí. |
| `voc_a1_square_001` | **square** | *noun* | `/skwɛr/` | cuadrado | The box is a square. | La caja tiene forma de cuadrado. |
| `voc_a1_triangle_001` | **triangle** | *noun* | `/ˈtraɪˌæŋgəl/` | triángulo | This shape is a triangle. | Esta figura es un triángulo. |
| `voc_a1_rectangle_001` | **rectangle** | *noun* | `/ˈrɛktæŋgəl/` | rectángulo | The table is a rectangle. | La mesa tiene forma de rectángulo. |
| `voc_a1_star_001` | **star (shape)** | *adjective* | `/stɑr/` | estrella | The children drew a star. | Los niños dibujaron una estrella. |
| `voc_a1_heart_001` | **heart (shape)** | *adjective* | `/hɑrt/` | corazón | She drew a small heart. | Ella dibujó un pequeño corazón. |
| `voc_a1_shape_001` | **shape** | *adjective* | `/ʃeɪp/` | forma | What shape is this? | ¿Qué forma es esta? |
| `voc_a1_big_001` | **big** | *adjective* | `/bɪg/` | grande | They live in a big house. | Viven en una casa grande. |
| `voc_a1_small_001` | **small** | *adjective* | `/smɔl/` | pequeño | I have a small dog. | Tengo un perro pequeño. |
| `voc_a1_large_001` | **large** | *adjective* | `/lɑrdʒ/` | grande | We need a large table. | Necesitamos una mesa grande. |
| `voc_a1_tiny_001` | **tiny** | *adjective* | `/ˈtaɪni/` | diminuto | The kitten is tiny. | El gatito es diminuto. |
| `voc_a1_long_001` | **long** | *adjective* | `/lɔŋ/` | largo | She has long hair. | Ella tiene el cabello largo. |
| `voc_a1_short_002` | **short (length)** | *adjective* | `/ʃɔrt/` | corto | This is a short movie. | Esta es una película corta. |
| `voc_a1_wide_001` | **wide** | *adjective* | `/waɪd/` | ancho | The street is very wide. | La calle es muy ancha. |
| `voc_a1_narrow_001` | **narrow** | *adjective* | `/ˈnɛroʊ/` | estrecho | This road is narrow. | Este camino es estrecho. |
| `voc_a1_thick_001` | **thick** | *adjective* | `/θɪk/` | grueso | The book is very thick. | El libro es muy grueso. |
| `voc_a1_thin_001` | **thin** | *adjective* | `/θɪn/` | delgado | The paper is very thin. | El papel es muy delgado. |
| `voc_a1_heavy_001` | **heavy** | *adjective* | `/ˈhɛvi/` | pesado | This bag is heavy. | Esta bolsa es pesada. |
| `voc_a1_light_001` | **light (weight)** | *adjective* | `/laɪt/` | ligero | My backpack is very light. | Mi mochila es muy ligera. |
| `voc_a1_high_001` | **high** | *adjective* | `/haɪ/` | alto (altura) | The mountain is very high. | La montaña es muy alta. |
| `voc_a1_low_001` | **low** | *adjective* | `/loʊ/` | bajo | The table is very low. | La mesa es muy baja. |
| `voc_a1_good_001` | **good** | *adjective* | `/gʊd/` | bueno | This is a good idea. | Esta es una buena idea. |
| `voc_a1_bad_001` | **bad** | *adjective* | `/bæd/` | malo | That was a bad day. | Ese fue un mal día. |
| `voc_a1_nice_001` | **nice** | *adjective* | `/naɪs/` | agradable | It was nice to meet you. | Fue agradable conocerte. |
| `voc_a1_beautiful_001` | **beautiful** | *adjective* | `/ˈbjutəfəl/` | hermoso | What a beautiful garden! | ¡Qué jardín tan hermoso! |
| `voc_a1_ugly_001` | **ugly** | *adjective* | `/ˈʌgli/` | feo | I think this color is ugly. | Creo que este color es feo. |
| `voc_a1_pretty_001` | **pretty** | *adjective* | `/ˈprɪti/` | bonito | She has a pretty smile. | Ella tiene una sonrisa bonita. |
| `voc_a1_new_001` | **new** | *adjective* | `/nu/` | nuevo | I bought a new phone. | Compré un teléfono nuevo. |
| `voc_a1_old_002` | **old (thing)** | *adjective* | `/oʊld/` | viejo/antiguo | This is an old car. | Este es un carro viejo. |
| `voc_a1_clean_001` | **clean** | *adjective* | `/klin/` | limpio | The kitchen is clean. | La cocina está limpia. |
| `voc_a1_dirty_001` | **dirty** | *adjective* | `/ˈdɜrti/` | sucio | My shoes are dirty. | Mis zapatos están sucios. |
| `voc_a1_easy_001` | **easy** | *adjective* | `/ˈizi/` | fácil | This exercise is easy. | Este ejercicio es fácil. |
| `voc_a1_difficult-hard_001` | **difficult / hard** | *adjective* | `/ˈdɪfɪkəlt/` | difícil | English grammar is difficult. | La gramática del inglés es difícil. |
| `voc_a1_hot_001` | **hot** | *adjective* | `/hɑt/` | caliente | The soup is very hot. | La sopa está muy caliente. |
| `voc_a1_cold_001` | **cold** | *adjective* | `/koʊld/` | frío | The water is cold. | El agua está fría. |
| `voc_a1_warm_001` | **warm** | *adjective* | `/wɔrm/` | cálido | Today is warm and sunny. | Hoy está cálido y soleado. |
| `voc_a1_cool_001` | **cool** | *adjective* | `/kul/` | fresco | The wind feels cool. | El viento se siente fresco. |
| `voc_a1_fast_001` | **fast** | *adjective* | `/fæst/` | rápido | He drives very fast. | Él conduce muy rápido. |
| `voc_a1_slow_001` | **slow** | *adjective* | `/sloʊ/` | lento | The train is slow today. | El tren va lento hoy. |
| `voc_a1_strong_001` | **strong** | *adjective* | `/strɔŋ/` | fuerte | She is very strong. | Ella es muy fuerte. |
| `voc_a1_weak_001` | **weak** | *adjective* | `/wik/` | débil | He feels weak after the flu. | Él se siente débil después de la gripe. |
| `voc_a1_rich_001` | **rich** | *adjective* | `/rɪtʃ/` | rico | That family is very rich. | Esa familia es muy rica. |
| `voc_a1_poor_001` | **poor** | *adjective* | `/pʊr/` | pobre | Many people here are poor. | Muchas personas aquí son pobres. |
| `voc_a1_happy_001` | **happy** | *adjective* | `/ˈhæpi/` | feliz | I am happy today. | Estoy feliz hoy. |
| `voc_a1_sad_001` | **sad** | *adjective* | `/sæd/` | triste | She looks a little sad. | Ella se ve un poco triste. |
| `voc_a1_angry_001` | **angry** | *adjective* | `/ˈæŋgri/` | enojado | My boss is angry with me. | Mi jefe está enojado conmigo. |
| `voc_a1_tired_001` | **tired** | *adjective* | `/taɪərd/` | cansado | I am tired after work. | Estoy cansado después del trabajo. |
| `voc_a1_hungry_001` | **hungry** | *adjective* | `/ˈhʌŋgri/` | hambriento | The children are hungry. | Los niños tienen hambre. |
| `voc_a1_thirsty_001` | **thirsty** | *adjective* | `/ˈθɜrsti/` | sediento | I am thirsty, can I have water? | Tengo sed, ¿puedo tomar agua? |
| `voc_a1_full_001` | **full** | *adjective* | `/fʊl/` | lleno | The glass is full. | El vaso está lleno. |
| `voc_a1_empty_001` | **empty** | *adjective* | `/ˈɛmpti/` | vacío | The fridge is empty. | El refrigerador está vacío. |
| `voc_a1_open_001` | **open** | *adjective* | `/ˈoʊpən/` | abierto | The store is open now. | La tienda está abierta ahora. |
| `voc_a1_closed_001` | **closed** | *adjective* | `/kloʊzd/` | cerrado | The bank is closed today. | El banco está cerrado hoy. |
| `voc_a1_right_001` | **right (correct)** | *adjective* | `/raɪt/` | correcto | Your answer is right. | Tu respuesta es correcta. |
| `voc_a1_wrong_001` | **wrong** | *adjective* | `/rɔŋ/` | incorrecto | Sorry, that number is wrong. | Perdón, ese número está incorrecto. |
| `voc_a1_same_001` | **same** | *adjective* | `/seɪm/` | mismo | We wear the same size. | Usamos la misma talla. |
| `voc_a1_different_001` | **different** | *adjective* | `/ˈdɪfərənt/` | diferente | Our opinions are different. | Nuestras opiniones son diferentes. |
| `voc_a1_expensive_001` | **expensive** | *adjective* | `/ɪkˈspɛnsɪv/` | caro | This restaurant is expensive. | Este restaurante es caro. |
| `voc_a1_cheap_001` | **cheap** | *adjective* | `/tʃip/` | barato | I found a cheap ticket. | Encontré un boleto barato. |
| `voc_a1_quiet_001` | **quiet** | *adjective* | `/ˈkwaɪət/` | silencioso | The library is very quiet. | La biblioteca es muy silenciosa. |
| `voc_a1_noisy_001` | **noisy** | *adjective* | `/ˈnɔɪzi/` | ruidoso | The street is noisy at night. | La calle es ruidosa de noche. |
| `voc_a1_safe_001` | **safe** | *adjective* | `/seɪf/` | seguro | This neighborhood is safe. | Este vecindario es seguro. |
| `voc_a1_dangerous_001` | **dangerous** | *adjective* | `/ˈdeɪndʒərəs/` | peligroso | That road is dangerous. | Ese camino es peligroso. |
| `voc_a1_interesting_001` | **interesting** | *adjective* | `/ˈɪntrəstɪŋ/` | interesante | This book is very interesting. | Este libro es muy interesante. |
| `voc_a1_boring_001` | **boring** | *adjective* | `/ˈbɔrɪŋ/` | aburrido | The movie was a bit boring. | La película fue un poco aburrida. |
| `voc_a1_funny_001` | **funny** | *adjective* | `/ˈfʌni/` | gracioso | My brother is very funny. | Mi hermano es muy gracioso. |
| `voc_a1_serious_001` | **serious** | *adjective* | `/ˈsɪriəs/` | serio | This is a serious problem. | Este es un problema serio. |
| `voc_a1_kind_001` | **kind** | *adjective* | `/kaɪnd/` | amable | She is always kind to everyone. | Ella siempre es amable con todos. |
| `voc_a1_friendly_001` | **friendly** | *adjective* | `/ˈfrɛndli/` | amistoso | Our neighbors are very friendly. | Nuestros vecinos son muy amistosos. |
| `voc_a1_shy_001` | **shy** | *adjective* | `/ʃaɪ/` | tímido | My son is a bit shy. | Mi hijo es un poco tímido. |
| `voc_a1_brave_001` | **brave** | *adjective* | `/breɪv/` | valiente | The firefighter was very brave. | El bombero fue muy valiente. |
| `voc_a1_lazy_001` | **lazy** | *adjective* | `/ˈleɪzi/` | perezoso | Don't be lazy, help me clean. | No seas perezoso, ayúdame a limpiar. |
| `voc_a1_busy_001` | **busy** | *adjective* | `/ˈbɪzi/` | ocupado | I am busy this week. | Estoy ocupado esta semana. |
| `voc_a1_free_001` | **free (available)** | *adjective* | `/fri/` | libre | Are you free tonight? | ¿Estás libre esta noche? |
| `voc_a1_round_001` | **round** | *adjective* | `/raʊnd/` | redondo | The table is round. | La mesa es redonda. |
| `voc_a1_flat_001` | **flat** | *adjective* | `/flæt/` | plano | The land here is flat. | El terreno aquí es plano. |
| `voc_a1_straight_001` | **straight** | *adjective* | `/streɪt/` | recto | Walk straight and turn left. | Camina recto y gira a la izquierda. |

### Semana 5: Semana 5 – La casa y los muebles
Total de palabras en esta semana: **81**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_house_001` | **house** | *noun* | `/haʊs/` | casa | We bought a new house. | Compramos una casa nueva. |
| `voc_a1_home_001` | **home** | *noun* | `/hoʊm/` | hogar | I feel comfortable at home. | Me siento cómodo en casa. |
| `voc_a1_apartment-flat_001` | **apartment / flat** | *noun* | `/əˈpɑrtmənt/` | apartamento | She lives in a small apartment. | Ella vive en un apartamento pequeño. |
| `voc_a1_room_001` | **room** | *noun* | `/rum/` | habitación | This room is very bright. | Esta habitación es muy luminosa. |
| `voc_a1_bedroom_001` | **bedroom** | *noun* | `/ˈbɛdˌrum/` | dormitorio | My bedroom is upstairs. | Mi dormitorio está arriba. |
| `voc_a1_bathroom_001` | **bathroom** | *noun* | `/ˈbæθˌrum/` | baño | The bathroom is next to the kitchen. | El baño está junto a la cocina. |
| `voc_a1_kitchen_001` | **kitchen** | *noun* | `/ˈkɪtʃən/` | cocina | She is cooking in the kitchen. | Ella está cocinando en la cocina. |
| `voc_a1_living-room_001` | **living room** | *noun* | `/ˈlɪvɪŋ rum/` | sala | We watch TV in the living room. | Vemos televisión en la sala. |
| `voc_a1_dining-room_001` | **dining room** | *noun* | `/ˈdaɪnɪŋ rum/` | comedor | We eat in the dining room. | Comemos en el comedor. |
| `voc_a1_garden_001` | **garden** | *noun* | `/ˈgɑrdən/` | jardín | My mother loves her garden. | Mi madre ama su jardín. |
| `voc_a1_yard_001` | **yard** | *noun* | `/jɑrd/` | patio | The children play in the yard. | Los niños juegan en el patio. |
| `voc_a1_garage_001` | **garage** | *noun* | `/gəˈrɑʒ/` | garaje | The car is in the garage. | El carro está en el garaje. |
| `voc_a1_roof_001` | **roof** | *noun* | `/ruf/` | techo | The roof needs repair. | El techo necesita reparación. |
| `voc_a1_door_001` | **door** | *noun* | `/dɔr/` | puerta | Please close the door. | Por favor cierra la puerta. |
| `voc_a1_window_001` | **window** | *noun* | `/ˈwɪndoʊ/` | ventana | Open the window, please. | Abre la ventana, por favor. |
| `voc_a1_wall_001` | **wall** | *noun* | `/wɔl/` | pared | There is a picture on the wall. | Hay un cuadro en la pared. |
| `voc_a1_floor_001` | **floor** | *noun* | `/flɔr/` | piso | The floor is very clean. | El piso está muy limpio. |
| `voc_a1_ceiling_001` | **ceiling** | *noun* | `/ˈsilɪŋ/` | cielo raso | There is a lamp on the ceiling. | Hay una lámpara en el techo (interior). |
| `voc_a1_stairs_001` | **stairs** | *noun* | `/stɛrz/` | escaleras | Be careful on the stairs. | Ten cuidado en las escaleras. |
| `voc_a1_table_001` | **table** | *noun* | `/ˈteɪbəl/` | mesa | Put the plates on the table. | Pon los platos en la mesa. |
| `voc_a1_chair_001` | **chair** | *noun* | `/tʃɛr/` | silla | This chair is very comfortable. | Esta silla es muy cómoda. |
| `voc_a1_sofa-couch_001` | **sofa / couch** | *noun* | `/ˈsoʊfə/` | sofá | We sit on the sofa every night. | Nos sentamos en el sofá cada noche. |
| `voc_a1_bed_001` | **bed** | *noun* | `/bɛd/` | cama | I make my bed every morning. | Hago mi cama todas las mañanas. |
| `voc_a1_desk_001` | **desk** | *noun* | `/dɛsk/` | escritorio | The computer is on the desk. | La computadora está en el escritorio. |
| `voc_a1_shelf_001` | **shelf** | *noun* | `/ʃɛlf/` | estante | The books are on the shelf. | Los libros están en el estante. |
| `voc_a1_wardrobe-closet_001` | **wardrobe / closet** | *noun* | `/ˈwɔrˌdroʊb/` | armario | My clothes are in the wardrobe. | Mi ropa está en el armario. |
| `voc_a1_drawer_001` | **drawer** | *noun* | `/drɔr/` | cajón | The keys are in the drawer. | Las llaves están en el cajón. |
| `voc_a1_mirror_001` | **mirror** | *noun* | `/ˈmɪrər/` | espejo | She looks in the mirror every day. | Ella se mira en el espejo todos los días. |
| `voc_a1_lamp_001` | **lamp** | *noun* | `/læmp/` | lámpara | Turn on the lamp, please. | Enciende la lámpara, por favor. |
| `voc_a1_curtain_001` | **curtain** | *noun* | `/ˈkɜrtən/` | cortina | Close the curtain, it's too bright. | Cierra la cortina, hay mucha luz. |
| `voc_a1_carpet-rug_001` | **carpet / rug** | *noun* | `/ˈkɑrpət/` | alfombra | The carpet is very soft. | La alfombra es muy suave. |
| `voc_a1_fridge-refrigerator_001` | **fridge / refrigerator** | *noun* | `/frɪdʒ/` | refrigerador | There is milk in the fridge. | Hay leche en el refrigerador. |
| `voc_a1_oven_001` | **oven** | *noun* | `/ˈʌvən/` | horno | The bread is in the oven. | El pan está en el horno. |
| `voc_a1_stove_001` | **stove** | *noun* | `/stoʊv/` | estufa | She is cooking on the stove. | Ella está cocinando en la estufa. |
| `voc_a1_microwave_001` | **microwave** | *noun* | `/ˈmaɪkrəˌweɪv/` | microondas | I heat my food in the microwave. | Caliento mi comida en el microondas. |
| `voc_a1_washing-machine_001` | **washing machine** | *noun* | `/ˈwɑʃɪŋ məˌʃin/` | lavadora | The washing machine is broken. | La lavadora está descompuesta. |
| `voc_a1_dishwasher_001` | **dishwasher** | *noun* | `/ˈdɪʃˌwɑʃər/` | lavavajillas | Put the plates in the dishwasher. | Pon los platos en el lavavajillas. |
| `voc_a1_television-tv_001` | **television / TV** | *noun* | `/ˈtɛləˌvɪʒən/` | televisor | We watch the news on television. | Vemos las noticias en la televisión. |
| `voc_a1_computer_001` | **computer** | *noun* | `/kəmˈpjutər/` | computadora | I work on my computer all day. | Trabajo en mi computadora todo el día. |
| `voc_a1_telephone-phone_001` | **telephone / phone** | *noun* | `/ˈtɛləˌfoʊn/` | teléfono | My phone is on the table. | Mi teléfono está en la mesa. |
| `voc_a1_radio_001` | **radio** | *noun* | `/ˈreɪdiˌoʊ/` | radio | I listen to the radio in the car. | Escucho la radio en el carro. |
| `voc_a1_clock_001` | **clock** | *noun* | `/klɑk/` | reloj | The clock says three o'clock. | El reloj marca las tres. |
| `voc_a1_fan_001` | **fan** | *noun* | `/fæn/` | ventilador | Turn on the fan, it's hot. | Enciende el ventilador, hace calor. |
| `voc_a1_heater_001` | **heater** | *noun* | `/ˈhitər/` | calentador | We need a heater in winter. | Necesitamos un calentador en invierno. |
| `voc_a1_air-conditioner_001` | **air conditioner** | *noun* | `/ɛr kənˈdɪʃənər/` | aire acondicionado | The air conditioner is very cold. | El aire acondicionado está muy frío. |
| `voc_a1_plate_001` | **plate** | *noun* | `/pleɪt/` | plato | Put the food on the plate. | Pon la comida en el plato. |
| `voc_a1_cup_001` | **cup** | *noun* | `/kʌp/` | taza | She has a cup of tea. | Ella tiene una taza de té. |
| `voc_a1_glass_001` | **glass** | *noun* | `/glæs/` | vaso | Can I have a glass of water? | ¿Puedo tomar un vaso de agua? |
| `voc_a1_bowl_001` | **bowl** | *noun* | `/boʊl/` | tazón | I eat cereal in a bowl. | Como cereal en un tazón. |
| `voc_a1_spoon_001` | **spoon** | *noun* | `/spun/` | cuchara | I need a spoon for the soup. | Necesito una cuchara para la sopa. |
| `voc_a1_fork_001` | **fork** | *noun* | `/fɔrk/` | tenedor | Use a fork to eat the salad. | Usa un tenedor para comer la ensalada. |
| `voc_a1_knife_001` | **knife** | *noun* | `/naɪf/` | cuchillo | Be careful with that knife. | Ten cuidado con ese cuchillo. |
| `voc_a1_pan_001` | **pan** | *noun* | `/pæn/` | sartén | She fries eggs in a pan. | Ella fríe huevos en un sartén. |
| `voc_a1_pot_001` | **pot** | *noun* | `/pɑt/` | olla | The soup is in the pot. | La sopa está en la olla. |
| `voc_a1_kettle_001` | **kettle** | *noun* | `/ˈkɛtəl/` | tetera | I boil water in the kettle. | Hiervo agua en la tetera. |
| `voc_a1_key_001` | **key** | *noun* | `/ki/` | llave | I lost my house key. | Perdí la llave de mi casa. |
| `voc_a1_lock_001` | **lock** | *noun* | `/lɑk/` | cerradura | Check the lock before you leave. | Revisa la cerradura antes de salir. |
| `voc_a1_light_002` | **light (lamp)** | *noun* | `/laɪt/` | luz | Turn off the light, please. | Apaga la luz, por favor. |
| `voc_a1_switch_001` | **switch** | *noun* | `/swɪtʃ/` | interruptor | The light switch is next to the door. | El interruptor está junto a la puerta. |
| `voc_a1_towel_001` | **towel** | *noun* | `/ˈtaʊəl/` | toalla | Use this towel to dry your hands. | Usa esta toalla para secarte las manos. |
| `voc_a1_soap_001` | **soap** | *noun* | `/soʊp/` | jabón | Wash your hands with soap. | Lávate las manos con jabón. |
| `voc_a1_toothbrush_001` | **toothbrush** | *noun* | `/ˈtuθˌbrʌʃ/` | cepillo de dientes | I need a new toothbrush. | Necesito un cepillo de dientes nuevo. |
| `voc_a1_pillow_001` | **pillow** | *noun* | `/ˈpɪloʊ/` | almohada | My pillow is very soft. | Mi almohada es muy suave. |
| `voc_a1_blanket_001` | **blanket** | *noun* | `/ˈblæŋkɪt/` | manta | I need a warm blanket. | Necesito una manta cálida. |
| `voc_a1_sheet_001` | **sheet** | *noun* | `/ʃit/` | sábana | We changed the bed sheets today. | Cambiamos las sábanas hoy. |
| `voc_a1_basement_001` | **basement** | *noun* | `/ˈbeɪsmənt/` | sótano | We keep old boxes in the basement. | Guardamos cajas viejas en el sótano. |
| `voc_a1_attic_001` | **attic** | *noun* | `/ˈætɪk/` | ático | The attic is full of old furniture. | El ático está lleno de muebles viejos. |
| `voc_a1_balcony_001` | **balcony** | *noun* | `/ˈbælkəni/` | balcón | We have coffee on the balcony. | Tomamos café en el balcón. |
| `voc_a1_fence_001` | **fence** | *noun* | `/fɛns/` | cerca | There is a fence around the yard. | Hay una cerca alrededor del patio. |
| `voc_a1_driveway_001` | **driveway** | *noun* | `/ˈdraɪvˌweɪ/` | entrada de auto | The car is parked in the driveway. | El carro está estacionado en la entrada. |
| `voc_a1_mailbox_001` | **mailbox** | *noun* | `/ˈmeɪlˌbɑks/` | buzón | Check the mailbox for letters. | Revisa el buzón por si hay cartas. |
| `voc_a1_furniture_001` | **furniture** | *noun* | `/ˈfɜrnɪtʃər/` | muebles | We need new furniture for the living room. | Necesitamos muebles nuevos para la sala. |
| `voc_a1_address_001` | **address** | *noun* | `/əˈdrɛs/` | dirección | What is your address? | ¿Cuál es tu dirección? |
| `voc_a1_neighborhood_001` | **neighborhood** | *noun* | `/ˈneɪbərˌhʊd/` | vecindario | This is a quiet neighborhood. | Este es un vecindario tranquilo. |
| `voc_a1_upstairs_001` | **upstairs** | *noun* | `/ʌpˈstɛrz/` | arriba | The bedrooms are upstairs. | Los dormitorios están arriba. |
| `voc_a1_downstairs_001` | **downstairs** | *noun* | `/ˌdaʊnˈstɛrz/` | abajo | The kitchen is downstairs. | La cocina está abajo. |
| `voc_a1_move_001` | **move (house)** | *noun* | `/muv/` | mudarse | We are moving next month. | Nos mudamos el próximo mes. |
| `voc_a1_rent_001` | **rent** | *verb* | `/rɛnt/` | alquilar | We rent this apartment. | Alquilamos este apartamento. |
| `voc_a1_own_001` | **own** | *verb* | `/oʊn/` | poseer | They own a small house. | Ellos poseen una casa pequeña. |
| `voc_a1_decorate_001` | **decorate** | *verb* | `/ˈdɛkəˌreɪt/` | decorar | We decorated the house for the party. | Decoramos la casa para la fiesta. |
| `voc_a1_paint_001` | **paint** | *verb* | `/peɪnt/` | pintar | We painted the walls white. | Pintamos las paredes de blanco. |

### Semana 6: Semana 6 – Comida y bebidas
Total de palabras en esta semana: **74**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_bread_001` | **bread** | *noun* | `/brɛd/` | pan | I eat bread every morning. | Como pan todas las mañanas. |
| `voc_a1_rice_001` | **rice** | *noun* | `/raɪs/` | arroz | We cook rice for dinner. | Cocinamos arroz para la cena. |
| `voc_a1_pasta_001` | **pasta** | *noun* | `/ˈpɑstə/` | pasta | She loves Italian pasta. | A ella le encanta la pasta italiana. |
| `voc_a1_meat_001` | **meat** | *noun* | `/mit/` | carne | He doesn't eat meat. | Él no come carne. |
| `voc_a1_chicken_001` | **chicken** | *noun* | `/ˈtʃɪkən/` | pollo | We are having chicken tonight. | Vamos a comer pollo esta noche. |
| `voc_a1_beef_001` | **beef** | *noun* | `/bif/` | carne de res | The soup has beef in it. | La sopa tiene carne de res. |
| `voc_a1_pork_001` | **pork** | *noun* | `/pɔrk/` | cerdo | This dish has pork and rice. | Este platillo tiene cerdo y arroz. |
| `voc_a1_fish_001` | **fish** | *noun* | `/fɪʃ/` | pescado | We eat fish on Fridays. | Comemos pescado los viernes. |
| `voc_a1_egg_001` | **egg** | *noun* | `/ɛg/` | huevo | I eat an egg for breakfast. | Como un huevo en el desayuno. |
| `voc_a1_cheese_001` | **cheese** | *noun* | `/tʃiz/` | queso | I love cheese on my pizza. | Me encanta el queso en mi pizza. |
| `voc_a1_milk_001` | **milk** | *noun* | `/mɪlk/` | leche | The children drink milk every day. | Los niños beben leche todos los días. |
| `voc_a1_butter_001` | **butter** | *noun* | `/ˈbʌtər/` | mantequilla | Put some butter on the bread. | Pon un poco de mantequilla en el pan. |
| `voc_a1_sugar_001` | **sugar** | *noun* | `/ˈʃʊgər/` | azúcar | I don't take sugar in my coffee. | No le pongo azúcar a mi café. |
| `voc_a1_salt_001` | **salt** | *noun* | `/sɔlt/` | sal | Add a little salt to the soup. | Agrega un poco de sal a la sopa. |
| `voc_a1_pepper_001` | **pepper (spice)** | *noun* | `/ˈpɛpər/` | pimienta | Can you pass the pepper? | ¿Me pasas la pimienta? |
| `voc_a1_oil_001` | **oil** | *noun* | `/ɔɪl/` | aceite | Cook the vegetables with a little oil. | Cocina las verduras con un poco de aceite. |
| `voc_a1_water_001` | **water** | *noun* | `/ˈwɔtər/` | agua | I drink a lot of water. | Bebo mucha agua. |
| `voc_a1_juice_001` | **juice** | *noun* | `/dʒus/` | jugo | She drinks orange juice every morning. | Ella bebe jugo de naranja cada mañana. |
| `voc_a1_coffee_001` | **coffee** | *noun* | `/ˈkɔfi/` | café | I need a cup of coffee. | Necesito una taza de café. |
| `voc_a1_tea_001` | **tea** | *noun* | `/ti/` | té | Would you like some tea? | ¿Quieres un poco de té? |
| `voc_a1_wine_001` | **wine** | *noun* | `/waɪn/` | vino | They drank wine at dinner. | Bebieron vino en la cena. |
| `voc_a1_beer_001` | **beer** | *noun* | `/bɪr/` | cerveza | He ordered a cold beer. | Él pidió una cerveza fría. |
| `voc_a1_soda_001` | **soda** | *noun* | `/ˈsoʊdə/` | refresco | The kids want soda with lunch. | Los niños quieren refresco con el almuerzo. |
| `voc_a1_apple_001` | **apple** | *noun* | `/ˈæpəl/` | manzana | I eat an apple every day. | Como una manzana todos los días. |
| `voc_a1_banana_001` | **banana** | *noun* | `/bəˈnænə/` | banana | Add a banana to the smoothie. | Agrega un plátano al licuado. |
| `voc_a1_orange_002` | **orange (fruit)** | *noun* | `/ˈɔrɪndʒ/` | naranja (fruta) | She peeled an orange. | Ella peló una naranja. |
| `voc_a1_grape_001` | **grape** | *noun* | `/greɪp/` | uva | The children love grapes. | A los niños les encantan las uvas. |
| `voc_a1_strawberry_001` | **strawberry** | *noun* | `/ˈstrɔˌbɛri/` | fresa | I bought fresh strawberries. | Compré fresas frescas. |
| `voc_a1_lemon_001` | **lemon** | *noun* | `/ˈlɛmən/` | limón | Add lemon to the tea. | Agrega limón al té. |
| `voc_a1_watermelon_001` | **watermelon** | *noun* | `/ˈwɔtərˌmɛlən/` | sandía | Watermelon is perfect in summer. | La sandía es perfecta en verano. |
| `voc_a1_pineapple_001` | **pineapple** | *noun* | `/ˈpaɪˌnæpəl/` | piña | This juice has pineapple in it. | Este jugo tiene piña. |
| `voc_a1_mango_001` | **mango** | *noun* | `/ˈmæŋgoʊ/` | mango | The mango is very sweet. | El mango está muy dulce. |
| `voc_a1_pear_001` | **pear** | *noun* | `/pɛr/` | pera | She ate a pear for a snack. | Ella comió una pera de merienda. |
| `voc_a1_peach_001` | **peach** | *noun* | `/pitʃ/` | durazno | I bought some fresh peaches. | Compré unos duraznos frescos. |
| `voc_a1_cherry_001` | **cherry** | *noun* | `/ˈtʃɛri/` | cereza | The cake has cherries on top. | El pastel tiene cerezas encima. |
| `voc_a1_potato_001` | **potato** | *noun* | `/pəˈteɪˌtoʊ/` | papa | We are cooking potatoes today. | Vamos a cocinar papas hoy. |
| `voc_a1_tomato_001` | **tomato** | *noun* | `/təˈmeɪˌtoʊ/` | tomate | Add a tomato to the salad. | Agrega un tomate a la ensalada. |
| `voc_a1_onion_001` | **onion** | *noun* | `/ˈʌnjən/` | cebolla | Chop the onion first. | Pica la cebolla primero. |
| `voc_a1_carrot_001` | **carrot** | *noun* | `/ˈkɛrət/` | zanahoria | Rabbits love carrots. | A los conejos les encantan las zanahorias. |
| `voc_a1_lettuce_001` | **lettuce** | *noun* | `/ˈlɛtəs/` | lechuga | The salad has fresh lettuce. | La ensalada tiene lechuga fresca. |
| `voc_a1_cucumber_001` | **cucumber** | *noun* | `/ˈkjukʌmbər/` | pepino | I add cucumber to my water. | Le agrego pepino a mi agua. |
| `voc_a1_corn_001` | **corn** | *noun* | `/kɔrn/` | maíz | We grow corn on the farm. | Cultivamos maíz en la granja. |
| `voc_a1_garlic_001` | **garlic** | *noun* | `/ˈgɑrlɪk/` | ajo | The sauce needs more garlic. | La salsa necesita más ajo. |
| `voc_a1_broccoli_001` | **broccoli** | *noun* | `/ˈbrɑkəli/` | brócoli | Eat your broccoli, please. | Come tu brócoli, por favor. |
| `voc_a1_pea_001` | **pea** | *noun* | `/pi/` | guisante | The soup has peas in it. | La sopa tiene guisantes. |
| `voc_a1_breakfast_001` | **breakfast** | *noun* | `/ˈbrɛkfəst/` | desayuno | What do you eat for breakfast? | ¿Qué comes en el desayuno? |
| `voc_a1_lunch_001` | **lunch** | *noun* | `/lʌntʃ/` | almuerzo | We have lunch at noon. | Almorzamos al mediodía. |
| `voc_a1_dinner_001` | **dinner** | *noun* | `/ˈdɪnər/` | cena | Dinner is ready. | La cena está lista. |
| `voc_a1_snack_001` | **snack** | *noun* | `/snæk/` | merienda | I want a snack before dinner. | Quiero una merienda antes de la cena. |
| `voc_a1_meal_001` | **meal** | *noun* | `/mil/` | comida | This was a delicious meal. | Esta fue una comida deliciosa. |
| `voc_a1_food_001` | **food** | *noun* | `/fud/` | comida/alimento | The food here is amazing. | La comida aquí es increíble. |
| `voc_a1_drink_001` | **drink** | *noun* | `/drɪŋk/` | bebida | Would you like a drink? | ¿Quieres una bebida? |
| `voc_a1_delicious_001` | **delicious** | *noun* | `/dɪˈlɪʃəs/` | delicioso | This cake is delicious. | Este pastel está delicioso. |
| `voc_a1_tasty_001` | **tasty** | *noun* | `/ˈteɪsti/` | sabroso | The soup is very tasty. | La sopa está muy sabrosa. |
| `voc_a1_sweet_001` | **sweet** | *noun* | `/swit/` | dulce | This fruit is very sweet. | Esta fruta es muy dulce. |
| `voc_a1_sour_001` | **sour** | *noun* | `/ˈsaʊər/` | agrio | The lemon is too sour. | El limón está muy agrio. |
| `voc_a1_bitter_001` | **bitter** | *noun* | `/ˈbɪtər/` | amargo | I don't like bitter coffee. | No me gusta el café amargo. |
| `voc_a1_spicy_001` | **spicy** | *noun* | `/ˈspaɪsi/` | picante | This dish is very spicy. | Este platillo es muy picante. |
| `voc_a1_fresh_001` | **fresh** | *noun* | `/frɛʃ/` | fresco | We buy fresh vegetables every week. | Compramos verduras frescas cada semana. |
| `voc_a1_cooked_001` | **cooked** | *noun* | `/kʊkt/` | cocinado | I prefer cooked vegetables. | Prefiero las verduras cocinadas. |
| `voc_a1_raw_001` | **raw** | *noun* | `/rɑ/` | crudo | She eats raw carrots. | Ella come zanahorias crudas. |
| `voc_a1_restaurant_001` | **restaurant** | *noun* | `/ˈrɛstrɑnt/` | restaurante | We ate at a nice restaurant. | Comimos en un buen restaurante. |
| `voc_a1_menu_001` | **menu** | *noun* | `/ˈmɛnju/` | menú | Can I see the menu, please? | ¿Puedo ver el menú, por favor? |
| `voc_a1_waiter-waitress_001` | **waiter / waitress** | *noun* | `/ˈweɪtər/` | mesero/a | The waiter brought our food. | El mesero trajo nuestra comida. |
| `voc_a1_bill_001` | **bill (check)** | *noun* | `/bɪl/` | cuenta | Can we have the bill, please? | ¿Nos trae la cuenta, por favor? |
| `voc_a1_order_001` | **order (food)** | *verb* | `/ˈɔrdər/` | pedir/pedido | I would like to order the fish. | Quisiera pedir el pescado. |
| `voc_a1_cook_001` | **cook (person)** | *noun* | `/kʊk/` | cocinero | My father is a great cook. | Mi padre es un gran cocinero. |
| `voc_a1_chef_001` | **chef** | *noun* | `/ʃɛf/` | chef | The chef prepared a special dish. | El chef preparó un platillo especial. |
| `voc_a1_eat_001` | **eat** | *verb* | `/it/` | comer | We eat dinner at eight. | Cenamos a las ocho. |
| `voc_a1_drink_002` | **drink (verb)** | *verb* | `/drɪŋk/` | beber | Please drink some water. | Por favor bebe un poco de agua. |
| `voc_a1_cook_002` | **cook (verb)** | *verb* | `/kʊk/` | cocinar | I cook dinner every night. | Cocino la cena todas las noches. |
| `voc_a1_buy_001` | **buy** | *verb* | `/baɪ/` | comprar | I need to buy some bread. | Necesito comprar pan. |
| `voc_a1_cut_001` | **cut** | *verb* | `/kʌt/` | cortar | Cut the tomatoes into small pieces. | Corta los tomates en trozos pequeños. |
| `voc_a1_taste_001` | **taste (verb)** | *verb* | `/teɪst/` | probar | Can I taste the soup? | ¿Puedo probar la sopa? |

### Semana 7: Semana 7 – Ropa y cuerpo
Total de palabras en esta semana: **77**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_shirt_001` | **shirt** | *noun* | `/ʃɜrt/` | camisa | He is wearing a blue shirt. | Él lleva una camisa azul. |
| `voc_a1_t-shirt_001` | **t-shirt** | *noun* | `/ˈtiˌʃɜrt/` | camiseta | I bought a new t-shirt. | Compré una camiseta nueva. |
| `voc_a1_pants-trousers_001` | **pants / trousers** | *noun* | `/pænts/` | pantalones | These pants are too long. | Estos pantalones son muy largos. |
| `voc_a1_jeans_001` | **jeans** | *noun* | `/dʒinz/` | jeans | She wears jeans to work. | Ella usa jeans para trabajar. |
| `voc_a1_dress_001` | **dress** | *noun* | `/drɛs/` | vestido | She bought a beautiful dress. | Ella compró un vestido hermoso. |
| `voc_a1_skirt_001` | **skirt** | *noun* | `/skɜrt/` | falda | The skirt matches her shoes. | La falda combina con sus zapatos. |
| `voc_a1_jacket_001` | **jacket** | *noun* | `/ˈdʒækɪt/` | chaqueta | Wear a jacket, it's cold. | Ponte una chaqueta, hace frío. |
| `voc_a1_coat_001` | **coat** | *noun* | `/koʊt/` | abrigo | Take your coat, it's winter. | Lleva tu abrigo, es invierno. |
| `voc_a1_sweater_001` | **sweater** | *verb* | `/ˈswɛtər/` | suéter | I need a warm sweater. | Necesito un suéter abrigado. |
| `voc_a1_suit_001` | **suit** | *noun* | `/sut/` | traje | He wore a suit to the interview. | Él usó un traje para la entrevista. |
| `voc_a1_shoes_001` | **shoes** | *noun* | `/ʃuz/` | zapatos | These shoes are very comfortable. | Estos zapatos son muy cómodos. |
| `voc_a1_socks_001` | **socks** | *noun* | `/sɑks/` | calcetines | I need clean socks. | Necesito calcetines limpios. |
| `voc_a1_hat_001` | **hat** | *noun* | `/hæt/` | sombrero | She wears a hat in the sun. | Ella usa sombrero bajo el sol. |
| `voc_a1_cap_001` | **cap** | *noun* | `/kæp/` | gorra | He always wears a baseball cap. | Él siempre usa una gorra de béisbol. |
| `voc_a1_gloves_001` | **gloves** | *noun* | `/glʌvz/` | guantes | Put on your gloves, it's cold. | Ponte los guantes, hace frío. |
| `voc_a1_scarf_001` | **scarf** | *noun* | `/skɑrf/` | bufanda | She wears a scarf in winter. | Ella usa bufanda en invierno. |
| `voc_a1_belt_001` | **belt** | *noun* | `/bɛlt/` | cinturón | This belt is too big for me. | Este cinturón me queda muy grande. |
| `voc_a1_tie_001` | **tie** | *noun* | `/taɪ/` | corbata | He wears a tie to work. | Él usa corbata para trabajar. |
| `voc_a1_underwear_001` | **underwear** | *noun* | `/ˈʌndərˌwɛr/` | ropa interior | I need to buy new underwear. | Necesito comprar ropa interior nueva. |
| `voc_a1_pajamas_001` | **pajamas** | *noun* | `/pəˈdʒɑməz/` | pijama | The kids are in their pajamas. | Los niños están en pijama. |
| `voc_a1_shorts_001` | **shorts** | *noun* | `/ʃɔrts/` | pantalones cortos | He wears shorts in summer. | Él usa pantalones cortos en verano. |
| `voc_a1_boots_001` | **boots** | *noun* | `/buts/` | botas | I bought new boots for winter. | Compré botas nuevas para el invierno. |
| `voc_a1_sandals_001` | **sandals** | *noun* | `/ˈsændəlz/` | sandalias | She wears sandals at the beach. | Ella usa sandalias en la playa. |
| `voc_a1_head_001` | **head** | *noun* | `/hɛd/` | cabeza | My head hurts a little. | Me duele un poco la cabeza. |
| `voc_a1_hair_001` | **hair** | *noun* | `/hɛr/` | cabello | She has long black hair. | Ella tiene el cabello largo y negro. |
| `voc_a1_face_001` | **face** | *noun* | `/feɪs/` | cara | Wash your face before bed. | Lávate la cara antes de dormir. |
| `voc_a1_eye_001` | **eye** | *noun* | `/aɪ/` | ojo | She has beautiful blue eyes. | Ella tiene hermosos ojos azules. |
| `voc_a1_ear_001` | **ear** | *noun* | `/ɪr/` | oreja | My ear hurts. | Me duele el oído. |
| `voc_a1_nose_001` | **nose** | *noun* | `/noʊz/` | nariz | His nose is a little red. | Su nariz está un poco roja. |
| `voc_a1_mouth_001` | **mouth** | *noun* | `/maʊθ/` | boca | Open your mouth, please. | Abre la boca, por favor. |
| `voc_a1_teeth_001` | **teeth** | *noun* | `/tiθ/` | dientes | Brush your teeth every night. | Cepíllate los dientes todas las noches. |
| `voc_a1_tongue_001` | **tongue** | *noun* | `/tʌŋ/` | lengua | The doctor checked her tongue. | El médico revisó su lengua. |
| `voc_a1_neck_001` | **neck** | *noun* | `/nɛk/` | cuello | My neck hurts from sitting all day. | Me duele el cuello por estar sentado todo el día. |
| `voc_a1_shoulder_001` | **shoulder** | *noun* | `/ˈʃoʊldər/` | hombro | He carries his bag on one shoulder. | Él lleva su bolsa en un hombro. |
| `voc_a1_arm_001` | **arm** | *noun* | `/ɑrm/` | brazo | She broke her arm last year. | Ella se rompió el brazo el año pasado. |
| `voc_a1_elbow_001` | **elbow** | *noun* | `/ˈɛlˌboʊ/` | codo | I hurt my elbow. | Me lastimé el codo. |
| `voc_a1_hand_001` | **hand** | *noun* | `/hænd/` | mano | Give me your hand. | Dame tu mano. |
| `voc_a1_finger_001` | **finger** | *noun* | `/ˈfɪŋgər/` | dedo | She cut her finger. | Ella se cortó el dedo. |
| `voc_a1_chest_001` | **chest** | *noun* | `/tʃɛst/` | pecho | He has pain in his chest. | Él tiene dolor en el pecho. |
| `voc_a1_back_001` | **back** | *noun* | `/bæk/` | espalda | My back hurts after work. | Me duele la espalda después del trabajo. |
| `voc_a1_stomach_001` | **stomach** | *noun* | `/ˈstʌmək/` | estómago | My stomach hurts a little. | Me duele un poco el estómago. |
| `voc_a1_leg_001` | **leg** | *noun* | `/lɛg/` | pierna | She hurt her leg playing soccer. | Ella se lastimó la pierna jugando fútbol. |
| `voc_a1_knee_001` | **knee** | *noun* | `/ni/` | rodilla | He has pain in his knee. | Él tiene dolor en la rodilla. |
| `voc_a1_foot-feet_001` | **foot / feet** | *noun* | `/fʊt/` | pie / pies | My feet hurt from walking. | Me duelen los pies de tanto caminar. |
| `voc_a1_toe_001` | **toe** | *noun* | `/toʊ/` | dedo del pie | I hurt my toe on the chair. | Me lastimé el dedo del pie con la silla. |
| `voc_a1_skin_001` | **skin** | *noun* | `/skɪn/` | piel | Her skin is very soft. | Su piel es muy suave. |
| `voc_a1_heart_002` | **heart (body)** | *noun* | `/hɑrt/` | corazón (órgano) | Exercise is good for your heart. | El ejercicio es bueno para el corazón. |
| `voc_a1_brain_001` | **brain** | *noun* | `/breɪn/` | cerebro | Reading is good for the brain. | Leer es bueno para el cerebro. |
| `voc_a1_bone_001` | **bone** | *noun* | `/boʊn/` | hueso | He broke a bone in his hand. | Se rompió un hueso de la mano. |
| `voc_a1_blood_001` | **blood** | *noun* | `/blʌd/` | sangre | The doctor took a blood sample. | El médico tomó una muestra de sangre. |
| `voc_a1_muscle_001` | **muscle** | *noun* | `/ˈmʌsəl/` | músculo | He has strong arm muscles. | Él tiene músculos de brazo fuertes. |
| `voc_a1_nail_001` | **nail** | *noun* | `/neɪl/` | uña | She painted her nails red. | Ella se pintó las uñas de rojo. |
| `voc_a1_lip_001` | **lip** | *noun* | `/lɪp/` | labio | Her lip is a little swollen. | Su labio está un poco hinchado. |
| `voc_a1_eyebrow_001` | **eyebrow** | *noun* | `/ˈaɪˌbraʊ/` | ceja | He raised his eyebrow in surprise. | Él levantó la ceja sorprendido. |
| `voc_a1_eyelash_001` | **eyelash** | *noun* | `/ˈaɪˌlæʃ/` | pestaña | An eyelash fell into my eye. | Se me cayó una pestaña en el ojo. |
| `voc_a1_chin_001` | **chin** | *noun* | `/tʃɪn/` | mentón | He rested his chin on his hand. | Él apoyó el mentón en su mano. |
| `voc_a1_cheek_001` | **cheek** | *noun* | `/tʃik/` | mejilla | She kissed his cheek. | Ella le besó la mejilla. |
| `voc_a1_forehead_001` | **forehead** | *noun* | `/ˈfɔrhɛd/` | frente | His forehead was sweating. | Su frente estaba sudando. |
| `voc_a1_waist_001` | **waist** | *noun* | `/weɪst/` | cintura | The belt fits around your waist. | El cinturón se ajusta a tu cintura. |
| `voc_a1_wear_001` | **wear** | *noun* | `/wɛr/` | llevar puesto | What are you going to wear tonight? | ¿Qué te vas a poner esta noche? |
| `voc_a1_put-on_001` | **put on** | *noun* | `/pʊt ɑn/` | ponerse | Put on your jacket, it's cold. | Ponte tu chaqueta, hace frío. |
| `voc_a1_take-off_001` | **take off** | *noun* | `/teɪk ɔf/` | quitarse | Take off your shoes, please. | Quítate los zapatos, por favor. |
| `voc_a1_dress_002` | **dress (verb)** | *verb* | `/drɛs/` | vestirse | She dresses very well. | Ella se viste muy bien. |
| `voc_a1_try-on_001` | **try on** | *noun* | `/traɪ ɑn/` | probarse | Can I try on this shirt? | ¿Puedo probarme esta camisa? |
| `voc_a1_size_001` | **size** | *noun* | `/saɪz/` | talla | What size are you? | ¿Qué talla usas? |
| `voc_a1_fashion_001` | **fashion** | *noun* | `/ˈfæʃən/` | moda | She is interested in fashion. | A ella le interesa la moda. |
| `voc_a1_style_001` | **style** | *noun* | `/staɪl/` | estilo | I like your style. | Me gusta tu estilo. |
| `voc_a1_fabric_001` | **fabric** | *noun* | `/ˈfæbrɪk/` | tela | This fabric feels very soft. | Esta tela se siente muy suave. |
| `voc_a1_cotton_001` | **cotton** | *noun* | `/ˈkɑtən/` | algodón | This shirt is made of cotton. | Esta camisa está hecha de algodón. |
| `voc_a1_wool_001` | **wool** | *noun* | `/wʊl/` | lana | This sweater is made of wool. | Este suéter está hecho de lana. |
| `voc_a1_leather_001` | **leather** | *noun* | `/ˈlɛðər/` | cuero | He wears a leather jacket. | Él usa una chaqueta de cuero. |
| `voc_a1_button_001` | **button** | *noun* | `/ˈbʌtən/` | botón | A button fell off my shirt. | Se le cayó un botón a mi camisa. |
| `voc_a1_zipper_001` | **zipper** | *noun* | `/ˈzɪpər/` | cremallera | The zipper on my jacket is broken. | El cierre de mi chaqueta está roto. |
| `voc_a1_pocket_001` | **pocket** | *noun* | `/ˈpɑkət/` | bolsillo | I put my keys in my pocket. | Puse mis llaves en el bolsillo. |
| `voc_a1_sleeve_001` | **sleeve** | *noun* | `/sliv/` | manga | This shirt has short sleeves. | Esta camisa tiene mangas cortas. |
| `voc_a1_collar_001` | **collar** | *noun* | `/ˈkɑlər/` | cuello (ropa) | His collar is a bit tight. | Su cuello (de la camisa) le queda un poco apretado. |
| `voc_a1_umbrella_001` | **umbrella** | *noun* | `/ʌmˈbrɛlə/` | paraguas | Take an umbrella, it might rain. | Lleva un paraguas, podría llover. |

### Semana 8: Semana 8 – Verbos de la rutina diaria
Total de palabras en esta semana: **85**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_wake-up_001` | **wake up** | *verb* | `/weɪk ʌp/` | despertarse | I wake up at seven every day. | Me despierto a las siete todos los días. |
| `voc_a1_get-up_001` | **get up** | *verb* | `/gɛt ʌp/` | levantarse | She gets up early on weekdays. | Ella se levanta temprano entre semana. |
| `voc_a1_sleep_001` | **sleep** | *verb* | `/slip/` | dormir | I sleep eight hours a night. | Duermo ocho horas por noche. |
| `voc_a1_go-to-bed_001` | **go to bed** | *verb* | `/goʊ tu bɛd/` | irse a la cama | We go to bed at ten. | Nos vamos a la cama a las diez. |
| `voc_a1_wash_001` | **wash** | *verb* | `/wɑʃ/` | lavar | I wash my hands before eating. | Me lavo las manos antes de comer. |
| `voc_a1_take-a-shower_001` | **take a shower** | *verb* | `/teɪk ə ˈʃaʊər/` | ducharse | He takes a shower every morning. | Él se ducha todas las mañanas. |
| `voc_a1_brush_001` | **brush (teeth)** | *verb* | `/brʌʃ/` | cepillarse | I brush my teeth twice a day. | Me cepillo los dientes dos veces al día. |
| `voc_a1_comb_001` | **comb** | *verb* | `/koʊm/` | peinar | She combs her hair every morning. | Ella se peina todas las mañanas. |
| `voc_a1_get-dressed_001` | **get dressed** | *verb* | `/gɛt drɛst/` | vestirse | The children get dressed for school. | Los niños se visten para la escuela. |
| `voc_a1_have-breakfast_001` | **have breakfast** | *verb* | `/hæv ˈbrɛkfəst/` | desayunar | We have breakfast at eight. | Desayunamos a las ocho. |
| `voc_a1_go-to-work_001` | **go to work** | *verb* | `/goʊ tu wɜrk/` | ir al trabajo | He goes to work by bus. | Él va al trabajo en autobús. |
| `voc_a1_go-to-school_001` | **go to school** | *verb* | `/goʊ tu skul/` | ir a la escuela | The kids go to school at seven thirty. | Los niños van a la escuela a las siete y media. |
| `voc_a1_study_001` | **study** | *verb* | `/ˈstʌdi/` | estudiar | I study English every night. | Estudio inglés todas las noches. |
| `voc_a1_work_001` | **work** | *verb* | `/wɜrk/` | trabajar | She works in a hospital. | Ella trabaja en un hospital. |
| `voc_a1_read_001` | **read** | *verb* | `/rid/` | leer | I read a book before sleeping. | Leo un libro antes de dormir. |
| `voc_a1_write_001` | **write** | *verb* | `/raɪt/` | escribir | He writes letters to his family. | Él le escribe cartas a su familia. |
| `voc_a1_listen_001` | **listen** | *verb* | `/ˈlɪsən/` | escuchar | We listen to music in the car. | Escuchamos música en el carro. |
| `voc_a1_speak_001` | **speak** | *verb* | `/spik/` | hablar | Do you speak English? | ¿Hablas inglés? |
| `voc_a1_talk_001` | **talk** | *verb* | `/tɔk/` | conversar | We talk on the phone every day. | Hablamos por teléfono todos los días. |
| `voc_a1_watch_001` | **watch** | *verb* | `/wɑtʃ/` | mirar/ver | They watch TV after dinner. | Ellos ven televisión después de cenar. |
| `voc_a1_walk_001` | **walk** | *verb* | `/wɔk/` | caminar | I walk to work every day. | Camino al trabajo todos los días. |
| `voc_a1_run_001` | **run** | *verb* | `/rʌn/` | correr | She runs in the park on Sundays. | Ella corre en el parque los domingos. |
| `voc_a1_drive_001` | **drive** | *verb* | `/draɪv/` | conducir | He drives to the office. | Él conduce a la oficina. |
| `voc_a1_ride_001` | **ride** | *verb* | `/raɪd/` | montar | I ride my bike to school. | Voy a la escuela en bicicleta. |
| `voc_a1_travel_001` | **travel** | *verb* | `/ˈtrævəl/` | viajar | We travel every summer. | Viajamos cada verano. |
| `voc_a1_arrive_001` | **arrive** | *verb* | `/əˈraɪv/` | llegar | The train arrives at nine. | El tren llega a las nueve. |
| `voc_a1_leave_001` | **leave** | *verb* | `/liv/` | salir/irse | I leave home at eight. | Salgo de casa a las ocho. |
| `voc_a1_come_001` | **come** | *verb* | `/kʌm/` | venir | Can you come to the party? | ¿Puedes venir a la fiesta? |
| `voc_a1_go_001` | **go** | *verb* | `/goʊ/` | ir | We go to the market on Saturdays. | Vamos al mercado los sábados. |
| `voc_a1_stay_001` | **stay** | *verb* | `/steɪ/` | quedarse | We stay home on Sundays. | Nos quedamos en casa los domingos. |
| `voc_a1_live_001` | **live** | *verb* | `/lɪv/` | vivir | I live in a small apartment. | Vivo en un apartamento pequeño. |
| `voc_a1_rest_001` | **rest** | *verb* | `/rɛst/` | descansar | I need to rest after work. | Necesito descansar después del trabajo. |
| `voc_a1_relax_001` | **relax** | *verb* | `/rɪˈlæks/` | relajarse | We relax on the weekend. | Nos relajamos el fin de semana. |
| `voc_a1_play_001` | **play** | *verb* | `/pleɪ/` | jugar | The children play in the park. | Los niños juegan en el parque. |
| `voc_a1_dance_001` | **dance** | *verb* | `/dæns/` | bailar | We dance at every party. | Bailamos en cada fiesta. |
| `voc_a1_sing_001` | **sing** | *verb* | `/sɪŋ/` | cantar | She sings in the shower. | Ella canta en la ducha. |
| `voc_a1_wash-dishes_001` | **wash dishes** | *verb* | `/wɑʃ ˈdɪʃɪz/` | lavar platos | I wash the dishes after dinner. | Lavo los platos después de la cena. |
| `voc_a1_do-homework_001` | **do homework** | *verb* | `/du ˈhoʊmˌwɜrk/` | hacer tarea | He does his homework after school. | Él hace su tarea después de la escuela. |
| `voc_a1_exercise_001` | **exercise** | *verb* | `/ˈɛksərˌsaɪz/` | ejercitarse | I exercise three times a week. | Hago ejercicio tres veces por semana. |
| `voc_a1_swim_001` | **swim** | *verb* | `/swɪm/` | nadar | We swim in the summer. | Nadamos en el verano. |
| `voc_a1_jump_001` | **jump** | *verb* | `/dʒʌmp/` | saltar | The kids jump on the bed. | Los niños saltan en la cama. |
| `voc_a1_sit_001` | **sit** | *verb* | `/sɪt/` | sentarse | Please sit here. | Por favor siéntate aquí. |
| `voc_a1_stand_001` | **stand** | *verb* | `/stænd/` | pararse | We stood in line for an hour. | Estuvimos parados en la fila una hora. |
| `voc_a1_wait_001` | **wait** | *verb* | `/weɪt/` | esperar | I am waiting for the bus. | Estoy esperando el autobús. |
| `voc_a1_need_001` | **need** | *verb* | `/nid/` | necesitar | I need help with this box. | Necesito ayuda con esta caja. |
| `voc_a1_want_001` | **want** | *verb* | `/wɑnt/` | querer | She wants a new phone. | Ella quiere un teléfono nuevo. |
| `voc_a1_like_001` | **like** | *verb* | `/laɪk/` | gustar | I like this song. | Me gusta esta canción. |
| `voc_a1_know_001` | **know** | *verb* | `/noʊ/` | saber/conocer | I know the answer. | Sé la respuesta. |
| `voc_a1_think_001` | **think** | *verb* | `/θɪŋk/` | pensar | I think it will rain. | Creo que va a llover. |
| `voc_a1_remember_001` | **remember** | *verb* | `/rɪˈmɛmbər/` | recordar | I don't remember his name. | No recuerdo su nombre. |
| `voc_a1_forget_001` | **forget** | *verb* | `/fərˈgɛt/` | olvidar | Don't forget your keys. | No olvides tus llaves. |
| `voc_a1_understand_001` | **understand** | *verb* | `/ˌʌndərˈstænd/` | entender | Do you understand the question? | ¿Entiendes la pregunta? |
| `voc_a1_learn_001` | **learn** | *verb* | `/lɜrn/` | aprender | I want to learn English. | Quiero aprender inglés. |
| `voc_a1_teach_001` | **teach** | *verb* | `/titʃ/` | enseñar | She teaches math at school. | Ella enseña matemáticas en la escuela. |
| `voc_a1_ask_001` | **ask** | *verb* | `/æsk/` | preguntar | Can I ask you a question? | ¿Puedo hacerte una pregunta? |
| `voc_a1_answer_001` | **answer** | *verb* | `/ˈænsər/` | responder | Please answer the phone. | Por favor contesta el teléfono. |
| `voc_a1_say_001` | **say** | *verb* | `/seɪ/` | decir | What did she say? | ¿Qué dijo ella? |
| `voc_a1_tell_001` | **tell** | *verb* | `/tɛl/` | contar/decir | Tell me the truth. | Dime la verdad. |
| `voc_a1_give_001` | **give** | *verb* | `/gɪv/` | dar | Give me your hand. | Dame tu mano. |
| `voc_a1_take_001` | **take** | *verb* | `/teɪk/` | tomar | Take an umbrella, it's raining. | Lleva un paraguas, está lloviendo. |
| `voc_a1_bring_001` | **bring** | *verb* | `/brɪŋ/` | traer | Bring your homework tomorrow. | Trae tu tarea mañana. |
| `voc_a1_send_001` | **send** | *verb* | `/sɛnd/` | enviar | I will send you an email. | Te enviaré un correo electrónico. |
| `voc_a1_receive_001` | **receive** | *verb* | `/rɪˈsiv/` | recibir | I received a gift from her. | Recibí un regalo de ella. |
| `voc_a1_sell_001` | **sell** | *verb* | `/sɛl/` | vender | They sell fresh fruit here. | Aquí venden fruta fresca. |
| `voc_a1_pay_001` | **pay** | *verb* | `/peɪ/` | pagar | I will pay for dinner. | Yo pagaré la cena. |
| `voc_a1_spend_001` | **spend** | *verb* | `/spɛnd/` | gastar | We spend a lot on rent. | Gastamos mucho en el alquiler. |
| `voc_a1_save_001` | **save** | *verb* | `/seɪv/` | ahorrar | I save money every month. | Ahorro dinero cada mes. |
| `voc_a1_lose_001` | **lose** | *verb* | `/luz/` | perder | Don't lose your ticket. | No pierdas tu boleto. |
| `voc_a1_find_001` | **find** | *verb* | `/faɪnd/` | encontrar | I can't find my keys. | No encuentro mis llaves. |
| `voc_a1_look-for_001` | **look for** | *verb* | `/lʊk fɔr/` | buscar | I am looking for my phone. | Estoy buscando mi teléfono. |
| `voc_a1_look-at_001` | **look at** | *verb* | `/lʊk æt/` | mirar | Look at that beautiful sunset. | Mira ese hermoso atardecer. |
| `voc_a1_see_001` | **see** | *verb* | `/si/` | ver | I see a bird in the tree. | Veo un pájaro en el árbol. |
| `voc_a1_hear_001` | **hear** | *verb* | `/hɪr/` | oír | Can you hear the music? | ¿Puedes oír la música? |
| `voc_a1_feel_001` | **feel** | *verb* | `/fil/` | sentir | I feel tired today. | Me siento cansado hoy. |
| `voc_a1_smell_001` | **smell** | *verb* | `/smɛl/` | oler | This flower smells wonderful. | Esta flor huele maravilloso. |
| `voc_a1_touch_001` | **touch** | *verb* | `/tʌtʃ/` | tocar | Don't touch the wet paint. | No toques la pintura mojada. |
| `voc_a1_start_001` | **start** | *verb* | `/stɑrt/` | empezar | The movie starts at eight. | La película empieza a las ocho. |
| `voc_a1_finish_001` | **finish** | *verb* | `/ˈfɪnɪʃ/` | terminar | I finish work at five. | Termino de trabajar a las cinco. |
| `voc_a1_stop_001` | **stop** | *verb* | `/stɑp/` | parar | The bus stops here. | El autobús para aquí. |
| `voc_a1_continue_001` | **continue** | *verb* | `/kənˈtɪnju/` | continuar | Please continue with the story. | Por favor continúa con la historia. |
| `voc_a1_try_001` | **try** | *verb* | `/traɪ/` | intentar | Try this cake, it's delicious. | Prueba este pastel, está delicioso. |
| `voc_a1_use_001` | **use** | *verb* | `/juz/` | usar | I use my phone every day. | Uso mi teléfono todos los días. |
| `voc_a1_make_001` | **make** | *verb* | `/meɪk/` | hacer/fabricar | She makes breakfast every morning. | Ella hace el desayuno cada mañana. |
| `voc_a1_fix_001` | **fix** | *verb* | `/fɪks/` | arreglar | Can you fix my computer? | ¿Puedes arreglar mi computadora? |
| `voc_a1_break_001` | **break** | *verb* | `/breɪk/` | romper | Be careful, don't break the glass. | Ten cuidado, no rompas el vaso. |

### Semana 9: Semana 9 – Clima y lugares de la ciudad
Total de palabras en esta semana: **69**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_sun_001` | **sun** | *noun* | `/sʌn/` | sol | The sun is very bright today. | El sol está muy brillante hoy. |
| `voc_a1_sunny_001` | **sunny** | *noun* | `/ˈsʌni/` | soleado | It is sunny this afternoon. | Está soleado esta tarde. |
| `voc_a1_rain_001` | **rain** | *noun* | `/reɪn/` | lluvia | I love the sound of rain. | Me encanta el sonido de la lluvia. |
| `voc_a1_rainy_001` | **rainy** | *noun* | `/ˈreɪni/` | lluvioso | It is a rainy day. | Es un día lluvioso. |
| `voc_a1_cloud_001` | **cloud** | *noun* | `/klaʊd/` | nube | There is a big cloud in the sky. | Hay una nube grande en el cielo. |
| `voc_a1_cloudy_001` | **cloudy** | *noun* | `/ˈklaʊdi/` | nublado | It is cloudy this morning. | Está nublado esta mañana. |
| `voc_a1_wind_001` | **wind** | *noun* | `/wɪnd/` | viento | The wind is very strong today. | El viento está muy fuerte hoy. |
| `voc_a1_windy_001` | **windy** | *noun* | `/ˈwɪndi/` | ventoso | It is windy near the beach. | Hace viento cerca de la playa. |
| `voc_a1_snow_001` | **snow** | *noun* | `/snoʊ/` | nieve | The snow covers the mountains. | La nieve cubre las montañas. |
| `voc_a1_snowy_001` | **snowy** | *noun* | `/ˈsnoʊi/` | nevado | It was a snowy winter. | Fue un invierno nevado. |
| `voc_a1_storm_001` | **storm** | *noun* | `/stɔrm/` | tormenta | A storm is coming tonight. | Una tormenta se acerca esta noche. |
| `voc_a1_fog_001` | **fog** | *noun* | `/fɔg/` | niebla | There is a lot of fog this morning. | Hay mucha niebla esta mañana. |
| `voc_a1_temperature_001` | **temperature** | *noun* | `/ˈtɛmpərətʃər/` | temperatura | The temperature is very high today. | La temperatura está muy alta hoy. |
| `voc_a1_degree_001` | **degree** | *noun* | `/dɪˈgri/` | grado | It is thirty degrees outside. | Hace treinta grados afuera. |
| `voc_a1_weather-forecast_001` | **weather forecast** | *noun* | `/ˈwɛðər ˈfɔrˌkæst/` | pronóstico del tiempo | The weather forecast says it will rain. | El pronóstico del tiempo dice que lloverá. |
| `voc_a1_weather_001` | **weather** | *noun* | `/ˈwɛðər/` | clima | How is the weather today? | ¿Cómo está el clima hoy? |
| `voc_a1_city_001` | **city** | *noun* | `/ˈsɪti/` | ciudad | I live in a big city. | Vivo en una ciudad grande. |
| `voc_a1_town_001` | **town** | *noun* | `/taʊn/` | pueblo | My grandparents live in a small town. | Mis abuelos viven en un pueblo pequeño. |
| `voc_a1_village_001` | **village** | *noun* | `/ˈvɪlɪdʒ/` | aldea | They live in a quiet village. | Ellos viven en una aldea tranquila. |
| `voc_a1_street_001` | **street** | *noun* | `/strit/` | calle | My house is on this street. | Mi casa está en esta calle. |
| `voc_a1_road_001` | **road** | *noun* | `/roʊd/` | carretera | The road to the beach is long. | El camino a la playa es largo. |
| `voc_a1_avenue_001` | **avenue** | *noun* | `/ˈævəˌnu/` | avenida | The store is on Fifth Avenue. | La tienda está en la Quinta Avenida. |
| `voc_a1_park_001` | **park** | *noun* | `/pɑrk/` | parque | We walk in the park every evening. | Caminamos en el parque cada tarde. |
| `voc_a1_square_002` | **square (place)** | *noun* | `/skwɛr/` | plaza | People meet in the town square. | La gente se reúne en la plaza del pueblo. |
| `voc_a1_bridge_001` | **bridge** | *noun* | `/brɪdʒ/` | puente | We crossed the bridge on foot. | Cruzamos el puente a pie. |
| `voc_a1_building_001` | **building** | *noun* | `/ˈbɪldɪŋ/` | edificio | That building is very tall. | Ese edificio es muy alto. |
| `voc_a1_church_001` | **church** | *noun* | `/tʃɜrtʃ/` | iglesia | We go to church on Sundays. | Vamos a la iglesia los domingos. |
| `voc_a1_school_001` | **school** | *noun* | `/skul/` | escuela | The school is near my house. | La escuela está cerca de mi casa. |
| `voc_a1_hospital_001` | **hospital** | *noun* | `/ˈhɑˌspɪtəl/` | hospital | My mother works at the hospital. | Mi madre trabaja en el hospital. |
| `voc_a1_bank_001` | **bank** | *noun* | `/bæŋk/` | banco | I need to go to the bank. | Necesito ir al banco. |
| `voc_a1_supermarket_001` | **supermarket** | *noun* | `/ˈsupərˌmɑrkɪt/` | supermercado | We buy food at the supermarket. | Compramos comida en el supermercado. |
| `voc_a1_market_001` | **market** | *noun* | `/ˈmɑrkɪt/` | mercado | The fruit at the market is fresh. | La fruta en el mercado está fresca. |
| `voc_a1_store-shop_001` | **store / shop** | *noun* | `/stɔr/` | tienda | The store closes at nine. | La tienda cierra a las nueve. |
| `voc_a1_mall_001` | **mall** | *noun* | `/mɔl/` | centro comercial | We went shopping at the mall. | Fuimos de compras al centro comercial. |
| `voc_a1_museum_001` | **museum** | *noun* | `/mjuˈziəm/` | museo | We visited the art museum. | Visitamos el museo de arte. |
| `voc_a1_library_001` | **library** | *noun* | `/ˈlaɪbrɛri/` | biblioteca | I study at the library. | Estudio en la biblioteca. |
| `voc_a1_cinema-movie-theater_001` | **cinema / movie theater** | *noun* | `/ˈsɪnəmə/` | cine | We went to the cinema last night. | Fuimos al cine anoche. |
| `voc_a1_theater_001` | **theater** | *noun* | `/ˈθiətər/` | teatro | The play is at the theater tonight. | La obra es en el teatro esta noche. |
| `voc_a1_hotel_001` | **hotel** | *noun* | `/hoʊˈtɛl/` | hotel | We stayed at a nice hotel. | Nos quedamos en un buen hotel. |
| `voc_a1_airport_001` | **airport** | *noun* | `/ˈɛrˌpɔrt/` | aeropuerto | I will pick you up at the airport. | Te recogeré en el aeropuerto. |
| `voc_a1_station_001` | **station** | *noun* | `/ˈsteɪʃən/` | estación | The train station is very busy. | La estación de tren está muy concurrida. |
| `voc_a1_bus-stop_001` | **bus stop** | *noun* | `/bʌs stɑp/` | parada de bus | I wait for the bus at this bus stop. | Espero el autobús en esta parada. |
| `voc_a1_caf_001` | **café** | *noun* | `/kæˈfeɪ/` | cafetería | Let's meet at the café. | Reunámonos en la cafetería. |
| `voc_a1_gym_001` | **gym** | *noun* | `/dʒɪm/` | gimnasio | I go to the gym every morning. | Voy al gimnasio todas las mañanas. |
| `voc_a1_pool_001` | **pool** | *noun* | `/pul/` | piscina | The kids are swimming in the pool. | Los niños están nadando en la piscina. |
| `voc_a1_beach_001` | **beach** | *noun* | `/bitʃ/` | playa | We spent the day at the beach. | Pasamos el día en la playa. |
| `voc_a1_mountain_001` | **mountain** | *noun* | `/ˈmaʊntən/` | montaña | We climbed the mountain last summer. | Subimos la montaña el verano pasado. |
| `voc_a1_river_001` | **river** | *noun* | `/ˈrɪvər/` | río | The river runs through the city. | El río atraviesa la ciudad. |
| `voc_a1_lake_001` | **lake** | *noun* | `/leɪk/` | lago | We swim in the lake in summer. | Nadamos en el lago en verano. |
| `voc_a1_sea_001` | **sea** | *noun* | `/si/` | mar | The sea is very calm today. | El mar está muy calmado hoy. |
| `voc_a1_ocean_001` | **ocean** | *noun* | `/ˈoʊʃən/` | océano | The ocean is huge. | El océano es enorme. |
| `voc_a1_forest_001` | **forest** | *noun* | `/ˈfɔrɪst/` | bosque | We walked through the forest. | Caminamos por el bosque. |
| `voc_a1_farm_001` | **farm** | *noun* | `/fɑrm/` | granja | My uncle has a small farm. | Mi tío tiene una pequeña granja. |
| `voc_a1_left_001` | **left** | *noun* | `/lɛft/` | izquierda | Turn left at the corner. | Gira a la izquierda en la esquina. |
| `voc_a1_right_002` | **right (direction)** | *noun* | `/raɪt/` | derecha | The bank is on the right. | El banco está a la derecha. |
| `voc_a1_near_001` | **near** | *noun* | `/nɪr/` | cerca | The school is near my house. | La escuela está cerca de mi casa. |
| `voc_a1_far_001` | **far** | *noun* | `/fɑr/` | lejos | The airport is far from here. | El aeropuerto está lejos de aquí. |
| `voc_a1_next-to_001` | **next to** | *noun* | `/nɛkst tu/` | al lado de | The bank is next to the store. | El banco está al lado de la tienda. |
| `voc_a1_in-front-of_001` | **in front of** | *noun* | `/ɪn frʌnt ʌv/` | enfrente de | She is standing in front of the door. | Ella está parada enfrente de la puerta. |
| `voc_a1_behind_001` | **behind** | *noun* | `/bɪˈhaɪnd/` | detrás de | The park is behind the school. | El parque está detrás de la escuela. |
| `voc_a1_between_001` | **between** | *noun* | `/bɪˈtwin/` | entre | The bank is between the store and the café. | El banco está entre la tienda y la cafetería. |
| `voc_a1_corner_001` | **corner** | *noun* | `/ˈkɔrnər/` | esquina | The café is on the corner. | La cafetería está en la esquina. |
| `voc_a1_map_001` | **map** | *noun* | `/mæp/` | mapa | Can you show me on the map? | ¿Puedes mostrarme en el mapa? |
| `voc_a1_address_002` | **address (place)** | *noun* | `/əˈdrɛs/` | dirección | I don't know this address. | No conozco esta dirección. |
| `voc_a1_downtown_001` | **downtown** | *noun* | `/ˈdaʊnˌtaʊn/` | centro (de la ciudad) | We work downtown. | Trabajamos en el centro. |
| `voc_a1_suburb_001` | **suburb** | *noun* | `/ˈsʌbɜrb/` | suburbio | They live in a quiet suburb. | Ellos viven en un suburbio tranquilo. |
| `voc_a1_traffic-light_001` | **traffic light** | *noun* | `/ˈtræfɪk laɪt/` | semáforo | Stop at the traffic light. | Detente en el semáforo. |
| `voc_a1_sidewalk_001` | **sidewalk** | *noun* | `/ˈsaɪdˌwɔk/` | acera | Walk on the sidewalk, not the street. | Camina por la acera, no por la calle. |
| `voc_a1_crosswalk_001` | **crosswalk** | *noun* | `/ˈkrɔsˌwɔk/` | cruce peatonal | Cross the street at the crosswalk. | Cruza la calle por el cruce peatonal. |

### Semana 10: Semana 10 – Animales y naturaleza
Total de palabras en esta semana: **80**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_dog_001` | **dog** | *noun* | `/dɔg/` | perro | My dog likes to play outside. | A mi perro le gusta jugar afuera. |
| `voc_a1_cat_001` | **cat** | *noun* | `/kæt/` | gato | The cat is sleeping on the sofa. | El gato está durmiendo en el sofá. |
| `voc_a1_bird_001` | **bird** | *noun* | `/bɜrd/` | pájaro | A bird is singing in the tree. | Un pájaro está cantando en el árbol. |
| `voc_a1_fish_002` | **fish (animal)** | *noun* | `/fɪʃ/` | pez | We have three fish in the tank. | Tenemos tres peces en la pecera. |
| `voc_a1_horse_001` | **horse** | *noun* | `/hɔrs/` | caballo | She rides a horse every weekend. | Ella monta a caballo cada fin de semana. |
| `voc_a1_cow_001` | **cow** | *noun* | `/kaʊ/` | vaca | The cow gives fresh milk. | La vaca da leche fresca. |
| `voc_a1_pig_001` | **pig** | *noun* | `/pɪg/` | cerdo | The pig lives on the farm. | El cerdo vive en la granja. |
| `voc_a1_sheep_001` | **sheep** | *noun* | `/ʃip/` | oveja | The sheep are in the field. | Las ovejas están en el campo. |
| `voc_a1_goat_001` | **goat** | *noun* | `/goʊt/` | cabra | The goat eats grass all day. | La cabra come pasto todo el día. |
| `voc_a1_duck_001` | **duck** | *noun* | `/dʌk/` | pato | The duck swims in the lake. | El pato nada en el lago. |
| `voc_a1_rabbit_001` | **rabbit** | *noun* | `/ˈræbɪt/` | conejo | The rabbit is hiding in the garden. | El conejo se esconde en el jardín. |
| `voc_a1_mouse_001` | **mouse** | *noun* | `/maʊs/` | ratón | A mouse ran under the table. | Un ratón corrió debajo de la mesa. |
| `voc_a1_lion_001` | **lion** | *noun* | `/ˈlaɪən/` | león | The lion is the king of the jungle. | El león es el rey de la selva. |
| `voc_a1_tiger_001` | **tiger** | *noun* | `/ˈtaɪgər/` | tigre | The tiger has orange and black stripes. | El tigre tiene rayas naranjas y negras. |
| `voc_a1_elephant_001` | **elephant** | *noun* | `/ˈɛləfənt/` | elefante | The elephant is very big and gentle. | El elefante es muy grande y gentil. |
| `voc_a1_monkey_001` | **monkey** | *noun* | `/ˈmʌŋki/` | mono | The monkey climbed the tree quickly. | El mono subió al árbol rápidamente. |
| `voc_a1_bear_001` | **bear** | *noun* | `/bɛr/` | oso | We saw a bear in the forest. | Vimos un oso en el bosque. |
| `voc_a1_wolf_001` | **wolf** | *noun* | `/wʊlf/` | lobo | The wolf howled at the moon. | El lobo aulló a la luna. |
| `voc_a1_fox_001` | **fox** | *noun* | `/fɑks/` | zorro | A fox crossed the road. | Un zorro cruzó el camino. |
| `voc_a1_deer_001` | **deer** | *noun* | `/dɪr/` | ciervo | We saw a deer near the lake. | Vimos un ciervo cerca del lago. |
| `voc_a1_snake_001` | **snake** | *noun* | `/sneɪk/` | serpiente | Be careful, there is a snake there. | Ten cuidado, hay una serpiente ahí. |
| `voc_a1_frog_001` | **frog** | *noun* | `/frɑg/` | rana | The frog jumped into the pond. | La rana saltó al estanque. |
| `voc_a1_turtle_001` | **turtle** | *noun* | `/ˈtɜrtəl/` | tortuga | The turtle moves very slowly. | La tortuga se mueve muy lento. |
| `voc_a1_butterfly_001` | **butterfly** | *noun* | `/ˈbʌtərˌflaɪ/` | mariposa | A butterfly landed on the flower. | Una mariposa se posó en la flor. |
| `voc_a1_bee_001` | **bee** | *noun* | `/bi/` | abeja | The bee flew from flower to flower. | La abeja voló de flor en flor. |
| `voc_a1_spider_001` | **spider** | *noun* | `/ˈspaɪdər/` | araña | There is a spider on the wall. | Hay una araña en la pared. |
| `voc_a1_ant_001` | **ant** | *noun* | `/ænt/` | hormiga | The ants are carrying food. | Las hormigas están cargando comida. |
| `voc_a1_fly_001` | **fly (insect)** | *noun* | `/flaɪ/` | mosca | A fly is on the table. | Hay una mosca en la mesa. |
| `voc_a1_mosquito_001` | **mosquito** | *noun* | `/məˈskitoʊ/` | mosquito | The mosquito bit my arm. | El mosquito me picó el brazo. |
| `voc_a1_owl_001` | **owl** | *noun* | `/aʊl/` | búho | The owl sleeps during the day. | El búho duerme durante el día. |
| `voc_a1_eagle_001` | **eagle** | *noun* | `/ˈigəl/` | águila | The eagle flew high in the sky. | El águila voló alto en el cielo. |
| `voc_a1_shark_001` | **shark** | *noun* | `/ʃɑrk/` | tiburón | We saw a shark in the ocean. | Vimos un tiburón en el océano. |
| `voc_a1_whale_001` | **whale** | *noun* | `/weɪl/` | ballena | The whale is the biggest animal in the sea. | La ballena es el animal más grande del mar. |
| `voc_a1_dolphin_001` | **dolphin** | *noun* | `/ˈdɑlfən/` | delfín | Dolphins are very intelligent animals. | Los delfines son animales muy inteligentes. |
| `voc_a1_tree_001` | **tree** | *noun* | `/tri/` | árbol | There is a big tree in the yard. | Hay un árbol grande en el patio. |
| `voc_a1_flower_001` | **flower** | *noun* | `/ˈflaʊər/` | flor | She bought fresh flowers. | Ella compró flores frescas. |
| `voc_a1_grass_001` | **grass** | *noun* | `/græs/` | pasto | The grass is very green. | El pasto está muy verde. |
| `voc_a1_leaf_001` | **leaf** | *noun* | `/lif/` | hoja | A leaf fell from the tree. | Una hoja cayó del árbol. |
| `voc_a1_plant_001` | **plant** | *noun* | `/plænt/` | planta | I water my plants every day. | Riego mis plantas todos los días. |
| `voc_a1_sky_001` | **sky** | *noun* | `/skaɪ/` | cielo | The sky is clear today. | El cielo está despejado hoy. |
| `voc_a1_star_002` | **star (sky)** | *noun* | `/stɑr/` | estrella | You can see many stars at night. | Se pueden ver muchas estrellas de noche. |
| `voc_a1_moon_001` | **moon** | *noun* | `/mun/` | luna | The moon is very bright tonight. | La luna está muy brillante esta noche. |
| `voc_a1_rock_001` | **rock** | *noun* | `/rɑk/` | roca | Be careful of the rocks on the path. | Ten cuidado con las rocas en el camino. |
| `voc_a1_stone_001` | **stone** | *noun* | `/stoʊn/` | piedra | The house is made of stone. | La casa está hecha de piedra. |
| `voc_a1_sand_001` | **sand** | *noun* | `/sænd/` | arena | The sand is very hot at noon. | La arena está muy caliente al mediodía. |
| `voc_a1_earth_001` | **earth** | *noun* | `/ɜrθ/` | tierra | The Earth is our home. | La Tierra es nuestro hogar. |
| `voc_a1_world_001` | **world** | *noun* | `/wɜrld/` | mundo | I want to travel around the world. | Quiero viajar por el mundo. |
| `voc_a1_nature_001` | **nature** | *noun* | `/ˈneɪtʃər/` | naturaleza | I love spending time in nature. | Me encanta pasar tiempo en la naturaleza. |
| `voc_a1_animal_001` | **animal** | *noun* | `/ˈænəməl/` | animal | This is my favorite animal. | Este es mi animal favorito. |
| `voc_a1_pet_001` | **pet** | *noun* | `/pɛt/` | mascota | Do you have a pet at home? | ¿Tienes una mascota en casa? |
| `voc_a1_wild_001` | **wild** | *noun* | `/waɪld/` | salvaje | These are wild animals. | Estos son animales salvajes. |
| `voc_a1_field_001` | **field** | *noun* | `/fild/` | campo | The children play in the field. | Los niños juegan en el campo. |
| `voc_a1_island_001` | **island** | *noun* | `/ˈaɪlənd/` | isla | We spent our vacation on an island. | Pasamos nuestras vacaciones en una isla. |
| `voc_a1_desert_001` | **desert** | *noun* | `/ˈdɛzərt/` | desierto | It doesn't rain much in the desert. | No llueve mucho en el desierto. |
| `voc_a1_jungle_001` | **jungle** | *noun* | `/ˈdʒʌŋgəl/` | selva | Many animals live in the jungle. | Muchos animales viven en la selva. |
| `voc_a1_valley_001` | **valley** | *noun* | `/ˈvæli/` | valle | The valley is full of flowers. | El valle está lleno de flores. |
| `voc_a1_hill_001` | **hill** | *noun* | `/hɪl/` | colina | We walked up the hill. | Subimos la colina caminando. |
| `voc_a1_wave_001` | **wave** | *noun* | `/weɪv/` | ola | The waves are very big today. | Las olas están muy grandes hoy. |
| `voc_a1_rainbow_001` | **rainbow** | *noun* | `/ˈreɪnˌboʊ/` | arcoíris | We saw a rainbow after the rain. | Vimos un arcoíris después de la lluvia. |
| `voc_a1_root_001` | **root** | *noun* | `/rut/` | raíz | The tree's roots are very deep. | Las raíces del árbol son muy profundas. |
| `voc_a1_branch_001` | **branch** | *noun* | `/bræntʃ/` | rama | A bird landed on the branch. | Un pájaro se posó en la rama. |
| `voc_a1_seed_001` | **seed** | *noun* | `/sid/` | semilla | We planted a seed in the garden. | Plantamos una semilla en el jardín. |
| `voc_a1_cage_001` | **cage** | *noun* | `/keɪdʒ/` | jaula | The bird is inside a cage. | El pájaro está dentro de una jaula. |
| `voc_a1_zoo_001` | **zoo** | *noun* | `/zu/` | zoológico | We took the kids to the zoo. | Llevamos a los niños al zoológico. |
| `voc_a1_aquarium_001` | **aquarium** | *noun* | `/əˈkwɛriəm/` | acuario | We saw many fish at the aquarium. | Vimos muchos peces en el acuario. |
| `voc_a1_herd_001` | **herd** | *noun* | `/hɜrd/` | manada | A herd of cows crossed the road. | Una manada de vacas cruzó el camino. |
| `voc_a1_flock_001` | **flock** | *noun* | `/flɑk/` | bandada | A flock of birds flew south. | Una bandada de pájaros voló hacia el sur. |
| `voc_a1_nest_001` | **nest** | *noun* | `/nɛst/` | nido | The bird built a nest in the tree. | El pájaro hizo un nido en el árbol. |
| `voc_a1_den_001` | **den** | *noun* | `/dɛn/` | madriguera | The fox has its den in the forest. | El zorro tiene su madriguera en el bosque. |
| `voc_a1_feather_001` | **feather** | *noun* | `/ˈfɛðər/` | pluma | I found a feather on the ground. | Encontré una pluma en el suelo. |
| `voc_a1_fur_001` | **fur** | *noun* | `/fɜr/` | pelaje | The cat has soft fur. | El gato tiene el pelaje suave. |
| `voc_a1_tail_001` | **tail** | *noun* | `/teɪl/` | cola | The dog wags its tail when happy. | El perro mueve la cola cuando está feliz. |
| `voc_a1_paw_001` | **paw** | *noun* | `/pɔ/` | pata | The dog hurt its paw. | El perro se lastimó la pata. |
| `voc_a1_wing_001` | **wing** | *noun* | `/wɪŋ/` | ala | The bird spread its wings. | El pájaro extendió sus alas. |
| `voc_a1_claw_001` | **claw** | *noun* | `/klɔ/` | garra | The cat has sharp claws. | El gato tiene garras afiladas. |
| `voc_a1_hoof_001` | **hoof** | *noun* | `/hʊf/` | pezuña | The horse has strong hooves. | El caballo tiene pezuñas fuertes. |
| `voc_a1_predator_001` | **predator** | *noun* | `/ˈprɛdətər/` | depredador | The lion is a dangerous predator. | El león es un depredador peligroso. |
| `voc_a1_prey_001` | **prey** | *noun* | `/preɪ/` | presa | The rabbit is prey for the fox. | El conejo es presa del zorro. |
| `voc_a1_species_001` | **species** | *noun* | `/ˈspiʃiz/` | especie | This is a rare species of bird. | Esta es una especie rara de pájaro. |
| `voc_a1_wildlife_001` | **wildlife** | *noun* | `/ˈwaɪldˌlaɪf/` | fauna silvestre | The park protects the local wildlife. | El parque protege la fauna silvestre local. |

### Semana 11: Semana 11 – Profesiones y escuela
Total de palabras en esta semana: **66**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_teacher_001` | **teacher** | *noun* | `/ˈtitʃər/` | maestro/a | My teacher is very patient. | Mi maestra es muy paciente. |
| `voc_a1_student_001` | **student** | *noun* | `/ˈstudənt/` | estudiante | I am a student at this school. | Soy estudiante en esta escuela. |
| `voc_a1_doctor_001` | **doctor** | *noun* | `/ˈdɑktər/` | médico | The doctor checked my throat. | El médico revisó mi garganta. |
| `voc_a1_nurse_001` | **nurse** | *noun* | `/nɜrs/` | enfermero/a | The nurse gave me my medicine. | La enfermera me dio mi medicina. |
| `voc_a1_dentist_001` | **dentist** | *noun* | `/ˈdɛntɪst/` | dentista | I have an appointment with the dentist. | Tengo una cita con el dentista. |
| `voc_a1_engineer_001` | **engineer** | *noun* | `/ˌɛndʒəˈnɪr/` | ingeniero | My brother is an engineer. | Mi hermano es ingeniero. |
| `voc_a1_lawyer_001` | **lawyer** | *noun* | `/ˈlɔjər/` | abogado | She works as a lawyer. | Ella trabaja como abogada. |
| `voc_a1_police-officer_001` | **police officer** | *noun* | `/pəˈlis ˈɔfɪsər/` | policía | The police officer helped us find the way. | El policía nos ayudó a encontrar el camino. |
| `voc_a1_firefighter_001` | **firefighter** | *noun* | `/ˈfaɪrˌfaɪtər/` | bombero | The firefighter saved the family. | El bombero salvó a la familia. |
| `voc_a1_farmer_001` | **farmer** | *noun* | `/ˈfɑrmər/` | granjero | The farmer works from early morning. | El granjero trabaja desde temprano. |
| `voc_a1_driver_001` | **driver** | *noun* | `/ˈdraɪvər/` | conductor | The bus driver is very careful. | El conductor del autobús es muy cuidadoso. |
| `voc_a1_pilot_001` | **pilot** | *noun* | `/ˈpaɪlət/` | piloto | My uncle is an airplane pilot. | Mi tío es piloto de avión. |
| `voc_a1_cashier_001` | **cashier** | *noun* | `/kæˈʃɪr/` | cajero | The cashier gave me my change. | La cajera me dio mi cambio. |
| `voc_a1_manager_001` | **manager** | *noun* | `/ˈmænɪdʒər/` | gerente | The manager approved my vacation. | El gerente aprobó mis vacaciones. |
| `voc_a1_boss_001` | **boss** | *noun* | `/bɔs/` | jefe | My boss is very kind. | Mi jefe es muy amable. |
| `voc_a1_employee_001` | **employee** | *noun* | `/ɪmˈplɔɪi/` | empleado | She is a new employee. | Ella es una empleada nueva. |
| `voc_a1_worker_001` | **worker** | *noun* | `/ˈwɜrkər/` | trabajador | The workers finished the project. | Los trabajadores terminaron el proyecto. |
| `voc_a1_businessman-businesswoman_001` | **businessman / businesswoman** | *noun* | `/ˈbɪznɪsˌmæn/` | empresario/a | He is a successful businessman. | Él es un empresario exitoso. |
| `voc_a1_artist_001` | **artist** | *noun* | `/ˈɑrtɪst/` | artista | She is a talented artist. | Ella es una artista talentosa. |
| `voc_a1_musician_001` | **musician** | *noun* | `/mjuˈzɪʃən/` | músico | He is a musician in a band. | Él es músico en una banda. |
| `voc_a1_actor-actress_001` | **actor / actress** | *noun* | `/ˈæktər/` | actor / actriz | He is a famous actor. | Él es un actor famoso. |
| `voc_a1_writer_001` | **writer** | *noun* | `/ˈraɪtər/` | escritor | She is a writer of children's books. | Ella es escritora de libros infantiles. |
| `voc_a1_journalist_001` | **journalist** | *noun* | `/ˈdʒɜrnəlɪst/` | periodista | The journalist wrote an interesting article. | El periodista escribió un artículo interesante. |
| `voc_a1_scientist_001` | **scientist** | *noun* | `/ˈsaɪəntɪst/` | científico | The scientist works in a laboratory. | El científico trabaja en un laboratorio. |
| `voc_a1_athlete_001` | **athlete** | *noun* | `/ˈæθˌlit/` | atleta | She is a professional athlete. | Ella es una atleta profesional. |
| `voc_a1_soldier_001` | **soldier** | *noun* | `/ˈsoʊldʒər/` | soldado | The soldier serves his country. | El soldado sirve a su país. |
| `voc_a1_secretary_001` | **secretary** | *noun* | `/ˈsɛkrəˌtɛri/` | secretario/a | The secretary answered the phone. | La secretaria contestó el teléfono. |
| `voc_a1_receptionist_001` | **receptionist** | *noun* | `/rɪˈsɛpʃənɪst/` | recepcionista | The receptionist welcomed us kindly. | La recepcionista nos recibió amablemente. |
| `voc_a1_mechanic_001` | **mechanic** | *noun* | `/mɪˈkænɪk/` | mecánico | The mechanic fixed my car. | El mecánico arregló mi carro. |
| `voc_a1_electrician_001` | **electrician** | *noun* | `/ɪlɛkˈtrɪʃən/` | electricista | We called an electrician for the lights. | Llamamos a un electricista por las luces. |
| `voc_a1_plumber_001` | **plumber** | *noun* | `/ˈplʌmər/` | plomero | The plumber fixed the leak. | El plomero arregló la fuga. |
| `voc_a1_hairdresser_001` | **hairdresser** | *noun* | `/ˈhɛrˌdrɛsər/` | peluquero | My hairdresser cut my hair short. | Mi peluquero me cortó el cabello corto. |
| `voc_a1_tailor_001` | **tailor** | *noun* | `/ˈteɪlər/` | sastre | The tailor made my suit. | El sastre hizo mi traje. |
| `voc_a1_baker_001` | **baker** | *noun* | `/ˈbeɪkər/` | panadero | The baker makes fresh bread every day. | El panadero hace pan fresco todos los días. |
| `voc_a1_butcher_001` | **butcher** | *noun* | `/ˈbʊtʃər/` | carnicero | We buy meat from the butcher. | Compramos carne en la carnicería (del carnicero). |
| `voc_a1_job_001` | **job** | *noun* | `/dʒɑb/` | trabajo/empleo | I like my new job. | Me gusta mi nuevo trabajo. |
| `voc_a1_career_001` | **career** | *noun* | `/kəˈrɪr/` | carrera | She is happy with her career. | Ella está feliz con su carrera. |
| `voc_a1_company_001` | **company** | *noun* | `/ˈkʌmpəni/` | empresa | He works for a big company. | Él trabaja para una gran empresa. |
| `voc_a1_office_001` | **office** | *noun* | `/ˈɔfɪs/` | oficina | I go to the office every day. | Voy a la oficina todos los días. |
| `voc_a1_salary_001` | **salary** | *noun* | `/ˈsæləri/` | salario | Her salary increased this year. | Su salario aumentó este año. |
| `voc_a1_classroom_001` | **classroom** | *noun* | `/ˈklæsˌrum/` | salón de clases | The classroom is very bright. | El salón de clases es muy luminoso. |
| `voc_a1_class_001` | **class** | *noun* | `/klæs/` | clase | Our class starts at nine. | Nuestra clase empieza a las nueve. |
| `voc_a1_lesson_001` | **lesson** | *noun* | `/ˈlɛsən/` | lección | Today's lesson is about verbs. | La lección de hoy es sobre los verbos. |
| `voc_a1_subject_001` | **subject** | *noun* | `/ˈsʌbdʒɪkt/` | materia | Math is my favorite subject. | Matemáticas es mi materia favorita. |
| `voc_a1_math_001` | **math** | *noun* | `/mæθ/` | matemáticas | I have math class on Monday. | Tengo clase de matemáticas el lunes. |
| `voc_a1_science_001` | **science** | *noun* | `/ˈsaɪəns/` | ciencia | We do experiments in science class. | Hacemos experimentos en la clase de ciencias. |
| `voc_a1_history_001` | **history** | *noun* | `/ˈhɪstəri/` | historia | I love learning about history. | Me encanta aprender sobre historia. |
| `voc_a1_geography_001` | **geography** | *noun* | `/dʒiˈɑgrəfi/` | geografía | We study maps in geography class. | Estudiamos mapas en la clase de geografía. |
| `voc_a1_art_001` | **art** | *noun* | `/ɑrt/` | arte | She draws well in art class. | Ella dibuja bien en la clase de arte. |
| `voc_a1_music_001` | **music** | *noun* | `/ˈmjuzɪk/` | música | I play the guitar in music class. | Toco la guitarra en la clase de música. |
| `voc_a1_physical-education_001` | **physical education** | *noun* | `/ˈfɪzɪkəl ˌɛdʒəˈkeɪʃən/` | educación física | We play soccer in physical education. | Jugamos fútbol en educación física. |
| `voc_a1_book_001` | **book** | *noun* | `/bʊk/` | libro | I am reading a good book. | Estoy leyendo un buen libro. |
| `voc_a1_notebook_001` | **notebook** | *noun* | `/ˈnoʊtˌbʊk/` | cuaderno | I write notes in my notebook. | Escribo apuntes en mi cuaderno. |
| `voc_a1_pen_001` | **pen** | *noun* | `/pɛn/` | bolígrafo | Can I borrow your pen? | ¿Me prestas tu bolígrafo? |
| `voc_a1_pencil_001` | **pencil** | *noun* | `/ˈpɛnsəl/` | lápiz | I need a pencil to draw. | Necesito un lápiz para dibujar. |
| `voc_a1_eraser_001` | **eraser** | *noun* | `/ɪˈreɪsər/` | borrador | Can I use your eraser? | ¿Puedo usar tu borrador? |
| `voc_a1_ruler_001` | **ruler** | *noun* | `/ˈrulər/` | regla | Use a ruler to draw a straight line. | Usa una regla para dibujar una línea recta. |
| `voc_a1_backpack_001` | **backpack** | *noun* | `/ˈbækˌpæk/` | mochila | My backpack is very heavy. | Mi mochila pesa mucho. |
| `voc_a1_homework_001` | **homework** | *noun* | `/ˈhoʊmˌwɜrk/` | tarea | I finished my homework early. | Terminé mi tarea temprano. |
| `voc_a1_exam-test_001` | **exam / test** | *noun* | `/ɪgˈzæm/` | examen | We have an exam tomorrow. | Tenemos un examen mañana. |
| `voc_a1_grade_001` | **grade (school)** | *noun* | `/greɪd/` | calificación | She got a good grade on the test. | Ella sacó una buena calificación en el examen. |
| `voc_a1_question_001` | **question** | *noun* | `/ˈkwɛstʃən/` | pregunta | I have a question about the homework. | Tengo una pregunta sobre la tarea. |
| `voc_a1_blackboard-whiteboard_001` | **blackboard / whiteboard** | *noun* | `/ˈblækˌbɔrd/` | pizarra | The teacher wrote on the blackboard. | El maestro escribió en la pizarra. |
| `voc_a1_desk_002` | **desk (school)** | *noun* | `/dɛsk/` | pupitre | Sit at your desk, please. | Siéntate en tu pupitre, por favor. |
| `voc_a1_principal_001` | **principal** | *noun* | `/ˈprɪnsəpəl/` | director/a | The principal talked to the students. | El director habló con los estudiantes. |
| `voc_a1_university_001` | **university** | *noun* | `/ˌjunəˈvɜrsəti/` | universidad | She studies at a good university. | Ella estudia en una buena universidad. |

### Semana 12: Semana 12 – Transporte y viajes
Total de palabras en esta semana: **75**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_car_001` | **car** | *noun* | `/kɑr/` | carro | We travel by car on weekends. | Viajamos en carro los fines de semana. |
| `voc_a1_bus_001` | **bus** | *noun* | `/bʌs/` | autobús | I take the bus to work. | Tomo el autobús para ir al trabajo. |
| `voc_a1_train_001` | **train** | *noun* | `/treɪn/` | tren | The train arrives at nine. | El tren llega a las nueve. |
| `voc_a1_plane-airplane_001` | **plane / airplane** | *noun* | `/pleɪn/` | avión | We took a plane to Mexico. | Tomamos un avión a México. |
| `voc_a1_bike-bicycle_001` | **bike / bicycle** | *noun* | `/baɪk/` | bicicleta | I ride my bike every morning. | Monto mi bicicleta todas las mañanas. |
| `voc_a1_motorcycle_001` | **motorcycle** | *noun* | `/ˈmoʊtərˌsaɪkəl/` | motocicleta | He drives a motorcycle to work. | Él conduce una motocicleta al trabajo. |
| `voc_a1_taxi_001` | **taxi** | *noun* | `/ˈtæksi/` | taxi | We took a taxi to the airport. | Tomamos un taxi al aeropuerto. |
| `voc_a1_truck_001` | **truck** | *noun* | `/trʌk/` | camión | The truck delivers food to stores. | El camión entrega comida a las tiendas. |
| `voc_a1_boat_001` | **boat** | *noun* | `/boʊt/` | bote | We rode a small boat on the lake. | Paseamos en un bote pequeño en el lago. |
| `voc_a1_ship_001` | **ship** | *noun* | `/ʃɪp/` | barco | The ship left the port at noon. | El barco salió del puerto al mediodía. |
| `voc_a1_subway-metro_001` | **subway / metro** | *noun* | `/ˈsʌbˌweɪ/` | metro | I take the subway every day. | Tomo el metro todos los días. |
| `voc_a1_trip_001` | **trip** | *noun* | `/trɪp/` | viaje | We had a great trip to the coast. | Tuvimos un gran viaje a la costa. |
| `voc_a1_journey_001` | **journey** | *noun* | `/ˈdʒɜrni/` | travesía | The journey took ten hours. | La travesía duró diez horas. |
| `voc_a1_tourist_001` | **tourist** | *noun* | `/ˈtʊrɪst/` | turista | Many tourists visit this city. | Muchos turistas visitan esta ciudad. |
| `voc_a1_passport_001` | **passport** | *noun* | `/ˈpæˌspɔrt/` | pasaporte | Don't forget your passport. | No olvides tu pasaporte. |
| `voc_a1_ticket_001` | **ticket** | *noun* | `/ˈtɪkɪt/` | boleto | I bought two tickets for the concert. | Compré dos boletos para el concierto. |
| `voc_a1_luggage_001` | **luggage** | *noun* | `/ˈlʌgɪdʒ/` | equipaje | Please check your luggage. | Por favor revisa tu equipaje. |
| `voc_a1_suitcase_001` | **suitcase** | *noun* | `/ˈsutˌkeɪs/` | maleta | She packed her suitcase quickly. | Ella empacó su maleta rápidamente. |
| `voc_a1_reservation_001` | **reservation** | *noun* | `/ˌrɛzərˈveɪʃən/` | reservación | I made a reservation for two. | Hice una reservación para dos personas. |
| `voc_a1_flight_001` | **flight** | *noun* | `/flaɪt/` | vuelo | Our flight leaves at six. | Nuestro vuelo sale a las seis. |
| `voc_a1_gate_001` | **gate (airport)** | *noun* | `/geɪt/` | puerta de embarque | The gate closes in ten minutes. | La puerta de embarque cierra en diez minutos. |
| `voc_a1_arrival_001` | **arrival** | *noun* | `/əˈraɪvəl/` | llegada | The arrival time is eight thirty. | La hora de llegada es las ocho y media. |
| `voc_a1_departure_001` | **departure** | *noun* | `/dɪˈpɑrtʃər/` | salida | Check the departure board. | Revisa el tablero de salidas. |
| `voc_a1_destination_001` | **destination** | *noun* | `/ˌdɛstɪˈneɪʃən/` | destino | Our final destination is Rome. | Nuestro destino final es Roma. |
| `voc_a1_souvenir_001` | **souvenir** | *noun* | `/ˌsuvəˈnɪr/` | recuerdo | I bought a souvenir for my mom. | Compré un recuerdo para mi mamá. |
| `voc_a1_fly_002` | **fly (verb)** | *verb* | `/flaɪ/` | volar | We fly to Chicago tomorrow. | Volamos a Chicago mañana. |
| `voc_a1_park_002` | **park (verb)** | *verb* | `/pɑrk/` | estacionar | You can park here. | Puedes estacionar aquí. |
| `voc_a1_depart_001` | **depart** | *verb* | `/dɪˈpɑrt/` | partir | The bus will depart soon. | El autobús partirá pronto. |
| `voc_a1_book_002` | **book (verb)** | *verb* | `/bʊk/` | reservar | I booked a hotel online. | Reservé un hotel en línea. |
| `voc_a1_pack_001` | **pack** | *verb* | `/pæk/` | empacar | I need to pack my bag tonight. | Necesito empacar mi bolsa esta noche. |
| `voc_a1_traffic_001` | **traffic** | *noun* | `/ˈtræfɪk/` | tráfico | There is a lot of traffic today. | Hay mucho tráfico hoy. |
| `voc_a1_highway_001` | **highway** | *noun* | `/ˈhaɪˌweɪ/` | autopista | We took the highway to the city. | Tomamos la autopista hacia la ciudad. |
| `voc_a1_crossing_001` | **crossing** | *noun* | `/ˈkrɔsɪŋ/` | cruce | Be careful at the crossing. | Ten cuidado en el cruce. |
| `voc_a1_seatbelt_001` | **seatbelt** | *noun* | `/ˈsitˌbɛlt/` | cinturón de seguridad | Please wear your seatbelt. | Por favor usa el cinturón de seguridad. |
| `voc_a1_gas-station_001` | **gas station** | *noun* | `/gæs ˈsteɪʃən/` | gasolinera | We stopped at a gas station. | Paramos en una gasolinera. |
| `voc_a1_ticket-office_001` | **ticket office** | *noun* | `/ˈtɪkɪt ˈɔfəs/` | taquilla | Buy your ticket at the ticket office. | Compra tu boleto en la taquilla. |
| `voc_a1_platform_001` | **platform** | *noun* | `/ˈplætˌfɔrm/` | andén | The train is on platform two. | El tren está en el andén dos. |
| `voc_a1_terminal_001` | **terminal** | *noun* | `/ˈtɜrmənəl/` | terminal | The flight leaves from terminal one. | El vuelo sale de la terminal uno. |
| `voc_a1_captain_001` | **captain** | *noun* | `/ˈkæptən/` | capitán | The captain welcomed the passengers. | El capitán dio la bienvenida a los pasajeros. |
| `voc_a1_passenger_001` | **passenger** | *noun* | `/ˈpæsəndʒər/` | pasajero | The bus has twenty passengers. | El autobús tiene veinte pasajeros. |
| `voc_a1_drivers-license_001` | **driver's license** | *noun* | `/ˈdraɪvərz ˈlaɪsəns/` | licencia de conducir | I got my driver's license last year. | Obtuve mi licencia de conducir el año pasado. |
| `voc_a1_fare_001` | **fare** | *noun* | `/fɛr/` | tarifa | The bus fare is two dollars. | La tarifa del autobús es dos dólares. |
| `voc_a1_route_001` | **route** | *noun* | `/rut/` | ruta | This route is faster. | Esta ruta es más rápida. |
| `voc_a1_schedule_001` | **schedule** | *noun* | `/ˈskɛdʒʊl/` | horario | Check the train schedule. | Revisa el horario del tren. |
| `voc_a1_delay_001` | **delay** | *noun* | `/dɪˈleɪ/` | retraso | Our flight has a delay. | Nuestro vuelo tiene un retraso. |
| `voc_a1_connection_001` | **connection (travel)** | *noun* | `/kəˈnɛkʃən/` | conexión | We have a connection in Miami. | Tenemos una conexión en Miami. |
| `voc_a1_customs_001` | **customs** | *noun* | `/ˈkʌstəmz/` | aduana | We waited at customs for an hour. | Esperamos en la aduana una hora. |
| `voc_a1_border_001` | **border** | *noun* | `/ˈbɔrdər/` | frontera | We crossed the border by car. | Cruzamos la frontera en carro. |
| `voc_a1_visa_001` | **visa** | *noun* | `/ˈvizə/` | visa | I need a visa to travel there. | Necesito una visa para viajar allá. |
| `voc_a1_guide_001` | **guide (tourist)** | *noun* | `/gaɪd/` | guía | Our guide showed us the city. | Nuestro guía nos mostró la ciudad. |
| `voc_a1_seat_001` | **seat** | *noun* | `/sit/` | asiento | This is my seat. | Este es mi asiento. |
| `voc_a1_aisle_001` | **aisle** | *noun* | `/aɪl/` | pasillo | I prefer an aisle seat. | Prefiero un asiento de pasillo. |
| `voc_a1_cabin_001` | **cabin** | *noun* | `/ˈkæbɪn/` | cabina | The cabin has small windows. | La cabina tiene ventanas pequeñas. |
| `voc_a1_crew_001` | **crew** | *noun* | `/kru/` | tripulación | The crew was very friendly. | La tripulación fue muy amable. |
| `voc_a1_roundtrip_001` | **roundtrip** | *noun* | `/ˌraʊndˈtrɪp/` | viaje redondo | I bought a roundtrip ticket. | Compré un boleto de viaje redondo. |
| `voc_a1_one-way_001` | **one-way** | *noun* | `/ˈwʌnˈweɪ/` | de ida | I need a one-way ticket. | Necesito un boleto de ida. |
| `voc_a1_boarding-pass_001` | **boarding pass** | *noun* | `/ˈbɔrdɪŋ pæs/` | tarjeta de embarque | Please show your boarding pass. | Por favor muestre su tarjeta de embarque. |
| `voc_a1_security-check_001` | **security check** | *noun* | `/sɪˈkjʊrəti tʃɛk/` | control de seguridad | We passed the security check quickly. | Pasamos el control de seguridad rápido. |
| `voc_a1_immigration_001` | **immigration** | *noun* | `/ˌɪməˈgreɪʃən/` | inmigración | The line at immigration was long. | La fila en inmigración fue larga. |
| `voc_a1_currency_001` | **currency** | *noun* | `/ˈkɜrənsi/` | moneda (divisa) | I need to exchange my currency. | Necesito cambiar mi moneda. |
| `voc_a1_exchange-rate_001` | **exchange rate** | *noun* | `/ɪksˈtʃeɪndʒ reɪt/` | tipo de cambio | The exchange rate changed today. | El tipo de cambio cambió hoy. |
| `voc_a1_cruise_001` | **cruise** | *noun* | `/kruz/` | crucero | They went on a cruise last summer. | Ellos hicieron un crucero el verano pasado. |
| `voc_a1_ferry_001` | **ferry** | *noun* | `/ˈfɛri/` | transbordador | We took the ferry to the island. | Tomamos el transbordador a la isla. |
| `voc_a1_cable-car_001` | **cable car** | *noun* | `/ˈkeɪbəl kɑr/` | teleférico | We rode the cable car up the mountain. | Subimos la montaña en teleférico. |
| `voc_a1_elevator_001` | **elevator** | *noun* | `/ˈɛləˌveɪtər/` | ascensor | Take the elevator to the third floor. | Toma el ascensor al tercer piso. |
| `voc_a1_escalator_001` | **escalator** | *noun* | `/ˈɛskəˌleɪtər/` | escalera mecánica | The escalator is next to the stairs. | La escalera mecánica está junto a las escaleras. |
| `voc_a1_carpool_001` | **carpool** | *verb* | `/ˈkɑrˌpul/` | compartir auto | We carpool to work every day. | Compartimos auto para ir al trabajo todos los días. |
| `voc_a1_rush-hour_001` | **rush hour** | *noun* | `/rʌʃ ˈaʊər/` | hora pico | Traffic is bad during rush hour. | El tráfico es malo en hora pico. |
| `voc_a1_parking-lot_001` | **parking lot** | *noun* | `/ˈpɑrkɪŋ lɑt/` | estacionamiento | My car is in the parking lot. | Mi carro está en el estacionamiento. |
| `voc_a1_mileage_001` | **mileage** | *noun* | `/ˈmaɪlɪdʒ/` | kilometraje | This car has low mileage. | Este carro tiene bajo kilometraje. |
| `voc_a1_license-plate_001` | **license plate** | *noun* | `/ˈlaɪsəns pleɪt/` | placa de matrícula | I forgot my license plate number. | Olvidé el número de mi placa. |
| `voc_a1_wheel_001` | **wheel** | *noun* | `/wil/` | rueda | The front wheel is broken. | La rueda delantera está rota. |
| `voc_a1_tire_001` | **tire** | *noun* | `/taɪər/` | llanta | We need to change the tire. | Necesitamos cambiar la llanta. |
| `voc_a1_brake_001` | **brake** | *noun* | `/breɪk/` | freno | Press the brake slowly. | Presiona el freno despacio. |
| `voc_a1_horn_001` | **horn (car)** | *noun* | `/hɔrn/` | bocina | Don't use the horn at night. | No uses la bocina de noche. |

### Semana 13: Semana 13 – Emociones y adjetivos adicionales
Total de palabras en esta semana: **59**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_afraid_001` | **afraid** | *adjective* | `/əˈfreɪd/` | asustado | I am afraid of the dark. | Tengo miedo a la oscuridad. |
| `voc_a1_scared_001` | **scared** | *adjective* | `/skɛrd/` | asustado | She was scared during the storm. | Ella estaba asustada durante la tormenta. |
| `voc_a1_worried_001` | **worried** | *adjective* | `/ˈwɜrid/` | preocupado | I am worried about the exam. | Estoy preocupado por el examen. |
| `voc_a1_nervous_001` | **nervous** | *adjective* | `/ˈnɜrvəs/` | nervioso | He feels nervous before interviews. | Él se siente nervioso antes de las entrevistas. |
| `voc_a1_excited_001` | **excited** | *adjective* | `/ɪkˈsaɪtɪd/` | emocionado | We are excited about the trip. | Estamos emocionados por el viaje. |
| `voc_a1_surprised_001` | **surprised** | *adjective* | `/sərˈpraɪzd/` | sorprendido | I was surprised by the news. | Me sorprendió la noticia. |
| `voc_a1_bored_001` | **bored** | *adjective* | `/bɔrd/` | aburrido | The children are bored at home. | Los niños están aburridos en casa. |
| `voc_a1_embarrassed_001` | **embarrassed** | *adjective* | `/ɪmˈbɛrəst/` | avergonzado | I felt embarrassed after the mistake. | Me sentí avergonzado después del error. |
| `voc_a1_confused_001` | **confused** | *adjective* | `/kənˈfjuzd/` | confundido | I am confused about the instructions. | Estoy confundido con las instrucciones. |
| `voc_a1_proud_001` | **proud** | *adjective* | `/praʊd/` | orgulloso | Her parents are very proud of her. | Sus padres están muy orgullosos de ella. |
| `voc_a1_jealous_001` | **jealous** | *adjective* | `/ˈdʒɛləs/` | celoso | Don't be jealous of your sister. | No estés celoso de tu hermana. |
| `voc_a1_lonely_001` | **lonely** | *adjective* | `/ˈloʊnli/` | solitario | He feels lonely since he moved. | Él se siente solitario desde que se mudó. |
| `voc_a1_calm_001` | **calm** | *adjective* | `/kɑm/` | tranquilo | Stay calm, everything is fine. | Mantén la calma, todo está bien. |
| `voc_a1_relaxed_001` | **relaxed** | *adjective* | `/rɪˈlækst/` | relajado | I feel relaxed after vacation. | Me siento relajado después de las vacaciones. |
| `voc_a1_stressed_001` | **stressed** | *adjective* | `/strɛst/` | estresado | She is stressed about work. | Ella está estresada por el trabajo. |
| `voc_a1_sick-ill_001` | **sick / ill** | *adjective* | `/sɪk/` | enfermo | My son is sick today. | Mi hijo está enfermo hoy. |
| `voc_a1_healthy_001` | **healthy** | *adjective* | `/ˈhɛlθi/` | saludable | We try to eat healthy food. | Tratamos de comer comida saludable. |
| `voc_a1_comfortable_001` | **comfortable** | *adjective* | `/ˈkʌmfərtəbəl/` | cómodo | This chair is very comfortable. | Esta silla es muy cómoda. |
| `voc_a1_uncomfortable_001` | **uncomfortable** | *adjective* | `/ʌnˈkʌmfərtəbəl/` | incómodo | These shoes are uncomfortable. | Estos zapatos son incómodos. |
| `voc_a1_confident_001` | **confident** | *adjective* | `/ˈkɑnfədənt/` | seguro de sí mismo | She is confident in her work. | Ella tiene confianza en su trabajo. |
| `voc_a1_curious_001` | **curious** | *adjective* | `/ˈkjʊriəs/` | curioso | My son is very curious about animals. | Mi hijo es muy curioso sobre los animales. |
| `voc_a1_patient_001` | **patient** | *adjective* | `/ˈpeɪʃənt/` | paciente | Please be patient with him. | Por favor ten paciencia con él. |
| `voc_a1_impatient_001` | **impatient** | *adjective* | `/ɪmˈpeɪʃənt/` | impaciente | The children were impatient in line. | Los niños estaban impacientes en la fila. |
| `voc_a1_important_001` | **important** | *adjective* | `/ɪmˈpɔrtənt/` | importante | This meeting is very important. | Esta reunión es muy importante. |
| `voc_a1_necessary_001` | **necessary** | *adjective* | `/ˈnɛsəˌsɛri/` | necesario | Water is necessary for life. | El agua es necesaria para la vida. |
| `voc_a1_possible_001` | **possible** | *adjective* | `/ˈpɑsəbəl/` | posible | It is possible to finish today. | Es posible terminar hoy. |
| `voc_a1_impossible_001` | **impossible** | *adjective* | `/ɪmˈpɑsəbəl/` | imposible | It is impossible to be there by six. | Es imposible llegar ahí para las seis. |
| `voc_a1_true_001` | **true** | *adjective* | `/tru/` | verdadero | Is this story true? | ¿Es verdadera esta historia? |
| `voc_a1_false_001` | **false** | *adjective* | `/fɔls/` | falso | That statement is false. | Esa afirmación es falsa. |
| `voc_a1_real_001` | **real** | *adjective* | `/ril/` | real | This is a real diamond. | Este es un diamante real. |
| `voc_a1_fake_001` | **fake** | *adjective* | `/feɪk/` | falso/imitación | That watch is fake. | Ese reloj es falso. |
| `voc_a1_correct_001` | **correct** | *adjective* | `/kəˈrɛkt/` | correcto | Your answer is correct. | Tu respuesta es correcta. |
| `voc_a1_incorrect_001` | **incorrect** | *adjective* | `/ˌɪnkəˈrɛkt/` | incorrecto | This answer is incorrect. | Esta respuesta es incorrecta. |
| `voc_a1_popular_001` | **popular** | *adjective* | `/ˈpɑpjələr/` | popular | This song is very popular. | Esta canción es muy popular. |
| `voc_a1_famous_001` | **famous** | *adjective* | `/ˈfeɪməs/` | famoso | She is a famous singer. | Ella es una cantante famosa. |
| `voc_a1_normal_001` | **normal** | *adjective* | `/ˈnɔrməl/` | normal | It is normal to feel nervous. | Es normal sentirse nervioso. |
| `voc_a1_strange_001` | **strange** | *adjective* | `/streɪndʒ/` | extraño | That was a strange sound. | Ese fue un sonido extraño. |
| `voc_a1_weird_001` | **weird** | *adjective* | `/wɪrd/` | raro | This tastes a little weird. | Esto sabe un poco raro. |
| `voc_a1_special_001` | **special** | *adjective* | `/ˈspɛʃəl/` | especial | Today is a special day. | Hoy es un día especial. |
| `voc_a1_common_001` | **common** | *adjective* | `/ˈkɑmən/` | común | This is a common mistake. | Este es un error común. |
| `voc_a1_rare_001` | **rare** | *adjective* | `/rɛr/` | raro/poco común | This bird is very rare. | Este pájaro es muy raro (poco común). |
| `voc_a1_modern_001` | **modern** | *adjective* | `/ˈmɑdərn/` | moderno | They live in a modern building. | Ellos viven en un edificio moderno. |
| `voc_a1_traditional_001` | **traditional** | *adjective* | `/trəˈdɪʃəl/` | tradicional | We had a traditional dinner. | Tuvimos una cena tradicional. |
| `voc_a1_similar_001` | **similar** | *adjective* | `/ˈsɪmələr/` | similar | Our jackets are similar. | Nuestras chaquetas son similares. |
| `voc_a1_simple_001` | **simple** | *adjective* | `/ˈsɪmpəl/` | simple | The recipe is very simple. | La receta es muy simple. |
| `voc_a1_complicated_001` | **complicated** | *adjective* | `/ˈkɑmpləˌkeɪtɪd/` | complicado | This problem is complicated. | Este problema es complicado. |
| `voc_a1_careful_001` | **careful** | *adjective* | `/ˈkɛrfəl/` | cuidadoso | Be careful on the stairs. | Ten cuidado en las escaleras. |
| `voc_a1_careless_001` | **careless** | *adjective* | `/ˈkɛrləs/` | descuidado | He was careless with the glass. | Él fue descuidado con el vaso. |
| `voc_a1_honest_001` | **honest** | *adjective* | `/ˈɑnəst/` | honesto | She is always honest with me. | Ella siempre es honesta conmigo. |
| `voc_a1_polite_001` | **polite** | *adjective* | `/pəˈlaɪt/` | cortés | The waiter was very polite. | El mesero fue muy cortés. |
| `voc_a1_rude_001` | **rude** | *adjective* | `/rud/` | grosero | It is rude to interrupt. | Es de mala educación interrumpir. |
| `voc_a1_generous_001` | **generous** | *adjective* | `/ˈdʒɛnərəs/` | generoso | My uncle is very generous. | Mi tío es muy generoso. |
| `voc_a1_selfish_001` | **selfish** | *adjective* | `/ˈsɛlfɪʃ/` | egoísta | Don't be selfish with your toys. | No seas egoísta con tus juguetes. |
| `voc_a1_hopeful_001` | **hopeful** | *adjective* | `/ˈhoʊpfəl/` | esperanzado | We are hopeful about the future. | Somos optimistas sobre el futuro. |
| `voc_a1_disappointed_001` | **disappointed** | *adjective* | `/ˌdɪsəˈpɔɪntɪd/` | decepcionado | I was disappointed with the movie. | Me decepcionó la película. |
| `voc_a1_grateful_001` | **grateful** | *adjective* | `/ˈgreɪtfəl/` | agradecido | I am grateful for your help. | Estoy agradecido por tu ayuda. |
| `voc_a1_annoyed_001` | **annoyed** | *adjective* | `/əˈnɔɪd/` | molesto | She was annoyed by the noise. | Ella estaba molesta por el ruido. |
| `voc_a1_relieved_001` | **relieved** | *adjective* | `/rɪˈlivd/` | aliviado | I was relieved to hear the news. | Me sentí aliviado al escuchar la noticia. |
| `voc_a1_amazed_001` | **amazed** | *adjective* | `/əˈmeɪzd/` | asombrado | We were amazed by the view. | Nos asombró la vista. |

### Semana 14: Semana 14 – Preposiciones, palabras de pregunta y conectores
Total de palabras en esta semana: **53**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_in_001` | **in** | *preposition* | `/ɪn/` | en | The keys are in the drawer. | Las llaves están en el cajón. |
| `voc_a1_on_001` | **on** | *preposition* | `/ɔn/` | sobre/en | The book is on the table. | El libro está sobre la mesa. |
| `voc_a1_at_001` | **at** | *preposition* | `/æt/` | en (lugar/hora) | We arrive at six o'clock. | Llegamos a las seis en punto. |
| `voc_a1_under_001` | **under** | *preposition* | `/ˈʌndər/` | debajo de | The cat is under the bed. | El gato está debajo de la cama. |
| `voc_a1_over_001` | **over** | *preposition* | `/ˈoʊvər/` | sobre/encima de | The bird flew over the house. | El pájaro voló sobre la casa. |
| `voc_a1_above_001` | **above** | *preposition* | `/əˈbʌv/` | arriba de | The shelf is above the desk. | El estante está arriba del escritorio. |
| `voc_a1_below_001` | **below** | *preposition* | `/bɪˈloʊ/` | debajo de | The garage is below the apartment. | El garaje está debajo del apartamento. |
| `voc_a1_inside_001` | **inside** | *preposition* | `/ɪnˈsaɪd/` | dentro | Come inside, it's cold. | Entra, hace frío. |
| `voc_a1_outside_001` | **outside** | *preposition* | `/ˈaʊtˈsaɪd/` | afuera | The kids are playing outside. | Los niños están jugando afuera. |
| `voc_a1_up_001` | **up** | *adverb* | `/ʌp/` | arriba | Look up at the sky. | Mira hacia arriba, al cielo. |
| `voc_a1_down_001` | **down** | *adverb* | `/daʊn/` | abajo | Please sit down. | Por favor siéntate. |
| `voc_a1_into_001` | **into** | *preposition* | `/ˈɪntu/` | hacia dentro | She walked into the room. | Ella entró a la habitación. |
| `voc_a1_onto_001` | **onto** | *preposition* | `/ˈɔntu/` | hacia encima | The cat jumped onto the table. | El gato saltó sobre la mesa. |
| `voc_a1_through_001` | **through** | *preposition* | `/θru/` | a través de | We walked through the park. | Caminamos a través del parque. |
| `voc_a1_across_001` | **across** | *preposition* | `/əˈkrɔs/` | a través de / cruzando | The store is across the street. | La tienda está al otro lado de la calle. |
| `voc_a1_along_001` | **along** | *preposition* | `/əˈlɔŋ/` | a lo largo de | We walked along the beach. | Caminamos a lo largo de la playa. |
| `voc_a1_around_001` | **around** | *preposition* | `/əˈraʊnd/` | alrededor de | We walked around the city. | Caminamos por toda la ciudad. |
| `voc_a1_during_001` | **during** | *preposition* | `/ˈdʊrɪŋ/` | durante | It rained during the trip. | Llovió durante el viaje. |
| `voc_a1_for_001` | **for** | *preposition* | `/fɔr/` | para/por | This gift is for you. | Este regalo es para ti. |
| `voc_a1_with_001` | **with** | *preposition* | `/wɪθ/` | con | I live with my family. | Vivo con mi familia. |
| `voc_a1_without_001` | **without** | *preposition* | `/wɪˈθaʊt/` | sin | I can't sleep without music. | No puedo dormir sin música. |
| `voc_a1_about_001` | **about** | *preposition* | `/əˈbaʊt/` | acerca de | The movie is about a family. | La película es sobre una familia. |
| `voc_a1_against_001` | **against** | *preposition* | `/əˈgɛnst/` | contra | Don't lean against the wall. | No te recuestes contra la pared. |
| `voc_a1_toward_001` | **toward** | *preposition* | `/tɔrd/` | hacia | We walked toward the station. | Caminamos hacia la estación. |
| `voc_a1_whom_001` | **whom** | *pronoun* | `/hum/` | a quién | To whom did you give it? | ¿A quién se lo diste? |
| `voc_a1_whose_001` | **whose** | *pronoun* | `/huz/` | de quién | Whose bag is this? | ¿De quién es esta bolsa? |
| `voc_a1_how-much_001` | **how much** | *adverb* | `/haʊ mʌtʃ/` | cuánto | How much does this cost? | ¿Cuánto cuesta esto? |
| `voc_a1_how-many_001` | **how many** | *adverb* | `/haʊ ˈmɛni/` | cuántos | How many people are coming? | ¿Cuántas personas vienen? |
| `voc_a1_how-often_001` | **how often** | *adverb* | `/haʊ ˈɔfən/` | con qué frecuencia | How often do you exercise? | ¿Con qué frecuencia haces ejercicio? |
| `voc_a1_how-long_001` | **how long** | *adverb* | `/haʊ lɔŋ/` | cuánto tiempo | How long is the movie? | ¿Cuánto dura la película? |
| `voc_a1_so_001` | **so** | *conjunction* | `/soʊ/` | así que | It was late, so we went home. | Era tarde, así que nos fuimos a casa. |
| `voc_a1_because_001` | **because** | *conjunction* | `/bɪˈkɔz/` | porque | I stayed home because I was sick. | Me quedé en casa porque estaba enfermo. |
| `voc_a1_if_001` | **if** | *conjunction* | `/ɪf/` | si | If it rains, we will stay home. | Si llueve, nos quedaremos en casa. |
| `voc_a1_although_001` | **although** | *conjunction* | `/ɔlˈðoʊ/` | aunque | Although it was cold, we went out. | Aunque hacía frío, salimos. |
| `voc_a1_however_001` | **however** | *adverb* | `/haʊˈɛvər/` | sin embargo | I like the city; however, it's noisy. | Me gusta la ciudad; sin embargo, es ruidosa. |
| `voc_a1_also_001` | **also** | *adverb* | `/ˈɔlsoʊ/` | también | She speaks English and also French. | Ella habla inglés y también francés. |
| `voc_a1_either_001` | **either** | *determiner* | `/ˈiðər/` | tampoco/o | I don't like either option. | No me gusta ninguna de las dos opciones. |
| `voc_a1_neither_001` | **neither** | *determiner* | `/ˈniðər/` | ni/tampoco | Neither of us knew the answer. | Ninguno de los dos sabía la respuesta. |
| `voc_a1_both_001` | **both** | *determiner* | `/boʊθ/` | ambos | Both of my brothers live here. | Mis dos hermanos viven aquí. |
| `voc_a1_all_001` | **all** | *determiner* | `/ɔl/` | todo | All the students passed the exam. | Todos los estudiantes pasaron el examen. |
| `voc_a1_every_001` | **every** | *determiner* | `/ˈɛvəri/` | cada | I brush my teeth every night. | Me cepillo los dientes todas las noches. |
| `voc_a1_each_001` | **each** | *determiner* | `/itʃ/` | cada uno | Each student has a book. | Cada estudiante tiene un libro. |
| `voc_a1_some_001` | **some** | *determiner* | `/sʌm/` | algo/algunos | I need some water. | Necesito un poco de agua. |
| `voc_a1_any_001` | **any** | *determiner* | `/ˈɛni/` | alguno/ninguno | Do you have any questions? | ¿Tienes alguna pregunta? |
| `voc_a1_many_001` | **many** | *determiner* | `/ˈmɛni/` | muchos | There are many people here. | Hay mucha gente aquí. |
| `voc_a1_much_001` | **much** | *determiner* | `/mʌtʃ/` | mucho | I don't have much time. | No tengo mucho tiempo. |
| `voc_a1_few_001` | **few** | *determiner* | `/fju/` | pocos | I have a few friends here. | Tengo algunos amigos aquí. |
| `voc_a1_little_001` | **little** | *determiner* | `/ˈlɪtəl/` | poco | There is little food left. | Queda poca comida. |
| `voc_a1_several_001` | **several** | *determiner* | `/ˈsɛvərəl/` | varios | I have several ideas for the project. | Tengo varias ideas para el proyecto. |
| `voc_a1_other_001` | **other** | *determiner* | `/ˈʌðər/` | otro | I have no other choice. | No tengo otra opción. |
| `voc_a1_another_001` | **another** | *determiner* | `/əˈnʌðər/` | otro (adicional) | Can I have another coffee? | ¿Puedo tomar otro café? |
| `voc_a1_such_001` | **such** | *determiner* | `/sʌtʃ/` | tal | It was such a good movie. | Fue una película tan buena. |
| `voc_a1_than_001` | **than** | *preposition* | `/ðæn/` | que (comparación) | She is taller than me. | Ella es más alta que yo. |

### Semana 15: Semana 15 – Adverbios comunes y verbos extra (repaso final)
Total de palabras en esta semana: **62**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_quickly_001` | **quickly** | *adverb* | `/ˈkwɪkli/` | rápidamente | She finished her homework quickly. | Ella terminó su tarea rápidamente. |
| `voc_a1_slowly_001` | **slowly** | *adverb* | `/ˈsloʊli/` | lentamente | He walks very slowly. | Él camina muy lentamente. |
| `voc_a1_carefully_001` | **carefully** | *adverb* | `/ˈkɛrfəli/` | cuidadosamente | Drive carefully, it's raining. | Conduce con cuidado, está lloviendo. |
| `voc_a1_easily_001` | **easily** | *adverb* | `/ˈizəli/` | fácilmente | She learns languages easily. | Ella aprende idiomas fácilmente. |
| `voc_a1_well_001` | **well** | *adverb* | `/wɛl/` | bien | She sings very well. | Ella canta muy bien. |
| `voc_a1_badly_001` | **badly** | *adverb* | `/ˈbædli/` | mal | The team played badly today. | El equipo jugó mal hoy. |
| `voc_a1_loudly_001` | **loudly** | *adverb* | `/ˈlaʊdli/` | ruidosamente | The baby cried loudly. | El bebé lloró ruidosamente. |
| `voc_a1_quietly_001` | **quietly** | *adverb* | `/ˈkwaɪətli/` | silenciosamente | Please speak quietly in the library. | Por favor habla en voz baja en la biblioteca. |
| `voc_a1_suddenly_001` | **suddenly** | *adverb* | `/ˈsʌdənli/` | de repente | Suddenly, it started to rain. | De repente, empezó a llover. |
| `voc_a1_finally_001` | **finally** | *adverb* | `/ˈfaɪnəli/` | finalmente | We finally arrived home. | Finalmente llegamos a casa. |
| `voc_a1_immediately_001` | **immediately** | *adverb* | `/ɪˈmidiətli/` | inmediatamente | Call the doctor immediately. | Llama al médico inmediatamente. |
| `voc_a1_recently_001` | **recently** | *adverb* | `/ˈrisəntli/` | recientemente | I recently moved to this city. | Recientemente me mudé a esta ciudad. |
| `voc_a1_yet_001` | **yet** | *adverb* | `/jɛt/` | todavía/aún | I haven't finished yet. | Todavía no he terminado. |
| `voc_a1_again_001` | **again** | *adverb* | `/əˈgɛn/` | de nuevo | Can you say that again? | ¿Puedes decir eso de nuevo? |
| `voc_a1_almost_001` | **almost** | *adverb* | `/ˈɔlmoʊst/` | casi | It's almost time to go. | Ya casi es hora de irnos. |
| `voc_a1_only_001` | **only** | *adverb* | `/ˈoʊnli/` | solo | I only have five dollars. | Solo tengo cinco dólares. |
| `voc_a1_just_001` | **just** | *adverb* | `/dʒʌst/` | justo/apenas | I just arrived home. | Acabo de llegar a casa. |
| `voc_a1_even_001` | **even** | *adverb* | `/ˈivən/` | incluso | Even my mother liked the movie. | Incluso a mi madre le gustó la película. |
| `voc_a1_maybe_001` | **maybe** | *adverb* | `/ˈmeɪbi/` | quizás | Maybe we can go tomorrow. | Quizás podamos ir mañana. |
| `voc_a1_perhaps_001` | **perhaps** | *adverb* | `/pərˈhæps/` | tal vez | Perhaps she forgot the meeting. | Tal vez ella olvidó la reunión. |
| `voc_a1_probably_001` | **probably** | *adverb* | `/ˈprɑbəbli/` | probablemente | It will probably rain tonight. | Probablemente lloverá esta noche. |
| `voc_a1_certainly_001` | **certainly** | *adverb* | `/ˈsɜrtənli/` | ciertamente | I will certainly help you. | Ciertamente te ayudaré. |
| `voc_a1_actually_001` | **actually** | *adverb* | `/ˈæktʃuəli/` | en realidad | Actually, I don't like coffee. | En realidad, no me gusta el café. |
| `voc_a1_exactly_001` | **exactly** | *adverb* | `/ɪgˈzæktli/` | exactamente | That's exactly what I meant. | Eso es exactamente lo que quise decir. |
| `voc_a1_especially_001` | **especially** | *adverb* | `/ɪˈspɛʃəli/` | especialmente | I love fruit, especially mangoes. | Me encanta la fruta, especialmente el mango. |
| `voc_a1_generally_001` | **generally** | *adverb* | `/ˈdʒɛnərəli/` | generalmente | I generally wake up at seven. | Generalmente me despierto a las siete. |
| `voc_a1_rarely_001` | **rarely** | *adverb* | `/ˈrɛrli/` | raramente | We rarely eat out. | Rara vez comemos fuera. |
| `voc_a1_hardly_001` | **hardly** | *adverb* | `/ˈhɑrdli/` | apenas | I hardly know him. | Apenas lo conozco. |
| `voc_a1_enough_001` | **enough** | *determiner* | `/ɪˈnʌf/` | suficiente | We don't have enough time. | No tenemos suficiente tiempo. |
| `voc_a1_a-lot_001` | **a lot** | *adverb* | `/ə lɑt/` | mucho | I like this city a lot. | Me gusta mucho esta ciudad. |
| `voc_a1_a-little_001` | **a little** | *adverb* | `/ə ˈlɪtəl/` | un poco | I speak a little Spanish. | Hablo un poco de español. |
| `voc_a1_more_001` | **more** | *determiner* | `/mɔr/` | más | I need more time. | Necesito más tiempo. |
| `voc_a1_less_001` | **less** | *determiner* | `/lɛs/` | menos | I want less sugar in my coffee. | Quiero menos azúcar en mi café. |
| `voc_a1_most_001` | **most** | *determiner* | `/moʊst/` | la mayoría | Most students passed the test. | La mayoría de los estudiantes pasaron el examen. |
| `voc_a1_least_001` | **least** | *determiner* | `/list/` | lo menos | This is the least expensive option. | Esta es la opción menos costosa. |
| `voc_a1_agree_001` | **agree** | *verb* | `/əˈgri/` | estar de acuerdo | I agree with you. | Estoy de acuerdo contigo. |
| `voc_a1_disagree_001` | **disagree** | *verb* | `/ˌdɪsəˈgri/` | no estar de acuerdo | I disagree with that idea. | No estoy de acuerdo con esa idea. |
| `voc_a1_decide_001` | **decide** | *verb* | `/dɪˈsaɪd/` | decidir | We need to decide today. | Necesitamos decidir hoy. |
| `voc_a1_choose_001` | **choose** | *verb* | `/tʃuz/` | elegir | Choose your favorite color. | Elige tu color favorito. |
| `voc_a1_plan_001` | **plan** | *verb* | `/plæn/` | planear | We are planning a trip. | Estamos planeando un viaje. |
| `voc_a1_hope_001` | **hope** | *verb* | `/hoʊp/` | esperar (deseo) | I hope you feel better. | Espero que te sientas mejor. |
| `voc_a1_wish_001` | **wish** | *verb* | `/wɪʃ/` | desear | I wish you good luck. | Te deseo buena suerte. |
| `voc_a1_believe_001` | **believe** | *verb* | `/bɪˈliv/` | creer | I believe you. | Te creo. |
| `voc_a1_guess_001` | **guess** | *verb* | `/gɛs/` | adivinar | Guess what happened today! | ¡Adivina qué pasó hoy! |
| `voc_a1_imagine_001` | **imagine** | *verb* | `/ɪˈmædʒɪn/` | imaginar | Imagine living on the beach. | Imagina vivir en la playa. |
| `voc_a1_dream_001` | **dream** | *verb* | `/drim/` | soñar | I dream about traveling the world. | Sueño con viajar por el mundo. |
| `voc_a1_worry_001` | **worry** | *verb* | `/ˈwɜri/` | preocuparse | Don't worry about it. | No te preocupes por eso. |
| `voc_a1_share_001` | **share** | *verb* | `/ʃɛr/` | compartir | Please share your food. | Por favor comparte tu comida. |
| `voc_a1_borrow_001` | **borrow** | *verb* | `/ˈbɑroʊ/` | pedir prestado | Can I borrow your pen? | ¿Puedo pedir prestado tu bolígrafo? |
| `voc_a1_lend_001` | **lend** | *verb* | `/lɛnd/` | prestar | Can you lend me ten dollars? | ¿Puedes prestarme diez dólares? |
| `voc_a1_promise_001` | **promise** | *verb* | `/ˈprɑməs/` | prometer | I promise to call you tonight. | Prometo llamarte esta noche. |
| `voc_a1_apologize_001` | **apologize** | *verb* | `/əˈpɑləˌdʒaɪz/` | disculparse | He apologized for being late. | Él se disculpó por llegar tarde. |
| `voc_a1_congratulate_001` | **congratulate** | *verb* | `/kənˈgrætʃəˌleɪt/` | felicitar | We congratulated her on her new job. | La felicitamos por su nuevo trabajo. |
| `voc_a1_celebrate_001` | **celebrate** | *verb* | `/ˈsɛləˌbreɪt/` | celebrar | We celebrated her birthday together. | Celebramos su cumpleaños juntos. |
| `voc_a1_accept_001` | **accept** | *verb* | `/əkˈsɛpt/` | aceptar | She accepted the job offer. | Ella aceptó la oferta de trabajo. |
| `voc_a1_refuse_001` | **refuse** | *verb* | `/rɪˈfjuz/` | rechazar | He refused to answer the question. | Él se negó a responder la pregunta. |
| `voc_a1_allow_001` | **allow** | *verb* | `/əˈlaʊ/` | permitir | They don't allow pets here. | No permiten mascotas aquí. |
| `voc_a1_suggest_001` | **suggest** | *verb* | `/səgˈdʒɛst/` | sugerir | I suggest we leave early. | Sugiero que salgamos temprano. |
| `voc_a1_recommend_001` | **recommend** | *verb* | `/ˌrɛkəˈmɛnd/` | recomendar | I recommend this restaurant. | Recomiendo este restaurante. |
| `voc_a1_explain_001` | **explain** | *verb* | `/ɪkˈspleɪn/` | explicar | Can you explain the rules? | ¿Puedes explicar las reglas? |
| `voc_a1_describe_001` | **describe** | *verb* | `/dɪˈskraɪb/` | describir | Describe your house to me. | Descríbeme tu casa. |
| `voc_a1_depend_001` | **depend** | *verb* | `/dɪˈpɛnd/` | depender | It depends on the weather. | Depende del clima. |

### Semana 16: Semana 16 – Tecnología, comunicación y entretenimiento
Total de palabras en esta semana: **105**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_laptop_001` | **laptop** | *noun* | — | laptop | — | — |
| `voc_a1_tablet_001` | **tablet** | *noun* | — | tableta | — | — |
| `voc_a1_smartphone_001` | **smartphone** | *noun* | — | teléfono inteligente | — | — |
| `voc_a1_screen_001` | **screen** | *noun* | — | pantalla | — | — |
| `voc_a1_keyboard_001` | **keyboard** | *noun* | — | teclado | — | — |
| `voc_a1_mouse_002` | **mouse (device)** | *noun* | — | ratón (dispositivo) | — | — |
| `voc_a1_password_001` | **password** | *noun* | — | contraseña | — | — |
| `voc_a1_internet_001` | **internet** | *noun* | — | internet | — | — |
| `voc_a1_website_001` | **website** | *noun* | — | sitio web | — | — |
| `voc_a1_email_001` | **email** | *noun* | — | correo electrónico | — | — |
| `voc_a1_message_001` | **message** | *noun* | — | mensaje | — | — |
| `voc_a1_text-message_001` | **text message** | *noun* | — | mensaje de texto | — | — |
| `voc_a1_app-application_001` | **app / application** | *noun* | — | aplicación | — | — |
| `voc_a1_social-media_001` | **social media** | *noun* | — | redes sociales | — | — |
| `voc_a1_photo-picture_001` | **photo / picture** | *noun* | — | foto | — | — |
| `voc_a1_video_001` | **video** | *noun* | — | video | — | — |
| `voc_a1_camera_001` | **camera** | *noun* | — | cámara | — | — |
| `voc_a1_printer_001` | **printer** | *noun* | — | impresora | — | — |
| `voc_a1_charger_001` | **charger** | *noun* | — | cargador | — | — |
| `voc_a1_battery_001` | **battery** | *noun* | — | batería | — | — |
| `voc_a1_wifi_001` | **wifi** | *noun* | — | wifi | — | — |
| `voc_a1_download_001` | **download** | *verb* | — | descargar | — | — |
| `voc_a1_upload_001` | **upload** | *verb* | — | subir (archivo) | — | — |
| `voc_a1_click_001` | **click** | *verb* | — | hacer clic | — | — |
| `voc_a1_type_001` | **type (keyboard)** | *verb* | — | escribir (teclado) | — | — |
| `voc_a1_search_001` | **search** | *verb* | — | buscar | — | — |
| `voc_a1_save_002` | **save (file)** | *verb* | — | guardar | — | — |
| `voc_a1_delete_001` | **delete** | *verb* | — | borrar | — | — |
| `voc_a1_share_002` | **share (online)** | *verb* | — | compartir | — | — |
| `voc_a1_post_001` | **post (verb)** | *verb* | — | publicar | — | — |
| `voc_a1_comment_001` | **comment** | *noun* | — | comentar/comentario | — | — |
| `voc_a1_like_002` | **like (social media)** | *noun* | — | dar me gusta | — | — |
| `voc_a1_follow_001` | **follow (online)** | *verb* | — | seguir | — | — |
| `voc_a1_network_001` | **network** | *noun* | — | red | — | — |
| `voc_a1_file_001` | **file** | *noun* | — | archivo | — | — |
| `voc_a1_folder_001` | **folder** | *noun* | — | carpeta | — | — |
| `voc_a1_document_001` | **document** | *noun* | — | documento | — | — |
| `voc_a1_software_001` | **software** | *noun* | — | software | — | — |
| `voc_a1_update_001` | **update** | *noun* | — | actualizar/actualización | — | — |
| `voc_a1_install_001` | **install** | *verb* | — | instalar | — | — |
| `voc_a1_soccer-football_001` | **soccer / football** | *noun* | — | fútbol | — | — |
| `voc_a1_basketball_001` | **basketball** | *noun* | — | baloncesto | — | — |
| `voc_a1_baseball_001` | **baseball** | *noun* | — | béisbol | — | — |
| `voc_a1_tennis_001` | **tennis** | *noun* | — | tenis | — | — |
| `voc_a1_volleyball_001` | **volleyball** | *noun* | — | voleibol | — | — |
| `voc_a1_golf_001` | **golf** | *noun* | — | golf | — | — |
| `voc_a1_swimming_001` | **swimming** | *noun* | — | natación | — | — |
| `voc_a1_running_001` | **running** | *noun* | — | correr (actividad) | — | — |
| `voc_a1_cycling_001` | **cycling** | *noun* | — | ciclismo | — | — |
| `voc_a1_hiking_001` | **hiking** | *noun* | — | senderismo | — | — |
| `voc_a1_dancing_001` | **dancing** | *noun* | — | baile | — | — |
| `voc_a1_painting_001` | **painting (hobby)** | *noun* | — | pintura (afición) | — | — |
| `voc_a1_drawing_001` | **drawing** | *noun* | — | dibujo | — | — |
| `voc_a1_photography_001` | **photography** | *noun* | — | fotografía | — | — |
| `voc_a1_gardening_001` | **gardening** | *noun* | — | jardinería | — | — |
| `voc_a1_chess_001` | **chess** | *noun* | — | ajedrez | — | — |
| `voc_a1_cards_001` | **cards (game)** | *noun* | — | cartas | — | — |
| `voc_a1_video-games_001` | **video games** | *noun* | — | videojuegos | — | — |
| `voc_a1_board-games_001` | **board games** | *noun* | — | juegos de mesa | — | — |
| `voc_a1_fishing_001` | **fishing** | *noun* | — | pesca | — | — |
| `voc_a1_camping_001` | **camping** | *verb* | — | acampar | — | — |
| `voc_a1_yoga_001` | **yoga** | *noun* | — | yoga | — | — |
| `voc_a1_team_001` | **team** | *noun* | — | equipo | — | — |
| `voc_a1_player_001` | **player** | *noun* | — | jugador | — | — |
| `voc_a1_coach_001` | **coach** | *noun* | — | entrenador | — | — |
| `voc_a1_referee_001` | **referee** | *noun* | — | árbitro | — | — |
| `voc_a1_match_001` | **match** | *noun* | — | partido | — | — |
| `voc_a1_game_001` | **game** | *noun* | — | juego/partido | — | — |
| `voc_a1_score_001` | **score** | *noun* | — | puntuación | — | — |
| `voc_a1_win_001` | **win** | *verb* | — | ganar | — | — |
| `voc_a1_tie_002` | **tie (game)** | *noun* | — | empate | — | — |
| `voc_a1_championship_001` | **championship** | *noun* | — | campeonato | — | — |
| `voc_a1_competition_001` | **competition** | *noun* | — | competencia | — | — |
| `voc_a1_ball_001` | **ball** | *noun* | — | pelota | — | — |
| `voc_a1_goal_001` | **goal** | *noun* | — | gol/meta | — | — |
| `voc_a1_court_001` | **court (sports)** | *noun* | — | cancha | — | — |
| `voc_a1_stadium_001` | **stadium** | *noun* | — | estadio | — | — |
| `voc_a1_song_001` | **song** | *noun* | — | canción | — | — |
| `voc_a1_instrument_001` | **instrument (music)** | *noun* | — | instrumento musical | — | — |
| `voc_a1_guitar_001` | **guitar** | *noun* | — | guitarra | — | — |
| `voc_a1_piano_001` | **piano** | *noun* | — | piano | — | — |
| `voc_a1_drum_001` | **drum** | *noun* | — | tambor | — | — |
| `voc_a1_violin_001` | **violin** | *noun* | — | violín | — | — |
| `voc_a1_band_001` | **band (music)** | *noun* | — | banda | — | — |
| `voc_a1_concert_001` | **concert** | *noun* | — | concierto | — | — |
| `voc_a1_movie-film_001` | **movie / film** | *noun* | — | película | — | — |
| `voc_a1_tv-show_001` | **TV show** | *noun* | — | programa de TV | — | — |
| `voc_a1_series_001` | **series** | *noun* | — | serie | — | — |
| `voc_a1_episode_001` | **episode** | *noun* | — | episodio | — | — |
| `voc_a1_channel_001` | **channel** | *noun* | — | canal | — | — |
| `voc_a1_program_001` | **program** | *noun* | — | programa | — | — |
| `voc_a1_news_001` | **news** | *noun* | — | noticias | — | — |
| `voc_a1_cartoon_001` | **cartoon** | *noun* | — | dibujos animados | — | — |
| `voc_a1_comedy_001` | **comedy** | *noun* | — | comedia | — | — |
| `voc_a1_drama_001` | **drama** | *noun* | — | drama | — | — |
| `voc_a1_horror-movie_001` | **horror movie** | *noun* | — | película de terror | — | — |
| `voc_a1_hobby_001` | **hobby** | *noun* | — | pasatiempo | — | — |
| `voc_a1_interest_001` | **interest (hobby)** | *noun* | — | interés | — | — |
| `voc_a1_free-time_001` | **free time** | *noun* | — | tiempo libre | — | — |
| `voc_a1_activity_001` | **activity** | *noun* | — | actividad | — | — |
| `voc_a1_club_001` | **club** | *noun* | — | club | — | — |
| `voc_a1_member_001` | **member** | *noun* | — | miembro | — | — |
| `voc_a1_event_001` | **event** | *noun* | — | evento | — | — |
| `voc_a1_party_001` | **party** | *noun* | — | fiesta | — | — |
| `voc_a1_festival_001` | **festival** | *noun* | — | festival | — | — |

### Semana 17: Semana 17 – Herramientas, cantidades, dinero y salud
Total de palabras en esta semana: **109**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_tool_001` | **tool** | *noun* | — | herramienta | — | — |
| `voc_a1_hammer_001` | **hammer** | *noun* | — | martillo | — | — |
| `voc_a1_nail_002` | **nail (tool)** | *noun* | — | clavo | — | — |
| `voc_a1_screwdriver_001` | **screwdriver** | *noun* | — | destornillador | — | — |
| `voc_a1_screw_001` | **screw** | *noun* | — | tornillo | — | — |
| `voc_a1_saw_001` | **saw** | *noun* | — | sierra | — | — |
| `voc_a1_drill_001` | **drill** | *noun* | — | taladro | — | — |
| `voc_a1_ladder_001` | **ladder** | *noun* | — | escalera (de mano) | — | — |
| `voc_a1_rope_001` | **rope** | *noun* | — | cuerda | — | — |
| `voc_a1_tape_001` | **tape** | *noun* | — | cinta | — | — |
| `voc_a1_glue_001` | **glue** | *noun* | — | pegamento | — | — |
| `voc_a1_scissors_001` | **scissors** | *noun* | — | tijeras | — | — |
| `voc_a1_needle_001` | **needle** | *noun* | — | aguja | — | — |
| `voc_a1_thread_001` | **thread** | *noun* | — | hilo | — | — |
| `voc_a1_machine_001` | **machine** | *noun* | — | máquina | — | — |
| `voc_a1_engine_001` | **engine** | *noun* | — | motor | — | — |
| `voc_a1_wire_001` | **wire** | *noun* | — | cable/alambre | — | — |
| `voc_a1_pipe_001` | **pipe** | *noun* | — | tubería | — | — |
| `voc_a1_brick_001` | **brick** | *noun* | — | ladrillo | — | — |
| `voc_a1_wood_001` | **wood** | *noun* | — | madera | — | — |
| `voc_a1_metal_001` | **metal** | *noun* | — | metal | — | — |
| `voc_a1_plastic_001` | **plastic** | *noun* | — | plástico | — | — |
| `voc_a1_glass_002` | **glass (material)** | *noun* | — | vidrio | — | — |
| `voc_a1_paper_001` | **paper** | *noun* | — | papel | — | — |
| `voc_a1_cardboard_001` | **cardboard** | *noun* | — | cartón | — | — |
| `voc_a1_rubber_001` | **rubber** | *noun* | — | goma | — | — |
| `voc_a1_material_001` | **material** | *noun* | — | material | — | — |
| `voc_a1_quantity-amount_001` | **quantity / amount** | *noun* | — | cantidad | — | — |
| `voc_a1_number_001` | **number** | *noun* | — | número | — | — |
| `voc_a1_pair_001` | **pair** | *noun* | — | par | — | — |
| `voc_a1_dozen_001` | **dozen** | *noun* | — | docena | — | — |
| `voc_a1_piece_001` | **piece** | *noun* | — | pedazo | — | — |
| `voc_a1_part_001` | **part** | *noun* | — | parte | — | — |
| `voc_a1_whole_001` | **whole** | *noun* | — | entero | — | — |
| `voc_a1_percent_001` | **percent** | *noun* | — | porcentaje | — | — |
| `voc_a1_price_001` | **price** | *noun* | — | precio | — | — |
| `voc_a1_cost_001` | **cost** | *noun* | — | costo | — | — |
| `voc_a1_discount_001` | **discount** | *noun* | — | descuento | — | — |
| `voc_a1_sale_001` | **sale** | *noun* | — | oferta/venta | — | — |
| `voc_a1_receipt_001` | **receipt** | *noun* | — | recibo | — | — |
| `voc_a1_cash_001` | **cash** | *noun* | — | efectivo | — | — |
| `voc_a1_credit-card_001` | **credit card** | *noun* | — | tarjeta de crédito | — | — |
| `voc_a1_money_001` | **money** | *noun* | — | dinero | — | — |
| `voc_a1_coin_001` | **coin** | *noun* | — | moneda | — | — |
| `voc_a1_bill_002` | **bill (money)** | *noun* | — | billete | — | — |
| `voc_a1_change_001` | **change (money)** | *noun* | — | cambio (dinero) | — | — |
| `voc_a1_wallet_001` | **wallet** | *noun* | — | billetera | — | — |
| `voc_a1_purse_001` | **purse** | *noun* | — | bolso | — | — |
| `voc_a1_budget_001` | **budget** | *noun* | — | presupuesto | — | — |
| `voc_a1_debt_001` | **debt** | *noun* | — | deuda | — | — |
| `voc_a1_loan_001` | **loan** | *noun* | — | préstamo | — | — |
| `voc_a1_bank-account_001` | **bank account** | *noun* | — | cuenta bancaria | — | — |
| `voc_a1_tax_001` | **tax** | *noun* | — | impuesto | — | — |
| `voc_a1_insurance_001` | **insurance** | *noun* | — | seguro | — | — |
| `voc_a1_contract_001` | **contract** | *noun* | — | contrato | — | — |
| `voc_a1_business_001` | **business** | *noun* | — | negocio | — | — |
| `voc_a1_customer_001` | **customer** | *noun* | — | cliente | — | — |
| `voc_a1_seller_001` | **seller** | *noun* | — | vendedor | — | — |
| `voc_a1_buyer_001` | **buyer** | *noun* | — | comprador | — | — |
| `voc_a1_product_001` | **product** | *noun* | — | producto | — | — |
| `voc_a1_service_001` | **service** | *noun* | — | servicio | — | — |
| `voc_a1_quality_001` | **quality** | *noun* | — | calidad | — | — |
| `voc_a1_brand_001` | **brand** | *noun* | — | marca | — | — |
| `voc_a1_weight_001` | **weight** | *noun* | — | peso | — | — |
| `voc_a1_measure_001` | **measure** | *verb* | — | medir | — | — |
| `voc_a1_length_001` | **length** | *noun* | — | longitud | — | — |
| `voc_a1_width_001` | **width** | *noun* | — | ancho | — | — |
| `voc_a1_height_001` | **height** | *noun* | — | altura | — | — |
| `voc_a1_depth_001` | **depth** | *noun* | — | profundidad | — | — |
| `voc_a1_volume_001` | **volume** | *noun* | — | volumen | — | — |
| `voc_a1_distance_001` | **distance** | *noun* | — | distancia | — | — |
| `voc_a1_speed_001` | **speed** | *noun* | — | velocidad | — | — |
| `voc_a1_direction_001` | **direction** | *noun* | — | dirección (rumbo) | — | — |
| `voc_a1_north_001` | **north** | *noun* | — | norte | — | — |
| `voc_a1_south_001` | **south** | *noun* | — | sur | — | — |
| `voc_a1_east_001` | **east** | *noun* | — | este | — | — |
| `voc_a1_west_001` | **west** | *noun* | — | oeste | — | — |
| `voc_a1_medicine_001` | **medicine** | *noun* | — | medicina | — | — |
| `voc_a1_pill_001` | **pill** | *noun* | — | pastilla | — | — |
| `voc_a1_pharmacy_001` | **pharmacy** | *noun* | — | farmacia | — | — |
| `voc_a1_appointment_001` | **appointment** | *noun* | — | cita | — | — |
| `voc_a1_injury_001` | **injury** | *noun* | — | lesión | — | — |
| `voc_a1_pain_001` | **pain** | *noun* | — | dolor | — | — |
| `voc_a1_headache_001` | **headache** | *noun* | — | dolor de cabeza | — | — |
| `voc_a1_fever_001` | **fever** | *noun* | — | fiebre | — | — |
| `voc_a1_cough_001` | **cough** | *noun* | — | tos | — | — |
| `voc_a1_cold_002` | **cold (illness)** | *noun* | — | resfriado | — | — |
| `voc_a1_flu_001` | **flu** | *noun* | — | gripe | — | — |
| `voc_a1_ambulance_001` | **ambulance** | *noun* | — | ambulancia | — | — |
| `voc_a1_emergency_001` | **emergency** | *noun* | — | emergencia | — | — |
| `voc_a1_accident_001` | **accident** | *noun* | — | accidente | — | — |
| `voc_a1_patient_002` | **patient (person)** | *noun* | — | paciente | — | — |
| `voc_a1_treatment_001` | **treatment** | *noun* | — | tratamiento | — | — |
| `voc_a1_vaccine_001` | **vaccine** | *noun* | — | vacuna | — | — |
| `voc_a1_health_001` | **health** | *noun* | — | salud | — | — |
| `voc_a1_diet_001` | **diet** | *noun* | — | dieta | — | — |
| `voc_a1_humidity_001` | **humidity** | *noun* | — | humedad | — | — |
| `voc_a1_climate_001` | **climate** | *noun* | — | clima (general) | — | — |
| `voc_a1_thunder_001` | **thunder** | *noun* | — | trueno | — | — |
| `voc_a1_lightning_001` | **lightning** | *noun* | — | relámpago | — | — |
| `voc_a1_earthquake_001` | **earthquake** | *noun* | — | terremoto | — | — |
| `voc_a1_flood_001` | **flood** | *noun* | — | inundación | — | — |
| `voc_a1_pollution_001` | **pollution** | *noun* | — | contaminación | — | — |
| `voc_a1_recycle_001` | **recycle** | *verb* | — | reciclar | — | — |
| `voc_a1_environment_001` | **environment** | *noun* | — | medio ambiente | — | — |
| `voc_a1_energy_001` | **energy** | *noun* | — | energía | — | — |
| `voc_a1_electricity_001` | **electricity** | *noun* | — | electricidad | — | — |
| `voc_a1_fuel_001` | **fuel** | *noun* | — | combustible | — | — |
| `voc_a1_solar_001` | **solar** | *adjective* | — | solar | — | — |

### Semana 18: Semana 18 – Verbos de acción, ideas y repaso general
Total de palabras en esta semana: **104**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_put_001` | **put** | *verb* | `/pʊt/` | poner | Put the box on the table. | Pon la caja sobre la mesa. |
| `voc_a1_keep_001` | **keep** | *verb* | `/kip/` | mantener/guardar | You can keep the book. | Puedes quedarte con el libro. |
| `voc_a1_hold_001` | **hold** | *verb* | `/hoʊld/` | sostener | Can you hold my bag? | ¿Puedes sostener mi bolsa? |
| `voc_a1_carry_001` | **carry (object)** | *verb* | `/ˈkæri/` | llevar/cargar | She carries her laptop every day. | Ella carga su laptop todos los días. |
| `voc_a1_pull_001` | **pull** | *verb* | `/pʊl/` | jalar | Pull the door to open it. | Jala la puerta para abrirla. |
| `voc_a1_push_001` | **push** | *verb* | `/pʊʃ/` | empujar | Push the button to start. | Presiona el botón para empezar. |
| `voc_a1_throw_001` | **throw** | *verb* | `/θroʊ/` | lanzar | Throw the ball to me. | Lánzame la pelota. |
| `voc_a1_catch_001` | **catch** | *verb* | `/kætʃ/` | atrapar | Catch the ball! | ¡Atrapa la pelota! |
| `voc_a1_hit_001` | **hit** | *verb* | `/hɪt/` | golpear | He hit the ball hard. | Él golpeó la pelota fuerte. |
| `voc_a1_kick_001` | **kick** | *verb* | `/kɪk/` | patear | The player kicked the ball. | El jugador pateó la pelota. |
| `voc_a1_tear_001` | **tear** | *verb* | `/tɛr/` | rasgar | Be careful, don't tear the paper. | Ten cuidado, no rasgues el papel. |
| `voc_a1_fold_001` | **fold** | *verb* | `/foʊld/` | doblar | Fold the clothes, please. | Dobla la ropa, por favor. |
| `voc_a1_wrap_001` | **wrap** | *verb* | `/ræp/` | envolver | I need to wrap this gift. | Necesito envolver este regalo. |
| `voc_a1_cover_001` | **cover** | *verb* | `/ˈkʌvər/` | cubrir | Cover the food with a towel. | Cubre la comida con una toalla. |
| `voc_a1_hide_001` | **hide** | *verb* | `/haɪd/` | esconder | The cat likes to hide under the bed. | Al gato le gusta esconderse bajo la cama. |
| `voc_a1_show_001` | **show** | *verb* | `/ʃoʊ/` | mostrar | Show me your notebook. | Muéstrame tu cuaderno. |
| `voc_a1_point_001` | **point** | *verb* | `/pɔɪnt/` | señalar | She pointed at the map. | Ella señaló el mapa. |
| `voc_a1_turn_001` | **turn** | *verb* | `/tɜrn/` | girar | Turn left at the corner. | Gira a la izquierda en la esquina. |
| `voc_a1_turn-on_001` | **turn on** | *verb* | `/tɜrn ɑn/` | encender | Turn on the light, please. | Enciende la luz, por favor. |
| `voc_a1_turn-off_001` | **turn off** | *verb* | `/tɜrn ɔf/` | apagar | Turn off your phone in class. | Apaga tu teléfono en clase. |
| `voc_a1_mix_001` | **mix** | *verb* | `/mɪks/` | mezclar | Mix the eggs and the flour. | Mezcla los huevos y la harina. |
| `voc_a1_add_001` | **add** | *verb* | `/æd/` | agregar | Add a little salt. | Agrega un poco de sal. |
| `voc_a1_remove_001` | **remove** | *verb* | `/rɪˈmuv/` | quitar | Remove your shoes, please. | Quítate los zapatos, por favor. |
| `voc_a1_fill_001` | **fill** | *verb* | `/fɪl/` | llenar | Fill the glass with water. | Llena el vaso con agua. |
| `voc_a1_pour_001` | **pour** | *verb* | `/pɔr/` | verter | Pour the juice into the cup. | Vierte el jugo en la taza. |
| `voc_a1_press_001` | **press** | *verb* | `/prɛs/` | presionar | Press the button twice. | Presiona el botón dos veces. |
| `voc_a1_lift_001` | **lift** | *verb* | `/lɪft/` | levantar | Lift the box carefully. | Levanta la caja con cuidado. |
| `voc_a1_drop_001` | **drop** | *verb* | `/drɑp/` | dejar caer | Don't drop the plate. | No dejes caer el plato. |
| `voc_a1_pick-up_001` | **pick up** | *verb* | `/pɪk ʌp/` | recoger | Pick up your toys, please. | Recoge tus juguetes, por favor. |
| `voc_a1_set-up_001` | **set up** | *verb* | `/sɛt ʌp/` | instalar/organizar | We set up the tent quickly. | Instalamos la tienda de campaña rápido. |
| `voc_a1_rise_001` | **rise** | *verb* | `/raɪz/` | subir/aumentar | Prices rise every year. | Los precios suben cada año. |
| `voc_a1_fall_001` | **fall** | *verb* | `/fɔl/` | caer | Leaves fall in autumn. | Las hojas caen en otoño. |
| `voc_a1_grow_001` | **grow** | *verb* | `/groʊ/` | crecer | Children grow very fast. | Los niños crecen muy rápido. |
| `voc_a1_increase_001` | **increase** | *verb* | `/ɪnˈkris/` | aumentar | The company will increase salaries. | La empresa aumentará los salarios. |
| `voc_a1_decrease_001` | **decrease** | *verb* | `/diˈkris/` | disminuir | Sales decreased this month. | Las ventas disminuyeron este mes. |
| `voc_a1_change_002` | **change (verb)** | *verb* | `/tʃeɪndʒ/` | cambiar | I need to change my schedule. | Necesito cambiar mi horario. |
| `voc_a1_improve_001` | **improve** | *verb* | `/ɪmˈpruv/` | mejorar | She wants to improve her English. | Ella quiere mejorar su inglés. |
| `voc_a1_succeed_001` | **succeed** | *verb* | `/səkˈsid/` | tener éxito | He worked hard to succeed. | Él trabajó duro para tener éxito. |
| `voc_a1_fail_001` | **fail** | *verb* | `/feɪl/` | fallar | I hope I don't fail the exam. | Espero no reprobar el examen. |
| `voc_a1_compete_001` | **compete** | *verb* | `/kəmˈpit/` | competir | Our team will compete this weekend. | Nuestro equipo competirá este fin de semana. |
| `voc_a1_practice_001` | **practice** | *verb* | `/ˈpræktɪs/` | practicar | I practice English every day. | Practico inglés todos los días. |
| `voc_a1_prepare_001` | **prepare** | *verb* | `/prɪˈpɛr/` | preparar | We need to prepare dinner. | Necesitamos preparar la cena. |
| `voc_a1_organize_001` | **organize** | *verb* | `/ˈɔrgəˌnaɪz/` | organizar | Let's organize the closet. | Organicemos el armario. |
| `voc_a1_arrange_001` | **arrange** | *verb* | `/əˈreɪndʒ/` | arreglar/organizar | She arranged the flowers nicely. | Ella arregló las flores muy bien. |
| `voc_a1_collect_001` | **collect** | *verb* | `/kəˈlɛkt/` | coleccionar | He collects old coins. | Él colecciona monedas antiguas. |
| `voc_a1_gather_001` | **gather** | *verb* | `/ˈgæðər/` | reunir | We gathered around the table. | Nos reunimos alrededor de la mesa. |
| `voc_a1_separate_001` | **separate** | *verb* | `/ˈsɛpəˌreɪt/` | separar | Please separate the plastic and paper. | Por favor separa el plástico y el papel. |
| `voc_a1_connect_001` | **connect** | *verb* | `/kəˈnɛkt/` | conectar | Connect the cable to the TV. | Conecta el cable a la televisión. |
| `voc_a1_disconnect_001` | **disconnect** | *verb* | `/ˌdɪskəˈnɛkt/` | desconectar | Disconnect the printer before moving it. | Desconecta la impresora antes de moverla. |
| `voc_a1_join_001` | **join** | *verb* | `/dʒɔɪn/` | unirse | Do you want to join our team? | ¿Quieres unirte a nuestro equipo? |
| `voc_a1_enter_001` | **enter** | *verb* | `/ˈɛntər/` | entrar | Please enter through this door. | Por favor entra por esta puerta. |
| `voc_a1_exit_001` | **exit** | *verb* | `/ˈɛgzɪt/` | salir | Exit through the back door. | Sal por la puerta trasera. |
| `voc_a1_idea_001` | **idea** | *noun* | `/aɪˈdiə/` | idea | That's a great idea. | Esa es una gran idea. |
| `voc_a1_opinion_001` | **opinion** | *noun* | `/əˈpɪnjən/` | opinión | What is your opinion? | ¿Cuál es tu opinión? |
| `voc_a1_decision_001` | **decision** | *noun* | `/dɪˈsɪʒən/` | decisión | It was a difficult decision. | Fue una decisión difícil. |
| `voc_a1_solution_001` | **solution** | *noun* | `/səˈluʃən/` | solución | We found a good solution. | Encontramos una buena solución. |
| `voc_a1_problem_001` | **problem** | *noun* | `/ˈprɑbləm/` | problema | We have a small problem. | Tenemos un pequeño problema. |
| `voc_a1_reason_001` | **reason** | *noun* | `/ˈrizən/` | razón | What is the reason for this? | ¿Cuál es la razón de esto? |
| `voc_a1_result_001` | **result** | *noun* | `/rɪˈzʌlt/` | resultado | The result was excellent. | El resultado fue excelente. |
| `voc_a1_effect_001` | **effect** | *noun* | `/ɪˈfɛkt/` | efecto | The medicine had no effect. | La medicina no tuvo efecto. |
| `voc_a1_cause_001` | **cause** | *noun* | `/kɔz/` | causa | We don't know the cause yet. | Todavía no sabemos la causa. |
| `voc_a1_example_001` | **example** | *noun* | `/ɪgˈzæmpəl/` | ejemplo | Can you give me an example? | ¿Puedes darme un ejemplo? |
| `voc_a1_fact_001` | **fact** | *noun* | `/fækt/` | hecho | That's an interesting fact. | Ese es un hecho interesante. |
| `voc_a1_information_001` | **information** | *noun* | `/ˌɪnfərˈmeɪʃən/` | información | I need more information. | Necesito más información. |
| `voc_a1_rule_001` | **rule** | *noun* | `/rul/` | regla | Every game has rules. | Todo juego tiene reglas. |
| `voc_a1_law_001` | **law** | *noun* | `/lɔ/` | ley | It's against the law. | Es contra la ley. |
| `voc_a1_permission_001` | **permission** | *noun* | `/pərˈmɪʃən/` | permiso | I need your permission. | Necesito tu permiso. |
| `voc_a1_freedom_001` | **freedom** | *noun* | `/ˈfridəm/` | libertad | Freedom is important to me. | La libertad es importante para mí. |
| `voc_a1_responsibility_001` | **responsibility** | *noun* | `/rɪˌspɑnsəˈbɪləti/` | responsabilidad | It's your responsibility now. | Es tu responsabilidad ahora. |
| `voc_a1_duty_001` | **duty** | *noun* | `/ˈduti/` | deber | It's my duty to help. | Es mi deber ayudar. |
| `voc_a1_purpose_001` | **purpose** | *noun* | `/ˈpɜrpəs/` | propósito | What is the purpose of this meeting? | ¿Cuál es el propósito de esta reunión? |
| `voc_a1_project_001` | **project** | *noun* | `/ˈprɑdʒɛkt/` | proyecto | We finished the project on time. | Terminamos el proyecto a tiempo. |
| `voc_a1_task_001` | **task** | *noun* | `/tæsk/` | tarea (labor) | I have one more task to do. | Tengo una tarea más que hacer. |
| `voc_a1_effort_001` | **effort** | *noun* | `/ˈɛfərt/` | esfuerzo | She made a big effort. | Ella hizo un gran esfuerzo. |
| `voc_a1_chance_001` | **chance** | *noun* | `/tʃæns/` | oportunidad/posibilidad | This is your chance. | Esta es tu oportunidad. |
| `voc_a1_opportunity_001` | **opportunity** | *noun* | `/ˌɑpərˈtunəti/` | oportunidad | It was a great opportunity. | Fue una gran oportunidad. |
| `voc_a1_risk_001` | **risk** | *noun* | `/rɪsk/` | riesgo | There is a small risk. | Hay un pequeño riesgo. |
| `voc_a1_success_001` | **success** | *noun* | `/səkˈsɛs/` | éxito | The event was a success. | El evento fue un éxito. |
| `voc_a1_failure_001` | **failure** | *noun* | `/ˈfeɪljər/` | fracaso | Failure taught him a lot. | El fracaso le enseñó mucho. |
| `voc_a1_mistake_001` | **mistake** | *noun* | `/mɪˈsteɪk/` | error | Everyone makes mistakes. | Todos cometemos errores. |
| `voc_a1_experience_001` | **experience** | *noun* | `/ɪkˈspɪriəns/` | experiencia | It was a great experience. | Fue una gran experiencia. |
| `voc_a1_knowledge_001` | **knowledge** | *noun* | `/ˈnɑlɪdʒ/` | conocimiento | She has a lot of knowledge. | Ella tiene mucho conocimiento. |
| `voc_a1_skill_001` | **skill** | *noun* | `/skɪl/` | habilidad | Cooking is a useful skill. | Cocinar es una habilidad útil. |
| `voc_a1_ability_001` | **ability** | *noun* | `/əˈbɪləti/` | capacidad | He has the ability to lead. | Él tiene la capacidad de liderar. |
| `voc_a1_talent_001` | **talent** | *noun* | `/ˈtælənt/` | talento | She has real talent for music. | Ella tiene verdadero talento para la música. |
| `voc_a1_memory_001` | **memory** | *noun* | `/ˈmɛməri/` | memoria | I have a good memory. | Tengo buena memoria. |
| `voc_a1_imagination_001` | **imagination** | *noun* | `/ɪˌmædʒəˈneɪʃən/` | imaginación | Children have great imagination. | Los niños tienen mucha imaginación. |
| `voc_a1_attention_001` | **attention** | *noun* | `/əˈtɛnʃən/` | atención | Pay attention, please. | Presta atención, por favor. |
| `voc_a1_focus_001` | **focus** | *noun* | `/ˈfoʊkəs/` | concentración | I need more focus today. | Necesito más concentración hoy. |
| `voc_a1_courage_001` | **courage** | *noun* | `/ˈkɜrɪdʒ/` | valentía | It took courage to speak up. | Se necesitó valentía para hablar. |
| `voc_a1_fear_001` | **fear** | *noun* | `/fɪr/` | miedo | She has a fear of heights. | Ella tiene miedo a las alturas. |
| `voc_a1_faith_001` | **faith** | *noun* | `/feɪθ/` | fe | I have faith in you. | Tengo fe en ti. |
| `voc_a1_trust_001` | **trust** | *noun* | `/trʌst/` | confianza | Trust is important in a team. | La confianza es importante en un equipo. |
| `voc_a1_doubt_001` | **doubt** | *noun* | `/daʊt/` | duda | I have some doubt about this. | Tengo algo de duda sobre esto. |
| `voc_a1_truth_001` | **truth** | *noun* | `/truθ/` | verdad | Please tell me the truth. | Por favor dime la verdad. |
| `voc_a1_lie_001` | **lie (noun)** | *noun* | `/laɪ/` | mentira | That was a lie. | Eso fue una mentira. |
| `voc_a1_secret_001` | **secret** | *noun* | `/ˈsikrɪt/` | secreto | Can you keep a secret? | ¿Puedes guardar un secreto? |
| `voc_a1_agreement_001` | **agreement** | *noun* | `/əˈgrimənt/` | acuerdo | We reached an agreement. | Llegamos a un acuerdo. |
| `voc_a1_conflict_001` | **conflict** | *noun* | `/ˈkɑnflɪkt/` | conflicto | There was a conflict at work. | Hubo un conflicto en el trabajo. |
| `voc_a1_peace_001` | **peace** | *noun* | `/pis/` | paz | We want peace. | Queremos paz. |
| `voc_a1_war_001` | **war** | *noun* | `/wɔr/` | guerra | The war ended years ago. | La guerra terminó hace años. |
| `voc_a1_justice_001` | **justice** | *noun* | `/ˈdʒʌstɪs/` | justicia | They fought for justice. | Ellos lucharon por la justicia. |
| `voc_a1_equality_001` | **equality** | *noun* | `/ɪˈkwɑləti/` | igualdad | Equality is a basic right. | La igualdad es un derecho básico. |
| `voc_a1_value_001` | **value** | *noun* | `/ˈvælju/` | valor | Honesty is an important value. | La honestidad es un valor importante. |

### Semana 19: Semana 19 – Verbos irregulares esenciales (base – pasado – participio)
Total de palabras en esta semana: **50**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_go-went-gone_001` | **go – went – gone** | *verb* | `/goʊ/ /wɛnt/ /gɔn/` | ir | I go to work by bus. | Voy al trabajo en autobús. |
| `voc_a1_see-saw-seen_001` | **see – saw – seen** | *verb* | `/si/ /sɔ/ /sin/` | ver | I see my friends on weekends. | Veo a mis amigos los fines de semana. |
| `voc_a1_eat-ate-eaten_001` | **eat – ate – eaten** | *verb* | `/it/ /eɪt/ /ˈitən/` | comer | We eat dinner at eight. | Cenamos a las ocho. |
| `voc_a1_drink-drank-drunk_001` | **drink – drank – drunk** | *verb* | `/drɪŋk/ /dræŋk/ /drʌŋk/` | beber | I drink coffee every morning. | Bebo café todas las mañanas. |
| `voc_a1_come-came-come_001` | **come – came – come** | *verb* | `/kʌm/ /keɪm/ /kʌm/` | venir | Please come early tomorrow. | Por favor ven temprano mañana. |
| `voc_a1_take-took-taken_001` | **take – took – taken** | *verb* | `/teɪk/ /tʊk/ /ˈteɪkən/` | tomar | I take the bus every day. | Tomo el autobús todos los días. |
| `voc_a1_give-gave-given_001` | **give – gave – given** | *verb* | `/gɪv/ /geɪv/ /ˈgɪvən/` | dar | Give me your hand, please. | Dame tu mano, por favor. |
| `voc_a1_make-made-made_001` | **make – made – made** | *verb* | `/meɪk/ /meɪd/ /meɪd/` | hacer/fabricar | She makes breakfast every morning. | Ella hace el desayuno cada mañana. |
| `voc_a1_get-got-gotten_001` | **get – got – gotten** | *verb* | `/gɛt/ /gɑt/ /ˈgɑtən/` | obtener | I get up at seven. | Me levanto a las siete. |
| `voc_a1_say-said-said_001` | **say – said – said** | *verb* | `/seɪ/ /sɛd/ /sɛd/` | decir | What did she say? | ¿Qué dijo ella? |
| `voc_a1_know-knew-known_001` | **know – knew – known** | *verb* | `/noʊ/ /nu/ /noʊn/` | saber/conocer | I know the answer. | Sé la respuesta. |
| `voc_a1_think-thought-thought_001` | **think – thought – thought** | *verb* | `/θɪŋk/ /θɔt/ /θɔt/` | pensar | I think it will rain. | Creo que va a llover. |
| `voc_a1_find-found-found_001` | **find – found – found** | *verb* | `/faɪnd/ /faʊnd/ /faʊnd/` | encontrar | I can't find my keys. | No encuentro mis llaves. |
| `voc_a1_tell-told-told_001` | **tell – told – told** | *verb* | `/tɛl/ /toʊld/ /toʊld/` | contar/decir | Tell me the truth. | Dime la verdad. |
| `voc_a1_become-became-become_001` | **become – became – become** | *verb* | `/bɪˈkʌm/ /bɪˈkeɪm/ /bɪˈkʌm/` | convertirse | She became a doctor. | Ella se convirtió en médica. |
| `voc_a1_leave-left-left_001` | **leave – left – left** | *verb* | `/liv/ /lɛft/ /lɛft/` | irse/dejar | I leave home at eight. | Salgo de casa a las ocho. |
| `voc_a1_feel-felt-felt_001` | **feel – felt – felt** | *verb* | `/fil/ /fɛlt/ /fɛlt/` | sentir | I feel tired today. | Me siento cansado hoy. |
| `voc_a1_bring-brought-brought_001` | **bring – brought – brought** | *verb* | `/brɪŋ/ /brɔt/ /brɔt/` | traer | Bring your homework tomorrow. | Trae tu tarea mañana. |
| `voc_a1_begin-began-begun_001` | **begin – began – begun** | *verb* | `/bɪˈgɪn/ /bɪˈgæn/ /bɪˈgʌn/` | comenzar | The movie begins at eight. | La película empieza a las ocho. |
| `voc_a1_keep-kept-kept_001` | **keep – kept – kept** | *verb* | `/kip/ /kɛpt/ /kɛpt/` | mantener | You can keep the change. | Puedes quedarte con el cambio. |
| `voc_a1_hold-held-held_001` | **hold – held – held** | *verb* | `/hoʊld/ /hɛld/ /hɛld/` | sostener | She held the baby gently. | Ella sostuvo al bebé con cuidado. |
| `voc_a1_write-wrote-written_001` | **write – wrote – written** | *verb* | `/raɪt/ /roʊt/ /ˈrɪtən/` | escribir | He writes letters to his family. | Él le escribe cartas a su familia. |
| `voc_a1_stand-stood-stood_001` | **stand – stood – stood** | *verb* | `/stænd/ /stʊd/ /stʊd/` | pararse | We stood in line for an hour. | Estuvimos parados en la fila una hora. |
| `voc_a1_hear-heard-heard_001` | **hear – heard – heard** | *verb* | `/hɪr/ /hɜrd/ /hɜrd/` | oír | Can you hear the music? | ¿Puedes oír la música? |
| `voc_a1_let-let-let_001` | **let – let – let** | *verb* | `/lɛt/ /lɛt/ /lɛt/` | permitir | Let me help you. | Déjame ayudarte. |
| `voc_a1_mean-meant-meant_001` | **mean – meant – meant** | *verb* | `/min/ /mɛnt/ /mɛnt/` | significar | What does this word mean? | ¿Qué significa esta palabra? |
| `voc_a1_meet-met-met_001` | **meet – met – met** | *verb* | `/mit/ /mɛt/ /mɛt/` | conocer/encontrarse | Nice to meet you. | Mucho gusto en conocerte. |
| `voc_a1_pay-paid-paid_001` | **pay – paid – paid** | *verb* | `/peɪ/ /peɪd/ /peɪd/` | pagar | I will pay for dinner. | Yo pagaré la cena. |
| `voc_a1_run-ran-run_001` | **run – ran – run** | *verb* | `/rʌn/ /ræn/ /rʌn/` | correr | She runs in the park on Sundays. | Ella corre en el parque los domingos. |
| `voc_a1_sit-sat-sat_001` | **sit – sat – sat** | *verb* | `/sɪt/ /sæt/ /sæt/` | sentarse | Please sit here. | Por favor siéntate aquí. |
| `voc_a1_speak-spoke-spoken_001` | **speak – spoke – spoken** | *verb* | `/spik/ /spoʊk/ /ˈspoʊkən/` | hablar | Do you speak English? | ¿Hablas inglés? |
| `voc_a1_read-read-read_001` | **read – read – read** | *verb* | `/rid/ /rɛd/ /rɛd/` | leer | I read a book before sleeping. | Leo un libro antes de dormir. |
| `voc_a1_grow-grew-grown_001` | **grow – grew – grown** | *verb* | `/groʊ/ /gru/ /groʊn/` | crecer | Children grow very fast. | Los niños crecen muy rápido. |
| `voc_a1_lose-lost-lost_001` | **lose – lost – lost** | *verb* | `/luz/ /lɔst/ /lɔst/` | perder | Don't lose your ticket. | No pierdas tu boleto. |
| `voc_a1_fall-fell-fallen_001` | **fall – fell – fallen** | *verb* | `/fɔl/ /fɛl/ /ˈfɔlən/` | caer | Leaves fall in autumn. | Las hojas caen en otoño. |
| `voc_a1_send-sent-sent_001` | **send – sent – sent** | *verb* | `/sɛnd/ /sɛnt/ /sɛnt/` | enviar | I will send you an email. | Te enviaré un correo electrónico. |
| `voc_a1_build-built-built_001` | **build – built – built** | *verb* | `/bɪld/ /bɪlt/ /bɪlt/` | construir | They built a new house. | Construyeron una casa nueva. |
| `voc_a1_understand-understood-understood_001` | **understand – understood – understood** | *verb* | `/ˌʌndərˈstænd/ /ˌʌndərˈstʊd/ /ˌʌndərˈstʊd/` | entender | Do you understand the question? | ¿Entiendes la pregunta? |
| `voc_a1_break-broke-broken_001` | **break – broke – broken** | *verb* | `/breɪk/ /broʊk/ /ˈbroʊkən/` | romper | Be careful, don't break the glass. | Ten cuidado, no rompas el vaso. |
| `voc_a1_spend-spent-spent_001` | **spend – spent – spent** | *verb* | `/spɛnd/ /spɛnt/ /spɛnt/` | gastar | We spend a lot on rent. | Gastamos mucho en el alquiler. |
| `voc_a1_drive-drove-driven_001` | **drive – drove – driven** | *verb* | `/draɪv/ /droʊv/ /ˈdrɪvən/` | conducir | He drives to the office. | Él conduce a la oficina. |
| `voc_a1_buy-bought-bought_001` | **buy – bought – bought** | *verb* | `/baɪ/ /bɔt/ /bɔt/` | comprar | I need to buy some bread. | Necesito comprar pan. |
| `voc_a1_catch-caught-caught_001` | **catch – caught – caught** | *verb* | `/kætʃ/ /kɔt/ /kɔt/` | atrapar | Catch the ball! | ¡Atrapa la pelota! |
| `voc_a1_teach-taught-taught_001` | **teach – taught – taught** | *verb* | `/titʃ/ /tɔt/ /tɔt/` | enseñar | She teaches math at school. | Ella enseña matemáticas en la escuela. |
| `voc_a1_fly-flew-flown_001` | **fly – flew – flown** | *verb* | `/flaɪ/ /flu/ /floʊn/` | volar | We fly to Chicago tomorrow. | Volamos a Chicago mañana. |
| `voc_a1_choose-chose-chosen_001` | **choose – chose – chosen** | *verb* | `/tʃuz/ /tʃoʊz/ /ˈtʃoʊzən/` | elegir | Choose your favorite color. | Elige tu color favorito. |
| `voc_a1_wear-wore-worn_001` | **wear – wore – worn** | *verb* | `/wɛr/ /wɔr/ /wɔrn/` | llevar puesto | She wears jeans to work. | Ella usa jeans para trabajar. |
| `voc_a1_sell-sold-sold_001` | **sell – sold – sold** | *verb* | `/sɛl/ /soʊld/ /soʊld/` | vender | They sell fresh fruit here. | Aquí venden fruta fresca. |
| `voc_a1_forget-forgot-forgotten_001` | **forget – forgot – forgotten** | *verb* | `/fərˈgɛt/ /fərˈgɑt/ /fərˈgɑtən/` | olvidar | Don't forget your keys. | No olvides tus llaves. |
| `voc_a1_put-put-put_001` | **put – put – put** | *verb* | `/pʊt/ /pʊt/ /pʊt/` | poner | Put the box on the table. | Pon la caja sobre la mesa. |

### 📖 Lecturas de Comprensión · Nivel A1

#### My Daily Routine and Family (`rdg_a1_001`)
- **Nivel:** A1 • **Semana Asignada:** Semana 10 • **Dificultad:** 1/5
- **Vocabulario Enlazado (17 términos):** `voc_a1_name_001`, `voc_a1_mother-mom_001`, `voc_a1_father-dad_001`, `voc_a1_brother_001`, `voc_a1_family_001`, `voc_a1_small_001`, `voc_a1_nice_001`, `voc_a1_house_001`, `voc_a1_garden_001`, `voc_a1_milk_001`, `voc_a1_bread_001`, `voc_a1_blue_001`, `voc_a1_chicken_001`, `voc_a1_rice_001`, `voc_a1_weekend_001`, `voc_a1_dog_001`, `voc_a1_park_001`

**Texto en Inglés:**
> My name is Anna. I am from Mexico. I have a small family: a mother, a father, and one brother. We live in a nice house with a garden. Every day I wake up at seven o'clock. I have breakfast with milk and bread. Then I go to school. My favorite color is blue and my favorite food is chicken with rice. On the weekend, I like to play with my dog in the park.

**Traducción al Español:**
> *Mi nombre es Anna. Soy de México. Tengo una familia pequeña: una madre, un padre y un hermano. Vivimos en una casa bonita con jardín. Todos los días me despierto a las siete en punto. Desayuno leche y pan. Luego voy a la escuela. Mi color favorito es el azul y mi comida favorita es el pollo con arroz. El fin de semana me gusta jugar con mi perro en el parque.*

**Preguntas de Comprensión:**
1. **What time does Anna wake up every day?**
   - ▫️ At six o'clock
   - ✅ At seven o'clock
   - ▫️ At eight o'clock
   *Explicación:* Anna says: 'Every day I wake up at seven o'clock.'

2. **What is Anna's favorite food?**
   - ▫️ Milk and bread
   - ✅ Chicken with rice
   - ▫️ Fish and salad
   *Explicación:* Anna states: 'my favorite food is chicken with rice.'

3. **Where does Anna like to play with her dog on the weekend?**
   - ✅ In the park
   - ▫️ In the school
   - ▫️ In the supermarket
   *Explicación:* Anna says: 'On the weekend, I like to play with my dog in the park.'

#### A Morning in the City (`rdg_a1_002`)
- **Nivel:** A1 • **Semana Asignada:** Semana 12 • **Dificultad:** 2/5
- **Vocabulario Enlazado (10 términos):** `voc_a1_sunny_001`, `voc_a1_street_001`, `voc_a1_bread_001`, `voc_a1_coffee_001`, `voc_a1_park_001`, `voc_a1_doctor_001`, `voc_a1_hospital_001`, `voc_a1_bus_001`, `voc_a1_library_001`, `voc_a1_nature_001`

**Texto en Inglés:**
> Today is a sunny morning. The sky is clear and the street is quiet. Carlos walks to the bakery to buy fresh bread and hot coffee. Near the park, he sees a doctor walking to the hospital. Carlos takes the red bus to the library. He loves reading books about nature and animals.

**Traducción al Español:**
> *Hoy es una mañana soleada. El cielo está despejado y la calle está tranquila. Carlos camina a la panadería a comprar pan fresco y café caliente. Cerca del parque, ve a un médico caminando hacia el hospital. Carlos toma el autobús rojo hacia la biblioteca. Le encanta leer libros sobre la naturaleza y los animales.*

**Preguntas de Comprensión:**
1. **How is the weather today?**
   - ▫️ It is raining heavily
   - ✅ It is a sunny morning
   - ▫️ It is very cold and windy
   *Explicación:* The passage begins with: 'Today is a sunny morning.'

2. **Where does Carlos go by bus?**
   - ✅ To the library
   - ▫️ To the restaurant
   - ▫️ To the hospital
   *Explicación:* The passage mentions: 'Carlos takes the red bus to the library.'

#### Shopping at the Supermarket (`rdg_a1_003`)
- **Nivel:** A1 • **Semana Asignada:** Semana 11 • **Dificultad:** 2/5
- **Vocabulario Enlazado (10 términos):** `voc_a1_saturday_001`, `voc_a1_sister_001`, `voc_a1_supermarket_001`, `voc_a1_dinner_001`, `voc_a1_apple_001`, `voc_a1_banana_001`, `voc_a1_cheese_001`, `voc_a1_pasta_001`, `voc_a1_cashier_001`, `voc_a1_apartment-flat_001`

**Texto en Inglés:**
> On Saturday, my sister and I visit the supermarket. We need food for dinner. We buy red apples, yellow bananas, and fresh cheese. We also choose pasta and orange juice. The cashier is very polite and friendly. We pay with cash and walk back to our apartment.

**Traducción al Español:**
> *El sábado, mi hermana y yo visitamos el supermercado. Necesitamos comida para la cena. Compramos manzanas rojas, plátanos amarillos y queso fresco. También elegimos pasta y jugo de naranja. El cajero es muy educado y amable. Pagamos con dinero en efectivo y caminamos de regreso a nuestro apartamento.*

**Preguntas de Comprensión:**
1. **Why do they visit the supermarket?**
   - ✅ They need food for dinner
   - ▫️ They want to buy clothes
   - ▫️ To drink hot coffee
   *Explicación:* The text says: 'We need food for dinner.'

2. **Who accompanies the speaker to the supermarket?**
   - ▫️ His father
   - ▫️ His teacher
   - ✅ His sister
   *Explicación:* The text states: 'my sister and I visit the supermarket.'

---

## 📘 Nivel A2 (Elemental · Waystage)

- **Semanas lectivas:** 15 semanas
- **Total vocabulario:** 734 palabras
- **Lecturas integradas:** 3 textos con evaluación

### Semana 1: Compras y devoluciones
Total de palabras en esta semana: **64**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_refund_001` | **refund** | *noun* | — | reembolso | — | — |
| `voc_a2_exchange_002` | **exchange (product)** | *noun* | — | cambio (producto) | — | — |
| `voc_a2_return_003` | **return (product)** | *noun* | — | devolución | — | — |
| `voc_a2_warranty_004` | **warranty** | *noun* | — | garantía | — | — |
| `voc_a2_guarantee_005` | **guarantee** | *noun* | — | garantía (verbo/promesa) | — | — |
| `voc_a2_complaint_006` | **complaint** | *noun* | — | queja | — | — |
| `voc_a2_customer-service_007` | **customer service** | *noun* | — | servicio al cliente | — | — |
| `voc_a2_fitting-room_008` | **fitting room** | *noun* | — | probador | — | — |
| `voc_a2_barcode_009` | **barcode** | *noun* | — | código de barras | — | — |
| `voc_a2_discount-code_010` | **discount code** | *noun* | — | código de descuento | — | — |
| `voc_a2_clearance_011` | **clearance** | *noun* | — | liquidación | — | — |
| `voc_a2_bargain_012` | **bargain** | *noun* | — | ganga | — | — |
| `voc_a2_brand-new_013` | **brand new** | *noun* | — | totalmente nuevo | — | — |
| `voc_a2_secondhand_014` | **secondhand** | *noun* | — | de segunda mano | — | — |
| `voc_a2_quality-control_015` | **quality control** | *noun* | — | control de calidad | — | — |
| `voc_a2_damaged_016` | **damaged** | *adjective* | — | dañado | — | — |
| `voc_a2_broken_017` | **broken (thing)** | *noun* | — | roto | — | — |
| `voc_a2_defective_018` | **defective** | *adjective* | — | defectuoso | — | — |
| `voc_a2_missing-part_019` | **missing part** | *adjective* | — | pieza faltante | — | — |
| `voc_a2_instructions-manual_020` | **instructions manual** | *noun* | — | manual de instrucciones | — | — |
| `voc_a2_assemble_021` | **assemble** | *verb* | — | ensamblar | — | — |
| `voc_a2_gift-receipt_022` | **gift receipt** | *noun* | — | recibo de regalo | — | — |
| `voc_a2_loyalty-card_023` | **loyalty card** | *noun* | — | tarjeta de fidelidad | — | — |
| `voc_a2_membership_024` | **membership** | *noun* | — | membresía | — | — |
| `voc_a2_catalog_025` | **catalog** | *noun* | — | catálogo | — | — |
| `voc_a2_order-online_026` | **order online** | *phrasal-verb* | — | pedir en línea | — | — |
| `voc_a2_shipping_027` | **shipping** | *noun* | — | envío | — | — |
| `voc_a2_delivery_028` | **delivery** | *noun* | — | entrega | — | — |
| `voc_a2_package-parcel_029` | **package / parcel** | *noun* | — | paquete | — | — |
| `voc_a2_tracking-number_030` | **tracking number** | *noun* | — | número de rastreo | — | — |
| `voc_a2_courier_031` | **courier** | *noun* | — | mensajero | — | — |
| `voc_a2_express-delivery_032` | **express delivery** | *noun* | — | envío exprés | — | — |
| `voc_a2_standard-delivery_033` | **standard delivery** | *noun* | — | envío estándar | — | — |
| `voc_a2_out-of-stock_034` | **out of stock** | *adjective* | — | agotado | — | — |
| `voc_a2_in-stock_035` | **in stock** | *noun* | — | en existencia | — | — |
| `voc_a2_available_036` | **available** | *adjective* | — | disponible | — | — |
| `voc_a2_unavailable_037` | **unavailable** | *adjective* | — | no disponible | — | — |
| `voc_a2_color-option_038` | **color option** | *noun* | — | opción de color | — | — |
| `voc_a2_model_039` | **model (product)** | *noun* | — | modelo (producto) | — | — |
| `voc_a2_version_040` | **version** | *noun* | — | versión | — | — |
| `voc_a2_upgrade_041` | **upgrade** | *noun* | — | mejora/actualización | — | — |
| `voc_a2_downgrade_042` | **downgrade** | *noun* | — | reducir (plan/versión) | — | — |
| `voc_a2_subscription_043` | **subscription** | *noun* | — | suscripción | — | — |
| `voc_a2_cancel_044` | **cancel** | *verb* | — | cancelar | — | — |
| `voc_a2_renew_045` | **renew** | *verb* | — | renovar | — | — |
| `voc_a2_invoice_046` | **invoice** | *noun* | — | factura | — | — |
| `voc_a2_payment-method_047` | **payment method** | *noun* | — | método de pago | — | — |
| `voc_a2_installment_048` | **installment** | *noun* | — | cuota/pago a plazos | — | — |
| `voc_a2_negotiate_049` | **negotiate** | *verb* | — | negociar | — | — |
| `voc_a2_haggle_050` | **haggle** | *verb* | — | regatear | — | — |
| `voc_a2_overpriced_051` | **overpriced** | *adjective* | — | sobrevalorado | — | — |
| `voc_a2_affordable_052` | **affordable** | *adjective* | — | asequible | — | — |
| `voc_a2_worth-it_053` | **worth it** | *noun* | — | que vale la pena | — | — |
| `voc_a2_satisfied_054` | **satisfied** | *noun* | — | satisfecho | — | — |
| `voc_a2_dissatisfied_055` | **dissatisfied** | *noun* | — | insatisfecho | — | — |
| `voc_a2_store-credit_056` | **store credit** | *noun* | — | crédito de tienda | — | — |
| `voc_a2_gift-card_057` | **gift card** | *noun* | — | tarjeta de regalo | — | — |
| `voc_a2_coupon_058` | **coupon** | *noun* | — | cupón | — | — |
| `voc_a2_promo-code_059` | **promo code** | *noun* | — | código promocional | — | — |
| `voc_a2_limited-offer_060` | **limited offer** | *adjective* | — | oferta limitada | — | — |
| `voc_a2_best-seller_061` | **best seller** | *noun* | — | más vendido | — | — |
| `voc_a2_customer-review_062` | **customer review** | *adjective* | — | reseña de cliente | — | — |
| `voc_a2_rating_063` | **rating** | *noun* | — | calificación | — | — |
| `voc_a2_feedback_064` | **feedback** | *noun* | — | retroalimentación | — | — |

### Semana 2: Viajes: aeropuerto, hotel y emergencias
Total de palabras en esta semana: **56**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_check-in_065` | **check-in** | *noun* | — | registro de entrada | — | — |
| `voc_a2_check-out_066` | **check-out** | *noun* | — | salida (hotel) | — | — |
| `voc_a2_room-service_067` | **room service** | *noun* | — | servicio a la habitación | — | — |
| `voc_a2_single-room_068` | **single room** | *noun* | — | habitación individual | — | — |
| `voc_a2_double-room_069` | **double room** | *noun* | — | habitación doble | — | — |
| `voc_a2_suite_070` | **suite** | *noun* | — | suite | — | — |
| `voc_a2_lobby_071` | **lobby** | *noun* | — | vestíbulo | — | — |
| `voc_a2_concierge_072` | **concierge** | *noun* | — | conserje | — | — |
| `voc_a2_housekeeping_073` | **housekeeping** | *noun* | — | limpieza (hotel) | — | — |
| `voc_a2_do-not-disturb_074` | **do not disturb** | *phrasal-verb* | — | no molestar | — | — |
| `voc_a2_key-card_075` | **key card** | *noun* | — | tarjeta llave | — | — |
| `voc_a2_wake-up-call_076` | **wake-up call** | *noun* | — | llamada para despertar | — | — |
| `voc_a2_mini-bar_077` | **mini bar** | *noun* | — | minibar | — | — |
| `voc_a2_complimentary_078` | **complimentary** | *noun* | — | gratuito/cortesía | — | — |
| `voc_a2_amenities_079` | **amenities** | *noun* | — | comodidades | — | — |
| `voc_a2_spa_080` | **spa** | *noun* | — | spa | — | — |
| `voc_a2_laundry-service_081` | **laundry service** | *noun* | — | servicio de lavandería | — | — |
| `voc_a2_front-desk_082` | **front desk** | *noun* | — | recepción | — | — |
| `voc_a2_overbooked_083` | **overbooked** | *adjective* | — | con sobreventa | — | — |
| `voc_a2_cancellation_084` | **cancellation** | *noun* | — | cancelación | — | — |
| `voc_a2_non-refundable_085` | **non-refundable** | *adjective* | — | no reembolsable | — | — |
| `voc_a2_itinerary_086` | **itinerary** | *noun* | — | itinerario | — | — |
| `voc_a2_layover_087` | **layover** | *noun* | — | escala | — | — |
| `voc_a2_connecting-flight_088` | **connecting flight** | *noun* | — | vuelo de conexión | — | — |
| `voc_a2_delayed-flight_089` | **delayed flight** | *adjective* | — | vuelo retrasado | — | — |
| `voc_a2_cancelled-flight_090` | **cancelled flight** | *adjective* | — | vuelo cancelado | — | — |
| `voc_a2_boarding-time_091` | **boarding time** | *noun* | — | hora de embarque | — | — |
| `voc_a2_overhead-bin_092` | **overhead bin** | *noun* | — | compartimento superior | — | — |
| `voc_a2_carry-on_093` | **carry-on** | *noun* | — | equipaje de mano | — | — |
| `voc_a2_baggage-claim_094` | **baggage claim** | *noun* | — | reclamo de equipaje | — | — |
| `voc_a2_lost-luggage_095` | **lost luggage** | *noun* | — | equipaje perdido | — | — |
| `voc_a2_customs-declaration_096` | **customs declaration** | *noun* | — | declaración de aduana | — | — |
| `voc_a2_duty-free_097` | **duty-free** | *noun* | — | libre de impuestos | — | — |
| `voc_a2_embassy_098` | **embassy** | *noun* | — | embajada | — | — |
| `voc_a2_consulate_099` | **consulate** | *noun* | — | consulado | — | — |
| `voc_a2_emergency-exit_100` | **emergency exit** | *noun* | — | salida de emergencia | — | — |
| `voc_a2_fire-alarm_101` | **fire alarm** | *noun* | — | alarma de incendio | — | — |
| `voc_a2_first-aid_102` | **first aid** | *noun* | — | primeros auxilios | — | — |
| `voc_a2_evacuation_103` | **evacuation** | *noun* | — | evacuación | — | — |
| `voc_a2_emergency-contact_104` | **emergency contact** | *noun* | — | contacto de emergencia | — | — |
| `voc_a2_insurance-claim_105` | **insurance claim** | *noun* | — | reclamo de seguro | — | — |
| `voc_a2_stolen_106` | **stolen** | *adjective* | — | robado | — | — |
| `voc_a2_robbery_107` | **robbery** | *noun* | — | robo | — | — |
| `voc_a2_pickpocket_108` | **pickpocket** | *noun* | — | carterista | — | — |
| `voc_a2_police-report_109` | **police report** | *noun* | — | reporte policial | — | — |
| `voc_a2_lost-and-found_110` | **lost and found** | *noun* | — | objetos perdidos | — | — |
| `voc_a2_replacement-passport_111` | **replacement passport** | *noun* | — | pasaporte de reemplazo | — | — |
| `voc_a2_travel-advisory_112` | **travel advisory** | *noun* | — | advertencia de viaje | — | — |
| `voc_a2_vaccination-certific_113` | **vaccination certificate** | *noun* | — | certificado de vacunación | — | — |
| `voc_a2_jet-lag_114` | **jet lag** | *noun* | — | descompensación horaria | — | — |
| `voc_a2_time-zone_115` | **time zone** | *noun* | — | zona horaria | — | — |
| `voc_a2_local-currency_116` | **local currency** | *noun* | — | moneda local | — | — |
| `voc_a2_tipping_117` | **tipping** | *noun* | — | dar propina | — | — |
| `voc_a2_guided-tour_118` | **guided tour** | *adjective* | — | tour guiado | — | — |
| `voc_a2_sightseeing_119` | **sightseeing** | *noun* | — | hacer turismo | — | — |
| `voc_a2_landmark_120` | **landmark** | *noun* | — | punto de referencia/monumento | — | — |

### Semana 3: Trabajo y oficina
Total de palabras en esta semana: **61**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_resume-cv_121` | **resume / CV** | *noun* | — | currículum | — | — |
| `voc_a2_cover-letter_122` | **cover letter** | *noun* | — | carta de presentación | — | — |
| `voc_a2_job-interview_123` | **job interview** | *noun* | — | entrevista de trabajo | — | — |
| `voc_a2_job-offer_124` | **job offer** | *noun* | — | oferta de trabajo | — | — |
| `voc_a2_position_125` | **position** | *noun* | — | puesto | — | — |
| `voc_a2_department_126` | **department** | *noun* | — | departamento | — | — |
| `voc_a2_colleague_127` | **colleague** | *noun* | — | colega | — | — |
| `voc_a2_supervisor_128` | **supervisor** | *noun* | — | supervisor | — | — |
| `voc_a2_deadline_129` | **deadline** | *noun* | — | fecha límite | — | — |
| `voc_a2_meeting-room_130` | **meeting room** | *noun* | — | sala de reuniones | — | — |
| `voc_a2_conference-call_131` | **conference call** | *noun* | — | llamada de conferencia | — | — |
| `voc_a2_presentation_132` | **presentation** | *noun* | — | presentación | — | — |
| `voc_a2_agenda_133` | **agenda** | *noun* | — | agenda/orden del día | — | — |
| `voc_a2_minutes_134` | **minutes (meeting)** | *noun* | — | acta (de reunión) | — | — |
| `voc_a2_memo_135` | **memo** | *noun* | — | memorando | — | — |
| `voc_a2_report_136` | **report** | *noun* | — | informe | — | — |
| `voc_a2_spreadsheet_137` | **spreadsheet** | *noun* | — | hoja de cálculo | — | — |
| `voc_a2_attachment_138` | **attachment** | *noun* | — | archivo adjunto | — | — |
| `voc_a2_reply_139` | **reply** | *verb* | — | responder | — | — |
| `voc_a2_forward_140` | **forward (email)** | *phrasal-verb* | — | reenviar | — | — |
| `voc_a2_inbox_141` | **inbox** | *adjective* | — | bandeja de entrada | — | — |
| `voc_a2_out-of-office_142` | **out of office** | *noun* | — | fuera de la oficina | — | — |
| `voc_a2_sick-leave_143` | **sick leave** | *noun* | — | permiso por enfermedad | — | — |
| `voc_a2_vacation-days_144` | **vacation days** | *noun* | — | días de vacaciones | — | — |
| `voc_a2_overtime_145` | **overtime** | *noun* | — | horas extra | — | — |
| `voc_a2_part-time_146` | **part-time** | *noun* | — | medio tiempo | — | — |
| `voc_a2_full-time_147` | **full-time** | *noun* | — | tiempo completo | — | — |
| `voc_a2_remote-work_148` | **remote work** | *noun* | — | trabajo remoto | — | — |
| `voc_a2_freelance_149` | **freelance** | *adjective* | — | trabajo independiente | — | — |
| `voc_a2_promotion_150` | **promotion** | *noun* | — | ascenso | — | — |
| `voc_a2_raise_151` | **raise (salary)** | *noun* | — | aumento de sueldo | — | — |
| `voc_a2_resign_152` | **resign** | *verb* | — | renunciar | — | — |
| `voc_a2_lay-off_153` | **lay off** | *phrasal-verb* | — | despedir (recorte) | — | — |
| `voc_a2_retire_154` | **retire** | *noun* | — | jubilarse | — | — |
| `voc_a2_teamwork_155` | **teamwork** | *noun* | — | trabajo en equipo | — | — |
| `voc_a2_brainstorm_156` | **brainstorm** | *noun* | — | lluvia de ideas | — | — |
| `voc_a2_performance-review_157` | **performance review** | *noun* | — | evaluación de desempeño | — | — |
| `voc_a2_workload_158` | **workload** | *noun* | — | carga de trabajo | — | — |
| `voc_a2_multitask_159` | **multitask** | *noun* | — | hacer varias cosas a la vez | — | — |
| `voc_a2_prioritize_160` | **prioritize** | *verb* | — | priorizar | — | — |
| `voc_a2_negotiation_161` | **negotiation** | *noun* | — | negociación | — | — |
| `voc_a2_client_162` | **client** | *noun* | — | cliente (negocio) | — | — |
| `voc_a2_stakeholder_163` | **stakeholder** | *noun* | — | parte interesada | — | — |
| `voc_a2_quarterly_164` | **quarterly** | *adverb* | — | trimestral | — | — |
| `voc_a2_annual_165` | **annual** | *noun* | — | anual | — | — |
| `voc_a2_target_166` | **target (goal)** | *noun* | — | meta | — | — |
| `voc_a2_achieve_167` | **achieve** | *verb* | — | lograr | — | — |
| `voc_a2_accomplish_168` | **accomplish** | *verb* | — | cumplir/lograr | — | — |
| `voc_a2_project-manager_169` | **project manager** | *noun* | — | gerente de proyecto | — | — |
| `voc_a2_human-resources_170` | **human resources** | *noun* | — | recursos humanos | — | — |
| `voc_a2_headquarters_171` | **headquarters** | *noun* | — | sede central | — | — |
| `voc_a2_branch-office_172` | **branch office** | *noun* | — | sucursal | — | — |
| `voc_a2_shift_173` | **shift (work)** | *noun* | — | turno | — | — |
| `voc_a2_commute_174` | **commute** | *noun* | — | desplazarse al trabajo | — | — |
| `voc_a2_paperwork_175` | **paperwork** | *noun* | — | papeleo | — | — |
| `voc_a2_signature_176` | **signature** | *noun* | — | firma | — | — |
| `voc_a2_approval_177` | **approval** | *noun* | — | aprobación | — | — |
| `voc_a2_policy_178` | **policy (company)** | *noun* | — | política (empresa) | — | — |
| `voc_a2_training_179` | **training** | *noun* | — | capacitación | — | — |
| `voc_a2_onboarding_180` | **onboarding** | *noun* | — | proceso de incorporación | — | — |
| `voc_a2_networking-event_181` | **networking event** | *noun* | — | evento de networking | — | — |

### Semana 4: Salud y cuerpo (síntomas y citas médicas)
Total de palabras en esta semana: **59**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_symptom_182` | **symptom** | *noun* | — | síntoma | — | — |
| `voc_a2_diagnosis_183` | **diagnosis** | *noun* | — | diagnóstico | — | — |
| `voc_a2_prescription_184` | **prescription** | *noun* | — | receta médica | — | — |
| `voc_a2_dosage_185` | **dosage** | *noun* | — | dosis | — | — |
| `voc_a2_side-effect_186` | **side effect** | *noun* | — | efecto secundario | — | — |
| `voc_a2_allergy_187` | **allergy** | *noun* | — | alergia | — | — |
| `voc_a2_allergic-reaction_188` | **allergic reaction** | *noun* | — | reacción alérgica | — | — |
| `voc_a2_infection_189` | **infection** | *noun* | — | infección | — | — |
| `voc_a2_inflammation_190` | **inflammation** | *noun* | — | inflamación | — | — |
| `voc_a2_rash_191` | **rash** | *noun* | — | sarpullido | — | — |
| `voc_a2_swelling_192` | **swelling** | *noun* | — | hinchazón | — | — |
| `voc_a2_bruise_193` | **bruise** | *noun* | — | moretón | — | — |
| `voc_a2_wound_194` | **wound** | *noun* | — | herida | — | — |
| `voc_a2_stitches_195` | **stitches** | *noun* | — | puntos de sutura | — | — |
| `voc_a2_cast_196` | **cast (medical)** | *noun* | — | yeso | — | — |
| `voc_a2_crutches_197` | **crutches** | *noun* | — | muletas | — | — |
| `voc_a2_wheelchair_198` | **wheelchair** | *noun* | — | silla de ruedas | — | — |
| `voc_a2_blood-pressure_199` | **blood pressure** | *noun* | — | presión arterial | — | — |
| `voc_a2_heart-rate_200` | **heart rate** | *noun* | — | ritmo cardíaco | — | — |
| `voc_a2_pulse_201` | **pulse** | *noun* | — | pulso | — | — |
| `voc_a2_x-ray_202` | **x-ray** | *noun* | — | radiografía | — | — |
| `voc_a2_surgery-operation_203` | **surgery / operation** | *noun* | — | cirugía | — | — |
| `voc_a2_anesthesia_204` | **anesthesia** | *noun* | — | anestesia | — | — |
| `voc_a2_recovery_205` | **recovery** | *noun* | — | recuperación | — | — |
| `voc_a2_checkup_206` | **checkup** | *noun* | — | chequeo médico | — | — |
| `voc_a2_specialist_207` | **specialist** | *noun* | — | especialista | — | — |
| `voc_a2_physical-therapy_208` | **physical therapy** | *noun* | — | fisioterapia | — | — |
| `voc_a2_mental-health_209` | **mental health** | *noun* | — | salud mental | — | — |
| `voc_a2_anxiety_210` | **anxiety** | *noun* | — | ansiedad | — | — |
| `voc_a2_depression_211` | **depression** | *noun* | — | depresión | — | — |
| `voc_a2_sleep-disorder_212` | **sleep disorder** | *noun* | — | trastorno del sueño | — | — |
| `voc_a2_chronic_213` | **chronic** | *adjective* | — | crónico | — | — |
| `voc_a2_acute_214` | **acute** | *adjective* | — | agudo | — | — |
| `voc_a2_contagious_215` | **contagious** | *adjective* | — | contagioso | — | — |
| `voc_a2_immune-system_216` | **immune system** | *noun* | — | sistema inmunológico | — | — |
| `voc_a2_lungs_217` | **lungs** | *noun* | — | pulmones | — | — |
| `voc_a2_liver_218` | **liver** | *noun* | — | hígado | — | — |
| `voc_a2_kidney_219` | **kidney** | *noun* | — | riñón | — | — |
| `voc_a2_intestine_220` | **intestine** | *noun* | — | intestino | — | — |
| `voc_a2_joint_221` | **joint** | *noun* | — | articulación | — | — |
| `voc_a2_spine_222` | **spine** | *noun* | — | columna vertebral | — | — |
| `voc_a2_artery_223` | **artery** | *noun* | — | arteria | — | — |
| `voc_a2_vein_224` | **vein** | *noun* | — | vena | — | — |
| `voc_a2_nervous-system_225` | **nervous system** | *noun* | — | sistema nervioso | — | — |
| `voc_a2_digestive-system_226` | **digestive system** | *noun* | — | sistema digestivo | — | — |
| `voc_a2_hormone_227` | **hormone** | *noun* | — | hormona | — | — |
| `voc_a2_metabolism_228` | **metabolism** | *noun* | — | metabolismo | — | — |
| `voc_a2_nutrient_229` | **nutrient** | *noun* | — | nutriente | — | — |
| `voc_a2_vitamin_230` | **vitamin** | *noun* | — | vitamina | — | — |
| `voc_a2_protein_231` | **protein** | *noun* | — | proteína | — | — |
| `voc_a2_carbohydrate_232` | **carbohydrate** | *noun* | — | carbohidrato | — | — |
| `voc_a2_fiber_233` | **fiber** | *noun* | — | fibra | — | — |
| `voc_a2_calorie_234` | **calorie** | *noun* | — | caloría | — | — |
| `voc_a2_overweight_235` | **overweight** | *adjective* | — | sobrepeso | — | — |
| `voc_a2_underweight_236` | **underweight** | *adjective* | — | bajo peso | — | — |
| `voc_a2_obesity_237` | **obesity** | *noun* | — | obesidad | — | — |
| `voc_a2_wellness_238` | **wellness** | *noun* | — | bienestar | — | — |
| `voc_a2_hygiene_239` | **hygiene** | *noun* | — | higiene | — | — |
| `voc_a2_first-aid-kit_240` | **first aid kit** | *noun* | — | botiquín de primeros auxilios | — | — |

### Semana 5: Conectores narrativos para contar historias
Total de palabras en esta semana: **48**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_once-upon-a-time_241` | **once upon a time** | *conjunction* | — | érase una vez | — | — |
| `voc_a2_meanwhile_242` | **meanwhile** | *adverb* | — | mientras tanto | — | — |
| `voc_a2_afterward_243` | **afterward** | *adverb* | — | después/luego | — | — |
| `voc_a2_eventually_244` | **eventually** | *adverb* | — | finalmente/con el tiempo | — | — |
| `voc_a2_in-the-end_245` | **in the end** | *conjunction* | — | al final | — | — |
| `voc_a2_at-first_246` | **at first** | *conjunction* | — | al principio | — | — |
| `voc_a2_later-on_247` | **later on** | *conjunction* | — | más adelante | — | — |
| `voc_a2_as-soon-as_248` | **as soon as** | *conjunction* | — | tan pronto como | — | — |
| `voc_a2_by-the-time_249` | **by the time** | *conjunction* | — | para cuando | — | — |
| `voc_a2_used-to_250` | **used to** | *conjunction* | — | solía | — | — |
| `voc_a2_previously_251` | **previously** | *adverb* | — | previamente | — | — |
| `voc_a2_formerly_252` | **formerly** | *adverb* | — | anteriormente | — | — |
| `voc_a2_ever-since_253` | **ever since** | *adverb* | — | desde entonces | — | — |
| `voc_a2_from-then-on_254` | **from then on** | *conjunction* | — | desde ese momento | — | — |
| `voc_a2_at-that-moment_255` | **at that moment** | *conjunction* | — | en ese momento | — | — |
| `voc_a2_right-after_256` | **right after** | *conjunction* | — | justo después | — | — |
| `voc_a2_shortly-after_257` | **shortly after** | *conjunction* | — | poco después | — | — |
| `voc_a2_in-the-meantime_258` | **in the meantime** | *conjunction* | — | mientras tanto | — | — |
| `voc_a2_all-of-a-sudden_259` | **all of a sudden** | *conjunction* | — | de repente | — | — |
| `voc_a2_little-by-little_260` | **little by little** | *conjunction* | — | poco a poco | — | — |
| `voc_a2_one-day_261` | **one day** | *conjunction* | — | un día | — | — |
| `voc_a2_years-ago_262` | **years ago** | *conjunction* | — | hace años | — | — |
| `voc_a2_back-then_263` | **back then** | *conjunction* | — | en aquel entonces | — | — |
| `voc_a2_during-that-time_264` | **during that time** | *conjunction* | — | durante ese tiempo | — | — |
| `voc_a2_at-the-same-time_265` | **at the same time** | *conjunction* | — | al mismo tiempo | — | — |
| `voc_a2_in-those-days_266` | **in those days** | *conjunction* | — | en aquellos días | — | — |
| `voc_a2_as-a-result_267` | **as a result** | *conjunction* | — | como resultado | — | — |
| `voc_a2_consequently_268` | **consequently** | *conjunction* | — | en consecuencia | — | — |
| `voc_a2_thus_269` | **thus** | *conjunction* | — | así/por lo tanto | — | — |
| `voc_a2_for-this-reason_270` | **for this reason** | *conjunction* | — | por esta razón | — | — |
| `voc_a2_due-to_271` | **due to** | *conjunction* | — | debido a | — | — |
| `voc_a2_because-of_272` | **because of** | *conjunction* | — | a causa de | — | — |
| `voc_a2_thats-why_273` | **that's why** | *conjunction* | — | por eso | — | — |
| `voc_a2_in-contrast_274` | **in contrast** | *conjunction* | — | en contraste | — | — |
| `voc_a2_instead_275` | **instead** | *conjunction* | — | en cambio | — | — |
| `voc_a2_nevertheless_276` | **nevertheless** | *conjunction* | — | sin embargo/no obstante | — | — |
| `voc_a2_nonetheless_277` | **nonetheless** | *conjunction* | — | no obstante | — | — |
| `voc_a2_moreover_278` | **moreover** | *conjunction* | — | además | — | — |
| `voc_a2_furthermore_279` | **furthermore** | *conjunction* | — | además/asimismo | — | — |
| `voc_a2_in-addition_280` | **in addition** | *conjunction* | — | adicionalmente | — | — |
| `voc_a2_besides_281` | **besides** | *conjunction* | — | además | — | — |
| `voc_a2_apart-from_282` | **apart from** | *conjunction* | — | aparte de | — | — |
| `voc_a2_in-conclusion_283` | **in conclusion** | *conjunction* | — | en conclusión | — | — |
| `voc_a2_to-sum-up_284` | **to sum up** | *conjunction* | — | en resumen | — | — |
| `voc_a2_overall_285` | **overall** | *conjunction* | — | en general | — | — |
| `voc_a2_in-general_286` | **in general** | *conjunction* | — | en general | — | — |
| `voc_a2_such-as_287` | **such as** | *conjunction* | — | tal como | — | — |
| `voc_a2_in-particular_288` | **in particular** | *conjunction* | — | en particular | — | — |

### Semana 6: Expresar opiniones
Total de palabras en esta semana: **44**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_in-my-opinion_289` | **in my opinion** | *noun* | — | en mi opinión | — | — |
| `voc_a2_i-believe-that_290` | **I believe that** | *noun* | — | creo que | — | — |
| `voc_a2_i-feel-that_291` | **I feel that** | *noun* | — | siento que | — | — |
| `voc_a2_personally_292` | **personally** | *adverb* | — | personalmente | — | — |
| `voc_a2_from-my-point-of-vie_293` | **from my point of view** | *noun* | — | desde mi punto de vista | — | — |
| `voc_a2_i-agree_294` | **I agree** | *noun* | — | estoy de acuerdo | — | — |
| `voc_a2_i-disagree_295` | **I disagree** | *noun* | — | no estoy de acuerdo | — | — |
| `voc_a2_im-not-sure_296` | **I'm not sure** | *noun* | — | no estoy seguro | — | — |
| `voc_a2_it-seems-to-me_297` | **it seems to me** | *noun* | — | me parece que | — | — |
| `voc_a2_as-far-as-i-know_298` | **as far as I know** | *noun* | — | que yo sepa | — | — |
| `voc_a2_i-suppose_299` | **I suppose** | *noun* | — | supongo | — | — |
| `voc_a2_i-guess_300` | **I guess (opinion)** | *noun* | — | supongo/creo | — | — |
| `voc_a2_to-be-honest_301` | **to be honest** | *noun* | — | para ser honesto | — | — |
| `voc_a2_in-fact_302` | **in fact** | *noun* | — | de hecho | — | — |
| `voc_a2_definitely_303` | **definitely** | *adverb* | — | definitivamente | — | — |
| `voc_a2_absolutely_304` | **absolutely** | *adverb* | — | absolutamente | — | — |
| `voc_a2_of-course_305` | **of course** | *noun* | — | por supuesto | — | — |
| `voc_a2_no-way_306` | **no way** | *noun* | — | de ninguna manera | — | — |
| `voc_a2_thats-true_307` | **that's true** | *noun* | — | eso es cierto | — | — |
| `voc_a2_thats-not-true_308` | **that's not true** | *noun* | — | eso no es cierto | — | — |
| `voc_a2_i-doubt-it_309` | **I doubt it** | *noun* | — | lo dudo | — | — |
| `voc_a2_it-depends_310` | **it depends** | *noun* | — | depende | — | — |
| `voc_a2_on-one-hand_311` | **on one hand** | *noun* | — | por un lado | — | — |
| `voc_a2_on-the-other-hand_312` | **on the other hand** | *noun* | — | por otro lado | — | — |
| `voc_a2_its-obvious_313` | **it's obvious** | *noun* | — | es obvio | — | — |
| `voc_a2_clearly_314` | **clearly** | *adverb* | — | claramente | — | — |
| `voc_a2_apparently_315` | **apparently** | *adverb* | — | aparentemente | — | — |
| `voc_a2_allegedly_316` | **allegedly** | *adverb* | — | supuestamente | — | — |
| `voc_a2_presumably_317` | **presumably** | *adverb* | — | presumiblemente | — | — |
| `voc_a2_undoubtedly_318` | **undoubtedly** | *adverb* | — | sin duda | — | — |
| `voc_a2_arguably_319` | **arguably** | *adverb* | — | posiblemente/se podría decir | — | — |
| `voc_a2_in-my-experience_320` | **in my experience** | *noun* | — | en mi experiencia | — | — |
| `voc_a2_based-on_321` | **based on** | *noun* | — | basado en | — | — |
| `voc_a2_according-to_322` | **according to** | *noun* | — | según | — | — |
| `voc_a2_evidence_323` | **evidence** | *noun* | — | evidencia | — | — |
| `voc_a2_argument_324` | **argument** | *noun* | — | argumento | — | — |
| `voc_a2_viewpoint-standpoint_325` | **viewpoint / standpoint** | *noun* | — | punto de vista | — | — |
| `voc_a2_counterargument_326` | **counterargument** | *noun* | — | contraargumento | — | — |
| `voc_a2_valid-point_327` | **valid point** | *noun* | — | punto válido | — | — |
| `voc_a2_convince_328` | **convince** | *verb* | — | convencer | — | — |
| `voc_a2_persuade_329` | **persuade** | *verb* | — | persuadir | — | — |
| `voc_a2_debate_330` | **debate** | *verb* | — | debate | — | — |
| `voc_a2_controversy_331` | **controversy** | *noun* | — | controversia | — | — |
| `voc_a2_agree-to-disagree_332` | **agree to disagree** | *noun* | — | acordar estar en desacuerdo | — | — |

### Semana 7: Clima y desastres naturales
Total de palabras en esta semana: **34**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_heatwave_333` | **heatwave** | *noun* | — | ola de calor | — | — |
| `voc_a2_wildfire_334` | **wildfire** | *noun* | — | incendio forestal | — | — |
| `voc_a2_hurricane_335` | **hurricane** | *noun* | — | huracán | — | — |
| `voc_a2_tornado_336` | **tornado** | *adjective* | — | tornado | — | — |
| `voc_a2_tsunami_337` | **tsunami** | *noun* | — | tsunami | — | — |
| `voc_a2_avalanche_338` | **avalanche** | *noun* | — | avalancha | — | — |
| `voc_a2_landslide_339` | **landslide** | *noun* | — | deslizamiento de tierra | — | — |
| `voc_a2_blizzard_340` | **blizzard** | *noun* | — | ventisca | — | — |
| `voc_a2_hailstorm_341` | **hailstorm** | *adjective* | — | granizada | — | — |
| `voc_a2_thunderstorm_342` | **thunderstorm** | *noun* | — | tormenta eléctrica | — | — |
| `voc_a2_temperature-drop_343` | **temperature drop** | *noun* | — | descenso de temperatura | — | — |
| `voc_a2_climate-change_344` | **climate change** | *noun* | — | cambio climático | — | — |
| `voc_a2_global-warming_345` | **global warming** | *noun* | — | calentamiento global | — | — |
| `voc_a2_greenhouse-effect_346` | **greenhouse effect** | *noun* | — | efecto invernadero | — | — |
| `voc_a2_carbon-footprint_347` | **carbon footprint** | *noun* | — | huella de carbono | — | — |
| `voc_a2_renewable-energy_348` | **renewable energy** | *adjective* | — | energía renovable | — | — |
| `voc_a2_deforestation_349` | **deforestation** | *noun* | — | deforestación | — | — |
| `voc_a2_extinction_350` | **extinction** | *noun* | — | extinción | — | — |
| `voc_a2_endangered-species_351` | **endangered species** | *noun* | — | especie en peligro | — | — |
| `voc_a2_natural-disaster_352` | **natural disaster** | *noun* | — | desastre natural | — | — |
| `voc_a2_shelter_353` | **shelter (emergency)** | *noun* | — | refugio | — | — |
| `voc_a2_relief-effort_354` | **relief effort** | *noun* | — | esfuerzo de ayuda | — | — |
| `voc_a2_damage_355` | **damage** | *noun* | — | daño | — | — |
| `voc_a2_destruction_356` | **destruction** | *noun* | — | destrucción | — | — |
| `voc_a2_rebuild_357` | **rebuild** | *verb* | — | reconstruir | — | — |
| `voc_a2_warning-system_358` | **warning system** | *noun* | — | sistema de alerta | — | — |
| `voc_a2_meteorologist_359` | **meteorologist** | *noun* | — | meteorólogo | — | — |
| `voc_a2_atmosphere_360` | **atmosphere** | *noun* | — | atmósfera | — | — |
| `voc_a2_ozone-layer_361` | **ozone layer** | *noun* | — | capa de ozono | — | — |
| `voc_a2_ecosystem_362` | **ecosystem** | *noun* | — | ecosistema | — | — |
| `voc_a2_biodiversity_363` | **biodiversity** | *noun* | — | biodiversidad | — | — |
| `voc_a2_sustainability_364` | **sustainability** | *noun* | — | sostenibilidad | — | — |
| `voc_a2_emission_365` | **emission** | *noun* | — | emisión | — | — |
| `voc_a2_fossil-fuel_366` | **fossil fuel** | *noun* | — | combustible fósil | — | — |

### Semana 8: Educación y estudios superiores
Total de palabras en esta semana: **46**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_enroll_367` | **enroll** | *noun* | — | inscribirse | — | — |
| `voc_a2_tuition_368` | **tuition** | *noun* | — | matrícula (costo) | — | — |
| `voc_a2_scholarship_369` | **scholarship** | *noun* | — | beca | — | — |
| `voc_a2_semester_370` | **semester** | *noun* | — | semestre | — | — |
| `voc_a2_syllabus_371` | **syllabus** | *noun* | — | programa del curso | — | — |
| `voc_a2_lecture_372` | **lecture** | *noun* | — | clase magistral | — | — |
| `voc_a2_seminar_373` | **seminar** | *noun* | — | seminario | — | — |
| `voc_a2_thesis_374` | **thesis** | *noun* | — | tesis | — | — |
| `voc_a2_dissertation_375` | **dissertation** | *noun* | — | tesis doctoral | — | — |
| `voc_a2_major_376` | **major (field of study)** | *noun* | — | carrera principal | — | — |
| `voc_a2_minor_377` | **minor (field of study)** | *noun* | — | especialización secundaria | — | — |
| `voc_a2_gpa_378` | **GPA** | *noun* | — | promedio académico | — | — |
| `voc_a2_transcript_379` | **transcript** | *noun* | — | historial académico | — | — |
| `voc_a2_diploma_380` | **diploma** | *noun* | — | diploma | — | — |
| `voc_a2_certificate_381` | **certificate** | *adjective* | — | certificado | — | — |
| `voc_a2_campus_382` | **campus** | *noun* | — | campus | — | — |
| `voc_a2_dormitory_383` | **dormitory** | *noun* | — | residencia estudiantil | — | — |
| `voc_a2_faculty_384` | **faculty** | *adjective* | — | facultad/cuerpo docente | — | — |
| `voc_a2_professor_385` | **professor** | *noun* | — | profesor universitario | — | — |
| `voc_a2_academic-advisor_386` | **academic advisor** | *noun* | — | asesor académico | — | — |
| `voc_a2_plagiarism_387` | **plagiarism** | *noun* | — | plagio | — | — |
| `voc_a2_assignment_388` | **assignment** | *noun* | — | tarea/trabajo | — | — |
| `voc_a2_essay_389` | **essay** | *noun* | — | ensayo | — | — |
| `voc_a2_research-paper_390` | **research paper** | *noun* | — | trabajo de investigación | — | — |
| `voc_a2_citation_391` | **citation** | *noun* | — | cita bibliográfica | — | — |
| `voc_a2_bibliography_392` | **bibliography** | *noun* | — | bibliografía | — | — |
| `voc_a2_peer-review_393` | **peer review** | *noun* | — | revisión por pares | — | — |
| `voc_a2_graduate_394` | **graduate** | *adjective* | — | graduado | — | — |
| `voc_a2_undergraduate_395` | **undergraduate** | *adjective* | — | estudiante de pregrado | — | — |
| `voc_a2_postgraduate_396` | **postgraduate** | *adjective* | — | posgrado | — | — |
| `voc_a2_internship_397` | **internship** | *noun* | — | pasantía | — | — |
| `voc_a2_apprenticeship_398` | **apprenticeship** | *noun* | — | aprendizaje (oficio) | — | — |
| `voc_a2_vocational-training_399` | **vocational training** | *noun* | — | formación profesional | — | — |
| `voc_a2_distance-learning_400` | **distance learning** | *noun* | — | educación a distancia | — | — |
| `voc_a2_online-course_401` | **online course** | *noun* | — | curso en línea | — | — |
| `voc_a2_tutor_402` | **tutor** | *noun* | — | tutor | — | — |
| `voc_a2_mentor_403` | **mentor** | *noun* | — | mentor | — | — |
| `voc_a2_extracurricular_404` | **extracurricular** | *verb* | — | extracurricular | — | — |
| `voc_a2_student-loan_405` | **student loan** | *noun* | — | préstamo estudiantil | — | — |
| `voc_a2_financial-aid_406` | **financial aid** | *noun* | — | ayuda financiera | — | — |
| `voc_a2_dropout_407` | **dropout** | *verb* | — | abandono escolar | — | — |
| `voc_a2_literacy_408` | **literacy** | *noun* | — | alfabetización | — | — |
| `voc_a2_curriculum_409` | **curriculum** | *noun* | — | plan de estudios | — | — |
| `voc_a2_elective_410` | **elective** | *adjective* | — | materia electiva | — | — |
| `voc_a2_credit-hour_411` | **credit hour** | *noun* | — | hora crédito | — | — |
| `voc_a2_exam-period_412` | **exam period** | *noun* | — | periodo de exámenes | — | — |

### Semana 9: Relaciones y emociones complejas
Total de palabras en esta semana: **44**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_trust-issues_413` | **trust issues** | *noun* | — | problemas de confianza | — | — |
| `voc_a2_commitment_414` | **commitment** | *noun* | — | compromiso | — | — |
| `voc_a2_breakup_415` | **breakup** | *noun* | — | ruptura | — | — |
| `voc_a2_reconciliation_416` | **reconciliation** | *noun* | — | reconciliación | — | — |
| `voc_a2_betrayal_417` | **betrayal** | *noun* | — | traición | — | — |
| `voc_a2_forgiveness_418` | **forgiveness** | *noun* | — | perdón | — | — |
| `voc_a2_empathy_419` | **empathy** | *noun* | — | empatía | — | — |
| `voc_a2_sympathy_420` | **sympathy** | *noun* | — | compasión/comprensión | — | — |
| `voc_a2_compassion_421` | **compassion** | *noun* | — | compasión | — | — |
| `voc_a2_resentment_422` | **resentment** | *noun* | — | resentimiento | — | — |
| `voc_a2_heartbreak_423` | **heartbreak** | *noun* | — | desamor | — | — |
| `voc_a2_infatuation_424` | **infatuation** | *noun* | — | enamoramiento pasajero | — | — |
| `voc_a2_attraction_425` | **attraction** | *noun* | — | atracción | — | — |
| `voc_a2_compatibility_426` | **compatibility** | *noun* | — | compatibilidad | — | — |
| `voc_a2_conflict-resolution_427` | **conflict resolution** | *noun* | — | resolución de conflictos | — | — |
| `voc_a2_compromise_428` | **compromise** | *noun* | — | compromiso/acuerdo | — | — |
| `voc_a2_mutual-respect_429` | **mutual respect** | *noun* | — | respeto mutuo | — | — |
| `voc_a2_boundaries_430` | **boundaries** | *noun* | — | límites (emocionales) | — | — |
| `voc_a2_codependency_431` | **codependency** | *noun* | — | codependencia | — | — |
| `voc_a2_long-distance-relati_432` | **long-distance relationship** | *noun* | — | relación a distancia | — | — |
| `voc_a2_soulmate_433` | **soulmate** | *noun* | — | alma gemela | — | — |
| `voc_a2_companionship_434` | **companionship** | *noun* | — | compañerismo | — | — |
| `voc_a2_intimacy_435` | **intimacy** | *noun* | — | intimidad | — | — |
| `voc_a2_vulnerability_436` | **vulnerability** | *noun* | — | vulnerabilidad | — | — |
| `voc_a2_self-esteem_437` | **self-esteem** | *noun* | — | autoestima | — | — |
| `voc_a2_self-doubt_438` | **self-doubt** | *noun* | — | inseguridad/duda de uno mismo | — | — |
| `voc_a2_insecurity_439` | **insecurity** | *noun* | — | inseguridad | — | — |
| `voc_a2_overwhelmed_440` | **overwhelmed** | *adjective* | — | abrumado | — | — |
| `voc_a2_burnout_441` | **burnout** | *noun* | — | agotamiento (laboral/emocional) | — | — |
| `voc_a2_frustration_442` | **frustration** | *noun* | — | frustración | — | — |
| `voc_a2_irritation_443` | **irritation** | *noun* | — | irritación | — | — |
| `voc_a2_resentful_444` | **resentful** | *noun* | — | resentido | — | — |
| `voc_a2_heartfelt_445` | **heartfelt** | *noun* | — | sincero/de corazón | — | — |
| `voc_a2_overjoyed_446` | **overjoyed** | *noun* | — | muy feliz | — | — |
| `voc_a2_devastated_447` | **devastated** | *adjective* | — | devastado | — | — |
| `voc_a2_humiliated_448` | **humiliated** | *adjective* | — | humillado | — | — |
| `voc_a2_ashamed_449` | **ashamed** | *adjective* | — | avergonzado | — | — |
| `voc_a2_guilty_450` | **guilty** | *adjective* | — | culpable | — | — |
| `voc_a2_remorse_451` | **remorse** | *noun* | — | remordimiento | — | — |
| `voc_a2_regret_452` | **regret** | *noun* | — | arrepentimiento | — | — |
| `voc_a2_longing_453` | **longing** | *noun* | — | anhelo | — | — |
| `voc_a2_nostalgia_454` | **nostalgia** | *noun* | — | nostalgia | — | — |
| `voc_a2_contentment_455` | **contentment** | *noun* | — | satisfacción/contento | — | — |
| `voc_a2_fulfillment_456` | **fulfillment** | *noun* | — | realización personal | — | — |

### Semana 10: Tecnología intermedia: redes y seguridad
Total de palabras en esta semana: **39**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_firewall_457` | **firewall** | *noun* | — | cortafuegos | — | — |
| `voc_a2_antivirus_458` | **antivirus** | *noun* | — | antivirus | — | — |
| `voc_a2_malware_459` | **malware** | *noun* | — | malware | — | — |
| `voc_a2_phishing_460` | **phishing** | *noun* | — | phishing (fraude en línea) | — | — |
| `voc_a2_hacker_461` | **hacker** | *verb* | — | hacker | — | — |
| `voc_a2_cybersecurity_462` | **cybersecurity** | *noun* | — | ciberseguridad | — | — |
| `voc_a2_encryption_463` | **encryption** | *adjective* | — | cifrado | — | — |
| `voc_a2_two-factor-authentic_464` | **two-factor authentication** | *noun* | — | autenticación de dos factores | — | — |
| `voc_a2_backup_465` | **backup** | *noun* | — | copia de seguridad | — | — |
| `voc_a2_cloud-storage_466` | **cloud storage** | *noun* | — | almacenamiento en la nube | — | — |
| `voc_a2_server_467` | **server** | *noun* | — | servidor | — | — |
| `voc_a2_database_468` | **database** | *noun* | — | base de datos | — | — |
| `voc_a2_browser_469` | **browser** | *noun* | — | navegador | — | — |
| `voc_a2_cookie_470` | **cookie (internet)** | *noun* | — | cookie (internet) | — | — |
| `voc_a2_cache_471` | **cache** | *noun* | — | caché | — | — |
| `voc_a2_bandwidth_472` | **bandwidth** | *noun* | — | ancho de banda | — | — |
| `voc_a2_router_473` | **router** | *verb* | — | router | — | — |
| `voc_a2_bluetooth_474` | **bluetooth** | *noun* | — | bluetooth | — | — |
| `voc_a2_hotspot_475` | **hotspot** | *noun* | — | punto de acceso | — | — |
| `voc_a2_streaming_476` | **streaming** | *noun* | — | transmisión en línea | — | — |
| `voc_a2_notification_477` | **notification** | *noun* | — | notificación | — | — |
| `voc_a2_settings_478` | **settings** | *noun* | — | configuración | — | — |
| `voc_a2_factory-reset_479` | **factory reset** | *noun* | — | restablecer de fábrica | — | — |
| `voc_a2_screenshot_480` | **screenshot** | *noun* | — | captura de pantalla | — | — |
| `voc_a2_hashtag_481` | **hashtag** | *noun* | — | hashtag | — | — |
| `voc_a2_algorithm_482` | **algorithm** | *noun* | — | algoritmo | — | — |
| `voc_a2_artificial-intellige_483` | **artificial intelligence** | *noun* | — | inteligencia artificial | — | — |
| `voc_a2_virtual-reality_484` | **virtual reality** | *noun* | — | realidad virtual | — | — |
| `voc_a2_augmented-reality_485` | **augmented reality** | *adjective* | — | realidad aumentada | — | — |
| `voc_a2_e-commerce_486` | **e-commerce** | *noun* | — | comercio electrónico | — | — |
| `voc_a2_online-banking_487` | **online banking** | *noun* | — | banca en línea | — | — |
| `voc_a2_digital-signature_488` | **digital signature** | *noun* | — | firma digital | — | — |
| `voc_a2_biometric_489` | **biometric** | *noun* | — | biométrico | — | — |
| `voc_a2_fingerprint-scanner_490` | **fingerprint scanner** | *noun* | — | lector de huellas | — | — |
| `voc_a2_facial-recognition_491` | **facial recognition** | *noun* | — | reconocimiento facial | — | — |
| `voc_a2_smart-home_492` | **smart home** | *adjective* | — | hogar inteligente | — | — |
| `voc_a2_wearable-device_493` | **wearable device** | *noun* | — | dispositivo portátil | — | — |
| `voc_a2_drone_494` | **drone** | *noun* | — | dron | — | — |
| `voc_a2_d-printing_495` | **3D printing** | *noun* | — | impresión 3D | — | — |

### Semana 11: Cocina y recetas
Total de palabras en esta semana: **59**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_recipe_496` | **recipe** | *noun* | — | receta | — | — |
| `voc_a2_ingredient_497` | **ingredient** | *adjective* | — | ingrediente | — | — |
| `voc_a2_chop_498` | **chop** | *verb* | — | picar | — | — |
| `voc_a2_slice_499` | **slice** | *verb* | — | cortar en rodajas | — | — |
| `voc_a2_grate_500` | **grate** | *verb* | — | rallar | — | — |
| `voc_a2_peel_501` | **peel** | *verb* | — | pelar | — | — |
| `voc_a2_whisk_502` | **whisk** | *verb* | — | batir | — | — |
| `voc_a2_stir_503` | **stir** | *verb* | — | revolver | — | — |
| `voc_a2_boil_504` | **boil** | *verb* | — | hervir | — | — |
| `voc_a2_simmer_505` | **simmer** | *verb* | — | cocinar a fuego lento | — | — |
| `voc_a2_roast_506` | **roast** | *verb* | — | asar (horno) | — | — |
| `voc_a2_grill_507` | **grill** | *verb* | — | asar a la parrilla | — | — |
| `voc_a2_bake_508` | **bake** | *verb* | — | hornear | — | — |
| `voc_a2_fry_509` | **fry** | *verb* | — | freír | — | — |
| `voc_a2_steam_510` | **steam** | *verb* | — | cocinar al vapor | — | — |
| `voc_a2_marinate_511` | **marinate** | *verb* | — | marinar | — | — |
| `voc_a2_garnish_512` | **garnish** | *verb* | — | decorar (plato) | — | — |
| `voc_a2_portion_513` | **portion** | *noun* | — | porción | — | — |
| `voc_a2_serving_514` | **serving** | *noun* | — | porción/ración | — | — |
| `voc_a2_leftovers_515` | **leftovers** | *noun* | — | sobras | — | — |
| `voc_a2_preheat_516` | **preheat** | *verb* | — | precalentar | — | — |
| `voc_a2_blend_517` | **blend** | *verb* | — | licuar | — | — |
| `voc_a2_mash_518` | **mash** | *verb* | — | triturar/hacer puré | — | — |
| `voc_a2_dice_519` | **dice** | *verb* | — | cortar en cubos | — | — |
| `voc_a2_sprinkle_520` | **sprinkle** | *verb* | — | espolvorear | — | — |
| `voc_a2_drizzle_521` | **drizzle** | *verb* | — | rociar (líquido) | — | — |
| `voc_a2_sauce_522` | **sauce** | *noun* | — | salsa | — | — |
| `voc_a2_broth-stock_523` | **broth / stock** | *noun* | — | caldo | — | — |
| `voc_a2_dough_524` | **dough** | *noun* | — | masa | — | — |
| `voc_a2_batter_525` | **batter** | *noun* | — | masa líquida | — | — |
| `voc_a2_yeast_526` | **yeast** | *noun* | — | levadura | — | — |
| `voc_a2_flour_527` | **flour** | *noun* | — | harina | — | — |
| `voc_a2_baking-powder_528` | **baking powder** | *phrasal-verb* | — | polvo de hornear | — | — |
| `voc_a2_vanilla_529` | **vanilla** | *noun* | — | vainilla | — | — |
| `voc_a2_cinnamon_530` | **cinnamon** | *noun* | — | canela | — | — |
| `voc_a2_herbs_531` | **herbs** | *noun* | — | hierbas | — | — |
| `voc_a2_spices_532` | **spices** | *noun* | — | especias | — | — |
| `voc_a2_recipe-book-cookbook_533` | **recipe book / cookbook** | *noun* | — | libro de cocina | — | — |
| `voc_a2_nutrition-label_534` | **nutrition label** | *noun* | — | etiqueta nutricional | — | — |
| `voc_a2_expiration-date_535` | **expiration date** | *noun* | — | fecha de caducidad | — | — |
| `voc_a2_organic_536` | **organic** | *noun* | — | orgánico | — | — |
| `voc_a2_homemade_537` | **homemade** | *noun* | — | casero | — | — |
| `voc_a2_store-bought_538` | **store-bought** | *noun* | — | comprado en tienda | — | — |
| `voc_a2_vegetarian_539` | **vegetarian** | *noun* | — | vegetariano | — | — |
| `voc_a2_vegan_540` | **vegan** | *noun* | — | vegano | — | — |
| `voc_a2_gluten-free_541` | **gluten-free** | *noun* | — | sin gluten | — | — |
| `voc_a2_dairy-free_542` | **dairy-free** | *noun* | — | sin lácteos | — | — |
| `voc_a2_food-processor_543` | **food processor** | *noun* | — | procesador de alimentos | — | — |
| `voc_a2_blender_544` | **blender** | *noun* | — | licuadora | — | — |
| `voc_a2_mixing-bowl_545` | **mixing bowl** | *phrasal-verb* | — | tazón para mezclar | — | — |
| `voc_a2_cutting-board_546` | **cutting board** | *phrasal-verb* | — | tabla de cortar | — | — |
| `voc_a2_measuring-cup_547` | **measuring cup** | *noun* | — | taza medidora | — | — |
| `voc_a2_colander_548` | **colander** | *noun* | — | colador | — | — |
| `voc_a2_apron_549` | **apron** | *noun* | — | delantal | — | — |
| `voc_a2_recipe-card_550` | **recipe card** | *noun* | — | tarjeta de receta | — | — |
| `voc_a2_side-dish_551` | **side dish** | *noun* | — | guarnición | — | — |
| `voc_a2_main-course_552` | **main course** | *noun* | — | plato principal | — | — |
| `voc_a2_appetizer_553` | **appetizer** | *adjective* | — | aperitivo | — | — |
| `voc_a2_dessert_554` | **dessert** | *noun* | — | postre | — | — |

### Semana 12: Mantenimiento del hogar y reparaciones
Total de palabras en esta semana: **50**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_repair_555` | **repair** | *verb* | — | reparar | — | — |
| `voc_a2_leak_556` | **leak** | *noun* | — | fuga | — | — |
| `voc_a2_clog_557` | **clog** | *verb* | — | atascar/atasco | — | — |
| `voc_a2_broken-pipe_558` | **broken pipe** | *noun* | — | tubería rota | — | — |
| `voc_a2_renovate_559` | **renovate** | *verb* | — | renovar | — | — |
| `voc_a2_remodel_560` | **remodel** | *verb* | — | remodelar | — | — |
| `voc_a2_diy_561` | **DIY (do it yourself)** | *noun* | — | hazlo tú mismo | — | — |
| `voc_a2_blueprint_562` | **blueprint** | *noun* | — | plano | — | — |
| `voc_a2_contractor_563` | **contractor** | *noun* | — | contratista | — | — |
| `voc_a2_handyman_564` | **handyman** | *noun* | — | manitas/reparador | — | — |
| `voc_a2_maintenance_565` | **maintenance** | *noun* | — | mantenimiento | — | — |
| `voc_a2_inspection_566` | **inspection** | *noun* | — | inspección | — | — |
| `voc_a2_electrical-outlet_567` | **electrical outlet** | *adjective* | — | tomacorriente | — | — |
| `voc_a2_circuit-breaker_568` | **circuit breaker** | *noun* | — | interruptor automático | — | — |
| `voc_a2_fuse_569` | **fuse** | *adjective* | — | fusible | — | — |
| `voc_a2_wiring_570` | **wiring** | *adjective* | — | cableado | — | — |
| `voc_a2_plumbing_571` | **plumbing** | *noun* | — | plomería | — | — |
| `voc_a2_drain_572` | **drain** | *noun* | — | desagüe | — | — |
| `voc_a2_faucet-tap_573` | **faucet / tap** | *noun* | — | grifo | — | — |
| `voc_a2_thermostat_574` | **thermostat** | *noun* | — | termostato | — | — |
| `voc_a2_insulation_575` | **insulation** | *noun* | — | aislamiento | — | — |
| `voc_a2_ventilation_576` | **ventilation** | *noun* | — | ventilación | — | — |
| `voc_a2_mold_577` | **mold** | *noun* | — | moho | — | — |
| `voc_a2_pest-control_578` | **pest control** | *noun* | — | control de plagas | — | — |
| `voc_a2_termite_579` | **termite** | *noun* | — | termita | — | — |
| `voc_a2_rust_580` | **rust** | *noun* | — | óxido | — | — |
| `voc_a2_crack_581` | **crack (wall)** | *noun* | — | grieta | — | — |
| `voc_a2_dent_582` | **dent** | *noun* | — | abolladura | — | — |
| `voc_a2_scratch_583` | **scratch** | *noun* | — | rayón | — | — |
| `voc_a2_stain_584` | **stain** | *noun* | — | mancha | — | — |
| `voc_a2_paint-roller_585` | **paint roller** | *noun* | — | rodillo de pintura | — | — |
| `voc_a2_sandpaper_586` | **sandpaper** | *noun* | — | papel de lija | — | — |
| `voc_a2_nail-gun_587` | **nail gun** | *noun* | — | pistola de clavos | — | — |
| `voc_a2_power-drill_588` | **power drill** | *noun* | — | taladro eléctrico | — | — |
| `voc_a2_toolbox_589` | **toolbox** | *noun* | — | caja de herramientas | — | — |
| `voc_a2_measuring-tape_590` | **measuring tape** | *noun* | — | cinta métrica | — | — |
| `voc_a2_level_591` | **level (tool)** | *noun* | — | nivel (herramienta) | — | — |
| `voc_a2_wrench_592` | **wrench** | *noun* | — | llave inglesa | — | — |
| `voc_a2_pliers_593` | **pliers** | *noun* | — | alicates | — | — |
| `voc_a2_safety-goggles_594` | **safety goggles** | *noun* | — | gafas de seguridad | — | — |
| `voc_a2_estimate_595` | **estimate (cost)** | *adjective* | — | presupuesto/estimado | — | — |
| `voc_a2_quote_596` | **quote (price)** | *noun* | — | cotización | — | — |
| `voc_a2_appliance-repair_597` | **appliance repair** | *noun* | — | reparación de electrodomésticos | — | — |
| `voc_a2_gutter_598` | **gutter** | *noun* | — | canaleta | — | — |
| `voc_a2_chimney_599` | **chimney** | *noun* | — | chimenea | — | — |
| `voc_a2_foundation_600` | **foundation (house)** | *noun* | — | cimientos | — | — |
| `voc_a2_structural-damage_601` | **structural damage** | *noun* | — | daño estructural | — | — |
| `voc_a2_home-inspection_602` | **home inspection** | *noun* | — | inspección de vivienda | — | — |
| `voc_a2_recyclable_603` | **recyclable** | *adjective* | — | reciclable | — | — |
| `voc_a2_waste-disposal_604` | **waste disposal** | *noun* | — | eliminación de residuos | — | — |

### Semana 13: Deportes y vida activa
Total de palabras en esta semana: **40**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_tournament_605` | **tournament** | *noun* | — | torneo | — | — |
| `voc_a2_league_606` | **league** | *noun* | — | liga | — | — |
| `voc_a2_teammate_607` | **teammate** | *noun* | — | compañero de equipo | — | — |
| `voc_a2_opponent_608` | **opponent** | *adjective* | — | oponente | — | — |
| `voc_a2_warm-up_609` | **warm-up** | *noun* | — | calentamiento | — | — |
| `voc_a2_stretch_610` | **stretch** | *verb* | — | estirar | — | — |
| `voc_a2_stamina_611` | **stamina** | *noun* | — | resistencia | — | — |
| `voc_a2_cardio_612` | **cardio** | *noun* | — | cardio | — | — |
| `voc_a2_strength-training_613` | **strength training** | *noun* | — | entrenamiento de fuerza | — | — |
| `voc_a2_personal-trainer_614` | **personal trainer** | *noun* | — | entrenador personal | — | — |
| `voc_a2_workout_615` | **workout** | *noun* | — | rutina de ejercicio | — | — |
| `voc_a2_set_616` | **set (exercise)** | *noun* | — | serie (ejercicio) | — | — |
| `voc_a2_rep-repetition_617` | **rep / repetition** | *noun* | — | repetición | — | — |
| `voc_a2_marathon_618` | **marathon** | *noun* | — | maratón | — | — |
| `voc_a2_sprint_619` | **sprint** | *verb* | — | carrera corta/esprintar | — | — |
| `voc_a2_finish-line_620` | **finish line** | *noun* | — | línea de meta | — | — |
| `voc_a2_medal_621` | **medal** | *noun* | — | medalla | — | — |
| `voc_a2_trophy_622` | **trophy** | *noun* | — | trofeo | — | — |
| `voc_a2_record_623` | **record (sports)** | *noun* | — | récord | — | — |
| `voc_a2_draw_624` | **draw (tie)** | *noun* | — | empate | — | — |
| `voc_a2_penalty_625` | **penalty** | *noun* | — | penalti | — | — |
| `voc_a2_foul_626` | **foul** | *noun* | — | falta | — | — |
| `voc_a2_injury-time_627` | **injury time** | *noun* | — | tiempo de descuento | — | — |
| `voc_a2_substitute_628` | **substitute (player)** | *adjective* | — | suplente | — | — |
| `voc_a2_spectator_629` | **spectator** | *noun* | — | espectador | — | — |
| `voc_a2_scoreboard_630` | **scoreboard** | *noun* | — | marcador | — | — |
| `voc_a2_halftime_631` | **halftime** | *noun* | — | medio tiempo | — | — |
| `voc_a2_locker-room_632` | **locker room** | *noun* | — | vestuario | — | — |
| `voc_a2_equipment_633` | **equipment (sports)** | *noun* | — | equipo (deportivo) | — | — |
| `voc_a2_helmet_634` | **helmet** | *noun* | — | casco | — | — |
| `voc_a2_mat_635` | **mat (exercise)** | *noun* | — | colchoneta | — | — |
| `voc_a2_treadmill_636` | **treadmill** | *verb* | — | cinta de correr | — | — |
| `voc_a2_dumbbell_637` | **dumbbell** | *noun* | — | mancuerna | — | — |
| `voc_a2_flexibility_638` | **flexibility** | *noun* | — | flexibilidad | — | — |
| `voc_a2_endurance_639` | **endurance** | *noun* | — | resistencia (física) | — | — |
| `voc_a2_posture_640` | **posture** | *noun* | — | postura | — | — |
| `voc_a2_physical-fitness_641` | **physical fitness** | *noun* | — | aptitud física | — | — |
| `voc_a2_recreational_642` | **recreational** | *adjective* | — | recreativo | — | — |
| `voc_a2_outdoor-activity_643` | **outdoor activity** | *noun* | — | actividad al aire libre | — | — |
| `voc_a2_adventure-sport_644` | **adventure sport** | *noun* | — | deporte de aventura | — | — |

### Semana 14: Cultura, medios y entretenimiento
Total de palabras en esta semana: **42**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_headline_645` | **headline** | *verb* | — | titular | — | — |
| `voc_a2_breaking-news_646` | **breaking news** | *noun* | — | noticia de última hora | — | — |
| `voc_a2_editorial_647` | **editorial** | *noun* | — | editorial | — | — |
| `voc_a2_celebrity_648` | **celebrity** | *noun* | — | celebridad | — | — |
| `voc_a2_plot_649` | **plot (story)** | *noun* | — | trama | — | — |
| `voc_a2_character_650` | **character (story)** | *noun* | — | personaje | — | — |
| `voc_a2_genre_651` | **genre** | *noun* | — | género | — | — |
| `voc_a2_soundtrack_652` | **soundtrack** | *noun* | — | banda sonora | — | — |
| `voc_a2_subtitle_653` | **subtitle** | *noun* | — | subtítulo | — | — |
| `voc_a2_box-office_654` | **box office** | *noun* | — | taquilla | — | — |
| `voc_a2_streaming-platform_655` | **streaming platform** | *noun* | — | plataforma de streaming | — | — |
| `voc_a2_premiere_656` | **premiere** | *noun* | — | estreno | — | — |
| `voc_a2_sequel_657` | **sequel** | *noun* | — | secuela | — | — |
| `voc_a2_remake_658` | **remake** | *noun* | — | nueva versión | — | — |
| `voc_a2_script_659` | **script** | *noun* | — | guion | — | — |
| `voc_a2_director_660` | **director** | *noun* | — | director | — | — |
| `voc_a2_producer_661` | **producer** | *noun* | — | productor | — | — |
| `voc_a2_audience_662` | **audience** | *noun* | — | audiencia | — | — |
| `voc_a2_review_663` | **review (critique)** | *noun* | — | crítica/reseña | — | — |
| `voc_a2_critic_664` | **critic** | *noun* | — | crítico | — | — |
| `voc_a2_bestselling_665` | **bestselling** | *noun* | — | más vendido (libro) | — | — |
| `voc_a2_author_666` | **author** | *noun* | — | autor | — | — |
| `voc_a2_publisher_667` | **publisher** | *noun* | — | editorial (empresa) | — | — |
| `voc_a2_edition_668` | **edition** | *noun* | — | edición | — | — |
| `voc_a2_chapter_669` | **chapter** | *noun* | — | capítulo | — | — |
| `voc_a2_plot-twist_670` | **plot twist** | *noun* | — | giro de la trama | — | — |
| `voc_a2_cliffhanger_671` | **cliffhanger** | *noun* | — | final en suspenso | — | — |
| `voc_a2_fan-base_672` | **fan base** | *noun* | — | base de fanáticos | — | — |
| `voc_a2_influencer_673` | **influencer** | *verb* | — | influencer | — | — |
| `voc_a2_viral_674` | **viral** | *noun* | — | viral | — | — |
| `voc_a2_trending_675` | **trending** | *noun* | — | en tendencia | — | — |
| `voc_a2_content-creator_676` | **content creator** | *noun* | — | creador de contenido | — | — |
| `voc_a2_live-stream_677` | **live stream** | *adjective* | — | transmisión en vivo | — | — |
| `voc_a2_podcast_678` | **podcast** | *noun* | — | podcast | — | — |
| `voc_a2_exhibit-exhibition_679` | **exhibit / exhibition** | *noun* | — | exhibición | — | — |
| `voc_a2_gallery_680` | **gallery** | *noun* | — | galería | — | — |
| `voc_a2_performance_681` | **performance (show)** | *noun* | — | actuación | — | — |
| `voc_a2_stand-up-comedy_682` | **stand-up comedy** | *adjective* | — | comedia en vivo | — | — |
| `voc_a2_orchestra_683` | **orchestra** | *noun* | — | orquesta | — | — |
| `voc_a2_choir_684` | **choir** | *noun* | — | coro | — | — |
| `voc_a2_album_685` | **album** | *noun* | — | álbum | — | — |
| `voc_a2_lyrics_686` | **lyrics** | *noun* | — | letra de canción | — | — |

### Semana 15: Personalidad y carácter
Total de palabras en esta semana: **48**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_ambitious_687` | **ambitious** | *adjective* | — | ambicioso | — | — |
| `voc_a2_stubborn_688` | **stubborn** | *adjective* | — | terco | — | — |
| `voc_a2_arrogant_689` | **arrogant** | *adjective* | — | arrogante | — | — |
| `voc_a2_humble_690` | **humble** | *adjective* | — | humilde | — | — |
| `voc_a2_reliable_691` | **reliable** | *adjective* | — | confiable | — | — |
| `voc_a2_trustworthy_692` | **trustworthy** | *adjective* | — | digno de confianza | — | — |
| `voc_a2_sociable_693` | **sociable** | *adjective* | — | sociable | — | — |
| `voc_a2_introverted_694` | **introverted** | *adjective* | — | introvertido | — | — |
| `voc_a2_extroverted_695` | **extroverted** | *adjective* | — | extrovertido | — | — |
| `voc_a2_open-minded_696` | **open-minded** | *adjective* | — | de mente abierta | — | — |
| `voc_a2_closed-minded_697` | **closed-minded** | *adjective* | — | cerrado de mente | — | — |
| `voc_a2_judgmental_698` | **judgmental** | *adjective* | — | crítico/juzgón | — | — |
| `voc_a2_optimistic_699` | **optimistic** | *adjective* | — | optimista | — | — |
| `voc_a2_pessimistic_700` | **pessimistic** | *adjective* | — | pesimista | — | — |
| `voc_a2_realistic_701` | **realistic** | *adjective* | — | realista | — | — |
| `voc_a2_idealistic_702` | **idealistic** | *adjective* | — | idealista | — | — |
| `voc_a2_assertive_703` | **assertive** | *adjective* | — | asertivo | — | — |
| `voc_a2_passive_704` | **passive** | *adjective* | — | pasivo | — | — |
| `voc_a2_aggressive_705` | **aggressive** | *adjective* | — | agresivo | — | — |
| `voc_a2_competitive_706` | **competitive** | *adjective* | — | competitivo | — | — |
| `voc_a2_cooperative_707` | **cooperative** | *adjective* | — | cooperativo | — | — |
| `voc_a2_independent_708` | **independent** | *adjective* | — | independiente | — | — |
| `voc_a2_dependent_709` | **dependent** | *adjective* | — | dependiente | — | — |
| `voc_a2_mature_710` | **mature** | *adjective* | — | maduro | — | — |
| `voc_a2_immature_711` | **immature** | *adjective* | — | inmaduro | — | — |
| `voc_a2_responsible_712` | **responsible** | *adjective* | — | responsable | — | — |
| `voc_a2_irresponsible_713` | **irresponsible** | *adjective* | — | irresponsable | — | — |
| `voc_a2_disciplined_714` | **disciplined** | *adjective* | — | disciplinado | — | — |
| `voc_a2_spontaneous_715` | **spontaneous** | *adjective* | — | espontáneo | — | — |
| `voc_a2_cautious_716` | **cautious** | *adjective* | — | cauteloso | — | — |
| `voc_a2_adventurous_717` | **adventurous** | *adjective* | — | aventurero | — | — |
| `voc_a2_creative_718` | **creative** | *adjective* | — | creativo | — | — |
| `voc_a2_logical_719` | **logical** | *adjective* | — | lógico | — | — |
| `voc_a2_analytical_720` | **analytical** | *adjective* | — | analítico | — | — |
| `voc_a2_intuitive_721` | **intuitive** | *adjective* | — | intuitivo | — | — |
| `voc_a2_perceptive_722` | **perceptive** | *adjective* | — | perceptivo | — | — |
| `voc_a2_charismatic_723` | **charismatic** | *adjective* | — | carismático | — | — |
| `voc_a2_witty_724` | **witty** | *adjective* | — | ingenioso | — | — |
| `voc_a2_sarcastic_725` | **sarcastic** | *adjective* | — | sarcástico | — | — |
| `voc_a2_blunt_726` | **blunt** | *adjective* | — | directo/franco | — | — |
| `voc_a2_diplomatic_727` | **diplomatic** | *adjective* | — | diplomático | — | — |
| `voc_a2_tactful_728` | **tactful** | *adjective* | — | con tacto | — | — |
| `voc_a2_insensitive_729` | **insensitive** | *adjective* | — | insensible | — | — |
| `voc_a2_thoughtful_730` | **thoughtful** | *adjective* | — | considerado | — | — |
| `voc_a2_forgetful_731` | **forgetful** | *adjective* | — | olvidadizo | — | — |
| `voc_a2_punctual_732` | **punctual** | *adjective* | — | puntual | — | — |
| `voc_a2_easygoing_733` | **easygoing** | *adjective* | — | de trato fácil | — | — |
| `voc_a2_demanding_734` | **demanding** | *adjective* | — | exigente | — | — |

### 📖 Lecturas de Comprensión · Nivel A2

#### A Weekend Trip to the Beach (`rdg_a2_001`)
- **Nivel:** A2 • **Semana Asignada:** Semana 2 • **Dificultad:** 2/5
- **Vocabulario Enlazado (16 términos):** `voc_a1_weekend_001`, `voc_a1_family_001`, `voc_a1_beach_001`, `voc_a1_morning_001`, `voc_a1_sunny_001`, `voc_a1_warm_001`, `voc_a1_sea_001`, `voc_a1_lunch_001`, `voc_a1_afternoon_001`, `voc_a1_restaurant_001`, `voc_a1_hotel_001`, `voc_a1_fish_001`, `voc_a1_brother_001`, `voc_a1_grandmother-grandma_001`, `voc_a1_market_001`, `voc_a1_happy_001`

**Texto en Inglés:**
> Last weekend, my family and I went to the beach for the first time this year. We packed our suitcases early in the morning and drove for two hours. When we arrived, the weather was sunny and warm, so we decided to swim in the sea before lunch. In the afternoon, we visited a small restaurant near the hotel and tried some delicious fresh fish. My brother wanted to buy a souvenir for our grandmother, so we walked around the local market. It was a simple trip, but we all felt relaxed and happy.

**Traducción al Español:**
> *El fin de semana pasado, mi familia y yo fuimos a la playa por primera vez este año. Empacamos nuestras maletas temprano en la mañana y manejamos durante dos horas. Cuando llegamos, el clima estaba soleado y cálido, así que decidimos nadar en el mar antes del almuerzo. Por la tarde, visitamos un pequeño restaurante cerca del hotel y probamos un delicioso pescado fresco. Mi hermano quería comprar un recuerdo para nuestra abuela, así que caminamos por el mercado local. Fue un viaje sencillo, pero todos nos sentimos relajados y felices.*

**Preguntas de Comprensión:**
1. **What was the weather like when the family arrived at the beach?**
   - ▫️ Cold and rainy
   - ✅ Sunny and warm
   - ▫️ Windy and cloudy
   *Explicación:* The text states: 'the weather was sunny and warm, so we decided to swim.'

2. **Who did the brother want to buy a souvenir for?**
   - ✅ His grandmother
   - ▫️ His teacher
   - ▫️ His friend
   *Explicación:* The author says: 'My brother wanted to buy a souvenir for our grandmother.'

#### Returning a Damaged Package (`rdg_a2_002`)
- **Nivel:** A2 • **Semana Asignada:** Semana 1 • **Dificultad:** 2/5
- **Vocabulario Enlazado (11 términos):** `voc_a2_standard-delivery_033`, `voc_a2_package-parcel_029`, `voc_a2_damaged_016`, `voc_a2_broken_017`, `voc_a2_missing-part_019`, `voc_a2_customer-service_007`, `voc_a2_complaint_006`, `voc_a2_refund_001`, `voc_a2_exchange_002`, `voc_a2_courier_031`, `voc_a2_warranty_004`

**Texto en Inglés:**
> Yesterday afternoon, I received my online order by standard delivery, but the package was damaged. When I opened the box, the product was broken and missing a part. I immediately contacted customer service to file a complaint. The agent was polite and explained the return policy. She sent me a return label and said the company would process a full refund or an exchange once the courier receives the damaged item. Fortunately, the warranty covers damaged shipments.

**Traducción al Español:**
> *Ayer por la tarde, recibí mi pedido en línea por entrega estándar, pero el paquete estaba dañado. Cuando abrí la caja, el producto estaba roto y le faltaba una pieza. Inmediatamente me comuniqué con servicio al cliente para presentar una queja. La agente fue educada y me explicó la política de devoluciones. Me envió una etiqueta de devolución y dijo que la empresa procesaría un reembolso completo o un cambio una vez que el mensajero reciba el artículo dañado. Afortunadamente, la garantía cubre los envíos dañados.*

**Preguntas de Comprensión:**
1. **Why did the customer contact customer service?**
   - ▫️ The order was canceled
   - ✅ The package was damaged and the product was broken
   - ▫️ The price was too high
   *Explicación:* The customer states: 'the package was damaged... the product was broken and missing a part.'

2. **What options did the company offer to resolve the issue?**
   - ▫️ Store credit only
   - ✅ A full refund or an exchange
   - ▫️ A discount on the next purchase
   *Explicación:* The agent explained that the company would 'process a full refund or an exchange.'

#### A Busy Day at the Office (`rdg_a2_003`)
- **Nivel:** A2 • **Semana Asignada:** Semana 3 • **Dificultad:** 3/5
- **Vocabulario Enlazado (9 términos):** `voc_a2_department_126`, `voc_a2_deadline_129`, `voc_a2_report_136`, `voc_a2_supervisor_128`, `voc_a2_meeting-room_130`, `voc_a2_colleague_127`, `voc_a2_presentation_132`, `voc_a2_spreadsheet_137`, `voc_a2_overtime_145`

**Texto en Inglés:**
> Today was a very busy day at the office. Our department had an urgent deadline for a new project report. In the morning, my supervisor called a meeting in the main conference room to discuss the client's feedback. My colleague and I prepared a detailed presentation with the latest spreadsheet data. Although we worked some overtime in the evening, everyone cooperated and we completed the approval on time. My supervisor thanked the whole team for their hard work.

**Traducción al Español:**
> *Hoy fue un día muy ocupado en la oficina. Nuestro departamento tenía una fecha límite urgente para el informe de un nuevo proyecto. Por la mañana, mi supervisor convocó una reunión en la sala de conferencias principal para analizar los comentarios del cliente. Mi colega y yo preparamos una presentación detallada con los datos más recientes de la hoja de cálculo. Aunque trabajamos algunas horas extra por la noche, todos cooperaron y completamos la aprobación a tiempo. Mi supervisor agradeció a todo el equipo por su arduo trabajo.*

**Preguntas de Comprensión:**
1. **Why was the day at the office especially busy?**
   - ▫️ A new employee started
   - ✅ The department had an urgent deadline for a project report
   - ▫️ The computers stopped working
   *Explicación:* The author says: 'Our department had an urgent deadline for a new project report.'

2. **What did the colleagues do to meet the deadline?**
   - ▫️ Postponed the presentation
   - ✅ Worked some overtime and prepared a detailed presentation
   - ▫️ Hired an external consultant
   *Explicación:* The text mentions: 'prepared a detailed presentation... worked some overtime in the evening.'

---

## 📘 Nivel B1 (Intermedio · Threshold)

- **Semanas lectivas:** 9 semanas
- **Total vocabulario:** 226 palabras
- **Lecturas integradas:** 8 textos con evaluación

### Semana 1: B1 · Semana 1 – Phrasal verbs esenciales
Total de palabras en esta semana: **36**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_give-up_001` | **give up** | *phrasal-verb* | — | rendirse/dejar de hacer algo | — | — |
| `voc_b1_look-forward-to_002` | **look forward to** | *phrasal-verb* | — | esperar con ilusión | — | — |
| `voc_b1_get-along-with_003` | **get along with** | *phrasal-verb* | — | llevarse bien con | — | — |
| `voc_b1_put-off_004` | **put off** | *phrasal-verb* | — | posponer | — | — |
| `voc_b1_run-into_005` | **run into** | *phrasal-verb* | — | encontrarse por casualidad con | — | — |
| `voc_b1_come-across_006` | **come across** | *phrasal-verb* | — | encontrarse/toparse con algo | — | — |
| `voc_b1_look-after_007` | **look after** | *phrasal-verb* | — | cuidar de | — | — |
| `voc_b1_turn-down_008` | **turn down** | *phrasal-verb* | — | rechazar | — | — |
| `voc_b1_find-out_009` | **find out** | *phrasal-verb* | — | descubrir/averiguar | — | — |
| `voc_b1_work-out_010` | **work out** | *phrasal-verb* | — | resolver / hacer ejercicio | — | — |
| `voc_b1_deal-with_011` | **deal with** | *phrasal-verb* | — | lidiar con | — | — |
| `voc_b1_end-up_012` | **end up** | *phrasal-verb* | — | terminar (en una situación) | — | — |
| `voc_b1_carry-on_013` | **carry on** | *phrasal-verb* | — | continuar | — | — |
| `voc_b1_figure-out_014` | **figure out** | *phrasal-verb* | — | entender/descifrar | — | — |
| `voc_b1_point-out_015` | **point out** | *phrasal-verb* | — | señalar | — | — |
| `voc_b1_break-down_016` | **break down** | *phrasal-verb* | — | descomponerse / desglosar | — | — |
| `voc_b1_bring-up_017` | **bring up** | *phrasal-verb* | — | criar / sacar un tema | — | — |
| `voc_b1_call-off_018` | **call off** | *phrasal-verb* | — | cancelar | — | — |
| `voc_b1_count-on_019` | **count on** | *phrasal-verb* | — | contar con (confiar) | — | — |
| `voc_b1_cut-down-on_020` | **cut down on** | *phrasal-verb* | — | reducir (consumo) | — | — |
| `voc_b1_drop-by_021` | **drop by** | *phrasal-verb* | — | pasar de visita | — | — |
| `voc_b1_fall-apart_022` | **fall apart** | *phrasal-verb* | — | desmoronarse | — | — |
| `voc_b1_get-over_023` | **get over** | *phrasal-verb* | — | superar | — | — |
| `voc_b1_hang-out_024` | **hang out** | *phrasal-verb* | — | pasar el rato | — | — |
| `voc_b1_hold-on_025` | **hold on** | *phrasal-verb* | — | esperar un momento | — | — |
| `voc_b1_let-down_026` | **let down** | *phrasal-verb* | — | decepcionar | — | — |
| `voc_b1_make-up_027` | **make up** | *phrasal-verb* | — | inventar / reconciliarse | — | — |
| `voc_b1_pass-away_028` | **pass away** | *phrasal-verb* | — | fallecer | — | — |
| `voc_b1_pull-off_029` | **pull off** | *phrasal-verb* | — | lograr algo difícil | — | — |
| `voc_b1_put-up-with_030` | **put up with** | *phrasal-verb* | — | tolerar/aguantar | — | — |
| `voc_b1_show-up_031` | **show up** | *phrasal-verb* | — | aparecer/presentarse | — | — |
| `voc_b1_sort-out_032` | **sort out** | *phrasal-verb* | — | resolver/organizar | — | — |
| `voc_b1_stand-for_033` | **stand for** | *phrasal-verb* | — | representar/significar | — | — |
| `voc_b1_take-after_034` | **take after** | *phrasal-verb* | — | parecerse a (familiar) | — | — |
| `voc_b1_throw-away_035` | **throw away** | *phrasal-verb* | — | desechar | — | — |
| `voc_b1_wear-out_036` | **wear out** | *phrasal-verb* | — | desgastar/agotar | — | — |

### Semana 2: B1 · Semana 2 – Modismos y expresiones idiomáticas
Total de palabras en esta semana: **24**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_once-in-a-blue-moon_037` | **once in a blue moon** | *adverb* | — | muy de vez en cuando | — | — |
| `voc_b1_break-the-ice_038` | **break the ice** | *verb* | — | romper el hielo | — | — |
| `voc_b1_hit-the-books_039` | **hit the books** | *verb* | — | ponerse a estudiar | — | — |
| `voc_b1_under-the-weather_040` | **under the weather** | *adverb* | — | sentirse mal/indispuesto | — | — |
| `voc_b1_piece-of-cake_041` | **piece of cake** | *adverb* | — | pan comido | — | — |
| `voc_b1_cost-an-arm-and-a-leg_042` | **cost an arm and a leg** | *verb* | — | costar un ojo de la cara | — | — |
| `voc_b1_on-the-ball_043` | **on the ball** | *adverb* | — | atento/competente | — | — |
| `voc_b1_let-the-cat-out-of-the-bag_044` | **let the cat out of the bag** | *verb* | — | revelar un secreto | — | — |
| `voc_b1_cutting-corners_045` | **cutting corners** | *adverb* | — | hacer las cosas mal por ahorrar | — | — |
| `voc_b1_back-to-square-one_046` | **back to square one** | *adverb* | — | volver al punto de partida | — | — |
| `voc_b1_bite-the-bullet_047` | **bite the bullet** | *verb* | — | aguantar algo difícil | — | — |
| `voc_b1_call-it-a-day_048` | **call it a day** | *verb* | — | dar por terminado el día/trabajo | — | — |
| `voc_b1_get-the-ball-rolling_049` | **get the ball rolling** | *verb* | — | poner algo en marcha | — | — |
| `voc_b1_hang-in-there_050` | **hang in there** | *adverb* | — | aguantar/no rendirse | — | — |
| `voc_b1_in-the-loop_051` | **in the loop** | *adverb* | — | al tanto/informado | — | — |
| `voc_b1_keep-an-eye-on_052` | **keep an eye on** | *adverb* | — | vigilar | — | — |
| `voc_b1_the-last-straw_053` | **the last straw** | *adverb* | — | la gota que colma el vaso | — | — |
| `voc_b1_miss-the-boat_054` | **miss the boat** | *verb* | — | perder la oportunidad | — | — |
| `voc_b1_on-the-same-page_055` | **on the same page** | *adverb* | — | de acuerdo/en sintonía | — | — |
| `voc_b1_speak-of-the-devil_056` | **speak of the devil** | *adverb* | — | hablando del rey de Roma | — | — |
| `voc_b1_the-ball-is-in-your-court_057` | **the ball is in your court** | *adverb* | — | la decisión es tuya ahora | — | — |
| `voc_b1_time-flies_058` | **time flies** | *adverb* | — | el tiempo vuela | — | — |
| `voc_b1_up-in-the-air_059` | **up in the air** | *adverb* | — | incierto/sin decidir | — | — |
| `voc_b1_weather-the-storm_060` | **weather the storm** | *adverb* | — | superar una dificultad | — | — |

### Semana 3: B1 · Semana 3 – Sustantivos abstractos de uso frecuente
Total de palabras en esta semana: **39**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_achievement_061` | **achievement** | *noun* | — | logro | — | — |
| `voc_b1_assumption_062` | **assumption** | *noun* | — | suposición | — | — |
| `voc_b1_attitude_063` | **attitude** | *noun* | — | actitud | — | — |
| `voc_b1_awareness_064` | **awareness** | *noun* | — | conciencia (de algo) | — | — |
| `voc_b1_behavior_065` | **behavior** | *noun* | — | comportamiento | — | — |
| `voc_b1_capability_066` | **capability** | *noun* | — | capacidad | — | — |
| `voc_b1_circumstance_067` | **circumstance** | *noun* | — | circunstancia | — | — |
| `voc_b1_consequence_068` | **consequence** | *noun* | — | consecuencia | — | — |
| `voc_b1_consideration_069` | **consideration** | *noun* | — | consideración | — | — |
| `voc_b1_contribution_070` | **contribution** | *noun* | — | contribución | — | — |
| `voc_b1_credibility_071` | **credibility** | *noun* | — | credibilidad | — | — |
| `voc_b1_definition_072` | **definition** | *noun* | — | definición | — | — |
| `voc_b1_dimension_073` | **dimension** | *noun* | — | dimensión | — | — |
| `voc_b1_emphasis_074` | **emphasis** | *noun* | — | énfasis | — | — |
| `voc_b1_evaluation_075` | **evaluation** | *noun* | — | evaluación | — | — |
| `voc_b1_factor_076` | **factor** | *noun* | — | factor | — | — |
| `voc_b1_framework_077` | **framework** | *noun* | — | marco (de referencia) | — | — |
| `voc_b1_function_078` | **function** | *noun* | — | función | — | — |
| `voc_b1_impact_079` | **impact** | *noun* | — | impacto | — | — |
| `voc_b1_initiative_080` | **initiative** | *noun* | — | iniciativa | — | — |
| `voc_b1_insight_081` | **insight** | *noun* | — | percepción profunda | — | — |
| `voc_b1_integrity_082` | **integrity** | *noun* | — | integridad | — | — |
| `voc_b1_motivation_083` | **motivation** | *noun* | — | motivación | — | — |
| `voc_b1_objective-noun_084` | **objective (noun)** | *noun* | — | objetivo | — | — |
| `voc_b1_outcome_085` | **outcome** | *noun* | — | resultado | — | — |
| `voc_b1_perception_086` | **perception** | *noun* | — | percepción | — | — |
| `voc_b1_phenomenon_087` | **phenomenon** | *noun* | — | fenómeno | — | — |
| `voc_b1_principle_088` | **principle** | *noun* | — | principio | — | — |
| `voc_b1_priority_089` | **priority** | *noun* | — | prioridad | — | — |
| `voc_b1_procedure_090` | **procedure** | *noun* | — | procedimiento | — | — |
| `voc_b1_process_091` | **process** | *noun* | — | proceso | — | — |
| `voc_b1_reputation_092` | **reputation** | *noun* | — | reputación | — | — |
| `voc_b1_scenario_093` | **scenario** | *noun* | — | escenario | — | — |
| `voc_b1_significance_094` | **significance** | *noun* | — | importancia/relevancia | — | — |
| `voc_b1_stability_095` | **stability** | *noun* | — | estabilidad | — | — |
| `voc_b1_structure_096` | **structure** | *noun* | — | estructura | — | — |
| `voc_b1_tendency_097` | **tendency** | *noun* | — | tendencia | — | — |
| `voc_b1_theory_098` | **theory** | *noun* | — | teoría | — | — |
| `voc_b1_transition_099` | **transition** | *noun* | — | transición | — | — |

### Semana 4: B1 · Semana 4 – Conectores avanzados del discurso
Total de palabras en esta semana: **20**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_whereas_100` | **whereas** | *conjunction* | — | mientras que (contraste) | — | — |
| `voc_b1_provided-that_101` | **provided that** | *conjunction* | — | siempre que/con la condición de que | — | — |
| `voc_b1_unless_102` | **unless** | *conjunction* | — | a menos que | — | — |
| `voc_b1_even-though_103` | **even though** | *conjunction* | — | aunque | — | — |
| `voc_b1_as-long-as_104` | **as long as** | *conjunction* | — | mientras (condición) | — | — |
| `voc_b1_in-spite-of_105` | **in spite of** | *conjunction* | — | a pesar de | — | — |
| `voc_b1_despite_106` | **despite** | *conjunction* | — | a pesar de | — | — |
| `voc_b1_given-that_107` | **given that** | *conjunction* | — | dado que | — | — |
| `voc_b1_assuming-that_108` | **assuming that** | *conjunction* | — | suponiendo que | — | — |
| `voc_b1_in-order-to_109` | **in order to** | *conjunction* | — | con el fin de | — | — |
| `voc_b1_so-as-to_110` | **so as to** | *conjunction* | — | para/con el objetivo de | — | — |
| `voc_b1_rather-than_111` | **rather than** | *conjunction* | — | en lugar de | — | — |
| `voc_b1_as-opposed-to_112` | **as opposed to** | *conjunction* | — | en contraposición a | — | — |
| `voc_b1_on-the-whole_113` | **on the whole** | *conjunction* | — | en general/en conjunto | — | — |
| `voc_b1_by-and-large_114` | **by and large** | *conjunction* | — | en su mayor parte | — | — |
| `voc_b1_needless-to-say_115` | **needless to say** | *conjunction* | — | huelga decir/ni que decir | — | — |
| `voc_b1_last-but-not-least_116` | **last but not least** | *conjunction* | — | por último pero no menos importante | — | — |
| `voc_b1_all-things-considered_117` | **all things considered** | *conjunction* | — | considerándolo todo | — | — |
| `voc_b1_in-other-words_118` | **in other words** | *conjunction* | — | en otras palabras | — | — |
| `voc_b1_that-being-said_119` | **that being said** | *conjunction* | — | dicho esto | — | — |

### Semana 5: B1 · Semana 5 – Verbos de argumentación y análisis
Total de palabras en esta semana: **26**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_assume_120` | **assume** | *verb* | — | suponer | — | — |
| `voc_b1_argue-that_121` | **argue (that)** | *verb* | — | argumentar/sostener que | — | — |
| `voc_b1_claim_122` | **claim** | *verb* | — | afirmar/alegar | — | — |
| `voc_b1_demonstrate_123` | **demonstrate** | *verb* | — | demostrar | — | — |
| `voc_b1_emphasize_124` | **emphasize** | *verb* | — | enfatizar | — | — |
| `voc_b1_imply_125` | **imply** | *verb* | — | insinuar/implicar | — | — |
| `voc_b1_indicate_126` | **indicate** | *verb* | — | indicar | — | — |
| `voc_b1_justify_127` | **justify** | *verb* | — | justificar | — | — |
| `voc_b1_maintain-an-opinion_128` | **maintain (an opinion)** | *verb* | — | mantener/sostener una postura | — | — |
| `voc_b1_predict_129` | **predict** | *verb* | — | predecir | — | — |
| `voc_b1_prove_130` | **prove** | *verb* | — | probar/demostrar | — | — |
| `voc_b1_reveal_131` | **reveal** | *verb* | — | revelar | — | — |
| `voc_b1_acknowledge_132` | **acknowledge** | *verb* | — | reconocer | — | — |
| `voc_b1_analyze_133` | **analyze** | *verb* | — | analizar | — | — |
| `voc_b1_assess_134` | **assess** | *verb* | — | evaluar/valorar | — | — |
| `voc_b1_clarify_135` | **clarify** | *verb* | — | aclarar | — | — |
| `voc_b1_conclude_136` | **conclude** | *verb* | — | concluir | — | — |
| `voc_b1_contradict_137` | **contradict** | *verb* | — | contradecir | — | — |
| `voc_b1_distinguish_138` | **distinguish** | *verb* | — | distinguir | — | — |
| `voc_b1_elaborate-on_139` | **elaborate (on)** | *verb* | — | desarrollar/profundizar en | — | — |
| `voc_b1_examine_140` | **examine** | *verb* | — | examinar | — | — |
| `voc_b1_highlight_141` | **highlight** | *verb* | — | destacar | — | — |
| `voc_b1_illustrate-an-idea_142` | **illustrate (an idea)** | *verb* | — | ilustrar (una idea) | — | — |
| `voc_b1_interpret_143` | **interpret** | *verb* | — | interpretar | — | — |
| `voc_b1_outline-a-plan_144` | **outline (a plan)** | *verb* | — | esbozar (un plan) | — | — |
| `voc_b1_summarize_145` | **summarize** | *verb* | — | resumir | — | — |

### Semana 6: B1 · Semana 6 – Medios de comunicación y actualidad
Total de palabras en esta semana: **19**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_article_146` | **article** | *noun* | — | artículo | — | — |
| `voc_b1_column-newspaper_147` | **column (newspaper)** | *noun* | — | columna (periódico) | — | — |
| `voc_b1_broadcast_148` | **broadcast** | *verb* | — | transmisión/emitir | — | — |
| `voc_b1_coverage-news_149` | **coverage (news)** | *noun* | — | cobertura (noticiosa) | — | — |
| `voc_b1_correspondent_150` | **correspondent** | *noun* | — | corresponsal | — | — |
| `voc_b1_editor_151` | **editor** | *noun* | — | editor | — | — |
| `voc_b1_feature-article_152` | **feature (article)** | *noun* | — | reportaje/artículo especial | — | — |
| `voc_b1_interview-noun_153` | **interview (noun)** | *noun* | — | entrevista | — | — |
| `voc_b1_investigate_154` | **investigate** | *verb* | — | investigar | — | — |
| `voc_b1_source-news_155` | **source (news)** | *noun* | — | fuente (informativa) | — | — |
| `voc_b1_statement-public_156` | **statement (public)** | *noun* | — | declaración (pública) | — | — |
| `voc_b1_survey_157` | **survey** | *noun* | — | encuesta | — | — |
| `voc_b1_poll_158` | **poll** | *noun* | — | sondeo/encuesta | — | — |
| `voc_b1_censorship_159` | **censorship** | *noun* | — | censura | — | — |
| `voc_b1_propaganda_160` | **propaganda** | *noun* | — | propaganda | — | — |
| `voc_b1_bias_161` | **bias** | *noun* | — | sesgo/parcialidad | — | — |
| `voc_b1_credible_162` | **credible** | *adjective* | — | creíble | — | — |
| `voc_b1_misinformation_163` | **misinformation** | *noun* | — | desinformación | — | — |
| `voc_b1_current-affairs_164` | **current affairs** | *noun* | — | actualidad | — | — |

### Semana 7: B1 · Semana 7 – Economía y trabajo (nivel intermedio)
Total de palabras en esta semana: **23**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_economy_165` | **economy** | *noun* | — | economía | — | — |
| `voc_b1_inflation_166` | **inflation** | *noun* | — | inflación | — | — |
| `voc_b1_recession_167` | **recession** | *noun* | — | recesión | — | — |
| `voc_b1_unemployment_168` | **unemployment** | *noun* | — | desempleo | — | — |
| `voc_b1_income_169` | **income** | *noun* | — | ingresos | — | — |
| `voc_b1_expense_170` | **expense** | *noun* | — | gasto | — | — |
| `voc_b1_investment_171` | **investment** | *noun* | — | inversión | — | — |
| `voc_b1_profit_172` | **profit** | *noun* | — | ganancia/beneficio | — | — |
| `voc_b1_loss-business_173` | **loss (business)** | *noun* | — | pérdida (negocio) | — | — |
| `voc_b1_supply_174` | **supply** | *adverb* | — | oferta | — | — |
| `voc_b1_demand-economy_175` | **demand (economy)** | *noun* | — | demanda (economía) | — | — |
| `voc_b1_trade_176` | **trade** | *noun* | — | comercio | — | — |
| `voc_b1_export_177` | **export** | *noun* | — | exportar/exportación | — | — |
| `voc_b1_import_178` | **import** | *noun* | — | importar/importación | — | — |
| `voc_b1_industry_179` | **industry** | *noun* | — | industria | — | — |
| `voc_b1_sector_180` | **sector** | *noun* | — | sector | — | — |
| `voc_b1_consumer_181` | **consumer** | *noun* | — | consumidor | — | — |
| `voc_b1_entrepreneur_182` | **entrepreneur** | *noun* | — | emprendedor | — | — |
| `voc_b1_startup_183` | **startup** | *noun* | — | empresa emergente | — | — |
| `voc_b1_revenue_184` | **revenue** | *noun* | — | ingresos (empresa) | — | — |
| `voc_b1_asset_185` | **asset** | *noun* | — | activo (financiero) | — | — |
| `voc_b1_shareholder_186` | **shareholder** | *noun* | — | accionista | — | — |
| `voc_b1_stock-finance_187` | **stock (finance)** | *noun* | — | acción (bolsa) | — | — |

### Semana 8: B1 · Semana 8 – Relaciones sociales y comunicación
Total de palabras en esta semana: **15**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_cooperate_188` | **cooperate** | *verb* | — | cooperar | — | — |
| `voc_b1_collaborate_189` | **collaborate** | *verb* | — | colaborar | — | — |
| `voc_b1_criticize_190` | **criticize** | *verb* | — | criticar | — | — |
| `voc_b1_compliment_191` | **compliment** | *noun* | — | hacer un cumplido | — | — |
| `voc_b1_complain_192` | **complain** | *noun* | — | quejarse | — | — |
| `voc_b1_reconcile_193` | **reconcile** | *verb* | — | reconciliar | — | — |
| `voc_b1_gossip_194` | **gossip** | *noun* | — | chisme/chismear | — | — |
| `voc_b1_rumor_195` | **rumor** | *noun* | — | rumor | — | — |
| `voc_b1_confront_196` | **confront** | *verb* | — | confrontar | — | — |
| `voc_b1_mediate_197` | **mediate** | *verb* | — | mediar | — | — |
| `voc_b1_empathize_198` | **empathize** | *verb* | — | empatizar | — | — |
| `voc_b1_tolerate_199` | **tolerate** | *verb* | — | tolerar | — | — |
| `voc_b1_admire_200` | **admire** | *noun* | — | admirar | — | — |
| `voc_b1_envy_201` | **envy** | *noun* | — | envidiar/envidia | — | — |
| `voc_b1_resent_202` | **resent** | *noun* | — | resentirse por | — | — |

### Semana 9: B1 · Semana 9 – Adjetivos descriptivos avanzados
Total de palabras en esta semana: **24**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_ambiguous_203` | **ambiguous** | *adjective* | — | ambiguo | — | — |
| `voc_b1_controversial_204` | **controversial** | *adjective* | — | controvertido | — | — |
| `voc_b1_significant_205` | **significant** | *adjective* | — | significativo | — | — |
| `voc_b1_substantial_206` | **substantial** | *adjective* | — | sustancial | — | — |
| `voc_b1_considerable_207` | **considerable** | *adjective* | — | considerable | — | — |
| `voc_b1_remarkable_208` | **remarkable** | *adjective* | — | notable | — | — |
| `voc_b1_noteworthy_209` | **noteworthy** | *adjective* | — | digno de mención | — | — |
| `voc_b1_inevitable_210` | **inevitable** | *adjective* | — | inevitable | — | — |
| `voc_b1_plausible_211` | **plausible** | *adjective* | — | plausible | — | — |
| `voc_b1_feasible_212` | **feasible** | *adjective* | — | factible | — | — |
| `voc_b1_viable_213` | **viable** | *adjective* | — | viable | — | — |
| `voc_b1_consistent_214` | **consistent** | *adjective* | — | consistente/constante | — | — |
| `voc_b1_coherent_215` | **coherent** | *adjective* | — | coherente | — | — |
| `voc_b1_comprehensive_216` | **comprehensive** | *adjective* | — | integral/exhaustivo | — | — |
| `voc_b1_thorough_217` | **thorough** | *adjective* | — | minucioso | — | — |
| `voc_b1_superficial_218` | **superficial** | *adjective* | — | superficial | — | — |
| `voc_b1_subtle_219` | **subtle** | *adjective* | — | sutil | — | — |
| `voc_b1_versatile_220` | **versatile** | *adjective* | — | versátil | — | — |
| `voc_b1_adaptable_221` | **adaptable** | *adjective* | — | adaptable | — | — |
| `voc_b1_innovative_222` | **innovative** | *adjective* | — | innovador | — | — |
| `voc_b1_conventional_223` | **conventional** | *adjective* | — | convencional | — | — |
| `voc_b1_prevalent_224` | **prevalent** | *adjective* | — | predominante | — | — |
| `voc_b1_widespread_225` | **widespread** | *adjective* | — | generalizado | — | — |
| `voc_b1_prominent_226` | **prominent** | *adjective* | — | prominente/destacado | — | — |

### 📖 Lecturas de Comprensión · Nivel B1

#### A Difficult Decision (`rdg_b1_001`)
- **Nivel:** B1 • **Semana Asignada:** Semana 2 • **Dificultad:** 1/5
- **Vocabulario Enlazado (6 términos):** `voc_b1_once-in-a-blue-moon_037`, `voc_b1_break-the-ice_038`, `voc_b1_hit-the-books_039`, `voc_b1_under-the-weather_040`, `voc_b1_piece-of-cake_041`, `voc_b1_cost-an-arm-and-a-leg_042`

**Texto en Inglés:**
> Last month, Marco had to make a decision that would change his life. He had been offered a new job in another city, but if he accepted it, he would have to leave his elderly parents behind. If he stayed, he knew he would probably regret missing such a great opportunity. He spoke to his sister, who suggested that he make a list of reasons for each choice. 'If you don't try,' she said, 'you'll always wonder what could have happened.' After thinking it over for a week, Marco realized that if his parents needed him, he could always visit them often, and video calls would help too. In the end, he decided to accept the job. It wasn't an easy choice, but he felt confident that, whatever happened, he would learn something valuable from it.

**Traducción al Español:**
> *El mes pasado, Marco tuvo que tomar una decisión que cambiaría su vida. Le habían ofrecido un nuevo trabajo en otra ciudad, pero si lo aceptaba, tendría que dejar atrás a sus padres ancianos. Si se quedaba, sabía que probablemente se arrepentiría de perder una oportunidad tan buena. Habló con su hermana, quien le sugirió hacer una lista de razones para cada opción. "Si no lo intentas", le dijo, "siempre te preguntarás qué podría haber pasado". Después de pensarlo durante una semana, Marco se dio cuenta de que si sus padres lo necesitaban, siempre podría visitarlos seguido, y las videollamadas también ayudarían. Al final, decidió aceptar el trabajo. No fue una decisión fácil, pero se sintió seguro de que, pasara lo que pasara, aprendería algo valioso de ello.*

**Preguntas de Comprensión:**
1. **Why was Marco's decision difficult?**
   - ▫️ He didn't like his new job
   - ✅ He would have to leave his parents
   - ▫️ He couldn't afford to move
   *Explicación:* El texto dice: "he would have to leave his elderly parents behind" — esa era la dificultad de la decisión.

2. **What did his sister suggest?**
   - ▫️ To ignore the offer
   - ✅ To make a list of reasons
   - ▫️ To ask his parents to move with him
   *Explicación:* La hermana le dijo que hiciera "a list of reasons for each choice."

3. **What did Marco finally decide?**
   - ▫️ To stay in his city
   - ✅ To accept the new job
   - ▫️ To wait another year
   *Explicación:* El texto dice: "he decided to accept the job."

#### The Rise of Remote Work (`rdg_b1_002`)
- **Nivel:** B1 • **Semana Asignada:** Semana 7 • **Dificultad:** 3/5
- **Vocabulario Enlazado (6 términos):** `voc_b1_economy_165`, `voc_b1_inflation_166`, `voc_b1_recession_167`, `voc_b1_unemployment_168`, `voc_b1_income_169`, `voc_b1_expense_170`

**Texto en Inglés:**
> Over the past few years, the way people work has changed significantly. Many companies have been forced to reconsider how their offices are used, and remote work, which used to be seen as unusual, is now considered normal by a large part of the workforce. According to a recent survey, more than half of employees say they would prefer to work from home at least part of the time. Some businesses have already adapted their policies, offering flexible schedules and hybrid arrangements. However, not everyone benefits equally. Workers whose jobs require physical presence, such as those in manufacturing or healthcare, have not been given the same flexibility. Critics argue that this creates a new kind of inequality between those who can work from anywhere and those who cannot. As this trend continues, it is likely that new regulations will need to be introduced to protect workers on both sides of this divide.

**Traducción al Español:**
> *En los últimos años, la forma en que trabaja la gente ha cambiado significativamente. Muchas empresas se han visto obligadas a reconsiderar cómo se usan sus oficinas, y el trabajo remoto, que antes se veía como algo inusual, ahora se considera normal para gran parte de la fuerza laboral. Según una encuesta reciente, más de la mitad de los empleados dice que preferiría trabajar desde casa al menos parte del tiempo. Algunas empresas ya han adaptado sus políticas, ofreciendo horarios flexibles y modalidades híbridas. Sin embargo, no todos se benefician por igual. Los trabajadores cuyos empleos requieren presencia física, como los de manufactura o salud, no han recibido la misma flexibilidad. Los críticos argumentan que esto crea un nuevo tipo de desigualdad entre quienes pueden trabajar desde cualquier lugar y quienes no. Mientras esta tendencia continúa, es probable que se necesiten introducir nuevas regulaciones para proteger a los trabajadores de ambos lados de esta brecha.*

**Preguntas de Comprensión:**
1. **What does the survey mention?**
   - ▫️ Most employees dislike remote work
   - ✅ Over half prefer working from home sometimes
   - ▫️ Nobody wants hybrid schedules
   *Explicación:* El texto dice: "more than half of employees say they would prefer to work from home at least part of the time."

2. **Who has NOT received the same flexibility?**
   - ▫️ Office workers
   - ✅ Workers whose jobs require physical presence
   - ▫️ Managers
   *Explicación:* El texto especifica: "Workers whose jobs require physical presence, such as those in manufacturing or healthcare, have not been given the same flexibility."

3. **What do critics say this trend creates?**
   - ▫️ More jobs overall
   - ✅ A new kind of inequality
   - ▫️ Lower salaries for everyone
   *Explicación:* Los críticos dicen que "this creates a new kind of inequality."

#### Breaking the Ice (`rdg_b1_003`)
- **Nivel:** B1 • **Semana Asignada:** Semana 1 • **Dificultad:** 2/5
- **Vocabulario Enlazado (6 términos):** `voc_b1_give-up_001`, `voc_b1_look-forward-to_002`, `voc_b1_get-along-with_003`, `voc_b1_put-off_004`, `voc_b1_run-into_005`, `voc_b1_come-across_006`

**Texto en Inglés:**
> When Elena moved to a new city for work, she found it hard to get along with her new colleagues at first. Everyone seemed busy, and she didn't know how to break the ice. One day, she decided to bring up a topic that interested everyone: the terrible coffee in the office kitchen. It turned out to be the perfect way to start a conversation. Soon, people were laughing and sharing stories about their worst coffee experiences. Elena realized that she had been putting off making friends because she was afraid of looking silly. Now, she looks forward to lunch breaks, and she has even figured out how to deal with the office printer, which everyone else avoids. Sometimes the smallest things help you fit in.

**Traducción al Español:**
> *Cuando Elena se mudó a una nueva ciudad por trabajo, al principio le costó llevarse bien con sus nuevos colegas. Todos parecían ocupados y ella no sabía cómo romper el hielo. Un día, decidió sacar un tema que le interesaba a todos: el terrible café de la cocina de la oficina. Resultó ser la forma perfecta de iniciar una conversación. Pronto, la gente se reía y compartía anécdotas sobre sus peores experiencias con el café. Elena se dio cuenta de que había estado postergando hacer amigos por miedo a parecer tonta. Ahora espera con ganas los descansos para almorzar, e incluso descubrió cómo lidiar con la impresora de la oficina, que todos los demás evitan. A veces, las cosas más pequeñas te ayudan a encajar.*

**Preguntas de Comprensión:**
1. **Why did Elena find it hard to connect with colleagues?**
   - ▫️ She didn't speak English well
   - ✅ Everyone seemed busy
   - ▫️ She worked from home
   *Explicación:* El texto dice: "Everyone seemed busy, and she didn't know how to break the ice."

2. **What topic did she bring up?**
   - ▫️ The weather
   - ✅ The office coffee
   - ▫️ Her old job
   *Explicación:* Ella habló sobre "the terrible coffee in the office kitchen."

3. **What had Elena been avoiding?**
   - ✅ Making friends
   - ▫️ Drinking coffee
   - ▫️ Using the printer
   *Explicación:* El texto dice: "she had been putting off making friends because she was afraid of looking silly."

#### A Costly Mistake (`rdg_b1_004`)
- **Nivel:** B1 • **Semana Asignada:** Semana 3 • **Dificultad:** 2/5
- **Vocabulario Enlazado (6 términos):** `voc_b1_achievement_061`, `voc_b1_assumption_062`, `voc_b1_attitude_063`, `voc_b1_awareness_064`, `voc_b1_behavior_065`, `voc_b1_capability_066`

**Texto en Inglés:**
> Every company faces moments when a small assumption leads to a big consequence. Last year, a marketing team launched a campaign without fully checking their data, and the outcome was disappointing. They had assumed that their main audience was young adults, but the analysis later revealed that most of their customers were actually over forty. This factor changed the whole strategy. The team's attitude, however, is what impressed management the most: instead of blaming each other, they took full responsibility and used the experience as a learning opportunity. They created a new framework for checking assumptions before every future campaign. Their initiative has since become standard procedure across the entire company, showing that a single mistake, handled well, can improve an organization's structure for years to come.

**Traducción al Español:**
> *Toda empresa enfrenta momentos en los que una pequeña suposición lleva a una gran consecuencia. El año pasado, un equipo de marketing lanzó una campaña sin verificar bien sus datos, y el resultado fue decepcionante. Habían asumido que su público principal eran adultos jóvenes, pero el análisis reveló después que la mayoría de sus clientes en realidad tenían más de cuarenta años. Este factor cambió toda la estrategia. Sin embargo, lo que más impresionó a la gerencia fue la actitud del equipo: en lugar de culparse entre ellos, asumieron toda la responsabilidad y usaron la experiencia como una oportunidad de aprendizaje. Crearon un nuevo marco de trabajo para verificar suposiciones antes de cada futura campaña. Su iniciativa se ha convertido desde entonces en procedimiento estándar en toda la empresa, demostrando que un solo error, bien manejado, puede mejorar la estructura de una organización durante años.*

**Preguntas de Comprensión:**
1. **What did the team assume incorrectly?**
   - ▫️ Their budget was too small
   - ✅ Their main audience was young adults
   - ▫️ The campaign would fail completely
   *Explicación:* El texto dice: "They had assumed that their main audience was young adults."

2. **What impressed management?**
   - ✅ The team's attitude and responsibility
   - ▫️ The size of the campaign
   - ▫️ How fast the mistake was fixed
   *Explicación:* El texto dice: "The team's attitude... is what impressed management the most."

3. **What became standard procedure?**
   - ▫️ Firing team members after mistakes
   - ✅ A new framework for checking assumptions
   - ▫️ Cancelling all future campaigns
   *Explicación:* El texto dice: "They created a new framework for checking assumptions... has since become standard procedure."

#### Should Cities Ban Cars? (`rdg_b1_005`)
- **Nivel:** B1 • **Semana Asignada:** Semana 5 • **Dificultad:** 3/5
- **Vocabulario Enlazado (6 términos):** `voc_b1_assume_120`, `voc_b1_argue-that_121`, `voc_b1_claim_122`, `voc_b1_demonstrate_123`, `voc_b1_emphasize_124`, `voc_b1_imply_125`

**Texto en Inglés:**
> Some city planners argue that if downtown areas ban private cars, air quality will improve dramatically and streets will become safer for pedestrians. They point out that several European cities have already tested this idea with promising results. However, critics claim that such a policy would hurt local businesses, since many customers rely on their cars to reach shops that are far from public transport. Others suggest a middle ground: instead of a complete ban, cities could limit car access during specific hours or charge a fee for entering busy areas. It is difficult to prove which solution works best without testing it directly, but most experts agree that doing nothing is not an option. As traffic and pollution continue to increase, more cities will likely have to address this issue in the next decade, whether residents like it or not.

**Traducción al Español:**
> *Algunos urbanistas argumentan que si los centros de las ciudades prohíben los autos privados, la calidad del aire mejorará drásticamente y las calles serán más seguras para los peatones. Señalan que varias ciudades europeas ya han probado esta idea con resultados prometedores. Sin embargo, los críticos afirman que dicha política perjudicaría a los negocios locales, ya que muchos clientes dependen de sus autos para llegar a tiendas alejadas del transporte público. Otros sugieren un punto medio: en lugar de una prohibición total, las ciudades podrían limitar el acceso de autos durante horas específicas o cobrar una tarifa por entrar a zonas concurridas. Es difícil probar cuál solución funciona mejor sin probarla directamente, pero la mayoría de los expertos coincide en que no hacer nada no es una opción. Mientras el tráfico y la contaminación sigan aumentando, es probable que más ciudades tengan que abordar este tema en la próxima década, les guste o no a los residentes.*

**Preguntas de Comprensión:**
1. **What do critics of the ban claim?**
   - ▫️ It would improve air quality
   - ✅ It would hurt local businesses
   - ▫️ It would make streets more dangerous
   *Explicación:* El texto dice: "critics claim that such a policy would hurt local businesses."

2. **What middle-ground solution is suggested?**
   - ▫️ Banning all public transport
   - ✅ Limiting car access during certain hours
   - ▫️ Building more parking lots
   *Explicación:* El texto propone: "cities could limit car access during specific hours."

3. **What do most experts agree on?**
   - ▫️ Doing nothing is fine
   - ✅ Cities must address the issue
   - ▫️ Cars should never be banned
   *Explicación:* El texto dice: "most experts agree that doing nothing is not an option."

#### Can We Trust the News? (`rdg_b1_006`)
- **Nivel:** B1 • **Semana Asignada:** Semana 6 • **Dificultad:** 3/5
- **Vocabulario Enlazado (6 términos):** `voc_b1_article_146`, `voc_b1_column-newspaper_147`, `voc_b1_broadcast_148`, `voc_b1_coverage-news_149`, `voc_b1_correspondent_150`, `voc_b1_editor_151`

**Texto en Inglés:**
> In an age when information travels faster than ever, knowing which sources are credible has become an essential skill. A recent survey found that many young readers get their news mainly from social media rather than traditional outlets. While this makes information more accessible, it also increases the risk of misinformation, since content on social platforms is rarely fact-checked before it is shared. Journalists warn that bias can appear even in respected publications, often through the choice of which stories are covered and how headlines are written. To read critically, experts recommend checking whether a claim is supported by multiple independent sources, and being cautious of articles that seem designed mainly to provoke strong emotional reactions. Media literacy, they argue, should be taught in schools just like reading and writing.

**Traducción al Español:**
> *En una época en la que la información viaja más rápido que nunca, saber qué fuentes son confiables se ha convertido en una habilidad esencial. Una encuesta reciente encontró que muchos lectores jóvenes obtienen sus noticias principalmente de redes sociales en lugar de medios tradicionales. Aunque esto hace que la información sea más accesible, también aumenta el riesgo de desinformación, ya que el contenido en las plataformas sociales rara vez se verifica antes de compartirse. Los periodistas advierten que el sesgo puede aparecer incluso en publicaciones respetadas, muchas veces a través de qué historias se cubren y cómo se redactan los titulares. Para leer de forma crítica, los expertos recomiendan verificar si una afirmación está respaldada por varias fuentes independientes, y ser cautelosos con artículos que parecen diseñados principalmente para provocar reacciones emocionales fuertes. La alfabetización mediática, sostienen, debería enseñarse en las escuelas igual que la lectura y la escritura.*

**Preguntas de Comprensión:**
1. **Where do many young readers get their news?**
   - ▫️ Newspapers
   - ✅ Social media
   - ▫️ Radio
   *Explicación:* El texto dice: "many young readers get their news mainly from social media."

2. **What do experts recommend to read critically?**
   - ▫️ Trusting only one source
   - ✅ Checking multiple independent sources
   - ▫️ Avoiding the news entirely
   *Explicación:* El texto dice: "experts recommend checking whether a claim is supported by multiple independent sources."

3. **What should be taught in schools, according to experts?**
   - ✅ Media literacy
   - ▫️ Journalism history
   - ▫️ Social media marketing
   *Explicación:* El texto dice: "Media literacy... should be taught in schools just like reading and writing."

#### When Friends Disagree (`rdg_b1_007`)
- **Nivel:** B1 • **Semana Asignada:** Semana 8 • **Dificultad:** 2/5
- **Vocabulario Enlazado (6 términos):** `voc_b1_cooperate_188`, `voc_b1_collaborate_189`, `voc_b1_criticize_190`, `voc_b1_compliment_191`, `voc_b1_complain_192`, `voc_b1_reconcile_193`

**Texto en Inglés:**
> Diego and Marta had been close friends for years, but a recent disagreement about money almost ended their friendship. Diego had lent Marta some money, and when she didn't pay him back on time, he complained to a mutual friend instead of talking to her directly. Marta found out and felt hurt that Diego hadn't confronted her himself. When they finally talked, Diego admitted that he should have addressed the issue right away instead of letting resentment build up. Marta apologized for forgetting the deadline and explained that she had been dealing with a difficult month financially. In the end, they agreed to be more open with each other in the future, and Diego said he had learned that avoiding a conversation usually makes a small problem much bigger than it needs to be.

**Traducción al Español:**
> *Diego y Marta habían sido amigos cercanos durante años, pero un desacuerdo reciente sobre dinero casi termina con su amistad. Diego le había prestado dinero a Marta, y cuando ella no se lo devolvió a tiempo, él se quejó con un amigo en común en lugar de hablar con ella directamente. Marta se enteró y se sintió herida de que Diego no la hubiera confrontado personalmente. Cuando finalmente hablaron, Diego admitió que debería haber abordado el problema de inmediato en lugar de dejar que el resentimiento creciera. Marta se disculpó por olvidar la fecha límite y explicó que había estado pasando por un mes económicamente difícil. Al final, acordaron ser más abiertos entre ellos en el futuro, y Diego dijo que había aprendido que evitar una conversación generalmente hace que un problema pequeño se vuelva mucho más grande de lo que necesita ser.*

**Preguntas de Comprensión:**
1. **What did Diego do instead of talking to Marta directly?**
   - ▫️ He forgave her immediately
   - ✅ He complained to a mutual friend
   - ▫️ He asked for the money back publicly
   *Explicación:* El texto dice: "he complained to a mutual friend instead of talking to her directly."

2. **What did Diego admit?**
   - ✅ He should have addressed the issue right away
   - ▫️ He never lent Marta any money
   - ▫️ He didn't care about the friendship
   *Explicación:* El texto dice: "Diego admitted that he should have addressed the issue right away."

3. **What did Diego learn?**
   - ▫️ Money ruins friendships
   - ✅ Avoiding conversation makes problems bigger
   - ▫️ He should never lend money again
   *Explicación:* El texto dice: "avoiding a conversation usually makes a small problem much bigger than it needs to be."

#### The Most Underrated Skill (`rdg_b1_008`)
- **Nivel:** B1 • **Semana Asignada:** Semana 9 • **Dificultad:** 3/5
- **Vocabulario Enlazado (6 términos):** `voc_b1_ambiguous_203`, `voc_b1_controversial_204`, `voc_b1_significant_205`, `voc_b1_substantial_206`, `voc_b1_considerable_207`, `voc_b1_remarkable_208`

**Texto en Inglés:**
> Of all the skills employers look for today, adaptability might be the most underrated one. Technical knowledge becomes obsolete faster than ever, but a worker who is versatile and willing to learn new tools will always be more valuable than one who resists change, no matter how experienced they are. Companies increasingly prefer candidates who show a consistent pattern of solving unfamiliar problems over those with an impressive but narrow set of qualifications. This doesn't mean expertise is unimportant; rather, it suggests that the most successful professionals combine deep knowledge in one area with a flexible, comprehensive approach to everything else. In a world where industries can transform in just a few years, the ability to adapt quickly may prove to be more significant than any single technical skill someone can list on a resume.

**Traducción al Español:**
> *De todas las habilidades que buscan hoy los empleadores, la adaptabilidad podría ser la más subestimada. El conocimiento técnico se vuelve obsoleto más rápido que nunca, pero un trabajador versátil y dispuesto a aprender nuevas herramientas siempre será más valioso que uno que se resiste al cambio, sin importar cuánta experiencia tenga. Las empresas prefieren cada vez más a candidatos que muestran un patrón constante de resolver problemas desconocidos, por encima de aquellos con un conjunto de calificaciones impresionante pero limitado. Esto no significa que la experiencia no sea importante; más bien, sugiere que los profesionales más exitosos combinan un conocimiento profundo en un área con un enfoque flexible e integral hacia todo lo demás. En un mundo donde las industrias pueden transformarse en solo unos pocos años, la capacidad de adaptarse rápido puede resultar más significativa que cualquier habilidad técnica específica que alguien pueda enumerar en un currículum.*

**Preguntas de Comprensión:**
1. **What skill does the text call underrated?**
   - ▫️ Public speaking
   - ✅ Adaptability
   - ▫️ Time management
   *Explicación:* El texto dice: "adaptability might be the most underrated one."

2. **What do companies increasingly prefer?**
   - ▫️ Candidates who resist change
   - ✅ Candidates who solve unfamiliar problems
   - ▫️ Candidates with only narrow expertise
   *Explicación:* El texto dice: "Companies increasingly prefer candidates who show a consistent pattern of solving unfamiliar problems."

3. **What do the most successful professionals combine, according to the text?**
   - ▫️ Luck and connections
   - ✅ Deep knowledge and flexibility
   - ▫️ Speed and confidence
   *Explicación:* El texto dice: "the most successful professionals combine deep knowledge in one area with a flexible, comprehensive approach."

### ✍️ Banco de Gramática Aplicada B1 (Fill in the Blank)

Este banco evalúa la precisión morfosintáctica en oraciones contextualizadas con pistas gramaticales y explicación en español.

| ID | Tema Gramatical | Oración / Prompt | Traducción / Pista | Respuesta Correcta | Explicación Pedagógica |
|---|---|---|---|---|---|
| `grm_b1_pres_perfect_001` | **undefined** | I ___ (visit) London twice in my life. | He visitado Londres dos veces en mi vida. | **have visited *(alt: 've visited)*** | Usamos Present Perfect para experiencias de vida sin un momento específico en el tiempo. |
| `grm_b1_pres_perfect_002` | **undefined** | She ___ (already/finish) the report before her boss ___ (ask) for it yesterday. | Ella ya había terminado el informe antes de que su jefe lo pidiera ayer. | **had already finished / asked *(alt: 'd already finished / asked)*** | El primer hueco requiere Past Perfect (acción anterior a otra acción pasada); el segundo, Past Simple para la acción pasada de referencia. |
| `grm_b1_pres_perfect_003` | **undefined** | By the time she ___ (call) me, I ___ (already/leave) the office, so I ___ (not/hear) the news until the next morning. | Para cuando ella me llamó, yo ya había salido de la oficina, así que no escuché la noticia hasta la mañana siguiente. | **called / had already left / didn't hear *(alt: called / 'd already left / did not hear)*** | Combina tres tiempos: Past Simple para la llamada, Past Perfect para la acción anterior, y Past Simple negativo para la consecuencia posterior. |
| `grm_b1_cond1_001` | **undefined** | If it ___ (rain) tomorrow, we ___ (stay) home. | Si llueve mañana, nos quedaremos en casa. | **rains / will stay *(alt: rains / 'll stay)*** | Primer condicional: presente simple en la condición, 'will' + infinitivo en el resultado, para situaciones futuras reales o probables. |
| `grm_b1_cond1_002` | **undefined** | Unless you ___ (submit) the form by Friday, your application ___ (not/be) considered. | A menos que envíes el formulario para el viernes, tu solicitud no será considerada. | **submit / won't be *(alt: submit / will not be)*** | 'Unless' funciona como 'if not' — la condición sigue en presente simple aunque el significado sea negativo. |
| `grm_b1_cond1_003` | **undefined** | If the company ___ (not/reduce) costs soon, and provided that sales ___ (not/improve) next quarter, they ___ (have to) lay off staff. | Si la empresa no reduce costos pronto, y siempre que las ventas no mejoren el próximo trimestre, tendrán que despedir personal. | **doesn't reduce / don't improve / will have to *(alt: does not reduce / do not improve / 'll have to)*** | Dos condiciones encadenadas ('if... and provided that...') seguidas de un resultado con 'will have to', mostrando que el primer condicional puede combinar varias cláusulas condicionales. |
| `grm_b1_cond2_001` | **undefined** | If I ___ (have) more free time, I ___ (travel) more. | Si tuviera más tiempo libre, viajaría más. | **had / would travel *(alt: had / 'd travel)*** | Segundo condicional: pasado simple en la condición hipotética, 'would' + infinitivo en el resultado imaginario. |
| `grm_b1_cond2_002` | **undefined** | If she ___ (be) in your position, she ___ (not/hesitate) to accept the offer. | Si ella estuviera en tu posición, no dudaría en aceptar la oferta. | **were / wouldn't hesitate *(alt: was / wouldn't hesitate, were / would not hesitate)*** | En registro formal, 'were' se usa con todos los sujetos en segundo condicional (aunque 'was' también es aceptado en habla informal). |
| `grm_b1_cond2_003` | **undefined** | If governments ___ (invest) more in renewable energy, and if people ___ (be) more willing to change their habits, climate change ___ (not/be) such an urgent threat. | Si los gobiernos invirtieran más en energía renovable, y si la gente estuviera más dispuesta a cambiar sus hábitos, el cambio climático no sería una amenaza tan urgente. | **invested / were / wouldn't be *(alt: invested / were / would not be)*** | Dos condiciones hipotéticas coordinadas con 'and if' seguidas de un único resultado — estructura típica de argumentación en B1-B2. |
| `grm_b1_passive_001` | **undefined** | This book ___ (write) by a famous author. | Este libro fue escrito por un autor famoso. | **was written** | Voz pasiva en pasado simple: 'was/were' + participio pasado, útil cuando el interés está en la acción, no en quién la realizó. |
| `grm_b1_passive_002` | **undefined** | New safety regulations ___ (introduce) next year to reduce workplace accidents. | Nuevas regulaciones de seguridad serán introducidas el próximo año para reducir accidentes laborales. | **will be introduced *(alt: 'll be introduced)*** | Voz pasiva en futuro con 'will': 'will be' + participio pasado. |
| `grm_b1_passive_003` | **undefined** | It ___ (believe) that the ancient bridge ___ (build) over two thousand years ago, although it ___ (not/officially/confirm) until recent excavations. | Se cree que el antiguo puente fue construido hace más de dos mil años, aunque no se confirmó oficialmente hasta excavaciones recientes. | **is believed / was built / wasn't officially confirmed *(alt: is believed / was built / was not officially confirmed)*** | Combina tres construcciones pasivas en distintos tiempos dentro de una sola oración compleja, típico de textos académicos o históricos en B1-B2. |
| `grm_b1_comp_001` | **undefined** | This exercise is ___ (difficult) than the last one. | Este ejercicio es más difícil que el anterior. | **more difficult** | Adjetivos de dos o más sílabas terminados en patrones no simples forman el comparativo con 'more' + adjetivo + 'than'. |
| `grm_b1_comp_002` | **undefined** | The more experience you gain, the ___ (confident) you become at your job. | Cuanta más experiencia ganas, más seguro te vuelves en tu trabajo. | **more confident** | Estructura 'the more..., the more...' para expresar relación proporcional entre dos ideas — un patrón que suele confundir a hablantes de español porque no existe una traducción literal directa. |
| `grm_b1_comp_003` | **undefined** | Of all the candidates, she was by far ___ (qualified), even though she was not ___ (experienced) as some of the others. | De todos los candidatos, ella era con diferencia la más calificada, aunque no era tan experimentada como algunos de los otros. | **the most qualified / as experienced** | Combina un superlativo enfatizado con 'by far' y una comparación de igualdad ('as...as') en la misma oración — nivel de complejidad típico de B1 alto / entrada a B2. |
| `grm_b1_modals_001` | **undefined** | You ___ (should) apologize to her. | Deberías disculparte con ella. | **should** | 'Should' expresa un consejo o recomendación, no una obligación estricta. |
| `grm_b1_modals_002` | **undefined** | You ___ (not/have to) attend the meeting, but you ___ (must) send your report by email. | No tienes que asistir a la reunión, pero debes enviar tu informe por correo. | **don't have to / must *(alt: do not have to / must)*** | Contraste clave en B1: 'don't have to' significa que algo no es necesario (no prohibición), mientras 'must' expresa obligación firme. |
| `grm_b1_modals_003` | **undefined** | You ___ (should/have) told me earlier — I ___ (could/avoid) the mistake if I ___ (know) about the deadline change. | Deberías habérmelo dicho antes; podría haber evitado el error si hubiera sabido del cambio de fecha límite. | **should have / could have avoided / had known *(alt: should've / could've avoided / had known)*** | Combina 'should have + participio' (crítica sobre el pasado), 'could have + participio' (posibilidad no realizada) y tercer condicional implícito — estructura de entrada a B2. |
| `grm_b1_relative_001` | **undefined** | The man ___ lives next door is a teacher. | El hombre que vive al lado es maestro. | **who *(alt: that)*** | 'Who' (o 'that') introduce una cláusula relativa que describe a una persona. |
| `grm_b1_relative_002` | **undefined** | The company, ___ headquarters are in Madrid, announced record profits this year. | La empresa, cuya sede está en Madrid, anunció ganancias récord este año. | **whose** | 'Whose' indica posesión dentro de una cláusula relativa, y aquí introduce información adicional no esencial (nótese las comas). |
| `grm_b1_relative_003` | **undefined** | The city ___ I grew up, ___ has changed enormously in the last decade, is no longer ___ it used to be. | La ciudad donde crecí, que ha cambiado enormemente en la última década, ya no es lo que solía ser. | **where / which / what** | Combina tres tipos de cláusula relativa en una sola oración: 'where' (lugar), 'which' (cláusula no esencial sobre la ciudad) y 'what' (lo que solía ser, sin antecedente explícito). |
| `grm_b1_reported_001` | **undefined** | She said that she ___ (be) tired. | Ella dijo que estaba cansada. | **was** | En estilo indirecto, el presente ('am/is') retrocede a pasado ('was') cuando el verbo introductorio está en pasado. |
| `grm_b1_reported_002` | **undefined** | He told me that he ___ (finish) the project the day before and that he ___ (send) it soon. | Él me dijo que había terminado el proyecto el día anterior y que lo enviaría pronto. | **had finished / would send *(alt: 'd finished / would send)*** | El pasado simple retrocede a Past Perfect, y 'will' retrocede a 'would' en estilo indirecto — junto con el cambio de 'the day before' en vez de 'yesterday'. |
| `grm_b1_reported_003` | **undefined** | The manager explained that the deadline ___ (change) because the client ___ (request) extra revisions, and she asked us whether we ___ (can) finish by Friday instead. | El gerente explicó que la fecha límite había cambiado porque el cliente había pedido revisiones adicionales, y preguntó si podríamos terminar el viernes en su lugar. | **had changed / had requested / could** | Combina Past Perfect en dos cláusulas causales y 'can' retrocedido a 'could' dentro de una pregunta indirecta ('asked us whether') — estructura avanzada de discurso reportado. |
| `grm_b1_used_to_001` | **undefined** | When I was a child, I ___ (used to) play outside every day. | Cuando era niño, solía jugar afuera todos los días. | **used to** | 'Used to' describe hábitos o estados que ya no son ciertos en el presente. |
| `grm_b1_used_to_002` | **undefined** | Every summer, my grandfather ___ (would) tell us stories by the fire, although he ___ (used to) get the details wrong sometimes. | Cada verano, mi abuelo nos contaba historias junto al fuego, aunque a veces se equivocaba en los detalles. | **would / used to** | 'Would' se usa para acciones repetidas (no estados) en el pasado; 'used to' puede usarse tanto para acciones como para estados — aquí se combinan correctamente. |
| `grm_b1_used_to_003` | **undefined** | I ___ (be) used to waking up early now, but I remember how difficult it ___ (used to) be when I first started this job, since I ___ (never/be) a morning person before. | Ahora estoy acostumbrado a despertarme temprano, pero recuerdo lo difícil que solía ser cuando empecé este trabajo, ya que nunca antes había sido una persona madrugadora. | **am / used to / had never been** | Contrasta 'be used to' (estar acostumbrado, presente) con 'used to' (hábito pasado) y Past Perfect para la experiencia previa — una distinción que suele confundirse incluso en niveles avanzados. |
| `grm_b1_third_cond_001` | **undefined** | If I ___ (study) harder, I ___ (pass) the exam. | Si hubiera estudiado más, habría aprobado el examen. | **had studied / would have passed *(alt: 'd studied / would've passed)*** | Tercer condicional: Past Perfect en la condición, 'would have' + participio en el resultado, para hablar de situaciones pasadas que no ocurrieron. |
| `grm_b1_third_cond_002` | **undefined** | If they ___ (leave) earlier, they ___ (not/miss) the flight. | Si hubieran salido más temprano, no habrían perdido el vuelo. | **had left / wouldn't have missed *(alt: 'd left / would not have missed)*** | El resultado negativo en tercer condicional usa 'wouldn't have' + participio. |
| `grm_b1_third_cond_003` | **undefined** | If the manager ___ (know) about the problem sooner, and if the team ___ (communicate) more clearly, the project ___ (not/fail) so badly. | Si el gerente hubiera sabido del problema antes, y si el equipo se hubiera comunicado con más claridad, el proyecto no habría fracasado tan gravemente. | **had known / had communicated / wouldn't have failed *(alt: 'd known / 'd communicated / would not have failed)*** | Dos condiciones hipotéticas pasadas coordinadas llevando a un único resultado no realizado — estructura de análisis retrospectivo típica en informes o debates. |
| `grm_b1_gerund_inf_001` | **undefined** | She enjoys ___ (read) before bed. | A ella le gusta leer antes de dormir. | **reading** | 'Enjoy' siempre va seguido de gerundio (-ing), nunca de infinitivo. |
| `grm_b1_gerund_inf_002` | **undefined** | I stopped ___ (smoke) two years ago, but yesterday I stopped ___ (buy) some milk on my way home. | Dejé de fumar hace dos años, pero ayer me detuve para comprar leche de camino a casa. | **smoking / to buy** | 'Stop + gerundio' significa dejar un hábito; 'stop + infinitivo' significa detenerse con el propósito de hacer algo — mismo verbo, significado opuesto según la forma. |
| `grm_b1_gerund_inf_003` | **undefined** | I regret ___ (not/study) harder in school, and I remember ___ (tell) myself back then that it didn't matter, but I'd forgotten ___ (mention) that to my own children until it was too late. | Me arrepiento de no haber estudiado más en la escuela, y recuerdo haberme dicho en aquel entonces que no importaba, pero había olvidado mencionárselo a mis propios hijos hasta que fue demasiado tarde. | **not studying / telling / to mention** | Tres verbos con comportamiento distinto: 'regret + gerundio' (lamentar algo pasado), 'remember + gerundio' (recordar un evento pasado), 'forget + infinitivo' (olvidar hacer algo pendiente). |
| `grm_b1_quantifiers_001` | **undefined** | There isn't ___ milk left in the fridge. | No queda mucha leche en el refrigerador. | **much** | 'Much' se usa con sustantivos incontables en oraciones negativas; 'many' se usa con contables. |
| `grm_b1_quantifiers_002` | **undefined** | We only have ___ (little) time left, but fortunately ___ (few) people signed up, so it should be manageable. | Solo nos queda poco tiempo, pero afortunadamente pocas personas se inscribieron, así que debería ser manejable. | **a little / a few** | 'A little' (incontable) y 'a few' (contable) tienen connotación positiva ('suficiente'), a diferencia de 'little'/'few' sin artículo, que suenan negativos ('casi nada'). |
| `grm_b1_quantifiers_003` | **undefined** | Although there was ___ (little) evidence to support the theory, ___ (a few) researchers continued the project, believing that ___ (some) of the missing data would eventually confirm their hypothesis. | Aunque había poca evidencia para respaldar la teoría, unos pocos investigadores continuaron el proyecto, creyendo que algunos de los datos faltantes finalmente confirmarían su hipótesis. | **little / a few / some** | Contrasta 'little' sin artículo (negativo: casi ninguna evidencia) con 'a few' (positivo: un grupo suficiente de investigadores) y 'some' (cantidad indefinida positiva) en una misma oración argumentativa. |
| `grm_b1_pres_perf_cont_001` | **undefined** | I ___ (wait) for the bus for twenty minutes. | He estado esperando el autobús durante veinte minutos. | **have been waiting *(alt: 've been waiting)*** | Present Perfect Continuous enfatiza la duración de una acción que comenzó en el pasado y continúa (o acaba de terminar). |
| `grm_b1_pres_perf_cont_002` | **undefined** | You look exhausted — ___ (you/run)? | Te ves agotado, ¿has estado corriendo? | **have you been running** | Pregunta en Present Perfect Continuous usada para explicar evidencia visible de una actividad reciente. |
| `grm_b1_pres_perf_cont_003` | **undefined** | She ___ (work) on this report all week, but she still ___ (not/finish) it, even though she ___ (try) her best. | Ella ha estado trabajando en este informe toda la semana, pero todavía no lo ha terminado, aunque lo ha intentado con todas sus fuerzas. | **has been working / hasn't finished / has tried *(alt: has been working / has not finished / has tried)*** | Combina Present Perfect Continuous (proceso en curso) con Present Perfect simple (resultado no logrado) en la misma oración — distinción clave de nivel B1 alto. |
| `grm_b1_wish_001` | **undefined** | I wish I ___ (have) more money. | Ojalá tuviera más dinero. | **had** | 'Wish' + pasado simple expresa un deseo sobre una situación presente que no es cierta. |
| `grm_b1_wish_002` | **undefined** | If only I ___ (not/say) that to her yesterday. | Ojalá no le hubiera dicho eso ayer. | **hadn't said *(alt: had not said)*** | 'If only' + Past Perfect expresa arrepentimiento sobre algo que ya sucedió en el pasado. |
| `grm_b1_wish_003` | **undefined** | I wish I ___ (can/speak) three languages like my sister, and if only I ___ (start) learning earlier instead of waiting until now. | Ojalá pudiera hablar tres idiomas como mi hermana, y ojalá hubiera empezado a aprender antes en vez de esperar hasta ahora. | **could speak / had started** | Combina 'wish + could' (deseo sobre habilidad presente) con 'if only + Past Perfect' (arrepentimiento sobre el pasado) en la misma oración. |
| `grm_b1_qtags_001` | **undefined** | You're coming to the party, ___? | Vienes a la fiesta, ¿verdad? | **aren't you** | Con una afirmación, la question tag va en negativo: 'you're' (afirmativo) → 'aren't you' (negativo). |
| `grm_b1_qtags_002` | **undefined** | She hasn't called yet, ___? | Ella no ha llamado todavía, ¿verdad? | **has she** | Con una afirmación negativa, la question tag va en positivo: 'hasn't called' (negativo) → 'has she' (positivo). |
| `grm_b1_qtags_003` | **undefined** | Let's take a break, ___? Nobody has finished the report yet, ___? And there's nothing more we can do today, ___? | Tomemos un descanso, ¿de acuerdo? Nadie ha terminado el informe todavía, ¿verdad? Y no hay nada más que podamos hacer hoy, ¿verdad? | **shall we / have they / is there** | Tres casos especiales: 'Let's' siempre usa 'shall we'; 'nobody' (negativo implícito) toma tag positiva 'have they'; 'there's nothing' (negativo implícito) toma tag positiva 'is there'. |

---

## 📘 Nivel B2 (Intermedio Alto · Vantage)

- **Semanas lectivas:** 5 semanas
- **Total vocabulario:** 84 palabras
- **Lecturas integradas:** 2 textos con evaluación

### Semana 1: B2 · Semana 1 – Matices de significado y registro
Total de palabras en esta semana: **18**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b2_nuance_001` | **nuance** | *noun* | — | matiz | — | — |
| `voc_b2_connotation_002` | **connotation** | *noun* | — | connotación | — | — |
| `voc_b2_implication_003` | **implication** | *noun* | — | implicación | — | — |
| `voc_b2_subtlety_004` | **subtlety** | *noun* | — | sutileza | — | — |
| `voc_b2_rhetoric_005` | **rhetoric** | *adjective* | — | retórica | — | — |
| `voc_b2_discourse_006` | **discourse** | *noun* | — | discurso (análisis) | — | — |
| `voc_b2_register-language_007` | **register (language)** | *noun* | — | registro (lingüístico) | — | — |
| `voc_b2_colloquial_008` | **colloquial** | *adjective* | — | coloquial | — | — |
| `voc_b2_vernacular_009` | **vernacular** | *noun* | — | vernáculo/habla local | — | — |
| `voc_b2_jargon_010` | **jargon** | *noun* | — | jerga (técnica) | — | — |
| `voc_b2_ambiguity_011` | **ambiguity** | *noun* | — | ambigüedad | — | — |
| `voc_b2_paradox_012` | **paradox** | *noun* | — | paradoja | — | — |
| `voc_b2_irony_013` | **irony** | *noun* | — | ironía | — | — |
| `voc_b2_cynicism_014` | **cynicism** | *noun* | — | cinismo | — | — |
| `voc_b2_skepticism_015` | **skepticism** | *noun* | — | escepticismo | — | — |
| `voc_b2_euphemism_016` | **euphemism** | *noun* | — | eufemismo | — | — |
| `voc_b2_understatement_017` | **understatement** | *noun* | — | subestimación/decir menos de lo que es | — | — |
| `voc_b2_overstatement_018` | **overstatement** | *noun* | — | exageración | — | — |

### Semana 2: B2 · Semana 2 – Ideas, ideología y sociedad
Total de palabras en esta semana: **21**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b2_ideology_019` | **ideology** | *noun* | — | ideología | — | — |
| `voc_b2_philosophy_020` | **philosophy** | *noun* | — | filosofía | — | — |
| `voc_b2_ethics_021` | **ethics** | *noun* | — | ética | — | — |
| `voc_b2_morality_022` | **morality** | *noun* | — | moralidad | — | — |
| `voc_b2_autonomy_023` | **autonomy** | *noun* | — | autonomía | — | — |
| `voc_b2_sovereignty_024` | **sovereignty** | *noun* | — | soberanía | — | — |
| `voc_b2_legislation_025` | **legislation** | *noun* | — | legislación | — | — |
| `voc_b2_jurisdiction_026` | **jurisdiction** | *noun* | — | jurisdicción | — | — |
| `voc_b2_advocacy_027` | **advocacy** | *noun* | — | apoyo/defensa de una causa | — | — |
| `voc_b2_activism_028` | **activism** | *noun* | — | activismo | — | — |
| `voc_b2_discrimination_029` | **discrimination** | *noun* | — | discriminación | — | — |
| `voc_b2_prejudice_030` | **prejudice** | *noun* | — | prejuicio | — | — |
| `voc_b2_stereotype_031` | **stereotype** | *noun* | — | estereotipo | — | — |
| `voc_b2_stigma_032` | **stigma** | *noun* | — | estigma | — | — |
| `voc_b2_marginalization_033` | **marginalization** | *noun* | — | marginación | — | — |
| `voc_b2_inequality_034` | **inequality** | *noun* | — | desigualdad | — | — |
| `voc_b2_disparity_035` | **disparity** | *noun* | — | disparidad | — | — |
| `voc_b2_privilege-noun_036` | **privilege (noun)** | *noun* | — | privilegio | — | — |
| `voc_b2_empowerment_037` | **empowerment** | *noun* | — | empoderamiento | — | — |
| `voc_b2_exploitation_038` | **exploitation** | *noun* | — | explotación | — | — |
| `voc_b2_oppression_039` | **oppression** | *noun* | — | opresión | — | — |

### Semana 3: B2 · Semana 3 – Cambio, tecnología y procesos globales
Total de palabras en esta semana: **18**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b2_globalization_040` | **globalization** | *noun* | — | globalización | — | — |
| `voc_b2_urbanization_041` | **urbanization** | *noun* | — | urbanización | — | — |
| `voc_b2_industrialization_042` | **industrialization** | *noun* | — | industrialización | — | — |
| `voc_b2_digitalization_043` | **digitalization** | *noun* | — | digitalización | — | — |
| `voc_b2_automation_044` | **automation** | *noun* | — | automatización | — | — |
| `voc_b2_disruption_045` | **disruption** | *noun* | — | disrupción | — | — |
| `voc_b2_innovation_046` | **innovation** | *noun* | — | innovación | — | — |
| `voc_b2_obsolete_047` | **obsolete** | *noun* | — | obsoleto | — | — |
| `voc_b2_paradigm_048` | **paradigm** | *noun* | — | paradigma | — | — |
| `voc_b2_hypothesis_049` | **hypothesis** | *noun* | — | hipótesis | — | — |
| `voc_b2_methodology_050` | **methodology** | *noun* | — | metodología | — | — |
| `voc_b2_correlation_051` | **correlation** | *noun* | — | correlación | — | — |
| `voc_b2_causation_052` | **causation** | *noun* | — | causalidad | — | — |
| `voc_b2_variable-noun_053` | **variable (noun)** | *noun* | — | variable | — | — |
| `voc_b2_empirical_054` | **empirical** | *adjective* | — | empírico | — | — |
| `voc_b2_qualitative_055` | **qualitative** | *adjective* | — | cualitativo | — | — |
| `voc_b2_quantitative_056` | **quantitative** | *adjective* | — | cuantitativo | — | — |
| `voc_b2_synthesis_057` | **synthesis** | *noun* | — | síntesis | — | — |

### Semana 4: B2 · Semana 4 – Conectores formales de escritura académica
Total de palabras en esta semana: **15**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b2_notwithstanding_058` | **notwithstanding** | *adverb* | — | no obstante | — | — |
| `voc_b2_albeit_059` | **albeit** | *conjunction* | — | aunque/si bien | — | — |
| `voc_b2_thereby_060` | **thereby** | *conjunction* | — | de ese modo | — | — |
| `voc_b2_hitherto_061` | **hitherto** | *conjunction* | — | hasta ahora | — | — |
| `voc_b2_henceforth_062` | **henceforth** | *conjunction* | — | de aquí en adelante | — | — |
| `voc_b2_insofar-as_063` | **insofar as** | *conjunction* | — | en la medida en que | — | — |
| `voc_b2_to-the-extent-that_064` | **to the extent that** | *conjunction* | — | en la medida en que | — | — |
| `voc_b2_in-light-of_065` | **in light of** | *conjunction* | — | a la luz de | — | — |
| `voc_b2_with-regard-to_066` | **with regard to** | *conjunction* | — | con respecto a | — | — |
| `voc_b2_in-relation-to_067` | **in relation to** | *conjunction* | — | en relación con | — | — |
| `voc_b2_by-virtue-of_068` | **by virtue of** | *conjunction* | — | en virtud de | — | — |
| `voc_b2_for-the-sake-of_069` | **for the sake of** | *conjunction* | — | por el bien de | — | — |
| `voc_b2_as-a-consequence-of_070` | **as a consequence of** | *conjunction* | — | como consecuencia de | — | — |
| `voc_b2_conversely_071` | **conversely** | *conjunction* | — | por el contrario | — | — |
| `voc_b2_notably_072` | **notably** | *adverb* | — | notablemente | — | — |

### Semana 5: B2 · Semana 5 – Liderazgo, estrategia y conceptos académicos
Total de palabras en esta semana: **12**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b2_abstract_073` | **abstract** | *adjective* | — | abstracto / teórico | — | — |
| `voc_b2_inherent_074` | **inherent** | *adjective* | — | inherente / intrínseco | — | — |
| `voc_b2_scrutinise_075` | **scrutinise** | *verb* | — | examinar detalladamente / escudriñar | — | — |
| `voc_b2_unprecedented_076` | **unprecedented** | *adjective* | — | sin precedentes | — | — |
| `voc_b2_ethical_077` | **ethical** | *adjective* | — | ético / moral | — | — |
| `voc_b2_leadership_078` | **leadership** | *noun* | — | liderazgo / dirección | — | — |
| `voc_b2_strategy_079` | **strategy** | *noun* | — | estrategia | — | — |
| `voc_b2_merger_080` | **merger** | *noun* | — | fusión empresarial | — | — |
| `voc_b2_acquisition_081` | **acquisition** | *noun* | — | adquisición empresarial | — | — |
| `voc_b2_accountability_082` | **accountability** | *noun* | — | rendición de cuentas / responsabilidad | — | — |
| `voc_b2_transparency_083` | **transparency** | *noun* | — | transparencia | — | — |
| `voc_b2_compliance_084` | **compliance** | *noun* | — | cumplimiento normativo | — | — |

### 📖 Lecturas de Comprensión · Nivel B2

#### The Ethical Dilemma of Advanced Artificial Intelligence (`rdg_b2_001`)
- **Nivel:** B2 • **Semana Asignada:** Semana 5 • **Dificultad:** 4/5
- **Vocabulario Enlazado (10 términos):** `voc_b2_ambiguity_011`, `voc_b2_paradox_012`, `voc_b2_implication_003`, `voc_b2_scrutinise_075`, `voc_b2_ethical_077`, `voc_b2_unprecedented_076`, `voc_b2_abstract_073`, `voc_b2_inherent_074`, `voc_b1_figure-out_014`, `voc_b2_automation_044`

**Texto en Inglés:**
> As machine learning architectures grow increasingly sophisticated, society faces unprecedented philosophical and practical challenges. While autonomous systems can analyze vast quantities of data and identify subtle patterns beyond human capability, they also introduce inherent risks. The problem of algorithmic opacity makes it difficult to scrutinise decision-making processes, creating moral ambiguity. Furthermore, questions of ethical accountability arise when automated systems cause unintended harm. Scholars argue that without rigorous transparency and multidisciplinary oversight, the technological transformation may exacerbate existing societal inequalities rather than resolve them.

**Traducción al Español:**
> *A medida que las arquitecturas de aprendizaje automático se vuelven cada vez más sofisticadas, la sociedad enfrenta desafíos filosóficos y prácticos sin precedentes. Si bien los sistemas autónomos pueden analizar grandes cantidades de datos e identificar patrones sutiles más allá de la capacidad humana, también introducen riesgos inherentes. El problema de la opacidad algorítmica dificulta escudriñar los procesos de toma de decisiones, creando ambigüedad moral. Además, surgen dudas sobre la responsabilidad ética cuando los sistemas automatizados causan daños imprevistos. Los académicos sostienen que sin una supervisión multidisciplinaria y una transparencia rigurosa, la transformación tecnológica puede exacerbar las desigualdades sociales existentes en lugar de resolverlas.*

**Preguntas de Comprensión:**
1. **What is the main concern regarding algorithmic opacity mentioned in the text?**
   - ✅ It makes it difficult to scrutinise decision-making processes
   - ▫️ It decreases the processing speed of machine learning systems
   - ▫️ It completely prevents computers from analyzing large amounts of data
   *Explicación:* The author explicitly states that algorithmic opacity makes it difficult to scrutinise decision-making processes, leading to moral ambiguity.

2. **According to the passage, what is required to avoid exacerbating societal inequalities?**
   - ✅ Rigorous transparency and multidisciplinary oversight
   - ▫️ Stopping all computer science research worldwide
   - ▫️ Lowering the cost of computer hardware for schools
   *Explicación:* The passage concludes that rigorous transparency and multidisciplinary oversight are necessary to prevent tech transformation from exacerbating inequalities.

#### Strategic Leadership in International Mergers (`rdg_b2_002`)
- **Nivel:** B2 • **Semana Asignada:** Semana 5 • **Dificultad:** 4/5
- **Vocabulario Enlazado (10 términos):** `voc_b2_leadership_078`, `voc_b2_strategy_079`, `voc_b2_merger_080`, `voc_b2_acquisition_081`, `voc_b2_accountability_082`, `voc_b2_transparency_083`, `voc_b2_compliance_084`, `voc_a2_stakeholder_163`, `voc_b1_shareholder_186`, `voc_b1_look-forward-to_002`

**Texto en Inglés:**
> Navigating cross-border corporate mergers requires extraordinary strategic leadership and cultural dexterity. When multinational corporations consolidate operations, executive management must harmonize distinct organizational cultures while ensuring regulatory compliance across multiple jurisdictions. Fostering transparency and corporate accountability is essential to maintain investor confidence and satisfy diverse stakeholders. Without clear communication and meticulous due diligence, cultural friction and strategic misalignment can jeopardize even the most promising acquisition. Sustainable corporate growth depends not merely on financial synergy, but on ethical governance and human talent retention.

**Traducción al Español:**
> *Gestionar fusiones corporativas transfronterizas requiere un liderazgo estratégico extraordinario y destreza cultural. Cuando las empresas multinacionales consolidan sus operaciones, la dirección ejecutiva debe armonizar culturas organizacionales distintas garantizando al mismo tiempo el cumplimiento normativo en múltiples jurisdicciones. Fomentar la transparencia y la responsabilidad corporativa es esencial para mantener la confianza de los inversores y satisfacer a los diferentes grupos de interés. Sin una comunicación clara y una debida diligencia meticulosa, la fricción cultural y la desalineación estratégica pueden poner en peligro incluso la adquisición más prometedora. El crecimiento corporativo sostenible depende no solo de la sinergia financiera, sino de la gobernanza ética y la retención del talento humano.*

**Preguntas de Comprensión:**
1. **What is essential to maintain investor confidence during international mergers?**
   - ✅ Fostering transparency and corporate accountability
   - ▫️ Doubling advertising expenditures immediately
   - ▫️ Eliminating human resources departments
   *Explicación:* The text highlights that fostering transparency and corporate accountability is essential to maintain investor confidence and satisfy diverse stakeholders.

2. **According to the author, what does sustainable corporate growth depend upon?**
   - ✅ Ethical governance and talent retention alongside financial synergy
   - ▫️ Solely on maximizing short-term quarterly stock valuations
   - ▫️ Replacing senior leadership with artificial intelligence algorithms
   *Explicación:* The passage states that sustainable growth depends not merely on financial synergy, but on ethical governance and human talent retention.

### 📝 Prompts de Expresión Escrita B2 (Writing Prompts)

Tareas de producción textual libre con requerimientos de extensión (120-200 palabras) y rúbrica docente para retroalimentación.

#### Should social media companies be responsible for the mental health effects of their platforms? (`wrt_b2_opinion_001`)
- **Tipo de texto:** *opinion_essay*
- **Extensión requerida:** 150 – 220 palabras
- **Gramática objetivo:** Present Perfect, Passive Voice, Discourse markers (however, moreover, on the other hand)
**Instrucciones para el estudiante:**
> Write a structured opinion essay of 150-200 words. State your position clearly in the introduction, support it with at least two reasons, address one counterargument, and write a brief conclusion.

*Traducción del tema:* ¿Deberían las redes sociales ser responsables de los efectos de sus plataformas en la salud mental?

**Criterios de Evaluación Docente / Rúbrica:**
- 📌 Estructura: ¿tiene introducción, desarrollo y conclusión claros?
- 📌 Coherencia: ¿las ideas siguen un orden lógico con conectores adecuados?
- 📌 Gramática: ¿hay errores recurrentes de tiempo verbal, concordancia o voz pasiva?
- 📌 Vocabulario: ¿usa vocabulario de nivel B2 (matices, no solo palabras básicas)?
- 📌 Argumentación: ¿aborda al menos un contraargumento, como se pidió?

#### Is it better to specialize in one skill or to have knowledge in many different areas? (`wrt_b2_opinion_002`)
- **Tipo de texto:** *opinion_essay*
- **Extensión requerida:** 150 – 220 palabras
- **Gramática objetivo:** Comparatives and Superlatives, Second Conditional
**Instrucciones para el estudiante:**
> Write 150-200 words comparing both approaches before giving your own opinion. Use at least one comparative structure and one conditional sentence.

*Traducción del tema:* ¿Es mejor especializarse en una habilidad o tener conocimientos en muchas áreas distintas?

**Criterios de Evaluación Docente / Rúbrica:**
- 📌 ¿Compara ambas posturas antes de dar su opinión, como se pidió?
- 📌 ¿Usa al menos una estructura comparativa y una oracional condicional?
- 📌 ¿El argumento final está bien justificado, no solo afirmado?

#### Write a formal email to a company complaining about a defective product and requesting a full refund. (`wrt_b2_formal_email_001`)
- **Tipo de texto:** *formal_email*
- **Extensión requerida:** 100 – 180 palabras
- **Gramática objetivo:** Passive Voice, Formal register vocabulary, Modal verbs (would, could)
**Instrucciones para el estudiante:**
> Use formal register throughout (no contractions, no informal phrases). Include a clear subject line, a polite but firm tone, and a specific request for resolution.

*Traducción del tema:* Escribe un correo formal a una empresa quejándote de un producto defectuoso y solicitando un reembolso completo.

**Criterios de Evaluación Docente / Rúbrica:**
- 📌 ¿Mantiene registro formal de principio a fin (sin contracciones ni coloquialismos)?
- 📌 ¿La solicitud es clara y específica (reembolso, no ambigua)?
- 📌 ¿El tono es firme pero cortés, apropiado para correspondencia comercial?

#### Describe a moment when you had to make a difficult decision. What happened, and what did you learn? (`wrt_b2_narrative_001`)
- **Tipo de texto:** *narrative*
- **Extensión requerida:** 180 – 250 palabras
- **Gramática objetivo:** Past Simple, Past Continuous, Past Perfect
**Instrucciones para el estudiante:**
> Write a narrative of 180-250 words using a clear timeline. Use a variety of past tenses (past simple, past continuous, past perfect) and at least two descriptive adjectives per paragraph.

*Traducción del tema:* Describe un momento en el que tuviste que tomar una decisión difícil. ¿Qué pasó y qué aprendiste?

**Criterios de Evaluación Docente / Rúbrica:**
- 📌 ¿Usa variedad de tiempos pasados correctamente (no solo pasado simple)?
- 📌 ¿La secuencia temporal es clara y fácil de seguir?
- 📌 ¿El vocabulario descriptivo va más allá de adjetivos básicos (good/bad/nice)?

#### Should university education be free for everyone? (`wrt_b2_argumentative_001`)
- **Tipo de texto:** *argumentative_essay*
- **Extensión requerida:** 200 – 260 palabras
- **Gramática objetivo:** Formal discourse connectors, Passive Voice, Conditional sentences
**Instrucciones para el estudiante:**
> Write 200-250 words presenting both sides of the argument with equal depth before stating your own conclusion. Use formal connectors (furthermore, nevertheless, consequently).

*Traducción del tema:* ¿Debería la educación universitaria ser gratuita para todos?

**Criterios de Evaluación Docente / Rúbrica:**
- 📌 ¿Presenta ambos lados del argumento con profundidad similar (no sesgado desde el inicio)?
- 📌 ¿Usa conectores formales de forma natural, no forzada?
- 📌 ¿La conclusión se deriva lógicamente de los argumentos presentados?

#### Describe a place that has had a significant impact on who you are today. (`wrt_b2_descriptive_001`)
- **Tipo de texto:** *descriptive*
- **Extensión requerida:** 150 – 220 palabras
- **Gramática objetivo:** Present Perfect, Relative Clauses, Descriptive adjectives
**Instrucciones para el estudiante:**
> Write 150-200 words with rich sensory detail (what you saw, heard, felt) and explain the emotional or personal significance, not just physical description.

*Traducción del tema:* Describe un lugar que ha tenido un impacto importante en quién eres hoy.

**Criterios de Evaluación Docente / Rúbrica:**
- 📌 ¿Va más allá de la descripción física hacia el significado personal?
- 📌 ¿Usa cláusulas relativas para añadir detalle sin oraciones cortadas?
- 📌 ¿El vocabulario descriptivo es variado y preciso?

#### Write a short report analyzing the advantages and disadvantages of remote work for a hypothetical company considering the switch. (`wrt_b2_report_001`)
- **Tipo de texto:** *formal_report*
- **Extensión requerida:** 200 – 280 palabras
- **Gramática objetivo:** Passive Voice, Formal register, Nominalization (e.g. 'the reduction of costs' instead of 'costs are reduced')
**Instrucciones para el estudiante:**
> Use report structure with clear headings (Introduction, Advantages, Disadvantages, Recommendation). Maintain an objective, formal tone throughout.

*Traducción del tema:* Escribe un informe breve analizando las ventajas y desventajas del trabajo remoto para una empresa hipotética que considera el cambio.

**Criterios de Evaluación Docente / Rúbrica:**
- 📌 ¿Sigue la estructura de informe pedida, con encabezados claros?
- 📌 ¿El tono se mantiene objetivo, sin opiniones personales sin fundamentar?
- 📌 ¿La recomendación final se basa en los puntos desarrollados antes?

#### Do you think artificial intelligence will create more jobs than it eliminates? (`wrt_b2_opinion_003`)
- **Tipo de texto:** *opinion_essay*
- **Extensión requerida:** 180 – 220 palabras
- **Gramática objetivo:** Passive Voice, Future forms (will, going to), Discourse markers
**Instrucciones para el estudiante:**
> Write 180-220 words. Present your position with two supporting arguments, acknowledge the opposing view briefly, and conclude with your overall judgment.

*Traducción del tema:* ¿Crees que la inteligencia artificial creará más empleos de los que elimina?

**Criterios de Evaluación Docente / Rúbrica:**
- 📌 ¿La postura queda clara desde el inicio?
- 📌 ¿Reconoce la postura opuesta sin abandonar su propio argumento?
- 📌 ¿Usa vocabulario relacionado con tecnología/economía de forma precisa?

#### Write a formal email requesting information about a professional certification course, including questions about cost, duration, and schedule. (`wrt_b2_formal_email_002`)
- **Tipo de texto:** *formal_email*
- **Extensión requerida:** 90 – 150 palabras
- **Gramática objetivo:** Indirect questions, Modal verbs (would, could), Formal register
**Instrucciones para el estudiante:**
> Use formal greetings and closings. Include at least three specific, well-formed questions using indirect question structure (e.g., 'I would like to know whether...').

*Traducción del tema:* Escribe un correo formal solicitando información sobre un curso de certificación profesional, incluyendo preguntas sobre costo, duración y horario.

**Criterios de Evaluación Docente / Rúbrica:**
- 📌 ¿Las preguntas usan estructura de pregunta indirecta correctamente (no 'What is the cost?' suelto)?
- 📌 ¿El registro formal se mantiene en saludo y despedida?
- 📌 ¿Las tres preguntas pedidas están presentes y son específicas?

#### Write about a time you had to adapt quickly to an unexpected change. (`wrt_b2_narrative_002`)
- **Tipo de texto:** *narrative*
- **Extensión requerida:** 180 – 230 palabras
- **Gramática objetivo:** Reported Speech, Third Conditional, Past tenses
**Instrucciones para el estudiante:**
> Write 180-230 words. Include direct or reported speech at least once, and use at least one third conditional sentence to reflect on what could have happened differently.

*Traducción del tema:* Escribe sobre un momento en que tuviste que adaptarte rápidamente a un cambio inesperado.

**Criterios de Evaluación Docente / Rúbrica:**
- 📌 ¿Incluye discurso directo o reportado de forma natural, no forzada?
- 📌 ¿La oración de tercer condicional está gramaticalmente correcta?
- 📌 ¿La reflexión final aporta algo más allá de narrar los hechos?

#### Is it ethical for companies to use personal data to target advertising? (`wrt_b2_argumentative_002`)
- **Tipo de texto:** *argumentative_essay*
- **Extensión requerida:** 200 – 260 palabras
- **Gramática objetivo:** Formal discourse connectors, Passive Voice, Abstract nouns
**Instrucciones para el estudiante:**
> Write 200-250 words. Address at least one ethical principle explicitly (e.g., privacy, consent, transparency) and support your conclusion with a specific example.

*Traducción del tema:* ¿Es ético que las empresas usen datos personales para dirigir publicidad?

**Criterios de Evaluación Docente / Rúbrica:**
- 📌 ¿Menciona explícitamente al menos un principio ético (privacidad, consentimiento, transparencia)?
- 📌 ¿El ejemplo específico respalda de forma clara la conclusión?
- 📌 ¿El vocabulario abstracto se usa con precisión, no de forma vaga?

#### Describe a person who has significantly influenced your professional or personal development. (`wrt_b2_descriptive_002`)
- **Tipo de texto:** *descriptive*
- **Extensión requerida:** 150 – 220 palabras
- **Gramática objetivo:** Relative Clauses, Present Perfect, Descriptive adjectives
**Instrucciones para el estudiante:**
> Write 150-200 words. Go beyond physical description — explain specific actions or words from this person that had an impact, using relative clauses to add detail.

*Traducción del tema:* Describe a una persona que ha influido significativamente en tu desarrollo profesional o personal.

**Criterios de Evaluación Docente / Rúbrica:**
- 📌 ¿Explica impacto concreto (acciones/palabras), no solo cualidades genéricas ('kind', 'nice')?
- 📌 ¿Usa cláusulas relativas para añadir detalle con fluidez?
- 📌 ¿El texto tiene una conclusión que cierra la reflexión, no solo se corta?

#### Write a short report evaluating whether your (hypothetical) company should invest in employee wellness programs. (`wrt_b2_report_002`)
- **Tipo de texto:** *formal_report*
- **Extensión requerida:** 200 – 280 palabras
- **Gramática objetivo:** Nominalization, Passive Voice, Formal register
**Instrucciones para el estudiante:**
> Use headings (Introduction, Findings, Recommendation). Support the recommendation with at least two specific reasons, maintaining an objective tone throughout.

*Traducción del tema:* Escribe un informe breve evaluando si tu empresa (hipotética) debería invertir en programas de bienestar para empleados.

**Criterios de Evaluación Docente / Rúbrica:**
- 📌 ¿Sigue la estructura de informe con encabezados claros?
- 📌 ¿La recomendación se apoya en al menos dos razones específicas, no genéricas?
- 📌 ¿El tono se mantiene objetivo, evitando primera persona informal ('I think', 'I feel')?

---

## ✍️ Hoja de Verificación y Aprobación Docente

El cuerpo docente certifica que los contenidos aquí descritos han sido revisados en cuanto a:
1. **Pertinencia de nivel CEFR:** El léxico y las estructuras gramaticales corresponden fielmente a los descriptores oficiales de A1, A2, B1 y B2.
2. **Calidad de traducción:** Las acepciones al español reflejan el uso auténtico y funcional que un hispanohablante requiere.
3. **Naturalidad contextual:** Las oraciones modelo representan inglés contemporáneo, libre de arcaísmos o traducciones literales forzadas.
4. **Cumplimiento de la regla $i+1$:** Todas las lecturas y ejercicios se encuentran asignados a semanas donde el léxico completo ha sido enseñado previamente.

| Nivel | Fecha de Revisión | Docente Revisor | Firma / Estado | Observaciones |
|---|---|---|---|---|
| **A1 (Principiante)** | ____/____/2026 | _________________________ | [  ] APROBADO  [  ] CORRECCIONES | ____________________ |
| **A2 (Elemental)** | ____/____/2026 | _________________________ | [  ] APROBADO  [  ] CORRECCIONES | ____________________ |
| **B1 (Intermedio)** | ____/____/2026 | _________________________ | [  ] APROBADO  [  ] CORRECCIONES | ____________________ |
| **B2 (Avanzado)** | ____/____/2026 | _________________________ | [  ] APROBADO  [  ] CORRECCIONES | ____________________ |

© 2026 Escuela de Inglés Americana. Todos los derechos reservados.