'use client'

import Script from 'next/script'

interface CalendlyEmbedProps {
  url?: string
}

export default function CalendlyEmbed({
  url = 'https://calendly.com/proofnpour',
}: CalendlyEmbedProps) {
  // Dark theme parameters for Calendly
  // Using 191e24 to match DaisyUI dark theme base-300
  const darkThemeParams = new URLSearchParams({
    background_color: '191e24',
    text_color: 'a6adba',
    primary_color: 'd4af37',
    hide_landing_page_details: '1',
    hide_gdpr_banner: '1',
  })

  const themedUrl = `${url}?${darkThemeParams.toString()}`

  return (
    <div className="calendly-embed-container">
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <style>{`
        .calendly-inline-widget iframe {
          filter: invert(0.82) hue-rotate(180deg);
          border-radius: 12px;
        }
      `}</style>
      <div
        className="calendly-inline-widget"
        data-url={themedUrl}
        style={{ minWidth: '320px', height: '630px' }}
      />
    </div>
  )
}
