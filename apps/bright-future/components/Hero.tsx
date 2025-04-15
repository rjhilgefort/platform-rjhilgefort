'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

const Hero = () => {
  const pathname = usePathname()
  const router = useRouter()

  const scrollToPrograms = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (pathname === '/') {
      const programsSection = document.getElementById('programs-section')
      if (programsSection) {
        programsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    } else {
      router.push('/#programs-section')
    }
  }

  return (
    // <div className="hero min-h-[80vh] relative bg-radial from-primary/25 to-secondary/25">
    <div className="hero min-h-[80vh] relative bg-radial from-yellow-300/30 from-0% via-yellow-400/30 via-60% to-orange-500/30 to-100%">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      <div className="hero-content flex-col lg:flex-row-reverse z-10 gap-8">
        <div className="relative w-full lg:w-1/2 h-80 sm:h-96 lg:h-[32rem] rounded-xl overflow-hidden shadow-2xl">
          <Image
            src="/bf-building.jpg"
            alt="Bright Future Child Enrichment building"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end justify-center">
            <div className="text-center text-white p-8">
              <h2 className="text-3xl font-bold mb-4">Learning Through Play</h2>
              <p className="text-lg">
                Our play-based curriculum encourages creativity, curiosity, and
                confidence.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 lg:pr-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="text-accent font-bold">Bright Future</span>
            <span className="block text-3xl md:text-4xl mt-2">
              Child Enrichment
            </span>
          </h1>
          <div className="badge badge-secondary mt-2">Erlanger, KY</div>
          <p className="py-6 text-lg">
            Where every child&apos;s potential shines bright. Our nurturing
            environment fosters growth, curiosity, and joy in learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="btn btn-secondary">
              Schedule a Tour
            </Link>
            <a
              href="#programs-section"
              className="btn btn-outline"
              onClick={scrollToPrograms}
            >
              Explore Programs
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
