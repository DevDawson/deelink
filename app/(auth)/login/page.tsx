'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { Loader } from 'lucide-react'

const inputClass =
  'w-full bg-black/5 dark:bg-white/5 border border-[var(--border)] rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors text-sm'

export default function LoginPage() {
  const router  = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm]       = useState({ identifier: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login(form)
      const { token, user, artist } = res.data.data
      setAuth(token, user, artist)
      document.cookie = 'deelink_logged_in=1; path=/; max-age=2592000'
      document.cookie = `deelink_role=${user.role}; path=/; max-age=2592000`
      router.push(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Welcome back</h2>
      <p className="text-slate-500 text-sm mb-7">Sign in to your deeLink account</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-xl px-4 py-3 mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-500 text-xs font-medium mb-1.5 uppercase tracking-wide">
            Email or Phone Number
          </label>
          <input
            type="text"
            required
            autoComplete="username"
            value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
            className={inputClass}
            placeholder="you@example.com or +255712345678"
          />
        </div>

        <div>
          <label className="block text-slate-500 text-xs font-medium mb-1.5 uppercase tracking-wide">Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
        >
          {loading && <Loader size={14} className="animate-spin" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-slate-500 text-sm text-center mt-6">
        No account yet?{' '}
        <Link href="/register" className="text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors">
          Create one free
        </Link>
      </p>
    </div>
  )
}
