'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import {
  LayoutDashboard, CreditCard, FileEdit,
  LogOut, Shield, ChevronRight,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { authApi } from '@/lib/api'
import clsx from 'clsx'

const NAV = [
  { href: '/admin',               icon: LayoutDashboard, label: 'Overview'      },
  { href: '/admin/subscriptions', icon: CreditCard,      label: 'Subscriptions' },
  { href: '/admin/content',       icon: FileEdit,        label: 'Content'       },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const { user, clearAuth } = useAuthStore()

  useEffect(() => {
    if (!user)                  { router.replace('/login');     return }
    if (user.role !== 'admin')  { router.replace('/dashboard'); return }
  }, [user, router])

  const handleLogout = async () => {
    try { await authApi.logout() } catch {}
    clearAuth()
    document.cookie = 'deelink_logged_in=; path=/; max-age=0'
    document.cookie = 'deelink_role=; path=/; max-age=0'
    router.push('/login')
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>

      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-[var(--border)] px-3 py-6 gap-1 flex-shrink-0">
        <div className="flex items-center gap-2 px-3 mb-6">
          <Shield size={16} className="text-violet-500" />
          <span className="font-black text-slate-900 dark:text-white text-sm">
            dee<span className="gradient-text">Admin</span>
          </span>
        </div>

        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}

        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-[var(--border)]">
          <Link href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all">
            <LayoutDashboard size={14} />
            Artist Dashboard
            <ChevronRight size={12} className="ml-auto" />
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all w-full text-left">
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-[var(--border)] flex items-center justify-between px-6 flex-shrink-0"
          style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(16px)' }}>

          {/* Mobile nav */}
          <div className="flex items-center gap-1 md:hidden">
            {NAV.map(({ href, icon: Icon, label }) => {
              const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
              return (
                <Link key={href} href={href}
                  className={clsx(
                    'flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all',
                    active
                      ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <Icon size={13} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <Shield size={14} className="text-violet-500" />
            <p className="text-xs text-slate-500">
              <span className="text-slate-900 dark:text-white font-semibold">{user.name}</span>
              <span className="ml-2 inline-flex items-center bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                ADMIN
              </span>
            </p>
          </div>

          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
