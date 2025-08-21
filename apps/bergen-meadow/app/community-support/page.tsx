'use client'

import React from 'react'
import Image from 'next/image'
import { FaRegFilePdf, FaExternalLinkAlt, FaDownload } from 'react-icons/fa'

const CommunitySupportPage = () => {
  const letters = [
    {
      name: 'Evergreen Legacy Foundation',
      logoSrc: '/ELF-logo.avif',
      pdfSrc: '/ELF-support-letter.pdf',
    },
    {
      name: 'Seniors4Wellness',
      logoSrc: '/Seniors4Wellness-logo.avif',
      pdfSrc: '/Seniors4Wellness-support-letter.pdf',
    },
    {
      name: 'Blue Spruce Habitat for Humanity',
      logoSrc: '/Habitat-logo.png',
      pdfSrc: '/Habitat-support-letter.pdf',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Community Support Letters
      </h1>
      <p className="text-center text-base-content/70 max-w-3xl mx-auto mb-10">
        These local organizations have expressed support for Bergen
        Meadow&apos;s potential plan.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {letters.map((org) => (
          <div key={org.name} className="card bg-base-200 shadow">
            <div className="card-body">
              <div className="flex items-center justify-center mb-4">
                <Image
                  src={org.logoSrc}
                  alt={`${org.name} logo`}
                  width={400}
                  height={160}
                  className="h-24 w-full object-contain"
                />
              </div>
              <h2 className="card-title text-xl text-center justify-center mb-2">
                {org.name}
              </h2>

              <div className="card-actions justify-center mt-2 gap-2">
                <a
                  href={org.pdfSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  <FaRegFilePdf className="mr-2" /> View letter{' '}
                  <FaExternalLinkAlt className="ml-2 opacity-80" />
                </a>
                <a href={org.pdfSrc} download className="btn btn-ghost btn-sm">
                  <FaDownload className="mr-2" /> Download PDF
                </a>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-base-content/70">
                  Quick preview
                </summary>
                <div className="mt-3 rounded-box overflow-hidden bg-base-300">
                  <iframe
                    src={`${org.pdfSrc}#toolbar=0&view=FitH`}
                    title={`${org.name} letter preview`}
                    className="w-full block"
                    style={{ height: 420 }}
                  />
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommunitySupportPage
