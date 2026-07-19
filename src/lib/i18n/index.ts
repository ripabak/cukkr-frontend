import { id } from './locales/id'
import { en } from './locales/en'

export type Language = 'id' | 'en'

export type SupportedLanguage = { value: Language; label: string; flag: string }

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { value: 'id', label: 'Indonesia', flag: '🇮🇩' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
]

type DeepRecord = { [key: string]: string | DeepRecord }

const locales: Record<Language, DeepRecord> = { id, en } as Record<Language, DeepRecord>

export function resolveKey(obj: DeepRecord, path: string): string | undefined {
  let current: DeepRecord | string | undefined = obj
  for (const key of path.split('.')) {
    if (!current || typeof current === 'string') return undefined
    current = current[key]
  }
  return typeof current === 'string' ? current : undefined
}

export function interpolate(str: string, params?: Record<string, string>): string {
  if (!params) return str
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`{${key}}`, value),
    str,
  )
}
