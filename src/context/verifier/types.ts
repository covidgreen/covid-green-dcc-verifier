import { CertificateContent } from '@app/types/hcert'

export type VerificationResult = {
  cert?: CertificateContent
  ruleErrors?: string[]
  error?: Error
}
