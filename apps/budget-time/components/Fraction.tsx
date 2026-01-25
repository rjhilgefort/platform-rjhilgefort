'use client'

interface FractionProps {
  value: number
  className?: string
}

/**
 * Renders a number with Unicode fraction characters.
 * Supports quarter increments: 0.25, 0.5, 0.75
 */
export function Fraction({ value, className = '' }: FractionProps) {
  const whole = Math.floor(value)
  const decimal = value - whole
  const roundedDecimal = Math.round(decimal * 4) / 4

  let fractionChar = ''
  if (roundedDecimal === 0.25) fractionChar = '¼'
  else if (roundedDecimal === 0.5) fractionChar = '½'
  else if (roundedDecimal === 0.75) fractionChar = '¾'

  if (!fractionChar) {
    return <span className={className}>{whole}</span>
  }

  if (whole === 0) {
    return <span className={className}>{fractionChar}</span>
  }

  return <span className={className}>{whole}{fractionChar}</span>
}
