export const LESSONS = [
  {
    id: 'set-eish5',
    name: 'E I S H 5',
    characters: ['E', 'I', 'S', 'H', '5'],
    description: 'Beginner dit-focused pattern group.',
  },
  {
    id: 'set-tmo0',
    name: 'T M O 0',
    characters: ['T', 'M', 'O', '0'],
    description: 'Dah-focused patterns.',
  },
  {
    id: 'set-an',
    name: 'A N',
    characters: ['A', 'N'],
    description: 'Simple mixed dit-dah patterns.',
  },
  {
    id: 'set-wj',
    name: 'W J',
    characters: ['W', 'J'],
    description: 'Longer mixed dit-dah patterns.',
  },
]

export function getLessonById(id) {
  return LESSONS.find(l => l.id === id) ?? null
}
