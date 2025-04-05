import Link from 'next/link'

const CTA = () => {
  return (
    <section className="py-16 bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center md:text-left md:flex md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold">
                Ready to Give Your Child a Bright Future?
              </h2>
              <p className="mt-2 text-lg max-w-2xl">
                Schedule a tour of our facility and see our programs in action.
                We'd love to show you around and answer any questions you may
                have.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn btn-primary">
                Schedule a Tour
              </Link>
              <Link href="/enroll" className="btn btn-outline">
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
