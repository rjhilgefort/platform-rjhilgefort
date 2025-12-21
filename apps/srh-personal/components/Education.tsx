'use client'

import { useState } from 'react'
import Image from 'next/image'
import { education, Education as EducationType } from '../data/resume'

const SchoolLogo = ({ edu }: { edu: EducationType }) => {
  const [imgError, setImgError] = useState(false)

  if (edu.logo && !imgError) {
    return (
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-base-200 flex items-center justify-center shrink-0">
        <Image
          src={edu.logo}
          alt={`${edu.school} logo`}
          width={56}
          height={56}
          className="object-contain w-full h-full p-1"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  return (
    <div
      className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-sm"
      style={{ backgroundColor: edu.logoColor }}
    >
      {edu.logoInitials}
    </div>
  )
}

const Education = () => {
  return (
    <section id="education" className="py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Education
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {education.map((edu) => (
            <div
              key={`${edu.school}-${edu.degree}`}
              className="bg-base-100 rounded-lg p-6 shadow-sm border border-base-300 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <SchoolLogo edu={edu} />
                <div>
                  <h3 className="text-lg font-semibold">{edu.degree}</h3>
                  <p className="text-primary">{edu.school}</p>
                  <p className="text-base-content/70 text-sm mt-1">
                    {edu.field}
                  </p>
                  <p className="text-base-content/50 text-sm mt-1">
                    {edu.startYear} - {edu.endYear}
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

export default Education
