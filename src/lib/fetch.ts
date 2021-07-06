import { fetch as sslFetch } from 'react-native-ssl-pinning'
import { Assign, Optional } from 'utility-types'
import type { ReactNativeSSLPinning } from 'react-native-ssl-pinning'

// Making sslPinning optional coz we default it here
export type RequestOptions = Assign<
  Optional<ReactNativeSSLPinning.Options, 'sslPinning'>,
  { auth?: boolean }
>

type ErrorType = Array<{ code: string; message?: string }>

export type ResponseBody<T> = {
  data?: T
  errors?: ErrorType
}

export type Response<T> = { status: number; body: ResponseBody<T> }

export default async function fetch<T>(
  url: string,
  opts: RequestOptions = {}
): Promise<Response<T>> {
  const { method = 'GET', body = {}, headers } = opts

  return sslFetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(method === 'POST' ? { body: JSON.stringify(body) } : undefined),
    sslPinning: {
      certs: ['cert1', 'cert2', 'cert3', 'cert4', 'cert5'],
    },
    timeoutInterval: 30000,
  })
    .then<Response<T>>(async res => {
      const body = res.bodyString ? ((await res.json()) as T) : null
      console.log('API_RESPONSE:', res.status, body)

      return {
        status: res.status,
        body: { data: body },
      }
    })
    .catch<Response<T>>(async err => {
      // rnsp package throws with string OR even with response
      // it throws for 401 too, which regular fetch doesn't
      // this catch streamlines it all
      const body = err.json
        ? await err.json()
        : { errors: [{ code: 'API_ERROR', message: 'Unable to request data' }] }

      console.log('API_ERROR:', err)

      return {
        status: err.status,
        body,
      }
    })
}
