'use client'

import { pipe, Array } from 'effect'
import { JSX, useEffect, useState } from 'react'
import { Array_shuffle } from '../utils/Array_shuffle'
import { GalleryImage } from './GalleryImage'

const galleryImages = [
  '/gallery/backpacking-fourpassloop-buckskinpass-snowmassbackground-ally.JPG',
  '/gallery/backpacking-fourpassloop-westmaroonpass-ally.JPG',
  '/gallery/bike-trailsneighborhood-ally-rob.jpeg',
  '/gallery/buchananfestival-ally-jesselin-raelin-rob-auntaly-miminormarashid.JPG',
  '/gallery/campout-buchanan-ally-rob-jesselin.jpeg',
  '/gallery/chilloutfest-amazingracefamily-buchanan-ally-rob.jpeg',
  '/gallery/chilloutfest-amazingracefamily-hilgeforts-wilsons.JPG',
  '/gallery/discgolf-buchanan-ally.jpeg',
  '/gallery/easteregghunt-buchanan-ally-jesselin.jpg',
  '/gallery/foothillsfourth-buchanan-ally-jesselin.jpeg',
  '/gallery/foothillsfourth-buchanan-ally-raelin.JPG',
  '/gallery/glowdisctourney-buchanan-ally-raelin.JPG',
  '/gallery/hike-ally-jesselin-rob-raelin.jpeg',
  '/gallery/hike-dedisse-ally-raelin.jpeg',
  '/gallery/hike-naylorlake-ally-jesselin-raelin.jpeg',
  '/gallery/holidaywalk-evergreen-all-jesselin-raelin-auntaimee.jpeg',
  '/gallery/hopsdrops-ally-jesselin.jpg',
  '/gallery/iceskate-evergreenlake-ally-jesselin-rob-raelin-grandmacarolynjump.jpeg',
  '/gallery/kayak-ally-jesselin-raelin.jpeg',
  '/gallery/oktoberfest-buchanan-ally-jesselin-raelin-friends.jpg',
  '/gallery/ski-echo-ally.jpg',
  '/gallery/stagecoachpark-raelin-birthday-ally.JPG',
  '/gallery/sup-paddleboarding-evergreenlake-ally-jesselin.jpeg',
  '/gallery/teardropcamp-ally-rob-jesselin-raelin.jpg',
  '/gallery/treecutting-ally-rob-jesselin-raelin-torrey.jpeg',
  '/gallery/tuscanytavern-ally-raelin.JPG',
  '/gallery/walk-wahrun-trailsneighborhood-hilgeforts.jpg',
  '/gallery/walkbike-trailsneighborhood-ally-raelin.JPG',
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
