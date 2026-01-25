import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
}

// Only apply PWA wrapper in production (avoids Turbopack/webpack conflict in dev)
const exportedConfig =
  process.env.NODE_ENV === 'production'
    ? (async () => {
        const withPWAInit = (await import('@ducanh2912/next-pwa')).default
        const withPWA = withPWAInit({ dest: 'public' })
        return withPWA(nextConfig)
      })()
    : nextConfig

export default exportedConfig
