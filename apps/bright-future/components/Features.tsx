import { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <div className="text-5xl text-primary mb-4">{icon}</div>
        <h3 className="card-title text-xl font-bold">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

const Features = () => {
  const features = [
    {
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
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      title: 'Expert Teachers',
      description:
        'Our qualified educators are passionate about early childhood development and create enriching learning experiences.',
    },
    {
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
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
      title: 'Curriculum-Based Learning',
      description:
        'Age-appropriate activities designed to develop cognitive, social, emotional, and physical skills.',
    },
    {
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
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      title: 'Safe Environment',
      description:
        'Secure facilities with strict health and safety protocols to provide peace of mind for parents.',
    },
    {
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
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      title: 'Observation & Assessment',
      description:
        "Regular progress updates and parent-teacher conferences to keep you informed about your child's development.",
    },
  ]

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose <span className="text-primary">Bright Future</span>
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            We provide the foundation for lifelong learning in a safe, nurturing
            environment where children can explore, discover, and grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
