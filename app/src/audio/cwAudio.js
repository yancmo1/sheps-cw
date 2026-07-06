import { encodeCharacter } from '../core/codec/charsetCodec.js'
import { getMorseUnitSeconds } from '../core/morseTiming.js'

export { getMorseUnitSeconds, getPostCharacterDelayMs } from '../core/morseTiming.js'

let audioCtx = null
let sidetoneOsc = null
let sidetoneGain = null

function getContext() {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value))
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function pickFrequencyWithJitter(baseFrequency, jitter = 0) {
  const amount = Math.max(0, Number(jitter) || 0)
  if (amount <= 0) return baseFrequency
  const offset = (Math.random() * 2 - 1) * amount
  return baseFrequency + offset
}

export async function startSidetone({ frequency = 600, volume = 80, attackMs = 5, decayMs = 5 } = {}) {
  if (sidetoneOsc) return

  const ctx = getContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }

  const gainLevel = clamp01(volume / 100)
  const now = ctx.currentTime

  sidetoneGain = ctx.createGain()
  sidetoneGain.gain.setValueAtTime(0, now)
  sidetoneGain.gain.linearRampToValueAtTime(gainLevel, now + clamp((attackMs || 0) / 1000, 0, 0.05))
  sidetoneGain.connect(ctx.destination)

  sidetoneOsc = ctx.createOscillator()
  sidetoneOsc.type = 'sine'
  sidetoneOsc.frequency.setValueAtTime(frequency, now)
  sidetoneOsc.connect(sidetoneGain)
  sidetoneOsc.start(now)
}

export function stopSidetone() {
  if (!sidetoneOsc) return

  const ctx = getContext()
  const now = ctx.currentTime
  sidetoneGain?.gain.cancelScheduledValues(now)
  sidetoneGain?.gain.setValueAtTime(sidetoneGain.gain.value, now)
  sidetoneGain?.gain.linearRampToValueAtTime(0, now + 0.01)

  sidetoneOsc.stop(now + 0.012)
  sidetoneOsc.onended = () => {
    sidetoneOsc?.disconnect()
    sidetoneGain?.disconnect()
    sidetoneOsc = null
    sidetoneGain = null
  }
}

/**
 * Play a single Morse character using the Web Audio API.
 *
 * @param {string} char - The character to play, e.g. 'A'.
 * @param {object} settings - Playback settings.
 * @param {number} settings.wpm - Character speed in words per minute.
 * @param {number} settings.frequency - Tone frequency in Hz.
 * @param {number} settings.volume - Volume as a percentage (0–100).
 * @returns {Promise<void>} Resolves when playback is complete.
 */
export async function playCharacter(
  char,
  {
    wpm = 20,
    frequency = 600,
    volume = 80,
    attackMs = 5,
    decayMs = 5,
    frequencyJitter = 0,
  } = {}
) {
  const pattern = encodeCharacter(char)
  if (!pattern) return

  const ctx = getContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }

  const gainLevel = clamp01(volume / 100)
  const unit = getMorseUnitSeconds(wpm)
  // Envelope ramps to prevent clicks, user-adjustable but bounded by element duration
  const attack = clamp((attackMs || 0) / 1000, 0, 0.05)
  const decay = clamp((decayMs || 0) / 1000, 0, 0.05)
  const toneFrequency = pickFrequencyWithJitter(frequency, frequencyJitter)

  const gainNode = ctx.createGain()
  gainNode.gain.setValueAtTime(0, ctx.currentTime)
  gainNode.connect(ctx.destination)

  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(toneFrequency, ctx.currentTime)
  osc.connect(gainNode)

  // Small lead-in so the first scheduled event is never in the past
  let t = ctx.currentTime + 0.03

  for (let i = 0; i < pattern.length; i++) {
    const elDuration = pattern[i] === '-' ? 3 * unit : unit
    const attackRamp = Math.min(attack, elDuration * 0.4)
    const decayRamp = Math.min(decay, elDuration * 0.4)
    const holdUntil = Math.max(t + attackRamp + 0.001, t + elDuration - decayRamp)

    gainNode.gain.setValueAtTime(0, t)
    gainNode.gain.linearRampToValueAtTime(gainLevel, t + attackRamp)
    gainNode.gain.setValueAtTime(gainLevel, holdUntil)
    gainNode.gain.linearRampToValueAtTime(0, t + elDuration)

    t += elDuration

    // Inter-element gap (1 unit) between elements of the same character
    if (i < pattern.length - 1) {
      t += unit
    }
  }

  // Ensure gain is zero after the final element
  gainNode.gain.setValueAtTime(0, t)

  osc.start(ctx.currentTime)
  osc.stop(t + 0.05)

  return new Promise(resolve => {
    osc.onended = () => {
      gainNode.disconnect()
      resolve()
    }
  })
}
