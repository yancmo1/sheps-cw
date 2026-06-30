const KOCH_SEQUENCE = [
  'K', 'M', 'R', 'S', 'U', 'A', 'P', 'T', 'L', 'O',
  'W', 'I', 'N', 'J', 'E', 'F', '0', 'Y', 'V', 'G',
  '5', 'Q', '9', 'Z', 'H', '3', '8', 'B', '4', '2',
  '7', 'C', '1', 'D', '6', 'X',
]

const KOCH_STEPS = [
  ['K', 'M'],
  ['K', 'M', 'R'],
  ['K', 'M', 'R', 'S'],
  ['K', 'M', 'R', 'S', 'U'],
  ['K', 'M', 'R', 'S', 'U', 'A'],
  ['K', 'M', 'R', 'S', 'U', 'A', 'P'],
  ['K', 'M', 'R', 'S', 'U', 'A', 'P', 'T'],
  ['K', 'M', 'R', 'S', 'U', 'A', 'P', 'T', 'L'],
  ['K', 'M', 'R', 'S', 'U', 'A', 'P', 'T', 'L', 'O'],
  KOCH_SEQUENCE.slice(0, 12),
  KOCH_SEQUENCE.slice(0, 18),
  KOCH_SEQUENCE.slice(0, 26),
  KOCH_SEQUENCE,
]

export const KOCH_LESSONS = KOCH_STEPS.map((characters, index) => {
  const step = index + 1
  const nextCharacter = KOCH_SEQUENCE[characters.length - 1]

  return {
    id: `koch-${String(step).padStart(2, '0')}`,
    name: `Koch ${step}: ${characters.slice(-2).join(' ')}`,
    family: 'koch',
    path: 'Koch Method',
    characters,
    description: step === 1
      ? 'Start with two full-speed characters and learn their rhythm by ear.'
      : `Adds ${nextCharacter} while continuing review of earlier Koch characters.`,
    recommendedWPM: 20,
    recommendedFarnsworth: 10,
  }
})
