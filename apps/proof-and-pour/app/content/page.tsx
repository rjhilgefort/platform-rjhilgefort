import { Metadata } from 'next'
import Link from 'next/link'
import HeroImage from '../../components/HeroImage'

export const metadata: Metadata = {
  title: 'Bourbon Content & Resources | Videos & Tutorials | Proof & Pour',
  description: 'Explore bourbon tasting videos, cocktail tutorials, distillery visits, and educational content. Learn from expert-hosted bourbon experiences and demonstrations.',
  keywords: 'bourbon tasting videos, cocktail tutorials, distillery tours, bourbon education videos',
}

const videoCategories = [
  {
    title: 'Bourbon Tasting Sessions',
    description: 'Watch guided bourbon tastings featuring our favorite bottles',
    videos: [
      { title: 'Buffalo Trace Tasting & Review', duration: '12:45' },
      { title: 'Maker\'s Mark vs Maker\'s 46 Comparison', duration: '15:20' },
      { title: 'Woodford Reserve Double Oaked Deep Dive', duration: '18:30' },
      { title: 'Four Roses Single Barrel Tasting', duration: '14:15' },
    ],
  },
  {
    title: 'Cocktail Tutorials',
    description: 'Learn to make classic bourbon cocktails step-by-step',
    videos: [
      { title: 'Perfect Old Fashioned Technique', duration: '8:30' },
      { title: 'Manhattan Masterclass', duration: '10:15' },
      { title: 'Three Ways to Make a Whiskey Sour', duration: '12:00' },
      { title: 'Mint Julep for Derby Day', duration: '7:45' },
    ],
  },
  {
    title: 'Distillery Visits',
    description: 'Virtual tours of Kentucky bourbon distilleries',
    videos: [
      { title: 'Buffalo Trace Distillery Tour', duration: '22:30' },
      { title: 'Maker\'s Mark Behind the Scenes', duration: '18:45' },
      { title: 'Woodford Reserve Distillery Experience', duration: '20:15' },
      { title: 'Four Roses Warehouse Tour', duration: '16:30' },
    ],
  },
  {
    title: 'Education Series',
    description: 'Learn bourbon fundamentals and advanced topics',
    videos: [
      { title: 'Understanding Mash Bills', duration: '11:20' },
      { title: 'How Barrel Char Affects Flavor', duration: '13:45' },
      { title: 'Bourbon vs Tennessee Whiskey', duration: '9:30' },
      { title: 'Reading Bourbon Labels Like a Pro', duration: '10:50' },
    ],
  },
]

export default function ContentPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero min-h-[300px] bg-base-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-base-300/90 to-base-300/70">
          <HeroImage
            src="/images/hero/content-hero.jpg"
            alt="Bourbon Content & Resources"
          />
        </div>
        <div className="hero-content text-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Content & Resources</h1>
            <p className="text-xl">Videos, Tutorials, and Bourbon Education</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg">
            Explore our growing library of bourbon content. From tasting videos and cocktail tutorials to distillery
            tours and educational deep dives, we're building a comprehensive resource for bourbon enthusiasts at all levels.
          </p>
          <div className="alert alert-warning mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Video content coming soon! Subscribe to our newsletter to be notified when we launch our YouTube channel.</span>
          </div>
        </div>
      </div>

      {/* Video Categories */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {videoCategories.map((category, index) => (
            <div key={index}>
              <h2 className="text-3xl font-bold mb-2">{category.title}</h2>
              <p className="text-base-content/70 mb-6">{category.description}</p>

              <div className="grid md:grid-cols-2 gap-4">
                {category.videos.map((video, vIndex) => (
                  <div key={vIndex} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="card-body">
                      <div className="flex justify-between items-start">
                        <h3 className="card-title text-lg">{video.title}</h3>
                        <span className="badge badge-outline">{video.duration}</span>
                      </div>
                      <div className="card-actions justify-end mt-4">
                        <button className="btn btn-sm btn-disabled">Coming Soon</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Channel Placeholder */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Subscribe to Our YouTube Channel</h2>
            <p className="text-lg mb-8">
              We're launching our YouTube channel soon with weekly bourbon content. Be the first to know when we go live!
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://youtube.com/@proofandpour"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                Visit YouTube (Placeholder)
              </a>
              <Link href="/subscribe" className="btn btn-outline btn-lg">
                Email Newsletter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Additional Resources</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Bourbon Glossary</h3>
                <p>Essential terms every bourbon enthusiast should know</p>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Mash Bill</li>
                  <li>Angel's Share</li>
                  <li>Barrel Proof</li>
                  <li>Small Batch</li>
                  <li>Single Barrel</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Distillery Directory</h3>
                <p>Kentucky distilleries worth visiting</p>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Buffalo Trace Distillery</li>
                  <li>Maker's Mark</li>
                  <li>Woodford Reserve</li>
                  <li>Four Roses</li>
                  <li>Many more...</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Reading List</h3>
                <p>Recommended books for bourbon enthusiasts</p>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Bourbon: The Rise, Fall, and Rebirth</li>
                  <li>The Bourbon Bible</li>
                  <li>Straight Up: Kentucky Bourbon</li>
                  <li>And a Bottle of Rum</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Bourbon Events</h3>
                <p>Annual bourbon festivals and events</p>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Kentucky Bourbon Festival</li>
                  <li>Bourbon & Beyond</li>
                  <li>WhiskyFest</li>
                  <li>Local tastings & releases</li>
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
              <h2 className="card-title text-3xl mb-4">Want to Learn in Person?</h2>
              <p className="text-lg mb-6">
                Book a private bourbon tasting event where you'll experience hands-on education with expert guidance.
              </p>
              <Link href="/contact" className="btn btn-secondary btn-lg">Book a Tasting</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
