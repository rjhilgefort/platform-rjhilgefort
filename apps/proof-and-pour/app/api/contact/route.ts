import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Rate limiting map (simple in-memory solution)
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS = 5 // max 5 requests per hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []

  // Filter out old timestamps
  const recentTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW,
  )

  if (recentTimestamps.length >= MAX_REQUESTS) {
    return false
  }

  recentTimestamps.push(now)
  rateLimitMap.set(ip, recentTimestamps)
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    // Parse request body
    const body = await request.json()
    const { firstName, lastName, email, phone, eventType, message } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !eventType || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 },
      )
    }

    const fullName = `${firstName} ${lastName}`

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 },
      )
    }

    // Check environment variables
    const smtpEmail = process.env.SMTP_EMAIL
    const smtpPassword = process.env.SMTP_APP_PASSWORD
    const contactEmailTo = process.env.SMTP_CONTACT_EMAIL_TO || smtpEmail

    if (!smtpEmail || !smtpPassword) {
      console.error('Missing SMTP credentials in environment variables')
      return NextResponse.json(
        { error: 'Email service not configured. Please contact us directly.' },
        { status: 500 },
      )
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    })

    // Email content with bourbon theme
    const mailOptions = {
      from: smtpEmail,
      to: contactEmailTo,
      replyTo: email,
      subject: `Proof & Pour Event Inquiry: ${eventType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 3px solid #d4af37; padding-bottom: 10px;">
            🥃 New Bourbon Tasting Event Inquiry
          </h2>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${fullName}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            <p style="margin: 10px 0;"><strong>Event Type:</strong> <span style="color: #d4af37; font-weight: bold;">${eventType}</span></p>
          </div>

          <h3 style="color: #1a1a1a;">Event Details & Message:</h3>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #d4af37; margin: 15px 0;">
            <p style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #cccccc;">

          <p style="color: #666; font-size: 12px; text-align: center;">
            This email was sent from the Proof & Pour contact form<br>
            <em>Elevate Your Bourbon Experience</em> | Cincinnati Bourbon Tasting Events
          </p>
        </div>
      `,
      text: `
🥃 New Proof & Pour Event Inquiry

Name: ${fullName}
Email: ${email}
Phone: ${phone}
Event Type: ${eventType}

Event Details & Message:
${message}

---
This email was sent from the Proof & Pour contact form
Proof & Pour | Cincinnati Bourbon Tasting Events
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      {
        error: 'Failed to send email. Please try again or email us directly.',
      },
      { status: 500 },
    )
  }
}
