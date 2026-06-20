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
      // Redirect to Pesapal hosted checkout
      window.location.href = res.data.data.redirect_url
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Imeshindwa kuanzisha malipo. Tafadhali jaribu tena.'
      toast.error(msg)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Crown size={20} className="text-amber-400" />
          deeLink Premium
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Lipa kwa M-Pesa au kadi kupitia Pesapal. Ghairi wakati wowote.
        </p>
      </div>

      {/* Plan card */}
      <div className="relative rounded-2xl border border-amber-500/40 bg-white/3 p-6 ring-1 ring-amber-500/20">
        <div className="absolute -top-3 left-5">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
            <Zap size={9} /> Mpango Bora
          </span>
        </div>

        <div className="flex items-end gap-1 mt-2 mb-5">
          <span className="text-4xl font-black text-white">TZS 10,000</span>
          <span className="text-slate-400 text-sm mb-1.5">/mwezi</span>
        </div>

        <ul className="space-y-3 mb-6">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
              <Check size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>

        {isPremium ? (
          <div className="w-full py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center text-sm font-semibold text-amber-300">
            ✓ Premium imewashwa
          </div>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={15} className="animate-spin" />
                Inaelekeza kwenye malipo…
              </>
            ) : (
              <>
                <Crown size={15} />
                Nunua Premium — TZS 10,000/mwezi
              </>
            )}
          </button>
        )}
      </div>

      {/* Payment info */}
      <div className="rounded-xl border border-white/5 bg-white/2 p-4 space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Usalama wa Malipo</p>
        <p className="text-xs text-slate-500">
          Malipo yanafanywa kupitia <span className="text-slate-300">Pesapal</span> — inasaidia M-Pesa,
          Tigo Pesa, Airtel Money na kadi za benki. deeLink haihifadhi taarifa za malipo yako.
        </p>
      </div>

      <p className="text-center text-xs text-slate-600">
        Una maswali? Wasiliana nasi · support@deelink.app
      </p>
    </div>
  )
}
