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
        src:     '/favicon.ico',
        sizes:   '48x48',
        type:    'image/x-icon',
      },
      // Add /icon-192.png and /icon-512.png to /public/ when available
    ],
    categories: ['music', 'social', 'entertainment'],
    lang:        'sw',
    dir:         'ltr',
  }
}
