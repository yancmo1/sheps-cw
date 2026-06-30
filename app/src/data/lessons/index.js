import { BEGINNER_LESSONS } from './beginner.js'
import { KOCH_LESSONS } from './koch.js'
import { LICW_LESSONS } from './licw.js'
import { NUMBER_LESSONS } from './numbers.js'
import { REVIEW_LESSONS } from './review.js'

export const LESSONS = [
  ...BEGINNER_LESSONS,
  ...KOCH_LESSONS,
  ...LICW_LESSONS,
  ...NUMBER_LESSONS,
  ...REVIEW_LESSONS,
]

export function getLessonById(id) {
  return LESSONS.find(lesson => lesson.id === id) ?? null
}
