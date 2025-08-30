import { Schema } from 'effect'

export const Stack = Schema.Struct({
  Id: Schema.Number,
  Name: Schema.String,
  EndpointId: Schema.Number,
})
export type Stack = typeof Stack.Type

export const Stacks = Schema.Array(Stack)
export type Stacks = typeof Stacks.Type
