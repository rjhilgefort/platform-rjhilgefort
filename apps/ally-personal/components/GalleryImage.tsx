import { pipe, Array, String, Option } from 'effect'
import Image from 'next/image'

export const GalleryImage = ({ src, alt }: { src: string; alt?: string }) => {
  return (
    <Image
      className="h-auto max-w-full rounded-lg"
      src={src}
      alt={
        alt ??
        pipe(
          src,
          String.split('/'),
          Array.takeRight(2),
          Array.dropRight(1),
          Array.head,
          Option.map(String.split('-')),
          Option.map(Array.join(' ')),
          Option.getOrElse(() => src),
        )
      }
      height={0}
      width={250}
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
      quality={25}
    />
  )
}
