import { Metadata } from 'next'
import Link from 'next/link'
import HeroImage from '../../components/HeroImage'

export const metadata: Metadata = {
  title: 'Bourbon Education Hub | Learn About Bourbon & Whiskey | Proof & Pour',
  description: 'Master bourbon fundamentals with our comprehensive education hub. Learn about bourbon production, mash bills, tasting techniques, and the difference between bourbon and whiskey.',
  keywords: 'bourbon 101, how bourbon is made, whiskey guide, bourbon tasting notes, mash bill, bourbon education',
}

export default function EducationPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero min-h-[300px] bg-base-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-base-300/90 to-base-300/70">
          <HeroImage
            src="/images/hero/education-hero.jpg"
            alt="Bourbon Education"
          />
        </div>
        <div className="hero-content text-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Bourbon Education Hub</h1>
            <p className="text-xl">Master the Art of Bourbon Appreciation</p>
          </div>
        </div>
      </div>

      {/* Bourbon 101 Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Bourbon 101: The Fundamentals</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">What Is Bourbon?</h3>
              <p className="text-lg mb-4">
                Bourbon is America's native spirit, a type of whiskey with specific legal requirements. To be called bourbon,
                the spirit must be:
              </p>
              <ul className="list-disc list-inside space-y-2 text-lg ml-4">
                <li>Made in the United States</li>
                <li>Contain at least 51% corn in the mash bill</li>
                <li>Distilled to no more than 160 proof (80% ABV)</li>
                <li>Entered into the barrel at no more than 125 proof (62.5% ABV)</li>
                <li>Aged in new, charred oak barrels</li>
                <li>Bottled at 80 proof (40% ABV) or higher</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Understanding Mash Bills</h3>
              <p className="text-lg mb-4">
                The mash bill is the recipe of grains used to make bourbon. While all bourbon must contain at least 51% corn,
                the remaining grains create distinct flavor profiles:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h4 className="card-title">Traditional Rye Bourbon</h4>
                    <p>Corn (70-80%), Rye (10-15%), Malted Barley (5-10%)</p>
                    <p className="text-sm mt-2">Adds spicy, peppery notes. Used by Buffalo Trace, Woodford Reserve.</p>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body">
                    <h4 className="card-title">Wheated Bourbon</h4>
                    <p>Corn (70%), Wheat (16%), Malted Barley (14%)</p>
                    <p className="text-sm mt-2">Produces softer, sweeter profile. Used by Maker's Mark.</p>
                  </div>
                </div>
              </div>
              <p className="text-lg mt-4">
                <strong>Four Roses</strong> is unique, using five different yeast strains and two mash bills to create
                10 distinct bourbon recipes, offering incredible flavor diversity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Production Process Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">How Bourbon Is Made</h2>

            <div className="space-y-6">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">1. Milling & Mashing</h3>
                  <p>
                    Grains are ground and mixed with water to create a mash. The mixture is heated to convert starches
                    into fermentable sugars.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">2. Fermentation</h3>
                  <p>
                    Yeast is added to the mash, converting sugars into alcohol over 3-5 days. This creates a "distiller's beer"
                    around 8-10% ABV.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">3. Distillation</h3>
                  <p>
                    The fermented mash is distilled, typically twice, to concentrate the alcohol and refine flavors.
                    Most bourbon is distilled to around 130-140 proof.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">4. Aging</h3>
                  <p>
                    The clear "white dog" spirit enters new, charred oak barrels where it ages for years. Kentucky's
                    temperature variations cause the bourbon to expand into and contract out of the wood, extracting
                    color, flavor, and character. Most bourbon ages 4-12 years, though there's no minimum aging requirement
                    (except for "straight" bourbon, which requires 2+ years).
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">5. Bottling</h3>
                  <p>
                    After aging, barrels are selected and sometimes blended. Water may be added to achieve desired proof
                    before bottling. Some bourbons are bottled "barrel proof" or "cask strength" without dilution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasting Guide Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Bourbon Tasting Guide</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">How to Taste Bourbon</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h4 className="card-title">1. See</h4>
                    <p>Observe the color, which indicates age and barrel char. Darker doesn't always mean better.</p>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body">
                    <h4 className="card-title">2. Smell</h4>
                    <p>Nose the bourbon with mouth slightly open. Identify aromas: caramel, vanilla, oak, spice, fruit.</p>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body">
                    <h4 className="card-title">3. Sip</h4>
                    <p>Take a small sip, let it coat your mouth. Note the flavors and how they evolve. Add water if desired.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 mt-8">Common Tasting Notes</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-2">Sweet Notes</h4>
                  <p>Caramel, vanilla, butterscotch, honey, brown sugar, maple</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Spice Notes</h4>
                  <p>Cinnamon, pepper, clove, nutmeg, allspice</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Fruit Notes</h4>
                  <p>Cherry, apple, orange peel, dried fruit</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Oak Notes</h4>
                  <p>Toasted wood, charred oak, tobacco, leather</p>
                </div>
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
              <h2 className="card-title text-3xl mb-4">Ready to Put Your Knowledge to Practice?</h2>
              <p className="text-lg mb-6">
                Join us for a private bourbon tasting where you'll experience these concepts firsthand with expert guidance.
              </p>
              <Link href="/contact" className="btn btn-secondary btn-lg">Book a Tasting Event</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
