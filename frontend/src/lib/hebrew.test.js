// Hebrew is the one language translated in this repo rather than taken from the upstream
// dataset, so nothing upstream checks it: these tests guard the packs against drifting from
// the English they were translated from.
import { describe, it, expect } from 'vitest'
import { EXDB } from './exercises-data.js'
import he from '../locales/he.js'
import adminHe from '../locales/admin/he.js'
import instrHe from '../instr/he.js'
import namesHe from '../names/he.js'

const HEBREW = /[֐-׿]/
const placeholders = s => (s.match(/\{\d\}/g) || []).sort()

describe('Hebrew exercise packs', () => {
  it('name every exercise in the library, in Hebrew', () => {
    const missing = EXDB.filter(e => !HEBREW.test(namesHe[e.id] || ''))
    expect(missing.map(e => e.id)).toEqual([])
  })

  it('give every exercise its instructions, step for step', () => {
    const off = EXDB.filter(e => (instrHe[e.id] || []).length !== (e.st || []).length)
    expect(off.map(e => e.id)).toEqual([])
    const empty = EXDB.flatMap(e => (instrHe[e.id] || []).filter(s => !HEBREW.test(s)).map(() => e.id))
    expect(empty).toEqual([])
  })
})

describe('Hebrew UI strings', () => {
  // A singular key ("{0} workout") may spell its number out ("אימון אחד") — the code only
  // picks it for n === 1. Everywhere else a dropped or invented placeholder is a bug.
  const spelledOut = new Set(Object.keys(he).filter(k => /^\{0\} [a-z]+$/.test(k) || /\{0\} (set|exercise|change|suggestion|routine|day|workout)\b/.test(k)))

  it('keep every placeholder of the English key', () => {
    const bad = Object.entries({ ...he, ...adminHe })
      .filter(([k, v]) => !spelledOut.has(k) || placeholders(v).length)
      .filter(([k, v]) => placeholders(k).join() !== placeholders(v).join())
    expect(bad).toEqual([])
  })

  it('are actually Hebrew where the English has words to translate', () => {
    const untranslated = Object.entries(he).filter(([k, v]) => /[a-z]{3}/i.test(k.replace(/\{\d\}|RIR|RPE|1RM|PR|GreenBody|Greyskull LP|Epley|JSON|PDF|PPL|AI|km\/h/g, '')) && !HEBREW.test(v))
    expect(untranslated).toEqual([])
  })
})
