import React, {
  createContext,
  useMemo,
  useContext,
  useCallback,
  useRef,
  useEffect,
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
const PUSH_DURATION_MS = 5 * 60 * 1000

export type ContextType = {
  log: (_: VerificationResult) => void
}

const initialContext: ContextType = {
  log: () => {
    // @todo implement
  },
}

const LoggerContext = createContext(initialContext)

export function useLogger() {
  return useContext(LoggerContext)
}

export function LoggerProvider({ children }) {
  const { prefs } = usePreferences()
  const logs = useRef<LogEntry[]>([])

  useEffect(() => {
    let timer
    async function start() {
      timer = setTimeout(async () => {
        await pushLogs()

        if (isMountedRef.current) {
          console.log('RESET PUSH TIMER')
          start()
        }
      }, PUSH_DURATION_MS)
    }

    start()

    return () => clearTimeout(timer)
  }, [])

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

      logs.current.push(logEntry)
      console.log('LOG:', logEntry)
    },
    [logs, prefs?.location]
  )

  const logger = useMemo<ContextType>(() => ({ log: log }), [log])

  return (
    <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>
  )
}
