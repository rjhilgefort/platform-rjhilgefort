import { Metadata } from 'next'
import Link from 'next/link'
import HeroImage from '../../components/HeroImage'
import OptionalImage from '../../components/OptionalImage'

export const metadata: Metadata = {
  title: 'Bourbon Shop & Recommendations | Barware & Accessories | Proof & Pour',
  description: 'Shop our curated selection of bourbon recommendations, premium barware, tasting journals, and whiskey accessories. Find the perfect tools for your bourbon journey.',
  keywords: 'bourbon barware, whiskey accessories, cocktail kits, bourbon gifts, tasting journal',
}

const featuredBourbons = [
  {
    name: 'Buffalo Trace',
    description: 'Award-winning Kentucky straight bourbon with notes of vanilla, caramel, and oak. An exceptional value bourbon perfect for sipping or mixing.',
    price: '$25-30',
    abv: '45%',
    image: '/images/bourbons/buffalo-trace.jpg',
  },
  {
    name: 'Maker\'s Mark',
    description: 'Distinctive wheated bourbon with smooth, approachable character. Sweet with hints of caramel and wheat bread.',
    price: '$28-32',
    abv: '45%',
    image: '/images/bourbons/makers-mark.jpg',
  },
  {
    name: 'Woodford Reserve',
    description: 'Premium small-batch bourbon with rich, complex flavors. Notes of dried fruit, vanilla, and toasted oak.',
    price: '$32-38',
    abv: '45.2%',
    image: '/images/bourbons/woodford-reserve.jpg',
  },
  {
    name: 'Four Roses Small Batch',
    description: 'Blend of four bourbon recipes creating layers of spice, fruit, and floral notes. Smooth and versatile.',
    price: '$30-35',
    abv: '45%',
    image: '/images/bourbons/four-roses.jpg',
  },
]

const barware = [
  {
    category: 'Glassware',
    items: [
      'Rocks glasses (double old fashioned)',
      'Glencairn whiskey glasses',
      'Coupe glasses',
      'Julep cups',
    ],
  },
  {
    category: 'Bar Tools',
    items: [
      'Cocktail shaker set',
      'Bar spoon',
      'Jigger (measuring tool)',
      'Muddler',
      'Strainer',
      'Channel knife for garnishes',
    ],
  },
  {
    category: 'Accessories',
    items: [
      'Large ice cube trays',
      'Whiskey stones',
      'Decanters',
      'Cork coasters',
      'Bar mat',
    ],
  },
  {
    category: 'Digital Products',
    items: [
      'Bourbon Tasting Journal (PDF)',
      'Cocktail Recipe eBook',
      'Home Bar Setup Guide',
      'Bourbon Gift Guide',
    ],
  },
]

export default function ShopPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero min-h-[300px] bg-base-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-base-300/90 to-base-300/70">
          <HeroImage
            src="/images/hero/shop-hero.jpg"
            alt="Bourbon Shop"
          />
        </div>
        <div className="hero-content text-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Shop & Recommendations</h1>
            <p className="text-xl">Curated Bourbon Selections & Essential Bar Tools</p>
          </div>
        </div>
      </div>

      {/* Featured Bourbons Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Our Featured Bourbons</h2>
          <p className="text-lg mb-8 text-base-content/70">
            These are the exceptional bourbons we feature at our tasting events. Each represents outstanding quality
            and value, perfect for both newcomers and experienced bourbon enthusiasts.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {featuredBourbons.map((bourbon, index) => (
              <div key={index} className="card card-side bg-base-100 shadow-xl">
                <figure className="w-1/3 min-w-[120px]">
                  <OptionalImage
                    src={bourbon.image}
                    alt={bourbon.name}
                    width={200}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </figure>
                <div className="card-body w-2/3">
                  <h3 className="card-title text-2xl">{bourbon.name}</h3>
                  <div className="flex gap-4 text-sm text-base-content/70 mb-2">
                    <span className="badge badge-outline">{bourbon.abv} ABV</span>
                    <span className="badge badge-outline">{bourbon.price}</span>
                  </div>
                  <p>{bourbon.description}</p>
                  <div className="card-actions justify-end mt-4">
                    <a href="#" className="btn btn-primary btn-sm">Find Near You</a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="alert alert-info mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Prices are approximate and may vary by location. We are not affiliated with these brands but feature them at our tasting events.</span>
          </div>
        </div>
      </div>

      {/* Barware Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Essential Barware & Accessories</h2>
            <p className="text-lg mb-8 text-base-content/70">
              Build your home bar with quality tools and accessories. These items will elevate your bourbon
              tasting and cocktail-making experience.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {barware.map((category, index) => (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">{category.category}</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      {category.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-base-content/70 mb-4">
                Affiliate links coming soon! We'll recommend specific products that we trust and use.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Guide Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Bourbon Gift Ideas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">For Beginners</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Buffalo Trace or Maker's Mark</li>
                  <li>Set of rocks glasses</li>
                  <li>Bourbon tasting journal</li>
                  <li>Cocktail recipe book</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">For Enthusiasts</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Woodford Reserve or Four Roses Single Barrel</li>
                  <li>Glencairn glass set</li>
                  <li>Premium bar tool kit</li>
                  <li>Crystal decanter</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">The Experience</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Private tasting event</li>
                  <li>Distillery tour tickets</li>
                  <li>Bourbon club membership</li>
                  <li>Cocktail class</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="card bg-primary text-primary-content shadow-xl max-w-3xl mx-auto">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-3xl mb-4">Not Sure Where to Start?</h2>
              <p className="text-lg mb-6">
                Book a private tasting event where you'll sample these bourbons and get personalized recommendations
                based on your taste preferences.
              </p>
              <Link href="/contact" className="btn btn-secondary btn-lg">Book a Tasting</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
