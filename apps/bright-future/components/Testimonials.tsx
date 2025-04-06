'use client'

import { useState } from 'react'

interface TestimonialProps {
  quote: string
  author: string
  rating: number
  date?: string
}

const Testimonial = ({ quote, author, rating, date }: TestimonialProps) => {
  const [expanded, setExpanded] = useState(false)

  // Check if quote is long and needs truncation
  const isLongQuote = quote.length > 300
  const truncatedQuote =
    isLongQuote && !expanded ? quote.substring(0, 280) + '...' : quote

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
      <div className="card-body p-6 flex flex-col">
        <div className="flex items-center mb-3">
          <div className="avatar placeholder mr-4">
            <div className="bg-primary text-primary-content rounded-full w-12">
              <span className="text-xl">{author.charAt(0)}</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-lg">{author}</h4>
            <div className="flex items-center text-xs text-gray-500">
              <span>{date || 'Local Guide'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          {date && <span className="ml-2 text-sm text-gray-500">{date}</span>}
        </div>

        <div
          className={`flex-grow ${isLongQuote && !expanded ? 'max-h-40 overflow-hidden relative' : ''}`}
        >
          <p className="text-base whitespace-pre-line">{truncatedQuote}</p>

          {isLongQuote && !expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
          )}
        </div>

        {isLongQuote && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary hover:text-primary-focus text-sm font-medium mt-2"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}

        <div className="mt-4 flex items-center">
          <a
            href="https://www.google.com/maps/place/Bright+Future+Child+Enrichment/@39.0032551,-84.5853886,857m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8841b8418492cdd7:0xf03a67a4fca9ab77!8m2!3d39.0032551!4d-84.5828083!16s%2Fg%2F1td_cc7g"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-primary flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
            <span>View on Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  )
}

const Testimonials = () => {
  const testimonials = [
    {
      author: 'Emily Combs',
      quote:
        "My son is 5 years old and has been going to Bright Future since he was almost 2 years old. Bright future has always been the BEST which is why I haven't taken him anywhere else. I feel safe dropping my child off here. My son has made great friendships and relationships with every teacher he has had here. I am so beyond thankful for every one of their staff, the directors and owner of Bright Future.\n\nBright Future does all they can to be involved in my child's every day care. I enjoy daily updates on how my son is in class and I love getting pictures on their app! I love this place! My son and I are excited for the upcoming dance class they will be having at their center in April!!!! I always recommend Bright Future to anyone in need of child care.\n\nTHANK YOU FOR ALL YOU DO FOR MY CHILD BRIGHT FUTURE!!!",
      rating: 5,
      date: 'a week ago',
    },
    {
      author: 'Ashley Valerius',
      quote:
        'My children have been going here for a year now and I am so happy with the facility, staff, director, and owners. They do an amazing job teaching my children, getting them ready for school, developing their social skills, and making it feel like a home away from home. I would not send my kids anywhere else.',
      rating: 5,
      date: '2 months ago',
    },
    {
      author: 'Anna S',
      quote:
        "I have now sent two children to this facility and I love the care and attention they have gotten! All of the staff is very caring and really gets to know all of the kids. My daughter learned so much, especially in Ms. Sydney's class! She works with all the kiddos and teaches them new things every day and we get updates on everything. She was more than prepared for when she went to preschool. We sent our baby here and Ms. Linda is very caring and works hard to help my little one advance and hit milestones! She is constantly doing tummy time and getting the love and attention she needs/deserves. We also love the director, Ms. Stephanie! She is always working hard to improve the facility and we have already seen so much good chance since she has come into the position. We weren't supposed to go to this daycare (the one we waited 6 months on a waiting list for changed their policy last minute causing us to switch) and we are so happy we did! Bright Future has always taken good care of our kiddos. As another pro: they are one of the few daycares in the area to take part time kids! So important for someone like me who didn't need full time. Such a life saver when it comes to saving money on daycare prices.",
      rating: 5,
      date: '3 months ago',
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              rating={testimonial.rating}
              date={testimonial.date}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://www.google.com/maps/place/Bright+Future+Child+Enrichment/@39.0032551,-84.5853886,857m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8841b8418492cdd7:0xf03a67a4fca9ab77!8m2!3d39.0032551!4d-84.5828083!16s%2Fg%2F1td_cc7g"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            See More Reviews on Google
          </a>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
