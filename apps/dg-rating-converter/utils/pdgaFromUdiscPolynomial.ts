import { Number, pipe } from 'effect'
import { UDISC_MAX, UDISC_MIN } from './const'

/**
 * Evaluate 4th order polynomial equation with Horner’s method for numerical
 * stability and speed.
 */
export const pdgaFromUdiscPolynomial = (udiscRating: number) =>
  pipe(
    udiscRating,
    Number.clamp({
      minimum: UDISC_MIN,
      maximum: UDISC_MAX,
    }),
    (x) =>
      (((-0.0000003010639379 * x + 0.000225588648) * x - 0.06630698227) * x +
        11.08668699) *
        x +
      36.01871726,
    Number.round(0),
  )
