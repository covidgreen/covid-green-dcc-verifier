import { CertificateContent, CERT_TYPE, RuleError } from 'dcc-decoder'

export type MainStackParamList = {
  Home: undefined
  Scan: undefined
  Settings: undefined
}

export type RootStackParamList = {
  Main: undefined
  ScanPass: {
    data: CertificateContent
    type: CERT_TYPE
  }
  ScanFail: {
    data?: CertificateContent
    type?: CERT_TYPE
    error: string
    ruleErrors: RuleError[]
  }
}
