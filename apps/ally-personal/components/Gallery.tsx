'use client'

import { pipe, Array } from 'effect'
import { JSX, useEffect, useState } from 'react'
import { Array_shuffle } from '../utils/Array_shuffle'
import { GalleryImage } from './GalleryImage'

const galleryImages = [
  '/gallery/backpacking-fourpassloop-buckskinpass-snowmassbackground-ally.png',
  '/gallery/backpacking-fourpassloop-westmaroonpass-ally.png',
  '/gallery/bike-trailsneighborhood-ally-rob.png',
  '/gallery/buchananfestival-ally-jesselin-raelin-rob-auntaly-miminormarashid.png',
  '/gallery/campout-buchanan-ally-rob-jesselin.png',
  '/gallery/chilloutfest-amazingracefamily-buchanan-ally-rob.png',
  '/gallery/chilloutfest-amazingracefamily-hilgeforts-wilsons.png',
  '/gallery/discgolf-buchanan-ally.png',
  '/gallery/easteregghunt-buchanan-ally-jesselin.png',
  '/gallery/foothillsfourth-buchanan-ally-jesselin.png',
  '/gallery/foothillsfourth-buchanan-ally-raelin.png',
  '/gallery/glowdisctourney-buchanan-ally-raelin.png',
  '/gallery/hike-ally-jesselin-rob-raelin.png',
  '/gallery/hike-dedisse-ally-raelin.png',
  '/gallery/hike-naylorlake-ally-jesselin-raelin.png',
  '/gallery/holidaywalk-evergreen-all-jesselin-raelin-auntaimee.png',
  '/gallery/hopsdrops-ally-jesselin.png',
  '/gallery/iceskate-evergreenlake-ally-jesselin-rob-raelin-grandmacarolynjump.png',
  '/gallery/kayak-ally-jesselin-raelin.png',
  '/gallery/oktoberfest-buchanan-ally-jesselin-raelin-friends.png',
  '/gallery/ski-echo-ally.png',
  '/gallery/stagecoachpark-raelin-birthday-ally.png',
  '/gallery/sup-paddleboarding-evergreenlake-ally-jesselin.png',
  '/gallery/teardropcamp-ally-rob-jesselin-raelin.png',
  '/gallery/treecutting-ally-rob-jesselin-raelin-torrey.png',
  '/gallery/tuscanytavern-ally-raelin.png',
  '/gallery/walk-wahrun-trailsneighborhood-hilgeforts.png',
  '/gallery/walkbike-trailsneighborhood-ally-raelin.png',
]

const Gallery = () => {
  const [masonry, setMasonry] = useState<Array<JSX.Element>>([])

  useEffect(() => {
    const galleryImagesShuffled = pipe(
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

    setMasonry(galleryImagesShuffled)
  }, [])

  return (
    <div className="w-full bg-base-200 py-5 flex flex-col justify-center items-center z-40 pl-4 pr-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{masonry}</div>
    </div>
  )
}

export default Gallery
