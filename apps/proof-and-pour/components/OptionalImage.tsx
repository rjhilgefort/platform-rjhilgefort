'use client'

import Image from 'next/image'
import { useState } from 'react'
import ImagePlaceholder from './ImagePlaceholder'

interface OptionalImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  placeholderText?: string
}

export default function OptionalImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholderText,
}: OptionalImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <ImagePlaceholder
        width={width}
        height={height}
        text={placeholderText || alt}
        className={className}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setImageError(true)}
    />
  )
}
