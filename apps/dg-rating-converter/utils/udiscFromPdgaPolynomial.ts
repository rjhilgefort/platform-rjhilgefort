import { Number, pipe } from 'effect'
import { PDGA_MAX, PDGA_MIN } from './const'

/**
 * Evaluate 4th order polynomial equation with Horner’s method for numerical
 * stability and speed.
 */
export const udiscFromPdgaPolynomial = (pdgaRating: number) =>
  pipe(
    pdgaRating,
    Number.clamp({
      minimum: PDGA_MIN,
      maximum: PDGA_MAX,
    }),
    (x) =>
      (((-0.0000000012964093859 * x + 0.0000043153462542) * x -
        0.0048362405172) *
        x +
        2.507778614704) *
        x -
      446.414,
    Number.round(0),
  )
