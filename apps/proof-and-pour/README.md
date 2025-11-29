# Proof & Pour - Cincinnati Bourbon Tasting Events

Next.js website for Proof & Pour, a premium bourbon tasting event company serving the Greater Cincinnati area.

## Quick Start

```bash
# From monorepo root
npm install

# Set up environment variables
cd apps/proof-and-pour
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev --filter=@repo/proof-and-pour
# Visit http://localhost:3005
```

## 📋 TODO: What You Need to Provide

### ✅ Configuration Items

**1. Gmail SMTP Setup (for contact form)**

- [ ] Enable 2FA on your Google Account
- [ ] Generate App Password at: https://myaccount.google.com/apppasswords
- [ ] Add to `.env.local`:
  - `SMTP_EMAIL` = Your Gmail address
  - `SMTP_APP_PASSWORD` = 16-character App Password
  - `SMTP_CONTACT_EMAIL_TO` = srhilg01@gmail.com (already set)

**2. Google Analytics 4 Setup**

- [ ] Create GA4 property at: https://analytics.google.com/
- [ ] Get Measurement ID (format: G-XXXXXXXXXX)
- [ ] Add to `.env.local`: `NEXT_PUBLIC_GA_MEASUREMENT_ID`

**3. Calendly Setup (for event booking)**

- [ ] Create Calendly account at: https://calendly.com/
- [ ] Set up event type (bourbon tasting consultation)
- [ ] Get your Calendly URL
- [ ] Update `/components/CalendlyEmbed.tsx` with your URL (line 48)

**4. Domain & Deployment**

- [ ] Purchase domain (e.g., proofandpour.com)
- [ ] Create Portainer stack: `proof-and-pour-site`
- [ ] Configure environment variables in Portainer
- [ ] Set up SSL certificate
- [ ] Configure reverse proxy/port mapping

---

### 🖼️ Images TODO

**Priority 1 - Hero Banners (ACTIVE - will show immediately)**

- [ ] **Homepage Hero** → `/public/images/hero/homepage-hero.jpg`

  - Size: 1920x1080px (16:9)
  - Content: Bourbon glass, tasting scene, or atmospheric bourbon photo
  - See: [DOWNLOAD_UNSPLASH_IMAGES.md](./DOWNLOAD_UNSPLASH_IMAGES.md) for stock photos

- [ ] **About Page Hero** → `/public/images/hero/about-hero.jpg`

  - Size: 1920x1080px (16:9)
  - Content: Event photo, people enjoying bourbon, or professional setting

- [ ] **Education Page Hero** → `/public/images/hero/education-hero.jpg`

  - Size: 1920x1080px (16:9)
  - Content: Tasting setup, bourbon flight, or educational scene

- [ ] **Recipes Page Hero** → `/public/images/hero/recipes-hero.jpg`

  - Size: 1920x1080px (16:9)
  - Content: Cocktail being made, old fashioned, or bar setup

- [ ] **Shop Page Hero** → `/public/images/hero/shop-hero.jpg`

  - Size: 1920x1080px (16:9)
  - Content: Bourbon bottles, barware, or curated collection

- [ ] **Partnerships Page Hero** → `/public/images/hero/partnerships-hero.jpg`
  - Size: 1920x1080px (16:9)
  - Content: Corporate event, group tasting, or professional gathering

**Priority 2 - Branding**

- [ ] **Logo** → `/public/images/logo/logo.png` or `.svg`

  - Size: 500x500px minimum (SVG preferred for scalability)
  - Format: PNG with transparent background or SVG
  - Note: Placeholder logo currently active

- [ ] **Favicon** → `/public/favicon.ico`
  - Size: 32x32px or 16x16px
  - Format: .ico (use https://realfavicongenerator.net/)
  - Note: Placeholder favicon currently active

**Priority 3 - Bourbon Bottles**

- [ ] **Buffalo Trace** → `/public/images/bourbons/buffalo-trace.jpg`
  - Size: 800x1200px (2:3 portrait)
- [ ] **Maker's Mark** → `/public/images/bourbons/makers-mark.jpg`
  - Size: 800x1200px (2:3 portrait)
- [ ] **Woodford Reserve** → `/public/images/bourbons/woodford-reserve.jpg`
  - Size: 800x1200px (2:3 portrait)
- [ ] **Four Roses** → `/public/images/bourbons/four-roses.jpg`
  - Size: 800x1200px (2:3 portrait)

**Priority 4 - Cocktails**

- [ ] **Old Fashioned** → `/public/images/cocktails/old-fashioned.jpg`
  - Size: 800x600px (4:3)
- [ ] **Manhattan** → `/public/images/cocktails/manhattan.jpg`
  - Size: 800x600px (4:3)
- [ ] **Mint Julep** → `/public/images/cocktails/mint-julep.jpg`
  - Size: 800x600px (4:3)
- [ ] **Whiskey Sour** → `/public/images/cocktails/whiskey-sour.jpg`
  - Size: 800x600px (4:3)

**Priority 5 - Event Photos**

- [ ] **Private Tasting** → `/public/images/events/private-tasting.jpg`
  - Size: 1200x800px (3:2)
  - Content: Small group tasting event
- [ ] **Corporate Event** → `/public/images/events/corporate-event.jpg`
  - Size: 1200x800px (3:2)
  - Content: Professional/larger group setting
- [ ] **Host Photo** → `/public/images/about/host-photo.jpg`
  - Size: 800x800px (square) or 1000x1000px
  - Content: Professional photo of you (the host)

**📥 Where to Get Images:**

- **Your own photos** - Most authentic, use actual event photos when available
- **Unsplash stock photos** - See `DOWNLOAD_UNSPLASH_IMAGES.md` for curated links
- **Brand press kits** - Buffalo Trace, Maker's Mark, etc. have official photos
- **Compress before adding** - Use tinypng.com to reduce file size

**Images display automatically once added - no code changes needed.**

---

## Environment Variables

Required (see `.env.example`):

- `SMTP_EMAIL` - Gmail address
- `SMTP_APP_PASSWORD` - Gmail App Password ([setup guide](https://myaccount.google.com/apppasswords))
- `SMTP_CONTACT_EMAIL_TO` - srhilg01@gmail.com
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics 4 ID

## Features

- ✅ 9 pages with Cincinnati SEO optimization
- ✅ Working contact form (Gmail SMTP)
- ✅ Calendly booking integration (placeholder)
- ✅ DaisyUI luxury theme
- ✅ Google Analytics 4 ready
- ✅ Docker + GitHub Actions deployment

## Deployment

Deploys via GitHub Actions to `proof-and-pour-site` stack:

```bash
git push origin main:deploy/production
```

## More Info

See [root README](../../README.md) for monorepo commands and setup.
