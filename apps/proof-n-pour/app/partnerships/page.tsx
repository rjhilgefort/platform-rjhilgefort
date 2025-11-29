import { Metadata } from 'next'
import Link from 'next/link'
import CalendlyEmbed from '../../components/CalendlyEmbed'
import HeroImage from '../../components/HeroImage'

export const metadata: Metadata = {
  title: 'Work With Proof & Pour | Brand Partnerships & Event Booking',
  description: 'Partner with Proof & Pour for bourbon events, brand collaborations, and corporate tastings in Cincinnati. Book your private bourbon tasting experience today.',
  keywords: 'bourbon influencer, brand collaborations, corporate bourbon events, private bourbon tastings Cincinnati',
}

export default function PartnershipsPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero min-h-[300px] bg-base-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-base-300/90 to-base-300/70">
          <HeroImage
            src="/images/hero/partnerships-hero.jpg"
            alt="Work With Proof & Pour"
          />
        </div>
        <div className="hero-content text-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Work With Me</h1>
            <p className="text-xl">Book Events & Explore Partnership Opportunities</p>
          </div>
        </div>
      </div>

      {/* Event Booking Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Book Your Cincinnati Bourbon Tasting</h2>
          <p className="text-lg text-base-content/70 mb-8">
            Ready to elevate your event with an expert-hosted bourbon tasting? Schedule a consultation to discuss
            your event details, preferences, and availability.
          </p>

          {/* Event Types Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Private Tastings</h3>
                <p className="text-sm">
                  Intimate bourbon experiences for small groups of friends or family. Perfect for celebrations,
                  special occasions, or just bourbon enthusiasts gathering together.
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>4-12 guests ideal</li>
                  <li>2-3 hour experience</li>
                  <li>Curated bourbon selection</li>
                  <li>Educational format</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Corporate Events</h3>
                <p className="text-sm">
                  Sophisticated team-building experiences that combine bourbon education with engaging group activities.
                  Perfect for client entertainment or employee appreciation.
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>10-30 guests</li>
                  <li>Flexible timing</li>
                  <li>Team-building focus</li>
                  <li>Custom experiences</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Special Occasions</h3>
                <p className="text-sm">
                  Memorable bourbon experiences for birthdays, anniversaries, bachelor parties, or milestone celebrations.
                  Make your special day unforgettable.
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Flexible group sizes</li>
                  <li>Celebration-focused</li>
                  <li>Gift certificates available</li>
                  <li>Memorable experience</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Calendly Booking Widget */}
          <div className="bg-base-300 rounded-xl p-4">
            <CalendlyEmbed />
          </div>

          {/* Alternative Contact CTA */}
          <div className="text-center mt-8">
            <p className="text-base-content/70 mb-4">
              Prefer to discuss your event directly? We'd love to hear from you.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Contact Us Instead
            </Link>
          </div>
        </div>
      </div>

      {/* Service Area */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Serving Greater Cincinnati</h2>
            <p className="text-lg text-center mb-8">
              Proof & Pour provides private bourbon tasting events throughout the Cincinnati area, including:
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="card bg-base-100">
                <div className="card-body">
                  <p className="font-semibold">Cincinnati</p>
                  <p className="text-sm text-base-content/70">Downtown, OTR, Hyde Park</p>
                </div>
              </div>
              <div className="card bg-base-100">
                <div className="card-body">
                  <p className="font-semibold">Northern Kentucky</p>
                  <p className="text-sm text-base-content/70">Covington, Newport, Fort Thomas</p>
                </div>
              </div>
              <div className="card bg-base-100">
                <div className="card-body">
                  <p className="font-semibold">Surrounding Areas</p>
                  <p className="text-sm text-base-content/70">Mason, West Chester, Blue Ash</p>
                </div>
              </div>
            </div>
            <p className="text-center mt-6 text-base-content/70">
              Other locations may be available. Contact us to discuss your venue.
            </p>
          </div>
        </div>
      </div>

      {/* Brand Partnerships Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Brand Partnership Opportunities</h2>

          <div className="prose max-w-none mb-8">
            <p className="text-lg">
              Proof & Pour partners with bourbon brands, distilleries, bars, restaurants, and spirits-related businesses
              to create authentic, engaging content and experiences for bourbon enthusiasts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">What We Offer</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Private tasting event partnerships</li>
                  <li>Brand features in educational content</li>
                  <li>Social media promotion (coming soon)</li>
                  <li>YouTube channel collaborations (launching)</li>
                  <li>Email newsletter features</li>
                  <li>Distillery visit coverage</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Ideal Partners</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Bourbon & whiskey brands</li>
                  <li>Kentucky distilleries</li>
                  <li>Local bars & restaurants</li>
                  <li>Spirits retailers</li>
                  <li>Barware & glassware companies</li>
                  <li>Food & beverage brands</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card bg-primary text-primary-content shadow-xl mt-8">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-2">Interested in Partnering?</h3>
              <p className="mb-4">
                We're always open to creative collaborations that provide value to bourbon enthusiasts. Let's discuss
                how we can work together.
              </p>
              <div className="card-actions">
                <Link href="/contact" className="btn btn-secondary">
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">What Clients Say</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <p className="italic text-sm">
                    "Amazing corporate event! Our team learned so much about bourbon and had a fantastic time.
                    Highly professional and engaging."
                  </p>
                  <p className="text-sm text-right mt-4 font-semibold">— Corporate Client, Cincinnati</p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <p className="italic text-sm">
                    "Perfect way to celebrate my husband's 50th birthday. The host was knowledgeable, entertaining,
                    and made the experience special for everyone."
                  </p>
                  <p className="text-sm text-right mt-4 font-semibold">— Private Event, Mason</p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <p className="italic text-sm">
                    "As bourbon lovers, we thought we knew a lot. This tasting showed us there's always more to learn.
                    Excellent experience!"
                  </p>
                  <p className="text-sm text-right mt-4 font-semibold">— Bourbon Enthusiasts, Newport</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
