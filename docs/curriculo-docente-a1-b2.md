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
| `voc_a1_laptop_001` | **laptop** | *noun* | `/ˈlæpˌtɑp/` | laptop | I work on my laptop every day. | Trabajo en mi laptop todos los días. |
| `voc_a1_tablet_001` | **tablet** | *noun* | `/ˈtæblət/` | tableta | My daughter watches videos on her tablet. | Mi hija ve videos en su tableta. |
| `voc_a1_smartphone_001` | **smartphone** | *noun* | `/ˈsmɑrtˌfoʊn/` | teléfono inteligente | I lost my smartphone yesterday. | Perdí mi teléfono inteligente ayer. |
| `voc_a1_screen_001` | **screen** | *noun* | `/skrin/` | pantalla | The screen is very bright. | La pantalla es muy brillante. |
| `voc_a1_keyboard_001` | **keyboard** | *noun* | `/ˈkiˌbɔrd/` | teclado | My keyboard is not working. | Mi teclado no funciona. |
| `voc_a1_mouse_002` | **mouse (device)** | *noun* | `/maʊs/` | ratón (dispositivo) | I need a new mouse for my computer. | Necesito un ratón nuevo para mi computadora. |
| `voc_a1_password_001` | **password** | *noun* | `/ˈpæsˌwɜrd/` | contraseña | I forgot my password. | Olvidé mi contraseña. |
| `voc_a1_internet_001` | **internet** | *noun* | `/ˈɪntərˌnɛt/` | internet | The internet is very slow today. | El internet está muy lento hoy. |
| `voc_a1_website_001` | **website** | *noun* | `/ˈwɛbˌsaɪt/` | sitio web | I found this recipe on a website. | Encontré esta receta en un sitio web. |
| `voc_a1_email_001` | **email** | *noun* | `/ˈiˌmeɪl/` | correo electrónico | I sent you an email this morning. | Te envié un correo electrónico esta mañana. |
| `voc_a1_message_001` | **message** | *noun* | `/ˈmɛsɪdʒ/` | mensaje | She sent me a nice message. | Ella me envió un mensaje lindo. |
| `voc_a1_text-message_001` | **text message** | *noun* | `/tɛkst ˈmɛsɪdʒ/` | mensaje de texto | I got your text message. | Recibí tu mensaje de texto. |
| `voc_a1_app-application_001` | **app / application** | *noun* | `/æp/` | aplicación | I use this app to learn English. | Uso esta aplicación para aprender inglés. |
| `voc_a1_social-media_001` | **social media** | *noun* | `/ˈsoʊʃəl ˈmidiə/` | redes sociales | She spends a lot of time on social media. | Ella pasa mucho tiempo en redes sociales. |
| `voc_a1_photo-picture_001` | **photo / picture** | *noun* | `/ˈfoʊˌtoʊ/` | foto | Can you take a photo of us? | ¿Puedes tomarnos una foto? |
| `voc_a1_video_001` | **video** | *noun* | `/ˈvɪdioʊ/` | video | We watched a funny video. | Vimos un video gracioso. |
| `voc_a1_camera_001` | **camera** | *noun* | `/ˈkæmərə/` | cámara | I bought a new camera. | Compré una cámara nueva. |
| `voc_a1_printer_001` | **printer** | *noun* | `/ˈprɪntər/` | impresora | The printer is out of paper. | La impresora se quedó sin papel. |
| `voc_a1_charger_001` | **charger** | *noun* | `/ˈtʃɑrdʒər/` | cargador | Can I borrow your charger? | ¿Me prestas tu cargador? |
| `voc_a1_battery_001` | **battery** | *noun* | `/ˈbætəri/` | batería | My phone battery is low. | La batería de mi teléfono está baja. |
| `voc_a1_wifi_001` | **wifi** | *noun* | `/ˈwaɪˌfaɪ/` | wifi | What is the wifi password? | ¿Cuál es la contraseña del wifi? |
| `voc_a1_download_001` | **download** | *verb* | `/ˈdaʊnˌloʊd/` | descargar | I downloaded a new app. | Descargué una nueva aplicación. |
| `voc_a1_upload_001` | **upload** | *verb* | `/ˈʌpˌloʊd/` | subir (archivo) | She uploaded the photos online. | Ella subió las fotos en línea. |
| `voc_a1_click_001` | **click** | *verb* | `/klɪk/` | hacer clic | Click here to continue. | Haz clic aquí para continuar. |
| `voc_a1_type_001` | **type (keyboard)** | *verb* | `/taɪp/` | escribir (teclado) | She types very fast. | Ella escribe muy rápido (en el teclado). |
| `voc_a1_search_001` | **search** | *verb* | `/sɜrtʃ/` | buscar | I will search for the answer online. | Buscaré la respuesta en línea. |
| `voc_a1_save_002` | **save (file)** | *verb* | `/seɪv/` | guardar | Don't forget to save your work. | No olvides guardar tu trabajo. |
| `voc_a1_delete_001` | **delete** | *verb* | `/dɪˈlit/` | borrar | I deleted the old photos. | Borré las fotos viejas. |
| `voc_a1_share_002` | **share (online)** | *verb* | `/ʃɛr/` | compartir | She shared the article with me. | Ella compartió el artículo conmigo. |
| `voc_a1_post_001` | **post (verb)** | *verb* | `/poʊst/` | publicar | He posted a photo of his trip. | Él publicó una foto de su viaje. |
| `voc_a1_comment_001` | **comment** | *noun* | `/ˈkɑmɛnt/` | comentar/comentario | Please leave a comment. | Por favor deja un comentario. |
| `voc_a1_like_002` | **like (social media)** | *noun* | `/laɪk/` | dar me gusta | I liked your new photo. | Le di "me gusta" a tu foto nueva. |
| `voc_a1_follow_001` | **follow (online)** | *verb* | `/ˈfɑloʊ/` | seguir | I follow her on social media. | La sigo en redes sociales. |
| `voc_a1_network_001` | **network** | *noun* | `/ˈnɛtˌwɜrk/` | red | Our home network is very fast. | Nuestra red de casa es muy rápida. |
| `voc_a1_file_001` | **file** | *noun* | `/faɪl/` | archivo | I can't open this file. | No puedo abrir este archivo. |
| `voc_a1_folder_001` | **folder** | *noun* | `/ˈfoʊldər/` | carpeta | Put the photos in this folder. | Pon las fotos en esta carpeta. |
| `voc_a1_document_001` | **document** | *noun* | `/ˈdɑkjəmənt/` | documento | Please send me the document. | Por favor envíame el documento. |
| `voc_a1_software_001` | **software** | *noun* | `/ˈsɔfˌwɛr/` | software | We need to update the software. | Necesitamos actualizar el software. |
| `voc_a1_update_001` | **update** | *noun* | `/ˈʌpˌdeɪt/` | actualizar/actualización | There is a new update for the app. | Hay una nueva actualización para la aplicación. |
| `voc_a1_install_001` | **install** | *verb* | `/ɪnˈstɔl/` | instalar | I installed a new program. | Instalé un programa nuevo. |
| `voc_a1_soccer-football_001` | **soccer / football** | *noun* | `/ˈsɑkər/` | fútbol | The kids play soccer after school. | Los niños juegan fútbol después de la escuela. |
| `voc_a1_basketball_001` | **basketball** | *noun* | `/ˈbæskɪtˌbɔl/` | baloncesto | He plays basketball every weekend. | Él juega baloncesto cada fin de semana. |
| `voc_a1_baseball_001` | **baseball** | *noun* | `/ˈbeɪsˌbɔl/` | béisbol | We watched a baseball game. | Vimos un partido de béisbol. |
| `voc_a1_tennis_001` | **tennis** | *noun* | `/ˈtɛnɪs/` | tenis | She plays tennis very well. | Ella juega tenis muy bien. |
| `voc_a1_volleyball_001` | **volleyball** | *noun* | `/ˈvɑliˌbɔl/` | voleibol | We played volleyball on the beach. | Jugamos voleibol en la playa. |
| `voc_a1_golf_001` | **golf** | *noun* | `/gɔlf/` | golf | My father plays golf on Sundays. | Mi padre juega golf los domingos. |
| `voc_a1_swimming_001` | **swimming** | *noun* | `/ˈswɪmɪŋ/` | natación | Swimming is good exercise. | Nadar es buen ejercicio. |
| `voc_a1_running_001` | **running** | *noun* | `/ˈrʌnɪŋ/` | correr (actividad) | Running helps me relax. | Correr me ayuda a relajarme. |
| `voc_a1_cycling_001` | **cycling** | *noun* | `/ˈsaɪklɪŋ/` | ciclismo | We go cycling on weekends. | Salimos a andar en bicicleta los fines de semana. |
| `voc_a1_hiking_001` | **hiking** | *noun* | `/ˈhaɪkɪŋ/` | senderismo | We went hiking in the mountains. | Fuimos de senderismo a las montañas. |
| `voc_a1_dancing_001` | **dancing** | *noun* | `/ˈdænsɪŋ/` | baile | Dancing makes me happy. | Bailar me hace feliz. |
| `voc_a1_painting_001` | **painting (hobby)** | *noun* | `/ˈpeɪntɪŋ/` | pintura (afición) | She loves painting on weekends. | A ella le encanta pintar los fines de semana. |
| `voc_a1_drawing_001` | **drawing** | *noun* | `/ˈdrɔɪŋ/` | dibujo | He is good at drawing. | Él es bueno para dibujar. |
| `voc_a1_photography_001` | **photography** | *noun* | `/fəˈtɑgrəfi/` | fotografía | Photography is his passion. | La fotografía es su pasión. |
| `voc_a1_gardening_001` | **gardening** | *noun* | `/ˈgɑrdənɪŋ/` | jardinería | My mother enjoys gardening. | A mi madre le gusta la jardinería. |
| `voc_a1_chess_001` | **chess** | *noun* | `/tʃɛs/` | ajedrez | My father taught me to play chess. | Mi padre me enseñó a jugar ajedrez. |
| `voc_a1_cards_001` | **cards (game)** | *noun* | `/kɑrdz/` | cartas | We played cards after dinner. | Jugamos cartas después de la cena. |
| `voc_a1_video-games_001` | **video games** | *noun* | `/ˈvɪdioʊ geɪmz/` | videojuegos | My brother loves video games. | A mi hermano le encantan los videojuegos. |
| `voc_a1_board-games_001` | **board games** | *noun* | `/bɔrd geɪmz/` | juegos de mesa | We play board games on family night. | Jugamos juegos de mesa en la noche familiar. |
| `voc_a1_fishing_001` | **fishing** | *noun* | `/ˈfɪʃɪŋ/` | pesca | My grandfather goes fishing every summer. | Mi abuelo va de pesca cada verano. |
| `voc_a1_camping_001` | **camping** | *noun* | `/ˈkæmpɪŋ/` | acampar | We went camping near the lake. | Fuimos a acampar cerca del lago. |
| `voc_a1_yoga_001` | **yoga** | *noun* | `/ˈjoʊgə/` | yoga | She practices yoga every morning. | Ella practica yoga todas las mañanas. |
| `voc_a1_team_001` | **team** | *noun* | `/tim/` | equipo | Our team won the game. | Nuestro equipo ganó el partido. |
| `voc_a1_player_001` | **player** | *noun* | `/ˈpleɪər/` | jugador | He is the best player on the team. | Él es el mejor jugador del equipo. |
| `voc_a1_coach_001` | **coach** | *noun* | `/koʊtʃ/` | entrenador | The coach trains us every week. | El entrenador nos entrena cada semana. |
| `voc_a1_referee_001` | **referee** | *noun* | `/ˌrɛfəˈri/` | árbitro | The referee stopped the game. | El árbitro detuvo el partido. |
| `voc_a1_match_001` | **match** | *noun* | `/mætʃ/` | partido | We watched the match on TV. | Vimos el partido en la televisión. |
| `voc_a1_game_001` | **game** | *noun* | `/geɪm/` | juego/partido | The game starts at eight. | El juego empieza a las ocho. |
| `voc_a1_score_001` | **score** | *noun* | `/skɔr/` | puntuación | What is the score right now? | ¿Cuál es la puntuación ahora? |
| `voc_a1_win_001` | **win** | *verb* | `/wɪn/` | ganar | I hope our team wins today. | Espero que nuestro equipo gane hoy. |
| `voc_a1_tie_002` | **tie (game)** | *noun* | `/taɪ/` | empate | The game ended in a tie. | El partido terminó en empate. |
| `voc_a1_championship_001` | **championship** | *noun* | `/ˈtʃæmpiənˌʃɪp/` | campeonato | They won the championship last year. | Ganaron el campeonato el año pasado. |
| `voc_a1_competition_001` | **competition** | *noun* | `/ˌkɑmpəˈtɪʃən/` | competencia | She entered the swimming competition. | Ella participó en la competencia de natación. |
| `voc_a1_ball_001` | **ball** | *noun* | `/bɔl/` | pelota | Throw me the ball. | Lánzame la pelota. |
| `voc_a1_goal_001` | **goal** | *noun* | `/goʊl/` | gol/meta | He scored the winning goal. | Él anotó el gol de la victoria. |
| `voc_a1_court_001` | **court (sports)** | *noun* | `/kɔrt/` | cancha | We play tennis on this court. | Jugamos tenis en esta cancha. |
| `voc_a1_stadium_001` | **stadium** | *noun* | `/ˈsteɪdiəm/` | estadio | The stadium was full of fans. | El estadio estaba lleno de aficionados. |
| `voc_a1_song_001` | **song** | *noun* | `/sɔŋ/` | canción | This is my favorite song. | Esta es mi canción favorita. |
| `voc_a1_instrument_001` | **instrument (music)** | *noun* | `/ˈɪnstrəmənt/` | instrumento musical | Do you play any instrument? | ¿Tocas algún instrumento? |
| `voc_a1_guitar_001` | **guitar** | *noun* | `/gɪˈtɑr/` | guitarra | He plays the guitar very well. | Él toca muy bien la guitarra. |
| `voc_a1_piano_001` | **piano** | *noun* | `/piˈænoʊ/` | piano | She has piano lessons on Tuesdays. | Ella tiene clases de piano los martes. |
| `voc_a1_drum_001` | **drum** | *noun* | `/drʌm/` | tambor | My son wants to play the drums. | Mi hijo quiere tocar la batería. |
| `voc_a1_violin_001` | **violin** | *noun* | `/ˌvaɪəˈlɪn/` | violín | She learned to play the violin. | Ella aprendió a tocar el violín. |
| `voc_a1_band_001` | **band (music)** | *noun* | `/bænd/` | banda | My brother is in a band. | Mi hermano está en una banda. |
| `voc_a1_concert_001` | **concert** | *noun* | `/ˈkɑnsərt/` | concierto | We are going to a concert tonight. | Vamos a un concierto esta noche. |
| `voc_a1_movie-film_001` | **movie / film** | *noun* | `/ˈmuvi/` | película | We watched a great movie. | Vimos una gran película. |
| `voc_a1_tv-show_001` | **TV show** | *noun* | `/ˌtiˈvi ʃoʊ/` | programa de TV | This is my favorite TV show. | Este es mi programa de TV favorito. |
| `voc_a1_series_001` | **series** | *noun* | `/ˈsɪriz/` | serie | We watched the whole series in a weekend. | Vimos toda la serie en un fin de semana. |
| `voc_a1_episode_001` | **episode** | *noun* | `/ˈɛpəˌsoʊd/` | episodio | I watched the last episode last night. | Vi el último episodio anoche. |
| `voc_a1_channel_001` | **channel** | *noun* | `/ˈtʃænəl/` | canal | Change the channel, please. | Cambia el canal, por favor. |
| `voc_a1_program_001` | **program** | *noun* | `/ˈproʊˌgræm/` | programa | This program starts at nine. | Este programa empieza a las nueve. |
| `voc_a1_news_001` | **news** | *noun* | `/nuz/` | noticias | We watch the news every night. | Vemos las noticias todas las noches. |
| `voc_a1_cartoon_001` | **cartoon** | *noun* | `/kɑrˈtun/` | dibujos animados | The kids love this cartoon. | A los niños les encantan estos dibujos animados. |
| `voc_a1_comedy_001` | **comedy** | *noun* | `/ˈkɑmədi/` | comedia | I love watching comedy movies. | Me encanta ver películas de comedia. |
| `voc_a1_drama_001` | **drama** | *noun* | `/ˈdrɑmə/` | drama | This series is a drama. | Esta serie es un drama. |
| `voc_a1_horror-movie_001` | **horror movie** | *noun* | `/ˈhɔrər ˈmuvi/` | película de terror | She doesn't like horror movies. | A ella no le gustan las películas de terror. |
| `voc_a1_hobby_001` | **hobby** | *noun* | `/ˈhɑbi/` | pasatiempo | Reading is my favorite hobby. | Leer es mi pasatiempo favorito. |
| `voc_a1_interest_001` | **interest (hobby)** | *noun* | `/ˈɪntrəst/` | interés | Photography is one of his interests. | La fotografía es uno de sus intereses. |
| `voc_a1_free-time_001` | **free time** | *noun* | `/fri taɪm/` | tiempo libre | What do you do in your free time? | ¿Qué haces en tu tiempo libre? |
| `voc_a1_activity_001` | **activity** | *noun* | `/ækˈtɪvəti/` | actividad | We planned an outdoor activity. | Planeamos una actividad al aire libre. |
| `voc_a1_club_001` | **club** | *noun* | `/klʌb/` | club | She joined a book club. | Ella se unió a un club de lectura. |
| `voc_a1_member_001` | **member** | *noun* | `/ˈmɛmbər/` | miembro | I am a member of the gym. | Soy miembro del gimnasio. |
| `voc_a1_event_001` | **event** | *noun* | `/ɪˈvɛnt/` | evento | The event starts at seven. | El evento empieza a las siete. |
| `voc_a1_party_001` | **party** | *noun* | `/ˈpɑrti/` | fiesta | We had a great party last night. | Tuvimos una gran fiesta anoche. |
| `voc_a1_festival_001` | **festival** | *noun* | `/ˈfɛstəvəl/` | festival | We went to a music festival. | Fuimos a un festival de música. |

### Semana 17: Semana 17 – Herramientas, cantidades, dinero y salud
Total de palabras en esta semana: **109**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a1_tool_001` | **tool** | *noun* | `/tul/` | herramienta | I need a tool to fix this. | Necesito una herramienta para arreglar esto. |
| `voc_a1_hammer_001` | **hammer** | *noun* | `/ˈhæmər/` | martillo | He used a hammer to fix the shelf. | Él usó un martillo para arreglar el estante. |
| `voc_a1_nail_002` | **nail (tool)** | *noun* | `/neɪl/` | clavo | Pass me a nail, please. | Pásame un clavo, por favor. |
| `voc_a1_screwdriver_001` | **screwdriver** | *noun* | `/ˈskruˌdraɪvər/` | destornillador | I need a screwdriver for this. | Necesito un destornillador para esto. |
| `voc_a1_screw_001` | **screw** | *noun* | `/skru/` | tornillo | This screw is loose. | Este tornillo está flojo. |
| `voc_a1_saw_001` | **saw** | *noun* | `/sɔ/` | sierra | He cut the wood with a saw. | Él cortó la madera con una sierra. |
| `voc_a1_drill_001` | **drill** | *noun* | `/drɪl/` | taladro | I borrowed a drill from my neighbor. | Le pedí prestado un taladro a mi vecino. |
| `voc_a1_ladder_001` | **ladder** | *noun* | `/ˈlædər/` | escalera (de mano) | Be careful on the ladder. | Ten cuidado en la escalera. |
| `voc_a1_rope_001` | **rope** | *noun* | `/roʊp/` | cuerda | Tie the rope to the tree. | Ata la cuerda al árbol. |
| `voc_a1_tape_001` | **tape** | *noun* | `/teɪp/` | cinta | Use tape to close the box. | Usa cinta para cerrar la caja. |
| `voc_a1_glue_001` | **glue** | *noun* | `/glu/` | pegamento | I fixed it with glue. | Lo arreglé con pegamento. |
| `voc_a1_scissors_001` | **scissors** | *noun* | `/ˈsɪzərz/` | tijeras | Where are the scissors? | ¿Dónde están las tijeras? |
| `voc_a1_needle_001` | **needle** | *noun* | `/ˈnidəl/` | aguja | She sewed with a needle and thread. | Ella cosió con aguja e hilo. |
| `voc_a1_thread_001` | **thread** | *noun* | `/θrɛd/` | hilo | I need blue thread for this. | Necesito hilo azul para esto. |
| `voc_a1_machine_001` | **machine** | *noun* | `/məˈʃin/` | máquina | This machine is very old. | Esta máquina es muy vieja. |
| `voc_a1_engine_001` | **engine** | *noun* | `/ˈɛndʒɪn/` | motor | The engine makes a strange noise. | El motor hace un ruido extraño. |
| `voc_a1_wire_001` | **wire** | *noun* | `/ˈwaɪər/` | cable/alambre | Don't touch that wire. | No toques ese cable. |
| `voc_a1_pipe_001` | **pipe** | *noun* | `/paɪp/` | tubería | The pipe is leaking water. | La tubería tiene una fuga de agua. |
| `voc_a1_brick_001` | **brick** | *noun* | `/brɪk/` | ladrillo | The house is made of brick. | La casa está hecha de ladrillo. |
| `voc_a1_wood_001` | **wood** | *noun* | `/wʊd/` | madera | This table is made of wood. | Esta mesa está hecha de madera. |
| `voc_a1_metal_001` | **metal** | *noun* | `/ˈmɛtəl/` | metal | The door is made of metal. | La puerta está hecha de metal. |
| `voc_a1_plastic_001` | **plastic** | *noun* | `/ˈplæstɪk/` | plástico | This bottle is made of plastic. | Esta botella está hecha de plástico. |
| `voc_a1_glass_002` | **glass (material)** | *noun* | `/glæs/` | vidrio | Be careful, this is made of glass. | Ten cuidado, esto está hecho de vidrio. |
| `voc_a1_paper_001` | **paper** | *noun* | `/ˈpeɪpər/` | papel | I need a piece of paper. | Necesito una hoja de papel. |
| `voc_a1_cardboard_001` | **cardboard** | *noun* | `/ˈkɑrdˌbɔrd/` | cartón | The box is made of cardboard. | La caja está hecha de cartón. |
| `voc_a1_rubber_001` | **rubber** | *noun* | `/ˈrʌbər/` | goma | These boots are made of rubber. | Estas botas están hechas de goma. |
| `voc_a1_material_001` | **material** | *noun* | `/məˈtɪriəl/` | material | What material is this made of? | ¿De qué material está hecho esto? |
| `voc_a1_quantity-amount_001` | **quantity / amount** | *noun* | `/ˈkwɑntəti/` | cantidad | We need a large quantity of water. | Necesitamos una gran cantidad de agua. |
| `voc_a1_number_001` | **number** | *noun* | `/ˈnʌmbər/` | número | What is your phone number? | ¿Cuál es tu número de teléfono? |
| `voc_a1_pair_001` | **pair** | *noun* | `/pɛr/` | par | I bought a new pair of shoes. | Compré un par de zapatos nuevo. |
| `voc_a1_dozen_001` | **dozen** | *noun* | `/ˈdʌzən/` | docena | We need a dozen eggs. | Necesitamos una docena de huevos. |
| `voc_a1_piece_001` | **piece** | *noun* | `/pis/` | pedazo | Can I have a piece of cake? | ¿Puedo comer un pedazo de pastel? |
| `voc_a1_part_001` | **part** | *noun* | `/pɑrt/` | parte | This is an important part of the plan. | Esta es una parte importante del plan. |
| `voc_a1_whole_001` | **whole** | *noun* | `/hoʊl/` | entero | I ate the whole apple. | Me comí toda la manzana. |
| `voc_a1_percent_001` | **percent** | *noun* | `/pərˈsɛnt/` | porcentaje | Fifty percent of the class passed. | El cincuenta por ciento de la clase aprobó. |
| `voc_a1_price_001` | **price** | *noun* | `/praɪs/` | precio | The price is too high. | El precio es muy alto. |
| `voc_a1_cost_001` | **cost** | *noun* | `/kɔst/` | costo | The cost of living is high here. | El costo de vida es alto aquí. |
| `voc_a1_discount_001` | **discount** | *noun* | `/ˈdɪskaʊnt/` | descuento | I got a discount on this jacket. | Me dieron un descuento en esta chaqueta. |
| `voc_a1_sale_001` | **sale** | *noun* | `/seɪl/` | oferta/venta | The store is having a sale. | La tienda tiene una oferta. |
| `voc_a1_receipt_001` | **receipt** | *noun* | `/rɪˈsit/` | recibo | Keep the receipt, please. | Guarda el recibo, por favor. |
| `voc_a1_cash_001` | **cash** | *noun* | `/kæʃ/` | efectivo | I paid in cash. | Pagué en efectivo. |
| `voc_a1_credit-card_001` | **credit card** | *noun* | `/ˈkrɛdɪt kɑrd/` | tarjeta de crédito | I paid with my credit card. | Pagué con mi tarjeta de crédito. |
| `voc_a1_money_001` | **money** | *noun* | `/ˈmʌni/` | dinero | I don't have much money right now. | No tengo mucho dinero ahora. |
| `voc_a1_coin_001` | **coin** | *noun* | `/kɔɪn/` | moneda | I found a coin on the street. | Encontré una moneda en la calle. |
| `voc_a1_bill_002` | **bill (money)** | *noun* | `/bɪl/` | billete | She paid with a twenty-dollar bill. | Ella pagó con un billete de veinte dólares. |
| `voc_a1_change_001` | **change (money)** | *noun* | `/tʃeɪndʒ/` | cambio (dinero) | Here is your change. | Aquí está tu cambio. |
| `voc_a1_wallet_001` | **wallet** | *noun* | `/ˈwɑlɪt/` | billetera | I left my wallet at home. | Dejé mi billetera en casa. |
| `voc_a1_purse_001` | **purse** | *noun* | `/pɜrs/` | bolso | Her purse is on the chair. | Su bolso está en la silla. |
| `voc_a1_budget_001` | **budget** | *noun* | `/ˈbʌdʒɪt/` | presupuesto | We have a small budget this month. | Tenemos un presupuesto pequeño este mes. |
| `voc_a1_debt_001` | **debt** | *noun* | `/dɛt/` | deuda | They paid off their debt. | Pagaron su deuda por completo. |
| `voc_a1_loan_001` | **loan** | *noun* | `/loʊn/` | préstamo | We got a loan for the car. | Obtuvimos un préstamo para el carro. |
| `voc_a1_bank-account_001` | **bank account** | *noun* | `/bæŋk əˈkaʊnt/` | cuenta bancaria | I opened a new bank account. | Abrí una cuenta bancaria nueva. |
| `voc_a1_tax_001` | **tax** | *noun* | `/tæks/` | impuesto | We pay tax every year. | Pagamos impuestos cada año. |
| `voc_a1_insurance_001` | **insurance** | *noun* | `/ɪnˈʃʊrəns/` | seguro | Do you have health insurance? | ¿Tienes seguro médico? |
| `voc_a1_contract_001` | **contract** | *noun* | `/ˈkɑnˌtrækt/` | contrato | Read the contract carefully. | Lee el contrato con cuidado. |
| `voc_a1_business_001` | **business** | *noun* | `/ˈbɪznəs/` | negocio | She started her own business. | Ella inició su propio negocio. |
| `voc_a1_customer_001` | **customer** | *noun* | `/ˈkʌstəmər/` | cliente | The customer was very happy. | El cliente quedó muy contento. |
| `voc_a1_seller_001` | **seller** | *noun* | `/ˈsɛlər/` | vendedor | The seller gave me a good price. | El vendedor me dio un buen precio. |
| `voc_a1_buyer_001` | **buyer** | *noun* | `/ˈbaɪər/` | comprador | The buyer paid in cash. | El comprador pagó en efectivo. |
| `voc_a1_product_001` | **product** | *noun* | `/ˈprɑdʌkt/` | producto | This is a very good product. | Este es un producto muy bueno. |
| `voc_a1_service_001` | **service** | *noun* | `/ˈsɜrvɪs/` | servicio | The service here is excellent. | El servicio aquí es excelente. |
| `voc_a1_quality_001` | **quality** | *noun* | `/ˈkwɑləti/` | calidad | This shirt has good quality. | Esta camisa tiene buena calidad. |
| `voc_a1_brand_001` | **brand** | *noun* | `/brænd/` | marca | I like this brand of shoes. | Me gusta esta marca de zapatos. |
| `voc_a1_weight_001` | **weight** | *noun* | `/weɪt/` | peso | What is the weight of this box? | ¿Cuál es el peso de esta caja? |
| `voc_a1_measure_001` | **measure** | *verb* | `/ˈmɛʒər/` | medir | Measure the table before you buy it. | Mide la mesa antes de comprarla. |
| `voc_a1_length_001` | **length** | *noun* | `/lɛŋθ/` | longitud | What is the length of this table? | ¿Cuál es la longitud de esta mesa? |
| `voc_a1_width_001` | **width** | *noun* | `/wɪdθ/` | ancho | The width of the door is narrow. | El ancho de la puerta es estrecho. |
| `voc_a1_height_001` | **height** | *noun* | `/haɪt/` | altura | What is your height? | ¿Cuál es tu estatura? |
| `voc_a1_depth_001` | **depth** | *noun* | `/dɛpθ/` | profundidad | The depth of the pool is two meters. | La profundidad de la piscina es de dos metros. |
| `voc_a1_volume_001` | **volume** | *noun* | `/ˈvɑljum/` | volumen | Can you lower the volume, please? | ¿Puedes bajar el volumen, por favor? |
| `voc_a1_distance_001` | **distance** | *noun* | `/ˈdɪstəns/` | distancia | The distance to the city is short. | La distancia a la ciudad es corta. |
| `voc_a1_speed_001` | **speed** | *noun* | `/spid/` | velocidad | The car was driving at high speed. | El carro iba a alta velocidad. |
| `voc_a1_direction_001` | **direction** | *noun* | `/dəˈrɛkʃən/` | dirección (rumbo) | We are going in the wrong direction. | Vamos en la dirección equivocada. |
| `voc_a1_north_001` | **north** | *noun* | `/nɔrθ/` | norte | The wind is coming from the north. | El viento viene del norte. |
| `voc_a1_south_001` | **south** | *noun* | `/saʊθ/` | sur | We are driving south. | Vamos manejando hacia el sur. |
| `voc_a1_east_001` | **east** | *noun* | `/ist/` | este | The sun rises in the east. | El sol sale por el este. |
| `voc_a1_west_001` | **west** | *noun* | `/wɛst/` | oeste | The sun sets in the west. | El sol se pone por el oeste. |
| `voc_a1_medicine_001` | **medicine** | *noun* | `/ˈmɛdəsən/` | medicina | Take your medicine after lunch. | Toma tu medicina después del almuerzo. |
| `voc_a1_pill_001` | **pill** | *noun* | `/pɪl/` | pastilla | I need to take a pill. | Necesito tomar una pastilla. |
| `voc_a1_pharmacy_001` | **pharmacy** | *noun* | `/ˈfɑrməsi/` | farmacia | I bought this at the pharmacy. | Compré esto en la farmacia. |
| `voc_a1_appointment_001` | **appointment** | *noun* | `/əˈpɔɪntmənt/` | cita | I have a doctor's appointment tomorrow. | Tengo una cita médica mañana. |
| `voc_a1_injury_001` | **injury** | *noun* | `/ˈɪndʒəri/` | lesión | His injury is not serious. | Su lesión no es grave. |
| `voc_a1_pain_001` | **pain** | *noun* | `/peɪn/` | dolor | I have pain in my back. | Tengo dolor en la espalda. |
| `voc_a1_headache_001` | **headache** | *noun* | `/ˈhɛˌdeɪk/` | dolor de cabeza | I have a headache today. | Tengo dolor de cabeza hoy. |
| `voc_a1_fever_001` | **fever** | *noun* | `/ˈfivər/` | fiebre | The baby has a fever. | El bebé tiene fiebre. |
| `voc_a1_cough_001` | **cough** | *noun* | `/kɔf/` | tos | She has a bad cough. | Ella tiene una tos fuerte. |
| `voc_a1_cold_002` | **cold (illness)** | *noun* | `/koʊld/` | resfriado | I have a cold this week. | Tengo un resfriado esta semana. |
| `voc_a1_flu_001` | **flu** | *noun* | `/flu/` | gripe | He is home with the flu. | Él está en casa con gripe. |
| `voc_a1_ambulance_001` | **ambulance** | *noun* | `/ˈæmbjələns/` | ambulancia | The ambulance arrived quickly. | La ambulancia llegó rápido. |
| `voc_a1_emergency_001` | **emergency** | *noun* | `/ɪˈmɜrdʒənsi/` | emergencia | Call this number in an emergency. | Llama a este número en una emergencia. |
| `voc_a1_accident_001` | **accident** | *noun* | `/ˈæksɪdənt/` | accidente | There was an accident on the highway. | Hubo un accidente en la autopista. |
| `voc_a1_patient_002` | **patient (person)** | *noun* | `/ˈpeɪʃənt/` | paciente | The doctor saw ten patients today. | El médico atendió a diez pacientes hoy. |
| `voc_a1_treatment_001` | **treatment** | *noun* | `/ˈtritmənt/` | tratamiento | The treatment lasted two weeks. | El tratamiento duró dos semanas. |
| `voc_a1_vaccine_001` | **vaccine** | *noun* | `/ˌvækˈsin/` | vacuna | I got my flu vaccine yesterday. | Me puse mi vacuna contra la gripe ayer. |
| `voc_a1_health_001` | **health** | *noun* | `/hɛlθ/` | salud | Health is very important. | La salud es muy importante. |
| `voc_a1_diet_001` | **diet** | *noun* | `/ˈdaɪət/` | dieta | She started a healthy diet. | Ella empezó una dieta saludable. |
| `voc_a1_humidity_001` | **humidity** | *noun* | `/hjuˈmɪdəti/` | humedad | The humidity is very high today. | La humedad está muy alta hoy. |
| `voc_a1_climate_001` | **climate** | *noun* | `/ˈklaɪmɪt/` | clima (general) | The climate here is very hot. | El clima aquí es muy caluroso. |
| `voc_a1_thunder_001` | **thunder** | *noun* | `/ˈθʌndər/` | trueno | We heard thunder last night. | Escuchamos truenos anoche. |
| `voc_a1_lightning_001` | **lightning** | *noun* | `/ˈlaɪtnɪŋ/` | relámpago | The lightning was very bright. | El relámpago fue muy brillante. |
| `voc_a1_earthquake_001` | **earthquake** | *noun* | `/ˈɜrθˌkweɪk/` | terremoto | There was a small earthquake yesterday. | Hubo un pequeño terremoto ayer. |
| `voc_a1_flood_001` | **flood** | *noun* | `/flʌd/` | inundación | The flood damaged many houses. | La inundación dañó muchas casas. |
| `voc_a1_pollution_001` | **pollution** | *noun* | `/pəˈluʃən/` | contaminación | Pollution is a big problem in cities. | La contaminación es un gran problema en las ciudades. |
| `voc_a1_recycle_001` | **recycle** | *verb* | `/riˈsaɪkəl/` | reciclar | We recycle paper and plastic. | Reciclamos papel y plástico. |
| `voc_a1_environment_001` | **environment** | *noun* | `/ɪnˈvaɪrənmənt/` | medio ambiente | We must protect the environment. | Debemos proteger el medio ambiente. |
| `voc_a1_energy_001` | **energy** | *noun* | `/ˈɛnərdʒi/` | energía | We need to save energy. | Necesitamos ahorrar energía. |
| `voc_a1_electricity_001` | **electricity** | *noun* | `/ɪˌlɛkˈtrɪsəti/` | electricidad | The electricity went out last night. | Se fue la electricidad anoche. |
| `voc_a1_fuel_001` | **fuel** | *noun* | `/ˈfjuəl/` | combustible | The car needs more fuel. | El carro necesita más combustible. |
| `voc_a1_solar_001` | **solar** | *adjective* | `/ˈsoʊlər/` | solar | We installed solar panels last year. | Instalamos paneles solares el año pasado. |

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

Textos graduados que reutilizan exclusivamente el léxico consolidado hasta su semana lectiva, acompañados de preguntas pedagógicas de opción múltiple.

#### Lectura Semana 10: My Daily Routine and Family (`rdg_a1_001`)
- **Nivel:** A1 | **Semana lectiva:** 10 | **Dificultad interna:** 1/5
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

#### Lectura Semana 12: A Morning in the City (`rdg_a1_002`)
- **Nivel:** A1 | **Semana lectiva:** 12 | **Dificultad interna:** 2/5
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

#### Lectura Semana 11: Shopping at the Supermarket (`rdg_a1_003`)
- **Nivel:** A1 | **Semana lectiva:** 11 | **Dificultad interna:** 2/5
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
| `voc_a2_refund_001` | **refund** | *noun* | `/ˈriˌfʌnd/` | reembolso | I want a refund for this item. | Quiero un reembolso por este artículo. |
| `voc_a2_exchange_002` | **exchange (product)** | *noun* | `/ɪksˈtʃeɪndʒ/` | cambio (producto) | Can I get an exchange instead? | ¿Puedo hacer un cambio en su lugar? |
| `voc_a2_return_003` | **return (product)** | *noun* | `/rɪˈtɜrn/` | devolución | The store accepted my return. | La tienda aceptó mi devolución. |
| `voc_a2_warranty_004` | **warranty** | *noun* | `/ˈwɔrənti/` | garantía | This laptop has a two-year warranty. | Esta laptop tiene garantía de dos años. |
| `voc_a2_guarantee_005` | **guarantee** | *noun* | `/ˌgɛrənˈti/` | garantía (verbo/promesa) | We offer a money-back guarantee. | Ofrecemos garantía de devolución de dinero. |
| `voc_a2_complaint_006` | **complaint** | *noun* | `/kəmˈpleɪnt/` | queja | I filed a complaint about the service. | Presenté una queja sobre el servicio. |
| `voc_a2_customer-service_007` | **customer service** | *noun* | `/ˈkʌstəmər ˈsɜrvɪs/` | servicio al cliente | Customer service was very helpful. | El servicio al cliente fue muy útil. |
| `voc_a2_fitting-room_008` | **fitting room** | *noun* | `/ˈfɪtɪŋ rum/` | probador | The fitting room is over there. | El probador está allá. |
| `voc_a2_barcode_009` | **barcode** | *noun* | `/ˈbɑrˌkoʊd/` | código de barras | Scan the barcode, please. | Escanea el código de barras, por favor. |
| `voc_a2_discount-code_010` | **discount code** | *noun* | `/ˈdɪskaʊnt koʊd/` | código de descuento | Do you have a discount code? | ¿Tienes un código de descuento? |
| `voc_a2_clearance_011` | **clearance** | *noun* | `/ˈklɪrəns/` | liquidación | These shoes are on clearance. | Estos zapatos están en liquidación. |
| `voc_a2_bargain_012` | **bargain** | *noun* | `/ˈbɑrgɪn/` | ganga | This jacket was a real bargain. | Esta chaqueta fue una verdadera ganga. |
| `voc_a2_brand-new_013` | **brand new** | *noun* | `/brænd nu/` | totalmente nuevo | My phone is brand new. | Mi teléfono es totalmente nuevo. |
| `voc_a2_secondhand_014` | **secondhand** | *noun* | `/ˈsɛkəndˌhænd/` | de segunda mano | I bought a secondhand bike. | Compré una bicicleta de segunda mano. |
| `voc_a2_quality-control_015` | **quality control** | *noun* | `/ˈkwɑləti kənˈtroʊl/` | control de calidad | Quality control checks every product. | El control de calidad revisa cada producto. |
| `voc_a2_damaged_016` | **damaged** | *adjective* | `/ˈdæmɪdʒd/` | dañado | The box arrived damaged. | La caja llegó dañada. |
| `voc_a2_broken_017` | **broken (thing)** | *noun* | `/ˈbroʊkən/` | roto | The screen is broken. | La pantalla está rota. |
| `voc_a2_defective_018` | **defective** | *adjective* | `/dɪˈfɛktɪv/` | defectuoso | This charger is defective. | Este cargador es defectuoso. |
| `voc_a2_missing-part_019` | **missing part** | *adjective* | `/ˈmɪsɪŋ pɑrt/` | pieza faltante | The box has a missing part. | A la caja le falta una pieza. |
| `voc_a2_instructions-manual_020` | **instructions manual** | *noun* | `/ɪnˈstrʌkʃənz ˈmænjuəl/` | manual de instrucciones | Read the instructions manual first. | Lee el manual de instrucciones primero. |
| `voc_a2_assemble_021` | **assemble** | *verb* | `/əˈsɛmbəl/` | ensamblar | We assembled the furniture together. | Ensamblamos el mueble juntos. |
| `voc_a2_gift-receipt_022` | **gift receipt** | *noun* | `/gɪft rɪˈsit/` | recibo de regalo | Would you like a gift receipt? | ¿Quieres un recibo de regalo? |
| `voc_a2_loyalty-card_023` | **loyalty card** | *noun* | `/ˈlɔɪəlti kɑrd/` | tarjeta de fidelidad | Scan your loyalty card, please. | Escanea tu tarjeta de fidelidad, por favor. |
| `voc_a2_membership_024` | **membership** | *noun* | `/ˈmɛmbərˌʃɪp/` | membresía | I renewed my gym membership. | Renové mi membresía del gimnasio. |
| `voc_a2_catalog_025` | **catalog** | *noun* | `/ˈkætəˌlɔg/` | catálogo | Look in the catalog for prices. | Busca los precios en el catálogo. |
| `voc_a2_order-online_026` | **order online** | *phrasal-verb* | `/ˈɔrdər ˈɔnˌlaɪn/` | pedir en línea | I usually order online. | Normalmente pido en línea. |
| `voc_a2_shipping_027` | **shipping** | *noun* | `/ˈʃɪpɪŋ/` | envío | Shipping takes five days. | El envío tarda cinco días. |
| `voc_a2_delivery_028` | **delivery** | *noun* | `/dɪˈlɪvəri/` | entrega | The delivery arrived on time. | La entrega llegó a tiempo. |
| `voc_a2_package-parcel_029` | **package / parcel** | *noun* | `/ˈpækɪdʒ/` | paquete | I'm waiting for a package. | Estoy esperando un paquete. |
| `voc_a2_tracking-number_030` | **tracking number** | *noun* | `/ˈtrækɪŋ ˈnʌmbər/` | número de rastreo | Here is your tracking number. | Aquí está tu número de rastreo. |
| `voc_a2_courier_031` | **courier** | *noun* | `/ˈkʊriər/` | mensajero | The courier left it at the door. | El mensajero lo dejó en la puerta. |
| `voc_a2_express-delivery_032` | **express delivery** | *noun* | `/ɪkˈsprɛs dɪˈlɪvəri/` | envío exprés | I paid for express delivery. | Pagué por envío exprés. |
| `voc_a2_standard-delivery_033` | **standard delivery** | *noun* | `/ˈstændərd dɪˈlɪvəri/` | envío estándar | Standard delivery is free. | El envío estándar es gratis. |
| `voc_a2_out-of-stock_034` | **out of stock** | *adjective* | `/aʊt əv stɑk/` | agotado | That size is out of stock. | Esa talla está agotada. |
| `voc_a2_in-stock_035` | **in stock** | *noun* | `/ɪn stɑk/` | en existencia | The blue one is in stock. | El azul está disponible en existencia. |
| `voc_a2_available_036` | **available** | *adjective* | `/əˈveɪləbəl/` | disponible | Is this color available? | ¿Está disponible este color? |
| `voc_a2_unavailable_037` | **unavailable** | *adjective* | `/ˌʌnəˈveɪləbəl/` | no disponible | The item is currently unavailable. | El artículo no está disponible actualmente. |
| `voc_a2_color-option_038` | **color option** | *noun* | `/ˈkʌlər ˈɑpʃən/` | opción de color | There is only one color option. | Solo hay una opción de color. |
| `voc_a2_model_039` | **model (product)** | *noun* | `/ˈmɑdəl/` | modelo (producto) | This is the newest model. | Este es el modelo más reciente. |
| `voc_a2_version_040` | **version** | *noun* | `/ˈvɜrʒən/` | versión | I have an old version of this app. | Tengo una versión vieja de esta aplicación. |
| `voc_a2_upgrade_041` | **upgrade** | *noun* | `/ˈʌpˌgreɪd/` | mejora/actualización | I bought an upgrade for my phone. | Compré una mejora para mi teléfono. |
| `voc_a2_downgrade_042` | **downgrade** | *noun* | `/ˈdaʊnˌgreɪd/` | reducir (plan/versión) | I decided to downgrade my plan. | Decidí bajar mi plan. |
| `voc_a2_subscription_043` | **subscription** | *noun* | `/səbˈskrɪpʃən/` | suscripción | I canceled my subscription. | Cancelé mi suscripción. |
| `voc_a2_cancel_044` | **cancel** | *verb* | `/ˈkænsəl/` | cancelar | Can I cancel my order? | ¿Puedo cancelar mi pedido? |
| `voc_a2_renew_045` | **renew** | *verb* | `/rɪˈnu/` | renovar | I need to renew my membership. | Necesito renovar mi membresía. |
| `voc_a2_invoice_046` | **invoice** | *noun* | `/ˈɪnvɔɪs/` | factura | Please send me the invoice. | Por favor envíame la factura. |
| `voc_a2_payment-method_047` | **payment method** | *noun* | `/ˈpeɪmənt ˈmɛθəd/` | método de pago | Choose your payment method. | Elige tu método de pago. |
| `voc_a2_installment_048` | **installment** | *noun* | `/ɪnˈstɔlmənt/` | cuota/pago a plazos | I paid in three installments. | Pagué en tres cuotas. |
| `voc_a2_negotiate_049` | **negotiate** | *verb* | `/nɪˈgoʊʃiˌeɪt/` | negociar | We negotiated a better price. | Negociamos un mejor precio. |
| `voc_a2_haggle_050` | **haggle** | *verb* | `/ˈhægəl/` | regatear | People haggle a lot at this market. | La gente regatea mucho en este mercado. |
| `voc_a2_overpriced_051` | **overpriced** | *adjective* | `/ˌoʊvərˈpraɪst/` | sobrevalorado | This restaurant is overpriced. | Este restaurante está sobrevalorado. |
| `voc_a2_affordable_052` | **affordable** | *adjective* | `/əˈfɔrdəbəl/` | asequible | I found an affordable hotel. | Encontré un hotel asequible. |
| `voc_a2_worth-it_053` | **worth it** | *noun* | `/wɜrθ ɪt/` | que vale la pena | The trip was worth it. | El viaje valió la pena. |
| `voc_a2_satisfied_054` | **satisfied** | *noun* | `/ˈsætɪsˌfaɪd/` | satisfecho | I am satisfied with my purchase. | Estoy satisfecho con mi compra. |
| `voc_a2_dissatisfied_055` | **dissatisfied** | *noun* | `/dɪsˈsætɪsˌfaɪd/` | insatisfecho | She was dissatisfied with the service. | Ella estaba insatisfecha con el servicio. |
| `voc_a2_store-credit_056` | **store credit** | *noun* | `/stɔr ˈkrɛdɪt/` | crédito de tienda | They gave me store credit. | Me dieron crédito de tienda. |
| `voc_a2_gift-card_057` | **gift card** | *noun* | `/gɪft kɑrd/` | tarjeta de regalo | I received a gift card for my birthday. | Recibí una tarjeta de regalo por mi cumpleaños. |
| `voc_a2_coupon_058` | **coupon** | *noun* | `/ˈkupɑn/` | cupón | Do you have a coupon? | ¿Tienes un cupón? |
| `voc_a2_promo-code_059` | **promo code** | *noun* | `/ˈproʊmoʊ koʊd/` | código promocional | Enter the promo code at checkout. | Ingresa el código promocional al pagar. |
| `voc_a2_limited-offer_060` | **limited offer** | *adjective* | `/ˈlɪmɪtɪd ˈɔfər/` | oferta limitada | This is a limited offer. | Esta es una oferta limitada. |
| `voc_a2_best-seller_061` | **best seller** | *noun* | `/bɛst ˈsɛlər/` | más vendido | This book is a best seller. | Este libro es el más vendido. |
| `voc_a2_customer-review_062` | **customer review** | *noun* | `/ˈkʌstəmər rɪˈvju/` | reseña de cliente | Read the customer reviews first. | Lee las reseñas de clientes primero. |
| `voc_a2_rating_063` | **rating** | *noun* | `/ˈreɪtɪŋ/` | calificación | This product has a high rating. | Este producto tiene una calificación alta. |
| `voc_a2_feedback_064` | **feedback** | *noun* | `/ˈfidˌbæk/` | retroalimentación | Thank you for your feedback. | Gracias por tu retroalimentación. |

### Semana 2: Viajes: aeropuerto, hotel y emergencias
Total de palabras en esta semana: **56**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_check-in_065` | **check-in** | *noun* | `/ˈtʃɛkˌɪn/` | registro de entrada | Check-in starts at three. | El registro de entrada empieza a las tres. |
| `voc_a2_check-out_066` | **check-out** | *noun* | `/ˈtʃɛkˌaʊt/` | salida (hotel) | Check-out is at eleven. | La salida es a las once. |
| `voc_a2_room-service_067` | **room service** | *noun* | `/rum ˈsɜrvɪs/` | servicio a la habitación | We ordered room service last night. | Pedimos servicio a la habitación anoche. |
| `voc_a2_single-room_068` | **single room** | *noun* | `/ˈsɪŋgəl rum/` | habitación individual | I booked a single room. | Reservé una habitación individual. |
| `voc_a2_double-room_069` | **double room** | *noun* | `/ˈdʌbəl rum/` | habitación doble | We need a double room. | Necesitamos una habitación doble. |
| `voc_a2_suite_070` | **suite** | *noun* | `/swit/` | suite | They stayed in a suite. | Se hospedaron en una suite. |
| `voc_a2_lobby_071` | **lobby** | *noun* | `/ˈlɑbi/` | vestíbulo | Let's meet in the lobby. | Reunámonos en el vestíbulo. |
| `voc_a2_concierge_072` | **concierge** | *noun* | `/ˌkɑnsiˈɛrʒ/` | conserje | The concierge gave us a map. | El conserje nos dio un mapa. |
| `voc_a2_housekeeping_073` | **housekeeping** | *noun* | `/ˈhaʊsˌkipɪŋ/` | limpieza (hotel) | Housekeeping cleaned our room. | La limpieza aseó nuestra habitación. |
| `voc_a2_do-not-disturb_074` | **do not disturb** | *phrasal-verb* | `/du nɑt dɪˈstɜrb/` | no molestar | Put the do not disturb sign on the door. | Cuelga el letrero de no molestar en la puerta. |
| `voc_a2_key-card_075` | **key card** | *noun* | `/ki kɑrd/` | tarjeta llave | I lost my key card. | Perdí mi tarjeta llave. |
| `voc_a2_wake-up-call_076` | **wake-up call** | *noun* | `/ˈweɪkʌp kɔl/` | llamada para despertar | I need a wake-up call at six. | Necesito una llamada para despertar a las seis. |
| `voc_a2_mini-bar_077` | **mini bar** | *noun* | `/ˈmɪni bɑr/` | minibar | The mini bar has snacks and drinks. | El minibar tiene botanas y bebidas. |
| `voc_a2_complimentary_078` | **complimentary** | *noun* | `/ˌkɑmpləˈmɛntəri/` | gratuito/cortesía | Breakfast is complimentary. | El desayuno es gratuito. |
| `voc_a2_amenities_079` | **amenities** | *noun* | `/əˈmɛnətiz/` | comodidades | The hotel has great amenities. | El hotel tiene excelentes comodidades. |
| `voc_a2_spa_080` | **spa** | *noun* | `/spɑ/` | spa | We relaxed at the spa. | Nos relajamos en el spa. |
| `voc_a2_laundry-service_081` | **laundry service** | *noun* | `/ˈlɔndri ˈsɜrvɪs/` | servicio de lavandería | Does the hotel offer laundry service? | ¿El hotel ofrece servicio de lavandería? |
| `voc_a2_front-desk_082` | **front desk** | *noun* | `/frʌnt dɛsk/` | recepción | Ask the front desk for towels. | Pide toallas en la recepción. |
| `voc_a2_overbooked_083` | **overbooked** | *adjective* | `/ˌoʊvərˈbʊkt/` | con sobreventa | The hotel was overbooked. | El hotel tenía sobreventa. |
| `voc_a2_cancellation_084` | **cancellation** | *noun* | `/ˌkænsəˈleɪʃən/` | cancelación | There was a last-minute cancellation. | Hubo una cancelación de última hora. |
| `voc_a2_non-refundable_085` | **non-refundable** | *adjective* | `/ˌnɑnrɪˈfʌndəbəl/` | no reembolsable | This ticket is non-refundable. | Este boleto no es reembolsable. |
| `voc_a2_itinerary_086` | **itinerary** | *noun* | `/aɪˈtɪnəˌrɛri/` | itinerario | Here is our travel itinerary. | Aquí está nuestro itinerario de viaje. |
| `voc_a2_layover_087` | **layover** | *noun* | `/ˈleɪˌoʊvər/` | escala | We have a two-hour layover. | Tenemos una escala de dos horas. |
| `voc_a2_connecting-flight_088` | **connecting flight** | *noun* | `/kəˈnɛktɪŋ flaɪt/` | vuelo de conexión | I almost missed my connecting flight. | Casi pierdo mi vuelo de conexión. |
| `voc_a2_delayed-flight_089` | **delayed flight** | *adjective* | `/dɪˈleɪd flaɪt/` | vuelo retrasado | Our delayed flight caused problems. | Nuestro vuelo retrasado causó problemas. |
| `voc_a2_cancelled-flight_090` | **cancelled flight** | *adjective* | `/ˈkænsəld flaɪt/` | vuelo cancelado | The cancelled flight was rescheduled. | El vuelo cancelado fue reprogramado. |
| `voc_a2_boarding-time_091` | **boarding time** | *noun* | `/ˈbɔrdɪŋ taɪm/` | hora de embarque | Check the boarding time on your ticket. | Revisa la hora de embarque en tu boleto. |
| `voc_a2_overhead-bin_092` | **overhead bin** | *noun* | `/ˈoʊvərˌhɛd bɪn/` | compartimento superior | Put your bag in the overhead bin. | Pon tu bolsa en el compartimento superior. |
| `voc_a2_carry-on_093` | **carry-on** | *noun* | `/ˈkæriˌɑn/` | equipaje de mano | I only brought a carry-on. | Solo traje equipaje de mano. |
| `voc_a2_baggage-claim_094` | **baggage claim** | *noun* | `/ˈbægɪdʒ kleɪm/` | reclamo de equipaje | Meet me at baggage claim. | Encuéntrame en el reclamo de equipaje. |
| `voc_a2_lost-luggage_095` | **lost luggage** | *noun* | `/lɔst ˈlʌgɪdʒ/` | equipaje perdido | We reported our lost luggage. | Reportamos nuestro equipaje perdido. |
| `voc_a2_customs-declaration_096` | **customs declaration** | *noun* | `/ˈkʌstəmz ˌdɛkləˈreɪʃən/` | declaración de aduana | Fill out the customs declaration. | Llena la declaración de aduana. |
| `voc_a2_duty-free_097` | **duty-free** | *noun* | `/ˈdutiˈfri/` | libre de impuestos | I bought perfume at duty-free. | Compré perfume libre de impuestos. |
| `voc_a2_embassy_098` | **embassy** | *noun* | `/ˈɛmbəsi/` | embajada | We visited the embassy for a visa. | Visitamos la embajada por una visa. |
| `voc_a2_consulate_099` | **consulate** | *noun* | `/ˈkɑnsələt/` | consulado | The consulate can help with documents. | El consulado puede ayudar con documentos. |
| `voc_a2_emergency-exit_100` | **emergency exit** | *noun* | `/ɪˈmɜrdʒənsi ˈɛgzɪt/` | salida de emergencia | The emergency exit is at the back. | La salida de emergencia está atrás. |
| `voc_a2_fire-alarm_101` | **fire alarm** | *noun* | `/faɪər əˈlɑrm/` | alarma de incendio | The fire alarm went off. | Sonó la alarma de incendio. |
| `voc_a2_first-aid_102` | **first aid** | *noun* | `/fɜrst eɪd/` | primeros auxilios | She knows basic first aid. | Ella sabe primeros auxilios básicos. |
| `voc_a2_evacuation_103` | **evacuation** | *noun* | `/ɪˌvækjuˈeɪʃən/` | evacuación | The evacuation was calm and organized. | La evacuación fue tranquila y organizada. |
| `voc_a2_emergency-contact_104` | **emergency contact** | *noun* | `/ɪˈmɜrdʒənsi ˈkɑnˌtækt/` | contacto de emergencia | Write down your emergency contact. | Anota tu contacto de emergencia. |
| `voc_a2_insurance-claim_105` | **insurance claim** | *noun* | `/ɪnˈʃʊrəns kleɪm/` | reclamo de seguro | I filed an insurance claim. | Presenté un reclamo de seguro. |
| `voc_a2_stolen_106` | **stolen** | *adjective* | `/ˈstoʊlən/` | robado | My phone was stolen. | Me robaron el teléfono. |
| `voc_a2_robbery_107` | **robbery** | *noun* | `/ˈrɑbəri/` | robo | There was a robbery downtown. | Hubo un robo en el centro. |
| `voc_a2_pickpocket_108` | **pickpocket** | *noun* | `/ˈpɪkˌpɑkɪt/` | carterista | Watch out for pickpockets. | Cuidado con los carteristas. |
| `voc_a2_police-report_109` | **police report** | *noun* | `/pəˈlis rɪˈpɔrt/` | reporte policial | We filed a police report. | Presentamos un reporte policial. |
| `voc_a2_lost-and-found_110` | **lost and found** | *noun* | `/lɔst ənd faʊnd/` | objetos perdidos | Check the lost and found. | Revisa los objetos perdidos. |
| `voc_a2_replacement-passport_111` | **replacement passport** | *noun* | `/rɪˈpleɪsmənt ˈpæˌspɔrt/` | pasaporte de reemplazo | I need a replacement passport. | Necesito un pasaporte de reemplazo. |
| `voc_a2_travel-advisory_112` | **travel advisory** | *noun* | `/ˈtrævəl ædˈvaɪzəri/` | advertencia de viaje | There is a travel advisory for that area. | Hay una advertencia de viaje para esa zona. |
| `voc_a2_vaccination-certific_113` | **vaccination certificate** | *noun* | `/ˌvæksəˈneɪʃən sərˈtɪfɪkət/` | certificado de vacunación | Bring your vaccination certificate. | Trae tu certificado de vacunación. |
| `voc_a2_jet-lag_114` | **jet lag** | *noun* | `/dʒɛt læg/` | descompensación horaria | I have terrible jet lag. | Tengo un descompensación horaria terrible. |
| `voc_a2_time-zone_115` | **time zone** | *noun* | `/taɪm zoʊn/` | zona horaria | We are in a different time zone. | Estamos en una zona horaria diferente. |
| `voc_a2_local-currency_116` | **local currency** | *noun* | `/ˈloʊkəl ˈkɜrənsi/` | moneda local | Exchange your money for local currency. | Cambia tu dinero por moneda local. |
| `voc_a2_tipping_117` | **tipping** | *noun* | `/ˈtɪpɪŋ/` | dar propina | Tipping is common here. | Dar propina es común aquí. |
| `voc_a2_guided-tour_118` | **guided tour** | *adjective* | `/ˈgaɪdɪd tʊr/` | tour guiado | We took a guided tour of the museum. | Hicimos un tour guiado del museo. |
| `voc_a2_sightseeing_119` | **sightseeing** | *noun* | `/ˈsaɪtˌsiɪŋ/` | hacer turismo | We went sightseeing all day. | Hicimos turismo todo el día. |
| `voc_a2_landmark_120` | **landmark** | *noun* | `/ˈlændˌmɑrk/` | punto de referencia/monumento | The tower is a famous landmark. | La torre es un monumento famoso. |

### Semana 3: Trabajo y oficina
Total de palabras en esta semana: **61**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_resume-cv_121` | **resume / CV** | *noun* | `/ˈrɛzəˌmeɪ/` | currículum | I updated my resume last week. | Actualicé mi currículum la semana pasada. |
| `voc_a2_cover-letter_122` | **cover letter** | *noun* | `/ˈkʌvər ˈlɛtər/` | carta de presentación | Attach a cover letter to your application. | Adjunta una carta de presentación a tu solicitud. |
| `voc_a2_job-interview_123` | **job interview** | *noun* | `/dʒɑb ˈɪntərˌvju/` | entrevista de trabajo | I have a job interview tomorrow. | Tengo una entrevista de trabajo mañana. |
| `voc_a2_job-offer_124` | **job offer** | *noun* | `/dʒɑb ˈɔfər/` | oferta de trabajo | She accepted the job offer. | Ella aceptó la oferta de trabajo. |
| `voc_a2_position_125` | **position** | *noun* | `/pəˈzɪʃən/` | puesto | This position requires experience. | Este puesto requiere experiencia. |
| `voc_a2_department_126` | **department** | *noun* | `/dɪˈpɑrtmənt/` | departamento | He works in the sales department. | Él trabaja en el departamento de ventas. |
| `voc_a2_colleague_127` | **colleague** | *noun* | `/ˈkɑlig/` | colega | My colleague helped me with the report. | Mi colega me ayudó con el informe. |
| `voc_a2_supervisor_128` | **supervisor** | *noun* | `/ˈsupərˌvaɪzər/` | supervisor | My supervisor approved my request. | Mi supervisor aprobó mi solicitud. |
| `voc_a2_deadline_129` | **deadline** | *noun* | `/ˈdɛdˌlaɪn/` | fecha límite | The deadline is next Friday. | La fecha límite es el próximo viernes. |
| `voc_a2_meeting-room_130` | **meeting room** | *noun* | `/ˈmitɪŋ rum/` | sala de reuniones | We are in the meeting room. | Estamos en la sala de reuniones. |
| `voc_a2_conference-call_131` | **conference call** | *noun* | `/ˈkɑnfərəns kɔl/` | llamada de conferencia | We have a conference call at noon. | Tenemos una llamada de conferencia al mediodía. |
| `voc_a2_presentation_132` | **presentation** | *noun* | `/ˌprɛzənˈteɪʃən/` | presentación | She gave a great presentation. | Ella dio una excelente presentación. |
| `voc_a2_agenda_133` | **agenda** | *noun* | `/əˈdʒɛndə/` | agenda/orden del día | Let's follow the agenda today. | Sigamos la agenda hoy. |
| `voc_a2_minutes_134` | **minutes (meeting)** | *noun* | `/ˈmɪnəts/` | acta (de reunión) | Who is taking the minutes? | ¿Quién está tomando el acta? |
| `voc_a2_memo_135` | **memo** | *noun* | `/ˈmɛmoʊ/` | memorando | I sent a memo to the team. | Envié un memorando al equipo. |
| `voc_a2_report_136` | **report** | *noun* | `/rɪˈpɔrt/` | informe | The report is due on Monday. | El informe debe entregarse el lunes. |
| `voc_a2_spreadsheet_137` | **spreadsheet** | *noun* | `/ˈsprɛdˌʃit/` | hoja de cálculo | Open the spreadsheet, please. | Abre la hoja de cálculo, por favor. |
| `voc_a2_attachment_138` | **attachment** | *noun* | `/əˈtætʃmənt/` | archivo adjunto | I forgot the attachment. | Olvidé el archivo adjunto. |
| `voc_a2_reply_139` | **reply** | *verb* | `/rɪˈplaɪ/` | responder | Please reply to this email. | Por favor responde a este correo. |
| `voc_a2_forward_140` | **forward (email)** | *phrasal-verb* | `/ˈfɔrwərd/` | reenviar | Can you forward me that message? | ¿Me reenvías ese mensaje? |
| `voc_a2_inbox_141` | **inbox** | *noun* | `/ˈɪnˌbɑks/` | bandeja de entrada | My inbox is full of emails. | Mi bandeja de entrada está llena de correos. |
| `voc_a2_out-of-office_142` | **out of office** | *noun* | `/aʊt əv ˈɔfəs/` | fuera de la oficina | I'll be out of office next week. | Estaré fuera de la oficina la próxima semana. |
| `voc_a2_sick-leave_143` | **sick leave** | *noun* | `/sɪk liv/` | permiso por enfermedad | She is on sick leave today. | Ella está de permiso por enfermedad hoy. |
| `voc_a2_vacation-days_144` | **vacation days** | *noun* | `/veɪˈkeɪʃən deɪz/` | días de vacaciones | I have five vacation days left. | Me quedan cinco días de vacaciones. |
| `voc_a2_overtime_145` | **overtime** | *noun* | `/ˈoʊvərˌtaɪm/` | horas extra | We worked overtime this week. | Trabajamos horas extra esta semana. |
| `voc_a2_part-time_146` | **part-time** | *noun* | `/ˈpɑrtˈtaɪm/` | medio tiempo | She has a part-time job. | Ella tiene un trabajo de medio tiempo. |
| `voc_a2_full-time_147` | **full-time** | *noun* | `/ˈfʊlˌtaɪm/` | tiempo completo | He works full-time now. | Él trabaja tiempo completo ahora. |
| `voc_a2_remote-work_148` | **remote work** | *noun* | `/rɪˈmoʊt wɜrk/` | trabajo remoto | Remote work is common now. | El trabajo remoto es común ahora. |
| `voc_a2_freelance_149` | **freelance** | *adjective* | `/ˈfriˌlæns/` | trabajo independiente | She does freelance writing. | Ella hace escritura independiente. |
| `voc_a2_promotion_150` | **promotion** | *noun* | `/prəˈmoʊʃən/` | ascenso | He got a promotion last month. | A él le dieron un ascenso el mes pasado. |
| `voc_a2_raise_151` | **raise (salary)** | *noun* | `/reɪz/` | aumento de sueldo | She asked for a raise. | Ella pidió un aumento de sueldo. |
| `voc_a2_resign_152` | **resign** | *verb* | `/rɪˈzaɪn/` | renunciar | He decided to resign. | Él decidió renunciar. |
| `voc_a2_lay-off_153` | **lay off** | *phrasal-verb* | `/leɪ ɔf/` | despedir (recorte) | The company had to lay off staff. | La empresa tuvo que despedir personal. |
| `voc_a2_retire_154` | **retire** | *verb* | `/rɪˈtaɪər/` | jubilarse | My father will retire next year. | Mi padre se jubilará el próximo año. |
| `voc_a2_teamwork_155` | **teamwork** | *noun* | `/ˈtimˌwɜrk/` | trabajo en equipo | Teamwork made the project possible. | El trabajo en equipo hizo posible el proyecto. |
| `voc_a2_brainstorm_156` | **brainstorm** | *noun* | `/ˈbreɪnˌstɔrm/` | lluvia de ideas | We had a brainstorm session. | Tuvimos una sesión de lluvia de ideas. |
| `voc_a2_performance-review_157` | **performance review** | *noun* | `/pərˈfɔrməns rɪˈvju/` | evaluación de desempeño | My performance review is tomorrow. | Mi evaluación de desempeño es mañana. |
| `voc_a2_workload_158` | **workload** | *noun* | `/ˈwɜrkˌloʊd/` | carga de trabajo | My workload is very heavy this month. | Mi carga de trabajo es muy pesada este mes. |
| `voc_a2_multitask_159` | **multitask** | *verb* | `/ˈmʌltiˌtæsk/` | hacer varias cosas a la vez | It's hard to multitask at work. | Es difícil hacer varias cosas a la vez en el trabajo. |
| `voc_a2_prioritize_160` | **prioritize** | *verb* | `/praɪˈɔrəˌtaɪz/` | priorizar | You need to prioritize your tasks. | Necesitas priorizar tus tareas. |
| `voc_a2_negotiation_161` | **negotiation** | *noun* | `/nɪˌgoʊʃiˈeɪʃən/` | negociación | The negotiation took two hours. | La negociación tomó dos horas. |
| `voc_a2_client_162` | **client** | *noun* | `/ˈklaɪənt/` | cliente (negocio) | Our client is happy with the results. | Nuestro cliente está contento con los resultados. |
| `voc_a2_stakeholder_163` | **stakeholder** | *noun* | `/ˈsteɪkˌhoʊldər/` | parte interesada | We informed all the stakeholders. | Informamos a todas las partes interesadas. |
| `voc_a2_quarterly_164` | **quarterly** | *adverb* | `/ˈkwɔrtərli/` | trimestral | We review sales quarterly. | Revisamos las ventas trimestralmente. |
| `voc_a2_annual_165` | **annual** | *noun* | `/ˈænjuəl/` | anual | We have an annual meeting in June. | Tenemos una reunión anual en junio. |
| `voc_a2_target_166` | **target (goal)** | *noun* | `/ˈtɑrgɪt/` | meta | We reached our sales target. | Alcanzamos nuestra meta de ventas. |
| `voc_a2_achieve_167` | **achieve** | *verb* | `/əˈtʃiv/` | lograr | She achieved her goals this year. | Ella logró sus metas este año. |
| `voc_a2_accomplish_168` | **accomplish** | *verb* | `/əˈkɑmplɪʃ/` | cumplir/lograr | We accomplished a lot this week. | Logramos mucho esta semana. |
| `voc_a2_project-manager_169` | **project manager** | *noun* | `/ˈprɑdʒɛkt ˈmænɪdʒər/` | gerente de proyecto | The project manager called a meeting. | El gerente de proyecto convocó una reunión. |
| `voc_a2_human-resources_170` | **human resources** | *noun* | `/ˈhjumən ˈrisɔrsɪz/` | recursos humanos | Contact human resources for that. | Contacta a recursos humanos para eso. |
| `voc_a2_headquarters_171` | **headquarters** | *noun* | `/ˈhɛdˌkwɔrtərz/` | sede central | The headquarters are in New York. | La sede central está en Nueva York. |
| `voc_a2_branch-office_172` | **branch office** | *noun* | `/bræntʃ ˈɔfəs/` | sucursal | There is a branch office downtown. | Hay una sucursal en el centro. |
| `voc_a2_shift_173` | **shift (work)** | *noun* | `/ʃɪft/` | turno | I work the night shift. | Trabajo el turno nocturno. |
| `voc_a2_commute_174` | **commute** | *noun* | `/kəˈmjut/` | desplazarse al trabajo | My commute takes forty minutes. | Mi desplazamiento al trabajo toma cuarenta minutos. |
| `voc_a2_paperwork_175` | **paperwork** | *noun* | `/ˈpeɪpərˌwɜrk/` | papeleo | I have a lot of paperwork today. | Tengo mucho papeleo hoy. |
| `voc_a2_signature_176` | **signature** | *noun* | `/ˈsɪgnətʃər/` | firma | I need your signature here. | Necesito tu firma aquí. |
| `voc_a2_approval_177` | **approval** | *noun* | `/əˈpruvəl/` | aprobación | We are waiting for approval. | Estamos esperando la aprobación. |
| `voc_a2_policy_178` | **policy (company)** | *noun* | `/ˈpɑləsi/` | política (empresa) | Please read the company policy. | Por favor lee la política de la empresa. |
| `voc_a2_training_179` | **training** | *noun* | `/ˈtreɪnɪŋ/` | capacitación | New employees need training. | Los nuevos empleados necesitan capacitación. |
| `voc_a2_onboarding_180` | **onboarding** | *noun* | `/ˈɑnˌbɔrdɪŋ/` | proceso de incorporación | Onboarding lasts one week. | El proceso de incorporación dura una semana. |
| `voc_a2_networking-event_181` | **networking event** | *noun* | `/ˈnɛtˌwɜrkɪŋ ɪˈvɛnt/` | evento de networking | I met her at a networking event. | La conocí en un evento de networking. |

### Semana 4: Salud y cuerpo (síntomas y citas médicas)
Total de palabras en esta semana: **59**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_symptom_182` | **symptom** | *noun* | `/ˈsɪmptəm/` | síntoma | What symptoms do you have? | ¿Qué síntomas tienes? |
| `voc_a2_diagnosis_183` | **diagnosis** | *noun* | `/ˌdaɪəgˈnoʊsɪs/` | diagnóstico | The doctor gave a clear diagnosis. | El médico dio un diagnóstico claro. |
| `voc_a2_prescription_184` | **prescription** | *noun* | `/prɪˈskrɪpʃən/` | receta médica | The doctor wrote a prescription. | El médico escribió una receta. |
| `voc_a2_dosage_185` | **dosage** | *noun* | `/ˈdoʊsɪdʒ/` | dosis | Follow the correct dosage. | Sigue la dosis correcta. |
| `voc_a2_side-effect_186` | **side effect** | *noun* | `/saɪd ɪˈfɛkt/` | efecto secundario | This medicine has few side effects. | Esta medicina tiene pocos efectos secundarios. |
| `voc_a2_allergy_187` | **allergy** | *noun* | `/ˈælərdʒi/` | alergia | I have a food allergy. | Tengo una alergia alimentaria. |
| `voc_a2_allergic-reaction_188` | **allergic reaction** | *noun* | `/əˈlɜrdʒɪk riˈækʃən/` | reacción alérgica | She had an allergic reaction. | Ella tuvo una reacción alérgica. |
| `voc_a2_infection_189` | **infection** | *noun* | `/ɪnˈfɛkʃən/` | infección | He has an ear infection. | Él tiene una infección de oído. |
| `voc_a2_inflammation_190` | **inflammation** | *noun* | `/ˌɪnfləˈmeɪʃən/` | inflamación | There is inflammation in his knee. | Hay inflamación en su rodilla. |
| `voc_a2_rash_191` | **rash** | *noun* | `/ræʃ/` | sarpullido | She has a rash on her arm. | Ella tiene un sarpullido en el brazo. |
| `voc_a2_swelling_192` | **swelling** | *noun* | `/ˈswɛlɪŋ/` | hinchazón | The swelling went down quickly. | La hinchazón bajó rápido. |
| `voc_a2_bruise_193` | **bruise** | *noun* | `/bruz/` | moretón | He has a bruise on his leg. | Él tiene un moretón en la pierna. |
| `voc_a2_wound_194` | **wound** | *noun* | `/wund/` | herida | Clean the wound carefully. | Limpia la herida con cuidado. |
| `voc_a2_stitches_195` | **stitches** | *noun* | `/ˈstɪtʃɪz/` | puntos de sutura | He needed five stitches. | Él necesitó cinco puntos de sutura. |
| `voc_a2_cast_196` | **cast (medical)** | *noun* | `/kæst/` | yeso | She has a cast on her arm. | Ella tiene un yeso en el brazo. |
| `voc_a2_crutches_197` | **crutches** | *noun* | `/ˈkrʌtʃɪz/` | muletas | He is using crutches now. | Él está usando muletas ahora. |
| `voc_a2_wheelchair_198` | **wheelchair** | *noun* | `/ˈwilˌtʃɛr/` | silla de ruedas | She uses a wheelchair. | Ella usa una silla de ruedas. |
| `voc_a2_blood-pressure_199` | **blood pressure** | *noun* | `/blʌd ˈprɛʃər/` | presión arterial | The nurse checked my blood pressure. | La enfermera revisó mi presión arterial. |
| `voc_a2_heart-rate_200` | **heart rate** | *noun* | `/hɑrt reɪt/` | ritmo cardíaco | His heart rate is normal. | Su ritmo cardíaco es normal. |
| `voc_a2_pulse_201` | **pulse** | *noun* | `/pʌls/` | pulso | The doctor checked my pulse. | El médico revisó mi pulso. |
| `voc_a2_x-ray_202` | **x-ray** | *noun* | `/ˈɛksˌreɪ/` | radiografía | They took an x-ray of my arm. | Me tomaron una radiografía del brazo. |
| `voc_a2_surgery-operation_203` | **surgery / operation** | *noun* | `/ˈsɜrdʒəri/` | cirugía | She needs surgery next month. | Ella necesita cirugía el próximo mes. |
| `voc_a2_anesthesia_204` | **anesthesia** | *noun* | `/ˌænəsˈθiʒə/` | anestesia | He was under anesthesia for an hour. | Él estuvo bajo anestesia por una hora. |
| `voc_a2_recovery_205` | **recovery** | *noun* | `/rɪˈkʌvəri/` | recuperación | Her recovery is going well. | Su recuperación va bien. |
| `voc_a2_checkup_206` | **checkup** | *noun* | `/ˈtʃɛkˌʌp/` | chequeo médico | I have a checkup next week. | Tengo un chequeo médico la próxima semana. |
| `voc_a2_specialist_207` | **specialist** | *noun* | `/ˈspɛʃəlɪst/` | especialista | She saw a specialist yesterday. | Ella vio a un especialista ayer. |
| `voc_a2_physical-therapy_208` | **physical therapy** | *noun* | `/ˈfɪzɪkəl ˈθɛrəpi/` | fisioterapia | He goes to physical therapy twice a week. | Él va a fisioterapia dos veces por semana. |
| `voc_a2_mental-health_209` | **mental health** | *noun* | `/ˈmɛntəl hɛlθ/` | salud mental | Mental health matters too. | La salud mental también importa. |
| `voc_a2_anxiety_210` | **anxiety** | *noun* | `/æŋˈzaɪəti/` | ansiedad | She feels anxiety before exams. | Ella siente ansiedad antes de los exámenes. |
| `voc_a2_depression_211` | **depression** | *noun* | `/dɪˈprɛʃən/` | depresión | He is being treated for depression. | Él está siendo tratado por depresión. |
| `voc_a2_sleep-disorder_212` | **sleep disorder** | *noun* | `/slip dɪsˈɔrdər/` | trastorno del sueño | He was diagnosed with a sleep disorder. | Le diagnosticaron un trastorno del sueño. |
| `voc_a2_chronic_213` | **chronic** | *adjective* | `/ˈkrɑnɪk/` | crónico | She has a chronic condition. | Ella tiene una condición crónica. |
| `voc_a2_acute_214` | **acute** | *adjective* | `/əˈkjut/` | agudo | He had an acute pain in his chest. | Él tuvo un dolor agudo en el pecho. |
| `voc_a2_contagious_215` | **contagious** | *adjective* | `/kənˈteɪdʒəs/` | contagioso | The flu is very contagious. | La gripe es muy contagiosa. |
| `voc_a2_immune-system_216` | **immune system** | *noun* | `/ɪˈmjun ˈsɪstəm/` | sistema inmunológico | Vitamin C helps the immune system. | La vitamina C ayuda al sistema inmunológico. |
| `voc_a2_lungs_217` | **lungs** | *noun* | `/lʌŋz/` | pulmones | Smoking damages your lungs. | Fumar daña tus pulmones. |
| `voc_a2_liver_218` | **liver** | *noun* | `/ˈlɪvər/` | hígado | Alcohol affects the liver. | El alcohol afecta el hígado. |
| `voc_a2_kidney_219` | **kidney** | *noun* | `/ˈkɪdni/` | riñón | He donated a kidney to his brother. | Él donó un riñón a su hermano. |
| `voc_a2_intestine_220` | **intestine** | *noun* | `/ɪnˈtɛstɪn/` | intestino | The doctor examined his intestine. | El médico examinó su intestino. |
| `voc_a2_joint_221` | **joint** | *noun* | `/dʒɔɪnt/` | articulación | My knee joint hurts. | Me duele la articulación de la rodilla. |
| `voc_a2_spine_222` | **spine** | *noun* | `/spaɪn/` | columna vertebral | She injured her spine. | Ella se lesionó la columna vertebral. |
| `voc_a2_artery_223` | **artery** | *noun* | `/ˈɑrtəri/` | arteria | The artery was blocked. | La arteria estaba obstruida. |
| `voc_a2_vein_224` | **vein** | *noun* | `/veɪn/` | vena | The nurse found a vein easily. | La enfermera encontró una vena fácilmente. |
| `voc_a2_nervous-system_225` | **nervous system** | *noun* | `/ˈnɜrvəs ˈsɪstəm/` | sistema nervioso | Stress affects the nervous system. | El estrés afecta el sistema nervioso. |
| `voc_a2_digestive-system_226` | **digestive system** | *noun* | `/daɪˈdʒɛstɪv ˈsɪstəm/` | sistema digestivo | Fiber helps the digestive system. | La fibra ayuda al sistema digestivo. |
| `voc_a2_hormone_227` | **hormone** | *noun* | `/ˈhɔrˌmoʊn/` | hormona | This hormone controls growth. | Esta hormona controla el crecimiento. |
| `voc_a2_metabolism_228` | **metabolism** | *noun* | `/məˈtæbəˌlɪzəm/` | metabolismo | Exercise speeds up your metabolism. | El ejercicio acelera tu metabolismo. |
| `voc_a2_nutrient_229` | **nutrient** | *noun* | `/ˈnutriənt/` | nutriente | Vegetables are full of nutrients. | Las verduras están llenas de nutrientes. |
| `voc_a2_vitamin_230` | **vitamin** | *noun* | `/ˈvaɪtəmɪn/` | vitamina | I take a vitamin every morning. | Tomo una vitamina cada mañana. |
| `voc_a2_protein_231` | **protein** | *noun* | `/ˈproʊˌtin/` | proteína | Chicken has a lot of protein. | El pollo tiene mucha proteína. |
| `voc_a2_carbohydrate_232` | **carbohydrate** | *noun* | `/ˌkɑrboʊˈhaɪˌdreɪt/` | carbohidrato | Rice is high in carbohydrates. | El arroz es alto en carbohidratos. |
| `voc_a2_fiber_233` | **fiber** | *noun* | `/ˈfaɪbər/` | fibra | This bread has a lot of fiber. | Este pan tiene mucha fibra. |
| `voc_a2_calorie_234` | **calorie** | *noun* | `/ˈkæləri/` | caloría | This snack has pocas calorías. | Esta merienda tiene pocas calorías. |
| `voc_a2_overweight_235` | **overweight** | *adjective* | `/ˌoʊvərˈweɪt/` | sobrepeso | The doctor said he was overweight. | El médico dijo que él tenía sobrepeso. |
| `voc_a2_underweight_236` | **underweight** | *adjective* | `/ˈʌndərˌweɪt/` | bajo peso | The baby was slightly underweight. | El bebé tenía un poco de bajo peso. |
| `voc_a2_obesity_237` | **obesity** | *noun* | `/oʊˈbisəti/` | obesidad | Obesity is a growing health issue. | La obesidad es un problema de salud creciente. |
| `voc_a2_wellness_238` | **wellness** | *noun* | `/ˈwɛlnəs/` | bienestar | The company offers wellness programs. | La empresa ofrece programas de bienestar. |
| `voc_a2_hygiene_239` | **hygiene** | *noun* | `/ˈhaɪdʒin/` | higiene | Good hygiene prevents illness. | La buena higiene previene enfermedades. |
| `voc_a2_first-aid-kit_240` | **first aid kit** | *noun* | `/fɜrst eɪd kɪt/` | botiquín de primeros auxilios | We keep a first aid kit at home. | Tenemos un botiquín de primeros auxilios en casa. |

### Semana 5: Conectores narrativos para contar historias
Total de palabras en esta semana: **48**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_once-upon-a-time_241` | **once upon a time** | *conjunction* | `/wʌns əˈpɑn ə taɪm/` | érase una vez | Once upon a time, there was a small village. | Érase una vez, había un pueblo pequeño. |
| `voc_a2_meanwhile_242` | **meanwhile** | *adverb* | `/ˈminˌwaɪl/` | mientras tanto | Meanwhile, her brother was cooking dinner. | Mientras tanto, su hermano estaba cocinando la cena. |
| `voc_a2_afterward_243` | **afterward** | *adverb* | `/ˈæftərwərd/` | después/luego | We had lunch and afterward went for a walk. | Almorzamos y después salimos a caminar. |
| `voc_a2_eventually_244` | **eventually** | *adverb* | `/ɪˈvɛntʃuəli/` | finalmente/con el tiempo | Eventually, she found a new job. | Finalmente, ella encontró un nuevo trabajo. |
| `voc_a2_in-the-end_245` | **in the end** | *conjunction* | `/ɪn ði ɛnd/` | al final | In the end, everything worked out fine. | Al final, todo salió bien. |
| `voc_a2_at-first_246` | **at first** | *conjunction* | `/æt fɜrst/` | al principio | At first, I didn't understand the lesson. | Al principio, no entendí la lección. |
| `voc_a2_later-on_247` | **later on** | *conjunction* | `/ˈleɪtər ɑn/` | más adelante | Later on, we became good friends. | Más adelante, nos hicimos buenos amigos. |
| `voc_a2_as-soon-as_248` | **as soon as** | *conjunction* | `/æz sun æz/` | tan pronto como | Call me as soon as you arrive. | Llámame tan pronto como llegues. |
| `voc_a2_by-the-time_249` | **by the time** | *conjunction* | `/baɪ ðə taɪm/` | para cuando | By the time we arrived, the show had started. | Para cuando llegamos, el espectáculo ya había empezado. |
| `voc_a2_used-to_250` | **used to** | *conjunction* | `/ˈjuzd tu/` | solía | I used to live in another city. | Yo solía vivir en otra ciudad. |
| `voc_a2_previously_251` | **previously** | *adverb* | `/ˈpriviəsli/` | previamente | Previously, she worked as a teacher. | Previamente, ella trabajaba como maestra. |
| `voc_a2_formerly_252` | **formerly** | *adverb* | `/ˈfɔrmərli/` | anteriormente | This building was formerly a school. | Este edificio fue anteriormente una escuela. |
| `voc_a2_ever-since_253` | **ever since** | *adverb* | `/ˈɛvər sɪns/` | desde entonces | Ever since that day, we've been close friends. | Desde ese día, hemos sido amigos cercanos. |
| `voc_a2_from-then-on_254` | **from then on** | *conjunction* | `/frʌm ðɛn ɑn/` | desde ese momento | From then on, he studied every night. | Desde ese momento, él estudió todas las noches. |
| `voc_a2_at-that-moment_255` | **at that moment** | *conjunction* | `/æt ðæt ˈmoʊmənt/` | en ese momento | At that moment, the phone rang. | En ese momento, sonó el teléfono. |
| `voc_a2_right-after_256` | **right after** | *conjunction* | `/raɪt ˈæftər/` | justo después | We left right after the meeting. | Nos fuimos justo después de la reunión. |
| `voc_a2_shortly-after_257` | **shortly after** | *conjunction* | `/ˈʃɔrtli ˈæftər/` | poco después | Shortly after, it started to rain. | Poco después, empezó a llover. |
| `voc_a2_in-the-meantime_258` | **in the meantime** | *conjunction* | `/ɪn ðə ˈminˌtaɪm/` | mientras tanto | In the meantime, please wait here. | Mientras tanto, por favor espera aquí. |
| `voc_a2_all-of-a-sudden_259` | **all of a sudden** | *conjunction* | `/ɔl əv ə ˈsʌdən/` | de repente | All of a sudden, the lights went out. | De repente, se fueron las luces. |
| `voc_a2_little-by-little_260` | **little by little** | *conjunction* | `/ˈlɪtəl baɪ ˈlɪtəl/` | poco a poco | Little by little, she learned to speak English. | Poco a poco, ella aprendió a hablar inglés. |
| `voc_a2_one-day_261` | **one day** | *conjunction* | `/wʌn deɪ/` | un día | One day, he decided to change his life. | Un día, él decidió cambiar su vida. |
| `voc_a2_years-ago_262` | **years ago** | *conjunction* | `/jɪrz əˈgoʊ/` | hace años | Years ago, this street looked different. | Hace años, esta calle se veía diferente. |
| `voc_a2_back-then_263` | **back then** | *conjunction* | `/bæk ðɛn/` | en aquel entonces | Back then, we didn't have cell phones. | En aquel entonces, no teníamos celulares. |
| `voc_a2_during-that-time_264` | **during that time** | *conjunction* | `/ˈdʊrɪŋ ðæt taɪm/` | durante ese tiempo | During that time, she lived abroad. | Durante ese tiempo, ella vivió en el extranjero. |
| `voc_a2_at-the-same-time_265` | **at the same time** | *conjunction* | `/æt ðə seɪm taɪm/` | al mismo tiempo | At the same time, he was studying and working. | Al mismo tiempo, él estudiaba y trabajaba. |
| `voc_a2_in-those-days_266` | **in those days** | *conjunction* | `/ɪn ðoʊz deɪz/` | en aquellos días | In those days, life was simpler. | En aquellos días, la vida era más sencilla. |
| `voc_a2_as-a-result_267` | **as a result** | *conjunction* | `/æz ə rɪˈzʌlt/` | como resultado | As a result, sales increased. | Como resultado, las ventas aumentaron. |
| `voc_a2_consequently_268` | **consequently** | *conjunction* | `/ˈkɑnsəˌkwɛntli/` | en consecuencia | Consequently, the project was delayed. | En consecuencia, el proyecto se retrasó. |
| `voc_a2_thus_269` | **thus** | *conjunction* | `/ðʌs/` | así/por lo tanto | Thus, we decided to cancel the trip. | Así, decidimos cancelar el viaje. |
| `voc_a2_for-this-reason_270` | **for this reason** | *conjunction* | `/fɔr ðɪs ˈrizən/` | por esta razón | For this reason, we changed our plans. | Por esta razón, cambiamos nuestros planes. |
| `voc_a2_due-to_271` | **due to** | *conjunction* | `/du tu/` | debido a | The flight was delayed due to weather. | El vuelo se retrasó debido al clima. |
| `voc_a2_because-of_272` | **because of** | *conjunction* | `/bɪˈkɔz əv/` | a causa de | We stayed home because of the storm. | Nos quedamos en casa a causa de la tormenta. |
| `voc_a2_thats-why_273` | **that's why** | *conjunction* | `/ðæts waɪ/` | por eso | That's why I called you. | Por eso te llamé. |
| `voc_a2_in-contrast_274` | **in contrast** | *conjunction* | `/ɪn ˈkɑntræst/` | en contraste | In contrast, her sister loves the city. | En contraste, a su hermana le encanta la ciudad. |
| `voc_a2_instead_275` | **instead** | *conjunction* | `/ɪnˈstɛd/` | en cambio | Let's have tea instead. | Tomemos té en cambio. |
| `voc_a2_nevertheless_276` | **nevertheless** | *conjunction* | `/ˌnɛvərðəˈlɛs/` | sin embargo/no obstante | It was raining; nevertheless, we went out. | Estaba lloviendo; sin embargo, salimos. |
| `voc_a2_nonetheless_277` | **nonetheless** | *conjunction* | `/ˌnʌnðəˈlɛs/` | no obstante | The task was hard; nonetheless, she finished it. | La tarea fue difícil; no obstante, ella la terminó. |
| `voc_a2_moreover_278` | **moreover** | *conjunction* | `/mɔrˈoʊvər/` | además | The hotel is cheap; moreover, it's very clean. | El hotel es barato; además, está muy limpio. |
| `voc_a2_furthermore_279` | **furthermore** | *conjunction* | `/ˈfɜrðərˌmɔr/` | además/asimismo | Furthermore, the staff was very kind. | Además, el personal fue muy amable. |
| `voc_a2_in-addition_280` | **in addition** | *conjunction* | `/ɪn əˈdɪʃən/` | adicionalmente | In addition, we offer free delivery. | Adicionalmente, ofrecemos envío gratis. |
| `voc_a2_besides_281` | **besides** | *conjunction* | `/bɪˈsaɪdz/` | además | Besides, I don't have time today. | Además, no tengo tiempo hoy. |
| `voc_a2_apart-from_282` | **apart from** | *conjunction* | `/əˈpɑrt frʌm/` | aparte de | Apart from the price, everything was perfect. | Aparte del precio, todo estuvo perfecto. |
| `voc_a2_in-conclusion_283` | **in conclusion** | *conjunction* | `/ɪn kənˈkluʒən/` | en conclusión | In conclusion, the plan was a success. | En conclusión, el plan fue un éxito. |
| `voc_a2_to-sum-up_284` | **to sum up** | *conjunction* | `/tu sʌm ʌp/` | en resumen | To sum up, we need more time. | En resumen, necesitamos más tiempo. |
| `voc_a2_overall_285` | **overall** | *conjunction* | `/ˈoʊvərˌɔl/` | en general | Overall, it was a great trip. | En general, fue un gran viaje. |
| `voc_a2_in-general_286` | **in general** | *conjunction* | `/ɪn ˈdʒɛnərəl/` | en general | In general, people were friendly. | En general, la gente fue amigable. |
| `voc_a2_such-as_287` | **such as** | *conjunction* | `/sʌtʃ æz/` | tal como | I like fruits such as mango and papaya. | Me gustan frutas como el mango y la papaya. |
| `voc_a2_in-particular_288` | **in particular** | *conjunction* | `/ɪn pərˈtɪkjələr/` | en particular | I liked one dish in particular. | Me gustó un platillo en particular. |

### Semana 6: Expresar opiniones
Total de palabras en esta semana: **44**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_in-my-opinion_289` | **in my opinion** | *noun* | `/ɪn maɪ əˈpɪnjən/` | en mi opinión | In my opinion, this movie is excellent. | En mi opinión, esta película es excelente. |
| `voc_a2_i-believe-that_290` | **I believe that** | *noun* | `/aɪ bɪˈliv ðæt/` | creo que | I believe that honesty is important. | Creo que la honestidad es importante. |
| `voc_a2_i-feel-that_291` | **I feel that** | *noun* | `/aɪ fil ðæt/` | siento que | I feel that we should wait. | Siento que deberíamos esperar. |
| `voc_a2_personally_292` | **personally** | *adverb* | `/ˈpɜrsənəli/` | personalmente | Personally, I prefer tea over coffee. | Personalmente, prefiero el té sobre el café. |
| `voc_a2_from-my-point-of-vie_293` | **from my point of view** | *noun* | `/frʌm maɪ pɔɪnt əv vju/` | desde mi punto de vista | From my point of view, it's a fair decision. | Desde mi punto de vista, es una decisión justa. |
| `voc_a2_i-agree_294` | **I agree** | *noun* | `/aɪ əˈgri/` | estoy de acuerdo | I agree with your idea. | Estoy de acuerdo con tu idea. |
| `voc_a2_i-disagree_295` | **I disagree** | *noun* | `/aɪ dɪsəˈgri/` | no estoy de acuerdo | I disagree with that plan. | No estoy de acuerdo con ese plan. |
| `voc_a2_im-not-sure_296` | **I'm not sure** | *noun* | `/aɪm nɑt ʃʊr/` | no estoy seguro | I'm not sure about the schedule. | No estoy seguro sobre el horario. |
| `voc_a2_it-seems-to-me_297` | **it seems to me** | *noun* | `/ɪt simz tu mi/` | me parece que | It seems to me that he is right. | Me parece que él tiene razón. |
| `voc_a2_as-far-as-i-know_298` | **as far as I know** | *noun* | `/æz fɑr æz aɪ noʊ/` | que yo sepa | As far as I know, the store is open. | Que yo sepa, la tienda está abierta. |
| `voc_a2_i-suppose_299` | **I suppose** | *noun* | `/aɪ səˈpoʊz/` | supongo | I suppose you're right. | Supongo que tienes razón. |
| `voc_a2_i-guess_300` | **I guess (opinion)** | *noun* | `/aɪ gɛs/` | supongo/creo | I guess we can try it. | Supongo que podemos intentarlo. |
| `voc_a2_to-be-honest_301` | **to be honest** | *noun* | `/tu bi ˈɑnəst/` | para ser honesto | To be honest, I didn't like the food. | Para ser honesto, no me gustó la comida. |
| `voc_a2_in-fact_302` | **in fact** | *noun* | `/ɪn fækt/` | de hecho | In fact, she already knew the answer. | De hecho, ella ya sabía la respuesta. |
| `voc_a2_definitely_303` | **definitely** | *adverb* | `/ˈdɛfənətli/` | definitivamente | I will definitely come to the party. | Definitivamente iré a la fiesta. |
| `voc_a2_absolutely_304` | **absolutely** | *adverb* | `/ˌæbsəˈlutli/` | absolutamente | That's absolutely true. | Eso es absolutamente cierto. |
| `voc_a2_of-course_305` | **of course** | *noun* | `/ʌv kɔrs/` | por supuesto | Of course, I can help you. | Por supuesto, puedo ayudarte. |
| `voc_a2_no-way_306` | **no way** | *noun* | `/noʊ weɪ/` | de ninguna manera | No way, that's impossible. | De ninguna manera, eso es imposible. |
| `voc_a2_thats-true_307` | **that's true** | *noun* | `/ðæts tru/` | eso es cierto | That's true, I hadn't thought of that. | Eso es cierto, no lo había pensado. |
| `voc_a2_thats-not-true_308` | **that's not true** | *noun* | `/ðæts nɑt tru/` | eso no es cierto | That's not true; I checked it myself. | Eso no es cierto; lo verifiqué yo mismo. |
| `voc_a2_i-doubt-it_309` | **I doubt it** | *noun* | `/aɪ daʊt ɪt/` | lo dudo | I doubt it will rain today. | Dudo que llueva hoy. |
| `voc_a2_it-depends_310` | **it depends** | *noun* | `/ɪt dɪˈpɛndz/` | depende | It depends on the weather. | Depende del clima. |
| `voc_a2_on-one-hand_311` | **on one hand** | *noun* | `/ɑn wʌn hænd/` | por un lado | On one hand, it's expensive. | Por un lado, es caro. |
| `voc_a2_on-the-other-hand_312` | **on the other hand** | *noun* | `/ɑn ði ˈʌðər hænd/` | por otro lado | On the other hand, it's very useful. | Por otro lado, es muy útil. |
| `voc_a2_its-obvious_313` | **it's obvious** | *noun* | `/ɪts ˈɑbviəs/` | es obvio | It's obvious that she is tired. | Es obvio que ella está cansada. |
| `voc_a2_clearly_314` | **clearly** | *adverb* | `/ˈklɪrli/` | claramente | Clearly, we need a new plan. | Claramente, necesitamos un nuevo plan. |
| `voc_a2_apparently_315` | **apparently** | *adverb* | `/əˈpɛrəntli/` | aparentemente | Apparently, the store closed early. | Aparentemente, la tienda cerró temprano. |
| `voc_a2_allegedly_316` | **allegedly** | *adverb* | `/əˈlɛdʒədli/` | supuestamente | He allegedly missed the flight. | Supuestamente él perdió el vuelo. |
| `voc_a2_presumably_317` | **presumably** | *adverb* | `/prɪˈzuməbli/` | presumiblemente | Presumably, they took another route. | Presumiblemente, tomaron otra ruta. |
| `voc_a2_undoubtedly_318` | **undoubtedly** | *adverb* | `/ʌnˈdaʊtɪdli/` | sin duda | This is undoubtedly the best option. | Esta es sin duda la mejor opción. |
| `voc_a2_arguably_319` | **arguably** | *adverb* | `/ˈɑrgjuəbli/` | posiblemente/se podría decir | This is arguably her best book. | Este es posiblemente su mejor libro. |
| `voc_a2_in-my-experience_320` | **in my experience** | *noun* | `/ɪn maɪ ɪkˈspɪriəns/` | en mi experiencia | In my experience, patience helps a lot. | En mi experiencia, la paciencia ayuda mucho. |
| `voc_a2_based-on_321` | **based on** | *noun* | `/beɪst ɑn/` | basado en | Based on the data, sales are growing. | Basado en los datos, las ventas están creciendo. |
| `voc_a2_according-to_322` | **according to** | *noun* | `/əˈkɔrdɪŋ tu/` | según | According to the report, prices went up. | Según el informe, los precios subieron. |
| `voc_a2_evidence_323` | **evidence** | *noun* | `/ˈɛvɪdəns/` | evidencia | There is no evidence for that claim. | No hay evidencia para esa afirmación. |
| `voc_a2_argument_324` | **argument** | *noun* | `/ˈɑrgjəmənt/` | argumento | Her argument was very convincing. | Su argumento fue muy convincente. |
| `voc_a2_viewpoint-standpoint_325` | **viewpoint / standpoint** | *noun* | `/ˈvjuˌpɔɪnt/` | punto de vista | Consider his viewpoint too. | Considera también su punto de vista. |
| `voc_a2_counterargument_326` | **counterargument** | *noun* | `/ˈkaʊntərˌɑrgjəmənt/` | contraargumento | He didn't have a good counterargument. | Él no tenía un buen contraargumento. |
| `voc_a2_valid-point_327` | **valid point** | *noun* | `/ˈvælɪd pɔɪnt/` | punto válido | That's a valid point. | Ese es un punto válido. |
| `voc_a2_convince_328` | **convince** | *verb* | `/kənˈvɪns/` | convencer | I tried to convince her to stay. | Traté de convencerla de quedarse. |
| `voc_a2_persuade_329` | **persuade** | *verb* | `/pərˈsweɪd/` | persuadir | He persuaded us to try the new restaurant. | Él nos persuadió de probar el nuevo restaurante. |
| `voc_a2_debate_330` | **debate** | *verb* | `/dɪˈbeɪt/` | debate | They debated the topic for an hour. | Debatieron el tema durante una hora. |
| `voc_a2_controversy_331` | **controversy** | *noun* | `/ˈkɑntrəˌvɜrsi/` | controversia | The decision caused a lot of controversy. | La decisión causó mucha controversia. |
| `voc_a2_agree-to-disagree_332` | **agree to disagree** | *noun* | `/əˈgri tu dɪsəˈgri/` | acordar estar en desacuerdo | We decided to agree to disagree. | Decidimos acordar estar en desacuerdo. |

### Semana 7: Clima y desastres naturales
Total de palabras en esta semana: **34**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_heatwave_333` | **heatwave** | *noun* | `/ˈhitˌweɪv/` | ola de calor | A heatwave hit the city last week. | Una ola de calor golpeó la ciudad la semana pasada. |
| `voc_a2_wildfire_334` | **wildfire** | *noun* | `/ˈwaɪldˌfaɪər/` | incendio forestal | The wildfire destroyed many acres of forest. | El incendio forestal destruyó muchos acres de bosque. |
| `voc_a2_hurricane_335` | **hurricane** | *noun* | `/ˈhɜrəˌkeɪn/` | huracán | The hurricane hit the coast at midnight. | El huracán golpeó la costa a medianoche. |
| `voc_a2_tornado_336` | **tornado** | *adjective* | `/tɔrˈneɪˌdoʊ/` | tornado | A tornado destroyed several houses. | Un tornado destruyó varias casas. |
| `voc_a2_tsunami_337` | **tsunami** | *noun* | `/tsuˈnɑmi/` | tsunami | The tsunami warning was issued quickly. | La alerta de tsunami se emitió rápidamente. |
| `voc_a2_avalanche_338` | **avalanche** | *noun* | `/ˈævəˌlæntʃ/` | avalancha | The avalanche blocked the mountain road. | La avalancha bloqueó el camino de la montaña. |
| `voc_a2_landslide_339` | **landslide** | *noun* | `/ˈlændˌslaɪd/` | deslizamiento de tierra | The landslide damaged several homes. | El deslizamiento de tierra dañó varias casas. |
| `voc_a2_blizzard_340` | **blizzard** | *noun* | `/ˈblɪzərd/` | ventisca | The blizzard closed all the schools. | La ventisca cerró todas las escuelas. |
| `voc_a2_hailstorm_341` | **hailstorm** | *adjective* | `/ˈheɪlˌstɔrm/` | granizada | The hailstorm damaged the crops. | La granizada dañó los cultivos. |
| `voc_a2_thunderstorm_342` | **thunderstorm** | *noun* | `/ˈθʌndərˌstɔrm/` | tormenta eléctrica | A thunderstorm is coming tonight. | Una tormenta eléctrica se acerca esta noche. |
| `voc_a2_temperature-drop_343` | **temperature drop** | *noun* | `/ˈtɛmpərətʃər drɑp/` | descenso de temperatura | There was a sudden temperature drop. | Hubo un descenso repentino de temperatura. |
| `voc_a2_climate-change_344` | **climate change** | *noun* | `/ˈklaɪmɪt tʃeɪndʒ/` | cambio climático | Climate change affects the whole planet. | El cambio climático afecta a todo el planeta. |
| `voc_a2_global-warming_345` | **global warming** | *noun* | `/ˈgloʊbəl ˈwɔrmɪŋ/` | calentamiento global | Global warming is a serious issue. | El calentamiento global es un problema serio. |
| `voc_a2_greenhouse-effect_346` | **greenhouse effect** | *noun* | `/ˈgrinˌhaʊs ɪˈfɛkt/` | efecto invernadero | The greenhouse effect traps heat in the atmosphere. | El efecto invernadero atrapa el calor en la atmósfera. |
| `voc_a2_carbon-footprint_347` | **carbon footprint** | *noun* | `/ˈkɑrbən ˈfʊtˌprɪnt/` | huella de carbono | We should reduce our carbon footprint. | Deberíamos reducir nuestra huella de carbono. |
| `voc_a2_renewable-energy_348` | **renewable energy** | *adjective* | `/rɪˈnuəbəl ˈɛnərdʒi/` | energía renovable | The country invests in renewable energy. | El país invierte en energía renovable. |
| `voc_a2_deforestation_349` | **deforestation** | *noun* | `/diˌfɔrɪˈsteɪʃən/` | deforestación | Deforestation harms many animal species. | La deforestación daña a muchas especies animales. |
| `voc_a2_extinction_350` | **extinction** | *noun* | `/ɪkˈstɪŋkʃən/` | extinción | This species is close to extinction. | Esta especie está cerca de la extinción. |
| `voc_a2_endangered-species_351` | **endangered species** | *noun* | `/ɪnˈdeɪndʒərd ˈspiʃiz/` | especie en peligro | Pandas are an endangered species. | Los pandas son una especie en peligro. |
| `voc_a2_natural-disaster_352` | **natural disaster** | *noun* | `/ˈnætʃərəl dɪˈzæstər/` | desastre natural | The government responded quickly to the natural disaster. | El gobierno respondió rápido al desastre natural. |
| `voc_a2_shelter_353` | **shelter (emergency)** | *noun* | `/ˈʃɛltər/` | refugio | Families went to the shelter for safety. | Las familias fueron al refugio por seguridad. |
| `voc_a2_relief-effort_354` | **relief effort** | *noun* | `/rɪˈlif ˈɛfərt/` | esfuerzo de ayuda | The relief effort helped thousands of people. | El esfuerzo de ayuda ayudó a miles de personas. |
| `voc_a2_damage_355` | **damage** | *noun* | `/ˈdæmɪdʒ/` | daño | The storm caused a lot of damage. | La tormenta causó mucho daño. |
| `voc_a2_destruction_356` | **destruction** | *noun* | `/dɪˈstrʌkʃən/` | destrucción | The destruction was visible everywhere. | La destrucción era visible en todas partes. |
| `voc_a2_rebuild_357` | **rebuild** | *verb* | `/riˈbɪld/` | reconstruir | They will rebuild the school next year. | Reconstruirán la escuela el próximo año. |
| `voc_a2_warning-system_358` | **warning system** | *noun* | `/ˈwɔrnɪŋ ˈsɪstəm/` | sistema de alerta | The warning system saved many lives. | El sistema de alerta salvó muchas vidas. |
| `voc_a2_meteorologist_359` | **meteorologist** | *noun* | `/ˌmitiərˈɑlədʒɪst/` | meteorólogo | The meteorologist predicted heavy rain. | El meteorólogo predijo lluvia fuerte. |
| `voc_a2_atmosphere_360` | **atmosphere** | *noun* | `/ˈætməsˌfɪr/` | atmósfera | Pollution affects the atmosphere. | La contaminación afecta la atmósfera. |
| `voc_a2_ozone-layer_361` | **ozone layer** | *noun* | `/ˈoʊˌzoʊn ˈleɪər/` | capa de ozono | The ozone layer protects us from the sun. | La capa de ozono nos protege del sol. |
| `voc_a2_ecosystem_362` | **ecosystem** | *noun* | `/ˈikoʊˌsɪstəm/` | ecosistema | This ecosystem has many species. | Este ecosistema tiene muchas especies. |
| `voc_a2_biodiversity_363` | **biodiversity** | *noun* | `/ˌbaɪoʊdaɪˈvɜrsəti/` | biodiversidad | The rainforest has incredible biodiversity. | La selva tropical tiene una biodiversidad increíble. |
| `voc_a2_sustainability_364` | **sustainability** | *noun* | `/səˌsteɪnəˈbɪləti/` | sostenibilidad | The company focuses on sustainability. | La empresa se enfoca en la sostenibilidad. |
| `voc_a2_emission_365` | **emission** | *noun* | `/ɪˈmɪʃən/` | emisión | We need to reduce carbon emissions. | Necesitamos reducir las emisiones de carbono. |
| `voc_a2_fossil-fuel_366` | **fossil fuel** | *noun* | `/ˈfɑsəl ˈfjuəl/` | combustible fósil | Fossil fuels pollute the air. | Los combustibles fósiles contaminan el aire. |

### Semana 8: Educación y estudios superiores
Total de palabras en esta semana: **46**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_enroll_367` | **enroll** | *noun* | `/ɪnˈroʊl/` | inscribirse | I want to enroll in this course. | Quiero inscribirme en este curso. |
| `voc_a2_tuition_368` | **tuition** | *noun* | `/tuˈɪʃən/` | matrícula (costo) | Tuition increased this year. | La matrícula subió este año. |
| `voc_a2_scholarship_369` | **scholarship** | *noun* | `/ˈskɑlərˌʃɪp/` | beca | She received a full scholarship. | Ella recibió una beca completa. |
| `voc_a2_semester_370` | **semester** | *noun* | `/səˈmɛstər/` | semestre | The semester ends in May. | El semestre termina en mayo. |
| `voc_a2_syllabus_371` | **syllabus** | *noun* | `/ˈsɪləbəs/` | programa del curso | Check the syllabus for the dates. | Revisa el programa del curso para las fechas. |
| `voc_a2_lecture_372` | **lecture** | *noun* | `/ˈlɛktʃər/` | clase magistral | The lecture lasted two hours. | La clase magistral duró dos horas. |
| `voc_a2_seminar_373` | **seminar** | *noun* | `/ˈsɛməˌnɑr/` | seminario | We attended a seminar on writing. | Asistimos a un seminario de escritura. |
| `voc_a2_thesis_374` | **thesis** | *noun* | `/ˈθisɪs/` | tesis | She is writing her thesis. | Ella está escribiendo su tesis. |
| `voc_a2_dissertation_375` | **dissertation** | *noun* | `/ˌdɪsərˈteɪʃən/` | tesis doctoral | His dissertation took two years. | Su tesis doctoral tomó dos años. |
| `voc_a2_major_376` | **major (field of study)** | *noun* | `/ˈmeɪdʒər/` | carrera principal | My major is computer science. | Mi carrera principal es ciencias de la computación. |
| `voc_a2_minor_377` | **minor (field of study)** | *noun* | `/ˈmaɪnər/` | especialización secundaria | She has a minor in art. | Ella tiene una especialización secundaria en arte. |
| `voc_a2_gpa_378` | **GPA** | *noun* | `/ˌdʒiˌpiˈeɪ/` | promedio académico | His GPA is very high. | Su promedio académico es muy alto. |
| `voc_a2_transcript_379` | **transcript** | *noun* | `/ˈtrænˌskrɪpt/` | historial académico | I need my official transcript. | Necesito mi historial académico oficial. |
| `voc_a2_diploma_380` | **diploma** | *noun* | `/dɪˈploʊmə/` | diploma | He received his diploma last week. | Él recibió su diploma la semana pasada. |
| `voc_a2_certificate_381` | **certificate** | *noun* | `/sərˈtɪfɪkɪt/` | certificado | She got a certificate in marketing. | Ella obtuvo un certificado en marketing. |
| `voc_a2_campus_382` | **campus** | *noun* | `/ˈkæmpəs/` | campus | The campus is very large. | El campus es muy grande. |
| `voc_a2_dormitory_383` | **dormitory** | *noun* | `/ˈdɔrməˌtɔri/` | residencia estudiantil | He lives in a dormitory. | Él vive en una residencia estudiantil. |
| `voc_a2_faculty_384` | **faculty** | *noun* | `/ˈfækəlti/` | facultad/cuerpo docente | The faculty meets every Friday. | El cuerpo docente se reúne todos los viernes. |
| `voc_a2_professor_385` | **professor** | *noun* | `/prəˈfɛsər/` | profesor universitario | My professor is very demanding. | Mi profesor es muy exigente. |
| `voc_a2_academic-advisor_386` | **academic advisor** | *noun* | `/ˌækəˈdɛmɪk ædˈvaɪzər/` | asesor académico | Talk to your academic advisor. | Habla con tu asesor académico. |
| `voc_a2_plagiarism_387` | **plagiarism** | *noun* | `/ˈpleɪdʒəˌrɪzəm/` | plagio | Plagiarism is not allowed. | El plagio no está permitido. |
| `voc_a2_assignment_388` | **assignment** | *noun* | `/əˈsaɪnmənt/` | tarea/trabajo | The assignment is due tomorrow. | La tarea se entrega mañana. |
| `voc_a2_essay_389` | **essay** | *noun* | `/ˈɛˌseɪ/` | ensayo | I wrote an essay about climate change. | Escribí un ensayo sobre el cambio climático. |
| `voc_a2_research-paper_390` | **research paper** | *noun* | `/ˈrisɜrtʃ ˈpeɪpər/` | trabajo de investigación | Her research paper was published. | Su trabajo de investigación fue publicado. |
| `voc_a2_citation_391` | **citation** | *noun* | `/saɪˈteɪʃən/` | cita bibliográfica | Add the citation at the end. | Agrega la cita bibliográfica al final. |
| `voc_a2_bibliography_392` | **bibliography** | *noun* | `/ˌbɪbliˈɑgrəfi/` | bibliografía | Check the bibliography for sources. | Revisa la bibliografía para ver las fuentes. |
| `voc_a2_peer-review_393` | **peer review** | *noun* | `/pɪr rɪˈvju/` | revisión por pares | The article went through peer review. | El artículo pasó por revisión por pares. |
| `voc_a2_graduate_394` | **graduate** | *adjective* | `/ˈgrædʒuət/` | graduado | She is a graduate student now. | Ella es estudiante de posgrado ahora. |
| `voc_a2_undergraduate_395` | **undergraduate** | *adjective* | `/ˌʌndərˈgrædʒuət/` | estudiante de pregrado | He is an undergraduate at this university. | Él es estudiante de pregrado en esta universidad. |
| `voc_a2_postgraduate_396` | **postgraduate** | *adjective* | `/poʊstˈgrædʒuət/` | posgrado | She started a postgraduate program. | Ella empezó un programa de posgrado. |
| `voc_a2_internship_397` | **internship** | *noun* | `/ˈɪntərnˌʃɪp/` | pasantía | I did an internship last summer. | Hice una pasantía el verano pasado. |
| `voc_a2_apprenticeship_398` | **apprenticeship** | *noun* | `/əˈprɛntɪsˌʃɪp/` | aprendizaje (oficio) | He completed his apprenticeship. | Él completó su aprendizaje. |
| `voc_a2_vocational-training_399` | **vocational training** | *noun* | `/voʊˈkeɪʃənəl ˈtreɪnɪŋ/` | formación profesional | She chose vocational training instead. | Ella eligió formación profesional en su lugar. |
| `voc_a2_distance-learning_400` | **distance learning** | *noun* | `/ˈdɪstəns ˈlɜrnɪŋ/` | educación a distancia | Distance learning is very flexible. | La educación a distancia es muy flexible. |
| `voc_a2_online-course_401` | **online course** | *noun* | `/ˈɔnˌlaɪn kɔrs/` | curso en línea | I signed up for an online course. | Me inscribí en un curso en línea. |
| `voc_a2_tutor_402` | **tutor** | *noun* | `/ˈtutər/` | tutor | I hired a math tutor. | Contraté a un tutor de matemáticas. |
| `voc_a2_mentor_403` | **mentor** | *noun* | `/ˈmɛnˌtɔr/` | mentor | She has a great mentor at work. | Ella tiene un gran mentor en el trabajo. |
| `voc_a2_extracurricular_404` | **extracurricular** | *adjective* | `/ˌɛkstrəkəˈrɪkjələr/` | extracurricular | He joined an extracurricular club. | Él se unió a un club extracurricular. |
| `voc_a2_student-loan_405` | **student loan** | *noun* | `/ˈstudənt loʊn/` | préstamo estudiantil | She is still paying her student loan. | Ella todavía está pagando su préstamo estudiantil. |
| `voc_a2_financial-aid_406` | **financial aid** | *noun* | `/faɪˈnænʃəl eɪd/` | ayuda financiera | I applied for financial aid. | Solicité ayuda financiera. |
| `voc_a2_dropout_407` | **dropout** | *noun* | `/ˈdrɑpˌaʊt/` | abandono escolar | The dropout rate decreased this year. | La tasa de abandono escolar bajó este año. |
| `voc_a2_literacy_408` | **literacy** | *noun* | `/ˈlɪtərəsi/` | alfabetización | Literacy programs help many adults. | Los programas de alfabetización ayudan a muchos adultos. |
| `voc_a2_curriculum_409` | **curriculum** | *noun* | `/kəˈrɪkjələm/` | plan de estudios | The school updated its curriculum. | La escuela actualizó su plan de estudios. |
| `voc_a2_elective_410` | **elective** | *adjective* | `/ɪˈlɛktɪv/` | materia electiva | I chose an elective in photography. | Elegí una materia electiva de fotografía. |
| `voc_a2_credit-hour_411` | **credit hour** | *noun* | `/ˈkrɛdɪt aʊər/` | hora crédito | This class is worth three credit hours. | Esta clase vale tres horas crédito. |
| `voc_a2_exam-period_412` | **exam period** | *noun* | `/ɪgˈzæm ˈpɪriəd/` | periodo de exámenes | The library is full during exam period. | La biblioteca está llena durante el periodo de exámenes. |

### Semana 9: Relaciones y emociones complejas
Total de palabras en esta semana: **44**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_trust-issues_413` | **trust issues** | *noun* | `/trʌst ˈɪʃuz/` | problemas de confianza | He has trust issues after the breakup. | Él tiene problemas de confianza después de la ruptura. |
| `voc_a2_commitment_414` | **commitment** | *noun* | `/kəˈmɪtmənt/` | compromiso | Marriage requires real commitment. | El matrimonio requiere compromiso real. |
| `voc_a2_breakup_415` | **breakup** | *noun* | `/ˈbreɪˌkʌp/` | ruptura | Their breakup was difficult for both. | Su ruptura fue difícil para ambos. |
| `voc_a2_reconciliation_416` | **reconciliation** | *noun* | `/ˌrɛkənˌsɪliˈeɪʃən/` | reconciliación | Their reconciliation surprised everyone. | Su reconciliación sorprendió a todos. |
| `voc_a2_betrayal_417` | **betrayal** | *noun* | `/bɪˈtreɪəl/` | traición | She never forgot his betrayal. | Ella nunca olvidó su traición. |
| `voc_a2_forgiveness_418` | **forgiveness** | *noun* | `/fərˈgɪvnəs/` | perdón | Forgiveness takes time. | El perdón toma tiempo. |
| `voc_a2_empathy_419` | **empathy** | *noun* | `/ˈɛmpəθi/` | empatía | She showed great empathy toward him. | Ella mostró gran empatía hacia él. |
| `voc_a2_sympathy_420` | **sympathy** | *noun* | `/ˈsɪmpəθi/` | compasión/comprensión | I have sympathy for her situation. | Siento comprensión por su situación. |
| `voc_a2_compassion_421` | **compassion** | *noun* | `/kəmˈpæʃən/` | compasión | He treated the patients with compassion. | Él trató a los pacientes con compasión. |
| `voc_a2_resentment_422` | **resentment** | *noun* | `/rɪˈzɛntmənt/` | resentimiento | There was resentment between the brothers. | Había resentimiento entre los hermanos. |
| `voc_a2_heartbreak_423` | **heartbreak** | *noun* | `/ˈhɑrtˌbreɪk/` | desamor | She wrote a song about heartbreak. | Ella escribió una canción sobre el desamor. |
| `voc_a2_infatuation_424` | **infatuation** | *noun* | `/ɪnˌfætʃuˈeɪʃən/` | enamoramiento pasajero | It was just an infatuation, not love. | Era solo un enamoramiento pasajero, no amor. |
| `voc_a2_attraction_425` | **attraction** | *noun* | `/əˈtrækʃən/` | atracción | There was instant attraction between them. | Hubo atracción instantánea entre ellos. |
| `voc_a2_compatibility_426` | **compatibility** | *noun* | `/kəmˌpætəˈbɪləti/` | compatibilidad | Compatibility is important in a relationship. | La compatibilidad es importante en una relación. |
| `voc_a2_conflict-resolution_427` | **conflict resolution** | *noun* | `/ˈkɑnflɪkt ˌrɛzəˈluʃən/` | resolución de conflictos | We practiced conflict resolution at work. | Practicamos la resolución de conflictos en el trabajo. |
| `voc_a2_compromise_428` | **compromise** | *noun* | `/ˈkɑmprəˌmaɪz/` | compromiso/acuerdo | They reached a compromise. | Llegaron a un acuerdo. |
| `voc_a2_mutual-respect_429` | **mutual respect** | *noun* | `/ˈmjutʃuəl rɪˈspɛkt/` | respeto mutuo | Their friendship is based on mutual respect. | Su amistad se basa en respeto mutuo. |
| `voc_a2_boundaries_430` | **boundaries** | *noun* | `/ˈbaʊndəriz/` | límites (emocionales) | It's healthy to set boundaries. | Es saludable poner límites. |
| `voc_a2_codependency_431` | **codependency** | *noun* | `/ˌkoʊdɪˈpɛndənsi/` | codependencia | The therapist talked about codependency. | El terapeuta habló sobre la codependencia. |
| `voc_a2_long-distance-relati_432` | **long-distance relationship** | *noun* | `/ˌlɔŋˈdɪstəns rɪˈleɪʃənˌʃɪp/` | relación a distancia | They are in a long-distance relationship. | Están en una relación a distancia. |
| `voc_a2_soulmate_433` | **soulmate** | *noun* | `/ˈsoʊlˌmeɪt/` | alma gemela | She believes he is her soulmate. | Ella cree que él es su alma gemela. |
| `voc_a2_companionship_434` | **companionship** | *noun* | `/kəmˈpænjənˌʃɪp/` | compañerismo | Pets provide great companionship. | Las mascotas brindan un gran compañerismo. |
| `voc_a2_intimacy_435` | **intimacy** | *noun* | `/ˈɪntəməsi/` | intimidad | Intimacy grows with time and trust. | La intimidad crece con el tiempo y la confianza. |
| `voc_a2_vulnerability_436` | **vulnerability** | *noun* | `/ˌvʌlnərəˈbɪləti/` | vulnerabilidad | Sharing feelings takes vulnerability. | Compartir sentimientos requiere vulnerabilidad. |
| `voc_a2_self-esteem_437` | **self-esteem** | *noun* | `/ˌsɛlfɪˈstim/` | autoestima | Exercise can improve self-esteem. | El ejercicio puede mejorar la autoestima. |
| `voc_a2_self-doubt_438` | **self-doubt** | *noun* | `/ˌsɛlfˈdaʊt/` | inseguridad/duda de uno mismo | She struggled with self-doubt before the interview. | Ella luchó con inseguridad antes de la entrevista. |
| `voc_a2_insecurity_439` | **insecurity** | *noun* | `/ˌɪnsɪˈkjʊrəti/` | inseguridad | His insecurity affected the relationship. | Su inseguridad afectó la relación. |
| `voc_a2_overwhelmed_440` | **overwhelmed** | *adjective* | `/ˌoʊvərˈwɛlmd/` | abrumado | She felt overwhelmed by all the work. | Ella se sintió abrumada por todo el trabajo. |
| `voc_a2_burnout_441` | **burnout** | *noun* | `/ˈbɜrnˌaʊt/` | agotamiento (laboral/emocional) | He is suffering from burnout. | Él está sufriendo de agotamiento. |
| `voc_a2_frustration_442` | **frustration** | *noun* | `/frʌˈstreɪʃən/` | frustración | I could see her frustration. | Pude ver su frustración. |
| `voc_a2_irritation_443` | **irritation** | *noun* | `/ˌɪrɪˈteɪʃən/` | irritación | There was a bit of irritation in his voice. | Había un poco de irritación en su voz. |
| `voc_a2_resentful_444` | **resentful** | *adjective* | `/rɪˈzɛntfəl/` | resentido | She felt resentful after the argument. | Ella se sintió resentida después de la discusión. |
| `voc_a2_heartfelt_445` | **heartfelt** | *adjective* | `/ˈhɑrtˌfɛlt/` | sincero/de corazón | He wrote a heartfelt letter. | Él escribió una carta sincera. |
| `voc_a2_overjoyed_446` | **overjoyed** | *adjective* | `/ˌoʊvərˈdʒɔɪd/` | muy feliz | We were overjoyed at the news. | Estábamos muy felices con la noticia. |
| `voc_a2_devastated_447` | **devastated** | *adjective* | `/ˈdɛvəˌsteɪtɪd/` | devastado | She was devastated after the loss. | Ella quedó devastada después de la pérdida. |
| `voc_a2_humiliated_448` | **humiliated** | *adjective* | `/hjuˈmɪliˌeɪtɪd/` | humillado | He felt humiliated in front of everyone. | Él se sintió humillado frente a todos. |
| `voc_a2_ashamed_449` | **ashamed** | *adjective* | `/əˈʃeɪmd/` | avergonzado | I felt ashamed of my mistake. | Me sentí avergonzado de mi error. |
| `voc_a2_guilty_450` | **guilty** | *adjective* | `/ˈgɪlti/` | culpable | She felt guilty for forgetting his birthday. | Ella se sintió culpable por olvidar su cumpleaños. |
| `voc_a2_remorse_451` | **remorse** | *noun* | `/rɪˈmɔrs/` | remordimiento | He showed real remorse. | Él mostró un remordimiento real. |
| `voc_a2_regret_452` | **regret** | *noun* | `/rɪˈgrɛt/` | arrepentimiento | I have no regret about my decision. | No tengo arrepentimiento por mi decisión. |
| `voc_a2_longing_453` | **longing** | *noun* | `/ˈlɔŋɪŋ/` | anhelo | She felt a longing for her hometown. | Ella sintió un anhelo por su ciudad natal. |
| `voc_a2_nostalgia_454` | **nostalgia** | *noun* | `/nɑˈstældʒə/` | nostalgia | The song brought back nostalgia. | La canción trajo nostalgia. |
| `voc_a2_contentment_455` | **contentment** | *noun* | `/kənˈtɛntmənt/` | satisfacción/contento | He felt contentment after the trip. | Él sintió satisfacción después del viaje. |
| `voc_a2_fulfillment_456` | **fulfillment** | *noun* | `/fʊlˈfɪlmənt/` | realización personal | Her job gives her real fulfillment. | Su trabajo le da una verdadera realización. |

### Semana 10: Tecnología intermedia: redes y seguridad
Total de palabras en esta semana: **39**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_firewall_457` | **firewall** | *noun* | `/ˈfaɪərˌwɔl/` | cortafuegos | The firewall blocked the attack. | El cortafuegos bloqueó el ataque. |
| `voc_a2_antivirus_458` | **antivirus** | *noun* | `/ˌæntiˈvaɪrəs/` | antivirus | Install antivirus on your computer. | Instala antivirus en tu computadora. |
| `voc_a2_malware_459` | **malware** | *noun* | `/ˈmælˌwɛr/` | malware | The email contained malware. | El correo contenía malware. |
| `voc_a2_phishing_460` | **phishing** | *noun* | `/ˈfɪʃɪŋ/` | phishing (fraude en línea) | Be careful with phishing emails. | Ten cuidado con los correos de phishing. |
| `voc_a2_hacker_461` | **hacker** | *noun* | `/ˈhækər/` | hacker | A hacker stole the data. | Un hacker robó los datos. |
| `voc_a2_cybersecurity_462` | **cybersecurity** | *noun* | `/ˌsaɪbərsɪˈkjʊrəti/` | ciberseguridad | The company invests in cybersecurity. | La empresa invierte en ciberseguridad. |
| `voc_a2_encryption_463` | **encryption** | *noun* | `/ɛnˈkrɪpʃən/` | cifrado | This app uses strong encryption. | Esta aplicación usa cifrado fuerte. |
| `voc_a2_two-factor-authentic_464` | **two-factor authentication** | *noun* | `/ˈtuˌfæktər ɔˌθɛntɪˈkeɪʃən/` | autenticación de dos factores | Turn on two-factor authentication. | Activa la autenticación de dos factores. |
| `voc_a2_backup_465` | **backup** | *noun* | `/ˈbækˌʌp/` | copia de seguridad | I made a backup of my files. | Hice una copia de seguridad de mis archivos. |
| `voc_a2_cloud-storage_466` | **cloud storage** | *noun* | `/klaʊd ˈstɔrɪdʒ/` | almacenamiento en la nube | I use cloud storage for photos. | Uso almacenamiento en la nube para las fotos. |
| `voc_a2_server_467` | **server** | *noun* | `/ˈsɜrvər/` | servidor | The server is down right now. | El servidor está caído en este momento. |
| `voc_a2_database_468` | **database** | *noun* | `/ˈdeɪtəˌbeɪs/` | base de datos | We updated the customer database. | Actualizamos la base de datos de clientes. |
| `voc_a2_browser_469` | **browser** | *noun* | `/ˈbraʊzər/` | navegador | Open a new browser tab. | Abre una nueva pestaña del navegador. |
| `voc_a2_cookie_470` | **cookie (internet)** | *noun* | `/ˈkʊki/` | cookie (internet) | The site asks to accept cookies. | El sitio pide aceptar cookies. |
| `voc_a2_cache_471` | **cache** | *noun* | `/kæʃ/` | caché | Clear your browser cache. | Limpia la caché de tu navegador. |
| `voc_a2_bandwidth_472` | **bandwidth** | *noun* | `/ˈbændˌwɪdθ/` | ancho de banda | We need more bandwidth for video calls. | Necesitamos más ancho de banda para videollamadas. |
| `voc_a2_router_473` | **router** | *noun* | `/ˈraʊtər/` | router | Restart the router if it's slow. | Reinicia el router si está lento. |
| `voc_a2_bluetooth_474` | **bluetooth** | *noun* | `/ˈbluˌtuθ/` | bluetooth | Connect your headphones via bluetooth. | Conecta tus audífonos por bluetooth. |
| `voc_a2_hotspot_475` | **hotspot** | *noun* | `/ˈhɑtˌspɑt/` | punto de acceso | I used my phone as a hotspot. | Usé mi teléfono como punto de acceso. |
| `voc_a2_streaming_476` | **streaming** | *noun* | `/ˈstrimɪŋ/` | transmisión en línea | We watched the game via streaming. | Vimos el partido por transmisión en línea. |
| `voc_a2_notification_477` | **notification** | *noun* | `/ˌnoʊtəfɪˈkeɪʃən/` | notificación | I got a notification about the meeting. | Recibí una notificación sobre la reunión. |
| `voc_a2_settings_478` | **settings** | *noun* | `/ˈsɛtɪŋz/` | configuración | Check your privacy settings. | Revisa tu configuración de privacidad. |
| `voc_a2_factory-reset_479` | **factory reset** | *noun* | `/ˈfæktəri ˈrisɛt/` | restablecer de fábrica | I did a factory reset on my phone. | Le hice un restablecimiento de fábrica a mi teléfono. |
| `voc_a2_screenshot_480` | **screenshot** | *noun* | `/ˈskrinˌʃɑt/` | captura de pantalla | Can you send me a screenshot? | ¿Me envías una captura de pantalla? |
| `voc_a2_hashtag_481` | **hashtag** | *noun* | `/ˈhæʃˌtæg/` | hashtag | The hashtag went viral. | El hashtag se volvió viral. |
| `voc_a2_algorithm_482` | **algorithm** | *noun* | `/ˈælgəˌrɪðəm/` | algoritmo | The algorithm suggests videos for you. | El algoritmo te sugiere videos. |
| `voc_a2_artificial-intellige_483` | **artificial intelligence** | *noun* | `/ˌɑrtəˈfɪʃəl ɪnˈtɛlədʒəns/` | inteligencia artificial | Artificial intelligence is changing many jobs. | La inteligencia artificial está cambiando muchos trabajos. |
| `voc_a2_virtual-reality_484` | **virtual reality** | *noun* | `/ˈvɜrtʃuəl riˈæləti/` | realidad virtual | We tried virtual reality at the fair. | Probamos realidad virtual en la feria. |
| `voc_a2_augmented-reality_485` | **augmented reality** | *adjective* | `/ɔgˈmɛntɪd riˈæləti/` | realidad aumentada | The app uses augmented reality. | La aplicación usa realidad aumentada. |
| `voc_a2_e-commerce_486` | **e-commerce** | *noun* | `/ˈiˌkɑmərs/` | comercio electrónico | E-commerce has grown a lot. | El comercio electrónico ha crecido mucho. |
| `voc_a2_online-banking_487` | **online banking** | *noun* | `/ˈɔnˌlaɪn ˈbæŋkɪŋ/` | banca en línea | I use online banking every week. | Uso la banca en línea cada semana. |
| `voc_a2_digital-signature_488` | **digital signature** | *noun* | `/ˈdɪdʒɪtəl ˈsɪgnətʃər/` | firma digital | Sign the document with a digital signature. | Firma el documento con una firma digital. |
| `voc_a2_biometric_489` | **biometric** | *noun* | `/ˌbaɪoʊˈmɛtrɪk/` | biométrico | The phone uses biometric security. | El teléfono usa seguridad biométrica. |
| `voc_a2_fingerprint-scanner_490` | **fingerprint scanner** | *noun* | `/ˈfɪŋgərˌprɪnt ˈskænər/` | lector de huellas | Unlock your phone with the fingerprint scanner. | Desbloquea tu teléfono con el lector de huellas. |
| `voc_a2_facial-recognition_491` | **facial recognition** | *noun* | `/ˈfeɪʃəl ˌrɛkəgˈnɪʃən/` | reconocimiento facial | The airport uses facial recognition. | El aeropuerto usa reconocimiento facial. |
| `voc_a2_smart-home_492` | **smart home** | *adjective* | `/smɑrt hoʊm/` | hogar inteligente | We installed a smart home system. | Instalamos un sistema de hogar inteligente. |
| `voc_a2_wearable-device_493` | **wearable device** | *noun* | `/ˈwɛrəbəl dɪˈvaɪs/` | dispositivo portátil | She wears a wearable device to track sleep. | Ella usa un dispositivo portátil para monitorear el sueño. |
| `voc_a2_drone_494` | **drone** | *noun* | `/droʊn/` | dron | He flew a drone over the beach. | Él voló un dron sobre la playa. |
| `voc_a2_d-printing_495` | **3D printing** | *noun* | `/ˈθriˈdi ˈprɪntɪŋ/` | impresión 3D | 3D printing is used in medicine now. | La impresión 3D se usa en medicina ahora. |

### Semana 11: Cocina y recetas
Total de palabras en esta semana: **59**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_recipe_496` | **recipe** | *noun* | `/ˈrɛsəpi/` | receta | This recipe is very easy. | Esta receta es muy fácil. |
| `voc_a2_ingredient_497` | **ingredient** | *adjective* | `/ɪnˈgridiənt/` | ingrediente | Check if you have all the ingredients. | Revisa si tienes todos los ingredientes. |
| `voc_a2_chop_498` | **chop** | *verb* | `/tʃɑp/` | picar | Chop the onion finely. | Pica la cebolla finamente. |
| `voc_a2_slice_499` | **slice** | *verb* | `/slaɪs/` | cortar en rodajas | Slice the bread, please. | Corta el pan en rebanadas, por favor. |
| `voc_a2_grate_500` | **grate** | *verb* | `/greɪt/` | rallar | Grate some cheese on top. | Ralla un poco de queso encima. |
| `voc_a2_peel_501` | **peel** | *verb* | `/pil/` | pelar | Peel the potatoes first. | Pela las papas primero. |
| `voc_a2_whisk_502` | **whisk** | *verb* | `/wɪsk/` | batir | Whisk the eggs until smooth. | Bate los huevos hasta que queden suaves. |
| `voc_a2_stir_503` | **stir** | *verb* | `/stɜr/` | revolver | Stir the soup slowly. | Revuelve la sopa lentamente. |
| `voc_a2_boil_504` | **boil** | *verb* | `/bɔɪl/` | hervir | Boil the water first. | Hierve el agua primero. |
| `voc_a2_simmer_505` | **simmer** | *verb* | `/ˈsɪmər/` | cocinar a fuego lento | Let the sauce simmer for ten minutes. | Deja que la salsa se cocine a fuego lento diez minutos. |
| `voc_a2_roast_506` | **roast** | *verb* | `/roʊst/` | asar (horno) | We roasted the chicken for an hour. | Asamos el pollo durante una hora. |
| `voc_a2_grill_507` | **grill** | *verb* | `/grɪl/` | asar a la parrilla | We grilled vegetables for dinner. | Asamos verduras a la parrilla para la cena. |
| `voc_a2_bake_508` | **bake** | *verb* | `/beɪk/` | hornear | I baked a cake for her birthday. | Horneé un pastel para su cumpleaños. |
| `voc_a2_fry_509` | **fry** | *verb* | `/fraɪ/` | freír | Fry the eggs in a little oil. | Fríe los huevos en un poco de aceite. |
| `voc_a2_steam_510` | **steam** | *verb* | `/stim/` | cocinar al vapor | Steam the vegetables for five minutes. | Cocina las verduras al vapor cinco minutos. |
| `voc_a2_marinate_511` | **marinate** | *verb* | `/ˈmɛrəˌneɪt/` | marinar | Marinate the chicken overnight. | Marina el pollo durante la noche. |
| `voc_a2_garnish_512` | **garnish** | *verb* | `/ˈgɑrnɪʃ/` | decorar (plato) | Garnish the plate with parsley. | Decora el plato con perejil. |
| `voc_a2_portion_513` | **portion** | *noun* | `/ˈpɔrʃən/` | porción | This is a large portion. | Esta es una porción grande. |
| `voc_a2_serving_514` | **serving** | *noun* | `/ˈsɜrvɪŋ/` | porción/ración | One serving has 300 calories. | Una porción tiene 300 calorías. |
| `voc_a2_leftovers_515` | **leftovers** | *noun* | `/ˈlɛftˌoʊvərz/` | sobras | We ate the leftovers for lunch. | Comimos las sobras en el almuerzo. |
| `voc_a2_preheat_516` | **preheat** | *verb* | `/ˈpriˌhit/` | precalentar | Preheat the oven to 180 degrees. | Precalienta el horno a 180 grados. |
| `voc_a2_blend_517` | **blend** | *verb* | `/blɛnd/` | licuar | Blend the fruit with some water. | Licúa la fruta con un poco de agua. |
| `voc_a2_mash_518` | **mash** | *verb* | `/mæʃ/` | triturar/hacer puré | Mash the potatoes with butter. | Haz puré de las papas con mantequilla. |
| `voc_a2_dice_519` | **dice** | *verb* | `/daɪs/` | cortar en cubos | Dice the tomatoes small. | Corta los tomates en cubos pequeños. |
| `voc_a2_sprinkle_520` | **sprinkle** | *verb* | `/ˈsprɪŋkəl/` | espolvorear | Sprinkle some sugar on top. | Espolvorea un poco de azúcar encima. |
| `voc_a2_drizzle_521` | **drizzle** | *verb* | `/ˈdrɪzəl/` | rociar (líquido) | Drizzle olive oil over the salad. | Rocía aceite de oliva sobre la ensalada. |
| `voc_a2_sauce_522` | **sauce** | *noun* | `/sɔs/` | salsa | The pasta has tomato sauce. | La pasta tiene salsa de tomate. |
| `voc_a2_broth-stock_523` | **broth / stock** | *noun* | `/brɔθ/` | caldo | Use chicken broth for this soup. | Usa caldo de pollo para esta sopa. |
| `voc_a2_dough_524` | **dough** | *noun* | `/doʊ/` | masa | The dough needs to rest. | La masa necesita reposar. |
| `voc_a2_batter_525` | **batter** | *noun* | `/ˈbætər/` | masa líquida | Mix the batter well. | Mezcla bien la masa líquida. |
| `voc_a2_yeast_526` | **yeast** | *noun* | `/jist/` | levadura | Add yeast to the flour. | Agrega levadura a la harina. |
| `voc_a2_flour_527` | **flour** | *noun* | `/flaʊər/` | harina | We need two cups of flour. | Necesitamos dos tazas de harina. |
| `voc_a2_baking-powder_528` | **baking powder** | *noun* | `/ˈbeɪkɪŋ ˈpaʊdər/` | polvo de hornear | Don't forget the baking powder. | No olvides el polvo de hornear. |
| `voc_a2_vanilla_529` | **vanilla** | *noun* | `/vəˈnɪlə/` | vainilla | Add a little vanilla to the cake. | Agrega un poco de vainilla al pastel. |
| `voc_a2_cinnamon_530` | **cinnamon** | *noun* | `/ˈsɪnəmən/` | canela | Sprinkle cinnamon on the coffee. | Espolvorea canela sobre el café. |
| `voc_a2_herbs_531` | **herbs** | *noun* | `/ɜrbz/` | hierbas | Fresh herbs improve the flavor. | Las hierbas frescas mejoran el sabor. |
| `voc_a2_spices_532` | **spices** | *noun* | `/ˈspaɪsɪz/` | especias | This dish has many spices. | Este platillo tiene muchas especias. |
| `voc_a2_recipe-book-cookbook_533` | **recipe book / cookbook** | *noun* | `/ˈrɛsəpi bʊk/` | libro de cocina | She has a huge recipe book. | Ella tiene un enorme libro de cocina. |
| `voc_a2_nutrition-label_534` | **nutrition label** | *noun* | `/nuˈtrɪʃən ˈleɪbəl/` | etiqueta nutricional | Read the nutrition label first. | Lee la etiqueta nutricional primero. |
| `voc_a2_expiration-date_535` | **expiration date** | *noun* | `/ˌɛkspəˈreɪʃən deɪt/` | fecha de caducidad | Check the expiration date. | Revisa la fecha de caducidad. |
| `voc_a2_organic_536` | **organic** | *noun* | `/ɔrˈgænɪk/` | orgánico | We buy organic vegetables. | Compramos verduras orgánicas. |
| `voc_a2_homemade_537` | **homemade** | *noun* | `/ˈhoʊmˈmeɪd/` | casero | This bread is homemade. | Este pan es casero. |
| `voc_a2_store-bought_538` | **store-bought** | *noun* | `/stɔr bɔt/` | comprado en tienda | I prefer homemade over store-bought. | Prefiero lo casero antes que lo comprado en tienda. |
| `voc_a2_vegetarian_539` | **vegetarian** | *noun* | `/ˌvɛdʒəˈtɛriən/` | vegetariano | My sister is vegetarian. | Mi hermana es vegetariana. |
| `voc_a2_vegan_540` | **vegan** | *noun* | `/ˈvigən/` | vegano | This restaurant has vegan options. | Este restaurante tiene opciones veganas. |
| `voc_a2_gluten-free_541` | **gluten-free** | *noun* | `/ˈglutənˈfri/` | sin gluten | This bread is gluten-free. | Este pan es sin gluten. |
| `voc_a2_dairy-free_542` | **dairy-free** | *noun* | `/ˈdɛriˈfri/` | sin lácteos | She drinks dairy-free milk. | Ella bebe leche sin lácteos. |
| `voc_a2_food-processor_543` | **food processor** | *noun* | `/fud ˈprɑˌsɛsər/` | procesador de alimentos | Use the food processor for the sauce. | Usa el procesador de alimentos para la salsa. |
| `voc_a2_blender_544` | **blender** | *noun* | `/ˈblɛndər/` | licuadora | I use the blender every morning. | Uso la licuadora todas las mañanas. |
| `voc_a2_mixing-bowl_545` | **mixing bowl** | *noun* | `/ˈmɪksɪŋ boʊl/` | tazón para mezclar | Put the flour in the mixing bowl. | Pon la harina en el tazón para mezclar. |
| `voc_a2_cutting-board_546` | **cutting board** | *noun* | `/ˈkʌtɪŋ bɔrd/` | tabla de cortar | Use a clean cutting board. | Usa una tabla de cortar limpia. |
| `voc_a2_measuring-cup_547` | **measuring cup** | *noun* | `/ˈmɛʒərɪŋ kʌp/` | taza medidora | I need the measuring cup for this. | Necesito la taza medidora para esto. |
| `voc_a2_colander_548` | **colander** | *noun* | `/ˈkɑləndər/` | colador | Drain the pasta in a colander. | Escurre la pasta en un colador. |
| `voc_a2_apron_549` | **apron** | *noun* | `/ˈeɪprən/` | delantal | Put on your apron before cooking. | Ponte el delantal antes de cocinar. |
| `voc_a2_recipe-card_550` | **recipe card** | *noun* | `/ˈrɛsəpi kɑrd/` | tarjeta de receta | She wrote it on a recipe card. | Ella lo escribió en una tarjeta de receta. |
| `voc_a2_side-dish_551` | **side dish** | *noun* | `/saɪd dɪʃ/` | guarnición | Rice is a good side dish. | El arroz es una buena guarnición. |
| `voc_a2_main-course_552` | **main course** | *noun* | `/meɪn kɔrs/` | plato principal | The main course was fish. | El plato principal fue pescado. |
| `voc_a2_appetizer_553` | **appetizer** | *adjective* | `/ˈæpəˌtaɪzər/` | aperitivo | We ordered an appetizer first. | Pedimos un aperitivo primero. |
| `voc_a2_dessert_554` | **dessert** | *noun* | `/dɪˈzɜrt/` | postre | What's for dessert? | ¿Qué hay de postre? |

### Semana 12: Mantenimiento del hogar y reparaciones
Total de palabras en esta semana: **50**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_repair_555` | **repair** | *verb* | `/rɪˈpɛr/` | reparar | We need to repair the roof. | Necesitamos reparar el techo. |
| `voc_a2_leak_556` | **leak** | *noun* | `/lik/` | fuga | There is a leak in the kitchen. | Hay una fuga en la cocina. |
| `voc_a2_clog_557` | **clog** | *verb* | `/klɑg/` | atascar/atasco | The sink is clogged again. | El fregadero está atascado otra vez. |
| `voc_a2_broken-pipe_558` | **broken pipe** | *noun* | `/ˈbroʊkən paɪp/` | tubería rota | A broken pipe flooded the bathroom. | Una tubería rota inundó el baño. |
| `voc_a2_renovate_559` | **renovate** | *verb* | `/ˈrɛnəˌveɪt/` | renovar | We plan to renovate the kitchen. | Planeamos renovar la cocina. |
| `voc_a2_remodel_560` | **remodel** | *verb* | `/riˈmɑdəl/` | remodelar | They remodeled the whole house. | Ellos remodelaron toda la casa. |
| `voc_a2_diy_561` | **DIY (do it yourself)** | *noun* | `/ˌdiˌaɪˈwaɪ/` | hazlo tú mismo | This is a fun DIY project. | Este es un divertido proyecto de hazlo tú mismo. |
| `voc_a2_blueprint_562` | **blueprint** | *noun* | `/ˈbluˌprɪnt/` | plano | The architect showed us the blueprint. | El arquitecto nos mostró el plano. |
| `voc_a2_contractor_563` | **contractor** | *noun* | `/ˈkɑnˌtræktər/` | contratista | We hired a good contractor. | Contratamos a un buen contratista. |
| `voc_a2_handyman_564` | **handyman** | *noun* | `/ˈhændiˌmæn/` | manitas/reparador | The handyman fixed the door. | El manitas arregló la puerta. |
| `voc_a2_maintenance_565` | **maintenance** | *noun* | `/ˈmeɪntənəns/` | mantenimiento | The building needs maintenance. | El edificio necesita mantenimiento. |
| `voc_a2_inspection_566` | **inspection** | *noun* | `/ɪnˈspɛkʃən/` | inspección | We scheduled an inspection. | Programamos una inspección. |
| `voc_a2_electrical-outlet_567` | **electrical outlet** | *adjective* | `/ɪˈlɛktrɪkəl ˈaʊtlɛt/` | tomacorriente | This electrical outlet doesn't work. | Este tomacorriente no funciona. |
| `voc_a2_circuit-breaker_568` | **circuit breaker** | *noun* | `/ˈsɜrkət ˈbreɪkər/` | interruptor automático | The circuit breaker tripped. | El interruptor automático se disparó. |
| `voc_a2_fuse_569` | **fuse** | *noun* | `/fjuz/` | fusible | A fuse blew during the storm. | Un fusible se quemó durante la tormenta. |
| `voc_a2_wiring_570` | **wiring** | *noun* | `/ˈwaɪrɪŋ/` | cableado | The wiring in this house is old. | El cableado de esta casa es viejo. |
| `voc_a2_plumbing_571` | **plumbing** | *noun* | `/ˈplʌmɪŋ/` | plomería | The plumbing needs to be checked. | La plomería necesita revisarse. |
| `voc_a2_drain_572` | **drain** | *noun* | `/dreɪn/` | desagüe | The drain is clogged with hair. | El desagüe está tapado con pelo. |
| `voc_a2_faucet-tap_573` | **faucet / tap** | *noun* | `/ˈfɔsət/` | grifo | The faucet is dripping. | El grifo está goteando. |
| `voc_a2_thermostat_574` | **thermostat** | *noun* | `/ˈθɜrməˌstæt/` | termostato | Set the thermostat to 22 degrees. | Ajusta el termostato a 22 grados. |
| `voc_a2_insulation_575` | **insulation** | *noun* | `/ˌɪnsəˈleɪʃən/` | aislamiento | We added insulation in the attic. | Agregamos aislamiento en el ático. |
| `voc_a2_ventilation_576` | **ventilation** | *noun* | `/ˌvɛntəˈleɪʃən/` | ventilación | The bathroom needs better ventilation. | El baño necesita mejor ventilación. |
| `voc_a2_mold_577` | **mold** | *noun* | `/moʊld/` | moho | There is mold on the wall. | Hay moho en la pared. |
| `voc_a2_pest-control_578` | **pest control** | *noun* | `/pɛst kənˈtroʊl/` | control de plagas | We called a pest control company. | Llamamos a una empresa de control de plagas. |
| `voc_a2_termite_579` | **termite** | *noun* | `/ˈtɜrmaɪt/` | termita | Termites damaged the wooden floor. | Las termitas dañaron el piso de madera. |
| `voc_a2_rust_580` | **rust** | *noun* | `/rʌst/` | óxido | The gate has some rust. | El portón tiene un poco de óxido. |
| `voc_a2_crack_581` | **crack (wall)** | *noun* | `/kræk/` | grieta | There's a crack in the wall. | Hay una grieta en la pared. |
| `voc_a2_dent_582` | **dent** | *noun* | `/dɛnt/` | abolladura | The car has a small dent. | El carro tiene una pequeña abolladura. |
| `voc_a2_scratch_583` | **scratch** | *noun* | `/skrætʃ/` | rayón | There's a scratch on the table. | Hay un rayón en la mesa. |
| `voc_a2_stain_584` | **stain** | *noun* | `/steɪn/` | mancha | This stain won't come out. | Esta mancha no sale. |
| `voc_a2_paint-roller_585` | **paint roller** | *noun* | `/peɪnt ˈroʊlər/` | rodillo de pintura | Use a paint roller for the walls. | Usa un rodillo de pintura para las paredes. |
| `voc_a2_sandpaper_586` | **sandpaper** | *noun* | `/ˈsændˌpeɪpər/` | papel de lija | Smooth the wood with sandpaper. | Alisa la madera con papel de lija. |
| `voc_a2_nail-gun_587` | **nail gun** | *noun* | `/neɪl gʌn/` | pistola de clavos | He used a nail gun for the fence. | Él usó una pistola de clavos para la cerca. |
| `voc_a2_power-drill_588` | **power drill** | *noun* | `/ˈpaʊər drɪl/` | taladro eléctrico | I borrowed a power drill. | Pedí prestado un taladro eléctrico. |
| `voc_a2_toolbox_589` | **toolbox** | *noun* | `/ˈtulˌbɑks/` | caja de herramientas | The toolbox is in the garage. | La caja de herramientas está en el garaje. |
| `voc_a2_measuring-tape_590` | **measuring tape** | *noun* | `/ˈmɛʒərɪŋ teɪp/` | cinta métrica | Use the measuring tape for the window. | Usa la cinta métrica para la ventana. |
| `voc_a2_level_591` | **level (tool)** | *noun* | `/ˈlɛvəl/` | nivel (herramienta) | Check it with a level. | Revísalo con un nivel. |
| `voc_a2_wrench_592` | **wrench** | *noun* | `/rɛntʃ/` | llave inglesa | Pass me the wrench, please. | Pásame la llave inglesa, por favor. |
| `voc_a2_pliers_593` | **pliers** | *noun* | `/ˈplaɪərz/` | alicates | I need pliers for this wire. | Necesito alicates para este cable. |
| `voc_a2_safety-goggles_594` | **safety goggles** | *noun* | `/ˈseɪfti ˈgɑgəlz/` | gafas de seguridad | Wear safety goggles when you cut wood. | Usa gafas de seguridad cuando cortes madera. |
| `voc_a2_estimate_595` | **estimate (cost)** | *noun* | `/ˈɛstəmət/` | presupuesto/estimado | We got an estimate from the plumber. | Recibimos un presupuesto del plomero. |
| `voc_a2_quote_596` | **quote (price)** | *noun* | `/kwoʊt/` | cotización | The quote seems reasonable. | La cotización parece razonable. |
| `voc_a2_appliance-repair_597` | **appliance repair** | *noun* | `/əˈplaɪəns rɪˈpɛr/` | reparación de electrodomésticos | We called for appliance repair. | Llamamos para reparación de electrodomésticos. |
| `voc_a2_gutter_598` | **gutter** | *noun* | `/ˈgʌtər/` | canaleta | Clean the gutters before winter. | Limpia las canaletas antes del invierno. |
| `voc_a2_chimney_599` | **chimney** | *noun* | `/ˈtʃɪmni/` | chimenea | The chimney needs cleaning. | La chimenea necesita limpieza. |
| `voc_a2_foundation_600` | **foundation (house)** | *noun* | `/faʊnˈdeɪʃən/` | cimientos | There's a crack in the foundation. | Hay una grieta en los cimientos. |
| `voc_a2_structural-damage_601` | **structural damage** | *noun* | `/ˈstrʌktʃərəl ˈdæmɪdʒ/` | daño estructural | The storm caused structural damage. | La tormenta causó daño estructural. |
| `voc_a2_home-inspection_602` | **home inspection** | *noun* | `/hoʊm ɪnˈspɛkʃən/` | inspección de vivienda | We scheduled a home inspection. | Programamos una inspección de vivienda. |
| `voc_a2_recyclable_603` | **recyclable** | *adjective* | `/riˈsaɪkləbəl/` | reciclable | This packaging is recyclable. | Este empaque es reciclable. |
| `voc_a2_waste-disposal_604` | **waste disposal** | *noun* | `/weɪst dɪˈspoʊzəl/` | eliminación de residuos | Follow the city's waste disposal rules. | Sigue las reglas de eliminación de residuos de la ciudad. |

### Semana 13: Deportes y vida activa
Total de palabras en esta semana: **40**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_tournament_605` | **tournament** | *noun* | `/ˈtʊrnəmənt/` | torneo | Our team won the tournament. | Nuestro equipo ganó el torneo. |
| `voc_a2_league_606` | **league** | *noun* | `/lig/` | liga | He plays in the local league. | Él juega en la liga local. |
| `voc_a2_teammate_607` | **teammate** | *noun* | `/ˈtiˌmeɪt/` | compañero de equipo | My teammate passed me the ball. | Mi compañero de equipo me pasó la pelota. |
| `voc_a2_opponent_608` | **opponent** | *noun* | `/əˈpoʊnənt/` | oponente | Our opponent played very well. | Nuestro oponente jugó muy bien. |
| `voc_a2_warm-up_609` | **warm-up** | *noun* | `/ˈwɔrmˌʌp/` | calentamiento | Do a warm-up before running. | Haz un calentamiento antes de correr. |
| `voc_a2_stretch_610` | **stretch** | *verb* | `/strɛtʃ/` | estirar | Stretch your legs before exercise. | Estira las piernas antes de hacer ejercicio. |
| `voc_a2_stamina_611` | **stamina** | *noun* | `/ˈstæmənə/` | resistencia | Running builds stamina. | Correr desarrolla resistencia. |
| `voc_a2_cardio_612` | **cardio** | *noun* | `/ˈkɑrdioʊ/` | cardio | I do cardio three times a week. | Hago cardio tres veces por semana. |
| `voc_a2_strength-training_613` | **strength training** | *noun* | `/strɛŋθ ˈtreɪnɪŋ/` | entrenamiento de fuerza | Strength training helps build muscle. | El entrenamiento de fuerza ayuda a formar músculo. |
| `voc_a2_personal-trainer_614` | **personal trainer** | *noun* | `/ˈpɜrsənəl ˈtreɪnər/` | entrenador personal | She works with a personal trainer. | Ella trabaja con un entrenador personal. |
| `voc_a2_workout_615` | **workout** | *noun* | `/ˈwɜrˌkaʊt/` | rutina de ejercicio | My workout takes an hour. | Mi rutina de ejercicio toma una hora. |
| `voc_a2_set_616` | **set (exercise)** | *noun* | `/sɛt/` | serie (ejercicio) | Do three sets of ten. | Haz tres series de diez. |
| `voc_a2_rep-repetition_617` | **rep / repetition** | *noun* | `/rɛp/` | repetición | Try to do more reps. | Intenta hacer más repeticiones. |
| `voc_a2_marathon_618` | **marathon** | *noun* | `/ˈmɛrəˌθɑn/` | maratón | She finished her first marathon. | Ella terminó su primer maratón. |
| `voc_a2_sprint_619` | **sprint** | *verb* | `/sprɪnt/` | carrera corta/esprintar | He sprinted to the finish line. | Él corrió a toda velocidad hasta la meta. |
| `voc_a2_finish-line_620` | **finish line** | *noun* | `/ˈfɪnɪʃ laɪn/` | línea de meta | She crossed the finish line first. | Ella cruzó la línea de meta primero. |
| `voc_a2_medal_621` | **medal** | *noun* | `/ˈmɛdəl/` | medalla | He won a gold medal. | Él ganó una medalla de oro. |
| `voc_a2_trophy_622` | **trophy** | *noun* | `/ˈtroʊfi/` | trofeo | The team lifted the trophy. | El equipo levantó el trofeo. |
| `voc_a2_record_623` | **record (sports)** | *noun* | `/ˈrɛkərd/` | récord | She broke the school record. | Ella rompió el récord escolar. |
| `voc_a2_draw_624` | **draw (tie)** | *noun* | `/drɔ/` | empate | The match ended in a draw. | El partido terminó en empate. |
| `voc_a2_penalty_625` | **penalty** | *noun* | `/ˈpɛnəlti/` | penalti | The referee gave a penalty. | El árbitro marcó un penalti. |
| `voc_a2_foul_626` | **foul** | *noun* | `/faʊl/` | falta | That was a clear foul. | Esa fue una falta clara. |
| `voc_a2_injury-time_627` | **injury time** | *noun* | `/ˈɪndʒəri taɪm/` | tiempo de descuento | They scored during injury time. | Anotaron durante el tiempo de descuento. |
| `voc_a2_substitute_628` | **substitute (player)** | *noun* | `/ˈsʌbstɪˌtut/` | suplente | The substitute scored the winning goal. | El suplente anotó el gol de la victoria. |
| `voc_a2_spectator_629` | **spectator** | *noun* | `/ˈspɛkteɪtər/` | espectador | Thousands of spectators watched the game. | Miles de espectadores vieron el partido. |
| `voc_a2_scoreboard_630` | **scoreboard** | *noun* | `/ˈskɔrˌbɔrd/` | marcador | Check the scoreboard for the result. | Revisa el marcador para ver el resultado. |
| `voc_a2_halftime_631` | **halftime** | *noun* | `/ˈhæfˌtaɪm/` | medio tiempo | The coach talked to the team at halftime. | El entrenador habló con el equipo en el medio tiempo. |
| `voc_a2_locker-room_632` | **locker room** | *noun* | `/ˈlɑkər rum/` | vestuario | The players are in the locker room. | Los jugadores están en el vestuario. |
| `voc_a2_equipment_633` | **equipment (sports)** | *noun* | `/ɪˈkwɪpmənt/` | equipo (deportivo) | Bring your own equipment. | Trae tu propio equipo. |
| `voc_a2_helmet_634` | **helmet** | *noun* | `/ˈhɛlmɪt/` | casco | Always wear a helmet. | Siempre usa casco. |
| `voc_a2_mat_635` | **mat (exercise)** | *noun* | `/mæt/` | colchoneta | Put your mat on the floor. | Pon tu colchoneta en el piso. |
| `voc_a2_treadmill_636` | **treadmill** | *noun* | `/ˈtrɛdˌmɪl/` | cinta de correr | I ran on the treadmill for thirty minutes. | Corrí en la cinta de correr treinta minutos. |
| `voc_a2_dumbbell_637` | **dumbbell** | *noun* | `/ˈdʌmˌbɛl/` | mancuerna | Lift the dumbbell slowly. | Levanta la mancuerna despacio. |
| `voc_a2_flexibility_638` | **flexibility** | *noun* | `/ˌflɛksəˈbɪləti/` | flexibilidad | Yoga improves flexibility. | El yoga mejora la flexibilidad. |
| `voc_a2_endurance_639` | **endurance** | *noun* | `/ɪnˈdʊrəns/` | resistencia (física) | Cycling improves endurance. | El ciclismo mejora la resistencia. |
| `voc_a2_posture_640` | **posture** | *noun* | `/ˈpɑstʃər/` | postura | Fix your posture when you sit. | Corrige tu postura al sentarte. |
| `voc_a2_physical-fitness_641` | **physical fitness** | *noun* | `/ˈfɪzɪkəl ˈfɪtnəs/` | aptitud física | Physical fitness improves your health. | La aptitud física mejora tu salud. |
| `voc_a2_recreational_642` | **recreational** | *adjective* | `/ˌrɛkriˈeɪʃənəl/` | recreativo | We play recreational soccer on Sundays. | Jugamos fútbol recreativo los domingos. |
| `voc_a2_outdoor-activity_643` | **outdoor activity** | *noun* | `/ˈaʊtˌdɔr ækˈtɪvəti/` | actividad al aire libre | Hiking is a great outdoor activity. | El senderismo es una gran actividad al aire libre. |
| `voc_a2_adventure-sport_644` | **adventure sport** | *noun* | `/ædˈvɛntʃər spɔrt/` | deporte de aventura | Rock climbing is an adventure sport. | La escalada es un deporte de aventura. |

### Semana 14: Cultura, medios y entretenimiento
Total de palabras en esta semana: **42**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_headline_645` | **headline** | *noun* | `/ˈhɛˌdlaɪn/` | titular | The headline caught my attention. | El titular llamó mi atención. |
| `voc_a2_breaking-news_646` | **breaking news** | *noun* | `/ˈbreɪkɪŋ nuz/` | noticia de última hora | This is breaking news. | Esta es una noticia de última hora. |
| `voc_a2_editorial_647` | **editorial** | *noun* | `/ˌɛdəˈtɔriəl/` | editorial | I read the editorial this morning. | Leí el editorial esta mañana. |
| `voc_a2_celebrity_648` | **celebrity** | *noun* | `/səˈlɛbrəti/` | celebridad | The celebrity attended the event. | La celebridad asistió al evento. |
| `voc_a2_plot_649` | **plot (story)** | *noun* | `/plɑt/` | trama | The plot was very confusing. | La trama fue muy confusa. |
| `voc_a2_character_650` | **character (story)** | *noun* | `/ˈkɛrɪktər/` | personaje | My favorite character is the villain. | Mi personaje favorito es el villano. |
| `voc_a2_genre_651` | **genre** | *noun* | `/ˈʒɑnrə/` | género | What is your favorite movie genre? | ¿Cuál es tu género de película favorito? |
| `voc_a2_soundtrack_652` | **soundtrack** | *noun* | `/ˈsaʊndˌtræk/` | banda sonora | I love the movie's soundtrack. | Me encanta la banda sonora de la película. |
| `voc_a2_subtitle_653` | **subtitle** | *noun* | `/ˈsʌbˌtaɪtəl/` | subtítulo | I watched it with subtitles. | Lo vi con subtítulos. |
| `voc_a2_box-office_654` | **box office** | *noun* | `/bɑks ˈɔfəs/` | taquilla | The film broke box office records. | La película rompió récords de taquilla. |
| `voc_a2_streaming-platform_655` | **streaming platform** | *noun* | `/ˈstrimɪŋ ˈplætˌfɔrm/` | plataforma de streaming | Which streaming platform do you use? | ¿Qué plataforma de streaming usas? |
| `voc_a2_premiere_656` | **premiere** | *noun* | `/prɪˈmɪr/` | estreno | We went to the movie premiere. | Fuimos al estreno de la película. |
| `voc_a2_sequel_657` | **sequel** | *noun* | `/ˈsikwəl/` | secuela | The sequel was better than the original. | La secuela fue mejor que la original. |
| `voc_a2_remake_658` | **remake** | *noun* | `/ˈriˌmeɪk/` | nueva versión | They released a remake of the classic. | Lanzaron una nueva versión del clásico. |
| `voc_a2_script_659` | **script** | *noun* | `/skrɪpt/` | guion | She wrote the script herself. | Ella escribió el guion ella misma. |
| `voc_a2_director_660` | **director** | *noun* | `/dɪˈrɛktər/` | director | The director won an award. | El director ganó un premio. |
| `voc_a2_producer_661` | **producer** | *noun* | `/prəˈdusər/` | productor | The producer funded the whole film. | El productor financió toda la película. |
| `voc_a2_audience_662` | **audience** | *noun* | `/ˈɔdiəns/` | audiencia | The audience loved the show. | Al público le encantó el espectáculo. |
| `voc_a2_review_663` | **review (critique)** | *noun* | `/rɪˈvju/` | crítica/reseña | The review was very positive. | La reseña fue muy positiva. |
| `voc_a2_critic_664` | **critic** | *noun* | `/ˈkrɪtɪk/` | crítico | The critic gave it five stars. | El crítico le dio cinco estrellas. |
| `voc_a2_bestselling_665` | **bestselling** | *adjective* | `/bɛstˈsɛlɪŋ/` | más vendido (libro) | This is a bestselling novel. | Esta es una novela más vendida. |
| `voc_a2_author_666` | **author** | *noun* | `/ˈɔθər/` | autor | The author signed my book. | El autor firmó mi libro. |
| `voc_a2_publisher_667` | **publisher** | *noun* | `/ˈpʌblɪʃər/` | editorial (empresa) | The publisher rejected the manuscript. | La editorial rechazó el manuscrito. |
| `voc_a2_edition_668` | **edition** | *noun* | `/ɪˈdɪʃən/` | edición | I have the first edition. | Tengo la primera edición. |
| `voc_a2_chapter_669` | **chapter** | *noun* | `/ˈtʃæptər/` | capítulo | I finished the last chapter. | Terminé el último capítulo. |
| `voc_a2_plot-twist_670` | **plot twist** | *noun* | `/plɑt twɪst/` | giro de la trama | The plot twist surprised everyone. | El giro de la trama sorprendió a todos. |
| `voc_a2_cliffhanger_671` | **cliffhanger** | *noun* | `/ˈklɪfˌhæŋər/` | final en suspenso | The episode ended in a cliffhanger. | El episodio terminó en suspenso. |
| `voc_a2_fan-base_672` | **fan base** | *noun* | `/fæn beɪs/` | base de fanáticos | The band has a huge fan base. | La banda tiene una enorme base de fanáticos. |
| `voc_a2_influencer_673` | **influencer** | *noun* | `/ˈɪnfluənsər/` | influencer | She works as an influencer. | Ella trabaja como influencer. |
| `voc_a2_viral_674` | **viral** | *adjective* | `/ˈvaɪrəl/` | viral | The video went viral overnight. | El video se volvió viral de la noche a la mañana. |
| `voc_a2_trending_675` | **trending** | *adjective* | `/ˈtrɛndɪŋ/` | en tendencia | This topic is trending today. | Este tema está en tendencia hoy. |
| `voc_a2_content-creator_676` | **content creator** | *noun* | `/ˈkɑnˌtɛnt kriˈeɪtər/` | creador de contenido | She is a full-time content creator. | Ella es creadora de contenido de tiempo completo. |
| `voc_a2_live-stream_677` | **live stream** | *noun* | `/laɪv strim/` | transmisión en vivo | We watched the live stream at home. | Vimos la transmisión en vivo desde casa. |
| `voc_a2_podcast_678` | **podcast** | *noun* | `/ˈpɑdˌkæst/` | podcast | I listen to a podcast every morning. | Escucho un podcast todas las mañanas. |
| `voc_a2_exhibit-exhibition_679` | **exhibit / exhibition** | *noun* | `/ɪgˈzɪbɪt/` | exhibición | We visited the art exhibit. | Visitamos la exhibición de arte. |
| `voc_a2_gallery_680` | **gallery** | *noun* | `/ˈgæləri/` | galería | The gallery has modern art. | La galería tiene arte moderno. |
| `voc_a2_performance_681` | **performance (show)** | *noun* | `/pərˈfɔrməns/` | actuación | The dance performance was amazing. | La actuación de baile fue increíble. |
| `voc_a2_stand-up-comedy_682` | **stand-up comedy** | *noun* | `/ˈstændˌʌp ˈkɑmədi/` | comedia en vivo | We watched a stand-up comedy show. | Vimos un show de comedia en vivo. |
| `voc_a2_orchestra_683` | **orchestra** | *noun* | `/ˈɔrkɪstrə/` | orquesta | The orchestra played beautifully. | La orquesta tocó hermosamente. |
| `voc_a2_choir_684` | **choir** | *noun* | `/kwaɪər/` | coro | She sings in the school choir. | Ella canta en el coro de la escuela. |
| `voc_a2_album_685` | **album** | *noun* | `/ˈælbəm/` | álbum | Their new album is excellent. | Su nuevo álbum es excelente. |
| `voc_a2_lyrics_686` | **lyrics** | *noun* | `/ˈlɪrɪks/` | letra de canción | I don't know the lyrics of this song. | No conozco la letra de esta canción. |

### Semana 15: Personalidad y carácter
Total de palabras en esta semana: **48**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_a2_ambitious_687` | **ambitious** | *adjective* | `/æmˈbɪʃəs/` | ambicioso | She is very ambitious about her career. | Ella es muy ambiciosa con su carrera. |
| `voc_a2_stubborn_688` | **stubborn** | *adjective* | `/ˈstʌbərn/` | terco | My brother is really stubborn. | Mi hermano es muy terco. |
| `voc_a2_arrogant_689` | **arrogant** | *adjective* | `/ˈɛrəgənt/` | arrogante | He seemed arrogant during the meeting. | Él pareció arrogante durante la reunión. |
| `voc_a2_humble_690` | **humble** | *adjective* | `/ˈhʌmbəl/` | humilde | She stayed humble after winning. | Ella se mantuvo humilde después de ganar. |
| `voc_a2_reliable_691` | **reliable** | *adjective* | `/rɪˈlaɪəbəl/` | confiable | He is a reliable friend. | Él es un amigo confiable. |
| `voc_a2_trustworthy_692` | **trustworthy** | *adjective* | `/ˈtrʌstˌwɜrði/` | digno de confianza | She is a trustworthy person. | Ella es una persona digna de confianza. |
| `voc_a2_sociable_693` | **sociable** | *adjective* | `/ˈsoʊʃəbəl/` | sociable | My cousin is very sociable. | Mi primo es muy sociable. |
| `voc_a2_introverted_694` | **introverted** | *adjective* | `/ˈɪntroʊˌvɜrtɪd/` | introvertido | He is more introverted than his sister. | Él es más introvertido que su hermana. |
| `voc_a2_extroverted_695` | **extroverted** | *adjective* | `/ˈɛkstroʊˌvɜrtɪd/` | extrovertido | She is extroverted and outgoing. | Ella es extrovertida y abierta. |
| `voc_a2_open-minded_696` | **open-minded** | *adjective* | `/ˈoʊpənˈmaɪndɪd/` | de mente abierta | My boss is very open-minded. | Mi jefe tiene mente muy abierta. |
| `voc_a2_closed-minded_697` | **closed-minded** | *adjective* | `/ˈkloʊzdˈmaɪndɪd/` | cerrado de mente | Don't be closed-minded about new ideas. | No seas de mente cerrada con ideas nuevas. |
| `voc_a2_judgmental_698` | **judgmental** | *adjective* | `/dʒʌdʒˈmɛntəl/` | crítico/juzgón | Try not to be judgmental. | Trata de no ser crítico/juzgón. |
| `voc_a2_optimistic_699` | **optimistic** | *adjective* | `/ˌɑptɪˈmɪstɪk/` | optimista | She is always optimistic. | Ella siempre es optimista. |
| `voc_a2_pessimistic_700` | **pessimistic** | *adjective* | `/ˌpɛsəˈmɪstɪk/` | pesimista | He can be a bit pessimistic. | Él puede ser un poco pesimista. |
| `voc_a2_realistic_701` | **realistic** | *adjective* | `/ˌriəˈlɪstɪk/` | realista | Let's be realistic about the timeline. | Seamos realistas sobre el tiempo. |
| `voc_a2_idealistic_702` | **idealistic** | *adjective* | `/aɪˌdiəˈlɪstɪk/` | idealista | He has idealistic views on society. | Él tiene visiones idealistas sobre la sociedad. |
| `voc_a2_assertive_703` | **assertive** | *adjective* | `/əˈsɜrtɪv/` | asertivo | You need to be more assertive. | Necesitas ser más asertivo. |
| `voc_a2_passive_704` | **passive** | *adjective* | `/ˈpæsɪv/` | pasivo | He is too passive at work. | Él es demasiado pasivo en el trabajo. |
| `voc_a2_aggressive_705` | **aggressive** | *adjective* | `/əˈgrɛsɪv/` | agresivo | Don't be aggressive during the debate. | No seas agresivo durante el debate. |
| `voc_a2_competitive_706` | **competitive** | *adjective* | `/kəmˈpɛtɪtɪv/` | competitivo | She is very competitive in sports. | Ella es muy competitiva en los deportes. |
| `voc_a2_cooperative_707` | **cooperative** | *adjective* | `/koʊˈɑpərətɪv/` | cooperativo | The whole team was cooperative. | Todo el equipo fue cooperativo. |
| `voc_a2_independent_708` | **independent** | *adjective* | `/ˌɪndɪˈpɛndənt/` | independiente | My daughter is very independent. | Mi hija es muy independiente. |
| `voc_a2_dependent_709` | **dependent** | *adjective* | `/dɪˈpɛndənt/` | dependiente | He is too dependent on his phone. | Él es demasiado dependiente de su teléfono. |
| `voc_a2_mature_710` | **mature** | *adjective* | `/məˈtʃʊr/` | maduro | She is mature for her age. | Ella es madura para su edad. |
| `voc_a2_immature_711` | **immature** | *adjective* | `/ˌɪməˈtʃʊr/` | inmaduro | He acted immature at the party. | Él actuó de forma inmadura en la fiesta. |
| `voc_a2_responsible_712` | **responsible** | *adjective* | `/rɪˈspɑnsəbəl/` | responsable | She is a responsible employee. | Ella es una empleada responsable. |
| `voc_a2_irresponsible_713` | **irresponsible** | *adjective* | `/ˌɪrɪˈspɑnsəbəl/` | irresponsable | It was irresponsible to leave early. | Fue irresponsable irse temprano. |
| `voc_a2_disciplined_714` | **disciplined** | *adjective* | `/ˈdɪsəplɪnd/` | disciplinado | He is very disciplined about studying. | Él es muy disciplinado con el estudio. |
| `voc_a2_spontaneous_715` | **spontaneous** | *adjective* | `/spɑnˈteɪniəs/` | espontáneo | She is spontaneous and fun. | Ella es espontánea y divertida. |
| `voc_a2_cautious_716` | **cautious** | *adjective* | `/ˈkɔʃəs/` | cauteloso | Be cautious near the edge. | Ten cuidado cerca del borde. |
| `voc_a2_adventurous_717` | **adventurous** | *adjective* | `/ædˈvɛntʃərəs/` | aventurero | My father is an adventurous person. | Mi padre es una persona aventurera. |
| `voc_a2_creative_718` | **creative** | *adjective* | `/kriˈeɪtɪv/` | creativo | She has a creative mind. | Ella tiene una mente creativa. |
| `voc_a2_logical_719` | **logical** | *adjective* | `/ˈlɑdʒɪkəl/` | lógico | His argument was very logical. | Su argumento fue muy lógico. |
| `voc_a2_analytical_720` | **analytical** | *adjective* | `/ˌænəˈlɪtɪkəl/` | analítico | She has an analytical approach to problems. | Ella tiene un enfoque analítico ante los problemas. |
| `voc_a2_intuitive_721` | **intuitive** | *adjective* | `/ɪnˈtuɪtɪv/` | intuitivo | He made an intuitive decision. | Él tomó una decisión intuitiva. |
| `voc_a2_perceptive_722` | **perceptive** | *adjective* | `/pərˈsɛptɪv/` | perceptivo | She is very perceptive about people. | Ella es muy perceptiva con las personas. |
| `voc_a2_charismatic_723` | **charismatic** | *adjective* | `/ˌkɛrɪzˈmætɪk/` | carismático | The speaker was charismatic and funny. | El orador fue carismático y gracioso. |
| `voc_a2_witty_724` | **witty** | *adjective* | `/ˈwɪti/` | ingenioso | He is known for his witty comments. | Él es conocido por sus comentarios ingeniosos. |
| `voc_a2_sarcastic_725` | **sarcastic** | *adjective* | `/sɑrˈkæstɪk/` | sarcástico | Her tone was a bit sarcastic. | Su tono fue un poco sarcástico. |
| `voc_a2_blunt_726` | **blunt** | *adjective* | `/blʌnt/` | directo/franco | He is very blunt with his opinions. | Él es muy directo con sus opiniones. |
| `voc_a2_diplomatic_727` | **diplomatic** | *adjective* | `/ˌdɪpləˈmætɪk/` | diplomático | She handled the situation in a diplomatic way. | Ella manejó la situación de forma diplomática. |
| `voc_a2_tactful_728` | **tactful** | *adjective* | `/ˈtæktfəl/` | con tacto | He gave tactful feedback. | Él dio retroalimentación con tacto. |
| `voc_a2_insensitive_729` | **insensitive** | *adjective* | `/ɪnˈsɛnsɪtɪv/` | insensible | That comment was a bit insensitive. | Ese comentario fue un poco insensible. |
| `voc_a2_thoughtful_730` | **thoughtful** | *adjective* | `/ˈθɔtfəl/` | considerado | It was a thoughtful gift. | Fue un regalo considerado. |
| `voc_a2_forgetful_731` | **forgetful** | *adjective* | `/fərˈgɛtfəl/` | olvidadizo | My grandfather is a bit forgetful now. | Mi abuelo es un poco olvidadizo ahora. |
| `voc_a2_punctual_732` | **punctual** | *adjective* | `/ˈpʌŋktʃuəl/` | puntual | She is always punctual. | Ella siempre es puntual. |
| `voc_a2_easygoing_733` | **easygoing** | *adjective* | `/ˈiziˌgoʊɪŋ/` | de trato fácil | He has an easygoing personality. | Él tiene una personalidad de trato fácil. |
| `voc_a2_demanding_734` | **demanding** | *adjective* | `/dɪˈmændɪŋ/` | exigente | Her job is very demanding. | Su trabajo es muy exigente. |

### 📖 Lecturas de Comprensión · Nivel A2

Textos graduados que reutilizan exclusivamente el léxico consolidado hasta su semana lectiva, acompañados de preguntas pedagógicas de opción múltiple.

#### Lectura Semana 2: A Weekend Trip to the Beach (`rdg_a2_001`)
- **Nivel:** A2 | **Semana lectiva:** 2 | **Dificultad interna:** 2/5
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

#### Lectura Semana 1: Returning a Damaged Package (`rdg_a2_002`)
- **Nivel:** A2 | **Semana lectiva:** 1 | **Dificultad interna:** 2/5
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

#### Lectura Semana 3: A Busy Day at the Office (`rdg_a2_003`)
- **Nivel:** A2 | **Semana lectiva:** 3 | **Dificultad interna:** 3/5
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
| `voc_b1_give-up_001` | **give up** | *phrasal-verb* | `/gɪv ʌp/` | rendirse/dejar de hacer algo | Don't give up on your dreams. | No renuncies a tus sueños. |
| `voc_b1_look-forward-to_002` | **look forward to** | *phrasal-verb* | `/lʊk ˈfɔrwərd tu/` | esperar con ilusión | I look forward to seeing you soon. | Espero con ilusión verte pronto. |
| `voc_b1_get-along-with_003` | **get along with** | *phrasal-verb* | `/gɛt əˈlɔŋ wɪð/` | llevarse bien con | I get along with my coworkers. | Me llevo bien con mis compañeros de trabajo. |
| `voc_b1_put-off_004` | **put off** | *phrasal-verb* | `/pʊt ɔf/` | posponer | Don't put off the meeting again. | No pospongas la reunión de nuevo. |
| `voc_b1_run-into_005` | **run into** | *phrasal-verb* | `/rʌn ˈɪntu/` | encontrarse por casualidad con | I ran into an old friend downtown. | Me encontré por casualidad con un viejo amigo en el centro. |
| `voc_b1_come-across_006` | **come across** | *phrasal-verb* | `/kʌm əˈkrɔs/` | encontrarse/toparse con algo | I came across an interesting article. | Me topé con un artículo interesante. |
| `voc_b1_look-after_007` | **look after** | *phrasal-verb* | `/lʊk ˈæftər/` | cuidar de | She looks after her grandmother. | Ella cuida de su abuela. |
| `voc_b1_turn-down_008` | **turn down** | *phrasal-verb* | `/tɜrn daʊn/` | rechazar | He turned down the job offer. | Él rechazó la oferta de trabajo. |
| `voc_b1_find-out_009` | **find out** | *phrasal-verb* | `/faɪnd aʊt/` | descubrir/averiguar | I need to find out the truth. | Necesito descubrir la verdad. |
| `voc_b1_work-out_010` | **work out** | *phrasal-verb* | `/wɜrk aʊt/` | resolver / hacer ejercicio | Everything worked out fine in the end. | Todo se resolvió bien al final. |
| `voc_b1_deal-with_011` | **deal with** | *phrasal-verb* | `/dil wɪð/` | lidiar con | I have to deal with this problem today. | Tengo que lidiar con este problema hoy. |
| `voc_b1_end-up_012` | **end up** | *phrasal-verb* | `/ɛnd ʌp/` | terminar (en una situación) | We ended up staying home. | Terminamos quedándonos en casa. |
| `voc_b1_carry-on_013` | **carry on** | *phrasal-verb* | `/ˈkæri ɑn/` | continuar | Please carry on with your presentation. | Por favor continúa con tu presentación. |
| `voc_b1_figure-out_014` | **figure out** | *phrasal-verb* | `/ˈfɪgjər aʊt/` | entender/descifrar | I can't figure out this puzzle. | No logro descifrar este rompecabezas. |
| `voc_b1_point-out_015` | **point out** | *phrasal-verb* | `/pɔɪnt aʊt/` | señalar | She pointed out a mistake in the report. | Ella señaló un error en el informe. |
| `voc_b1_break-down_016` | **break down** | *phrasal-verb* | `/breɪk daʊn/` | descomponerse / desglosar | My car broke down on the highway. | Mi carro se descompuso en la autopista. |
| `voc_b1_bring-up_017` | **bring up** | *phrasal-verb* | `/brɪŋ ʌp/` | criar / sacar un tema | He brought up an important topic. | Él sacó a relucir un tema importante. |
| `voc_b1_call-off_018` | **call off** | *phrasal-verb* | `/kɔl ɔf/` | cancelar | They called off the wedding. | Cancelaron la boda. |
| `voc_b1_count-on_019` | **count on** | *phrasal-verb* | `/kaʊnt ɑn/` | contar con (confiar) | You can always count on me. | Siempre puedes contar conmigo. |
| `voc_b1_cut-down-on_020` | **cut down on** | *phrasal-verb* | `/kʌt daʊn ɑn/` | reducir (consumo) | I need to cut down on sugar. | Necesito reducir el consumo de azúcar. |
| `voc_b1_drop-by_021` | **drop by** | *phrasal-verb* | `/drɑp baɪ/` | pasar de visita | Feel free to drop by anytime. | Siéntete libre de pasar de visita cuando quieras. |
| `voc_b1_fall-apart_022` | **fall apart** | *phrasal-verb* | `/fɔl əˈpɑrt/` | desmoronarse | Their plan fell apart quickly. | Su plan se desmoronó rápidamente. |
| `voc_b1_get-over_023` | **get over** | *phrasal-verb* | `/gɛt ˈoʊvər/` | superar | It took him months to get over the loss. | Le tomó meses superar la pérdida. |
| `voc_b1_hang-out_024` | **hang out** | *phrasal-verb* | `/hæŋ aʊt/` | pasar el rato | We hung out at the park all afternoon. | Pasamos el rato en el parque toda la tarde. |
| `voc_b1_hold-on_025` | **hold on** | *phrasal-verb* | `/hoʊld ɑn/` | esperar un momento | Hold on, I'll be right there. | Espera un momento, ya voy. |
| `voc_b1_let-down_026` | **let down** | *phrasal-verb* | `/lɛt daʊn/` | decepcionar | I don't want to let you down. | No quiero decepcionarte. |
| `voc_b1_make-up_027` | **make up** | *phrasal-verb* | `/meɪk ʌp/` | inventar / reconciliarse | They made up after the argument. | Se reconciliaron después de la discusión. |
| `voc_b1_pass-away_028` | **pass away** | *phrasal-verb* | `/pæs əˈweɪ/` | fallecer | Her grandfather passed away last year. | Su abuelo falleció el año pasado. |
| `voc_b1_pull-off_029` | **pull off** | *phrasal-verb* | `/pʊl ɔf/` | lograr algo difícil | She managed to pull off the event perfectly. | Ella logró sacar adelante el evento perfectamente. |
| `voc_b1_put-up-with_030` | **put up with** | *phrasal-verb* | `/pʊt ʌp wɪð/` | tolerar/aguantar | I can't put up with this noise anymore. | Ya no puedo tolerar este ruido. |
| `voc_b1_show-up_031` | **show up** | *phrasal-verb* | `/ʃoʊ ʌp/` | aparecer/presentarse | He didn't show up to the meeting. | Él no se presentó a la reunión. |
| `voc_b1_sort-out_032` | **sort out** | *phrasal-verb* | `/sɔrt aʊt/` | resolver/organizar | We need to sort out this issue. | Necesitamos resolver este asunto. |
| `voc_b1_stand-for_033` | **stand for** | *phrasal-verb* | `/stænd fɔr/` | representar/significar | What does this abbreviation stand for? | ¿Qué representa esta abreviatura? |
| `voc_b1_take-after_034` | **take after** | *phrasal-verb* | `/teɪk ˈæftər/` | parecerse a (familiar) | She takes after her mother. | Ella se parece a su madre. |
| `voc_b1_throw-away_035` | **throw away** | *phrasal-verb* | `/θroʊ əˈweɪ/` | desechar | Don't throw away that document. | No deseches ese documento. |
| `voc_b1_wear-out_036` | **wear out** | *phrasal-verb* | `/wɛr aʊt/` | desgastar/agotar | These shoes wore out fast. | Estos zapatos se desgastaron rápido. |

### Semana 2: B1 · Semana 2 – Modismos y expresiones idiomáticas
Total de palabras en esta semana: **24**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_once-in-a-blue-moon_037` | **once in a blue moon** | *adverb* | `/wʌns ɪn ə blu mun/` | muy de vez en cuando | I only eat fast food once in a blue moon. | Solo como comida rápida muy de vez en cuando. |
| `voc_b1_break-the-ice_038` | **break the ice** | *verb* | `/breɪk ði aɪs/` | romper el hielo | He told a joke to break the ice. | Él contó un chiste para romper el hielo. |
| `voc_b1_hit-the-books_039` | **hit the books** | *verb* | `/hɪt ðə bʊks/` | ponerse a estudiar | I need to hit the books before the exam. | Necesito ponerme a estudiar antes del examen. |
| `voc_b1_under-the-weather_040` | **under the weather** | *adverb* | `/ˈʌndər ðə ˈwɛðər/` | sentirse mal/indispuesto | I'm feeling a bit under the weather today. | Me siento un poco mal hoy. |
| `voc_b1_piece-of-cake_041` | **piece of cake** | *adverb* | `/pis əv keɪk/` | pan comido | The test was a piece of cake. | El examen fue pan comido. |
| `voc_b1_cost-an-arm-and-a-leg_042` | **cost an arm and a leg** | *verb* | `/kɔst ən ɑrm ənd ə lɛg/` | costar un ojo de la cara | That car cost an arm and a leg. | Ese carro costó un ojo de la cara. |
| `voc_b1_on-the-ball_043` | **on the ball** | *adverb* | `/ɑn ðə bɔl/` | atento/competente | She's really on the ball at work. | Ella está muy atenta y competente en el trabajo. |
| `voc_b1_let-the-cat-out-of-the-bag_044` | **let the cat out of the bag** | *verb* | `/lɛt ðə kæt aʊt əv ðə bæg/` | revelar un secreto | He accidentally let the cat out of the bag. | Él sin querer reveló el secreto. |
| `voc_b1_cutting-corners_045` | **cutting corners** | *adverb* | `/ˈkʌtɪŋ ˈkɔrnərz/` | hacer las cosas mal por ahorrar | They finished fast, but they were cutting corners. | Terminaron rápido, pero ahorraron esfuerzo a costa de la calidad. |
| `voc_b1_back-to-square-one_046` | **back to square one** | *adverb* | `/bæk tu skwɛr wʌn/` | volver al punto de partida | The plan failed, so we're back to square one. | El plan falló, así que volvemos al punto de partida. |
| `voc_b1_bite-the-bullet_047` | **bite the bullet** | *verb* | `/baɪt ðə ˈbʊlɪt/` | aguantar algo difícil | I decided to bite the bullet and go to the dentist. | Decidí aguantarme y ir al dentista. |
| `voc_b1_call-it-a-day_048` | **call it a day** | *verb* | `/kɔl ɪt ə deɪ/` | dar por terminado el día/trabajo | Let's call it a day and go home. | Demos por terminado el día e vámonos a casa. |
| `voc_b1_get-the-ball-rolling_049` | **get the ball rolling** | *verb* | `/gɛt ðə bɔl ˈroʊlɪŋ/` | poner algo en marcha | Let's get the ball rolling on this project. | Pongamos en marcha este proyecto. |
| `voc_b1_hang-in-there_050` | **hang in there** | *adverb* | `/hæŋ ɪn ðɛr/` | aguantar/no rendirse | Hang in there, it will get better. | Aguanta, va a mejorar. |
| `voc_b1_in-the-loop_051` | **in the loop** | *adverb* | `/ɪn ðə lup/` | al tanto/informado | Please keep me in the loop about this. | Por favor mantenme al tanto de esto. |
| `voc_b1_keep-an-eye-on_052` | **keep an eye on** | *adverb* | `/kip ən aɪ ɑn/` | vigilar | Can you keep an eye on the kids? | ¿Puedes vigilar a los niños? |
| `voc_b1_the-last-straw_053` | **the last straw** | *adverb* | `/ðə læst strɔ/` | la gota que colma el vaso | Losing his keys was the last straw. | Perder sus llaves fue la gota que colmó el vaso. |
| `voc_b1_miss-the-boat_054` | **miss the boat** | *verb* | `/mɪs ðə boʊt/` | perder la oportunidad | If you don't apply now, you'll miss the boat. | Si no aplicas ahora, perderás la oportunidad. |
| `voc_b1_on-the-same-page_055` | **on the same page** | *adverb* | `/ɑn ðə seɪm peɪdʒ/` | de acuerdo/en sintonía | Let's make sure we're on the same page. | Aseguremos que estamos de acuerdo/en sintonía. |
| `voc_b1_speak-of-the-devil_056` | **speak of the devil** | *adverb* | `/spik əv ðə ˈdɛvəl/` | hablando del rey de Roma | Speak of the devil, here she comes! | Hablando del rey de Roma, ¡ahí viene ella! |
| `voc_b1_the-ball-is-in-your-court_057` | **the ball is in your court** | *adverb* | `/ðə bɔl ɪz ɪn jʊr kɔrt/` | la decisión es tuya ahora | I've done my part; the ball is in your court now. | Ya hice mi parte; ahora la decisión es tuya. |
| `voc_b1_time-flies_058` | **time flies** | *adverb* | `/taɪm flaɪz/` | el tiempo vuela | Time flies when you're having fun. | El tiempo vuela cuando te diviertes. |
| `voc_b1_up-in-the-air_059` | **up in the air** | *adverb* | `/ʌp ɪn ði ɛr/` | incierto/sin decidir | Our vacation plans are still up in the air. | Nuestros planes de vacaciones siguen inciertos. |
| `voc_b1_weather-the-storm_060` | **weather the storm** | *adverb* | `/ˈwɛðər ðə stɔrm/` | superar una dificultad | The company managed to weather the storm. | La empresa logró superar la dificultad. |

### Semana 3: B1 · Semana 3 – Sustantivos abstractos de uso frecuente
Total de palabras en esta semana: **39**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_achievement_061` | **achievement** | *noun* | `/əˈtʃivmənt/` | logro | Finishing the marathon was a great achievement. | Terminar el maratón fue un gran logro. |
| `voc_b1_assumption_062` | **assumption** | *noun* | `/əˈsʌmpʃən/` | suposición | That's just an assumption, not a fact. | Eso es solo una suposición, no un hecho. |
| `voc_b1_attitude_063` | **attitude** | *noun* | `/ˈætɪˌtud/` | actitud | She has a positive attitude toward work. | Ella tiene una actitud positiva hacia el trabajo. |
| `voc_b1_awareness_064` | **awareness** | *noun* | `/əˈwɛrnəs/` | conciencia (de algo) | The campaign raised awareness about pollution. | La campaña generó conciencia sobre la contaminación. |
| `voc_b1_behavior_065` | **behavior** | *noun* | `/bɪˈheɪvjər/` | comportamiento | His behavior surprised everyone. | Su comportamiento sorprendió a todos. |
| `voc_b1_capability_066` | **capability** | *noun* | `/ˌkeɪpəˈbɪləti/` | capacidad | She has the capability to lead the team. | Ella tiene la capacidad de liderar el equipo. |
| `voc_b1_circumstance_067` | **circumstance** | *noun* | `/ˈsɜrkəmˌstæns/` | circunstancia | Under these circumstances, we must wait. | Bajo estas circunstancias, debemos esperar. |
| `voc_b1_consequence_068` | **consequence** | *noun* | `/ˈkɑnsəˌkwɛns/` | consecuencia | Every action has a consequence. | Toda acción tiene una consecuencia. |
| `voc_b1_consideration_069` | **consideration** | *noun* | `/kənˌsɪdəˈreɪʃən/` | consideración | Please take this into consideration. | Por favor toma esto en consideración. |
| `voc_b1_contribution_070` | **contribution** | *noun* | `/ˌkɑntrɪˈbjuʃən/` | contribución | His contribution to the project was huge. | Su contribución al proyecto fue enorme. |
| `voc_b1_credibility_071` | **credibility** | *noun* | `/ˌkrɛdəˈbɪləti/` | credibilidad | The scandal damaged her credibility. | El escándalo dañó su credibilidad. |
| `voc_b1_definition_072` | **definition** | *noun* | `/ˌdɛfəˈnɪʃən/` | definición | Look up the definition of this word. | Busca la definición de esta palabra. |
| `voc_b1_dimension_073` | **dimension** | *noun* | `/dɪˈmɛnʃən/` | dimensión | This adds a new dimension to the debate. | Esto añade una nueva dimensión al debate. |
| `voc_b1_emphasis_074` | **emphasis** | *noun* | `/ˈɛmfəsɪs/` | énfasis | She put emphasis on teamwork. | Ella puso énfasis en el trabajo en equipo. |
| `voc_b1_evaluation_075` | **evaluation** | *noun* | `/ɪˌvæljuˈeɪʃən/` | evaluación | The teacher's evaluation was very fair. | La evaluación del maestro fue muy justa. |
| `voc_b1_factor_076` | **factor** | *noun* | `/ˈfæktər/` | factor | Price is an important factor for us. | El precio es un factor importante para nosotros. |
| `voc_b1_framework_077` | **framework** | *noun* | `/ˈfreɪmˌwɜrk/` | marco (de referencia) | We built a new framework for the project. | Construimos un nuevo marco para el proyecto. |
| `voc_b1_function_078` | **function** | *noun* | `/ˈfʌŋkʃən/` | función | What is the function of this device? | ¿Cuál es la función de este dispositivo? |
| `voc_b1_impact_079` | **impact** | *noun* | `/ˈɪmˌpækt/` | impacto | The decision had a big impact on sales. | La decisión tuvo un gran impacto en las ventas. |
| `voc_b1_initiative_080` | **initiative** | *noun* | `/ɪˈnɪʃətɪv/` | iniciativa | She showed great initiative at work. | Ella mostró gran iniciativa en el trabajo. |
| `voc_b1_insight_081` | **insight** | *noun* | `/ˈɪnˌsaɪt/` | percepción profunda | His insight helped us solve the problem. | Su percepción profunda nos ayudó a resolver el problema. |
| `voc_b1_integrity_082` | **integrity** | *noun* | `/ɪnˈtɛgrəti/` | integridad | He is known for his integrity. | Él es conocido por su integridad. |
| `voc_b1_motivation_083` | **motivation** | *noun* | `/ˌmoʊtɪˈveɪʃən/` | motivación | Her motivation to succeed is inspiring. | Su motivación para triunfar es inspiradora. |
| `voc_b1_objective-noun_084` | **objective (noun)** | *noun* | `/əbˈdʒɛktɪv/` | objetivo | Our main objective is to grow the business. | Nuestro objetivo principal es hacer crecer el negocio. |
| `voc_b1_outcome_085` | **outcome** | *noun* | `/ˈaʊtˌkʌm/` | resultado | We were happy with the outcome. | Quedamos contentos con el resultado. |
| `voc_b1_perception_086` | **perception** | *noun* | `/pərˈsɛpʃən/` | percepción | Public perception of the brand improved. | La percepción pública de la marca mejoró. |
| `voc_b1_phenomenon_087` | **phenomenon** | *noun* | `/fɪˈnɑməˌnɑn/` | fenómeno | This is a common social phenomenon. | Este es un fenómeno social común. |
| `voc_b1_principle_088` | **principle** | *noun* | `/ˈprɪnsəpəl/` | principio | Honesty is one of her principles. | La honestidad es uno de sus principios. |
| `voc_b1_priority_089` | **priority** | *noun* | `/praɪˈɔrəti/` | prioridad | Health should always be a priority. | La salud siempre debería ser una prioridad. |
| `voc_b1_procedure_090` | **procedure** | *noun* | `/prəˈsidʒər/` | procedimiento | Follow the correct procedure. | Sigue el procedimiento correcto. |
| `voc_b1_process_091` | **process** | *noun* | `/ˈprɑˌsɛs/` | proceso | The hiring process takes two weeks. | El proceso de contratación toma dos semanas. |
| `voc_b1_reputation_092` | **reputation** | *noun* | `/ˌrɛpjəˈteɪʃən/` | reputación | The company has a good reputation. | La empresa tiene una buena reputación. |
| `voc_b1_scenario_093` | **scenario** | *noun* | `/sɪˈnɛrioʊ/` | escenario | Let's consider a different scenario. | Consideremos un escenario diferente. |
| `voc_b1_significance_094` | **significance** | *noun* | `/sɪgˈnɪfɪkəns/` | importancia/relevancia | This event has great historical significance. | Este evento tiene gran importancia histórica. |
| `voc_b1_stability_095` | **stability** | *noun* | `/stəˈbɪləti/` | estabilidad | The country needs political stability. | El país necesita estabilidad política. |
| `voc_b1_structure_096` | **structure** | *noun* | `/ˈstrʌktʃər/` | estructura | The report has a clear structure. | El informe tiene una estructura clara. |
| `voc_b1_tendency_097` | **tendency** | *noun* | `/ˈtɛndənsi/` | tendencia | He has a tendency to arrive late. | Él tiene una tendencia a llegar tarde. |
| `voc_b1_theory_098` | **theory** | *noun* | `/ˈθɪəri/` | teoría | This is just a theory, not proven yet. | Esto es solo una teoría, aún no comprobada. |
| `voc_b1_transition_099` | **transition** | *noun* | `/trænˈzɪʃən/` | transición | The transition to remote work was smooth. | La transición al trabajo remoto fue fluida. |

### Semana 4: B1 · Semana 4 – Conectores avanzados del discurso
Total de palabras en esta semana: **20**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_whereas_100` | **whereas** | *conjunction* | `/wɛrˈæz/` | mientras que (contraste) | She loves the city, whereas he prefers the countryside. | A ella le encanta la ciudad, mientras que él prefiere el campo. |
| `voc_b1_provided-that_101` | **provided that** | *conjunction* | `/prəˈvaɪdɪd ðæt/` | siempre que/con la condición de que | You can go out, provided that you finish your homework. | Puedes salir, siempre que termines tu tarea. |
| `voc_b1_unless_102` | **unless** | *conjunction* | `/ənˈlɛs/` | a menos que | We won't leave unless it stops raining. | No saldremos a menos que deje de llover. |
| `voc_b1_even-though_103` | **even though** | *conjunction* | `/ˈivən ðoʊ/` | aunque | Even though he was tired, he kept working. | Aunque estaba cansado, siguió trabajando. |
| `voc_b1_as-long-as_104` | **as long as** | *conjunction* | `/æz lɔŋ æz/` | mientras (condición) | You can stay as long as you like. | Puedes quedarte mientras quieras. |
| `voc_b1_in-spite-of_105` | **in spite of** | *conjunction* | `/ɪn spaɪt əv/` | a pesar de | In spite of the rain, we went hiking. | A pesar de la lluvia, fuimos de senderismo. |
| `voc_b1_despite_106` | **despite** | *conjunction* | `/dɪˈspaɪt/` | a pesar de | Despite the traffic, we arrived on time. | A pesar del tráfico, llegamos a tiempo. |
| `voc_b1_given-that_107` | **given that** | *conjunction* | `/ˈgɪvən ðæt/` | dado que | Given that it's late, let's finish tomorrow. | Dado que es tarde, terminemos mañana. |
| `voc_b1_assuming-that_108` | **assuming that** | *conjunction* | `/əˈsumɪŋ ðæt/` | suponiendo que | Assuming that the plan works, we'll save money. | Suponiendo que el plan funcione, ahorraremos dinero. |
| `voc_b1_in-order-to_109` | **in order to** | *conjunction* | `/ɪn ˈɔrdər tu/` | con el fin de | She studied hard in order to pass the exam. | Ella estudió mucho con el fin de aprobar el examen. |
| `voc_b1_so-as-to_110` | **so as to** | *conjunction* | `/soʊ æz tu/` | para/con el objetivo de | We left early so as to avoid traffic. | Salimos temprano para evitar el tráfico. |
| `voc_b1_rather-than_111` | **rather than** | *conjunction* | `/ˈræðər ðæn/` | en lugar de | I'd rather walk rather than take the bus. | Prefiero caminar en lugar de tomar el autobús. |
| `voc_b1_as-opposed-to_112` | **as opposed to** | *conjunction* | `/æz əˈpoʊzd tu/` | en contraposición a | We chose quality as opposed to quantity. | Elegimos calidad en contraposición a cantidad. |
| `voc_b1_on-the-whole_113` | **on the whole** | *conjunction* | `/ɑn ðə hoʊl/` | en general/en conjunto | On the whole, the trip was a success. | En general, el viaje fue un éxito. |
| `voc_b1_by-and-large_114` | **by and large** | *conjunction* | `/baɪ ənd lɑrdʒ/` | en su mayor parte | By and large, people were satisfied. | En su mayor parte, la gente quedó satisfecha. |
| `voc_b1_needless-to-say_115` | **needless to say** | *conjunction* | `/ˈnidləs tu seɪ/` | huelga decir/ni que decir | Needless to say, we were very happy. | Huelga decir que estábamos muy felices. |
| `voc_b1_last-but-not-least_116` | **last but not least** | *conjunction* | `/læst bʌt nɑt list/` | por último pero no menos importante | Last but not least, thank you all for coming. | Por último pero no menos importante, gracias a todos por venir. |
| `voc_b1_all-things-considered_117` | **all things considered** | *conjunction* | `/ɔl θɪŋz kənˈsɪdərd/` | considerándolo todo | All things considered, it was a good decision. | Considerándolo todo, fue una buena decisión. |
| `voc_b1_in-other-words_118` | **in other words** | *conjunction* | `/ɪn ˈʌðər wɜrdz/` | en otras palabras | In other words, we need more time. | En otras palabras, necesitamos más tiempo. |
| `voc_b1_that-being-said_119` | **that being said** | *conjunction* | `/ðæt ˈbiɪŋ sɛd/` | dicho esto | That being said, I still support the idea. | Dicho esto, sigo apoyando la idea. |

### Semana 5: B1 · Semana 5 – Verbos de argumentación y análisis
Total de palabras en esta semana: **26**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_assume_120` | **assume** | *verb* | `/əˈsum/` | suponer | I assume you already know the answer. | Supongo que ya sabes la respuesta. |
| `voc_b1_argue-that_121` | **argue (that)** | *verb* | `/ˈɑrgju/` | argumentar/sostener que | She argues that the plan is too risky. | Ella argumenta que el plan es demasiado arriesgado. |
| `voc_b1_claim_122` | **claim** | *verb* | `/kleɪm/` | afirmar/alegar | He claims he saw the accident. | Él afirma que vio el accidente. |
| `voc_b1_demonstrate_123` | **demonstrate** | *verb* | `/ˈdɛmənˌstreɪt/` | demostrar | The study demonstrates a clear pattern. | El estudio demuestra un patrón claro. |
| `voc_b1_emphasize_124` | **emphasize** | *verb* | `/ˈɛmfəˌsaɪz/` | enfatizar | The teacher emphasized the importance of practice. | El profesor enfatizó la importancia de la práctica. |
| `voc_b1_imply_125` | **imply** | *verb* | `/ɪmˈplaɪ/` | insinuar/implicar | Her tone implied she was upset. | Su tono insinuaba que estaba molesta. |
| `voc_b1_indicate_126` | **indicate** | *verb* | `/ˈɪndəˌkeɪt/` | indicar | The results indicate a positive trend. | Los resultados indican una tendencia positiva. |
| `voc_b1_justify_127` | **justify** | *verb* | `/ˈdʒʌstəˌfaɪ/` | justificar | He tried to justify his decision. | Él trató de justificar su decisión. |
| `voc_b1_maintain-an-opinion_128` | **maintain (an opinion)** | *verb* | `/meɪnˈteɪn/` | mantener/sostener una postura | She maintains that she is innocent. | Ella sostiene que es inocente. |
| `voc_b1_predict_129` | **predict** | *verb* | `/prɪˈdɪkt/` | predecir | Experts predict a rise in prices. | Los expertos predicen un aumento de precios. |
| `voc_b1_prove_130` | **prove** | *verb* | `/pruv/` | probar/demostrar | This proves that the theory was correct. | Esto prueba que la teoría era correcta. |
| `voc_b1_reveal_131` | **reveal** | *verb* | `/rɪˈvil/` | revelar | The report revealed several problems. | El informe reveló varios problemas. |
| `voc_b1_acknowledge_132` | **acknowledge** | *verb* | `/ækˈnɑlɪdʒ/` | reconocer | He acknowledged his mistake. | Él reconoció su error. |
| `voc_b1_analyze_133` | **analyze** | *verb* | `/ˈænəˌlaɪz/` | analizar | We need to analyze the data carefully. | Necesitamos analizar los datos con cuidado. |
| `voc_b1_assess_134` | **assess** | *verb* | `/əˈsɛs/` | evaluar/valorar | The teacher will assess our progress. | El profesor evaluará nuestro progreso. |
| `voc_b1_clarify_135` | **clarify** | *verb* | `/ˈklɛrəˌfaɪ/` | aclarar | Can you clarify your point? | ¿Puedes aclarar tu punto? |
| `voc_b1_conclude_136` | **conclude** | *verb* | `/kənˈklud/` | concluir | The study concludes that exercise helps sleep. | El estudio concluye que el ejercicio ayuda a dormir. |
| `voc_b1_contradict_137` | **contradict** | *verb* | `/ˌkɑntrəˈdɪkt/` | contradecir | His statement contradicts the evidence. | Su declaración contradice la evidencia. |
| `voc_b1_distinguish_138` | **distinguish** | *verb* | `/dɪˈstɪŋgwɪʃ/` | distinguir | It's hard to distinguish the two versions. | Es difícil distinguir las dos versiones. |
| `voc_b1_elaborate-on_139` | **elaborate (on)** | *verb* | `/ɪˈlæbəˌreɪt/` | desarrollar/profundizar en | Could you elaborate on that point? | ¿Podrías desarrollar más ese punto? |
| `voc_b1_examine_140` | **examine** | *verb* | `/ɪgˈzæmɪn/` | examinar | The doctor examined the results. | El médico examinó los resultados. |
| `voc_b1_highlight_141` | **highlight** | *verb* | `/ˈhaɪˌlaɪt/` | destacar | The report highlights the main risks. | El informe destaca los principales riesgos. |
| `voc_b1_illustrate-an-idea_142` | **illustrate (an idea)** | *verb* | `/ˈɪləˌstreɪt/` | ilustrar (una idea) | This example illustrates the problem well. | Este ejemplo ilustra bien el problema. |
| `voc_b1_interpret_143` | **interpret** | *verb* | `/ɪnˈtɜrprɪt/` | interpretar | She interpreted the data differently. | Ella interpretó los datos de forma diferente. |
| `voc_b1_outline-a-plan_144` | **outline (a plan)** | *verb* | `/ˈaʊtˌlaɪn/` | esbozar (un plan) | Let me outline the main steps. | Déjame esbozar los pasos principales. |
| `voc_b1_summarize_145` | **summarize** | *verb* | `/ˈsʌməˌraɪz/` | resumir | Can you summarize the article for me? | ¿Puedes resumirme el artículo? |

### Semana 6: B1 · Semana 6 – Medios de comunicación y actualidad
Total de palabras en esta semana: **19**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_article_146` | **article** | *noun* | `/ˈɑrtɪkəl/` | artículo | I read an interesting article today. | Leí un artículo interesante hoy. |
| `voc_b1_column-newspaper_147` | **column (newspaper)** | *noun* | `/ˈkɑləm/` | columna (periódico) | She writes a weekly column. | Ella escribe una columna semanal. |
| `voc_b1_broadcast_148` | **broadcast** | *verb* | `/ˈbrɔdˌkæst/` | transmisión/emitir | The game will be broadcast live. | El partido se transmitirá en vivo. |
| `voc_b1_coverage-news_149` | **coverage (news)** | *noun* | `/ˈkʌvərɪdʒ/` | cobertura (noticiosa) | The election coverage lasted all night. | La cobertura de las elecciones duró toda la noche. |
| `voc_b1_correspondent_150` | **correspondent** | *noun* | `/ˌkɔrəˈspɑndənt/` | corresponsal | Our correspondent reported from the capital. | Nuestro corresponsal reportó desde la capital. |
| `voc_b1_editor_151` | **editor** | *noun* | `/ˈɛdɪtər/` | editor | The editor approved the final draft. | El editor aprobó el borrador final. |
| `voc_b1_feature-article_152` | **feature (article)** | *noun* | `/ˈfitʃər/` | reportaje/artículo especial | The magazine published a feature on climate change. | La revista publicó un reportaje sobre el cambio climático. |
| `voc_b1_interview-noun_153` | **interview (noun)** | *noun* | `/ˈɪntərˌvju/` | entrevista | I watched her interview last night. | Vi su entrevista anoche. |
| `voc_b1_investigate_154` | **investigate** | *verb* | `/ɪnˈvɛstəˌgeɪt/` | investigar | The journalists investigated the case for months. | Los periodistas investigaron el caso durante meses. |
| `voc_b1_source-news_155` | **source (news)** | *noun* | `/sɔrs/` | fuente (informativa) | The reporter protected her source. | La periodista protegió su fuente. |
| `voc_b1_statement-public_156` | **statement (public)** | *noun* | `/ˈsteɪtmənt/` | declaración (pública) | The company released an official statement. | La empresa emitió una declaración oficial. |
| `voc_b1_survey_157` | **survey** | *noun* | `/ˈsɜrˌveɪ/` | encuesta | The survey showed interesting results. | La encuesta mostró resultados interesantes. |
| `voc_b1_poll_158` | **poll** | *noun* | `/poʊl/` | sondeo/encuesta | The poll suggests a close election. | El sondeo sugiere una elección reñida. |
| `voc_b1_censorship_159` | **censorship** | *noun* | `/ˈsɛnsərˌʃɪp/` | censura | Censorship limits free speech. | La censura limita la libertad de expresión. |
| `voc_b1_propaganda_160` | **propaganda** | *noun* | `/ˌprɑpəˈgændə/` | propaganda | The posters were pure propaganda. | Los carteles eran pura propaganda. |
| `voc_b1_bias_161` | **bias** | *noun* | `/ˈbaɪəs/` | sesgo/parcialidad | The article showed clear bias. | El artículo mostró un sesgo claro. |
| `voc_b1_credible_162` | **credible** | *adjective* | `/ˈkrɛdəbəl/` | creíble | Is this source credible? | ¿Es creíble esta fuente? |
| `voc_b1_misinformation_163` | **misinformation** | *noun* | `/ˌmɪsɪnfərˈmeɪʃən/` | desinformación | Social media spreads misinformation quickly. | Las redes sociales difunden desinformación rápidamente. |
| `voc_b1_current-affairs_164` | **current affairs** | *noun* | `/ˈkɜrənt əˈfɛrz/` | actualidad | She follows current affairs closely. | Ella sigue de cerca la actualidad. |

### Semana 7: B1 · Semana 7 – Economía y trabajo (nivel intermedio)
Total de palabras en esta semana: **23**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_economy_165` | **economy** | *noun* | `/ɪˈkɑnəmi/` | economía | The economy is growing slowly. | La economía está creciendo lentamente. |
| `voc_b1_inflation_166` | **inflation** | *noun* | `/ɪnˈfleɪʃən/` | inflación | Inflation raised the price of food. | La inflación subió el precio de la comida. |
| `voc_b1_recession_167` | **recession** | *noun* | `/rɪˈsɛʃən/` | recesión | The country entered a recession last year. | El país entró en recesión el año pasado. |
| `voc_b1_unemployment_168` | **unemployment** | *noun* | `/ˌʌnɪmˈplɔɪmənt/` | desempleo | Unemployment dropped this quarter. | El desempleo bajó este trimestre. |
| `voc_b1_income_169` | **income** | *noun* | `/ˈɪnˌkʌm/` | ingresos | Her income increased after the promotion. | Sus ingresos aumentaron después del ascenso. |
| `voc_b1_expense_170` | **expense** | *noun* | `/ɪkˈspɛns/` | gasto | Rent is our biggest expense. | El alquiler es nuestro gasto más grande. |
| `voc_b1_investment_171` | **investment** | *noun* | `/ɪnˈvɛstmənt/` | inversión | This was a smart investment. | Esta fue una inversión inteligente. |
| `voc_b1_profit_172` | **profit** | *noun* | `/ˈprɑfɪt/` | ganancia/beneficio | The company made a big profit this year. | La empresa tuvo una gran ganancia este año. |
| `voc_b1_loss-business_173` | **loss (business)** | *noun* | `/lɔs/` | pérdida (negocio) | The business reported a loss last quarter. | El negocio reportó una pérdida el último trimestre. |
| `voc_b1_supply_174` | **supply** | *noun* | `/səˈplaɪ/` | oferta | Supply and demand affect prices. | La oferta y la demanda afectan los precios. |
| `voc_b1_demand-economy_175` | **demand (economy)** | *noun* | `/dɪˈmænd/` | demanda (economía) | Demand for the product increased. | La demanda del producto aumentó. |
| `voc_b1_trade_176` | **trade** | *noun* | `/treɪd/` | comercio | Trade between the two countries grew. | El comercio entre los dos países creció. |
| `voc_b1_export_177` | **export** | *noun* | `/ˈɛkspɔrt/` | exportar/exportación | Coffee is a major export for this country. | El café es una exportación importante para este país. |
| `voc_b1_import_178` | **import** | *noun* | `/ˈɪmpɔrt/` | importar/importación | The import of cars increased last year. | La importación de autos aumentó el año pasado. |
| `voc_b1_industry_179` | **industry** | *noun* | `/ˈɪndəstri/` | industria | The tech industry keeps growing. | La industria tecnológica sigue creciendo. |
| `voc_b1_sector_180` | **sector** | *noun* | `/ˈsɛktər/` | sector | She works in the healthcare sector. | Ella trabaja en el sector salud. |
| `voc_b1_consumer_181` | **consumer** | *noun* | `/kənˈsumər/` | consumidor | Consumers want better prices. | Los consumidores quieren mejores precios. |
| `voc_b1_entrepreneur_182` | **entrepreneur** | *noun* | `/ˌɑntrəprəˈnɜr/` | emprendedor | She became a successful entrepreneur. | Ella se convirtió en una emprendedora exitosa. |
| `voc_b1_startup_183` | **startup** | *noun* | `/ˈstɑrˌtʌp/` | empresa emergente | He works for a small startup. | Él trabaja para una pequeña empresa emergente. |
| `voc_b1_revenue_184` | **revenue** | *noun* | `/ˈrɛvəˌnu/` | ingresos (empresa) | The company's revenue doubled. | Los ingresos de la empresa se duplicaron. |
| `voc_b1_asset_185` | **asset** | *noun* | `/ˈæˌsɛt/` | activo (financiero) | The building is a valuable asset. | El edificio es un activo valioso. |
| `voc_b1_shareholder_186` | **shareholder** | *noun* | `/ˈʃɛrˌhoʊldər/` | accionista | Shareholders approved the new plan. | Los accionistas aprobaron el nuevo plan. |
| `voc_b1_stock-finance_187` | **stock (finance)** | *noun* | `/stɑk/` | acción (bolsa) | She invested in stock last year. | Ella invirtió en acciones el año pasado. |

### Semana 8: B1 · Semana 8 – Relaciones sociales y comunicación
Total de palabras en esta semana: **15**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_cooperate_188` | **cooperate** | *verb* | `/koʊˈɑpəˌreɪt/` | cooperar | Both teams cooperated to finish on time. | Ambos equipos cooperaron para terminar a tiempo. |
| `voc_b1_collaborate_189` | **collaborate** | *verb* | `/kəˈlæbəˌreɪt/` | colaborar | We collaborated on this project together. | Colaboramos juntos en este proyecto. |
| `voc_b1_criticize_190` | **criticize** | *verb* | `/ˈkrɪtɪˌsaɪz/` | criticar | Please don't criticize him in public. | Por favor no lo critiques en público. |
| `voc_b1_compliment_191` | **compliment** | *noun* | `/ˈkɑmpləmənt/` | hacer un cumplido | She gave me a nice compliment. | Ella me hizo un lindo cumplido. |
| `voc_b1_complain_192` | **complain** | *verb* | `/kəmˈpleɪn/` | quejarse | He always complains about the weather. | Él siempre se queja del clima. |
| `voc_b1_reconcile_193` | **reconcile** | *verb* | `/ˈrɛkənˌsaɪl/` | reconciliar | They finally reconciled after years apart. | Finalmente se reconciliaron después de años separados. |
| `voc_b1_gossip_194` | **gossip** | *noun* | `/ˈgɑsəp/` | chisme/chismear | I don't like to spread gossip. | No me gusta difundir chismes. |
| `voc_b1_rumor_195` | **rumor** | *noun* | `/ˈrumər/` | rumor | There's a rumor about the merger. | Hay un rumor sobre la fusión. |
| `voc_b1_confront_196` | **confront** | *verb* | `/kənˈfrʌnt/` | confrontar | She decided to confront him about it. | Ella decidió confrontarlo sobre eso. |
| `voc_b1_mediate_197` | **mediate** | *verb* | `/ˈmidiˌeɪt/` | mediar | A friend helped mediate the dispute. | Un amigo ayudó a mediar el conflicto. |
| `voc_b1_empathize_198` | **empathize** | *verb* | `/ˈɛmpəˌθaɪz/` | empatizar | I really empathize with your situation. | Realmente empatizo con tu situación. |
| `voc_b1_tolerate_199` | **tolerate** | *verb* | `/ˈtɑləˌreɪt/` | tolerar | I won't tolerate that behavior. | No voy a tolerar ese comportamiento. |
| `voc_b1_admire_200` | **admire** | *verb* | `/ædˈmaɪər/` | admirar | I admire her dedication. | Admiro su dedicación. |
| `voc_b1_envy_201` | **envy** | *noun* | `/ˈɛnvi/` | envidiar/envidia | He couldn't hide his envy. | Él no pudo ocultar su envidia. |
| `voc_b1_resent_202` | **resent** | *verb* | `/rɪˈzɛnt/` | resentirse por | She resents being ignored. | Ella se resiente por ser ignorada. |

### Semana 9: B1 · Semana 9 – Adjetivos descriptivos avanzados
Total de palabras en esta semana: **24**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b1_ambiguous_203` | **ambiguous** | *adjective* | `/æmˈbɪgjuəs/` | ambiguo | His answer was quite ambiguous. | Su respuesta fue bastante ambigua. |
| `voc_b1_controversial_204` | **controversial** | *adjective* | `/ˌkɑntrəˈvɜrʃəl/` | controvertido | It was a controversial decision. | Fue una decisión controvertida. |
| `voc_b1_significant_205` | **significant** | *adjective* | `/sɪgˈnɪfɪkant/` | significativo | There was a significant change in sales. | Hubo un cambio significativo en las ventas. |
| `voc_b1_substantial_206` | **substantial** | *adjective* | `/səbˈstænʃəl/` | sustancial | We made substantial progress this month. | Hicimos un progreso sustancial este mes. |
| `voc_b1_considerable_207` | **considerable** | *adjective* | `/kənˈsɪdərəbəl/` | considerable | It took considerable effort to finish. | Tomó un esfuerzo considerable terminarlo. |
| `voc_b1_remarkable_208` | **remarkable** | *adjective* | `/rɪˈmɑrkəbəl/` | notable | She made remarkable progress in English. | Ella hizo un progreso notable en inglés. |
| `voc_b1_noteworthy_209` | **noteworthy** | *adjective* | `/ˈnoʊtˌwɜrði/` | digno de mención | This is a noteworthy achievement. | Este es un logro digno de mención. |
| `voc_b1_inevitable_210` | **inevitable** | *adjective* | `/ɪnˈɛvɪtəbəl/` | inevitable | Change was inevitable. | El cambio era inevitable. |
| `voc_b1_plausible_211` | **plausible** | *adjective* | `/ˈplɔzəbəl/` | plausible | That explanation seems plausible. | Esa explicación parece plausible. |
| `voc_b1_feasible_212` | **feasible** | *adjective* | `/ˈfizəbəl/` | factible | Is this plan feasible? | ¿Es factible este plan? |
| `voc_b1_viable_213` | **viable** | *adjective* | `/ˈvaɪəbəl/` | viable | We need a viable solution. | Necesitamos una solución viable. |
| `voc_b1_consistent_214` | **consistent** | *adjective* | `/kənˈsɪstənt/` | consistente/constante | Her performance has been consistent. | Su desempeño ha sido consistente. |
| `voc_b1_coherent_215` | **coherent** | *adjective* | `/koʊˈhɪrənt/` | coherente | The essay wasn't very coherent. | El ensayo no fue muy coherente. |
| `voc_b1_comprehensive_216` | **comprehensive** | *adjective* | `/ˌkɑmprɪˈhɛnsɪv/` | integral/exhaustivo | We need a comprehensive plan. | Necesitamos un plan integral. |
| `voc_b1_thorough_217` | **thorough** | *adjective* | `/ˈθɜroʊ/` | minucioso | He did a thorough review of the report. | Él hizo una revisión minuciosa del informe. |
| `voc_b1_superficial_218` | **superficial** | *adjective* | `/ˌsupərˈfɪʃəl/` | superficial | His knowledge is quite superficial. | Su conocimiento es bastante superficial. |
| `voc_b1_subtle_219` | **subtle** | *adjective* | `/ˈsʌtəl/` | sutil | There was a subtle change in her voice. | Hubo un cambio sutil en su voz. |
| `voc_b1_versatile_220` | **versatile** | *adjective* | `/ˈvɜrsətəl/` | versátil | She is a versatile actress. | Ella es una actriz versátil. |
| `voc_b1_adaptable_221` | **adaptable** | *adjective* | `/əˈdæptəbəl/` | adaptable | He is very adaptable to new situations. | Él es muy adaptable a nuevas situaciones. |
| `voc_b1_innovative_222` | **innovative** | *adjective* | `/ˈɪnəˌveɪtɪv/` | innovador | They came up with an innovative idea. | Ellos idearon una idea innovadora. |
| `voc_b1_conventional_223` | **conventional** | *adjective* | `/kənˈvɛnʃənəl/` | convencional | This is a more conventional approach. | Este es un enfoque más convencional. |
| `voc_b1_prevalent_224` | **prevalent** | *adjective* | `/ˈprɛvələnt/` | predominante | This problem is prevalent in big cities. | Este problema es predominante en las grandes ciudades. |
| `voc_b1_widespread_225` | **widespread** | *adjective* | `/ˈwaɪdˌsprɛd/` | generalizado | The disease caused widespread panic. | La enfermedad causó pánico generalizado. |
| `voc_b1_prominent_226` | **prominent** | *adjective* | `/ˈprɑmənənt/` | prominente/destacado | He is a prominent scientist. | Él es un científico prominente. |

### 📖 Lecturas de Comprensión · Nivel B1

Textos graduados que reutilizan exclusivamente el léxico consolidado hasta su semana lectiva, acompañados de preguntas pedagógicas de opción múltiple.

#### Lectura Semana 2: A Difficult Decision (`rdg_b1_001`)
- **Nivel:** B1 | **Semana lectiva:** 2 | **Dificultad interna:** 1/5
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

#### Lectura Semana 7: The Rise of Remote Work (`rdg_b1_002`)
- **Nivel:** B1 | **Semana lectiva:** 7 | **Dificultad interna:** 3/5
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

#### Lectura Semana 1: Breaking the Ice (`rdg_b1_003`)
- **Nivel:** B1 | **Semana lectiva:** 1 | **Dificultad interna:** 2/5
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

#### Lectura Semana 3: A Costly Mistake (`rdg_b1_004`)
- **Nivel:** B1 | **Semana lectiva:** 3 | **Dificultad interna:** 2/5
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

#### Lectura Semana 5: Should Cities Ban Cars? (`rdg_b1_005`)
- **Nivel:** B1 | **Semana lectiva:** 5 | **Dificultad interna:** 3/5
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

#### Lectura Semana 6: Can We Trust the News? (`rdg_b1_006`)
- **Nivel:** B1 | **Semana lectiva:** 6 | **Dificultad interna:** 3/5
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

#### Lectura Semana 8: When Friends Disagree (`rdg_b1_007`)
- **Nivel:** B1 | **Semana lectiva:** 8 | **Dificultad interna:** 2/5
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

#### Lectura Semana 9: The Most Underrated Skill (`rdg_b1_008`)
- **Nivel:** B1 | **Semana lectiva:** 9 | **Dificultad interna:** 3/5
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
| `grm_b1_pres_perfect_001` | **Present Perfect vs. Past Simple** | I ___ (visit) London twice in my life. | He visitado Londres dos veces en mi vida. | **have visited *(alt: 've visited)*** | Usamos Present Perfect para experiencias de vida sin un momento específico en el tiempo. |
| `grm_b1_pres_perfect_002` | **Present Perfect vs. Past Simple** | She ___ (already/finish) the report before her boss ___ (ask) for it yesterday. | Ella ya había terminado el informe antes de que su jefe lo pidiera ayer. | **had already finished / asked *(alt: 'd already finished / asked)*** | El primer hueco requiere Past Perfect (acción anterior a otra acción pasada); el segundo, Past Simple para la acción pasada de referencia. |
| `grm_b1_pres_perfect_003` | **Present Perfect vs. Past Simple** | By the time she ___ (call) me, I ___ (already/leave) the office, so I ___ (not/hear) the news until the next morning. | Para cuando ella me llamó, yo ya había salido de la oficina, así que no escuché la noticia hasta la mañana siguiente. | **called / had already left / didn't hear *(alt: called / 'd already left / did not hear)*** | Combina tres tiempos: Past Simple para la llamada, Past Perfect para la acción anterior, y Past Simple negativo para la consecuencia posterior. |
| `grm_b1_cond1_001` | **First Conditional** | If it ___ (rain) tomorrow, we ___ (stay) home. | Si llueve mañana, nos quedaremos en casa. | **rains / will stay *(alt: rains / 'll stay)*** | Primer condicional: presente simple en la condición, 'will' + infinitivo en el resultado, para situaciones futuras reales o probables. |
| `grm_b1_cond1_002` | **First Conditional** | Unless you ___ (submit) the form by Friday, your application ___ (not/be) considered. | A menos que envíes el formulario para el viernes, tu solicitud no será considerada. | **submit / won't be *(alt: submit / will not be)*** | 'Unless' funciona como 'if not' — la condición sigue en presente simple aunque el significado sea negativo. |
| `grm_b1_cond1_003` | **First Conditional** | If the company ___ (not/reduce) costs soon, and provided that sales ___ (not/improve) next quarter, they ___ (have to) lay off staff. | Si la empresa no reduce costos pronto, y siempre que las ventas no mejoren el próximo trimestre, tendrán que despedir personal. | **doesn't reduce / don't improve / will have to *(alt: does not reduce / do not improve / 'll have to)*** | Dos condiciones encadenadas ('if... and provided that...') seguidas de un resultado con 'will have to', mostrando que el primer condicional puede combinar varias cláusulas condicionales. |
| `grm_b1_cond2_001` | **Second Conditional** | If I ___ (have) more free time, I ___ (travel) more. | Si tuviera más tiempo libre, viajaría más. | **had / would travel *(alt: had / 'd travel)*** | Segundo condicional: pasado simple en la condición hipotética, 'would' + infinitivo en el resultado imaginario. |
| `grm_b1_cond2_002` | **Second Conditional** | If she ___ (be) in your position, she ___ (not/hesitate) to accept the offer. | Si ella estuviera en tu posición, no dudaría en aceptar la oferta. | **were / wouldn't hesitate *(alt: was / wouldn't hesitate, were / would not hesitate)*** | En registro formal, 'were' se usa con todos los sujetos en segundo condicional (aunque 'was' también es aceptado en habla informal). |
| `grm_b1_cond2_003` | **Second Conditional** | If governments ___ (invest) more in renewable energy, and if people ___ (be) more willing to change their habits, climate change ___ (not/be) such an urgent threat. | Si los gobiernos invirtieran más en energía renovable, y si la gente estuviera más dispuesta a cambiar sus hábitos, el cambio climático no sería una amenaza tan urgente. | **invested / were / wouldn't be *(alt: invested / were / would not be)*** | Dos condiciones hipotéticas coordinadas con 'and if' seguidas de un único resultado — estructura típica de argumentación en B1-B2. |
| `grm_b1_passive_001` | **Passive Voice** | This book ___ (write) by a famous author. | Este libro fue escrito por un autor famoso. | **was written** | Voz pasiva en pasado simple: 'was/were' + participio pasado, útil cuando el interés está en la acción, no en quién la realizó. |
| `grm_b1_passive_002` | **Passive Voice** | New safety regulations ___ (introduce) next year to reduce workplace accidents. | Nuevas regulaciones de seguridad serán introducidas el próximo año para reducir accidentes laborales. | **will be introduced *(alt: 'll be introduced)*** | Voz pasiva en futuro con 'will': 'will be' + participio pasado. |
| `grm_b1_passive_003` | **Passive Voice** | It ___ (believe) that the ancient bridge ___ (build) over two thousand years ago, although it ___ (not/officially/confirm) until recent excavations. | Se cree que el antiguo puente fue construido hace más de dos mil años, aunque no se confirmó oficialmente hasta excavaciones recientes. | **is believed / was built / wasn't officially confirmed *(alt: is believed / was built / was not officially confirmed)*** | Combina tres construcciones pasivas en distintos tiempos dentro de una sola oración compleja, típico de textos académicos o históricos en B1-B2. |
| `grm_b1_comp_001` | **Comparatives and Superlatives** | This exercise is ___ (difficult) than the last one. | Este ejercicio es más difícil que el anterior. | **more difficult** | Adjetivos de dos o más sílabas terminados en patrones no simples forman el comparativo con 'more' + adjetivo + 'than'. |
| `grm_b1_comp_002` | **Comparatives and Superlatives** | The more experience you gain, the ___ (confident) you become at your job. | Cuanta más experiencia ganas, más seguro te vuelves en tu trabajo. | **more confident** | Estructura 'the more..., the more...' para expresar relación proporcional entre dos ideas — un patrón que suele confundir a hablantes de español porque no existe una traducción literal directa. |
| `grm_b1_comp_003` | **Comparatives and Superlatives** | Of all the candidates, she was by far ___ (qualified), even though she was not ___ (experienced) as some of the others. | De todos los candidatos, ella era con diferencia la más calificada, aunque no era tan experimentada como algunos de los otros. | **the most qualified / as experienced** | Combina un superlativo enfatizado con 'by far' y una comparación de igualdad ('as...as') en la misma oración — nivel de complejidad típico de B1 alto / entrada a B2. |
| `grm_b1_modals_001` | **Modal Verbs of Obligation and Advice** | You ___ (should) apologize to her. | Deberías disculparte con ella. | **should** | 'Should' expresa un consejo o recomendación, no una obligación estricta. |
| `grm_b1_modals_002` | **Modal Verbs of Obligation and Advice** | You ___ (not/have to) attend the meeting, but you ___ (must) send your report by email. | No tienes que asistir a la reunión, pero debes enviar tu informe por correo. | **don't have to / must *(alt: do not have to / must)*** | Contraste clave en B1: 'don't have to' significa que algo no es necesario (no prohibición), mientras 'must' expresa obligación firme. |
| `grm_b1_modals_003` | **Modal Verbs of Obligation and Advice** | You ___ (should/have) told me earlier — I ___ (could/avoid) the mistake if I ___ (know) about the deadline change. | Deberías habérmelo dicho antes; podría haber evitado el error si hubiera sabido del cambio de fecha límite. | **should have / could have avoided / had known *(alt: should've / could've avoided / had known)*** | Combina 'should have + participio' (crítica sobre el pasado), 'could have + participio' (posibilidad no realizada) y tercer condicional implícito — estructura de entrada a B2. |
| `grm_b1_relative_001` | **Relative Clauses** | The man ___ lives next door is a teacher. | El hombre que vive al lado es maestro. | **who *(alt: that)*** | 'Who' (o 'that') introduce una cláusula relativa que describe a una persona. |
| `grm_b1_relative_002` | **Relative Clauses** | The company, ___ headquarters are in Madrid, announced record profits this year. | La empresa, cuya sede está en Madrid, anunció ganancias récord este año. | **whose** | 'Whose' indica posesión dentro de una cláusula relativa, y aquí introduce información adicional no esencial (nótese las comas). |
| `grm_b1_relative_003` | **Relative Clauses** | The city ___ I grew up, ___ has changed enormously in the last decade, is no longer ___ it used to be. | La ciudad donde crecí, que ha cambiado enormemente en la última década, ya no es lo que solía ser. | **where / which / what** | Combina tres tipos de cláusula relativa en una sola oración: 'where' (lugar), 'which' (cláusula no esencial sobre la ciudad) y 'what' (lo que solía ser, sin antecedente explícito). |
| `grm_b1_reported_001` | **Reported Speech** | She said that she ___ (be) tired. | Ella dijo que estaba cansada. | **was** | En estilo indirecto, el presente ('am/is') retrocede a pasado ('was') cuando el verbo introductorio está en pasado. |
| `grm_b1_reported_002` | **Reported Speech** | He told me that he ___ (finish) the project the day before and that he ___ (send) it soon. | Él me dijo que había terminado el proyecto el día anterior y que lo enviaría pronto. | **had finished / would send *(alt: 'd finished / would send)*** | El pasado simple retrocede a Past Perfect, y 'will' retrocede a 'would' en estilo indirecto — junto con el cambio de 'the day before' en vez de 'yesterday'. |
| `grm_b1_reported_003` | **Reported Speech** | The manager explained that the deadline ___ (change) because the client ___ (request) extra revisions, and she asked us whether we ___ (can) finish by Friday instead. | El gerente explicó que la fecha límite había cambiado porque el cliente había pedido revisiones adicionales, y preguntó si podríamos terminar el viernes en su lugar. | **had changed / had requested / could** | Combina Past Perfect en dos cláusulas causales y 'can' retrocedido a 'could' dentro de una pregunta indirecta ('asked us whether') — estructura avanzada de discurso reportado. |
| `grm_b1_used_to_001` | **Used to / Would (Past Habits)** | When I was a child, I ___ (used to) play outside every day. | Cuando era niño, solía jugar afuera todos los días. | **used to** | 'Used to' describe hábitos o estados que ya no son ciertos en el presente. |
| `grm_b1_used_to_002` | **Used to / Would (Past Habits)** | Every summer, my grandfather ___ (would) tell us stories by the fire, although he ___ (used to) get the details wrong sometimes. | Cada verano, mi abuelo nos contaba historias junto al fuego, aunque a veces se equivocaba en los detalles. | **would / used to** | 'Would' se usa para acciones repetidas (no estados) en el pasado; 'used to' puede usarse tanto para acciones como para estados — aquí se combinan correctamente. |
| `grm_b1_used_to_003` | **Used to / Would (Past Habits)** | I ___ (be) used to waking up early now, but I remember how difficult it ___ (used to) be when I first started this job, since I ___ (never/be) a morning person before. | Ahora estoy acostumbrado a despertarme temprano, pero recuerdo lo difícil que solía ser cuando empecé este trabajo, ya que nunca antes había sido una persona madrugadora. | **am / used to / had never been** | Contrasta 'be used to' (estar acostumbrado, presente) con 'used to' (hábito pasado) y Past Perfect para la experiencia previa — una distinción que suele confundirse incluso en niveles avanzados. |
| `grm_b1_third_cond_001` | **Third Conditional** | If I ___ (study) harder, I ___ (pass) the exam. | Si hubiera estudiado más, habría aprobado el examen. | **had studied / would have passed *(alt: 'd studied / would've passed)*** | Tercer condicional: Past Perfect en la condición, 'would have' + participio en el resultado, para hablar de situaciones pasadas que no ocurrieron. |
| `grm_b1_third_cond_002` | **Third Conditional** | If they ___ (leave) earlier, they ___ (not/miss) the flight. | Si hubieran salido más temprano, no habrían perdido el vuelo. | **had left / wouldn't have missed *(alt: 'd left / would not have missed)*** | El resultado negativo en tercer condicional usa 'wouldn't have' + participio. |
| `grm_b1_third_cond_003` | **Third Conditional** | If the manager ___ (know) about the problem sooner, and if the team ___ (communicate) more clearly, the project ___ (not/fail) so badly. | Si el gerente hubiera sabido del problema antes, y si el equipo se hubiera comunicado con más claridad, el proyecto no habría fracasado tan gravemente. | **had known / had communicated / wouldn't have failed *(alt: 'd known / 'd communicated / would not have failed)*** | Dos condiciones hipotéticas pasadas coordinadas llevando a un único resultado no realizado — estructura de análisis retrospectivo típica en informes o debates. |
| `grm_b1_gerund_inf_001` | **Gerunds vs. Infinitives** | She enjoys ___ (read) before bed. | A ella le gusta leer antes de dormir. | **reading** | 'Enjoy' siempre va seguido de gerundio (-ing), nunca de infinitivo. |
| `grm_b1_gerund_inf_002` | **Gerunds vs. Infinitives** | I stopped ___ (smoke) two years ago, but yesterday I stopped ___ (buy) some milk on my way home. | Dejé de fumar hace dos años, pero ayer me detuve para comprar leche de camino a casa. | **smoking / to buy** | 'Stop + gerundio' significa dejar un hábito; 'stop + infinitivo' significa detenerse con el propósito de hacer algo — mismo verbo, significado opuesto según la forma. |
| `grm_b1_gerund_inf_003` | **Gerunds vs. Infinitives** | I regret ___ (not/study) harder in school, and I remember ___ (tell) myself back then that it didn't matter, but I'd forgotten ___ (mention) that to my own children until it was too late. | Me arrepiento de no haber estudiado más en la escuela, y recuerdo haberme dicho en aquel entonces que no importaba, pero había olvidado mencionárselo a mis propios hijos hasta que fue demasiado tarde. | **not studying / telling / to mention** | Tres verbos con comportamiento distinto: 'regret + gerundio' (lamentar algo pasado), 'remember + gerundio' (recordar un evento pasado), 'forget + infinitivo' (olvidar hacer algo pendiente). |
| `grm_b1_quantifiers_001` | **Quantifiers (some/any/much/many/a few/a little)** | There isn't ___ milk left in the fridge. | No queda mucha leche en el refrigerador. | **much** | 'Much' se usa con sustantivos incontables en oraciones negativas; 'many' se usa con contables. |
| `grm_b1_quantifiers_002` | **Quantifiers (some/any/much/many/a few/a little)** | We only have ___ (little) time left, but fortunately ___ (few) people signed up, so it should be manageable. | Solo nos queda poco tiempo, pero afortunadamente pocas personas se inscribieron, así que debería ser manejable. | **a little / a few** | 'A little' (incontable) y 'a few' (contable) tienen connotación positiva ('suficiente'), a diferencia de 'little'/'few' sin artículo, que suenan negativos ('casi nada'). |
| `grm_b1_quantifiers_003` | **Quantifiers (some/any/much/many/a few/a little)** | Although there was ___ (little) evidence to support the theory, ___ (a few) researchers continued the project, believing that ___ (some) of the missing data would eventually confirm their hypothesis. | Aunque había poca evidencia para respaldar la teoría, unos pocos investigadores continuaron el proyecto, creyendo que algunos de los datos faltantes finalmente confirmarían su hipótesis. | **little / a few / some** | Contrasta 'little' sin artículo (negativo: casi ninguna evidencia) con 'a few' (positivo: un grupo suficiente de investigadores) y 'some' (cantidad indefinida positiva) en una misma oración argumentativa. |
| `grm_b1_pres_perf_cont_001` | **Present Perfect Continuous** | I ___ (wait) for the bus for twenty minutes. | He estado esperando el autobús durante veinte minutos. | **have been waiting *(alt: 've been waiting)*** | Present Perfect Continuous enfatiza la duración de una acción que comenzó en el pasado y continúa (o acaba de terminar). |
| `grm_b1_pres_perf_cont_002` | **Present Perfect Continuous** | You look exhausted — ___ (you/run)? | Te ves agotado, ¿has estado corriendo? | **have you been running** | Pregunta en Present Perfect Continuous usada para explicar evidencia visible de una actividad reciente. |
| `grm_b1_pres_perf_cont_003` | **Present Perfect Continuous** | She ___ (work) on this report all week, but she still ___ (not/finish) it, even though she ___ (try) her best. | Ella ha estado trabajando en este informe toda la semana, pero todavía no lo ha terminado, aunque lo ha intentado con todas sus fuerzas. | **has been working / hasn't finished / has tried *(alt: has been working / has not finished / has tried)*** | Combina Present Perfect Continuous (proceso en curso) con Present Perfect simple (resultado no logrado) en la misma oración — distinción clave de nivel B1 alto. |
| `grm_b1_wish_001` | **Wish / If Only** | I wish I ___ (have) more money. | Ojalá tuviera más dinero. | **had** | 'Wish' + pasado simple expresa un deseo sobre una situación presente que no es cierta. |
| `grm_b1_wish_002` | **Wish / If Only** | If only I ___ (not/say) that to her yesterday. | Ojalá no le hubiera dicho eso ayer. | **hadn't said *(alt: had not said)*** | 'If only' + Past Perfect expresa arrepentimiento sobre algo que ya sucedió en el pasado. |
| `grm_b1_wish_003` | **Wish / If Only** | I wish I ___ (can/speak) three languages like my sister, and if only I ___ (start) learning earlier instead of waiting until now. | Ojalá pudiera hablar tres idiomas como mi hermana, y ojalá hubiera empezado a aprender antes en vez de esperar hasta ahora. | **could speak / had started** | Combina 'wish + could' (deseo sobre habilidad presente) con 'if only + Past Perfect' (arrepentimiento sobre el pasado) en la misma oración. |
| `grm_b1_qtags_001` | **Question Tags** | You're coming to the party, ___? | Vienes a la fiesta, ¿verdad? | **aren't you** | Con una afirmación, la question tag va en negativo: 'you're' (afirmativo) → 'aren't you' (negativo). |
| `grm_b1_qtags_002` | **Question Tags** | She hasn't called yet, ___? | Ella no ha llamado todavía, ¿verdad? | **has she** | Con una afirmación negativa, la question tag va en positivo: 'hasn't called' (negativo) → 'has she' (positivo). |
| `grm_b1_qtags_003` | **Question Tags** | Let's take a break, ___? Nobody has finished the report yet, ___? And there's nothing more we can do today, ___? | Tomemos un descanso, ¿de acuerdo? Nadie ha terminado el informe todavía, ¿verdad? Y no hay nada más que podamos hacer hoy, ¿verdad? | **shall we / have they / is there** | Tres casos especiales: 'Let's' siempre usa 'shall we'; 'nobody' (negativo implícito) toma tag positiva 'have they'; 'there's nothing' (negativo implícito) toma tag positiva 'is there'. |

---

## 📘 Nivel B2 (Intermedio Alto · Vantage)

- **Semanas lectivas:** 5 semanas
- **Total vocabulario:** 84 palabras
- **Lecturas integradas:** 2 textos con evaluación

### Semana 1: B2 · Semana 1 – Matices de significado y registro
Total de palabras en esta semana: **18**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b2_nuance_001` | **nuance** | *noun* | `/ˈnuˌɑns/` | matiz | There is a subtle nuance between these two words. | Hay un matiz sutil entre estas dos palabras. |
| `voc_b2_connotation_002` | **connotation** | *noun* | `/ˌkɑnəˈteɪʃən/` | connotación | The word has a negative connotation in this context. | La palabra tiene una connotación negativa en este contexto. |
| `voc_b2_implication_003` | **implication** | *noun* | `/ˌɪmpləˈkeɪʃən/` | implicación | The policy has serious implications for small businesses. | La política tiene implicaciones serias para las pequeñas empresas. |
| `voc_b2_subtlety_004` | **subtlety** | *noun* | `/ˈsʌtəlti/` | sutileza | The subtlety of her argument impressed the judges. | La sutileza de su argumento impresionó a los jueces. |
| `voc_b2_rhetoric_005` | **rhetoric** | *noun* | `/ˈrɛtərɪk/` | retórica | His speech was full of empty rhetoric. | Su discurso estaba lleno de retórica vacía. |
| `voc_b2_discourse_006` | **discourse** | *noun* | `/ˈdɪsˌkɔrs/` | discurso (análisis) | Political discourse has become more polarized. | El discurso político se ha vuelto más polarizado. |
| `voc_b2_register-language_007` | **register (language)** | *noun* | `/ˈrɛdʒɪstər/` | registro (lingüístico) | She switched to a more formal register during the interview. | Ella cambió a un registro más formal durante la entrevista. |
| `voc_b2_colloquial_008` | **colloquial** | *adjective* | `/kəˈloʊkwiəl/` | coloquial | That phrase is too colloquial for a business email. | Esa frase es demasiado coloquial para un correo de negocios. |
| `voc_b2_vernacular_009` | **vernacular** | *noun* | `/vərˈnækjələr/` | vernáculo/habla local | The novel is written in the local vernacular. | La novela está escrita en el habla local. |
| `voc_b2_jargon_010` | **jargon** | *noun* | `/ˈdʒɑrgən/` | jerga (técnica) | The report was full of technical jargon. | El informe estaba lleno de jerga técnica. |
| `voc_b2_ambiguity_011` | **ambiguity** | *noun* | `/ˌæmbɪˈgjuəti/` | ambigüedad | The contract's ambiguity caused confusion. | La ambigüedad del contrato causó confusión. |
| `voc_b2_paradox_012` | **paradox** | *noun* | `/ˈpɛrəˌdɑks/` | paradoja | It's a paradox that helping too much can hurt. | Es una paradoja que ayudar demasiado puede perjudicar. |
| `voc_b2_irony_013` | **irony** | *noun* | `/ˈaɪrəni/` | ironía | The irony of the situation wasn't lost on anyone. | Nadie pasó por alto la ironía de la situación. |
| `voc_b2_cynicism_014` | **cynicism** | *noun* | `/ˈsɪnɪˌsɪzəm/` | cinismo | His cynicism made it hard to trust his advice. | Su cinismo dificultaba confiar en su consejo. |
| `voc_b2_skepticism_015` | **skepticism** | *noun* | `/ˈskɛptɪˌsɪzəm/` | escepticismo | She approached the claim with healthy skepticism. | Ella abordó la afirmación con un sano escepticismo. |
| `voc_b2_euphemism_016` | **euphemism** | *noun* | `/ˈjufəˌmɪzəm/` | eufemismo | "Letting someone go" is a euphemism for firing. | "Dejar ir a alguien" es un eufemismo para despedir. |
| `voc_b2_understatement_017` | **understatement** | *noun* | `/ˈʌndərˌsteɪtmənt/` | subestimación/decir menos de lo que es | Calling it a challenge was an understatement. | Llamarlo un reto fue quedarse corto. |
| `voc_b2_overstatement_018` | **overstatement** | *noun* | `/ˈoʊvərˌsteɪtmənt/` | exageración | Saying it changed everything is an overstatement. | Decir que cambió todo es una exageración. |

### Semana 2: B2 · Semana 2 – Ideas, ideología y sociedad
Total de palabras en esta semana: **21**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b2_ideology_019` | **ideology** | *noun* | `/ˌaɪdiˈɑlədʒi/` | ideología | Their political ideology shapes every decision. | Su ideología política moldea cada decisión. |
| `voc_b2_philosophy_020` | **philosophy** | *noun* | `/fəˈlɑsəfi/` | filosofía | Her philosophy of life is simple: be kind. | Su filosofía de vida es simple: sé amable. |
| `voc_b2_ethics_021` | **ethics** | *noun* | `/ˈɛθɪks/` | ética | The committee reviews the ethics of each study. | El comité revisa la ética de cada estudio. |
| `voc_b2_morality_022` | **morality** | *noun* | `/mɔˈræləti/` | moralidad | The film raises questions about morality and choice. | La película plantea preguntas sobre la moralidad y la elección. |
| `voc_b2_autonomy_023` | **autonomy** | *noun* | `/ɔˈtɑnəmi/` | autonomía | Employees value autonomy in their work. | Los empleados valoran la autonomía en su trabajo. |
| `voc_b2_sovereignty_024` | **sovereignty** | *noun* | `/ˈsɑvrənti/` | soberanía | The nation defended its sovereignty. | La nación defendió su soberanía. |
| `voc_b2_legislation_025` | **legislation** | *noun* | `/ˌlɛdʒəsˈleɪʃən/` | legislación | New legislation will regulate the industry. | Una nueva legislación regulará la industria. |
| `voc_b2_jurisdiction_026` | **jurisdiction** | *noun* | `/ˌdʒʊrɪsˈdɪkʃən/` | jurisdicción | This case falls under federal jurisdiction. | Este caso cae bajo jurisdicción federal. |
| `voc_b2_advocacy_027` | **advocacy** | *noun* | `/ˈædvəkəsi/` | apoyo/defensa de una causa | She works in advocacy for children's rights. | Ella trabaja en la defensa de los derechos de los niños. |
| `voc_b2_activism_028` | **activism** | *noun* | `/ˈæktɪˌvɪzəm/` | activismo | His activism inspired an entire generation. | Su activismo inspiró a toda una generación. |
| `voc_b2_discrimination_029` | **discrimination** | *noun* | `/dɪˌskrɪməˈneɪʃən/` | discriminación | The law protects against workplace discrimination. | La ley protege contra la discriminación laboral. |
| `voc_b2_prejudice_030` | **prejudice** | *noun* | `/ˈprɛdʒədɪs/` | prejuicio | The program aims to reduce prejudice. | El programa busca reducir el prejuicio. |
| `voc_b2_stereotype_031` | **stereotype** | *noun* | `/ˈstɛriəˌtaɪp/` | estereotipo | The movie challenges a common stereotype. | La película desafía un estereotipo común. |
| `voc_b2_stigma_032` | **stigma** | *noun* | `/ˈstɪgmə/` | estigma | There is still stigma around mental illness. | Todavía hay estigma alrededor de la enfermedad mental. |
| `voc_b2_marginalization_033` | **marginalization** | *noun* | `/ˌmɑrdʒənələˈzeɪʃən/` | marginación | The report addresses the marginalization of rural communities. | El informe aborda la marginación de las comunidades rurales. |
| `voc_b2_inequality_034` | **inequality** | *noun* | `/ˌɪnɪˈkwɑləti/` | desigualdad | Income inequality has increased in recent years. | La desigualdad de ingresos ha aumentado en los últimos años. |
| `voc_b2_disparity_035` | **disparity** | *noun* | `/dɪˈspɛrəti/` | disparidad | There is a wide disparity between the two regions. | Hay una gran disparidad entre las dos regiones. |
| `voc_b2_privilege-noun_036` | **privilege (noun)** | *noun* | `/ˈprɪvəlɪdʒ/` | privilegio | It's important to recognize your own privilege. | Es importante reconocer tu propio privilegio. |
| `voc_b2_empowerment_037` | **empowerment** | *noun* | `/ɪmˈpaʊərmənt/` | empoderamiento | The workshop focuses on women's empowerment. | El taller se enfoca en el empoderamiento de las mujeres. |
| `voc_b2_exploitation_038` | **exploitation** | *noun* | `/ˌɛksplɔɪˈteɪʃən/` | explotación | The report exposed the exploitation of workers. | El informe expuso la explotación de los trabajadores. |
| `voc_b2_oppression_039` | **oppression** | *noun* | `/əˈprɛʃən/` | opresión | The book describes decades of oppression. | El libro describe décadas de opresión. |

### Semana 3: B2 · Semana 3 – Cambio, tecnología y procesos globales
Total de palabras en esta semana: **18**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b2_globalization_040` | **globalization** | *noun* | `/ˈgloʊbələˈzeɪʃən/` | globalización | Globalization has changed how businesses operate. | La globalización ha cambiado cómo operan las empresas. |
| `voc_b2_urbanization_041` | **urbanization** | *noun* | `/ˈɜrbənəˈzeɪʃən/` | urbanización | Rapid urbanization put pressure on housing. | La urbanización acelerada presionó la vivienda. |
| `voc_b2_industrialization_042` | **industrialization** | *noun* | `/ɪnˌdʌstriələˈzeɪʃən/` | industrialización | Industrialization transformed the country's economy. | La industrialización transformó la economía del país. |
| `voc_b2_digitalization_043` | **digitalization** | *noun* | `/ˈdɪdʒɪtələˈzeɪʃən/` | digitalización | Digitalization improved efficiency across departments. | La digitalización mejoró la eficiencia en todos los departamentos. |
| `voc_b2_automation_044` | **automation** | *noun* | `/ˈɔtəˈmeɪʃən/` | automatización | Automation reduced production costs. | La automatización redujo los costos de producción. |
| `voc_b2_disruption_045` | **disruption** | *noun* | `/dɪsˈrʌpʃən/` | disrupción | The new app caused massive disruption in the market. | La nueva aplicación causó una gran disrupción en el mercado. |
| `voc_b2_innovation_046` | **innovation** | *noun* | `/ˈɪnəˈveɪʃən/` | innovación | The company is known for its innovation. | La empresa es conocida por su innovación. |
| `voc_b2_obsolete_047` | **obsolete** | *noun* | `/ˈɑbsəˌlit/` | obsoleto | This technology quickly became obsolete. | Esta tecnología rápidamente se volvió obsoleta. |
| `voc_b2_paradigm_048` | **paradigm** | *noun* | `/ˈpɛrəˌdaɪm/` | paradigma | This discovery shifted the scientific paradigm. | Este descubrimiento cambió el paradigma científico. |
| `voc_b2_hypothesis_049` | **hypothesis** | *noun* | `/haɪˈpɑθəsɪs/` | hipótesis | The researchers tested their hypothesis carefully. | Los investigadores probaron su hipótesis con cuidado. |
| `voc_b2_methodology_050` | **methodology** | *noun* | `/ˈmɛθəˈdɑlədʒi/` | metodología | The study uses a clear methodology. | El estudio usa una metodología clara. |
| `voc_b2_correlation_051` | **correlation** | *noun* | `/ˈkɔrəˈleɪʃən/` | correlación | There is a strong correlation between the two variables. | Hay una fuerte correlación entre las dos variables. |
| `voc_b2_causation_052` | **causation** | *noun* | `/kɔˈzeɪʃən/` | causalidad | Correlation doesn't always imply causation. | La correlación no siempre implica causalidad. |
| `voc_b2_variable-noun_053` | **variable (noun)** | *noun* | `/ˈvɛriəbəl/` | variable | Age is an important variable in this study. | La edad es una variable importante en este estudio. |
| `voc_b2_empirical_054` | **empirical** | *adjective* | `/ɛmˈpɪrɪkəl/` | empírico | The theory is based on empirical evidence. | La teoría se basa en evidencia empírica. |
| `voc_b2_qualitative_055` | **qualitative** | *adjective* | `/ˈkwɑləˌteɪtɪv/` | cualitativo | We conducted qualitative interviews with users. | Realizamos entrevistas cualitativas con usuarios. |
| `voc_b2_quantitative_056` | **quantitative** | *adjective* | `/ˈkwɑntəˌteɪtɪv/` | cuantitativo | The report includes quantitative data. | El informe incluye datos cuantitativos. |
| `voc_b2_synthesis_057` | **synthesis** | *noun* | `/ˈsɪnθəsɪs/` | síntesis | The essay is a synthesis of several theories. | El ensayo es una síntesis de varias teorías. |

### Semana 4: B2 · Semana 4 – Conectores formales de escritura académica
Total de palabras en esta semana: **15**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b2_notwithstanding_058` | **notwithstanding** | *adverb* | `/ˌnɑtwɪθˈstændɪŋ/` | no obstante | Notwithstanding the risks, they proceeded with the plan. | No obstante los riesgos, procedieron con el plan. |
| `voc_b2_albeit_059` | **albeit** | *conjunction* | `/ɔlˈbiɪt/` | aunque/si bien | The project succeeded, albeit with some delays. | El proyecto tuvo éxito, aunque con algunos retrasos. |
| `voc_b2_thereby_060` | **thereby** | *conjunction* | `/ðɛrˈbaɪ/` | de ese modo | They cut costs, thereby increasing profits. | Redujeron costos, de ese modo aumentando las ganancias. |
| `voc_b2_hitherto_061` | **hitherto** | *conjunction* | `/ˈhɪðərˌtu/` | hasta ahora | Hitherto, no one had studied this phenomenon. | Hasta ahora, nadie había estudiado este fenómeno. |
| `voc_b2_henceforth_062` | **henceforth** | *conjunction* | `/ˌhɛnsˈfɔrθ/` | de aquí en adelante | Henceforth, all reports must be submitted digitally. | De aquí en adelante, todos los informes deben enviarse digitalmente. |
| `voc_b2_insofar-as_063` | **insofar as** | *conjunction* | `/ˌɪnsoʊˈfɑr æz/` | en la medida en que | The plan is good insofar as it saves money. | El plan es bueno en la medida en que ahorra dinero. |
| `voc_b2_to-the-extent-that_064` | **to the extent that** | *conjunction* | `/tu ði ɪkˈstɛnt ðæt/` | en la medida en que | The policy failed to the extent that it was ignored. | La política fracasó en la medida en que fue ignorada. |
| `voc_b2_in-light-of_065` | **in light of** | *conjunction* | `/ɪn laɪt əv/` | a la luz de | In light of recent events, we changed our plans. | A la luz de los eventos recientes, cambiamos nuestros planes. |
| `voc_b2_with-regard-to_066` | **with regard to** | *conjunction* | `/wɪð rɪˈgɑrd tu/` | con respecto a | With regard to the budget, we need more details. | Con respecto al presupuesto, necesitamos más detalles. |
| `voc_b2_in-relation-to_067` | **in relation to** | *conjunction* | `/ɪn rɪˈleɪʃən tu/` | en relación con | Sales grew in relation to last year. | Las ventas crecieron en relación con el año pasado. |
| `voc_b2_by-virtue-of_068` | **by virtue of** | *conjunction* | `/baɪ ˈvɜrtʃu əv/` | en virtud de | She got the job by virtue of her experience. | Ella obtuvo el trabajo en virtud de su experiencia. |
| `voc_b2_for-the-sake-of_069` | **for the sake of** | *conjunction* | `/fɔr ðə seɪk əv/` | por el bien de | Let's simplify this for the sake of clarity. | Simplifiquemos esto por el bien de la claridad. |
| `voc_b2_as-a-consequence-of_070` | **as a consequence of** | *conjunction* | `/æz ə ˈkɑnsəˌkwɛns əv/` | como consecuencia de | Prices rose as a consequence of the shortage. | Los precios subieron como consecuencia de la escasez. |
| `voc_b2_conversely_071` | **conversely** | *conjunction* | `/kənˈvɜrsli/` | por el contrario | Conversely, smaller companies adapted more quickly. | Por el contrario, las empresas más pequeñas se adaptaron más rápido. |
| `voc_b2_notably_072` | **notably** | *adverb* | `/ˈnoʊtəbli/` | notablemente | Several sectors improved, most notably technology. | Varios sectores mejoraron, notablemente el tecnológico. |

### Semana 5: B2 · Semana 5 – Liderazgo, estrategia y conceptos académicos
Total de palabras en esta semana: **12**

| ID | Palabra | Categoría | Fonética (IPA) | Traducción | Ejemplo en Inglés | Traducción del Ejemplo |
|---|---|---|---|---|---|---|
| `voc_b2_abstract_073` | **abstract** | *adjective* | `/ˈæbˌstrækt/` | abstracto / teórico | The concept is too abstract for beginners. | El concepto es demasiado abstracto para principiantes. |
| `voc_b2_inherent_074` | **inherent** | *adjective* | `/ɪnˈhɪrənt/` | inherente / intrínseco | There is an inherent risk in this strategy. | Hay un riesgo inherente en esta estrategia. |
| `voc_b2_scrutinise_075` | **scrutinise** | *verb* | `/ˈskrutəˌnaɪz/` | examinar detalladamente / escudriñar | Investors will scrutinise the company's financial reports. | Los inversores escudriñarán los informes financieros de la empresa. |
| `voc_b2_unprecedented_076` | **unprecedented** | *adjective* | `/ʌnˈprɛsəˌdɛntɪd/` | sin precedentes | The company achieved unprecedented growth this year. | La empresa logró un crecimiento sin precedentes este año. |
| `voc_b2_ethical_077` | **ethical** | *adjective* | `/ˈɛθɪkəl/` | ético / moral | The board discussed the ethical implications. | La junta discutió las implicaciones éticas. |
| `voc_b2_leadership_078` | **leadership** | *noun* | `/ˈlidərˌʃɪp/` | liderazgo / dirección | Strong leadership guided the company through the crisis. | Un liderazgo fuerte guió a la empresa durante la crisis. |
| `voc_b2_strategy_079` | **strategy** | *noun* | `/ˈstrætədʒi/` | estrategia | Their marketing strategy was very effective. | Su estrategia de marketing fue muy efectiva. |
| `voc_b2_merger_080` | **merger** | *noun* | `/ˈmɜrdʒər/` | fusión empresarial | The merger created the largest company in the sector. | La fusión creó la empresa más grande del sector. |
| `voc_b2_acquisition_081` | **acquisition** | *noun* | `/ˌækwəˈzɪʃən/` | adquisición empresarial | The acquisition doubled the company's size. | La adquisición duplicó el tamaño de la empresa. |
| `voc_b2_accountability_082` | **accountability** | *noun* | `/əˌkaʊntəˈbɪləti/` | rendición de cuentas / responsabilidad | Leaders must show accountability for their decisions. | Los líderes deben mostrar responsabilidad por sus decisiones. |
| `voc_b2_transparency_083` | **transparency** | *noun* | `/trænsˈpɛrənsi/` | transparencia | The company promised more transparency with investors. | La empresa prometió más transparencia con los inversores. |
| `voc_b2_compliance_084` | **compliance** | *noun* | `/kəmˈplaɪəns/` | cumplimiento normativo | The department ensures compliance with regulations. | El departamento asegura el cumplimiento de las regulaciones. |

### 📖 Lecturas de Comprensión · Nivel B2

Textos graduados que reutilizan exclusivamente el léxico consolidado hasta su semana lectiva, acompañados de preguntas pedagógicas de opción múltiple.

#### Lectura Semana 5: The Ethical Dilemma of Advanced Artificial Intelligence (`rdg_b2_001`)
- **Nivel:** B2 | **Semana lectiva:** 5 | **Dificultad interna:** 4/5
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

#### Lectura Semana 5: Strategic Leadership in International Mergers (`rdg_b2_002`)
- **Nivel:** B2 | **Semana lectiva:** 5 | **Dificultad interna:** 4/5
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