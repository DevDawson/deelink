import type { Metadata } from 'next'
import Link from 'next/link'
import { PlayCircle, BarChart2, Palette } from 'lucide-react'

export const metadata: Metadata = { title: 'Sign in' }

const BULLETS = [
  { icon: PlayCircle, label: 'Inline video & music playback' },
  { icon: BarChart2, label: 'Analytics that show what works' },
  { icon: Palette,   label: 'Themes built for artists' },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050508] flex">

      {/* ── Left branding panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-col relative overflow-hidden flex-shrink-0">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-950 to-[#050508]" />
        {/* Orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-violet-600/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-600/20 rounded-full blur-[80px]" />

        <div className="relative flex flex-col h-full px-12 py-10">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black text-white tracking-tight">
            dee<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Link</span>
          </Link>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-black text-white leading-tight mb-3">
              One link.<br />
              Your whole world.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
              Build a profile that showcases your music, videos, and socials — and watch your content play inline.
            </p>

            <ul className="space-y-3">
              {BULLETS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-violet-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer quote */}
          <p className="text-slate-600 text-xs">
            Trusted by artists across East Africa.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden text-2xl font-black text-white mb-8">
          dee<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Link</span>
        </Link>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
