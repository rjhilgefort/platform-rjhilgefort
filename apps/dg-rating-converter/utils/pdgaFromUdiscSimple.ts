import { Number, pipe } from 'effect'
import { UDISC_MAX, UDISC_MIN } from './const'

export const pdgaFromUdiscSimple = (udiscRating: number) =>
  pipe(
    udiscRating,
    Number.clamp({
      minimum: UDISC_MIN,
      maximum: UDISC_MAX,
    }),
    (x) => x * 2 + 500,
    Number.round(0),
  )
