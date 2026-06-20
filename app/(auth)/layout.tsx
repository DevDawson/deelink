import type { Metadata } from 'next'
import Link from 'next/link'
import { PlayCircle, BarChart2, Palette, Zap, Link2 } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export const metadata: Metadata = { title: 'Sign in | deeLink' }

const BULLETS = [
  { icon: PlayCircle, label: 'Music & video plays inline — no redirect' },
  { icon: BarChart2,  label: 'Analytics that show what actually works' },
  { icon: Palette,    label: 'Themes built to match your brand' },
  { icon: Link2,      label: 'One link for all your content' },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[460px] xl:w-[520px] flex-col relative overflow-hidden flex-shrink-0">
        {/* BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-indigo-950/60 to-[#050508]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Orbs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-violet-600/25 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-fuchsia-600/15 rounded-full blur-[100px]" />

        <div className="relative flex flex-col h-full px-12 py-10">
          {/* Logo + theme toggle */}
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="text-2xl font-black text-white tracking-tight group-hover:opacity-80 transition-opacity">
                dee<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Link</span>
              </span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 border border-violet-500/30 bg-violet-500/10 rounded-full px-3 py-1 text-xs text-violet-300 mb-6 w-fit">
              <Zap size={10} className="text-violet-400" fill="currentColor" />
              East African Artists
            </div>

            <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-3">
              One link.<br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Your whole world.
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
              Build a profile that showcases your music, videos, and socials — and watch your content play inline, without leaving your page.
            </p>

            <ul className="space-y-3">
              {BULLETS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-violet-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{label}</span>
                </li>
              ))}
            </ul>

            {/* Mini stat */}
            <div className="mt-10 flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/8">
              <div className="flex -space-x-2">
                {['#7c3aed', '#db2777', '#0891b2'].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-[#050508]" style={{ background: c }} />
                ))}
              </div>
              <p className="text-slate-400 text-xs leading-snug">
                <span className="text-white font-semibold">1,200+ artists</span><br />
                across East Africa
              </p>
            </div>
          </div>

          <p className="text-slate-700 text-xs">
            © {new Date().getFullYear()} deeLink — Deeteki / Webmaster Crew
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between w-full max-w-md mb-8">
          <Link href="/" className="text-2xl font-black text-slate-900 dark:text-white hover:opacity-80 transition-opacity">
            dee<span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Link</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
