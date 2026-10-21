// Tiny dependency-free i18n. English source strings are the keys; locale files in
// src/locales/ map them to translations and are lazy-loaded (Vite code-splits each
// import.meta.glob entry), so the initial bundle stays English-only.
// Exercise instructions come from separately generated packs in src/instr/ (one per
// language, from the upstream dataset) — also lazy-loaded on language switch. Hebrew is
// not in the upstream dataset; its instruction pack and its exercise-name pack
// (src/names/) are translated in this repo.
import { useSyncExternalStore } from 'react'

// UI languages. de/pt have no instruction pack upstream — instructions fall back to English.
export const LANGS = {
  he: 'עברית', en: 'English', de: 'Deutsch', es: 'Español', fr: 'Français', it: 'Italiano',
  pt: 'Português', pl: 'Polski', tr: 'Türkçe', ru: 'Русский', zh: '中文',
  ko: '한국어', hi: 'हिन्दी'
}
export const INSTR_LANGS = ['he', 'en', 'es', 'fr', 'it', 'tr', 'ru', 'zh', 'hi', 'pl', 'ko']
// The language a fresh profile starts in (GreenBody is a Hebrew-first app).
export const DEFAULT_LANG = 'he'
// Scripts written right-to-left: the whole document flips (see index.css).
const RTL_LANGS = ['he']
// First day of the week on calendars and week strips: Sunday in Israel, Monday elsewhere.
const WEEK_START = { he: 0 }
const DATE_LOCALES = {
  he: 'he-IL', en: 'en-GB', de: 'de-DE', es: 'es-ES', fr: 'fr-FR', it: 'it-IT', pt: 'pt-PT',
  pl: 'pl-PL', tr: 'tr-TR', ru: 'ru-RU', zh: 'zh-CN', ko: 'ko-KR', hi: 'hi-IN'
}

const localePacks = import.meta.glob('../locales/*.js')
const instrPacks = import.meta.glob('../instr/*.js')
const namePacks = import.meta.glob('../names/*.js')
// Optional admin-dashboard strings (see views/Admin.jsx) — only some languages have them.
const adminPacks = import.meta.glob('../locales/admin/*.js')

let lang = 'en'
let dict = {}
let instr = null            // { exId: [steps] } for the current language, null = English
let names = null            // { exId: name } for the current language, null = English
let version = 0
const subs = new Set()
const notify = () => { version++; subs.forEach(f => f()) }

export const getLang = () => lang
export const isRTL = (l = lang) => RTL_LANGS.includes(l)
export const weekStart = () => WEEK_START[lang] ?? 1
export const dateLocale = () => DATE_LOCALES[lang] || 'en-GB'

// Translate a source string; {0},{1}… are replaced with args (also on the English fallback).
export function t(s, ...args) {
  let v = dict[s] || s
  for (let i = 0; i < args.length; i++) v = v.replaceAll('{' + i + '}', args[i])
  return v
}
// Instructions for an exercise in the current language (English steps as fallback).
export const instrFor = ex => (instr && instr[ex.id]) || ex.st || []
// Display name of an exercise in the current language. Only built-in exercises have a
// translation; custom ones keep the name their owner typed. Matching and storage keep
// using ex.n, so a backup or a FitNotes import still lines up in every language.
export const nameFor = ex => (ex && names && names[ex.id]) || (ex && ex.n) || ''

export async function setLang(l) {
  if (!LANGS[l]) l = DEFAULT_LANG
  if (l === lang && version > 0) return
  lang = l
  let d = {}, ins = null, nm = null
  try {
    d = l === 'en' ? {} : (await localePacks['../locales/' + l + '.js']()).default
    ins = l === 'en' || !INSTR_LANGS.includes(l) ? null : (await instrPacks['../instr/' + l + '.js']()).default
    const np = namePacks['../names/' + l + '.js']
    nm = np ? (await np()).default : null
    const ap = adminPacks['../locales/admin/' + l + '.js']
    if (ap) d = { ...(await ap()).default, ...d }   // the end-user pack wins on any shared key
  } catch (e) { d = {}; ins = null; nm = null }
  // A fast double switch can resolve out of order — only the latest choice may apply.
  if (l !== lang) return
  dict = d; instr = ins; names = nm
  if (typeof document !== 'undefined') {
    document.documentElement.lang = l
    document.documentElement.dir = isRTL(l) ? 'rtl' : 'ltr'
  }
  notify()
}

// Re-renders the subscribing component (and its children) whenever the language changes.
export function useLang() {
  return useSyncExternalStore(fn => { subs.add(fn); return () => subs.delete(fn) }, () => version)
}
