import { Metadata } from 'next'
import Link from 'next/link'
import HeroWithImage from '../components/HeroWithImage'
import OptionalImage from '../components/OptionalImage'

export const metadata: Metadata = {
  title: 'Premium Bourbon Tasting Events in Cincinnati | Proof & Pour',
  description: 'Elevate your bourbon experience with Proof & Pour. Private bourbon tasting events in Cincinnati for corporate teams, special occasions, and enthusiasts. Expert-hosted bourbon education and cocktail experiences.',
  keywords: 'bourbon tasting Cincinnati, private bourbon events, bourbon host Cincinnati, whiskey tasting, corporate bourbon events, bourbon education',
}

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroWithImage
        imageSrc="/images/hero/homepage-hero.jpg"
        imageAlt="Bourbon tasting experience"
      >
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold mb-4">Elevate Your Bourbon Experience</h1>
          <h2 className="text-2xl mb-6">Premium Bourbon Tasting Events in Cincinnati</h2>
          <p className="py-6 text-lg">
            Discover the art of bourbon tasting with expert-hosted private events. Perfect for corporate teams,
            special occasions, and bourbon enthusiasts looking to deepen their knowledge and appreciation.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact" className="btn btn-primary btn-lg">Book Your Event</Link>
            <Link href="/education" className="btn btn-outline btn-lg">Learn About Bourbon</Link>
          </div>
        </div>
      </HeroWithImage>

      {/* Three Pillars Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Learn. Mix. Discover.</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl">Learn</h3>
              <p>
                Master the fundamentals of bourbon tasting. From understanding mash bills to identifying tasting notes,
                we provide comprehensive bourbon education for all experience levels.
              </p>
              <div className="card-actions justify-end">
                <Link href="/education" className="btn btn-primary">Bourbon 101</Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl">Mix</h3>
              <p>
                Explore classic and creative bourbon cocktails. Learn to craft the perfect Old Fashioned, Manhattan,
                and other bourbon-forward cocktails from our curated recipe collection.
              </p>
              <div className="card-actions justify-end">
                <Link href="/recipes" className="btn btn-primary">View Recipes</Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl">Discover</h3>
              <p>
                Find your next favorite bourbon. We feature exceptional bottles from Buffalo Trace, Maker's Mark,
                Woodford Reserve, Four Roses, and more to expand your bourbon journey.
              </p>
              <div className="card-actions justify-end">
                <Link href="/shop" className="btn btn-primary">Explore Bourbons</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Brands Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Bourbons</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <figure className="px-4 pt-4">
                <OptionalImage
                  src="/images/bourbons/buffalo-trace.jpg"
                  alt="Buffalo Trace Bourbon"
                  width={300}
                  height={450}
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">Buffalo Trace</h3>
                <p>Award-winning Kentucky straight bourbon with rich complexity and smooth finish.</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure className="px-4 pt-4">
                <OptionalImage
                  src="/images/bourbons/makers-mark.jpg"
                  alt="Maker's Mark Bourbon"
                  width={300}
                  height={450}
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">Maker's Mark</h3>
                <p>Iconic wheated bourbon known for its smooth, approachable character and distinctive red wax seal.</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure className="px-4 pt-4">
                <OptionalImage
                  src="/images/bourbons/woodford-reserve.jpg"
                  alt="Woodford Reserve Bourbon"
                  width={300}
                  height={450}
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">Woodford Reserve</h3>
                <p>Premium small-batch bourbon crafted with precision and attention to detail.</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure className="px-4 pt-4">
                <OptionalImage
                  src="/images/bourbons/four-roses.jpg"
                  alt="Four Roses Bourbon"
                  width={300}
                  height={450}
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">Four Roses</h3>
                <p>Distinctive bourbon with 10 unique recipes, offering diverse flavor profiles to explore.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-3xl mb-4">Ready to Start Your Bourbon Journey?</h2>
            <p className="text-lg mb-6">
              Book a private tasting event and discover the art of bourbon with expert guidance.
            </p>
            <Link href="/contact" className="btn btn-secondary btn-lg">Book Your Event</Link>
          </div>
        </div>
      </div>

      {/* Local SEO Section */}
      <div className="bg-base-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Serving the Greater Cincinnati Area</h2>
          <p className="text-lg">
            Proof & Pour provides premium private bourbon tasting events throughout Cincinnati and surrounding communities.
            Whether you're hosting a corporate team-building event, celebrating a milestone, or gathering bourbon enthusiasts,
            we bring expert-hosted bourbon experiences to your venue.
          </p>
        </div>
      </div>
    </div>
  )
}
