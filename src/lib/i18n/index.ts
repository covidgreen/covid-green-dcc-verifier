import i18n, { LanguageDetectorAsyncModule } from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import { format as F } from 'date-fns'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  fallback,
  defaultNamespace,
  namespaces,
  supportedLocales,
} from './common'

export const getDeviceLanguage = () => {
  const lang = Localization.locale.split('-')[0].replace('-', '')
  return Object.keys(supportedLocales).includes(lang) ? lang : fallback
}

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    const appLanguage = await AsyncStorage.getItem('idv.language')
    if (appLanguage) {
      return callback(appLanguage)
    }

    console.log(Localization.locale)
    callback(getDeviceLanguage())
  },
  init: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  cacheUserLanguage: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
}

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: fallback,
    resources: supportedLocales,
    ns: namespaces,
    defaultNS: defaultNamespace,
    debug: false,
    interpolation: {
      escapeValue: false,
      format: (value, format) => {
        if (value instanceof Date) {
          return F(value, format || '')
        }
        return value
      },
    },
  })

export default i18n
