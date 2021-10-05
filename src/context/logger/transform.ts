import { VerificationResult } from 'dcc-decoder'

import { LogEntry } from './types'

enum typeMap {
  v = 'vaccine',
  t = 'test',
  r = 'recovery',
}

export default function transformToLog(
  { rawCert, error, ruleErrors, type }: VerificationResult,
  { location }: Record<string, unknown> = {}
) {
  const entry = {
    datetime: new Date().toISOString(),
    location,
    type: 'unknown', // will get replaced if we have a cert
  } as LogEntry

  if (rawCert) {
    entry.type = typeMap[type]
    entry.country = rawCert[type][0].co
    entry.passed = true
  }

  if (error) {
    entry.passed = false
    entry.failure = error.name
  }

  if (ruleErrors?.length) {
    entry.passed = false
    entry.failure = ruleErrors.join(',') // TODO: Ok to join multiple msgs?
  }

  return entry
}
