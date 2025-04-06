'use client'

import Link from 'next/link'

const Hero = () => {
  const scrollToPrograms = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const programsSection = document.getElementById('programs-section')
    if (programsSection) {
      programsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <div className="hero min-h-[80vh] relative bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      <div className="hero-content flex-col lg:flex-row-reverse z-10">
        <div className="relative w-full max-w-lg h-80 sm:h-96 lg:h-[32rem] rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/70 to-secondary/70 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h2 className="text-3xl font-bold mb-4">Learning Through Play</h2>
            <p className="text-lg">
              Our play-based curriculum encourages creativity, curiosity, and
              confidence.
            </p>
          </div>
        </div>
        <div className="max-w-md lg:mr-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="text-primary">Bright</span>
            <span className="text-secondary">Future</span>
            <span className="block text-3xl md:text-4xl mt-2">
              Child Enrichment
            </span>
          </h1>
          <div className="badge badge-primary mt-2">Florence, KY</div>
          <p className="py-6 text-lg">
            Where every child's potential shines bright. Our nurturing
            environment fosters growth, curiosity, and joy in learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="btn btn-primary">
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
