'use client'

interface FractionProps {
  value: number
  className?: string
}

/**
 * Renders a number with fractions using superscript/subscript styling.
 * Supports quarter increments: 0.25, 0.5, 0.75
 */
export function Fraction({ value, className = '' }: FractionProps) {
  const whole = Math.floor(value)
  const decimal = value - whole
  const roundedDecimal = Math.round(decimal * 4) / 4

  let numerator: number | null = null
  let denominator: number | null = null

  if (roundedDecimal === 0.25) {
    numerator = 1
    denominator = 4
  } else if (roundedDecimal === 0.5) {
    numerator = 1
    denominator = 2
  } else if (roundedDecimal === 0.75) {
    numerator = 3
    denominator = 4
  }

  if (!numerator || !denominator) {
    return <span className={className}>{whole}</span>
  }

  if (whole === 0) {
    return (
      <span className={className}>
        <sup>{numerator}</sup>/<sub>{denominator}</sub>
      </span>
    )
  }

  return (
    <span className={className}>
      {whole}<sup>{numerator}</sup>/<sub>{denominator}</sub>
    </span>
  )
}
