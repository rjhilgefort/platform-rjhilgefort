'use client'

import { useState } from 'react'
import Image from 'next/image'
import { volunteering, Volunteer } from '../data/resume'

const VolunteerLogo = ({ vol }: { vol: Volunteer }) => {
  const [imgError, setImgError] = useState(false)

  if (vol.logo && !imgError) {
    return (
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-base-200 flex items-center justify-center shrink-0">
        <Image
          src={vol.logo}
          alt={`${vol.organization} logo`}
          width={48}
          height={48}
          className="object-contain w-full h-full p-1"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  return (
    <div
      className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-sm"
      style={{ backgroundColor: vol.logoColor }}
    >
      {vol.logoInitials}
    </div>
  )
}

const Volunteering = () => {
  return (
    <section id="volunteering" className="py-16 md:py-24 bg-base-200">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Volunteering
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {volunteering.map((vol) => (
            <div
              key={vol.organization}
              className="bg-base-100 rounded-lg p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex gap-4">
                <VolunteerLogo vol={vol} />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{vol.role}</h3>
                  <p className="text-primary">{vol.organization}</p>
                  <p className="text-sm text-base-content/60 mt-1">
                    {vol.startDate} - {vol.endDate} ({vol.duration})
                  </p>
                  <p className="text-base-content/80 mt-3 text-sm">
                    {vol.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Volunteering
