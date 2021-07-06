import { VerificationResult } from '../verifier/types'

import { LogEntry } from './types'

export default function transformToLog(
  { cert, error, ruleErrors }: VerificationResult,
  { location }: Record<string, unknown> = {}
) {
  const entry = {
    datetime: new Date().toISOString(),
    location,
    type: 'unknown', // will get replaced if we have a cert
  } as LogEntry

  if (cert) {
    // TODO: what to do when verification fails due to multiple certs in one QR?
    entry.type = cert.v ? 'vaccine' : cert.t ? 'test' : 'recovery'
    entry.country = (cert.v || cert.t || cert.r)[0].co
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
