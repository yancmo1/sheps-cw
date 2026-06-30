import { MORSE } from '../src/data/morseCharacters.js'
import { BEGINNER_LESSONS } from '../src/data/lessons/beginner.js'
import { KOCH_LESSONS } from '../src/data/lessons/koch.js'
import { LICW_LESSONS } from '../src/data/lessons/licw.js'
import { NUMBER_LESSONS } from '../src/data/lessons/numbers.js'
import { REVIEW_LESSONS } from '../src/data/lessons/review.js'
import { LESSONS } from '../src/data/lessons/index.js'

const LESSON_GROUPS = {
  beginner: BEGINNER_LESSONS,
  koch: KOCH_LESSONS,
  licw: LICW_LESSONS,
  numbers: NUMBER_LESSONS,
  review: REVIEW_LESSONS,
}

const REQUIRED_STRING_FIELDS = ['id', 'name', 'family', 'path', 'description']
const REQUIRED_NUMERIC_FIELDS = ['recommendedWPM', 'recommendedFarnsworth']

function fail(message) {
  throw new Error(message)
}

function validateLessonShape(lesson, expectedFamily) {
  if (!lesson || typeof lesson !== 'object' || Array.isArray(lesson)) {
    fail(`Lesson in family "${expectedFamily}" must be an object.`)
  }

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof lesson[field] !== 'string' || lesson[field].trim() === '') {
      fail(`Lesson "${lesson?.id ?? 'unknown'}" is missing a valid "${field}" string.`)
    }
  }

  for (const field of REQUIRED_NUMERIC_FIELDS) {
    if (!Number.isFinite(lesson[field]) || lesson[field] <= 0) {
      fail(`Lesson "${lesson.id}" is missing a valid positive "${field}" number.`)
    }
  }

  if (lesson.family !== expectedFamily) {
    fail(`Lesson "${lesson.id}" has family "${lesson.family}" but is stored in "${expectedFamily}.js".`)
  }

  if (!Array.isArray(lesson.characters) || lesson.characters.length === 0) {
    fail(`Lesson "${lesson.id}" must define a non-empty "characters" array.`)
  }

  for (const character of lesson.characters) {
    if (typeof character !== 'string' || character.trim() === '') {
      fail(`Lesson "${lesson.id}" contains an invalid character entry.`)
    }
    if (!MORSE[character]) {
      fail(`Lesson "${lesson.id}" references character "${character}" without a Morse mapping.`)
    }
  }
}

function validateGroups() {
  const ids = new Set()
  const orderedLessons = []

  for (const [family, lessons] of Object.entries(LESSON_GROUPS)) {
    if (!Array.isArray(lessons)) {
      fail(`Lesson family "${family}" must export an array.`)
    }

    for (const lesson of lessons) {
      validateLessonShape(lesson, family)

      if (ids.has(lesson.id)) {
        fail(`Duplicate lesson id detected: "${lesson.id}".`)
      }
      ids.add(lesson.id)
      orderedLessons.push(lesson)
    }
  }

  if (LESSONS.length !== orderedLessons.length) {
    fail(`LESSONS index length mismatch: expected ${orderedLessons.length}, received ${LESSONS.length}.`)
  }

  for (let index = 0; index < orderedLessons.length; index += 1) {
    if (LESSONS[index]?.id !== orderedLessons[index]?.id) {
      fail(
        `LESSONS index order mismatch at position ${index}: `
        + `expected "${orderedLessons[index]?.id}", received "${LESSONS[index]?.id}".`
      )
    }
  }
}

validateGroups()
console.log(`Validated ${LESSONS.length} lessons across ${Object.keys(LESSON_GROUPS).length} families.`)
