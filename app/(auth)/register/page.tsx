'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken'

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors text-sm'

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm] = useState({
    name: '', email: '', username: '', password: '', password_confirmation: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
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
      const res = await authApi.register(form)
      const { token, user, artist } = res.data.data
      setAuth(token, user, artist)
      document.cookie = 'deelink_logged_in=1; path=/; max-age=2592000'
      router.push('/dashboard')
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { errors?: Record<string,string>; message?: string } } })?.response?.data
      if (data?.errors) setErrors(data.errors)
      else setErrors({ general: data?.message || 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const field = (name: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        required
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className={inputClass}
        placeholder={placeholder}
      />
      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-1">Create your page</h2>
      <p className="text-slate-500 text-sm mb-7">Free forever. No credit card needed.</p>

      {errors.general && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {field('name', 'Full name', 'text', 'Your Name')}
        {field('email', 'Email', 'email', 'you@example.com')}

        {/* Username */}
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Username</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs select-none">
              deelink.app/
            </span>
            <input
              type="text"
              required
              minLength={3}
              maxLength={30}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
              className={`${inputClass} pl-[6.5rem] pr-9`}
              placeholder="yourname"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {form.username.length >= 3 && (
                usernameStatus === 'checking' ? <Loader size={14} className="animate-spin text-slate-500" /> :
                usernameStatus === 'available' ? <CheckCircle size={14} className="text-emerald-400" /> :
                usernameStatus === 'taken' ? <XCircle size={14} className="text-red-400" /> : null
              )}
            </span>
          </div>
          {usernameStatus === 'taken' && <p className="text-red-400 text-xs mt-1">This username is taken</p>}
          {usernameStatus === 'available' && <p className="text-emerald-400 text-xs mt-1">✓ Available</p>}
        </div>

        {field('password', 'Password', 'password', '8+ characters')}
        {field('password_confirmation', 'Confirm password', 'password', '••••••••')}

        <button
          type="submit"
          disabled={loading || usernameStatus === 'taken'}
          className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 mt-1"
        >
          {loading && <Loader size={14} className="animate-spin" />}
          {loading ? 'Creating account…' : 'Create free account'}
        </button>
      </form>

      <p className="text-slate-600 text-sm text-center mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
