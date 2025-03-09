'use client'

import { pipe, Array } from 'effect'
import Image from 'next/image'
import { JSX, useEffect, useState } from 'react'
import { Array_shuffle } from '../utils/Array_shuffle'

const GalleryImage = ({ src, alt = '' }: { src: string; alt?: string }) => {
  return (
    <Image
      className="h-auto max-w-full rounded-lg"
      src={src}
      alt={alt}
      height={0}
      width={250}
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
    />
  )
}

const galleryImages = [
  '/gallery/2023-09-30_145135517-EDIT.jpg',
  '/gallery/AllyGirlsHike.jpeg',
  '/gallery/IMG20240329164347.jpg',
  '/gallery/IMG_0067.JPG',
  '/gallery/IMG_0199.jpg',
  '/gallery/IMG_0855.JPG',
  '/gallery/IMG_1349.jpeg',
  '/gallery/IMG_1676.jpeg',
  '/gallery/IMG_2690.JPG',
  '/gallery/IMG_3072.JPG',
  '/gallery/IMG_3980.jpeg',
  '/gallery/IMG_3984.jpeg',
  '/gallery/IMG_4052.jpeg',
  '/gallery/IMG_4119.jpeg',
  '/gallery/IMG_4253.jpeg',
  '/gallery/IMG_4319.JPG',
  '/gallery/IMG_5990.jpeg',
  '/gallery/IMG_6249 copy.jpeg',
  '/gallery/IMG_7248.JPG',
  '/gallery/IMG_8012.jpeg',
  '/gallery/IMG_8923.JPG',
  '/gallery/PXL_20230610_200008448.jpg',
  '/gallery/PXL_20230709_224939449.jpg',
  '/gallery/RaelinAllyPlaygroundLaugh.JPG',
  '/gallery/bikeAllyRob.jpeg',
  '/gallery/buchanan field girls ally.jpg',
  '/gallery/glowdisc.JPG',
  '/gallery/holidaywalkpic.jpeg',
]

const Gallery = () => {
  const [masonry, setMasonry] = useState<Array<JSX.Element>>([])

  useEffect(() => {
    const chunks = pipe(
      galleryImages,
      Array_shuffle,
      Array.chunksOf(7),
      Array.map((chunk, index) => (
        <div key={`gallery-chunk-${index}`} className="grid gap-4">
          {chunk.map((image, index) => (
            <div key={`gallery-image-${index}`}>
              <GalleryImage src={image} />
            </div>
          ))}
        </div>
      )),
    )

    setMasonry(chunks)
  }, [])

  return (
    <div className="w-full bg-base-200 py-5 flex flex-col justify-center items-center z-40 pl-4 pr-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {masonry}
        {/* <div className="grid gap-4">
          <div>
            <GalleryImage src="/images/gallery/ally-family-pic-1.png" />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg"
              alt=""
              width={100}
              height={100}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg"
              alt=""
              width={100}
              height={100}
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg"
              alt=""
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg"
              alt=""
              width={100}
              height={100}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg"
              alt=""
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg"
              alt=""
              width={100}
              height={100}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg"
              alt=""
              width={100}
              height={100}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg"
              alt=""
              width={100}
              height={100}
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg"
              alt=""
              width={100}
              height={100}
            />
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Gallery
