import { CertificateContent } from './hcert'

export type MainStackParamList = {
  Home: undefined
  Scan: undefined
  Settings: undefined
}

export type RootStackParamList = {
  Main: undefined
  ScanPass: { data: CertificateContent }
  ScanFail: {
    data?: CertificateContent
    error: string
    ruleErrors: string[]
  }
}
