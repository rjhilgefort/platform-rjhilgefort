# Download Unsplash Images for Proof & Pour

I can't directly download from Unsplash (requires API key), but here are curated high-quality Unsplash images you can download manually.

## Quick Download Instructions

1. Click each link below
2. Click the download button (↓) on Unsplash
3. Save to the specified folder with the exact filename

---

## Priority 1 - Hero Banner Images (NOW SHOWING ON ALL PAGES!)

All pages now have hero banners with background images. These will display immediately when you add them!

**Homepage Hero** - `/public/images/hero/homepage-hero.jpg`
- https://unsplash.com/photos/clear-glass-cup-with-brown-liquid-sKJ7zSylUao
- Beautiful bourbon in glass, perfect hero image
- Alternative: https://unsplash.com/photos/brown-liquid-in-clear-shot-glass-p4aOPhtY7YQ

**About Page Hero** - `/public/images/hero/about-hero.jpg`
- https://unsplash.com/photos/people-toasting-wine-glasses-jqAm3v06VCA
- People enjoying drinks together
- Alternative: https://unsplash.com/photos/group-of-people-inside-room-GV8LYwVXp0c

**Education Page Hero** - `/public/images/hero/education-hero.jpg`
- https://unsplash.com/photos/brown-wooden-round-table-with-chairs-4mAcustUNPs
- Bourbon tasting setup
- Alternative: https://unsplash.com/photos/four-clear-shot-glasses-nKC772R_qog (bourbon flight)

**Recipes Page Hero** - `/public/images/hero/recipes-hero.jpg`
- https://unsplash.com/photos/clear-drinking-glass-with-brown-liquid-and-ice-cubes-8mv6rVtVrFU
- Classic old fashioned cocktail
- Alternative: https://unsplash.com/photos/clear-wine-glass-with-brown-liquid-fqMu99l8sqo (Manhattan)

**Shop Page Hero** - `/public/images/hero/shop-hero.jpg`
- https://unsplash.com/photos/makers-mark-bottle-beside-glass-on-brown-wooden-table-4PLhbdS7a8Y
- Bourbon bottles and glassware
- Alternative: https://unsplash.com/photos/bottle-of-wine-beside-drinking-glass-Z1qx6qFipaw

**Partnerships Page Hero** - `/public/images/hero/partnerships-hero.jpg`
- https://unsplash.com/photos/group-of-people-inside-room-GV8LYwVXp0c
- Professional gathering/event
- Alternative: https://unsplash.com/photos/people-toasting-wine-glasses-jqAm3v06VCA

---

## Priority 2 - Bourbon Bottles

**Buffalo Trace**
- https://unsplash.com/photos/bottle-of-wine-beside-drinking-glass-Z1qx6qFipaw
- Generic bourbon bottle (Buffalo Trace may need brand website)
- Save as: `/public/images/bourbons/buffalo-trace.jpg`

**Maker's Mark**
- https://unsplash.com/photos/makers-mark-bottle-beside-glass-on-brown-wooden-table-4PLhbdS7a8Y
- Actual Maker's Mark bottle!
- Save as: `/public/images/bourbons/makers-mark.jpg`

**Woodford Reserve**
- https://unsplash.com/photos/brown-liquid-in-drinking-glass-8Ncm7Wya9Xk
- Premium whiskey bottle
- Save as: `/public/images/bourbons/woodford-reserve.jpg`

**Four Roses**
- https://unsplash.com/photos/brown-glass-bottle-on-brown-wooden-table-4QpT0vS7uLs
- Bourbon bottle close-up
- Save as: `/public/images/bourbons/four-roses.jpg`

---

## Priority 3 - Cocktails

**Old Fashioned**
- https://unsplash.com/photos/clear-drinking-glass-with-brown-liquid-and-ice-cubes-8mv6rVtVrFU
- Classic old fashioned in rocks glass
- Save as: `/public/images/cocktails/old-fashioned.jpg`

**Manhattan**
- https://unsplash.com/photos/clear-wine-glass-with-brown-liquid-fqMu99l8sqo
- Manhattan in coupe glass
- Save as: `/public/images/cocktails/manhattan.jpg`

**Mint Julep**
- https://unsplash.com/photos/clear-drinking-glass-with-brown-liquid-and-ice-cubes-LRvM92HmQnA
- Julep with mint garnish
- Save as: `/public/images/cocktails/mint-julep.jpg`

**Whiskey Sour**
- https://unsplash.com/photos/brown-liquid-in-clear-drinking-glass-UmncJq4KPcA
- Whiskey sour with foam
- Save as: `/public/images/cocktails/whiskey-sour.jpg`

**Bourbon Flight**
- https://unsplash.com/photos/four-clear-shot-glasses-nKC772R_qog
- Multiple tasting glasses
- Save as: `/public/images/cocktails/bourbon-flight.jpg`

---

## Priority 4 - Events & People

**Private Tasting Event**
- https://unsplash.com/photos/people-toasting-wine-glasses-jqAm3v06VCA
- People enjoying drinks together
- Save as: `/public/images/events/private-tasting.jpg`

**Corporate Event**
- https://unsplash.com/photos/group-of-people-inside-room-GV8LYwVXp0c
- Professional gathering
- Save as: `/public/images/events/corporate-event.jpg`

**Host Photo** (placeholder until you provide your own)
- https://unsplash.com/photos/man-in-gray-dress-shirt-and-blue-denim-jeans-sitting-on-gray-couch-WNoLnJo7tS8
- Professional portrait
- Save as: `/public/images/about/host-photo.jpg`

**Tasting Setup**
- https://unsplash.com/photos/brown-wooden-round-table-with-chairs-4mAcustUNPs
- Elegant tasting setup
- Save as: `/public/images/events/tasting-setup.jpg`

---

## Alternative: Use Brand Press Kits

For authentic bourbon bottle photos:
- **Buffalo Trace**: https://www.buffalotracedistillery.com/press
- **Maker's Mark**: https://www.makersmark.com/press
- **Woodford Reserve**: https://www.woodfordreserve.com/media-center
- **Four Roses**: https://fourrosesbourbon.com/press-room

Brand websites often have high-res product photos for press use.

---

## Batch Download Script (Optional)

Save this as `download-images.sh` and run it:

```bash
#!/bin/bash
# Note: This downloads from Unsplash photo pages - you still need to click download button
# Better to manually download from links above

echo "Please download images manually from the links in DOWNLOAD_UNSPLASH_IMAGES.md"
echo "Unsplash requires clicking the download button on their website"
echo "This ensures proper attribution and follows their terms of service"
```

---

## Tips

1. **Download button**: On Unsplash, click the ↓ download arrow (usually top right)
2. **Attribution**: Not required for most use, but consider adding "Photo by [Name] on Unsplash" in footer
3. **Resolution**: Download "Original" size when possible
4. **Compress**: Run through tinypng.com before adding to site (reduces load time)

---

## Need Different Photos?

Search Unsplash directly:
- **Bourbon**: https://unsplash.com/s/photos/bourbon
- **Whiskey**: https://unsplash.com/s/photos/whiskey
- **Cocktails**: https://unsplash.com/s/photos/cocktails
- **Bourbon barrel**: https://unsplash.com/s/photos/bourbon-barrel

Pick photos you like and download to correct folders with correct filenames!
