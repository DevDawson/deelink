'use client'

import { useState } from 'react'
import { Link as LinkType } from '@/lib/types'
import { publicApi } from '@/lib/api'
import { Play, ExternalLink, Music, PlayCircle, Camera, MessageCircle, Video, Link, ChevronUp } from 'lucide-react'

interface Props {
  link: LinkType
  buttonStyle?: 'rounded' | 'sharp' | 'pill'
  buttonColor?: string
  textColor?: string
}

// Per-platform branding
const PLATFORM = {
  youtube:   { color: '#FF0000', gradient: 'from-red-950 to-black',       Icon: PlayCircle,     label: 'YouTube'   },
  spotify:   { color: '#1DB954', gradient: 'from-emerald-950 to-black',   Icon: Music,          label: 'Spotify'   },
  audiomack: { color: '#FFA200', gradient: 'from-amber-950 to-black',     Icon: Music,          label: 'Audiomack' },
  instagram: { color: '#E1306C', gradient: 'from-pink-950 to-rose-950',   Icon: Camera,         label: 'Instagram' },
  whatsapp:  { color: '#25D366', gradient: 'from-green-950 to-black',     Icon: MessageCircle,  label: 'WhatsApp'  },
  tiktok:    { color: '#69C9D0', gradient: 'from-slate-900 to-black',     Icon: Video,          label: 'TikTok'    },
  custom:    { color: '#7c3aed', gradient: 'from-violet-950 to-black',    Icon: Link,           label: 'Link'      },
} as const

// Iframe embed URL builders
const EMBED_URL: Partial<Record<string, (id: string) => string>> = {
  youtube:   (id) => `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
  spotify:   (id) => `https://open.spotify.com/embed/${id}?utm_source=generator&theme=0`,
  audiomack: (id) => `https://audiomack.com/embed/${id}`,
}

// Inline player height once expanded
function playerHeight(link: LinkType): number {
  if (link.type === 'youtube') return 220
  if (link.type === 'spotify') return link.embed_id?.startsWith('track/') ? 152 : 232
  return 252 // audiomack
}

const RADII: Record<string, string> = {
  rounded: 'rounded-xl',
  sharp:   'rounded-none',
  pill:    'rounded-2xl',
}

export default function PlayerCard({ link, buttonStyle = 'rounded', buttonColor, textColor }: Props) {
  const [expanded,    setExpanded]    = useState(false)
  const [iframeReady, setIframeReady] = useState(false)
  const [thumbError,  setThumbError]  = useState(false)

  const p      = PLATFORM[link.type] ?? PLATFORM.custom
  const canEmbed    = !!link.embed_id && !!EMBED_URL[link.type]
  const hasThumb    = !!link.thumbnail_url && !thumbError
  const radius      = RADII[buttonStyle] ?? 'rounded-xl'
  const cardBg      = buttonColor ? { backgroundColor: buttonColor } : {}
  const cardColor   = textColor   ? { color: textColor }            : {}
  const height      = playerHeight(link)

  const logAndToggle = () => {
    publicApi.logClick(link.id).catch(() => {})
    if (canEmbed) {
      if (!expanded) setIframeReady(false)
      setExpanded((v) => !v)
    } else {
      window.open(link.url, '_blank', 'noopener,noreferrer')
    }
  }

  // ── YouTube card: full-bleed thumbnail preview ──────────────────────────
  if (canEmbed && link.type === 'youtube') {
    return (
      <div className={`overflow-hidden ${radius}`} style={cardBg}>
        <button
          onClick={logAndToggle}
          className="w-full relative block group"
          aria-expanded={expanded}
        >
          {/* Thumbnail / gradient fallback */}
          <div className="relative w-full aspect-video overflow-hidden bg-black">
            {hasThumb ? (
              <img
                src={link.thumbnail_url!}
                alt={link.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setThumbError(true)}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${p.gradient}`} />
            )}

            {/* Dim scrim for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />

            {/* Platform badge — top left */}
            <div className="absolute top-2.5 left-3 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm rounded-full px-2.5 py-1">
              <p.Icon size={11} style={{ color: p.color }} />
              <span className="text-[10px] font-bold text-white tracking-wide">{p.label}</span>
            </div>

            {/* Center play / collapse button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`flex items-center justify-center rounded-full transition-all duration-200 shadow-xl shadow-black/50 ${
                  expanded
                    ? 'w-10 h-10 bg-white/25'
                    : 'w-14 h-14 bg-white/25 group-hover:bg-white/40 group-hover:scale-110'
                }`}
              >
                {expanded
                  ? <ChevronUp size={18} className="text-white" />
                  : <Play size={22} className="text-white" fill="white" />
                }
              </div>
            </div>

            {/* Title + duration band — bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5">
              <p className="text-white text-sm font-bold line-clamp-1 drop-shadow-sm" style={cardColor}>
                {link.title}
              </p>
            </div>
          </div>
        </button>

        {/* Inline player — animated height */}
        <div
          style={{
            maxHeight: expanded ? `${height}px` : '0px',
            transition: 'max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
          }}
        >
          {expanded && link.embed_id && (
            <div className="relative bg-black" style={{ height: `${height}px` }}>
              {/* Loading bouncer */}
              {!iframeReady && (
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} flex items-center justify-center gap-1.5`}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-5 rounded-full animate-bounce"
                      style={{ backgroundColor: p.color, animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>
              )}
              <iframe
                src={EMBED_URL.youtube!(link.embed_id)}
                width="100%"
                height={height}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={link.title}
                onLoad={() => setIframeReady(true)}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Spotify / Audiomack: horizontal card + inline player ────────────────
  if (canEmbed) {
    return (
      <div className={`overflow-hidden ${radius}`} style={cardBg}>
        <button
          onClick={logAndToggle}
          className="w-full flex items-center gap-3 px-4 py-3.5 group"
          aria-expanded={expanded}
          style={cardColor}
        >
          {/* Platform icon tile */}
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: p.color + '22' }}
          >
            <p.Icon size={20} style={{ color: p.color }} />
          </div>

          {/* Title + label */}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold line-clamp-1 leading-tight">{link.title}</p>
            <p className="text-[11px] mt-0.5 opacity-50">{p.label}</p>
          </div>

          {/* Play / collapse pill */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              expanded ? 'opacity-70' : 'group-hover:scale-110'
            }`}
            style={{ backgroundColor: p.color + '33' }}
          >
            {expanded
              ? <ChevronUp size={14} style={{ color: p.color }} />
              : <Play size={13} fill={p.color} style={{ color: p.color }} />
            }
          </div>
        </button>

        {/* Inline player */}
        <div
          style={{
            maxHeight: expanded ? `${height}px` : '0px',
            transition: 'max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
          }}
        >
          {expanded && link.embed_id && (
            <div className="relative" style={{ height: `${height}px` }}>
              {!iframeReady && (
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} flex items-center justify-center gap-1.5`}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-5 rounded-full animate-bounce"
                      style={{ backgroundColor: p.color, animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>
              )}
              <iframe
                src={EMBED_URL[link.type]!(link.embed_id)}
                width="100%"
                height={height}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={link.title}
                style={{ border: 'none' }}
                onLoad={() => setIframeReady(true)}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Plain link card (Instagram / WhatsApp / TikTok / Custom) ────────────
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => publicApi.logClick(link.id).catch(() => {})}
      className={`flex items-center gap-3 px-4 py-3.5 w-full group transition-opacity hover:opacity-90 active:opacity-75 ${radius}`}
      style={{ ...cardBg, ...cardColor }}
    >
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: p.color + '22' }}
      >
        <p.Icon size={20} style={{ color: p.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold line-clamp-1 leading-tight">{link.title}</p>
        <p className="text-[11px] mt-0.5 opacity-50">{p.label}</p>
      </div>

      <ExternalLink
        size={14}
        className="flex-shrink-0 opacity-35 group-hover:opacity-70 transition-opacity"
      />
    </a>
  )
}
