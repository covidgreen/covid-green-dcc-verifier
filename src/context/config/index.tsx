import React, {
  useMemo,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { CONFIG_URL } from 'react-native-dotenv'

import * as storage from '@app/lib/secure-storage'
import fetch from '@app/lib/fetch'

import { ContextType, ConfigType, Valueset } from './types'

function getValuesetsComputed(valuesets) {
  return Object.keys(valuesets).reduce((acc, key) => {
    acc[valuesets[key].valueSetId] = Object.keys(valuesets[key].valueSetValues)

    return acc
  }, {})
}

const mapConfig = (c): ConfigType => ({
  ...c,
  valuesets: {
    countryCodes: c.valueSets.countryCodes.valueSetValues,
    diseaseAgentTargeted: c.valueSets.diseaseAgentTargeted.valueSetValues,
    testManf: c.valueSets.testManf.valueSetValues,
    testResult: c.valueSets.testResult.valueSetValues,
    testType: c.valueSets.testType.valueSetValues,
    vaccineMahManf: c.valueSets.vaccineMahManf.valueSetValues,
    vaccineMedicinalProduct: c.valueSets.vaccineMedicinalProduct.valueSetValues,
    vaccineProphylaxis: c.valueSets.vaccineProphylaxis.valueSetValues,
  },
  valuesetsComputed: getValuesetsComputed(c.valueSets),
  certs: Array.isArray(c.certs)
    ? c.certs
    : [].concat(...Object.values(c.certs)), // TODO: remove condition when config api changes
})

const initialValue: ContextType = {
  config: null,
  error: null,
  loading: true,
  refetch: async () => {
    // @todo implement
  },
}

const ConfigContext = createContext<ContextType>(initialValue)

export function getValue(
  valueset: Record<string, Valueset>,
  key: string,
  defaultValue: string = key
): string {
  return valueset[key]?.display || defaultValue
}

export function useConfig() {
  return useContext(ConfigContext)
}

type ConfigProviderProps = {
  children: React.ReactNode
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, setConfig] = useState<ConfigType>(null)
  const [error, setError] = useState<Error>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const success = async c => {
      setConfig(c)
      setError(null)
      setLoading(false)
    }

    const failure = err => {
      setConfig(null)
      setError(err)
      setLoading(false)
    }

    async function fetchConfig() {
      setLoading(true)

      console.log('REQUESTING CONFIG')
      let newConfig: ConfigType
      const { status, body } = await fetch<ConfigType>(CONFIG_URL)

      if (status === 200) {
        newConfig = mapConfig(body.data)
        await storage.saveObject('config', newConfig)
      } else {
        console.log('REQUESTING CONFIG FAILED, Using stored config')
        newConfig = await storage.getObject<ConfigType>('config')
      }
      success(newConfig)
      console.log('Fetched config')
    }

    if (!config) {
      try {
        fetchConfig()
      } catch (err) {
        console.log('Error getting config:', err)
        failure(err)
      }
    }
  }, [config])

  // We simply need to clear from cache and local state
  // Refetching will be a side-effect of that
  const refetch = useCallback(async () => {
    await storage.setItem('config', null)
    setConfig(null)
  }, [])

  const value = useMemo<ContextType>(
    () => ({ config, error, loading, refetch }),
    [config, error, loading, refetch]
  )

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  )
}
