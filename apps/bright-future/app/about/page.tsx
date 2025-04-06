import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us | Bright Future Preschool',
  description:
    'Learn about Bright Future Preschool in Erlanger, KY and our approach to early childhood education.',
}

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            About Bright Future
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Providing quality childcare and early education since 2010
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center max-w-5xl mx-auto">
          <div className="lg:w-1/2">
            <div className="relative aspect-square w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/bf-building-2.jpeg"
                alt="Bright Future Preschool building"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-primary/5"></div>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl font-semibold">Our Story</h2>
            <p className="text-gray-700">
              Bright Future Preschool was founded with a simple mission: to
              provide children with a nurturing environment where they can
              learn, grow, and thrive. Located in Erlanger, Kentucky, we've been
              serving local families with quality childcare and early education
              programs since 2010.
            </p>

            <h2 className="text-3xl font-semibold">Our Approach</h2>
            <p className="text-gray-700">
              We believe that every child deserves a bright future. Our
              curriculum is designed to foster cognitive, social, emotional, and
              physical development through age-appropriate activities and
              play-based learning.
            </p>
            <p className="text-gray-700">
              Our dedicated staff members are passionate about early childhood
              education and committed to providing a safe, loving, and
              stimulating environment where children can explore, discover, and
              build confidence.
            </p>

            <h2 className="text-3xl font-semibold">Our Facility</h2>
            <p className="text-gray-700">
              Our spacious, modern facility features well-equipped classrooms, a
              secure outdoor playground, and separate areas for different age
              groups. We maintain small teacher-to-student ratios to ensure each
              child receives the attention they need.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
