import { Effect, flow } from 'effect'

const Effect_fetch = (url: string | URL | Request, options?: RequestInit) =>
  Effect.tryPromise({
    try: () => fetch(url, options),
    catch: (error) => {
      console.error(error)
      return error
    },
  })

const responseJson = (response: Response) =>
  Effect.tryPromise(() => response.json())

const fetchJson = flow(Effect_fetch, Effect.flatMap(responseJson))

export const EffectFetch = {
  fetch: Effect_fetch,
  responseJson,
  fetchJson,
}
