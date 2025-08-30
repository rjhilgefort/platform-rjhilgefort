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
import { makeApiClient } from './makeApiClient'
import { Effect_logString } from './Effect_logString'
import { String_UrlHost } from './String_UrlHost'
import { Stacks } from './Stack'
import { StackFileResponse } from './StackFileResponse'

/**
 * @url https://github.com/wirgen/portainer-stack-redeploy-action/tree/v1.1
 * @url https://app.swaggerhub.com/apis/portainer/portainer-ce/2.27.1#/stacks/StackUpdate
 */
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

  const apiClient = makeApiClient({
    host: `${host}/api/`,
    accessToken: params.accessToken,
  })

  const stack = await pipe(
    apiClient.get('stacks'),
    Effect.flatMap(Schema.decodeUnknown(Stacks)),
    Effect.flatMap(
      Array.findFirst(flow(Struct.get('Name'), equals(params.stackName))),
    ),
    Effect.runPromise,
  )

  console.log('🔄 Deploying Stack...')

  await pipe(
    apiClient.get(`stacks/${stack.Id}/file`),
    Effect.flatMap(Schema.decodeUnknown(StackFileResponse)),
    Effect.map(Struct.get('StackFileContent')),
    Effect.tap(Effect_logString('💾 Updating Stack...')),
    Effect.flatMap((stackFile) =>
      apiClient.put(`stacks/${stack.Id}?endpointId=${stack.EndpointId}`, {
        stackFileContent: stackFile,
        pullImage: true,
      }),
    ),
    Effect.tap(Effect_logString('💾 Stack updated')),
    Effect.tap(Effect_logString('✋ Stopping Stack...')),
    Effect.flatMap(() =>
      apiClient.post(`stacks/${stack.Id}/stop?endpointId=${stack.EndpointId}`),
    ),
    Effect.tap(Effect_logString('✋ Stack stopped')),
    Effect.tap(Effect_logString('🚀 Starting Stack...')),
    Effect.flatMap(() =>
      apiClient.post(`stacks/${stack.Id}/start?endpointId=${stack.EndpointId}`),
    ),
    Effect.tap(Effect_logString('🚀 Stack deployed')),
    Effect.runPromise,
  )

  console.log('✅ Done!')
}
