# Bright Future

Bright Future preschool website with contact form.

## Quick Start

Run this app in development:

```bash
npm run dev --filter=@repo/bright-future
```

Visit: http://localhost:3001

**Live URL**: https://brightfuture-preschool.com/contact

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Gmail SMTP Configuration for Contact Form
SMTP_EMAIL=""                 # Your Gmail address
SMTP_APP_PASSWORD=""          # Gmail App Password (16 chars from Google Account settings)
SMTP_CONTACT_EMAIL_TO=""      # Email address to receive submissions (defaults to SMTP_EMAIL)
```

**Setup Instructions:**

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password at: https://myaccount.google.com/apppasswords
3. Copy the 16-character App Password (remove spaces)

## More Info

See the [root README](../../README.md) for:

- Installation & setup
- Monorepo commands
- Working with shared packages
- Contributing guidelines
