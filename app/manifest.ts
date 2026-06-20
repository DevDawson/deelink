import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             'deeLink',
    short_name:       'deeLink',
    description:      'One link for your music, videos, and socials.',
    start_url:        '/',
    display:          'standalone',
    background_color: '#050508',
    theme_color:      '#7c3aed',
    orientation:      'portrait',
    icons: [
      {
        src:     '/icon-192.png',
        sizes:   '192x192',
        type:    'image/png',
        purpose: 'maskable',
      },
      {
        src:     '/icon-512.png',
        sizes:   '512x512',
        type:    'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src:          '/screenshot-mobile.png',
        sizes:        '390x844',
        type:         'image/png',
        // @ts-expect-error — form_factor is valid but not yet in Next.js types
        form_factor:  'narrow',
        label:        'deeLink profile on mobile',
      },
    ],
    categories: ['music', 'social', 'entertainment'],
    lang:        'sw',
    dir:         'ltr',
  }
}
