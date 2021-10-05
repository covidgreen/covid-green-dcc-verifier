import format from 'date-fns/format'
import { CertificateContent } from 'dcc-decoder'

export function now() {
  return new Date()
}

export function formatDate(d: number | string | Date): string {
  if (!d) return null

  try {
    return format(new Date(d), 'dd-MMM-yyyy')
  } catch(e) {
    // can't convert to date
  }
  return d.toString()
}

export function formatDateTime(d: number | string | Date): string {
  if (!d) return null

  try {
    return format(new Date(d), 'dd-MMM-yyyy hh:mm:ss aa')
  } catch(e) {
    // can't convert to date
  }
  return d.toString()
}

export function getCertName(cert: CertificateContent):string {
  const familyName = cert.nam.fn || cert.nam.fnt || ''
  const givenName = cert.nam.gn || cert.nam.gnt || ''

  return `${familyName}${givenName ? ', ' : ''}${givenName}`
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
