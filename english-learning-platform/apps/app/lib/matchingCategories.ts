import type { VocabularyItem } from '@elp/types'

export interface MatchingPair {
  id: string
  english: string
  spanish: string
  phonetic?: string | undefined
}

export interface MatchingCategory {
  id: string
  name: string
  emoji: string
  stage: 'Básico (Sem. 1-4)' | 'Intermedio (Sem. 5-10)' | 'Avanzado (Sem. 11-19)'
  pairs: MatchingPair[]
}

export const SRS_WEEK_CATEGORY_ID = 'srs_week'

export const MATCHING_CATEGORIES: MatchingCategory[] = [
  // --- BÁSICO (Semana 1-4) ---
  {
    id: 'numbers',
    name: 'Números 1 al 20',
    emoji: '🔢',
    stage: 'Básico (Sem. 1-4)',
    pairs: [
      { id: 'num_1', english: 'One', spanish: 'Uno', phonetic: '/wʌn/' },
      { id: 'num_2', english: 'Two', spanish: 'Dos', phonetic: '/tuː/' },
      { id: 'num_3', english: 'Three', spanish: 'Tres', phonetic: '/θriː/' },
      { id: 'num_4', english: 'Four', spanish: 'Cuatro', phonetic: '/fɔːr/' },
      { id: 'num_5', english: 'Five', spanish: 'Cinco', phonetic: '/faɪv/' },
      { id: 'num_6', english: 'Six', spanish: 'Seis', phonetic: '/sɪks/' },
      { id: 'num_7', english: 'Seven', spanish: 'Siete', phonetic: '/ˈsev.ən/' },
      { id: 'num_8', english: 'Eight', spanish: 'Ocho', phonetic: '/eɪt/' },
      { id: 'num_9', english: 'Nine', spanish: 'Nueve', phonetic: '/naɪn/' },
      { id: 'num_10', english: 'Ten', spanish: 'Diez', phonetic: '/ten/' },
      { id: 'num_11', english: 'Eleven', spanish: 'Once', phonetic: '/ɪˈlev.ən/' },
      { id: 'num_12', english: 'Twelve', spanish: 'Doce', phonetic: '/twelv/' },
      { id: 'num_15', english: 'Fifteen', spanish: 'Quince', phonetic: '/fɪfˈtiːn/' },
      { id: 'num_20', english: 'Twenty', spanish: 'Veinte', phonetic: '/ˈtwen.ti/' },
    ],
  },
  {
    id: 'days',
    name: 'Días de la Semana',
    emoji: '📅',
    stage: 'Básico (Sem. 1-4)',
    pairs: [
      { id: 'day_mon', english: 'Monday', spanish: 'Lunes', phonetic: '/ˈmʌn.deɪ/' },
      { id: 'day_tue', english: 'Tuesday', spanish: 'Martes', phonetic: '/ˈtjuːz.deɪ/' },
      { id: 'day_wed', english: 'Wednesday', spanish: 'Miércoles', phonetic: '/ˈwenz.deɪ/' },
      { id: 'day_thu', english: 'Thursday', spanish: 'Jueves', phonetic: '/ˈθɜːz.deɪ/' },
      { id: 'day_fri', english: 'Friday', spanish: 'Viernes', phonetic: '/ˈfraɪ.deɪ/' },
      { id: 'day_sat', english: 'Saturday', spanish: 'Sábado', phonetic: '/ˈsæt.ə.deɪ/' },
      { id: 'day_sun', english: 'Sunday', spanish: 'Domingo', phonetic: '/ˈsʌn.deɪ/' },
    ],
  },
  {
    id: 'months',
    name: 'Meses del Año',
    emoji: '🗓️',
    stage: 'Básico (Sem. 1-4)',
    pairs: [
      { id: 'm_jan', english: 'January', spanish: 'Enero', phonetic: '/ˈdʒæn.ju.ə.ri/' },
      { id: 'm_feb', english: 'February', spanish: 'Febrero', phonetic: '/ˈfeb.ru.ə.ri/' },
      { id: 'm_mar', english: 'March', spanish: 'Marzo', phonetic: '/mɑːtʃ/' },
      { id: 'm_apr', english: 'April', spanish: 'Abril', phonetic: '/ˈeɪ.prəl/' },
      { id: 'm_may', english: 'May', spanish: 'Mayo', phonetic: '/meɪ/' },
      { id: 'm_jun', english: 'June', spanish: 'Junio', phonetic: '/dʒuːn/' },
      { id: 'm_jul', english: 'July', spanish: 'Julio', phonetic: '/dʒʊˈlaɪ/' },
      { id: 'm_aug', english: 'August', spanish: 'Agosto', phonetic: '/ˈɔː.ɡəst/' },
      { id: 'm_sep', english: 'September', spanish: 'Septiembre', phonetic: '/sepˈtem.bər/' },
      { id: 'm_oct', english: 'October', spanish: 'Octubre', phonetic: '/ɒkˈtəʊ.bər/' },
      { id: 'm_nov', english: 'November', spanish: 'Noviembre', phonetic: '/nəʊˈvem.bər/' },
      { id: 'm_dec', english: 'December', spanish: 'Diciembre', phonetic: '/dɪˈsem.bər/' },
    ],
  },
  {
    id: 'colors',
    name: 'Colores Básicos',
    emoji: '🎨',
    stage: 'Básico (Sem. 1-4)',
    pairs: [
      { id: 'col_red', english: 'Red', spanish: 'Rojo', phonetic: '/red/' },
      { id: 'col_blue', english: 'Blue', spanish: 'Azul', phonetic: '/bluː/' },
      { id: 'col_green', english: 'Green', spanish: 'Verde', phonetic: '/ɡriːn/' },
      { id: 'col_yellow', english: 'Yellow', spanish: 'Amarillo', phonetic: '/ˈjel.əʊ/' },
      { id: 'col_black', english: 'Black', spanish: 'Negro', phonetic: '/blæk/' },
      { id: 'col_white', english: 'White', spanish: 'Blanco', phonetic: '/waɪt/' },
      { id: 'col_orange', english: 'Orange', spanish: 'Naranja', phonetic: '/ˈɒr.ɪndʒ/' },
      { id: 'col_purple', english: 'Purple', spanish: 'Morado', phonetic: '/ˈpɜː.pəl/' },
      { id: 'col_pink', english: 'Pink', spanish: 'Rosa', phonetic: '/pɪŋk/' },
      { id: 'col_brown', english: 'Brown', spanish: 'Marrón', phonetic: '/braʊn/' },
    ],
  },
  {
    id: 'family',
    name: 'Familia Inmediata',
    emoji: '👨‍👩‍👧‍👦',
    stage: 'Básico (Sem. 1-4)',
    pairs: [
      { id: 'fam_mother', english: 'Mother', spanish: 'Madre', phonetic: '/ˈmʌð.ər/' },
      { id: 'fam_father', english: 'Father', spanish: 'Padre', phonetic: '/ˈfɑː.ðər/' },
      { id: 'fam_brother', english: 'Brother', spanish: 'Hermano', phonetic: '/ˈbrʌð.ər/' },
      { id: 'fam_sister', english: 'Sister', spanish: 'Hermana', phonetic: '/ˈsɪs.tər/' },
      { id: 'fam_son', english: 'Son', spanish: 'Hijo', phonetic: '/sʌn/' },
      { id: 'fam_daughter', english: 'Daughter', spanish: 'Hija', phonetic: '/ˈdɔː.tər/' },
      { id: 'fam_baby', english: 'Baby', spanish: 'Bebé', phonetic: '/ˈbeɪ.bi/' },
      { id: 'fam_parents', english: 'Parents', spanish: 'Padres', phonetic: '/ˈpeə.rənts/' },
    ],
  },
  {
    id: 'greetings',
    name: 'Saludos y Despedidas',
    emoji: '👋',
    stage: 'Básico (Sem. 1-4)',
    pairs: [
      { id: 'grt_hello', english: 'Hello', spanish: 'Hola', phonetic: '/heˈləʊ/' },
      { id: 'grt_goodbye', english: 'Goodbye', spanish: 'Adiós', phonetic: '/ɡʊdˈbaɪ/' },
      { id: 'grt_goodmorning', english: 'Good morning', spanish: 'Buenos días', phonetic: '/ɡʊd ˈmɔː.nɪŋ/' },
      { id: 'grt_goodnight', english: 'Good night', spanish: 'Buenas noches', phonetic: '/ɡʊd naɪt/' },
      { id: 'grt_please', english: 'Please', spanish: 'Por favor', phonetic: '/pliːz/' },
      { id: 'grt_thanks', english: 'Thank you', spanish: 'Gracias', phonetic: '/ˈθæŋk ˌjuː/' },
    ],
  },
  {
    id: 'pronouns',
    name: 'Pronombres Personales',
    emoji: '👤',
    stage: 'Básico (Sem. 1-4)',
    pairs: [
      { id: 'pro_i', english: 'I', spanish: 'Yo', phonetic: '/aɪ/' },
      { id: 'pro_you', english: 'You', spanish: 'Tú / Usted', phonetic: '/juː/' },
      { id: 'pro_he', english: 'He', spanish: 'Él', phonetic: '/hiː/' },
      { id: 'pro_she', english: 'She', spanish: 'Ella', phonetic: '/ʃiː/' },
      { id: 'pro_it', english: 'It', spanish: 'Eso / Ello', phonetic: '/ɪt/' },
      { id: 'pro_we', english: 'We', spanish: 'Nosotros', phonetic: '/wiː/' },
      { id: 'pro_they', english: 'They', spanish: 'Ellos', phonetic: '/ðeɪ/' },
    ],
  },

  // --- INTERMEDIO (Semana 5-10) ---
  {
    id: 'body',
    name: 'Partes del Cuerpo',
    emoji: '👁️',
    stage: 'Intermedio (Sem. 5-10)',
    pairs: [
      { id: 'bod_head', english: 'Head', spanish: 'Cabeza', phonetic: '/hed/' },
      { id: 'bod_hand', english: 'Hand', spanish: 'Mano', phonetic: '/hænd/' },
      { id: 'bod_foot', english: 'Foot', spanish: 'Pie', phonetic: '/fʊt/' },
      { id: 'bod_eye', english: 'Eye', spanish: 'Ojo', phonetic: '/aɪ/' },
      { id: 'bod_ear', english: 'Ear', spanish: 'Oreja', phonetic: '/ɪər/' },
      { id: 'bod_nose', english: 'Nose', spanish: 'Nariz', phonetic: '/nəʊz/' },
      { id: 'bod_mouth', english: 'Mouth', spanish: 'Boca', phonetic: '/maʊθ/' },
      { id: 'bod_arm', english: 'Arm', spanish: 'Brazo', phonetic: '/ɑːm/' },
      { id: 'bod_leg', english: 'Leg', spanish: 'Pierna', phonetic: '/leɡ/' },
    ],
  },
  {
    id: 'clothes',
    name: 'Ropa Básica',
    emoji: '👕',
    stage: 'Intermedio (Sem. 5-10)',
    pairs: [
      { id: 'clt_shirt', english: 'Shirt', spanish: 'Camisa', phonetic: '/ʃɜːt/' },
      { id: 'clt_pants', english: 'Pants', spanish: 'Pantalones', phonetic: '/pænts/' },
      { id: 'clt_shoes', english: 'Shoes', spanish: 'Zapatos', phonetic: '/ʃuːz/' },
      { id: 'clt_hat', english: 'Hat', spanish: 'Sombrero', phonetic: '/hæt/' },
      { id: 'clt_dress', english: 'Dress', spanish: 'Vestido', phonetic: '/dres/' },
      { id: 'clt_jacket', english: 'Jacket', spanish: 'Chaqueta', phonetic: '/ˈdʒæk.ɪt/' },
      { id: 'clt_socks', english: 'Socks', spanish: 'Calcetines', phonetic: '/sɒks/' },
    ],
  },
  {
    id: 'food',
    name: 'Comida y Bebida',
    emoji: '🍎',
    stage: 'Intermedio (Sem. 5-10)',
    pairs: [
      { id: 'fod_water', english: 'Water', spanish: 'Agua', phonetic: '/ˈwɔː.tər/' },
      { id: 'fod_bread', english: 'Bread', spanish: 'Pan', phonetic: '/bred/' },
      { id: 'fod_milk', english: 'Milk', spanish: 'Leche', phonetic: '/mɪlk/' },
      { id: 'fod_chicken', english: 'Chicken', spanish: 'Pollo', phonetic: '/ˈtʃɪk.ɪn/' },
      { id: 'fod_rice', english: 'Rice', spanish: 'Arroz', phonetic: '/raɪs/' },
      { id: 'fod_apple', english: 'Apple', spanish: 'Manzana', phonetic: '/ˈæp.əl/' },
      { id: 'fod_coffee', english: 'Coffee', spanish: 'Café', phonetic: '/ˈkɒf.i/' },
      { id: 'fod_egg', english: 'Egg', spanish: 'Huevo', phonetic: '/eɡ/' },
    ],
  },
  {
    id: 'animals',
    name: 'Animales Comunes',
    emoji: '🐶',
    stage: 'Intermedio (Sem. 5-10)',
    pairs: [
      { id: 'anm_dog', english: 'Dog', spanish: 'Perro', phonetic: '/dɒɡ/' },
      { id: 'anm_cat', english: 'Cat', spanish: 'Gato', phonetic: '/kæt/' },
      { id: 'anm_bird', english: 'Bird', spanish: 'Pájaro', phonetic: '/bɜːd/' },
      { id: 'anm_fish', english: 'Fish', spanish: 'Pez', phonetic: '/fɪʃ/' },
      { id: 'anm_horse', english: 'Horse', spanish: 'Caballo', phonetic: '/hɔːs/' },
      { id: 'anm_cow', english: 'Cow', spanish: 'Vaca', phonetic: '/kaʊ/' },
      { id: 'anm_lion', english: 'Lion', spanish: 'León', phonetic: '/ˈlaɪ.ən/' },
    ],
  },
  {
    id: 'house',
    name: 'Objetos de la Casa',
    emoji: '🏠',
    stage: 'Intermedio (Sem. 5-10)',
    pairs: [
      { id: 'hms_table', english: 'Table', spanish: 'Mesa', phonetic: '/ˈteɪ.bəl/' },
      { id: 'hms_chair', english: 'Chair', spanish: 'Silla', phonetic: '/tʃeər/' },
      { id: 'hms_bed', english: 'Bed', spanish: 'Cama', phonetic: '/bed/' },
      { id: 'hms_door', english: 'Door', spanish: 'Puerta', phonetic: '/dɔːr/' },
      { id: 'hms_window', english: 'Window', spanish: 'Ventana', phonetic: '/ˈwɪn.dəʊ/' },
      { id: 'hms_kitchen', english: 'Kitchen', spanish: 'Cocina', phonetic: '/ˈkɪtʃ.ən/' },
      { id: 'hms_lamp', english: 'Lamp', spanish: 'Lámpara', phonetic: '/læmp/' },
    ],
  },
  {
    id: 'professions',
    name: 'Profesiones Básicas',
    emoji: '💼',
    stage: 'Intermedio (Sem. 5-10)',
    pairs: [
      { id: 'prf_teacher', english: 'Teacher', spanish: 'Profesor/a', phonetic: '/ˈtiː.tʃər/' },
      { id: 'prf_doctor', english: 'Doctor', spanish: 'Médico/a', phonetic: '/ˈdɒk.tər/' },
      { id: 'prf_student', english: 'Student', spanish: 'Estudiante', phonetic: '/ˈstjuː.dənt/' },
      { id: 'prf_nurse', english: 'Nurse', spanish: 'Enfermero/a', phonetic: '/nɜːs/' },
      { id: 'prf_police', english: 'Police officer', spanish: 'Policía', phonetic: '/pəˈliːs/' },
      { id: 'prf_driver', english: 'Driver', spanish: 'Conductor/a', phonetic: '/ˈdraɪ.vər/' },
    ],
  },
  {
    id: 'city',
    name: 'Lugares de la Ciudad',
    emoji: '🏙️',
    stage: 'Intermedio (Sem. 5-10)',
    pairs: [
      { id: 'cty_school', english: 'School', spanish: 'Escuela', phonetic: '/skuːl/' },
      { id: 'cty_hospital', english: 'Hospital', spanish: 'Hospital', phonetic: '/ˈhɒs.pɪ.təl/' },
      { id: 'cty_park', english: 'Park', spanish: 'Parque', phonetic: '/pɑːk/' },
      { id: 'cty_store', english: 'Store', spanish: 'Tienda', phonetic: '/stɔːr/' },
      { id: 'cty_restaurant', english: 'Restaurant', spanish: 'Restaurante', phonetic: '/ˈres.trɒnt/' },
      { id: 'cty_bank', english: 'Bank', spanish: 'Banco', phonetic: '/bæŋk/' },
    ],
  },
  {
    id: 'weather',
    name: 'Clima y Tiempo',
    emoji: '☀️',
    stage: 'Intermedio (Sem. 5-10)',
    pairs: [
      { id: 'wth_sunny', english: 'Sunny', spanish: 'Soleado', phonetic: '/ˈsʌn.i/' },
      { id: 'wth_rainy', english: 'Rainy', spanish: 'Lluvioso', phonetic: '/ˈreɪ.ni/' },
      { id: 'wth_cloudy', english: 'Cloudy', spanish: 'Nublado', phonetic: '/ˈklaʊ.di/' },
      { id: 'wth_hot', english: 'Hot', spanish: 'Caliente / Caluroso', phonetic: '/hɒt/' },
      { id: 'wth_cold', english: 'Cold', spanish: 'Frío', phonetic: '/kəʊld/' },
      { id: 'wth_windy', english: 'Windy', spanish: 'Ventoso', phonetic: '/ˈwɪn.di/' },
    ],
  },

  // --- AVANZADO A1 (Semana 11-19) ---
  {
    id: 'verbs_routine',
    name: 'Verbos de Rutina Diaria',
    emoji: '⏰',
    stage: 'Avanzado (Sem. 11-19)',
    pairs: [
      { id: 'vrb_wake', english: 'Wake up', spanish: 'Despertarse', phonetic: '/weɪk ʌp/' },
      { id: 'vrb_eat', english: 'Eat', spanish: 'Comer', phonetic: '/iːt/' },
      { id: 'vrb_sleep', english: 'Sleep', spanish: 'Dormir', phonetic: '/sliːp/' },
      { id: 'vrb_work', english: 'Work', spanish: 'Trabajar', phonetic: '/wɜːk/' },
      { id: 'vrb_study', english: 'Study', spanish: 'Estudiar', phonetic: '/ˈstʌd.i/' },
      { id: 'vrb_read', english: 'Read', spanish: 'Leer', phonetic: '/riːd/' },
      { id: 'vrb_walk', english: 'Walk', spanish: 'Caminar', phonetic: '/wɔːk/' },
    ],
  },
  {
    id: 'transport',
    name: 'Transporte',
    emoji: '🚗',
    stage: 'Avanzado (Sem. 11-19)',
    pairs: [
      { id: 'trp_car', english: 'Car', spanish: 'Auto / Coche', phonetic: '/kɑːr/' },
      { id: 'trp_bus', english: 'Bus', spanish: 'Autobús', phonetic: '/bʌs/' },
      { id: 'trp_train', english: 'Train', spanish: 'Tren', phonetic: '/treɪn/' },
      { id: 'trp_airplane', english: 'Airplane', spanish: 'Avión', phonetic: '/ˈeə.pleɪn/' },
      { id: 'trp_bicycle', english: 'Bicycle', spanish: 'Bicicleta', phonetic: '/ˈbaɪ.sɪ.kəl/' },
      { id: 'trp_taxi', english: 'Taxi', spanish: 'Taxi', phonetic: '/ˈtæk.si/' },
    ],
  },
  {
    id: 'emotions',
    name: 'Emociones Básicas',
    emoji: '😊',
    stage: 'Avanzado (Sem. 11-19)',
    pairs: [
      { id: 'emt_happy', english: 'Happy', spanish: 'Feliz', phonetic: '/ˈhæp.i/' },
      { id: 'emt_sad', english: 'Sad', spanish: 'Triste', phonetic: '/sæd/' },
      { id: 'emt_angry', english: 'Angry', spanish: 'Enojado/a', phonetic: '/ˈæŋ.ɡri/' },
      { id: 'emt_tired', english: 'Tired', spanish: 'Cansado/a', phonetic: '/taɪəd/' },
      { id: 'emt_excited', english: 'Excited', spanish: 'Emocionado/a', phonetic: '/ɪkˈsaɪ.tɪd/' },
      { id: 'emt_nervous', english: 'Nervous', spanish: 'Nervioso/a', phonetic: '/ˈnɜː.vəs/' },
    ],
  },
  {
    id: 'prepositions',
    name: 'Preposiciones de Lugar',
    emoji: '📍',
    stage: 'Avanzado (Sem. 11-19)',
    pairs: [
      { id: 'prp_in', english: 'In', spanish: 'En / Dentro', phonetic: '/ɪn/' },
      { id: 'prp_on', english: 'On', spanish: 'Sobre / Encima', phonetic: '/ɒn/' },
      { id: 'prp_under', english: 'Under', spanish: 'Debajo', phonetic: '/ˈʌn.dər/' },
      { id: 'prp_next', english: 'Next to', spanish: 'Junto a', phonetic: '/nekst tuː/' },
      { id: 'prp_between', english: 'Between', spanish: 'Entre (dos)', phonetic: '/bɪˈtwiːn/' },
      { id: 'prp_behind', english: 'Behind', spanish: 'Detrás de', phonetic: '/bɪˈhaɪnd/' },
    ],
  },
  {
    id: 'connectors',
    name: 'Conectores Simples',
    emoji: '🔗',
    stage: 'Avanzado (Sem. 11-19)',
    pairs: [
      { id: 'con_and', english: 'And', spanish: 'Y', phonetic: '/ænd/' },
      { id: 'con_but', english: 'But', spanish: 'Pero', phonetic: '/bʌt/' },
      { id: 'con_or', english: 'Or', spanish: 'O', phonetic: '/ɔːr/' },
      { id: 'con_because', english: 'Because', spanish: 'Porque', phonetic: '/bɪˈkɒz/' },
      { id: 'con_so', english: 'So', spanish: 'Entonces / Así que', phonetic: '/səʊ/' },
    ],
  },
  {
    id: 'adjectives',
    name: 'Adjetivos Descriptivos',
    emoji: '✨',
    stage: 'Avanzado (Sem. 11-19)',
    pairs: [
      { id: 'adj_big', english: 'Big', spanish: 'Grande', phonetic: '/bɪɡ/' },
      { id: 'adj_small', english: 'Small', spanish: 'Pequeño/a', phonetic: '/smɔːl/' },
      { id: 'adj_tall', english: 'Tall', spanish: 'Alto/a', phonetic: '/tɔːl/' },
      { id: 'adj_short', english: 'Short', spanish: 'Bajo/a / Corto', phonetic: '/ʃɔːt/' },
      { id: 'adj_new', english: 'New', spanish: 'Nuevo/a', phonetic: '/njuː/' },
      { id: 'adj_old', english: 'Old', spanish: 'Viejo/a', phonetic: '/əʊld/' },
      { id: 'adj_good', english: 'Good', spanish: 'Bueno/a', phonetic: '/ɡʊd/' },
      { id: 'adj_bad', english: 'Bad', spanish: 'Malo/a', phonetic: '/bæd/' },
    ],
  },
  {
    id: 'times',
    name: 'Horas del Día',
    emoji: '🌅',
    stage: 'Avanzado (Sem. 11-19)',
    pairs: [
      { id: 'tim_morning', english: 'Morning', spanish: 'Mañana', phonetic: '/ˈmɔː.nɪŋ/' },
      { id: 'tim_afternoon', english: 'Afternoon', spanish: 'Tarde', phonetic: '/ˌɑːf.təˈnuːn/' },
      { id: 'tim_evening', english: 'Evening', spanish: 'Noche (atardecer)', phonetic: '/ˈiːv.nɪŋ/' },
      { id: 'tim_night', english: 'Night', spanish: 'Noche', phonetic: '/naɪt/' },
      { id: 'tim_noon', english: 'Noon', spanish: 'Mediodía', phonetic: '/nuːn/' },
      { id: 'tim_midnight', english: 'Midnight', spanish: 'Medianoche', phonetic: '/ˈmɪd.naɪt/' },
    ],
  },
  {
    id: 'seasons',
    name: 'Estaciones del Año',
    emoji: '🍂',
    stage: 'Avanzado (Sem. 11-19)',
    pairs: [
      { id: 'sea_spring', english: 'Spring', spanish: 'Primavera', phonetic: '/sprɪŋ/' },
      { id: 'sea_summer', english: 'Summer', spanish: 'Verano', phonetic: '/ˈsʌm.ər/' },
      { id: 'sea_fall', english: 'Fall / Autumn', spanish: 'Otoño', phonetic: '/fɔːl/' },
      { id: 'sea_winter', english: 'Winter', spanish: 'Invierno', phonetic: '/ˈwɪn.tər/' },
    ],
  },
  {
    id: 'school_supplies',
    name: 'Útiles Escolares',
    emoji: '📚',
    stage: 'Avanzado (Sem. 11-19)',
    pairs: [
      { id: 'sch_book', english: 'Book', spanish: 'Libro', phonetic: '/bʊk/' },
      { id: 'sch_pen', english: 'Pen', spanish: 'Bolígrafo', phonetic: '/pen/' },
      { id: 'sch_pencil', english: 'Pencil', spanish: 'Lápiz', phonetic: '/ˈpen.səl/' },
      { id: 'sch_paper', english: 'Paper', spanish: 'Papel', phonetic: '/ˈpeɪ.pər/' },
      { id: 'sch_notebook', english: 'Notebook', spanish: 'Cuaderno', phonetic: '/ˈnəʊt.bʊk/' },
      { id: 'sch_backpack', english: 'Backpack', spanish: 'Mochila', phonetic: '/ˈbæk.pæk/' },
    ],
  },
  {
    id: 'sports',
    name: 'Deportes y Actividades',
    emoji: '⚽',
    stage: 'Avanzado (Sem. 11-19)',
    pairs: [
      { id: 'spt_soccer', english: 'Soccer / Football', spanish: 'Fútbol', phonetic: '/ˈsɒk.ər/' },
      { id: 'spt_basketball', english: 'Basketball', spanish: 'Baloncesto', phonetic: '/ˈbɑː.skɪt.bɔːl/' },
      { id: 'spt_swimming', english: 'Swimming', spanish: 'Natación', phonetic: '/ˈswɪm.ɪŋ/' },
      { id: 'spt_running', english: 'Running', spanish: 'Correr', phonetic: '/ˈrʌn.ɪŋ/' },
      { id: 'spt_tennis', english: 'Tennis', spanish: 'Tenis', phonetic: '/ˈten.ɪs/' },
    ],
  },
]

/**
 * Baraja aleatoriamente un arreglo
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]
    const swapWith = copy[j]
    if (temp !== undefined && swapWith !== undefined) {
      copy[i] = swapWith
      copy[j] = temp
    }
  }
  return copy
}

/**
 * Obtiene pares barajados para la ronda:
 * - Si categoryId es 'srs_week', los genera dinámicamente de wordsPool del usuario.
 * - Si es una categoría fija, extrae los pares correspondientes.
 */
export function getCategoryPairs(
  categoryId: string,
  wordsPool: readonly VocabularyItem[],
  count = 6
): MatchingPair[] {
  if (categoryId === SRS_WEEK_CATEGORY_ID) {
    if (wordsPool.length === 0) {
      // Fallback a primera categoría
      const defCat = MATCHING_CATEGORIES[0]
      return defCat ? shuffleArray(defCat.pairs).slice(0, count) : []
    }
    const shuffled = shuffleArray(wordsPool).slice(0, count)
    return shuffled.map((item) => ({
      id: item.id,
      english: item.word,
      spanish: item.translation,
      ...(item.pronunciation ? { phonetic: item.pronunciation } : {}),
    }))
  }

  const found = MATCHING_CATEGORIES.find((c) => c.id === categoryId)
  if (!found) {
    const fallbackCat = MATCHING_CATEGORIES[0]
    return fallbackCat ? shuffleArray(fallbackCat.pairs).slice(0, count) : []
  }

  return shuffleArray(found.pairs).slice(0, count)
}
