'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { authApi } from '@/lib/api'
import { LayoutDashboard, BarChart2, Settings, Zap, LogOut, ExternalLink, Shield } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import clsx from 'clsx'

const navItems = [
  { href: '/dashboard',           label: 'Links',     icon: LayoutDashboard },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/settings',  label: 'Settings',  icon: Settings },
  { href: '/dashboard/upgrade',   label: 'Upgrade',   icon: Zap },
]

const PLAN_BADGE: Record<string, string> = {
  free:    'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  starter: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  pro:     'bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300',
  silver:  'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
}

export default function DashboardNav() {
  const pathname = usePathname()
  const router   = useRouter()
  const { artist, isAdmin, clearAuth } = useAuthStore()

  const handleLogout = async () => {
    try { await authApi.logout() } catch {}
    clearAuth()
    document.cookie = 'deelink_logged_in=; path=/; max-age=0'
    document.cookie = 'deelink_role=; path=/; max-age=0'
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border)]"
      style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Left: logo + plan badge + nav */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard"
            className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex-shrink-0">
            dee<span className="gradient-text">Link</span>
          </Link>

          {artist && (
            <span className={clsx('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full', PLAN_BADGE[artist.plan] ?? PLAN_BADGE.free)}>
              {artist.plan}
            </span>
          )}

          <div className="hidden sm:flex items-center gap-0.5">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    active
                      ? 'bg-violet-500/15 text-violet-600 dark:text-violet-400'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  )}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link href="/admin"
              className="hidden sm:flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium border border-violet-200 dark:border-violet-500/30 hover:border-violet-400 dark:hover:border-violet-400/50 rounded-lg px-2.5 py-1.5 transition-colors"
            >
              <Shield size={12} />
              Admin
            </Link>
          )}

          {artist && (
            <Link
              href={`/${artist.username}`}
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-violet-600 dark:hover:text-violet-400 transition-colors border border-[var(--border)] hover:border-violet-400/40 rounded-lg px-2.5 py-1.5"
            >
              <span>/{artist.username}</span>
              <ExternalLink size={10} />
            </Link>
          )}

          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="p-1.5 text-[var(--muted)] hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="sm:hidden flex border-t border-[var(--border)]">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className={clsx(
                'flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
                active ? 'text-violet-600 dark:text-violet-400' : 'text-[var(--muted)]'
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
