export type LogEntry = {
  datetime: string
  location: string
  type: 'vaccine' | 'test' | 'recovery' | 'unknown'
  passed: boolean
  failure: string
  country: string
}
