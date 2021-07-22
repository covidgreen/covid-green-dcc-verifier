import base45 from 'base45'
import pako from 'pako'
import cbor from 'cbor'

import { mapToJSON } from '@app/lib/util'

import {
  ALGOS,
  CBOR_STRUCTURE,
  HEADER_KEYS,
  PAYLOAD_KEYS,
  CertificateContent,
  CERT_TYPE,
} from '@app/types/hcert'

import { SigningKeys, SigningKey } from '../config/types'

import * as errors from './errors'
import verifySignature from './verify-signature'

function getCountryData(cert: CertificateContent): string {
  if (cert.v && cert.v.length > 0) {
    return cert.v[0].co
  }
  if (cert.t && cert.t.length > 0) {
    return cert.t[0].co
  }
  if (cert.r && cert.r.length > 0) {
    return cert.r[0].co
  }  
}

function getCountry(cert: CertificateContent, iss?: string): string | null {
  if (!cert) {
    return null
  }
  try {
    return iss || getCountryData(cert)
  } catch (e) {
    return null
  }
}

function getKid(protectedHeader, unprotectedHeader): string | null {
  try {
    if (protectedHeader) {
      return protectedHeader.get(HEADER_KEYS.KID).toString('base64')
    } else {
      return unprotectedHeader.get(HEADER_KEYS.KID).toString('base64')
    }
  } catch {
    return null
  }
}

function getAlgo(protectedHeader, unprotectedHeader): ALGOS | null {
  try {
    if (protectedHeader) {
      return protectedHeader.get(HEADER_KEYS.ALGORITHM)
    } else {
      return unprotectedHeader.get(HEADER_KEYS.ALGORITHM)
    }
  } catch {
    return null
  }
}

function getCertType(cert: CertificateContent): CERT_TYPE {
  if (cert.v && cert.v.length > 0) return CERT_TYPE.VACCINE
  if (cert.t && cert.t.length > 0) return CERT_TYPE.TEST
  if (cert.r && cert.r.length > 0) return CERT_TYPE.RECOVERY
}

/* function getSignature(message): string  | null {
  try {
    return cbor.decodeFirstSync(message.value[CBOR_STRUCTURE.SIGNATURE])
  } catch {
    return null
  }
}*/

function decodeCbor(qrCbor): {
  kid: string
  country: string
  issuedAt: number
  expiresAt: number
  cert: CertificateContent
  algo: ALGOS
  type: CERT_TYPE
} {
  const message = cbor.decodeFirstSync(Buffer.from(qrCbor))
  const decodedMessage = {value: message.value || message }

  const protectedHeader = cbor.decodeFirstSync(
    decodedMessage.value[CBOR_STRUCTURE.PROTECTED_HEADER]
  )
  const unprotectedHeader = decodedMessage.value[CBOR_STRUCTURE.UNPROTECTED_HEADER]

  const content = cbor.decodeFirstSync(decodedMessage.value[CBOR_STRUCTURE.PAYLOAD])

  // const signature = getSignature(decodedMessage)
  const kid = getKid(protectedHeader, unprotectedHeader)
  const algo = getAlgo(protectedHeader, unprotectedHeader)

  const cert = mapToJSON(content.get(PAYLOAD_KEYS.CONTENT).get(1))
  const type = getCertType(cert)

  // move into a function as mapping/transformation grows
  if (type === CERT_TYPE.TEST) {
    if (cert.t[0].sc instanceof Date) {
      cert.t[0].sc = cert.t[0].sc.toISOString()
    }
  }

  return {
    kid,
    country: getCountry(cert, content.get(PAYLOAD_KEYS.ISSUER)),
    issuedAt: content.get(PAYLOAD_KEYS.ISSUED_AT),
    expiresAt: content.get(PAYLOAD_KEYS.EXPIRES_AT),
    cert,
    algo,
    type,
  }
}

function findKeysToValidateAgainst(
  country: string,
  kid: string,
  signingKeys: SigningKey[]
): SigningKey[] {
  const keys: SigningKey[] = []

  if (kid) {
    keys.push(...signingKeys.filter(s => s.kid === kid))
  }

  if (keys.length === 0 && !kid) {
    keys.push(...signingKeys.filter(s => s.country === country))
  }

  return keys
}

export default async function decodeQR(
  qr: string,
  signingKeys: SigningKeys
): Promise<{ cert?: CertificateContent; error?: Error }> {
  if (!qr.startsWith('HC1:')) {
    return { error: errors.invalidQR() }
  }

  try {
    const qrBase45 = qr.replace('HC1:', '')
    const qrZipped = base45.decode(qrBase45)
    const qrCbor = pako.inflate(qrZipped)

    // We decode the whole cbor
    const { kid, cert, country, expiresAt, algo, issuedAt } = decodeCbor(qrCbor)

    const keysToUse = findKeysToValidateAgainst(country, kid, signingKeys)
    console.log(
      'Detected ',
      country,
      kid,
      algo,
      expiresAt,
      new Date(expiresAt * 1000),
      new Date(issuedAt * 1000),
      algo,
      keysToUse.length,
      cert
    )

    if (new Date(expiresAt * 1000) < new Date()) {
      return { cert, error: errors.certExpired() }
    }

    if (keysToUse.length === 0) {
      return { cert, error: errors.noMatchingSigKey() }
    }

    const result = await verifySignature(qrCbor, algo, keysToUse)

    const error = result instanceof Error ? result : null

    return { cert, error }
  } catch (err) {
    console.log('Error:', err)
    return { error: errors.invalidData() }
  }
}
