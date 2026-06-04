import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale
  }

  let messages = {}

  try {
    const common = (await import(`../../messages/${locale}/common.json`)).default
    const auth = (await import(`../../messages/${locale}/auth.json`)).default
    const dashboard = (await import(`../../messages/${locale}/dashboard.json`)).default
    const categories = (await import(`../../messages/${locale}/categories.json`)).default
    const products = (await import(`../../messages/${locale}/products.json`)).default

    messages = {
      ...common, // Spread common at the root so app.name and common.success work
      auth,
      dashboard,
      categories,
      products
    }
  } catch (error) {
    console.error('Failed to load messages for locale:', locale, error)
  }

  return {
    locale,
    messages
  }
})
