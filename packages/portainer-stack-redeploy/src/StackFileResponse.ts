import { Schema } from 'effect'

export const StackFileResponse = Schema.Struct({
  StackFileContent: Schema.String,
})
export type StackFileResponse = typeof StackFileResponse.Type
