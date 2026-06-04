import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  // Load the default common translation dictionary
  const messages = (await import(`../../messages/${locale}/common.json`)).default

  return {
    locale,
    messages
  }
})
