'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

interface HeroWithImageProps {
  imageSrc: string
  imageAlt: string
  children: ReactNode
}

export default function HeroWithImage({ imageSrc, imageAlt, children }: HeroWithImageProps) {
  return (
    <div className="hero min-h-[500px] bg-base-200 relative">
      {/* Background Image - will show when added */}
      <div className="hero-overlay bg-opacity-60 absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            // Hide image on error (when file doesn't exist yet)
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
      <div className="hero-content text-center relative z-10">
        {children}
      </div>
    </div>
  )
}
