'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { CheckCircle, XCircle, Loader, Phone, Mail } from 'lucide-react'

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken'
type ContactMode   = 'email' | 'phone'

const inputClass =
  'w-full bg-black/5 dark:bg-white/5 border border-[var(--border)] rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors text-sm'

export default function RegisterPage() {
  const router  = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [mode, setMode]   = useState<ContactMode>('phone')
  const [form, setForm]   = useState({
    name: '', email: '', phone: '', username: '', password: '', password_confirmation: '',
  })
  const [errors, setErrors]               = useState<Record<string, string>>({})
  const [loading, setLoading]             = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')

  useEffect(() => {
    if (form.username.length < 3) { setUsernameStatus('idle'); return }
    setUsernameStatus('checking')
    const t = setTimeout(async () => {
      try {
        const res = await authApi.checkUsername(form.username)
        setUsernameStatus(res.data.available ? 'available' : 'taken')
      } catch { setUsernameStatus('idle') }
    }, 500)
    return () => clearTimeout(t)
  }, [form.username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match' })
      return
    }
    if (usernameStatus === 'taken') return

    setLoading(true)
    try {
      const payload = {
        name:                  form.name,
        username:              form.username,
        password:              form.password,
        password_confirmation: form.password_confirmation,
        ...(mode === 'email' ? { email: form.email } : { phone: form.phone }),
      }
      const res = await authApi.register(payload)
      const { token, user, artist } = res.data.data
      setAuth(token, user, artist)
      document.cookie = 'deelink_logged_in=1; path=/; max-age=2592000'
      router.push('/dashboard')
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { errors?: Record<string, string>; message?: string } } })?.response?.data
      if (data?.errors) setErrors(data.errors)
      else setErrors({ general: data?.message || 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Create your page</h2>
      <p className="text-slate-500 text-sm mb-6">Free forever. No credit card needed.</p>

      {/* Contact mode toggle */}
      <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl mb-6">
        {(['phone', 'email'] as ContactMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m
                ? 'bg-violet-600 text-white shadow'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {m === 'phone' ? <Phone size={14} /> : <Mail size={14} />}
            {m === 'phone' ? 'Phone number' : 'Email'}
          </button>
        ))}
      </div>

      {errors.general && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-xl px-4 py-3 mb-5">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Full name */}
        <div>
          <label className="block text-slate-500 text-xs font-medium mb-1.5 uppercase tracking-wide">Full Name</label>
          <input type="text" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass} placeholder="Your Name" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Contact field — phone or email */}
        {mode === 'phone' ? (
          <div>
            <label className="block text-slate-500 text-xs font-medium mb-1.5 uppercase tracking-wide">Phone Number</label>
            <input type="tel" required value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass} placeholder="+255 712 345 678 or 0712 345 678" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        ) : (
          <div>
            <label className="block text-slate-500 text-xs font-medium mb-1.5 uppercase tracking-wide">Email</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass} placeholder="you@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        )}

        {/* Username */}
        <div>
          <label className="block text-slate-500 text-xs font-medium mb-1.5 uppercase tracking-wide">Username</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs select-none">
              deelink.cc/
            </span>
            <input
              type="text" required minLength={3} maxLength={30}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
              className={`${inputClass} pl-[6.5rem] pr-9`}
              placeholder="yourname"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {form.username.length >= 3 && (
                usernameStatus === 'checking'  ? <Loader size={14} className="animate-spin text-slate-400" /> :
                usernameStatus === 'available' ? <CheckCircle size={14} className="text-emerald-500" /> :
                usernameStatus === 'taken'     ? <XCircle size={14} className="text-red-500" /> : null
              )}
            </span>
          </div>
          {usernameStatus === 'taken'     && <p className="text-red-500 text-xs mt-1">This username is taken</p>}
          {usernameStatus === 'available' && <p className="text-emerald-500 text-xs mt-1">✓ Available</p>}
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-slate-500 text-xs font-medium mb-1.5 uppercase tracking-wide">Password</label>
          <input type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={inputClass} placeholder="8+ characters" autoComplete="new-password" />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-slate-500 text-xs font-medium mb-1.5 uppercase tracking-wide">Confirm Password</label>
          <input type="password" required value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            className={inputClass} placeholder="••••••••" autoComplete="new-password" />
          {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || usernameStatus === 'taken'}
          className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 mt-1"
        >
          {loading && <Loader size={14} className="animate-spin" />}
          {loading ? 'Creating account…' : 'Create free account'}
        </button>
      </form>

      <p className="text-slate-500 text-sm text-center mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
