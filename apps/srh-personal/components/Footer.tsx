import { FaEnvelope, FaLinkedin } from 'react-icons/fa6'
import { profile } from '../data/resume'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-base-300 py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-base-content/60 text-sm">
            &copy; {currentYear} {profile.name}
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="btn btn-ghost btn-sm"
              aria-label="Email"
            >
              <FaEnvelope className="text-lg" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-lg" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
