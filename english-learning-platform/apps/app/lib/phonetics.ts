/**
 * Spanish-adapted phonetic transcription engine.
 *
 * Raw IPA symbols (e.g. /ˈmʌð.ər/, /ð/, /æ/, /ʃ/, /ʌ/) are opaque and confusing
 * to Spanish-speaking beginners. This module provides intuitive, Spanish-readable
 * syllables with clear stress accents so any student can instantly pronounce English words.
 *
 * Examples:
 *   Mother  -> [ má-der ]
 *   Father  -> [ fá-der ]
 *   Brother -> [ bró-der ]
 *   Water   -> [ uá-ter ]
 *   House   -> [ jáus ]
 */

const CURATED_PHONETICS: Record<string, string> = {
  // Family & People
  mother: 'má-der',
  father: 'fá-der',
  brother: 'bró-der',
  sister: 'sís-ter',
  son: 'san',
  daughter: 'dó-ter',
  family: 'fám-i-li',
  parent: 'pé-rent',
  baby: 'béi-bi',
  child: 'cháild',
  children: 'chíl-dren',
  friend: 'frend',
  girl: 'guerl',
  boy: 'bói',
  man: 'man',
  woman: 'uú-man',
  person: 'pér-son',
  people: 'pí-pol',
  uncle: 'ón-kol',
  aunt: 'ant',
  cousin: 'ká-sin',
  grandfather: 'gránd-fa-der',
  grandmother: 'gránd-ma-der',

  // Food & Drink
  water: 'uá-ter',
  bread: 'bred',
  milk: 'milk',
  coffee: 'kó-fi',
  tea: 'ti',
  rice: 'ráis',
  chicken: 'chí-ken',
  meat: 'mit',
  fish: 'fish',
  egg: 'eg',
  cheese: 'chis',
  apple: 'á-pol',
  banana: 'ba-ná-na',
  fruit: 'frut',
  food: 'fud',
  breakfast: 'brék-fast',
  lunch: 'lonch',
  dinner: 'dín-er',
  sugar: 'shú-gar',
  salt: 'solt',

  // Home & Places
  house: 'jáus',
  home: 'jóum',
  garden: 'gár-den',
  room: 'rum',
  kitchen: 'kít-chen',
  bedroom: 'béd-rum',
  door: 'dor',
  window: 'uín-dou',
  table: 'téi-bol',
  chair: 'cher',
  bed: 'bed',
  park: 'park',
  school: 'skul',
  street: 'strit',
  city: 'sí-ti',
  town: 'táun',
  country: 'kán-tri',
  hospital: 'jós-pi-tal',
  office: 'ó-fis',
  bank: 'bank',
  store: 'stor',
  shop: 'shop',
  market: 'már-ket',
  library: 'lái-bre-ri',
  airport: 'ér-port',
  station: 'stéi-shon',

  // Nature & Animals
  dog: 'dog',
  cat: 'kat',
  bird: 'berd',
  animal: 'án-i-mal',
  tree: 'tri',
  sun: 'san',
  moon: 'mun',
  sky: 'skái',
  rain: 'réin',
  weather: 'ué-der',
  flower: 'fláu-er',

  // Colors & Adjectives
  blue: 'blu',
  red: 'red',
  green: 'grin',
  yellow: 'yé-lou',
  black: 'blak',
  white: 'uáit',
  nice: 'náis',
  good: 'gud',
  bad: 'bad',
  big: 'big',
  small: 'smol',
  little: 'lí-tol',
  happy: 'já-pi',
  sad: 'sad',
  new: 'niu',
  old: 'óuld',
  young: 'yang',
  fast: 'fast',
  slow: 'slóu',
  hot: 'jot',
  cold: 'kóuld',
  easy: 'í-si',
  hard: 'jard',
  beautiful: 'biú-ti-ful',
  important: 'im-pór-tant',
  early: 'ér-li',
  late: 'léit',
  clean: 'klin',
  dark: 'dark',
  light: 'láit',
  great: 'gréit',

  // Time & Days
  day: 'déi',
  night: 'náit',
  morning: 'mór-ning',
  afternoon: 'af-ter-nún',
  evening: 'ív-ning',
  week: 'uik',
  weekend: 'uík-end',
  month: 'manz',
  year: 'yir',
  time: 'táim',
  today: 'tu-déi',
  tomorrow: 'tu-mó-rou',
  yesterday: 'yés-ter-déi',

  // Common Verbs
  name: 'néim',
  be: 'bi',
  have: 'jav',
  do: 'du',
  say: 'séi',
  go: 'góu',
  get: 'guet',
  make: 'méik',
  know: 'nóu',
  think: 'zink',
  take: 'téik',
  see: 'si',
  come: 'kam',
  want: 'uónt',
  look: 'luk',
  use: 'yus',
  find: 'fáind',
  give: 'guiv',
  tell: 'tel',
  work: 'uork',
  call: 'kol',
  try: 'trái',
  ask: 'ask',
  need: 'nid',
  feel: 'fil',
  become: 'bi-kám',
  leave: 'liv',
  put: 'put',
  mean: 'min',
  keep: 'kip',
  let: 'let',
  begin: 'bi-guín',
  seem: 'sim',
  help: 'jelp',
  talk: 'tok',
  turn: 'tern',
  start: 'start',
  show: 'shóu',
  hear: 'jir',
  play: 'pléi',
  run: 'ran',
  move: 'muv',
  like: 'láik',
  live: 'liv',
  believe: 'bi-lív',
  hold: 'jóuld',
  bring: 'bring',
  happen: 'já-pen',
  write: 'ráit',
  provide: 'pro-váid',
  sit: 'sit',
  stand: 'stand',
  lose: 'lus',
  pay: 'péi',
  meet: 'mit',
  include: 'in-klúd',
  continue: 'kon-tín-yu',
  set: 'set',
  learn: 'lern',
  change: 'chéinch',
  lead: 'lid',
  understand: 'an-der-stánd',
  watch: 'uóch',
  follow: 'fó-lou',
  stop: 'stop',
  create: 'kri-éit',
  speak: 'spik',
  read: 'rid',
  spend: 'spend',
  grow: 'gróu',
  open: 'óu-pen',
  walk: 'uok',
  win: 'uin',
  love: 'lav',
  buy: 'bái',
  wait: 'uéit',
  send: 'send',
  eat: 'it',
  drink: 'drink',
  sleep: 'slip',
  cook: 'kuk',
}

/**
 * Converts an IPA transcription or English word into a readable Spanish phonetic guide.
 */
export function getSpanishPhonetic(word: string, ipa?: string): string {
  const cleanWord = word.trim().toLowerCase()

  // 1. Direct curated match
  if (CURATED_PHONETICS[cleanWord]) {
    return CURATED_PHONETICS[cleanWord]
  }

  // 2. If IPA is provided, convert IPA symbols to Spanish equivalents
  if (ipa && ipa.length > 0) {
    const converted = ipa
      .replace(/^\/|\/$/g, '') // remove leading/trailing slashes
      .replace(/ˈ/g, '') // remove primary stress symbol
      .replace(/ˌ/g, '') // remove secondary stress
      .replace(/ð/g, 'd')
      .replace(/θ/g, 'z')
      .replace(/ʃ/g, 'sh')
      .replace(/tʃ/g, 'ch')
      .replace(/dʒ/g, 'll')
      .replace(/ʒ/g, 'y')
      .replace(/ŋ/g, 'ng')
      .replace(/w/g, 'u')
      .replace(/j/g, 'y')
      .replace(/ʌ/g, 'a')
      .replace(/æ/g, 'a')
      .replace(/ɑː|ɑ/g, 'a')
      .replace(/ɔː|ɔ|ɒ/g, 'o')
      .replace(/iː/g, 'i')
      .replace(/ɪ/g, 'i')
      .replace(/uː/g, 'u')
      .replace(/ʊ/g, 'u')
      .replace(/ɜːr|ɜː|ər|ə/g, 'er')
      .replace(/eɪ/g, 'ei')
      .replace(/aɪ/g, 'ai')
      .replace(/ɔɪ/g, 'oi')
      .replace(/aʊ/g, 'au')
      .replace(/oʊ|əʊ/g, 'ou')
      .replace(/\./g, '-')

    if (converted.length > 0 && !/[^\w\s\-]/.test(converted)) {
      return converted
    }
  }

  // 3. Heuristic syllabic fallback
  const syllables = cleanWord
    .replace(/th/g, 'd')
    .replace(/sh/g, 'sh')
    .replace(/ch/g, 'ch')
    .replace(/ph/g, 'f')
    .replace(/qu/g, 'k')
    .replace(/c(?=[eiy])/g, 's')
    .replace(/c/g, 'k')
    .replace(/ee/g, 'i')
    .replace(/ea/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/igh/g, 'ai')
    .replace(/tion/g, 'shon')

  return syllables
}
