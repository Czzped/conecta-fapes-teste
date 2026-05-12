import { createI18n } from 'vue-i18n'
import { translations, type Languages } from './translations'

export type Locale = Languages

const STORAGE_KEY = 'language'

function loadInitial(): Locale {
  const saved = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as Locale | null
  return saved && ['pt', 'en', 'es'].includes(saved) ? saved : 'pt'
}

export const i18n = createI18n({
  legacy: false,
  locale: loadInitial(),
  fallbackLocale: 'pt',
  messages: translations,
})

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, locale)
  }
}
