import { Number, pipe } from 'effect'
import { PDGA_MAX, PDGA_MIN } from './const'

export const udiscFromPdgaSimple = (pdgaRating: number) =>
  pipe(
    pdgaRating,
    Number.clamp({
      minimum: PDGA_MIN,
      maximum: PDGA_MAX,
    }),
    (x) => (x - 500) / 2,
  )
