import { BEGINNER_LESSONS } from './beginner.js'
import { KOCH_LESSONS } from './koch.js'
import { LICW_LESSONS } from './licw.js'
import { NUMBER_LESSONS } from './numbers.js'
import { REVIEW_LESSONS } from './review.js'
import { PROSIGN_LESSONS } from './prosigns.js'
import { COMMON_LESSONS } from './common.js'
import { ABBREVIATIONS_LESSONS } from './abbreviations.js'
import { CONFUSING_PAIRS_LESSONS } from './confusing-pairs.js'

export const LESSONS = [
  ...BEGINNER_LESSONS,
  ...KOCH_LESSONS,
  ...LICW_LESSONS,
  ...NUMBER_LESSONS,
  ...REVIEW_LESSONS,
  ...PROSIGN_LESSONS,
  ...COMMON_LESSONS,
  ...ABBREVIATIONS_LESSONS,
  ...CONFUSING_PAIRS_LESSONS,
]

export function getLessonById(id) {
  return LESSONS.find(lesson => lesson.id === id) ?? null
}
