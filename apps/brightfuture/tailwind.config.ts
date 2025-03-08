/* eslint-disable @typescript-eslint/no-require-imports */
// tailwind config is required for editor support

import type { Config } from 'tailwindcss'
import sharedConfig from '@repo/tailwind-config'

const config: Pick<Config, 'content' | 'presets' | 'plugins' | 'theme'> = {
  content: ['./app/**/*.tsx'],
  presets: [sharedConfig],
  plugins: [require('daisyui')],
  theme: {
    extend: {
      colors: {
        bf: {
          blue: '#0066CC', // Standard/plain blue
          yellow: '#FDB913', // Yellow from logo
          'light-blue': '#5B92E5', // Lighter blue accent
        },
      },
    },
  },
}

export default config
