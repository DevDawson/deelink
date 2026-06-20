/** @type {import('next').NextConfig} */
const nextConfig = {
  // -------------------------------------------------------------------------
  // Image domains
  // -------------------------------------------------------------------------
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost',      port: '8000', pathname: '/storage/**' },
      { protocol: 'https', hostname: 'api.deelink.cc', pathname: '/storage/**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // -------------------------------------------------------------------------
  // Security & performance headers
  // -------------------------------------------------------------------------
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options',        value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection',       value: '1; mode=block' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Immutable cache for hashed Next.js static chunks
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // Block indexing for private pages
      {
        source: '/(login|register|dashboard.*|premium/callback)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },

  poweredByHeader: false,
  compress: true,
}

export default nextConfig
