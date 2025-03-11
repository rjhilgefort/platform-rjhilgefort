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
      console.error(error)
      return error
    },
  })

const Effect_responseJson = (response: Response) =>
  Effect.tryPromise(() => response.json())

const Effect_fetchJson = flow(Effect_fetch, Effect.flatMap(Effect_responseJson))

const Effect_logString =
  (message: string) =>
  <T>(x: T) => {
    console.log(message)
    return Effect.succeed(x)
  }

export const portainerStackRedeploy = async (params: {
  host: string
  accessToken: string
  stackName: string
}) => {
  console.log('⏳ Running Portainer Deploy Script...')

  const host = pipe(
    params.host,
    String.trim,
    String.replace(/\/$/, ''),
    Schema.decodeUnknownEither(String_UrlHost),
    Either.getOrThrow,
  )

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

  console.log('🔄 Deploying Stack...')
  await pipe(
    Effect_fetchJson(`${host}/api/stacks/${stack.Id}/file`, {
      method: 'GET',
      headers: { 'X-API-Key': params.accessToken },
    }),
    Effect.flatMap(Schema.decodeUnknown(StackFileResponse)),
    Effect.map(Struct.get('StackFileContent')),
    Effect.tap(Effect_logString('💾 Updating Stack...')),
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
    Effect.tap(Effect_logString('💾 Stack updated')),
    Effect.tap(Effect_logString('🛑 Stopping Stack...')),
    Effect.flatMap(() =>
      Effect_fetchJson(
        `${host}/api/stacks/${stack.Id}/stop?endpointId=${stack.EndpointId}`,
        {
          method: 'POST',
          headers: { 'X-API-Key': params.accessToken },
        },
      ),
    ),
    Effect.tap(Effect_logString('🛑 Stack stopped')),
    Effect.tap(Effect_logString('🚀 Starting Stack...')),
    Effect.flatMap(() =>
      Effect_fetchJson(
        `${host}/api/stacks/${stack.Id}/start?endpointId=${stack.EndpointId}`,
        {
          method: 'POST',
          headers: { 'X-API-Key': params.accessToken },
        },
      ),
    ),
    Effect.tap(Effect_logString('🚀 Stack deployed')),
    Effect.runPromise,
  )

  console.log('✅ Done!')
}
