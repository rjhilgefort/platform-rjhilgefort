'use client'

interface HeroImageProps {
  src: string
  alt: string
}

export default function HeroImage({ src, alt }: HeroImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}
