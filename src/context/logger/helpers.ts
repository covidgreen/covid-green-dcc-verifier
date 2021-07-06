import AsyncStorage from '@react-native-async-storage/async-storage'
import { METRICS_URL } from 'react-native-dotenv'

import fetch from '@app/lib/fetch'

import { LogEntry } from './types'

export const getObject = async (key: string) => {
  try {
    const val = await AsyncStorage.getItem(key)
    return val != null ? JSON.parse(val) : null
  } catch (e) {
    return {}
  }
}

export const saveObject = async (key: string, obj: unknown) => {
  // TODO: handle save error?
  await AsyncStorage.setItem(key, JSON.stringify(obj))
}

export const get100ishLogs = async (): Promise<{
  logs100: LogEntry[]
  toDelete: string[]
  more: boolean
}> => {
  const allKeys = await AsyncStorage.getAllKeys()
  const allLogKeys = allKeys
    .filter(k => k.startsWith('log.'))
    .sort((a, b) => +a.split('.')[1] - +b.split('.')[1])

  const logs100 = []
  const toDelete = []

  for await (const k of allLogKeys) {
    const someLogs = await getObject(k)

    logs100.push(...someLogs)
    toDelete.push(k)

    if (logs100.length > 100) break
  }

  return { logs100, toDelete, more: allLogKeys.length - toDelete.length > 0 }
}

export const pushLogs = async () => {
  const { logs100, toDelete, more } = await get100ishLogs()

  if (logs100.length) {
    const { status } = await fetch(METRICS_URL, {
      method: 'POST',
      body: logs100,
    })

    if (status === 204) {
      console.log(logs100.length, 'LOGS PUSHED')
      await AsyncStorage.multiRemove(toDelete)

      // returning call to async fn will make the
      // caller wait before resetting the timer
      // TODO: test this thoroughly as its a recursion
      if (more) return pushLogs()
    }
  }
}
