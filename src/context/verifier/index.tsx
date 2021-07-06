import React, { createContext, useMemo, useContext, useCallback } from 'react'
import validator from 'tiny-json-validator'

import { runRuleSet } from '@app/lib/rules-runner'

import { CertificateContent } from '@app/types/hcert'

import { usePreferences } from '../preferences'
import { useConfig } from '../config'

import decodeQR from './decode'
import * as errors from './errors'
import schema from './schema'
import { VerificationResult } from './types'

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

function validateCertStructure(cert: CertificateContent) {
  const { isValid } = validator(schema, cert)
  return isValid
}

export function VerifierProvider({ children }) {
  const { prefs } = usePreferences()
  const { config } = useConfig()

  const run = useCallback<ContextType['run']>(
    async qr => {
      const { cert, error } = await decodeQR(qr, config.certs)

      if (!cert) return { error }

      if (!validateCertStructure(cert)) {
        return { cert, error: errors.invalidStructure() }
      }

      const ruleset = config.rules[prefs?.countryCode]

      const ruleErrors = []
      if (ruleset) {
        const results = runRuleSet(ruleset, {
          payload: cert,
          external: {
            valueSets: config.valuesetsComputed,
            validationClock: new Date().toISOString(),
          },
        })
        console.log('RESULTS:', results)

        if (results && !results.allSatisfied) {
          Object.keys(results?.ruleEvaluations || {}).forEach(ruleId => {
            if (!results?.ruleEvaluations[ruleId]) {
              const rule = ruleset.find(r => r.id === ruleId)
              ruleErrors.push(rule.description)
            }
          })
        }
      }

      return { cert, ruleErrors, error }
    },
    [config, prefs?.countryCode]
  )

  const rules = useMemo<ContextType>(() => ({ run }), [run])

  return (
    <VerifierContext.Provider value={rules}>
      {children}
    </VerifierContext.Provider>
  )
}
