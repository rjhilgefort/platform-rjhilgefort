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
        <div className="w-full bg-gray-200 h-[400px] rounded-lg flex items-center justify-center">
          <p className="text-gray-500">[Your Full Width Image 1]</p>
        </div>

        {/* Second image */}
        <div className="w-full bg-gray-200 h-[400px] rounded-lg flex items-center justify-center">
          <p className="text-gray-500">[Your Full Width Image 2]</p>
        </div>
      </div>

      {/* Full width text line */}
      <div className="text-center mb-8">
        <p className="text-lg">
          This is a small line of text that spans the full width of the page.
        </p>
      </div>
    </div>
  )
}

export default BergenMeadowUpdatePage
