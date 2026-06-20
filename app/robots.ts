import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://deelink.cc'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        disallow: [
          '/dashboard/',
          '/dashboard',
          '/login',
          '/register',
          '/premium/callback',
          '/payment/',
          '/api/',
        ],
      },
      {
        // Block AI training scrapers
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot', 'anthropic-ai'],
        disallow:  '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host:    SITE_URL,
  }
}
