import { Schema } from 'effect'

export const String_UrlHost = Schema.TemplateLiteral(
  Schema.Literal('https://', 'http://'),
  Schema.String,
  '.',
  Schema.String,
).pipe(Schema.brand('UrlHost'))
