import { Predicate } from 'effect'
import { EffectFetch } from './EffectFetch'

export const makeApiClient = ({
  host,
  accessToken,
}: {
  host: string
  accessToken: string
}) => ({
  get: (uri: string) => {
    console.log(`${host}/api/${uri}`)
    console.log({
      method: 'GET',
      headers: { 'X-API-Key': accessToken },
    })

    return EffectFetch.fetchJson(`${host}/api/${uri}`, {
      method: 'GET',
      headers: { 'X-API-Key': accessToken },
    })
  },

  post: <T>(uri: string, body?: T) =>
    EffectFetch.fetchJson(`${host}/api/${uri}`, {
      method: 'POST',
      headers: { 'X-API-Key': accessToken },
      ...(Predicate.isNullable(body) ? {} : { body: JSON.stringify(body) }),
    }),
  put: <T>(uri: string, body: T) =>
    EffectFetch.fetchJson(`${host}/api/${uri}`, {
      method: 'PUT',
      headers: { 'X-API-Key': accessToken },
      body: JSON.stringify(body),
    }),
})
