import { Rule, ValueSetsComputed } from '@app/lib/rules-runner/types'

export type Valueset = {
  display: string
  lang: string
  active: boolean
  version: string
  system: string
}

type Valuesets = {
  countryCodes: Record<string, Valueset>
  diseaseAgentTargeted: Record<string, Valueset>
  testManf: Record<string, Valueset>
  testResult: Record<string, Valueset>
  testType: Record<string, Valueset>
  vaccineMahManf: Record<string, Valueset>
  vaccineMedicinalProduct: Record<string, Valueset>
  vaccineProphylaxis: Record<string, Valueset>
}

type Location = {
  id: number
  name: string
}

export type SigningKey = {
  kid: string
  x: string
  y: string
  country: string
}

export type SigningKeys = SigningKey[]

export type ConfigType = {
  certs: SigningKeys
  valuesets: Valuesets
  rules: Record<string, Rule[]>
  valuesetsComputed: ValueSetsComputed
  locations: Location[]
}

export type ContextType = {
  config: ConfigType | null
  error: Error
  loading: boolean
  refetch: () => Promise<void>
}
