'use client'

import React from 'react'
import Image from 'next/image'

const BergenMeadowUpdatePage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Two column section: Image left, Text right */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Left column - Image */}
        <div className="md:w-1/2">
          <div className="bg-gray-200 h-full min-h-[300px] rounded-lg flex items-center justify-center">
            <Image
              src="/images/BM_backyard.jpeg"
              alt="Ally Hilgefort"
              className="rounded-lg shadow-xl"
              width={600}
              height={600}
            />
          </div>
        </div>

        {/* Right column - Text */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">Bergen Meadow Update</h1>
          <p className="mb-4">
            Ally and fellow neighbors are excited about this potential plan that
            the Evergreen Legacy Foundation (ELF) and several other
            organizations have collaborated on. Below you can see the update
            from ELF in their most recent newsletter.
          </p>
          <p className="mb-4">
            Ally and her husband put together this website to keep the community
            updated:
          </p>
          <a
            href="https://bergenmeadowupdate.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
            target="_blank"
            rel="noopener noreferrer"
          >
            BergenMeadowUpdate.com
          </a>
        </div>
      </div>

      {/* Full width images */}
      <div className="space-y-8 mb-12">
        {/* First image */}
        <div className="w-full rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/images/ELF_Newsletter_1.png"
            alt="Evergreen Legacy Foundation Newsletter"
            width={1200}
            height={800}
            className="w-full object-contain"
          />
        </div>

        {/* Second image */}
        <div className="w-full rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/images/ELF_Newsletter_2.png"
            alt="Ally Hilgefort"
            width={1200}
            height={800}
            className="w-full object-contain"
          />
        </div>
      </div>

      {/* Full width text line */}
      <div className="text-center mb-8">
        <p className="text-lg">
          To find out more about ELF and to subscribe to their newsletter, visit
          their website:{' '}
          <a href="https://www.evergreenlegacyfund.org">
            https://www.evergreenlegacyfund.org
          </a>
        </p>
      </div>
    </div>
  )
}

export default BergenMeadowUpdatePage
