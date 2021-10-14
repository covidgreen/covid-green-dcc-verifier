import React, { createContext, useMemo, useContext, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { usePreferences } from '../preferences'
import { useConfig } from '../config'

import { decodeAndValidateRules, VerificationResult } from 'dcc-decoder'

type ContextType = {
  run: (qr: string) => Promise<VerificationResult>
}

const initialContext: ContextType = {
  run: async () => null as VerificationResult,
}

const VerifierContext = createContext(initialContext)

export function useVerifier() {
  return useContext(VerifierContext)
}

export function VerifierProvider({ children }) {
  const { t } = useTranslation()
  const { prefs } = usePreferences()
  const { config } = useConfig()

  const run = useCallback<ContextType['run']>(
    async qr => {
      try {
        const { cert, error, ruleErrors, type, wrapperData } = await decodeAndValidateRules({source: [qr], ruleCountry: prefs?.countryCode, dccData: config})

        console.log('Scan Info', wrapperData, cert)
        if (!cert) return { error: t(error.name) }

        return { cert, type, ruleErrors, error }
      } catch (e) {
        return {error: e}
      }
    },
    [config, prefs?.countryCode, t]
  )

  const rules = useMemo<ContextType>(() => ({ run }), [run])

  return (
    <VerifierContext.Provider value={rules}>
      {children}
    </VerifierContext.Provider>
  )
}