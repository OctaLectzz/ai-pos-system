export const APP_NAME = 'NexPOS'

export const DEFAULT_LOCALE = 'id'
export const LOCALES = ['id', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const COOKIE_KEYS = {
  THEME: 'theme',
  LOCALE: 'locale'
} as const

export const LOCAL_STORAGE_KEYS = {
  THEME: 'theme'
} as const
