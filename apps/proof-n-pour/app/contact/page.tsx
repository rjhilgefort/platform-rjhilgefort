import { Metadata } from 'next'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import ContactForm from '../../components/ContactForm'
import HeroImage from '../../components/HeroImage'

export const metadata: Metadata = {
  title: 'Contact Proof & Pour | Book Bourbon Tasting Events in Cincinnati',
  description:
    'Contact Proof & Pour to book your private bourbon tasting event in Cincinnati. Expert-hosted bourbon experiences for corporate events, private parties, and special occasions.',
  keywords:
    'contact Proof & Pour, book bourbon tasting Cincinnati, bourbon event inquiry',
}

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero min-h-[300px] bg-base-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-base-300/90 to-base-300/70">
          <HeroImage
            src="/images/hero/contact-hero.jpg"
            alt="Contact Proof & Pour"
          />
        </div>
        <div className="hero-content text-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl">
              Let's Plan Your Bourbon Tasting Experience
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-base-content/70 mb-6">
                Fill out the form below and we'll get back to you within one
                business day to discuss your bourbon tasting event details.
              </p>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <FaEnvelope className="text-2xl text-primary mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <a
                        href="mailto:proofnpourbourbon@gmail.com"
                        className="link link-primary"
                      >
                        proofnpourbourbon@gmail.com
                      </a>
                      <p className="text-sm text-base-content/70 mt-1">
                        Best for detailed event inquiries
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <FaPhone className="text-2xl text-primary mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Phone</h3>
                      <a href="tel:+5024949735" className="link link-primary">
                        (502) 494-9735
                      </a>
                      <p className="text-sm text-base-content/70 mt-1">
                        Call or text for quick questions
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <FaMapMarkerAlt className="text-2xl text-primary mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Service Area</h3>
                      <p className="text-base-content">
                        Greater Cincinnati Area
                      </p>
                      <p className="text-sm text-base-content/70 mt-1">
                        Including Cincinnati, Northern Kentucky, and surrounding
                        communities
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <FaClock className="text-2xl text-primary mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Response Time</h3>
                      <p className="text-base-content">Within 1 business day</p>
                      <p className="text-sm text-base-content/70 mt-1">
                        Monday - Friday, 9am - 6pm EST
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Placeholders */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="font-bold mb-3">Follow Us</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://instagram.com/proofnpour"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-circle btn-outline"
                    >
                      IG
                    </a>
                    <a
                      href="https://tiktok.com/@proofandpour"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-circle btn-outline"
                    >
                      TT
                    </a>
                    <a
                      href="https://youtube.com/@proofandpour"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-circle btn-outline"
                    >
                      YT
                    </a>
                  </div>
                  <p className="text-sm text-base-content/70 mt-2">
                    Social channels launching soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="collapse collapse-plus bg-base-100 shadow-xl">
                <input type="radio" name="faq-accordion" defaultChecked />
                <div className="collapse-title text-xl font-medium">
                  How far in advance should I book?
                </div>
                <div className="collapse-content">
                  <p>
                    We recommend booking 3-4 weeks in advance to ensure
                    availability, especially for weekends and popular dates.
                    However, we can sometimes accommodate last-minute requests
                    depending on our schedule.
                  </p>
                </div>
              </div>

              <div className="collapse collapse-plus bg-base-100 shadow-xl">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-xl font-medium">
                  What's the ideal group size?
                </div>
                <div className="collapse-content">
                  <p>
                    Our sweet spot is 6-15 guests for private tastings and 10-30
                    for corporate events. We can accommodate smaller or larger
                    groups - contact us to discuss your specific needs.
                  </p>
                </div>
              </div>

              <div className="collapse collapse-plus bg-base-100 shadow-xl">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-xl font-medium">
                  Do you provide the bourbon?
                </div>
                <div className="collapse-content">
                  <p>
                    Yes! We provide all bourbon, glassware, tasting materials,
                    and educational content. You just need to provide the venue.
                    We can also work with your existing bourbon collection if
                    preferred.
                  </p>
                </div>
              </div>

              <div className="collapse collapse-plus bg-base-100 shadow-xl">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-xl font-medium">
                  How long do events typically last?
                </div>
                <div className="collapse-content">
                  <p>
                    Most tastings run 2-3 hours, including introduction, guided
                    tasting of 4-6 bourbons, Q&A, and socializing. We can
                    customize the format and timing to fit your event needs.
                  </p>
                </div>
              </div>

              <div className="collapse collapse-plus bg-base-100 shadow-xl">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-xl font-medium">
                  What if my guests are bourbon beginners?
                </div>
                <div className="collapse-content">
                  <p>
                    Perfect! We tailor every event to your group's experience
                    level. Our beginner-friendly approach makes bourbon
                    accessible and enjoyable for everyone, from first-time
                    tasters to seasoned enthusiasts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
