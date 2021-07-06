import React, {
  useState,
  createContext,
  useMemo,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from 'react'

import * as storage from '@app/lib/secure-storage'

export type ThemeType = 'dark' | 'default' | null

type Prefs = {
  isThemeDark: boolean
  autoCount: boolean
  countryCode: string
  location: string
}

type ContextType = {
  prefs: Prefs
  toggleTheme: (type?: ThemeType) => void
  toggleAutoCount: () => void
  changeCountry: (countryCode: string) => void
  changeLocation: (location: string) => void
}

const defaultPrefs = {
  isThemeDark: false,
  autoCount: false,
  countryCode: 'IE' as const,
  location: null, // TODO: set default?
}

const initialContext: ContextType = {
  prefs: defaultPrefs,
  toggleAutoCount() {
    // @todo implement
  },
  toggleTheme(_: ThemeType) {
    // @todo implement
  },
  changeCountry(_: string) {
    // @todo implement
  },
  changeLocation(_: string) {
    // @todo implement
  },
}

const PreferencesContext = createContext(initialContext)

export function usePreferences() {
  return useContext(PreferencesContext)
}

type PreferencesProviderProps = {
  children: React.ReactNode
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const firstRun = useRef(true)
  const [prefs, setPrefs] = useState<Prefs>(null)

  useEffect(() => {
    async function initPrefs() {
      const storedPrefs = await storage.getObject<Prefs>('prefs')
      if (storedPrefs) console.log('found prefs in storage')

      setPrefs({ ...defaultPrefs, ...storedPrefs })

      // hack to avoid saving prefs right after we load
      setTimeout(() => {
        firstRun.current = false
      }, 100)
    }

    initPrefs()
  }, [])

  useEffect(() => {
    if (firstRun.current) return

    async function savePrefs() {
      console.log('SAVING PREFS...', JSON.stringify(prefs))
      await storage.saveObject('prefs', prefs)
    }

    savePrefs()
  }, [prefs])

  const toggleTheme = useCallback<ContextType['toggleTheme']>(
    type =>
      setPrefs(p => ({
        ...p,
        isThemeDark: !type ? !p.isThemeDark : type === 'dark',
      })),
    []
  )

  const toggleAutoCount = useCallback<ContextType['toggleAutoCount']>(
    () => setPrefs(p => ({ ...p, autoCount: !p.autoCount })),
    []
  )

  const changeCountry = useCallback<ContextType['changeCountry']>(
    countryCode => setPrefs(p => ({ ...p, countryCode })),
    []
  )

  const changeLocation = useCallback<ContextType['changeLocation']>(
    location => setPrefs(p => ({ ...p, location })),
    []
  )

  const preferences = useMemo(
    () => ({
      prefs,
      toggleTheme,
      toggleAutoCount,
      changeCountry,
      changeLocation,
    }),
    [prefs, toggleTheme, toggleAutoCount, changeCountry, changeLocation]
  )

  return (
    <PreferencesContext.Provider value={preferences}>
      {children}
    </PreferencesContext.Provider>
  )
}
