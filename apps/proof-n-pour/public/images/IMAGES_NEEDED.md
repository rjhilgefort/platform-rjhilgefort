# Proof & Pour - Image Asset Guide

This document outlines all images needed for the Proof & Pour website.

## Directory Structure

```
/public/images/
├── logo/           # Brand logos and icons
├── hero/           # Large hero/banner images
├── bourbons/       # Bourbon bottle photos
├── cocktails/      # Cocktail/drink photos
├── events/         # Event and people photos
└── about/          # Team/host photos
```

---

## Required Images

### 1. Logo & Branding (`/logo/`)

**logo.png** or **logo.svg**
- Your Proof & Pour logo
- Recommended: SVG for scalability, or PNG with transparent background
- Size: 500x500px minimum (will be displayed smaller)
- Used in: Navigation bar

**favicon.ico**
- Website favicon (shows in browser tab)
- Size: 32x32px or 16x16px
- Format: .ico or .png
- Place in: `/public/` (root)

---

### 2. Hero Images (`/hero/`)

**homepage-hero.jpg**
- Main homepage banner image
- Suggested: Bourbon glasses, tasting setup, or atmospheric bourbon photo
- Size: 1920x1080px (16:9 ratio)
- Format: JPG or WebP
- Used in: Homepage hero section

**about-hero.jpg** (Optional)
- About page banner
- Suggested: Professional photo of host or event setup
- Size: 1920x1080px
- Used in: About page

**events-hero.jpg** (Optional)
- Generic event/partnership background
- Suggested: People enjoying bourbon tasting
- Size: 1920x1080px
- Used in: Partnerships page

---

### 3. Bourbon Bottles (`/bourbons/`)

**buffalo-trace.jpg**
- Buffalo Trace bottle photo
- Size: 800x1200px (portrait, 2:3 ratio)
- Format: JPG or PNG
- Background: White or transparent preferred

**makers-mark.jpg**
- Maker's Mark bottle photo
- Size: 800x1200px
- Format: JPG or PNG

**woodford-reserve.jpg**
- Woodford Reserve bottle photo
- Size: 800x1200px
- Format: JPG or PNG

**four-roses.jpg**
- Four Roses bottle photo
- Size: 800x1200px
- Format: JPG or PNG

**Featured bottles used in:** Homepage, Shop page

---

### 4. Cocktails (`/cocktails/`)

**old-fashioned.jpg**
- Old Fashioned cocktail photo
- Size: 800x600px (4:3 ratio)
- Suggested: Rocks glass with orange peel garnish

**manhattan.jpg**
- Manhattan cocktail photo
- Size: 800x600px
- Suggested: Coupe glass with cherry

**mint-julep.jpg**
- Mint Julep photo
- Size: 800x600px
- Suggested: Julep cup with mint garnish

**whiskey-sour.jpg**
- Whiskey Sour photo
- Size: 800x600px

**bourbon-flight.jpg** (Optional)
- Multiple bourbon glasses arranged for tasting
- Size: 1200x800px (landscape)
- Used in: Education page, homepage

---

### 5. Events & People (`/events/`)

**private-tasting.jpg**
- Small group tasting event
- Suggested: 4-8 people around table with bourbon
- Size: 1200x800px
- Used in: Homepage, About page, Partnerships page

**corporate-event.jpg**
- Corporate/larger group event
- Suggested: Professional setting, team-building atmosphere
- Size: 1200x800px
- Used in: Partnerships page

**host-photo.jpg**
- Photo of you (the host)
- Suggested: Professional headshot or candid at tasting
- Size: 800x800px (square)
- Used in: About page

**tasting-setup.jpg** (Optional)
- Close-up of tasting setup: glasses, notes, bottles
- Size: 1200x800px
- Used in: Education page, About page

---

### 6. About Page (`/about/`)

**team-photo.jpg** or use **host-photo.jpg**
- Professional photo of host/team
- Size: 1000x1000px (square) or 1200x800px (landscape)
- Used in: About page

---

## Image Optimization Guidelines

### File Formats
- **Photos:** JPG (best for photographs, smaller file size)
- **Graphics/Logos:** PNG (supports transparency) or SVG (scalable)
- **Modern web:** WebP (smaller size, great quality - optional)

### File Sizes
- Keep individual images under 500KB
- Hero images can be up to 1MB
- Compress before uploading (use tools like TinyPNG, Squoosh, or ImageOptim)

### Naming Convention
- Use lowercase
- Use hyphens (not underscores or spaces)
- Be descriptive: `bourbon-tasting-event.jpg` not `IMG_1234.jpg`

---

## Priority List

### Must Have (for launch):
1. ✅ Logo (logo.png/svg)
2. ✅ Favicon (favicon.ico)
3. ✅ Homepage hero (homepage-hero.jpg)
4. ✅ Host photo (host-photo.jpg)
5. ✅ At least 1 event photo (private-tasting.jpg)

### Nice to Have:
- All 4 bourbon bottle photos
- 3-4 cocktail photos
- Additional event photos
- Page-specific hero images

### Can Add Later:
- Content page video thumbnails
- Testimonial photos
- Additional lifestyle shots

---

## How to Add Images

1. **Prepare your images** following the specs above
2. **Place them in the correct folders**:
   ```
   /apps/proof-n-pour/public/images/[folder]/[filename]
   ```
3. **Images will automatically display** once files are added (code is ready)
4. **No code changes needed** - just drop files in correct locations with correct names

---

## Stock Photos (Temporary Option)

If you need placeholder images while gathering your own:
- Visit unsplash.com and search: "bourbon", "whiskey", "cocktails"
- Download free high-res images
- Use temporarily until you have your own photos
- Your own photos will be more authentic and build trust

---

## Questions?

- Image too large? Use tools like tinypng.com or squoosh.app to compress
- Wrong dimensions? Most photo editors can resize (Preview on Mac, Paint on Windows)
- Need help? Let me know and I can guide you through any image prep
