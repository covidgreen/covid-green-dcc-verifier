import 'react-native-get-random-values'
import React, { Suspense, useEffect } from 'react'
import Spinner from 'react-native-loading-spinner-overlay'
// import {
//   useFonts,
//   Lato_100Thin,
//   Lato_300Light,
//   Lato_400Regular,
//   Lato_700Bold,
// } from '@expo-google-fonts/lato'

import './lib/i18n'
import { ConfigProvider } from './context/config'
import { isMountedRef } from './lib/refs'
import { PreferencesProvider } from './context/preferences'
import { VerifierProvider } from './context/verifier'
import { ThemeProvider } from './context/theme'
import { LoggerProvider } from './context/logger'
import Main from './Main'

export default function App() {
  // const [fontsLoaded] = useFonts({
  //   Lato_100Thin,
  //   Lato_300Light,
  //   Lato_400Regular,
  //   Lato_700Bold,
  // })

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // if (fontsLoaded) return <Spinner animation="fade" visible />

  return (
    <Suspense fallback={<Spinner animation="fade" visible />}>
      <PreferencesProvider>
        <ThemeProvider>
          <ConfigProvider>
            <LoggerProvider>
              <VerifierProvider>
                <Main />
              </VerifierProvider>
            </LoggerProvider>
          </ConfigProvider>
        </ThemeProvider>
      </PreferencesProvider>
    </Suspense>
  )
}
