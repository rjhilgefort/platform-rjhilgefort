'use client'

import { useState, useRef, FormEvent } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      eventType: formData.get('eventType'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      toast.success(
        "Thank you! We'll be in touch soon to discuss your bourbon tasting event.",
        {
          duration: 5000,
          position: 'bottom-center',
        },
      )

      // Clear form
      formRef.current?.reset()
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error(
        'Something went wrong. Please try again or email us directly.',
        {
          duration: 5000,
          position: 'bottom-center',
        },
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Toaster />
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* First and Last Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-control">
            <label htmlFor="firstName" className="label">
              <span className="label-text font-semibold">First Name *</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="input input-bordered w-full mt-1"
              placeholder="First name"
              disabled={isSubmitting}
            />
          </div>
          <div className="form-control">
            <label htmlFor="lastName" className="label">
              <span className="label-text font-semibold">Last Name *</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="input input-bordered w-full mt-1"
              placeholder="Last name"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="form-control">
          <label htmlFor="email" className="label">
            <span className="label-text font-semibold">Email *</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="input input-bordered w-full mt-1"
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
        </div>

        {/* Phone Field */}
        <div className="form-control">
          <label htmlFor="phone" className="label">
            <span className="label-text font-semibold">Phone *</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="input input-bordered w-full mt-1"
            placeholder="(123) 456-7890"
            disabled={isSubmitting}
          />
        </div>

        {/* Event Type Field */}
        <div className="form-control">
          <label htmlFor="eventType" className="label">
            <span className="label-text font-semibold">Event Type *</span>
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            className="select select-bordered w-full mt-1"
            disabled={isSubmitting}
          >
            <option value="">Select event type...</option>
            <option value="Private Tasting">Private Tasting</option>
            <option value="Corporate Event">Corporate Event</option>
            <option value="Special Occasion">Special Occasion</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
        </div>

        {/* Message Field */}
        <div className="form-control">
          <label htmlFor="message" className="label">
            <span className="label-text font-semibold">Message *</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className="textarea textarea-bordered w-full mt-1"
            placeholder="Tell us about your event: date, location, number of guests, experience level, and any special requests..."
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <div className="form-control mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </div>

        <p className="text-sm text-base-content/70 text-center mt-4">
          * Required fields. We'll respond within one business day to discuss
          your bourbon tasting event.
        </p>
      </form>
    </>
  )
}
