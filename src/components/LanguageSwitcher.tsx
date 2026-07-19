import { AppText } from '@/src/components/AppText'
import { useI18n } from '@/src/lib/i18n/hooks'
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n'
import { Colors } from '@/src/theme/colors'
import { useToast } from '@/src/lib/providers/toast'
import { getErrorMessage } from '@/src/lib/utils/error-handler'
import { Ionicons } from '@expo/vector-icons'
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
      {SUPPORTED_LANGUAGES.map((lang, index) => {
        const isSelected = language === lang.value
        const isLoading = changingLang === lang.value
        const isLast = index === SUPPORTED_LANGUAGES.length - 1
        return (
          <Pressable
            key={lang.value}
            style={[styles.option, !isLast && styles.borderBottom]}
            onPress={() => handleChange(lang.value)}
            disabled={isLoading}
          >
            <View style={styles.rowContent}>
              <AppText style={styles.flag}>{lang.flag}</AppText>
              <AppText
                style={[
                  styles.label,
                  isSelected && styles.labelSelected,
                ]}
              >
                {lang.label}
              </AppText>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.text.primary} />
              ) : isSelected ? (
                <Ionicons name="checkmark-circle" size={20} color={Colors.brand.primary} />
              ) : null}
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  option: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flag: {
    fontSize: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
    flex: 1,
  },
  labelSelected: {
    color: Colors.brand.primaryDark,
  },
})
