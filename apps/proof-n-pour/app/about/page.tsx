import { Metadata } from 'next'
import Link from 'next/link'
import HeroImage from '../../components/HeroImage'
import OptionalImage from '../../components/OptionalImage'

export const metadata: Metadata = {
  title: 'About Proof & Pour | Bourbon Expert & Event Host',
  description: 'Learn about Proof & Pour, Cincinnati\'s premier bourbon tasting event company. Expert-hosted bourbon education and private tasting experiences for corporate events and special occasions.',
  keywords: 'bourbon expert, spirits educator, Cincinnati bourbon events, bourbon host',
}

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero min-h-[300px] bg-base-200 relative">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-base-300/90 to-base-300/70">
          <HeroImage
            src="/images/hero/about-hero.jpg"
            alt="About Proof & Pour"
          />
        </div>
        <div className="hero-content text-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">About Proof & Pour</h1>
            <p className="text-xl">Cincinnati's Premier Bourbon Tasting Experience</p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg mb-4">
            At Proof & Pour, we believe bourbon is more than just a spirit—it's a journey of discovery, craftsmanship,
            and shared experiences. Our mission is to elevate bourbon appreciation through expertly curated private tasting
            events that educate, engage, and inspire.
          </p>
          <p className="text-lg mb-4">
            Based in Cincinnati, we bring the art of bourbon tasting to your venue, whether it's a corporate team-building
            event, milestone celebration, or intimate gathering of bourbon enthusiasts. Each event is tailored to your
            group's experience level and preferences, ensuring an unforgettable bourbon experience.
          </p>
        </div>
      </div>

      {/* What We Do Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
              <figure>
                <OptionalImage
                  src="/images/events/private-tasting.jpg"
                  alt="Private bourbon tasting"
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">Private Tastings</h3>
                <p>
                  Curated bourbon tasting experiences featuring premium selections from Buffalo Trace, Maker's Mark,
                  Woodford Reserve, Four Roses, and other exceptional distilleries. Learn to identify flavor profiles,
                  understand production methods, and discover your bourbon preferences.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <OptionalImage
                  src="/images/events/corporate-event.jpg"
                  alt="Corporate bourbon event"
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">Corporate Events</h3>
                <p>
                  Elevate your team-building with sophisticated bourbon education. Our corporate tasting events provide
                  an engaging, interactive experience that brings colleagues together while learning about America's
                  native spirit.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <OptionalImage
                  src="/images/bourbons/woodford-reserve.jpg"
                  alt="Special occasion bourbon"
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">Special Occasions</h3>
                <p>
                  Make your milestone celebration memorable with a guided bourbon tasting. Perfect for birthdays,
                  anniversaries, bachelor parties, or any occasion deserving of exceptional bourbon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expertise Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Your Host</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3">
              <OptionalImage
                src="/images/about/host-photo.jpg"
                alt="Your Proof & Pour Host"
                width={400}
                height={500}
                className="rounded-xl shadow-xl w-full object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <p className="text-lg mb-4">
                Your Proof & Pour host brings extensive bourbon knowledge and passion for spirits education. With deep
                understanding of bourbon production, history, and tasting techniques, we guide guests through an engaging
                and informative experience.
              </p>
              <p className="text-lg mb-4">
                From understanding the significance of mash bills and barrel char levels to identifying subtle flavor notes
                and comparing regional styles, we make bourbon education accessible and enjoyable for all experience levels—from
                bourbon beginners to seasoned enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Proof & Pour</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Expert Guidance</h3>
                <p>
                  Knowledgeable host who makes bourbon education engaging and accessible for all experience levels.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Curated Selection</h3>
                <p>
                  Carefully chosen bourbons that showcase diverse flavor profiles and production techniques.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Flexible Format</h3>
                <p>
                  Events tailored to your venue, group size, and preferences for a personalized experience.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Cincinnati Based</h3>
                <p>
                  Local expertise serving the Greater Cincinnati area with convenient scheduling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="card bg-primary text-primary-content shadow-xl max-w-3xl mx-auto">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-3xl mb-4">Ready to Book Your Event?</h2>
            <p className="text-lg mb-6">
              Let's create an unforgettable bourbon tasting experience for your group.
            </p>
            <Link href="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
