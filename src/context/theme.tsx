import React, { createContext, useContext } from 'react'

import { DarkTheme, DefaultTheme } from '@app/lib/theme'

import { usePreferences } from './preferences'

const ThemeContext = createContext(DefaultTheme)

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }) {
  const { prefs } = usePreferences()

  const theme = prefs?.isThemeDark ? DarkTheme : DefaultTheme

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
