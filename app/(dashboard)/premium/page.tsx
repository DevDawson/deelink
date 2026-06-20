'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { subscribeApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Check, Crown, Loader, Zap } from 'lucide-react'

const FEATURES = [
  'Unlimited links',
  'All themes + custom colors',
  'Remove deeLink branding badge',
  'Full analytics — views, clicks, top links, date range',
  'Priority support',
]

export default function PremiumPage() {
  const { artist } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const isPremium = artist?.plan === 'premium'

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const res = await subscribeApi.subscribe('premium_monthly')
      window.location.href = res.data.data.redirect_url
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Failed to initiate payment. Please try again.'
      toast.error(msg)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Crown size={20} className="text-amber-500" />
          deeLink Premium
        </h1>
        <p className="text-[var(--muted)] text-sm mt-0.5">
          Pay via M-Pesa or card through Pesapal. Cancel anytime.
        </p>
      </div>

      {/* Plan card */}
      <div className="relative rounded-2xl border border-amber-400/40 bg-[var(--surface)] dark:bg-white/[0.03] p-6 ring-1 ring-amber-400/20 shadow-sm">
        <div className="absolute -top-3 left-5">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
            <Zap size={9} /> Best Plan
          </span>
        </div>

        <div className="flex items-end gap-1 mt-2 mb-5">
          <span className="text-4xl font-black text-slate-900 dark:text-white">TZS 10,000</span>
          <span className="text-[var(--muted)] text-sm mb-1.5">/month</span>
        </div>

        <ul className="space-y-3 mb-6">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
              <Check size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>

        {isPremium ? (
          <div className="w-full py-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-400/30 text-center text-sm font-semibold text-amber-600 dark:text-amber-300">
            ✓ Premium active
          </div>
        ) : (
          <button onClick={handleSubscribe} disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? (
              <><Loader size={15} className="animate-spin" />Redirecting to payment…</>
            ) : (
              <><Crown size={15} />Get Premium — TZS 10,000/month</>
            )}
          </button>
        )}
      </div>

      {/* Payment info */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
        <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Secure Payments</p>
        <p className="text-xs text-[var(--muted)]">
          Payments processed via <span className="text-slate-700 dark:text-slate-300 font-medium">Pesapal</span> — supports M-Pesa,
          Tigo Pesa, Airtel Money, and bank cards. deeLink never stores your payment details.
        </p>
      </div>

      <p className="text-center text-xs text-[var(--muted)]">
        Questions? Contact us · support@deelink.cc
      </p>
    </div>
  )
}
