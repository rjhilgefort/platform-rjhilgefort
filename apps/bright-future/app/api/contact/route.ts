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
    const { firstName, lastName, email, phone, subject, message } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !subject || !message) {
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
        { error: 'Email service not configured. Please contact us by phone.' },
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

    // Email content
    const mailOptions = {
      from: smtpEmail,
      to: contactEmailTo,
      replyTo: email,
      subject: `Bright Future Contact Form: ${subject}`,
      html: `
        <h2>New Bright Future Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          This email was sent from the Bright Future contact form.
        </p>
      `,
      text: `
New Bright Future Contact Form Submission

Name: ${fullName}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}

---
This email was sent from the Bright Future contact form.
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
        error: 'Failed to send email. Please try again or contact us by phone.',
      },
      { status: 500 },
    )
  }
}
