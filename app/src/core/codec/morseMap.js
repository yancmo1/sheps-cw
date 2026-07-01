// Standard ITU Morse code patterns. Dots and dashes only.
export const MORSE = {
  A: '.-',   B: '-...', C: '-.-.', D: '-..',  E: '.',
  F: '..-.', G: '--.',  H: '....', I: '..',   J: '.---',
  K: '-.-',  L: '.-..', M: '--',   N: '-.',   O: '---',
  P: '.--.', Q: '--.-', R: '.-.',  S: '...',  T: '-',
  U: '..-',  V: '...-', W: '.--',  X: '-..-', Y: '-.--',
  Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.',
  // Prosigns (procedural signals) — presented as multi-character units
  AR: '.-.-.',   // End of message
  SK: '...-.-',  // End of contact
  BT: '-...-',   // Break/separator
  AS: '.-...',   // Wait
  KN: '-.--.-',  // Invite to transmit
  CA: '-.-.-',   // Starting signal
  SOS: '...---...', // Distress
}
