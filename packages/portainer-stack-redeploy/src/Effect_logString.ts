import { Effect } from 'effect'

export const Effect_logString =
  (message: string) =>
  <T>(x: T) => {
    console.log(message)
    return Effect.succeed(x)
  }
