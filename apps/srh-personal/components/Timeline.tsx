'use client'

import { useState } from 'react'
import Image from 'next/image'
import { experience, Experience, Role } from '../data/resume'

const CompanyLogo = ({
  logo,
  initials,
  color,
  company,
}: {
  logo?: string
  initials: string
  color: string
  company: string
}) => {
  const [imgError, setImgError] = useState(false)

  if (logo && !imgError) {
    return (
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden bg-base-200 flex items-center justify-center shrink-0">
        <Image
          src={logo}
          alt={`${company} logo`}
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
      className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-sm md:text-base"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  )
}

const RoleSection = ({
  role,
  isFirst,
  showDates,
}: {
  role: Role
  isFirst: boolean
  showDates: boolean
}) => {
  return (
    <div className={isFirst ? '' : 'mt-6 pt-6 border-t border-base-300'}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-3">
        <h4 className="text-lg font-semibold">{role.title}</h4>
        {showDates && (
          <div className="text-sm text-base-content/60">
            {role.startDate} - {role.endDate}
          </div>
        )}
      </div>
      <ul className="space-y-2">
        {role.highlights.map((highlight, idx) => (
          <li
            key={idx}
            className="text-base-content/80 flex items-baseline gap-2 text-sm md:text-base"
          >
            <span className="text-primary shrink-0">&#8226;</span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const TimelineItem = ({
  item,
  isLast,
}: {
  item: Experience
  isLast: boolean
}) => {
  const firstRole = item.roles[0]
  const lastRole = item.roles[item.roles.length - 1]

  if (!firstRole || !lastRole) return null

  const dateRange = `${lastRole.startDate} - ${firstRole.endDate}`

  return (
    <div className="flex gap-4 md:gap-8">
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 bg-primary rounded-full shrink-0 mt-1.5" />
        {!isLast && <div className="w-0.5 bg-base-300 flex-1 min-h-8" />}
      </div>

      {/* Content */}
      <div className={`pb-8 ${isLast ? '' : 'pb-12'} flex-1`}>
        <div className="bg-base-100 rounded-lg p-6 shadow-sm hover:shadow-md transition">
          {/* Company header */}
          <div className="flex gap-4 mb-4">
            <CompanyLogo
              logo={item.logo}
              initials={item.logoInitials}
              color={item.logoColor}
              company={item.company}
            />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 flex-1">
              <div>
                <h3 className="text-xl font-bold text-primary">{item.company}</h3>
                <p className="text-sm text-base-content/60">{item.location}</p>
              </div>
              <div className="text-sm text-base-content/60 md:text-right">
                <div>{dateRange}</div>
                <div>{item.totalDuration}</div>
              </div>
            </div>
          </div>

          {/* Roles */}
          {item.roles.map((role, idx) => (
            <RoleSection
              key={`${role.title}-${role.startDate}`}
              role={role}
              isFirst={idx === 0}
              showDates={item.roles.length > 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const Timeline = () => {
  return (
    <section id="experience" className="py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Experience
        </h2>

        <div className="relative">
          {experience.map((item, index) => (
            <TimelineItem
              key={item.company}
              item={item}
              isLast={index === experience.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Timeline
