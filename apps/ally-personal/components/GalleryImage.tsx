import { pipe, Array, String, Option } from 'effect'
import Image from 'next/image'
import { String_titleCase } from '../utils/String_titleCase'

export const GalleryImage = ({ src, alt }: { src: string; alt?: string }) => {
  const altTooltipText =
    alt ??
    pipe(
      src,
      String.split('.'),
      Array.dropRight(1),
      Array.head,
      Option.map(String.split('/')),
      Option.flatMap(Array.last),
      Option.map(String.split('-')),
      Option.map(Array.map(String_titleCase)),
      Option.map(Array.prepend('💬')),
      Option.map(Array.join(' ')),
      Option.getOrElse(() => src),
    )
  return (
    <div
      className="h-auto max-w-full tooltip tooltip-bottom"
      data-tip={altTooltipText}
    >
      <Image
        className="rounded-lg"
        src={src}
        alt={altTooltipText}
        height={0}
        width={450}
      />
    </div>
  )
}
