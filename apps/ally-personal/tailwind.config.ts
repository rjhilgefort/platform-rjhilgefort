/* eslint-disable @typescript-eslint/no-require-imports */
// tailwind config is required for editor support

import type { Config } from 'tailwindcss'
import sharedConfig from '@repo/tailwind-config'

const config: Pick<Config, 'content' | 'presets' | 'plugins' | 'theme'> = {
  content: ['./app/**/*.tsx'],
  presets: [sharedConfig],
  plugins: [require('daisyui')],
}

export default config
