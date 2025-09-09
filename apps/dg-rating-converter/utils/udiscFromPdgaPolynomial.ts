import { Number } from 'effect'
import { UDISC_MAX, UDISC_MIN } from './const'
import {
  pdgaFromUdiscPolynomial,
  pdgaFromUdiscPolynomialDerivative,
} from './pdgaFromUdiscPolynomial'

/**
 * Given a PDGA rating, estimate the UDisc rating.
 * - Uses a monotonic-safe bracket + binary search, then 1–2 Newton refinements.
 * - Runs in O(1) time.
 */
export const udiscFromPdgaPolynomial = (pdgaRating: number) => {
  // Clamp target to achievable PDGA range over [xmin, xmax]
  const pmin = pdgaFromUdiscPolynomial(UDISC_MIN)
  const pmax = pdgaFromUdiscPolynomial(UDISC_MAX)
  const loIsLower = pmin <= pmax
  const lowerP = loIsLower ? pmin : pmax
  const upperP = loIsLower ? pmax : pmin
  const pdgaRatingClamped = Number.clamp({
    minimum: lowerP,
    maximum: upperP,
  })(pdgaRating)

  // Binary search to get a good initial x
  let lo = UDISC_MIN
  let hi = UDISC_MAX
  for (let i = 0; i < 40; i++) {
    // ~1e-9 ft precision within domain
    const mid = 0.5 * (lo + hi)
    const pmid = pdgaFromUdiscPolynomial(mid)
    if (pmid < pdgaRatingClamped === loIsLower) {
      lo = mid
    } else {
      hi = mid
    }
  }
  let udiscRating = 0.5 * (lo + hi)

  // Optional: a couple of Newton refinements for fast convergence
  const tol = 1e-6
  for (let k = 0; k < 2; k++) {
    const fx = pdgaFromUdiscPolynomial(udiscRating) - pdgaRatingClamped
    const dfx = pdgaFromUdiscPolynomialDerivative(udiscRating)
    if (Math.abs(dfx) < 1e-8) break // avoid division by near-zero
    const step = fx / dfx
    udiscRating -= step
    // keep within bounds
    if (udiscRating < UDISC_MIN) udiscRating = UDISC_MIN
    if (udiscRating > UDISC_MAX) udiscRating = UDISC_MAX
    if (Math.abs(step) < tol) break
  }

  return udiscRating
}
