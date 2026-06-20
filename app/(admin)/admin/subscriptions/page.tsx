'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'
import { Subscription } from '@/lib/types'
import {
  CreditCard, TrendingUp, Check, X, Clock,
  ChevronLeft, ChevronRight, Loader, AlertTriangle,
  CalendarPlus, Ban, Search,
} from 'lucide-react'
import toast from 'react-hot-toast'

// ── Extend modal ─────────────────────────────────────────────────────────────

function ExtendModal({
  sub, onClose, onDone,
}: { sub: Subscription; onClose: () => void; onDone: () => void }) {
  const [months, setMonths] = useState(1)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      const res = await adminApi.extendSubscription(sub.id, months)
      toast.success(res.data.message || 'Extended!')
      onDone()
    } catch { toast.error('Failed to extend subscription') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-6 w-full max-w-sm border border-[var(--border)] shadow-2xl">
        <h3 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <CalendarPlus size={16} className="text-violet-500" />
          Extend Subscription
        </h3>
        <p className="text-xs text-[var(--muted)] mb-5">
          {sub.artist?.display_name} · <span className="capitalize font-medium">{sub.plan}</span>
        </p>

        <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">
          Add how many months?
        </label>
        <div className="flex gap-2 mb-6">
          {[1, 3, 6, 12].map((m) => (
            <button key={m} type="button" onClick={() => setMonths(m)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                months === m
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400'
              }`}
            >
              {m}mo
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={submit} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <Loader size={13} className="animate-spin" />}
            {loading ? 'Extending…' : `+${months} month${months > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    active:    { cls: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10', icon: <Check size={10} /> },
    expired:   { cls: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10',       icon: <Clock size={10} /> },
    cancelled: { cls: 'text-slate-500 bg-slate-100 dark:bg-slate-800',         icon: <X size={10} /> },
  }
  const { cls, icon } = map[status] ?? map.expired
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${cls}`}>
      {icon}{status}
    </span>
  )
}

// ── Plan badge ────────────────────────────────────────────────────────────────

const PLAN_CLS: Record<string, string> = {
  starter: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10',
  pro:     'text-violet-600 bg-violet-50 dark:bg-violet-500/10',
  silver:  'text-amber-600 bg-amber-50 dark:bg-amber-500/10',
  premium: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SubscriptionsPage() {
  const [subs, setSubs]         = useState<Subscription[]>([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading]   = useState(false)
  const [status, setStatus]     = useState('')
  const [plan, setPlan]         = useState('')
  const [revenue, setRevenue]   = useState(0)
  const [extending, setExtending] = useState<Subscription | null>(null)

  const fetchSubs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminApi.getSubscriptions({
        status: status || undefined,
        plan:   plan   || undefined,
        page,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = res.data as any
      setSubs(p.data)
      setTotal(p.total)
      setLastPage(p.last_page)
    } catch {} finally { setLoading(false) }
  }, [status, plan, page])

  const fetchRevenue = async () => {
    try {
      const res = await adminApi.getStats()
      setRevenue(res.data.data.total_revenue)
    } catch {}
  }

  useEffect(() => { fetchRevenue() }, [])
  useEffect(() => { setPage(1) }, [status, plan])
  useEffect(() => { fetchSubs() }, [fetchSubs])

  const handleCancel = async (sub: Subscription) => {
    if (!confirm(`Cancel this ${sub.plan} subscription?`)) return
    try {
      await adminApi.cancelSubscription(sub.id)
      setSubs(s => s.map(x => x.id === sub.id ? { ...x, status: 'cancelled' } : x))
      toast.success('Subscription cancelled')
    } catch { toast.error('Failed') }
  }

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Subscriptions</h1>
        <p className="text-[var(--muted)] text-sm mt-0.5">All paid plans and their status</p>
      </div>

      {/* Revenue stat */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue',  value: `TZS ${revenue.toLocaleString()}`, icon: <TrendingUp size={16} />, cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' },
          { label: 'Total Records',  value: total,                             icon: <CreditCard size={16} />, cls: 'text-violet-600 dark:text-violet-400 bg-violet-500/10'   },
          { label: 'Active',         value: subs.filter(s => s.status === 'active').length,    icon: <Check size={16} />, cls: 'text-sky-600 dark:text-sky-400 bg-sky-500/10' },
          { label: 'This Page',      value: subs.length,                       icon: <Search size={16} />, cls: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' },
        ].map(({ label, value, icon, cls }) => (
          <div key={label} className="glass rounded-2xl p-4">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${cls}`}>{icon}</div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 p-4 border-b border-[var(--border)]">
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="text-sm px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={plan} onChange={e => setPlan(e.target.value)}
            className="text-sm px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="">All plans</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="silver">Silver</option>
          </select>
          <span className="ml-auto text-xs text-[var(--muted)] self-center">{total} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Artist', 'Plan', 'Status', 'Amount', 'Period', 'Expires', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-[var(--muted)]">
                  <Loader size={20} className="animate-spin mx-auto mb-2" />
                  <p className="text-xs">Loading…</p>
                </td></tr>
              ) : subs.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[var(--muted)] text-sm">No subscriptions found</td></tr>
              ) : subs.map(sub => (
                <tr key={sub.id} className="border-b border-[var(--border)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                      {sub.artist?.display_name ?? '—'}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {sub.artist?.user?.name ?? sub.artist?.username ?? '—'}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${PLAN_CLS[sub.plan] || 'text-slate-500 bg-slate-100 dark:bg-slate-800'}`}>
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={sub.status} /></td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs">
                    {sub.amount > 0 ? `TZS ${sub.amount.toLocaleString()}` : <span className="text-[var(--muted)]">Manual</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">{fmt(sub.starts_at)}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className={sub.status === 'active' && sub.expires_at && new Date(sub.expires_at) < new Date(Date.now() + 7 * 86400000)
                      ? 'text-amber-600 font-semibold' : 'text-[var(--muted)]'}>
                      {fmt(sub.expires_at)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setExtending(sub)}
                        title="Extend"
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10 text-[var(--muted)] hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                        <CalendarPlus size={14} />
                      </button>
                      {sub.status === 'active' && (
                        <button onClick={() => handleCancel(sub)}
                          title="Cancel"
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-[var(--muted)] hover:text-red-500 transition-colors">
                          <Ban size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="text-xs text-[var(--muted)]">Page {page} of {lastPage}</span>
            <button disabled={page >= lastPage} onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="flex items-start gap-2 glass rounded-xl p-4 border-l-2 border-amber-400">
        <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--muted)]">
          To grant a free plan to a user, go to <strong className="text-slate-900 dark:text-white">Overview → user row → Grant Plan</strong>.
        </p>
      </div>

      {/* Modals */}
      {extending && (
        <ExtendModal sub={extending} onClose={() => setExtending(null)}
          onDone={() => { setExtending(null); fetchSubs() }} />
      )}
    </div>
  )
}
