import format from 'date-fns/format'

export function now() {
  return new Date()
}

export function formatDate(d: number | string | Date): string {
  if (!d) return null

  return format(new Date(d), 'dd-MMM-yyyy')
}

export function formatDateTime(d: number | string | Date): string {
  if (!d) return null

  return format(new Date(d), 'dd-MMM-yyyy hh:mm:ss aa')
}

export function mapToJSON(map) {
  if (!(map instanceof Map)) return map
  const out = Object.create(null)

  map.forEach((value, key) => {
    if (value instanceof Map) {
      out[key] = mapToJSON(value)
    } else {
      out[key] = value
    }
  })

  return out
}
