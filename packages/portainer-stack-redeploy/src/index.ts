import {
  String,
  Array,
  Effect,
  flow,
  pipe,
  Schema,
  Struct,
  Either,
} from 'effect'
import { equals } from 'effect/Equal'
const { log } = console

const String_UrlHost = Schema.TemplateLiteral(
  Schema.Literal('https://', 'http://'),
  Schema.String,
  '.',
  Schema.String,
).pipe(Schema.brand('UrlHost'))

const Stack = Schema.Struct({
  Id: Schema.Number,
  Name: Schema.String,
  EndpointId: Schema.Number,
})
export type Stack = typeof Stack.Type

const Stacks = Schema.Array(Stack)
export type Stacks = typeof Stacks.Type

const StackFileResponse = Schema.Struct({
  StackFileContent: Schema.String,
})
export type StackFileResponse = typeof StackFileResponse.Type

/**
 * Wraps the fetch API in an Effect
 */
const Effect_fetch = (url: string | URL | Request, options?: RequestInit) =>
  Effect.tryPromise({
    try: () => fetch(url, options),
    catch: (error) => {
      log(error)
      return error
    },
  })

const Effect_responseJson = (response: Response) =>
  Effect.tryPromise(() => response.json())

const Effect_fetchJson = flow(Effect_fetch, Effect.flatMap(Effect_responseJson))

log('⏳ Running Portainer Deploy Script...')

export const portainerStackRedeploy = async (params: {
  host: string
  accessToken: string
  stackName: string
}) => {
  const host = pipe(
    params.host,
    String.trim,
    String.replace(/\/$/, ''),
    Schema.decodeUnknownEither(String_UrlHost),
    Either.getOrThrow,
  )
  log({ host })

  const stack = await pipe(
    Effect_fetchJson(`${host}/api/stacks`, {
      method: 'GET',
      headers: { 'X-API-Key': params.accessToken },
    }),
    Effect.flatMap(Schema.decodeUnknown(Stacks)),
    Effect.flatMap(
      Array.findFirst(flow(Struct.get('Name'), equals(params.stackName))),
    ),
    Effect.tap(Effect.log),
    Effect.runPromise,
  )

  log(`${host}/api/stacks/${stack.Id}?endpointId=${stack.EndpointId}`)

  console.log('🔄 Deploying Stack...')
  await pipe(
    Effect_fetchJson(`${host}/api/stacks/${stack.Id}/file`, {
      method: 'GET',
      headers: { 'X-API-Key': params.accessToken },
    }),
    Effect.flatMap(Schema.decodeUnknown(StackFileResponse)),
    Effect.map(Struct.get('StackFileContent')),
    Effect.tap(Effect.logDebug('Updating Stack...')),
    Effect.flatMap((stackFile) =>
      Effect_fetchJson(
        `${host}/api/stacks/${stack.Id}?endpointId=${stack.EndpointId}`,
        {
          method: 'PUT',
          headers: { 'X-API-Key': params.accessToken },
          body: JSON.stringify({
            stackFileContent: stackFile,
            pullImage: true,
          }),
        },
      ),
    ),
    Effect.tap(Effect.log),
    Effect.flatMap(() =>
      Effect_fetchJson(
        `${host}/api/stacks/${stack.Id}/stop?endpointId=${stack.EndpointId}`,
        {
          method: 'POST',
          headers: { 'X-API-Key': params.accessToken },
        },
      ),
    ),
    Effect.tap(Effect.logDebug('Stack stopped')),
    Effect.flatMap(() =>
      Effect_fetchJson(
        `${host}/api/stacks/${stack.Id}/start?endpointId=${stack.EndpointId}`,
        {
          method: 'POST',
          headers: { 'X-API-Key': params.accessToken },
        },
      ),
    ),
    Effect.tap(Effect.logDebug('Stack deployed')),
    Effect.mapError(Effect.logError),
    Effect.runPromise,
  )
  console.log('✅ Done!')
}
