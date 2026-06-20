'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { authApi } from '@/lib/api'
import { LayoutDashboard, BarChart2, Settings, Zap, LogOut, ExternalLink } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { href: '/dashboard',           label: 'Links',     icon: LayoutDashboard },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/settings',  label: 'Settings',  icon: Settings },
  { href: '/dashboard/upgrade',   label: 'Upgrade',   icon: Zap },
]

const PLAN_BADGE: Record<string, string> = {
  free:    'bg-slate-700 text-slate-300',
  starter: 'bg-blue-900/60 text-blue-300',
  pro:     'bg-violet-900/60 text-violet-300',
  silver:  'bg-amber-900/60 text-amber-300',
}

export default function DashboardNav() {
  const pathname = usePathname()
  const router   = useRouter()
  const { artist, clearAuth } = useAuthStore()

  const handleLogout = async () => {
    try { await authApi.logout() } catch {}
    clearAuth()
    document.cookie = 'deelink_logged_in=0; path=/; max-age=0'
    router.push('/login')
  }

  return (
    <nav className="bg-[#0a0a0f] border-b border-white/5 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Left: logo + nav */}
        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="text-lg font-black tracking-tight text-white flex-shrink-0">
            dee<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Link</span>
          </Link>

          {artist && (
            <span className={clsx('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full', PLAN_BADGE[artist.plan])}>
              {artist.plan}
            </span>
          )}

          <div className="hidden sm:flex items-center gap-0.5">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    active
                      ? 'bg-violet-500/15 text-violet-400'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                  )}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right: profile link + logout */}
        <div className="flex items-center gap-2">
          {artist && (
            <Link
              href={`/${artist.username}`}
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-400 transition-colors border border-white/5 hover:border-violet-500/30 rounded-lg px-2.5 py-1.5"
            >
              <span>/{artist.username}</span>
              <ExternalLink size={10} />
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="sm:hidden flex border-t border-white/5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
                active ? 'text-violet-400' : 'text-slate-600'
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
