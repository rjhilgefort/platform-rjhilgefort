/**
 * Fisher-Yates shuffle algorithm
 */
export const Array_shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    const shuffledI = shuffled[i]
    const shuffledJ = shuffled[j]

    if (shuffledI !== undefined && shuffledJ !== undefined) {
      ;[shuffled[i], shuffled[j]] = [shuffledJ, shuffledI]
    }
  }
  return shuffled
}
