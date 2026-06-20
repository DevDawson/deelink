import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Script from 'next/script'
import { publicApi } from '@/lib/api'
import { hasBadge } from '@/lib/plans'
import PlayerCard from '@/components/PlayerCard'
import ViewLogger from '@/components/ViewLogger'
import ShareButton from '@/components/ShareButton'

interface Props {
  params: { username: string }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://deelink.cc'
const API_URL  = process.env.NEXT_PUBLIC_API_URL  || 'https://api.deelink.cc'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res    = await publicApi.getProfile(params.username)
    const { artist } = res.data.data

    const name       = artist.display_name || artist.username
    const bio        = artist.bio || `${name}'s music, videos & socials — all in one place.`
    const avatarUrl  = artist.avatar_path ? `${API_URL}/storage/${artist.avatar_path}` : null
    const profileUrl = `${SITE_URL}/${artist.username}`

    return {
      title:       name,
      description: bio,
      alternates:  { canonical: profileUrl },

      openGraph: {
        type:        'profile',
        url:         profileUrl,
        title:       `${name} | deeLink`,
        description: bio,
        images: avatarUrl
          ? [{ url: avatarUrl, width: 400, height: 400, alt: name }]
          : [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: 'deeLink' }],
      },

      twitter: {
        card:        'summary_large_image',
        title:       `${name} | deeLink`,
        description: bio,
        images:      avatarUrl ? [avatarUrl] : [`${SITE_URL}/og.png`],
      },
    }
  } catch {
    return { title: 'Profile not found' }
  }
}

// Revalidate every 60s so profile changes appear quickly without a full rebuild
export const revalidate = 60

export default async function PublicProfilePage({ params }: Props) {
  let profile
  try {
    const res = await publicApi.getProfile(params.username)
    profile = res.data.data
  } catch {
    notFound()
  }

  const { artist, links } = profile
  const activeLinks  = links.filter((l: { is_active: boolean }) => l.is_active)
  const showBadge    = hasBadge(artist.plan)
  const theme        = artist.theme
  const profileUrl   = `${SITE_URL}/${artist.username}`
  const avatarUrl    = artist.avatar_path ? `${API_URL}/storage/${artist.avatar_path}` : null

  // JSON-LD structured data — helps Google, WhatsApp, and social crawlers
  const jsonLd = {
    '@context':  'https://schema.org',
    '@type':     'ProfilePage',
    url:          profileUrl,
    name:        `${artist.display_name || artist.username} — deeLink`,
    mainEntity: {
      '@type':     'MusicGroup',
      name:         artist.display_name || artist.username,
      description:  artist.bio ?? undefined,
      url:          profileUrl,
      image:        avatarUrl ?? undefined,
      sameAs:       activeLinks
                      .filter((l: { url: string }) => l.url?.startsWith('http'))
                      .map((l: { url: string }) => l.url)
                      .slice(0, 10),
    },
  }

  return (
    <>
      {/* Structured data */}
      <Script
        id="json-ld-profile"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: theme.bg_color, color: theme.text_color }}
      >
        <div className="flex-1 max-w-md mx-auto w-full px-4 py-10">

          {/* Cover */}
          {artist.cover_path && (
            <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-[-44px]">
              <Image
                src={`${API_URL}/storage/${artist.cover_path}`}
                alt={`${artist.display_name} cover`}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Avatar + name + bio */}
          <div className="flex flex-col items-center mb-6 relative z-10">
            <div
              className="w-20 h-20 rounded-full overflow-hidden border-4 mb-3"
              style={{ borderColor: theme.bg_color }}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={artist.display_name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  priority
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-2xl font-black"
                  style={{ backgroundColor: theme.button_color || '#7c3aed', color: '#fff' }}
                >
                  {artist.display_name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
            </div>

            <h1 className="text-xl font-black leading-tight text-center">
              {artist.display_name || artist.username}
            </h1>

            {artist.bio && (
              <p className="text-sm text-center mt-1.5 max-w-xs leading-relaxed" style={{ opacity: 0.65 }}>
                {artist.bio}
              </p>
            )}

            <div className="mt-3">
              <ShareButton
                url={profileUrl}
                title={`${artist.display_name || artist.username} on deeLink`}
                style={{ borderColor: theme.text_color, color: theme.text_color }}
              />
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            {activeLinks.length === 0 && (
              <p className="text-center py-10" style={{ opacity: 0.3, fontSize: '14px' }}>
                No links yet.
              </p>
            )}
            {activeLinks.map((link: Parameters<typeof PlayerCard>[0]['link']) => (
              <PlayerCard
                key={link.id}
                link={link}
                buttonStyle={theme.button_style}
                buttonColor={theme.button_color}
                textColor={theme.text_color}
              />
            ))}
          </div>
        </div>

        {/* Footer badge (free plan) */}
        {showBadge && (
          <div className="text-center pb-8 pt-4">
            <a
              href={SITE_URL}
              className="inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80"
              style={{ color: theme.text_color, opacity: 0.35 }}
            >
              Made with{' '}
              <span className="font-black">dee<span style={{ color: '#7c3aed' }}>Link</span></span>
            </a>
          </div>
        )}

        <ViewLogger username={params.username} />
      </div>
    </>
  )
}
