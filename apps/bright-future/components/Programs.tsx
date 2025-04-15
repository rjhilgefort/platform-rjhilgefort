import Link from 'next/link'
import Image from 'next/image'

interface ProgramCardProps {
  title: string
  ageRange: string
  description: string
  imageSrc: string
}

const ProgramCard = ({
  title,
  ageRange,
  description,
  imageSrc,
}: ProgramCardProps) => {
  return (
    <div className="card lg:card-side bg-base-100 shadow-xl overflow-hidden">
      <figure className="relative h-[20rem] lg:h-auto lg:w-2/5">
        <Image
          src={imageSrc}
          alt={`${title} program`}
          fill
          className="object-cover"
        />
      </figure>
      <div className="card-body lg:w-3/5 py-10">
        <h3 className="card-title text-2xl font-bold text-primary mb-4">
          {title}
        </h3>
        <div className="badge badge-secondary mb-6">{ageRange}</div>
        <p className="mb-8 text-lg">{description}</p>
        <div className="h-6"></div> {/* Extra space at the bottom */}
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
      imageSrc: '/kids-1.jpg',
    },
    {
      title: 'Toddler Program',
      ageRange: '1 - 2 years',
      description:
        'Toddlers are curious explorers. Our program encourages independence, social skills, and language development through play-based learning and structured activities.',
      imageSrc: '/kids-3.jpg',
    },
    {
      title: 'Preschool',
      ageRange: '3 - 5 years',
      description:
        'Our preschool curriculum prepares children for kindergarten with a focus on pre-reading, math concepts, science exploration, and social-emotional development through engaging activities.',
      imageSrc: '/kids-5.jpeg',
    },
  ]

  return (
    <section id="programs-section" className="py-16 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Our Programs</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Age-appropriate learning experiences designed to nurture your
            child&apos;s development at every stage.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {programs.map((program, index) => (
            <ProgramCard
              key={index}
              title={program.title}
              ageRange={program.ageRange}
              description={program.description}
              imageSrc={program.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Programs
