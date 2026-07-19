import { AppText } from '@/src/components/AppText'
import { useI18n } from '@/src/lib/i18n/hooks'
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n'
import { Colors } from '@/src/theme/colors'
import { useToast } from '@/src/lib/providers/toast'
import { getErrorMessage } from '@/src/lib/utils/error-handler'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

export function LanguageSwitcher() {
  const { t, language, setLanguage } = useI18n()
  const toast = useToast()
  const [changingLang, setChangingLang] = useState<typeof language | null>(null)

  const handleChange = useCallback(
    async (newLanguage: typeof language) => {
      if (newLanguage === language) return
      setChangingLang(newLanguage)
      try {
        await setLanguage(newLanguage)
        toast.success(t('toast.languageChanged'))
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setChangingLang(null)
      }
    },
    [language, setLanguage, toast, t],
  )

  return (
    <View style={styles.container}>
      {SUPPORTED_LANGUAGES.map((lang) => {
        const isSelected = language === lang.value
        const isLoading = changingLang === lang.value
        return (
          <Pressable
            key={lang.value}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => handleChange(lang.value)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.text.primary} />
            ) : (
              <AppText
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {lang.label}
              </AppText>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: Colors.brand.primarySurface,
    borderColor: Colors.brand.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  optionTextSelected: {
    color: Colors.brand.primaryDark,
  },
})
