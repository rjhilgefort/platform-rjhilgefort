import { Number, pipe } from 'effect'
import { UDISC_MAX, UDISC_MIN } from './const'

const coeff1 = -3.010639379e-7
const coeff2 = 2.25588648e-4
const coeff3 = -6.630698227e-2
const coeff4 = 11.08668699
const coeff5 = 36.01871726

/**
 * Evaluate 4th order polynomial equation with Horner’s method for numerical
 * stability and speed
 */
export const pdgaFromUdiscPolynomial = (udiscRating: number) =>
  pipe(
    udiscRating,
    Number.clamp({
      minimum: UDISC_MIN,
      maximum: UDISC_MAX,
    }),
    (x) => (((coeff1 * x + coeff2) * x - coeff3) * x + coeff4) * x + coeff5,
  )

export const pdgaFromUdiscPolynomialDerivative = (udiscRating: number) =>
  pipe(
    udiscRating,
    Number.clamp({
      minimum: UDISC_MIN,
      maximum: UDISC_MAX,
    }),
    (x) =>
      -1.2042557516e-6 * x * x * x +
      6.76765944e-4 * x * x -
      1.3261396454e-1 * x +
      11.08668699,
  )
