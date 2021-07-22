import React, {
  useMemo,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { CONFIG_URL } from 'react-native-dotenv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import _throttle from 'lodash.throttle'

import * as storage from '@app/lib/secure-storage'
import fetch from '@app/lib/fetch'
import { isMountedRef } from '@app/lib/refs'
import { now } from '@app/lib/util'

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
})

const initialValue: ContextType = {
  config: null,
  error: null,
  loading: true,
  refetch: () => {
    // @todo implement
  },
  refreshedAt: undefined,
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
  // counter is nothing but a hint to useEffect so that it can fetch/refetch the config
  const [counter, setCounter] = useState(0)
  const [refreshedAt, setRefreshedAt] = useState(null)
  const [config, setConfig] = useState<ConfigType>(null)
  const [error, setError] = useState<Error>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fn() {
      const timestamp = await AsyncStorage.getItem('refreshed_at')
      if (timestamp) setRefreshedAt(timestamp)
    }

    fn()
  }, [])

  useEffect(() => {
    const success = async c => {
      if (!isMountedRef.current) return
      console.log('Config success')
      setConfig(c)
      setError(null)
      setLoading(false)
    }

    const failure = err => {
      if (!isMountedRef.current) return
      setConfig(null)
      setError(err)
      setLoading(false)
    }

    async function fetchConfig() {
      setLoading(true)

      console.log('REQUESTING CONFIG')
      // let newConfig: ConfigType
      const { status, body } = await fetch<ConfigType>(CONFIG_URL)

      if (status === 200) {
        try {
          const newConfig = mapConfig(body.data)
          await storage.saveObject('config', newConfig)

          const timestamp = now().toISOString()
          setRefreshedAt(timestamp)
          await AsyncStorage.setItem('refreshed_at', timestamp)

          // make sure to early return in case of success
          return success(newConfig)
        } catch (err) {
          console.log('Invalid config, will fallback to stored config')
        }
      }

      // If we're here, we still don't have config
      console.log('REQUESTING CONFIG FAILED, Using stored config')
      const storedConfig = await storage.getObject<ConfigType>('config')

      if (!storedConfig) {
        throw new Error('Unable to get config')
      }

      success(storedConfig)
    }

    fetchConfig().catch(err => {
      console.log('Error getting config:', err)
      failure(err)
    })
  }, [counter])

  // As we increment the counter, useEffect kicks in and refetches the config
  const refetch = useMemo(
    () => _throttle(() => setCounter(c => c + 1), 10 * 1000),
    []
  )

  const value = useMemo<ContextType>(
    () => ({ config, error, loading, refetch, refreshedAt }),
    [config, error, loading, refetch, refreshedAt]
  )

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  )
}
