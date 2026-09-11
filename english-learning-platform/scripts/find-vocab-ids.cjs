const fs = require('fs')
const path = require('path')

const a1Dir = path.join(__dirname, '../packages/content/src/a1')
const files = fs.readdirSync(a1Dir).filter((f) => f.startsWith('week-'))

const vocab = []
for (const file of files) {
  const text = fs.readFileSync(path.join(a1Dir, file), 'utf8')
  const regex = /id:\s*'([^']+)',\s*word:\s*'([^']+)'/g
  let m
  while ((m = regex.exec(text)) !== null) {
    vocab.push({ id: m[1], word: m[2] })
  }
}

const words = [
  'mother',
  'father',
  'brother',
  'family',
  'house',
  'garden',
  'milk',
  'bread',
  'school',
  'blue',
  'chicken',
  'rice',
  'weekend',
  'dog',
  'park',
  'sunny',
  'morning',
  'street',
  'bakery',
  'coffee',
  'doctor',
  'hospital',
  'bus',
  'library',
  'nature',
  'saturday',
  'sister',
  'supermarket',
  'dinner',
  'apple',
  'banana',
  'cheese',
  'pasta',
  'cashier',
  'cash',
  'apartment',
]

for (const w of words) {
  const found = vocab.find((v) => v.word.toLowerCase().includes(w))
  if (found) {
    console.log(`${w} -> ${found.id} ("${found.word}")`)
  } else {
    console.log(`${w} -> NOT FOUND`)
  }
}
