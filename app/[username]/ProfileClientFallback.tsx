'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { publicApi } from '@/lib/api'
import { hasBadge } from '@/lib/plans'
import PlayerCard from '@/components/PlayerCard'
import ViewLogger from '@/components/ViewLogger'
import ShareButton from '@/components/ShareButton'
import { PublicProfile } from '@/lib/types'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://deelink.cc'
const API_URL  = process.env.NEXT_PUBLIC_API_URL  || 'https://api.deelink.cc'

const DEFAULT_THEME = {
  bg_color:     '#0f0f0f',
  text_color:   '#ffffff',
  button_style: 'rounded' as const,
  button_color: '#1a1a2e',
}

export default function ProfileClientFallback({ username }: { username: string }) {
  const [profile, setProfile]   = useState<PublicProfile | null>(null)
  const [status, setStatus]     = useState<'loading' | 'found' | 'not_found' | 'error'>('loading')

  useEffect(() => {
    publicApi.getProfile(username)
      .then((res) => {
        setProfile(res.data.data)
        setStatus('found')
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          setStatus('not_found')
        } else {
          setStatus('error')
        }
      })
  }, [username])

  // Loading skeleton
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f]">
        <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse mb-4" />
        <div className="h-4 w-32 bg-white/5 rounded animate-pulse mb-2" />
        <div className="h-3 w-48 bg-white/5 rounded animate-pulse" />
      </div>
    )
  }

  // Artist genuinely not found
  if (status === 'not_found') {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[80px] font-black leading-none bg-gradient-to-br from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">404</p>
          <h1 className="text-xl font-bold text-white mt-2">Profile not found</h1>
          <p className="text-slate-500 text-sm mt-2">@{username} hasn&apos;t joined deeLink yet.</p>
          <Link href="/" className="inline-flex items-center gap-2 mt-6 text-sm text-slate-300 hover:text-white border border-white/10 rounded-xl px-5 py-2.5 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  // Network/server error — show a retry message
  if (status === 'error' || !profile) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-400 text-sm">Could not load profile. Please try again.</p>
          <button
            onClick={() => { setStatus('loading'); setProfile(null) }}
            className="mt-4 text-xs text-violet-400 hover:text-violet-300 underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { artist, links } = profile
  const activeLinks = links.filter((l) => l.is_active)
  const showBadge   = hasBadge(artist.plan)
  const theme       = artist.theme ?? DEFAULT_THEME
  const profileUrl  = `${SITE_URL}/${artist.username}`
  const avatarUrl   = artist.avatar_path ? `${API_URL}/storage/${artist.avatar_path}` : null

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.bg_color, color: theme.text_color }}>
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-10">

        {artist.cover_path && (
          <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-[-44px]">
            <Image src={`${API_URL}/storage/${artist.cover_path}`} alt={`${artist.display_name} cover`} fill className="object-cover" priority />
          </div>
        )}

        <div className="flex flex-col items-center mb-6 relative z-10">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 mb-3" style={{ borderColor: theme.bg_color }}>
            {avatarUrl ? (
              <Image src={avatarUrl} alt={artist.display_name} width={80} height={80} className="object-cover w-full h-full" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-black" style={{ backgroundColor: theme.button_color || '#7c3aed', color: '#fff' }}>
                {artist.display_name?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
          </div>

          <h1 className="text-xl font-black leading-tight text-center">{artist.display_name || artist.username}</h1>

          {artist.bio && (
            <p className="text-sm text-center mt-1.5 max-w-xs leading-relaxed" style={{ opacity: 0.65 }}>{artist.bio}</p>
          )}

          <div className="mt-3">
            <ShareButton url={profileUrl} title={`${artist.display_name || artist.username} on deeLink`} style={{ borderColor: theme.text_color, color: theme.text_color }} />
          </div>
        </div>

        <div className="space-y-3">
          {activeLinks.length === 0 && (
            <p className="text-center py-10" style={{ opacity: 0.3, fontSize: '14px' }}>No links yet.</p>
          )}
          {activeLinks.map((link) => (
            <PlayerCard key={link.id} link={link} buttonStyle={theme.button_style} buttonColor={theme.button_color} textColor={theme.text_color} />
          ))}
        </div>
      </div>

      {showBadge && (
        <div className="text-center pb-8 pt-4">
          <a href={SITE_URL} className="inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80" style={{ color: theme.text_color, opacity: 0.35 }}>
            Made with <span className="font-black">dee<span style={{ color: '#7c3aed' }}>Link</span></span>
          </a>
        </div>
      )}

      <ViewLogger username={username} />
    </div>
  )
}
