interface TestimonialProps {
  quote: string
  author: string
  rating: number
  role: string
}

const Testimonial = ({ quote, author, rating, role }: TestimonialProps) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="text-4xl text-primary opacity-50 mb-4">"</div>
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-lg italic mb-4">{quote}</p>
        <div className="flex items-center mt-auto">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-12">
              <span className="text-xl">{author.charAt(0)}</span>
            </div>
          </div>
          <div className="ml-4">
            <h4 className="font-semibold">{author}</h4>
            <p className="text-sm opacity-75">{role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        'My children have been going here for a year now and I am so happy with the facility, staff, director, and owners. They do an amazing job teaching my children, getting them ready for school, developing their social skills, and making it feel like a home away from home. I would not send my kids anywhere else.',
      author: 'Ashley Valerius',
      rating: 5,
      role: 'Parent of Lily, Age 4',
    },
    {
      quote:
        "My son has attended since he was 6 weeks old and we couldn't be happier. The teachers and director go above and beyond to make Bright Future feel like a true extension of our family and keep us up to date on all of his progress and milestones. We love our BF family!",
      author: 'Brianna Gastright',
      rating: 5,
      role: 'Parent of Lily, Age 4',
    },
    {
      quote:
        'Bright Future has been a blessing to our family. Our daughter transitioned from another center during COVID and it has been the best decision. The staff is amazing, caring, and truly make the center feel like home. The facility is set up perfectly for our daughter to learn and grow. Highly recommend!',
      author: 'Sarah Thompson',
      rating: 5,
      role: 'Parent of Lily, Age 4',
    },
  ]

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">What Parents Say</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Don&apos;t just take our word for it – hear from our community of
            parents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              rating={testimonial.rating}
              role={testimonial.role}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
