'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'
import { AdminUser } from '@/lib/types'
import {
  Users, UserPlus, Search, MoreVertical, Check, X,
  Copy, RefreshCw, Trash2, Shield, ShieldOff,
  TrendingUp, Crown, Loader, Phone, Mail, ExternalLink, Eye, EyeOff, Gift,
} from 'lucide-react'
import toast from 'react-hot-toast'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Stats {
  total_users: number
  total_artists: number
  paid_artists: number
  free_artists: number
  new_today: number
}

interface CreatedUser {
  user: AdminUser & { username: string }
  password: string
}

// ─── Create User Modal ───────────────────────────────────────────────────────

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: (u: CreatedUser) => void }) {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', username: '', password: '' })
  const [mode, setMode]     = useState<'phone' | 'email'>('phone')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const payload = {
        name:     form.name,
        username: form.username,
        password: form.password || undefined,
        ...(mode === 'phone' ? { phone: form.phone } : { email: form.email }),
      }
      const res = await adminApi.createUser(payload)
      onCreated(res.data.data)
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { errors?: Record<string, string>; message?: string } } })?.response?.data
      if (data?.errors) setErrors(data.errors)
      else setErrors({ general: data?.message || 'Failed to create user.' })
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-black/5 dark:bg-white/5 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors'

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md glass rounded-2xl p-6 shadow-2xl border border-[var(--border)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserPlus size={18} className="text-violet-500" />
            Create New User
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        {errors.general && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl px-3 py-2.5 mb-4">
            {errors.general}
          </div>
        )}

        {/* Phone / Email toggle */}
        <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl mb-4">
          {(['phone', 'email'] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === m ? 'bg-violet-600 text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {m === 'phone' ? <Phone size={12} /> : <Mail size={12} />}
              {m === 'phone' ? 'Phone' : 'Email'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-slate-500 text-xs font-medium mb-1">Full Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls} placeholder="Artist Name" required />
            {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>}
          </div>

          {mode === 'phone' ? (
            <div>
              <label className="block text-slate-500 text-xs font-medium mb-1">Phone Number *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputCls} placeholder="+255 712 345 678" required />
              {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-slate-500 text-xs font-medium mb-1">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls} placeholder="user@example.com" required />
              {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
            </div>
          )}

          <div>
            <label className="block text-slate-500 text-xs font-medium mb-1">Username *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">deelink.cc/</span>
              <input value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                className={`${inputCls} pl-[5.5rem]`} placeholder="username" required minLength={3} maxLength={30} />
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-0.5">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-slate-500 text-xs font-medium mb-1">
              Password <span className="text-slate-400">(leave blank to auto-generate)</span>
            </label>
            <input type="text" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputCls} placeholder="Auto-generate" />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader size={13} className="animate-spin" />}
              {loading ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Password Result Modal ────────────────────────────────────────────────────

function PasswordModal({ created, onClose }: { created: CreatedUser; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const { user, password }  = created

  const identifier = user.phone || user.email || user.username

  const copyAll = () => {
    const text = `deeLink Login\nUsername / Phone: ${identifier}\nPassword: ${password}\nURL: https://deelink.cc/${user.username}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      `✅ *deeLink Account Ready*\n\n👤 Name: ${user.name}\n🔑 Login: ${identifier}\n🔒 Password: ${password}\n\n🔗 Your profile: https://deelink.cc/${user.username}\n\n_Please change your password after login._`
    )
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm glass rounded-2xl p-6 shadow-2xl border border-emerald-500/30">
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-3">
            <Check size={24} className="text-emerald-500" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">User Created!</h3>
          <p className="text-slate-500 text-xs mt-1">Share these credentials with the user. Password shown only once.</p>
        </div>

        {/* Credentials card */}
        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 mb-4 space-y-2 text-sm">
          <Row label="Name"     value={user.name} />
          <Row label="Login"    value={identifier || '—'} />
          <Row label="Username" value={`@${user.username}`} />
          <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
            <span className="text-slate-500 text-xs">Password</span>
            <span className="font-mono font-bold text-violet-600 dark:text-violet-400 text-sm tracking-widest">
              {password}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <button onClick={copyAll}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors">
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy all credentials'}
          </button>
          <button onClick={shareWhatsApp}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors">
            <Phone size={14} />
            Share via WhatsApp
          </button>
          <button onClick={onClose}
            className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500 text-xs">{label}</span>
      <span className="text-slate-900 dark:text-slate-200 text-xs font-medium">{value}</span>
    </div>
  )
}

// ─── Grant Plan Modal ─────────────────────────────────────────────────────────

const PLAN_OPTIONS = [
  { value: 'starter', label: 'Starter',  price: '5,000/mo',  cls: 'border-sky-400 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300' },
  { value: 'pro',     label: 'Pro',      price: '10,000/mo', cls: 'border-violet-400 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300' },
  { value: 'silver',  label: 'Silver',   price: '30,000/mo', cls: 'border-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300' },
]

function GrantPlanModal({ user, onClose, onDone }: { user: AdminUser; onClose: () => void; onDone: (plan: string) => void }) {
  const [plan, setPlan]     = useState('pro')
  const [months, setMonths] = useState(1)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      await adminApi.grantPlan(user.id, { plan, months })
      toast.success(`${plan.charAt(0).toUpperCase() + plan.slice(1)} plan granted for ${months} month${months > 1 ? 's' : ''}!`)
      onDone(plan)
    } catch { toast.error('Failed to grant plan') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-6 w-full max-w-sm border border-[var(--border)] shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Gift size={16} className="text-violet-500" />
              Grant Plan
            </h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {user.name} · <span className="font-medium">@{user.artist?.username ?? 'no artist'}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={16} />
          </button>
        </div>

        <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">Plan</label>
        <div className="space-y-2 mb-5">
          {PLAN_OPTIONS.map(opt => (
            <button key={opt.value} type="button" onClick={() => setPlan(opt.value)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                plan === opt.value ? opt.cls + ' border-current' : 'border-[var(--border)] text-slate-600 dark:text-slate-400 hover:border-violet-400/50'
              }`}>
              <span className="flex items-center gap-2">
                <Crown size={13} />
                {opt.label}
              </span>
              <span className="text-xs opacity-70">TZS {opt.price}</span>
            </button>
          ))}
        </div>

        <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">Duration</label>
        <div className="flex gap-2 mb-6">
          {[1, 3, 6, 12].map(m => (
            <button key={m} type="button" onClick={() => setMonths(m)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                months === m
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400'
              }`}>
              {m}mo
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={submit} disabled={loading || !user.artist}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <Loader size={13} className="animate-spin" />}
            {loading ? 'Granting…' : `Grant ${plan}`}
          </button>
        </div>
        {!user.artist && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400 text-center mt-2">
            This user has no artist profile — cannot grant a plan.
          </p>
        )}
      </div>
    </div>
  )
}

// ─── User Row ─────────────────────────────────────────────────────────────────

function UserRow({
  u, onResetPassword, onToggleActive, onToggleAdmin, onDelete, onGrantPlan,
}: {
  u: AdminUser
  onResetPassword: (id: number) => void
  onToggleActive:  (id: number) => void
  onToggleAdmin:   (id: number) => void
  onDelete:        (id: number) => void
  onGrantPlan:     (u: AdminUser) => void
}) {
  const [open, setOpen] = useState(false)

  const planColor: Record<string, string> = {
    free:    'text-slate-400 bg-slate-100 dark:bg-slate-800',
    starter: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10',
    pro:     'text-violet-600 bg-violet-50 dark:bg-violet-500/10',
    silver:  'text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-500/10',
    premium: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10',
  }

  const plan     = u.artist?.plan ?? 'free'
  const isActive = u.artist?.is_active ?? true
  const username = u.artist?.username

  return (
    <tr className="border-b border-[var(--border)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-xs flex-shrink-0">
            {u.name[0]?.toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{u.name}</p>
              {u.role === 'admin' && (
                <span className="text-[9px] font-bold bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded">ADMIN</span>
              )}
            </div>
            <p className="text-xs text-slate-500">{u.phone || u.email || '—'}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        {username ? (
          <a href={`/${username}`} target="_blank" rel="noopener noreferrer"
            className="text-xs text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center gap-1 transition-colors">
            @{username} <ExternalLink size={10} />
          </a>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </td>

      <td className="px-4 py-3">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${planColor[plan] || planColor.free}`}>
          {plan}
        </span>
      </td>

      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
          isActive
            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10'
            : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
        }`}>
          {isActive ? <Check size={10} /> : <X size={10} />}
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </td>

      <td className="px-4 py-3 text-xs text-slate-500">
        {new Date(u.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
      </td>

      <td className="px-4 py-3">
        <div className="relative">
          <button onClick={() => setOpen(!open)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <MoreVertical size={14} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-48 glass rounded-xl shadow-xl border border-[var(--border)] py-1 overflow-hidden">
                <MenuItem icon={<Gift size={13} />} label="Grant plan"
                  onClick={() => { onGrantPlan(u); setOpen(false) }} />
                <MenuItem icon={<RefreshCw size={13} />} label="Reset password"
                  onClick={() => { onResetPassword(u.id); setOpen(false) }} />
                <MenuItem icon={isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                  label={isActive ? 'Deactivate' : 'Activate'}
                  onClick={() => { onToggleActive(u.id); setOpen(false) }} />
                <MenuItem
                  icon={u.role === 'admin' ? <ShieldOff size={13} /> : <Shield size={13} />}
                  label={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                  onClick={() => { onToggleAdmin(u.id); setOpen(false) }} />
                <div className="border-t border-[var(--border)] my-1" />
                <MenuItem icon={<Trash2 size={13} />} label="Delete user" danger
                  onClick={() => { onDelete(u.id); setOpen(false) }} />
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

function MenuItem({ icon, label, onClick, danger = false }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
        danger
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
          : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats]           = useState<Stats | null>(null)
  const [users, setUsers]           = useState<AdminUser[]>([])
  const [total, setTotal]           = useState(0)
  const [page, setPage]             = useState(1)
  const [lastPage, setLastPage]     = useState(1)
  const [search, setSearch]         = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [created, setCreated]       = useState<CreatedUser | null>(null)
  const [grantingUser, setGrantingUser] = useState<AdminUser | null>(null)

  const fetchStats = async () => {
    try {
      const res = await adminApi.getStats()
      setStats(res.data.data)
    } catch {}
  }

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const res = await adminApi.getUsers({ search: search || undefined, plan: planFilter || undefined, page })
      // Axios wraps paginator: res.data is the Laravel paginator
      const paginator = res.data as unknown as {
        data: AdminUser[]
        total: number
        current_page: number
        last_page: number
      }
      setUsers(paginator.data)
      setTotal(paginator.total)
      setLastPage(paginator.last_page)
    } catch {} finally {
      setLoadingUsers(false)
    }
  }, [search, planFilter, page])

  useEffect(() => { fetchStats(); }, [])
  useEffect(() => { fetchUsers() }, [fetchUsers])

  // debounce search
  useEffect(() => {
    setPage(1)
  }, [search, planFilter])

  const handleResetPassword = async (id: number) => {
    if (!confirm('Reset this user\'s password?')) return
    try {
      const res = await adminApi.resetPassword(id)
      const pw  = res.data.data.password
      toast.success(`New password: ${pw}`, { duration: 10000, icon: '🔑' })
    } catch { toast.error('Failed to reset password') }
  }

  const handleToggleActive = async (id: number) => {
    try {
      await adminApi.toggleActive(id)
      setUsers((u) => u.map((x) =>
        x.id === id && x.artist ? { ...x, artist: { ...x.artist, is_active: !x.artist.is_active } } : x
      ))
    } catch { toast.error('Failed to update status') }
  }

  const handleToggleAdmin = async (id: number) => {
    if (!confirm('Change admin status for this user?')) return
    try {
      const res = await adminApi.toggleAdmin(id)
      setUsers((u) => u.map((x) => x.id === id ? { ...x, role: res.data.data.role as 'user' | 'admin' } : x))
      toast.success('Role updated')
    } catch { toast.error('Failed to update role') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user permanently? This cannot be undone.')) return
    try {
      await adminApi.deleteUser(id)
      setUsers((u) => u.filter((x) => x.id !== id))
      setTotal((t) => t - 1)
      toast.success('User deleted')
    } catch { toast.error('Failed to delete user') }
  }

  const handleCreated = (data: CreatedUser) => {
    setShowCreate(false)
    setCreated(data)
    fetchStats()
    fetchUsers()
  }

  const handleGrantDone = (plan: string, userId: number) => {
    setGrantingUser(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setUsers(prev => prev.map(u => u.id === userId && u.artist ? { ...u, artist: { ...u.artist, plan: plan as any } } : u))
    fetchStats()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Super Admin</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage all deeLink users and artists</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 hover:-translate-y-0.5"
        >
          <UserPlus size={15} />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Users',   value: stats?.total_users,   icon: <Users size={16} />,      color: 'text-violet-500' },
          { label: 'Total Artists', value: stats?.total_artists, icon: <Crown size={16} />,       color: 'text-fuchsia-500' },
          { label: 'Paid Plans',    value: stats?.paid_artists,  icon: <TrendingUp size={16} />,  color: 'text-emerald-500' },
          { label: 'Free Plans',    value: stats?.free_artists,  icon: <Shield size={16} />,      color: 'text-slate-400' },
          { label: 'New Today',     value: stats?.new_today,     icon: <UserPlus size={16} />,    color: 'text-amber-500' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="glass rounded-2xl p-4">
            <div className={`mb-2 ${color}`}>{icon}</div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {value ?? <span className="text-slate-300 dark:text-slate-600">—</span>}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="glass rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-[var(--border)]">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, or username…"
              className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border)] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
            />
          </div>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
          >
            <option value="">All plans</option>
            <option value="free">Free</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="silver">Silver</option>
          </select>
          <p className="text-xs text-slate-500 flex-shrink-0">{total} users</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['User', 'Username', 'Plan', 'Status', 'Joined', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <Loader size={20} className="animate-spin mx-auto mb-2" />
                    <p className="text-xs">Loading users…</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <UserRow key={u.id} u={u}
                    onResetPassword={handleResetPassword}
                    onToggleActive={handleToggleActive}
                    onToggleAdmin={handleToggleAdmin}
                    onDelete={handleDelete}
                    onGrantPlan={setGrantingUser}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}
              className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              Previous
            </button>
            <span className="text-xs text-slate-500">Page {page} of {lastPage}</span>
            <button disabled={page >= lastPage} onClick={() => setPage(page + 1)}
              className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}
      {created    && <PasswordModal created={created} onClose={() => setCreated(null)} />}
      {grantingUser && (
        <GrantPlanModal
          user={grantingUser}
          onClose={() => setGrantingUser(null)}
          onDone={(plan) => handleGrantDone(plan, grantingUser.id)}
        />
      )}
    </div>
  )
}
