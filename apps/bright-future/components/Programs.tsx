import Link from 'next/link'

interface ProgramCardProps {
  title: string
  ageRange: string
  description: string
  gradientClasses: string
  icon: React.ReactNode
  href: string
}

const ProgramCard = ({
  title,
  ageRange,
  description,
  gradientClasses,
  icon,
  href,
}: ProgramCardProps) => {
  return (
    <div className="card lg:card-side bg-base-100 shadow-xl overflow-hidden">
      <figure
        className={`relative h-64 lg:h-auto lg:w-2/5 ${gradientClasses} flex items-center justify-center`}
      >
        <div className="text-6xl text-white">{icon}</div>
      </figure>
      <div className="card-body lg:w-3/5">
        <h3 className="card-title text-2xl font-bold text-primary">{title}</h3>
        <div className="badge badge-secondary mb-2">{ageRange}</div>
        <p>{description}</p>
        <div className="card-actions justify-end mt-4">
          <Link href={href} className="btn btn-primary">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  )
}

const Programs = () => {
  const programs = [
    {
      title: 'Infant Care',
      ageRange: '6 weeks - 12 months',
      description:
        'Our infant program provides a nurturing environment where babies can develop at their own pace. We focus on language development, sensory experiences, and motor skills through one-on-one interaction.',
      gradientClasses: 'bg-gradient-to-br from-blue-400 to-blue-600',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 12h.01"></path>
          <path d="M15 12h.01"></path>
          <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path>
          <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path>
        </svg>
      ),
      href: '/programs/infants',
    },
    {
      title: 'Toddler Program',
      ageRange: '1 - 2 years',
      description:
        'Toddlers are curious explorers. Our program encourages independence, social skills, and language development through play-based learning and structured activities.',
      gradientClasses: 'bg-gradient-to-br from-green-400 to-green-600',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="5" r="3"></circle>
          <path d="m20 12-2.3-2.3a2.1 2.1 0 0 0-3 0l-2.3 2.3a2.1 2.1 0 0 1-3 0l-2.3-2.3a2.1 2.1 0 0 0-3 0L2 12"></path>
          <path d="M2 20h.01"></path>
          <path d="M7 20v-6"></path>
          <path d="M12 20v-3"></path>
          <path d="M17 20v-8"></path>
          <path d="M22 20h-.01"></path>
        </svg>
      ),
      href: '/programs/toddlers',
    },
    {
      title: 'Preschool',
      ageRange: '3 - 5 years',
      description:
        'Our preschool curriculum prepares children for kindergarten with a focus on pre-reading, math concepts, science exploration, and social-emotional development through engaging activities.',
      gradientClasses: 'bg-gradient-to-br from-purple-400 to-purple-600',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
          <path d="M8 7h6"></path>
          <path d="M8 11h8"></path>
          <path d="M8 15h6"></path>
        </svg>
      ),
      href: '/programs/preschool',
    },
  ]

  return (
    <section id="programs-section" className="py-16 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Our Programs</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Age-appropriate learning experiences designed to nurture your
            child's development at every stage.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {programs.map((program, index) => (
            <ProgramCard
              key={index}
              title={program.title}
              ageRange={program.ageRange}
              description={program.description}
              gradientClasses={program.gradientClasses}
              icon={program.icon}
              href={program.href}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Programs
