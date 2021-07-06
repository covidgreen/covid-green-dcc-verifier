import { Locale } from 'date-fns'
import enGB from 'date-fns/locale/en-GB'

interface I18n {
  language: string
}

export interface DateLocaleOptions {
  locale: Locale
}

const fallback = enGB

export const dateFnsLocales = {
  en: enGB,
} as Record<string, Locale>

export const getDateLocaleOptions = (i18n: I18n): DateLocaleOptions => {
  const locale: Locale = dateFnsLocales[i18n.language] || fallback
  return { locale }
}
