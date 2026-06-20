import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL || 'https://deelink.cc'
const SITE_NAME = 'deeLink'
const DESCRIPTION =
  'deeLink — One link for all your music, videos, and socials. Made for Tanzanian artists and creators.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} — One link for your music & socials`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    'deeLink', 'linktree Tanzania', 'artist links', 'music links',
    'Tanzania', 'Bongo Flava', 'Afrobeat', 'bio link', 'link in bio',
    'Audiomack', 'Spotify', 'YouTube music Tanzania',
  ],
  authors:   [{ name: 'deeLink', url: SITE_URL }],
  creator:   'Deeteki / Webmaster Crew',
  publisher: 'deeLink',

  // Open Graph
  openGraph: {
    type:        'website',
    locale:      'sw_TZ',
    alternateLocale: ['en_US'],
    url:         SITE_URL,
    siteName:    SITE_NAME,
    title:       `${SITE_NAME} — One link for your music & socials`,
    description: DESCRIPTION,
    images: [
      {
        url:    '/og.png',   // place a 1200×630 image in /public/og.png
        width:  1200,
        height: 630,
        alt:    'deeLink — Bio link platform for African artists',
      },
    ],
  },

  // Twitter / X
  twitter: {
    card:        'summary_large_image',
    site:        '@deelinkapp',
    creator:     '@deelinkapp',
    title:       `${SITE_NAME} — One link for your music & socials`,
    description: DESCRIPTION,
    images:      ['/og.png'],
  },

  // Canonical & alternates
  alternates: {
    canonical: SITE_URL,
  },

  // Favicons / manifest
  icons: {
    icon:        '/favicon.ico',
    shortcut:    '/favicon.ico',
    apple:       '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',

  // Robots
  robots: {
    index:         true,
    follow:        true,
    googleBot: {
      index:              true,
      follow:             true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },

  // Verification (add your codes when ready)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  },
}

export const viewport: Viewport = {
  themeColor:   [
    { media: '(prefers-color-scheme: dark)',  color: '#7c3aed' },
    { media: '(prefers-color-scheme: light)', color: '#7c3aed' },
  ],
  colorScheme:  'dark light',
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// Runs before React hydrates — prevents flash of wrong theme
const themeInitScript = `(function(){try{var t=localStorage.getItem('deelink-theme')||'dark';document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add('dark');}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <head><script dangerouslySetInnerHTML={{ __html: themeInitScript }} /></head>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <ThemeProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#18181b',
              color:      '#f4f4f5',
              border:     '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize:   '14px',
            },
            success: { iconTheme: { primary: '#a78bfa', secondary: '#18181b' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#18181b' } },
          }}
        />
        </ThemeProvider>
      </body>
    </html>
  )
}
