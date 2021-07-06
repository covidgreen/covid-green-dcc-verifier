import cose from 'cose-js'

import { ALGOS } from '@app/types/hcert'

import { SigningKey } from '../config/types'

import * as errors from './errors'

async function verifyECDSA(
  message: Buffer,
  keys: SigningKey[]
): Promise<Uint8Array | Error> {
  for (const key of keys) {
    try {
      const x = new Date()
      const verifiedBuf = await cose.sign.verify(message, {
        key: {
          kid: key.kid,
          x: Buffer.from(key.x, 'base64'),
          y: Buffer.from(key.y, 'base64'),
        },
      })
      if (verifiedBuf) {
        console.log(new Date().getTime() - x.getTime())
        console.log('key worked', key.kid, key.country)
        return verifiedBuf
      }
    } catch (e) {
      console.log('Sig failed', key.kid, e)
    }
  }
  return errors.invalidSignature()
}

async function verifyRSA(
  message: Buffer,
  keys: SigningKey[]
): Promise<Uint8Array | Error> {
  return errors.invalidSignature()
}

export default async function verifySignature(
  message: Buffer,
  algo: ALGOS,
  keys: SigningKey[]
): Promise<Uint8Array | Error> {
  if (algo === ALGOS.ECDSA_256) {
    return verifyECDSA(message, keys)
  } else if (algo === ALGOS.RSA_PSS_256) {
    return verifyRSA(message, keys)
  } else {
    return errors.unknownSigAlgo()
  }
}
