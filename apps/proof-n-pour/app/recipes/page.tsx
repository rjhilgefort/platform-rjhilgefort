import { Metadata } from 'next'
import HeroImage from '../../components/HeroImage'
import OptionalImage from '../../components/OptionalImage'

export const metadata: Metadata = {
  title: 'Bourbon Cocktail Recipes | Classic & Creative Drinks | Proof & Pour',
  description: 'Discover classic and creative bourbon cocktail recipes. Learn to make the perfect Old Fashioned, Manhattan, Mint Julep, and more bourbon-forward cocktails at home.',
  keywords: 'bourbon cocktails, old fashioned recipe, manhattan recipe, home bartending, whiskey cocktails',
}

const recipes = [
  {
    name: 'Old Fashioned',
    description: 'The quintessential bourbon cocktail. Simple, elegant, and timeless.',
    image: '/images/cocktails/old-fashioned.jpg',
    ingredients: [
      '2 oz bourbon (Buffalo Trace or Woodford Reserve)',
      '1 sugar cube or 1/2 oz simple syrup',
      '2-3 dashes Angostura bitters',
      'Orange peel for garnish',
      'Luxardo cherry (optional)',
    ],
    instructions: [
      'Muddle sugar cube with bitters and a splash of water in a rocks glass',
      'Fill glass with large ice cube',
      'Add bourbon and stir gently for 20-30 seconds',
      'Express orange peel over drink and use as garnish',
      'Add cherry if desired',
    ],
  },
  {
    name: 'Manhattan',
    description: 'A sophisticated stirred cocktail with sweet vermouth and bitters.',
    image: '/images/cocktails/manhattan.jpg',
    ingredients: [
      '2 oz bourbon (Woodford Reserve or Four Roses)',
      '1 oz sweet vermouth',
      '2 dashes Angostura bitters',
      'Luxardo cherry for garnish',
    ],
    instructions: [
      'Combine bourbon, vermouth, and bitters in mixing glass with ice',
      'Stir for 30-40 seconds until well-chilled',
      'Strain into chilled coupe or martini glass',
      'Garnish with cherry',
    ],
  },
  {
    name: 'Boulevardier',
    description: 'A bold, Italian-inspired bourbon cocktail with Campari and vermouth.',
    image: '/images/cocktails/boulevardier.jpg',
    ingredients: [
      '1.5 oz bourbon (Buffalo Trace)',
      '1 oz Campari',
      '1 oz sweet vermouth',
      'Orange peel for garnish',
    ],
    instructions: [
      'Combine bourbon, Campari, and vermouth in mixing glass with ice',
      'Stir for 30 seconds',
      'Strain into rocks glass over large ice cube',
      'Express orange peel and garnish',
    ],
  },
  {
    name: 'Mint Julep',
    description: 'The official drink of the Kentucky Derby. Refreshing and minty.',
    image: '/images/cocktails/mint-julep.jpg',
    ingredients: [
      '2.5 oz bourbon (Woodford Reserve)',
      '1/2 oz simple syrup',
      '8-10 fresh mint leaves',
      'Crushed ice',
      'Mint sprig for garnish',
    ],
    instructions: [
      'Gently muddle mint leaves with simple syrup in julep cup',
      'Add bourbon',
      'Fill cup with crushed ice and stir',
      'Top with more crushed ice to form a dome',
      'Garnish with mint sprig',
    ],
  },
  {
    name: 'Whiskey Sour',
    description: 'A balanced sour cocktail showcasing bourbon\'s sweetness.',
    image: '/images/cocktails/whiskey-sour.jpg',
    ingredients: [
      '2 oz bourbon (Four Roses)',
      '3/4 oz fresh lemon juice',
      '1/2 oz simple syrup',
      'Egg white (optional, for froth)',
      'Angostura bitters and cherry for garnish',
    ],
    instructions: [
      'If using egg white, dry shake all ingredients without ice first',
      'Add ice and shake vigorously for 15 seconds',
      'Strain into rocks glass over fresh ice',
      'Garnish with bitters drops and cherry',
    ],
  },
  {
    name: 'Gold Rush',
    description: 'A modern classic combining bourbon with honey and lemon.',
    image: '/images/cocktails/gold-rush.jpg',
    ingredients: [
      '2 oz bourbon (Maker\'s Mark)',
      '3/4 oz fresh lemon juice',
      '3/4 oz honey syrup (2:1 honey to water)',
      'Lemon wheel for garnish',
    ],
    instructions: [
      'Combine bourbon, lemon juice, and honey syrup in shaker with ice',
      'Shake vigorously for 15 seconds',
      'Strain into rocks glass over fresh ice',
      'Garnish with lemon wheel',
    ],
  },
]

export default function RecipesPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero min-h-[300px] bg-base-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-base-300/90 to-base-300/70">
          <HeroImage
            src="/images/hero/recipes-hero.jpg"
            alt="Bourbon Cocktails"
          />
        </div>
        <div className="hero-content text-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Bourbon Cocktail Recipes</h1>
            <p className="text-xl">Classic & Creative Bourbon Drinks</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg">
            Master the art of bourbon cocktails with our curated recipe collection. From timeless classics to modern
            favorites, these recipes showcase bourbon's versatility and complexity. Each recipe includes bourbon
            recommendations from our featured brands: Buffalo Trace, Maker's Mark, Woodford Reserve, and Four Roses.
          </p>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {recipes.map((recipe, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              {'image' in recipe && recipe.image && (
                <figure>
                  <OptionalImage
                    src={recipe.image}
                    alt={recipe.name}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                </figure>
              )}
              <div className="card-body">
                <h2 className="card-title text-2xl">{recipe.name}</h2>
                <p className="text-base-content/70 mb-4">{recipe.description}</p>

                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2">Ingredients:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i} className="text-sm">{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {recipe.instructions.map((instruction, i) => (
                      <li key={i} className="text-sm">{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Home Bartending Tips</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card bg-base-100">
                <div className="card-body">
                  <h3 className="card-title">Use Fresh Ingredients</h3>
                  <p>Always use fresh citrus juice and quality ingredients. It makes a significant difference in cocktail quality.</p>
                </div>
              </div>

              <div className="card bg-base-100">
                <div className="card-body">
                  <h3 className="card-title">Ice Matters</h3>
                  <p>Large ice cubes melt slower, preventing dilution. Use the right ice for each cocktail style.</p>
                </div>
              </div>

              <div className="card bg-base-100">
                <div className="card-body">
                  <h3 className="card-title">Stir vs Shake</h3>
                  <p>Stir spirit-forward drinks (Old Fashioned, Manhattan). Shake drinks with citrus or dairy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Essential Tools Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Essential Bar Tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">Basic Kit</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Cocktail shaker</li>
                  <li>Bar spoon</li>
                  <li>Jigger (for measuring)</li>
                  <li>Strainer</li>
                  <li>Muddler</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">Glassware</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Rocks glasses</li>
                  <li>Coupe or martini glasses</li>
                  <li>Highball glasses</li>
                  <li>Julep cups (optional)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
