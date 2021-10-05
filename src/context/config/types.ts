import { SigningKeys, Valuesets, RuleSet, ValueSetsComputed } from 'dcc-decoder'

type Location = {
  id: number
  name: string
}

export type ConfigType = {
  signingKeys: SigningKeys
  valueSets: Valuesets
  ruleSet: RuleSet
  valuesetsComputed: ValueSetsComputed
  locations: Location[]
}

export type ContextType = {
  config: ConfigType | null
  error: Error
  loading: boolean
  refetch: () => void
  refreshedAt: string
}
