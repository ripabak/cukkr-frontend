import { useCallback, useState } from 'react'
import { useI18nContext } from './provider'
import type { Language } from './index'
import { updateLanguage } from '@/src/services/language.service'

export function useI18n() {
  const { t, language } = useI18nContext()
  const [isChanging, setIsChanging] = useState(false)

  const setLanguage = useCallback(async (newLanguage: Language) => {
    setIsChanging(true)
    try {
      await updateLanguage(newLanguage)
    } finally {
      setIsChanging(false)
    }
  }, [])

  return { t, language, setLanguage, isChanging }
}
