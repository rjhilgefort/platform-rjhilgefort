interface TestimonialProps {
  quote: string
  author: string
  role: string
}

const Testimonial = ({ quote, author, role }: TestimonialProps) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="text-4xl text-primary opacity-50 mb-4">"</div>
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
        "Bright Future has been an incredible experience for my daughter. She's grown so much socially and academically. The teachers are caring and attentive, and I love getting updates throughout the day.",
      author: 'Sarah Johnson',
      role: 'Parent of Lily, Age 4',
    },
    {
      quote:
        'As a first-time parent, I was nervous about daycare, but the staff made the transition seamless. My son loves going to Bright Future and talks about his teachers and friends all the time.',
      author: 'Michael Chen',
      role: 'Parent of Noah, Age 2',
    },
    {
      quote:
        "We've tried other centers, but none compare to Bright Future. The curriculum is excellent, and the focus on both education and emotional development is exactly what we wanted for our twins.",
      author: 'Emily Rodriguez',
      role: 'Parent of Sophia & Emma, Age 3',
    },
  ]

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">What Parents Say</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Don't just take our word for it – hear from our community of
            parents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
