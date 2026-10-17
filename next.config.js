/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 13's development cache can emit invalid chunk references under Node 24.
  // Keep production caching intact; only avoid the stale on-disk dev cache.
  webpack: (config, { dev }) => {
    if (dev) config.cache = false
    return config
  },
}

// Keep a running dev server separate from production builds and their chunks.
module.exports = (phase) => ({
  ...nextConfig,
  distDir: phase === 'phase-development-server' ? '.next-dev' : '.next',
})
