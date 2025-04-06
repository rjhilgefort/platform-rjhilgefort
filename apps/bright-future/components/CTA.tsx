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
                Located at 240 Main St in Florence, KY, we're open Monday
                through Friday from 6:30 AM to 6:00 PM. Call us at (559)
                581-1071 to schedule a tour and see our programs in action.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+15595811071" className="btn btn-primary">
                Call Now
              </a>
              <a
                href="https://www.google.com/maps/place/Bright+Future+Child+Enrichment/@39.0032551,-84.5853886,857m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8841b8418492cdd7:0xf03a67a4fca9ab77!8m2!3d39.0032551!4d-84.5828083!16s%2Fg%2F1td_cc7g"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
