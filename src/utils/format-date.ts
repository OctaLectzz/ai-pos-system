import { format, parseISO } from 'date-fns'
import { enUS, id } from 'date-fns/locale'

/**
 * Formats a Date object or ISO string based on the locale.
 * @param date - The Date object or ISO date string.
 * @param formatStr - The format pattern (date-fns style). Defaults to 'dd MMMM yyyy'.
 * @param localeCode - The current locale code ('id' or 'en'). Defaults to 'id'.
 * @returns Formatted date string.
 */
export function formatDate(date: Date | string, formatStr: string = 'dd MMMM yyyy', localeCode: 'id' | 'en' = 'id'): string {
  if (!date) {
    return ''
  }

  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  const selectedLocale = localeCode === 'id' ? id : enUS

  try {
    return format(parsedDate, formatStr, { locale: selectedLocale })
  } catch {
    return 'Invalid Date'
  }
}
