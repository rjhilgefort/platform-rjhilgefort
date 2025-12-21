import Image from 'next/image'
import { FaEnvelope, FaLinkedin, FaLocationDot, FaPhone } from 'react-icons/fa6'
import { profile, keyMetrics } from '../data/resume'

const Hero = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-base-200">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Profile Picture - shows first on mobile */}
          <div className="shrink-0 md:order-last">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-lg">
              <Image
                src="/profile.jpeg"
                alt={profile.name}
                width={224}
                height={224}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {profile.name},{' '}
              <span className="text-primary">{profile.credentials}</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-base-content/70 mb-4">
              {profile.title} at {profile.company}
            </h2>

            <div className="flex flex-wrap gap-4 mb-6 text-base-content/60">
              <span className="flex items-center gap-2">
                <FaLocationDot />
                {profile.location}
              </span>
              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-2 hover:text-primary transition"
              >
                <FaPhone />
                {profile.phone}
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 hover:text-primary transition"
              >
                <FaEnvelope />
                {profile.email}
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition"
              >
                <FaLinkedin />
                LinkedIn
              </a>
            </div>

            <p className="text-lg text-base-content/80 leading-relaxed">
              {profile.summary}
            </p>
          </div>
        </div>

        {/* Key Metrics - Full width below */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {keyMetrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-base-100 rounded-lg p-4 text-center shadow-sm"
            >
              <div className="text-2xl md:text-3xl font-bold text-primary">
                {metric.value}
              </div>
              <div className="text-sm text-base-content/60">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
