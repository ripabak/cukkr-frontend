import React, { createContext, useContext, useCallback, useMemo } from 'react'
import { id } from './locales/id'
import { en } from './locales/en'
import type { Language } from './index'
import { resolveKey, interpolate } from './index'

type DeepRecord = { [key: string]: string | DeepRecord }

const locales: Record<Language, DeepRecord> = { id, en } as Record<Language, DeepRecord>

interface I18nContextValue {
  t: (key: string, params?: Record<string, string>) => string
  language: Language
}

const I18nContext = createContext<I18nContextValue>({
  t: (key: string) => key,
  language: 'id',
})

export function useI18nContext() {
  return useContext(I18nContext)
}

interface I18nProviderProps {
  language: Language
  children: React.ReactNode
}

export function I18nProvider({ language, children }: I18nProviderProps) {
  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      const locale = locales[language]
      let value = resolveKey(locale, key)

      if (value === undefined && language !== 'id') {
        const idLocale = locales.id
        value = resolveKey(idLocale, key)
      }

      if (value === undefined) return key

      return interpolate(value, params)
    },
    [language],
  )

  const value = useMemo(() => ({ t, language }), [t, language])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
