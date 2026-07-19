import { authClient } from '@/src/lib/auth-client'
import type { Language } from '@/src/lib/i18n'

export async function updateLanguage(language: Language): Promise<void> {
  const { error } = await authClient.updateUser({ language })
  if (error) throw new Error(error.message || 'Failed to update language')
}
