import React, {
  createContext,
  useMemo,
  useContext,
  useCallback,
  useRef,
  useEffect,
  useState,
} from 'react'

import { isMountedRef } from '@app/lib/refs'
import { now } from '@app/lib/util'

import { VerificationResult } from '../verifier/types'
import { usePreferences } from '../preferences'

import transformToLog from './transform'
import { pushLogs, saveObject } from './helpers'
import { LogEntry } from './types'

/** timer for saving the logs to local storage */
const SAVE_DURATION_MS = 10 * 1000

/** timer for pushing the logs to server */
const PUSH_DURATION_MS = 30 * 1000

export type ContextType = {
  log: (_: VerificationResult) => void
  pushedAt: Date
  pushToServer: () => Promise<void>
}

const initialContext: ContextType = {
  log: () => {
    // @todo implement
  },
  pushedAt: undefined,
  pushToServer: async () => {
    // @todo implement
  },
}

const LoggerContext = createContext(initialContext)

export function useLogger() {
  return useContext(LoggerContext)
}

export function LoggerProvider({ children }) {
  const [pushedAt, setPushedAt] = useState<Date>()
  const { prefs } = usePreferences()
  const logs = useRef<LogEntry[]>([])

  const pushToServer = useCallback(async () => {
    await pushLogs()
    setPushedAt(now())
  }, [])

  useEffect(() => {
    let timer
    async function start() {
      timer = setTimeout(async () => {
        await pushToServer()

        if (isMountedRef.current) {
          console.log('RESET PUSH TIMER')
          start()
        }
      }, PUSH_DURATION_MS)
    }

    start()

    return () => clearTimeout(timer)
  }, [pushToServer])

  useEffect(() => {
    let timer
    async function start() {
      timer = setTimeout(async () => {
        if (logs.current.length) {
          // Pick all logs we got so far and clear the shelf for more
          const toPersist = [...logs.current]
          logs.current.length = 0

          // Save in a log.xxx entry in storage
          await saveObject(`log.${+now()}`, toPersist)
          console.log(toPersist.length, 'LOGS SAVED')
        }

        if (isMountedRef.current) {
          start()
        }
      }, SAVE_DURATION_MS)
    }

    start()

    return () => clearTimeout(timer)
  }, [])

  const log = useCallback<ContextType['log']>(
    result => {
      const logEntry = transformToLog(result, { location: prefs?.location })

      console.log('LOG:', logEntry)
      logs.current.push(logEntry)
    },
    [logs, prefs?.location]
  )

  const logger = useMemo<ContextType>(
    () => ({ log, pushedAt, pushToServer }),
    [log, pushedAt, pushToServer]
  )

  return (
    <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>
  )
}
