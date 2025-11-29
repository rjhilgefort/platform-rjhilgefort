import { Metadata } from 'next'
import HeroImage from '../../components/HeroImage'

export const metadata: Metadata = {
  title: 'Subscribe to Proof & Pour Newsletter | Bourbon Tips & Updates',
  description: 'Join the Proof & Pour newsletter for bourbon tasting tips, cocktail recipes, event updates, and exclusive content. Get your free Bourbon Tasting Guide.',
  keywords: 'bourbon newsletter, bourbon tips email, cocktail recipes newsletter, bourbon tasting guide',
}

export default function SubscribePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero min-h-[400px] bg-base-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-base-300/90 to-base-300/70">
          <HeroImage
            src="/images/hero/subscribe-hero.jpg"
            alt="Subscribe to Proof & Pour"
          />
        </div>
        <div className="hero-content text-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Join Our Newsletter</h1>
            <h2 className="text-2xl mb-6">Get Your Free Bourbon Tasting Guide</h2>
            <p className="text-lg">
              Subscribe to receive bourbon tasting tips, cocktail recipes, event updates, and exclusive content
              delivered to your inbox.
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Form Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Subscribe Today</h2>

              {/* Placeholder form - will need to be connected to email service */}
              <form className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" className="checkbox" required />
                    <span className="label-text">
                      I agree to receive email updates from Proof & Pour
                    </span>
                  </label>
                </div>

                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm">Newsletter signup functionality coming soon! We're currently setting up our email service.</span>
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-disabled">
                  Subscribe & Get Free Guide
                </button>
              </form>

              <p className="text-sm text-base-content/70 text-center mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Get Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">What You'll Receive</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Free Bourbon Tasting Guide</h3>
                  <p>
                    Instant access to our comprehensive PDF guide covering bourbon fundamentals, tasting techniques,
                    and flavor wheel. Perfect for beginners and enthusiasts alike.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Weekly Bourbon Tips</h3>
                  <p>
                    Expert insights on bourbon selection, tasting notes, and appreciation techniques to deepen your
                    bourbon knowledge week by week.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Cocktail Recipes</h3>
                  <p>
                    New bourbon cocktail recipes delivered to your inbox, from timeless classics to creative
                    modern variations with step-by-step instructions.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Event Updates</h3>
                  <p>
                    Be first to know about upcoming tasting events, special promotions, and exclusive opportunities
                    to join our bourbon experiences.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Exclusive Content</h3>
                  <p>
                    Subscriber-only access to in-depth bourbon reviews, distillery spotlights, and behind-the-scenes
                    content from our tasting events.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Bourbon News & Releases</h3>
                  <p>
                    Stay informed about new bourbon releases, limited editions, and industry news relevant to
                    Cincinnati area bourbon enthusiasts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Placeholder */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">What Subscribers Say</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <p className="italic">
                  "The weekly tips have really improved my bourbon tasting skills. I can now identify flavors
                  I never noticed before!"
                </p>
                <p className="text-sm text-right mt-4">— Sarah M., Cincinnati</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <p className="italic">
                  "Love the cocktail recipes! I've impressed guests at every party with these bourbon drinks."
                </p>
                <p className="text-sm text-right mt-4">— Mike R., Mason</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <p className="italic">
                  "The free tasting guide was incredibly helpful. Best introduction to bourbon I've found."
                </p>
                <p className="text-sm text-right mt-4">— Jennifer L., Newport</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-base-200 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Your Privacy Matters</h3>
            <p className="text-base-content/70">
              We never share your email address with third parties. You can unsubscribe at any time with a single click.
              We send 1-2 emails per week, and you're always in control of your subscription preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
