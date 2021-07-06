import { I18nManager } from 'react-native'
import { TFunctionResult } from 'i18next'

import en from '../../../assets/lang/en.json'

export const fallback = 'en'
export const defaultNamespace = 'common'
export const namespaces = ['common']

const rtlMarkerChar = '‏'
const ltrMarkerChar = '‎'
const directionChar = I18nManager.isRTL ? rtlMarkerChar : ltrMarkerChar

// For text that, under RTL languages, may start with LTR chars (or vice versa)
export const alignWithLanguage = (content: TFunctionResult | number) =>
  `${directionChar}${content}${directionChar}`

type Locales = Record<string, { name: string; display: string }>

// Force display names to line up as LTR in LTR langs and RTL in RTL langs
const alignDisplay = (originalLocales: Locales) =>
  Object.entries(originalLocales).reduce(
    (locales, [langCode, { name, display, ...translations }]) => ({
      ...locales,
      [langCode]: {
        name,
        display: alignWithLanguage(display),
        ...translations,
      },
    }),
    {} as Locales
  )

export const supportedLocales: Locales = alignDisplay({
  en: {
    name: 'English',
    display: '**English**',
    ...en,
  },
})

// TODO: Can be a factory (or in a hook) so won't have to create a new instance every time
export function formatNumber(stat: number | string, locale = 'en-IE') {
  switch (typeof stat) {
    case 'number':
      return new Intl.NumberFormat(locale).format(stat)
    case 'string':
      return stat
    default:
      return ''
  }
}
