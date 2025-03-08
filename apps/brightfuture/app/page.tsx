import Image from 'next/image'

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-[70vh] bg-gradient-to-b from-white via-blue-50 to-yellow-50">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <div className="mb-8 flex justify-center">
              <Image
                src="/bf-logo.jpeg"
                alt="Bright Future Preschool Logo"
                width={256}
                height={256}
                priority
                className="h-64 w-auto"
              />
            </div>
            <h1 className="mb-4 text-5xl font-bold text-bf-blue">
              Bright Future Preschool
            </h1>
            <p className="mb-8 text-xl text-bf-blue/90">
              Where every child's potential shines bright. Nurturing minds,
              inspiring hearts, and building the foundation for lifelong
              learning.
            </p>
            <button className="btn bg-bf-blue text-white hover:bg-bf-light-blue">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-bf-blue">
            Why Choose Bright Future?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="card border border-bf-blue/10 bg-white shadow-xl">
              <div className="card-body">
                <h3 className="card-title">
                  <svg
                    className="h-6 w-6 text-bf-yellow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="text-bf-blue">Expert Teachers</span>
                </h3>
                <p className="text-bf-blue/90">
                  Our certified educators bring years of experience and passion
                  to early childhood development.
                </p>
              </div>
            </div>
            <div className="card border border-bf-blue/10 bg-white shadow-xl">
              <div className="card-body">
                <h3 className="card-title">
                  <svg
                    className="h-6 w-6 text-bf-yellow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-bf-blue">Play-Based Learning</span>
                </h3>
                <p className="text-bf-blue/90">
                  We believe in learning through play, fostering creativity and
                  social skills naturally.
                </p>
              </div>
            </div>
            <div className="card border border-bf-blue/10 bg-white shadow-xl">
              <div className="card-body">
                <h3 className="card-title">
                  <svg
                    className="h-6 w-6 text-bf-yellow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-bf-blue">Safe Environment</span>
                </h3>
                <p className="text-bf-blue/90">
                  Your child's safety is our top priority, with secure
                  facilities and strict health protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-bf-blue">
            Our Programs
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="card border border-bf-blue/10 bg-white shadow-xl hover:shadow-2xl transition-shadow">
              <figure className="px-10 pt-10">
                <div className="h-32 w-32 rounded-full bg-bf-yellow/30 shadow-inner"></div>
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title text-xl font-bold text-bf-blue">
                  Toddlers (18-36 months)
                </h3>
                <p className="text-bf-blue/90">
                  Early development program focusing on motor skills and social
                  interaction.
                </p>
                <div className="card-actions">
                  <button className="btn bg-bf-blue text-white hover:bg-bf-light-blue">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            <div className="card border border-bf-blue/10 bg-white shadow-xl hover:shadow-2xl transition-shadow">
              <figure className="px-10 pt-10">
                <div className="h-32 w-32 rounded-full bg-bf-yellow/30 shadow-inner"></div>
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title text-xl font-bold text-bf-blue">
                  Preschool (3-4 years)
                </h3>
                <p className="text-bf-blue/90">
                  Comprehensive program with focus on literacy, numeracy, and
                  creative expression.
                </p>
                <div className="card-actions">
                  <button className="btn bg-bf-blue text-white hover:bg-bf-light-blue">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            <div className="card border border-bf-blue/10 bg-white shadow-xl hover:shadow-2xl transition-shadow">
              <figure className="px-10 pt-10">
                <div className="h-32 w-32 rounded-full bg-bf-yellow/30 shadow-inner"></div>
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title text-xl font-bold text-bf-blue">
                  Pre-K (4-5 years)
                </h3>
                <p className="text-bf-blue/90">
                  School readiness program preparing children for kindergarten
                  success.
                </p>
                <div className="card-actions">
                  <button className="btn bg-bf-blue text-white hover:bg-bf-light-blue">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bf-blue py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Give Your Child the Brightest Future
          </h2>
          <p className="mb-8 text-lg text-white">
            Limited enrollment spots available for the upcoming term.
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn bg-bf-yellow text-bf-blue hover:bg-bf-yellow/90">
              Enroll Now
            </button>
            <button className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-bf-blue">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Image
                src="/bf-building.jpg"
                alt="Bright Future Preschool Building"
                width={300}
                height={200}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold text-bf-blue">Location</h3>
              <address className="not-italic text-bf-blue/90">
                <p>3410 Turkeyfoot Rd</p>
                <p>Erlanger, KY 41018</p>
              </address>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href="https://maps.google.com/maps?q=Bright+Future+Child+Enrichment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bf-light-blue hover:text-bf-blue hover:underline"
                >
                  View on Google Maps
                </a>
                <a
                  href="https://maps.google.com/maps?q=Bright+Future+Child+Enrichment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bf-light-blue hover:text-bf-blue hover:underline"
                >
                  Get Directions
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold text-bf-blue">Hours</h3>
              <ul className="text-bf-blue/90">
                <li className="font-bold">Monday - Friday</li>
                <li>6:30 AM - 6:00 PM</li>
                <li className="font-bold">Saturday - Sunday</li>
                <li>Closed</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold text-bf-blue">Contact</h3>
              <ul className="text-bf-blue/90">
                <li>
                  <a
                    href="tel:+15137721760"
                    className="hover:text-bf-light-blue"
                  >
                    859-341-3350
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@brightfuture-preschool.com"
                    className="hover:text-bf-light-blue"
                  >
                    info@brightfuture-preschool.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-bf-blue/10 pt-8 text-center text-sm text-bf-blue/80">
            <p>
              © {new Date().getFullYear()} Bright Future Child Enrichment. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
