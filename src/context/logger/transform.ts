import { CertificateContent } from '@app/types/hcert'
import { VerificationResult } from '../verifier/types'
import { LogEntry } from './types'


function getCountryData(cert: CertificateContent): string {
  if (cert.v && cert.v.length > 0) {
    return cert.v[0].co
  }
  if (cert.t && cert.t.length > 0) {
    return cert.t[0].co
  }
  if (cert.r && cert.r.length > 0) {
    return cert.r[0].co
  }  
}

function getTypeData(cert: CertificateContent): 'vaccine' | 'test' | 'recovery' | 'unknown' {
  if (cert.v && cert.v.length > 0) {
    return 'vaccine'
  }
  if (cert.t && cert.t.length > 0) {
    return 'test'
  }
  if (cert.r && cert.r.length > 0) {
    return 'recovery'
  }  
  return 'unknown'
}

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
    entry.type = getTypeData(cert)
    console.log(cert)
    entry.country = getCountryData(cert)
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
