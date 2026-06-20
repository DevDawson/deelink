'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { PLANS, PLAN_ORDER, formatPrice } from '@/lib/plans'
import { Plan } from '@/lib/types'
import { subscribeApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Check, Loader, Zap, Crown } from 'lucide-react'
import clsx from 'clsx'

// Only display plans in PLAN_ORDER (free/starter/pro/silver); 'premium' is a backend status, not a display tier.
type DisplayPlan = Exclude<Plan, 'premium'>

// Maps each display plan to the backend product identifier expected by POST /api/subscribe
const PLAN_PRODUCT: Record<DisplayPlan, string | null> = {
  free:    null,
  starter: 'starter_monthly',
  pro:     'pro_monthly',
  silver:  'silver_monthly',
}

const PLAN_FEATURES: Record<DisplayPlan, string[]> = {
  free:    ['Up to 3 links', '1 default theme', 'deeLink badge', 'No analytics'],
  starter: ['Up to 5 links', '2 themes', 'deeLink badge', 'Views analytics'],
  pro:     ['Up to 15 links', 'All themes', 'No branding', 'Views + clicks'],
  silver:  ['Unlimited links', 'Custom colors', 'No branding', 'Full analytics + charts'],
}

const PLAN_ACCENT: Record<DisplayPlan, { border: string; badge: string; btn: string; glow: string }> = {
  free:    { border: 'border-white/10',        badge: '',                                  btn: 'bg-white/8 text-slate-300',                                                                                                                glow: '' },
  starter: { border: 'border-blue-500/30',     badge: 'bg-blue-500/10 text-blue-300',      btn: 'bg-blue-600 hover:bg-blue-500 text-white',                                                                                                 glow: '' },
  pro:     { border: 'border-violet-500/50',   badge: 'bg-violet-500/10 text-violet-300',  btn: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/20',     glow: 'ring-1 ring-violet-500/30' },
  silver:  { border: 'border-amber-500/40',    badge: 'bg-amber-500/10 text-amber-300',    btn: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-500/20',          glow: 'ring-1 ring-amber-500/30' },
}

export default function UpgradePage() {
  const { artist } = useAuthStore()
  const [loading, setLoading] = useState<DisplayPlan | null>(null)

  if (!artist) return null

  const currentPlan = (artist.plan === 'premium' ? 'pro' : artist.plan) as DisplayPlan
  const currentIdx  = PLAN_ORDER.indexOf(currentPlan)

  const handleUpgrade = async (plan: DisplayPlan) => {
    const product = PLAN_PRODUCT[plan]
    if (!product) return
    setLoading(plan)
    try {
      const res = await subscribeApi.subscribe(product)
      window.location.href = res.data.data.redirect_url
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Failed to initiate payment. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white">Upgrade Plan</h1>
        <p className="text-slate-500 text-sm mt-0.5">Pay with M-Pesa or Pesapal. Cancel anytime.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(PLAN_ORDER as DisplayPlan[]).map((plan) => {
          const config      = PLANS[plan]
          const planIdx     = PLAN_ORDER.indexOf(plan)
          const isCurrent   = plan === currentPlan
          const isDowngrade = planIdx < currentIdx
          const accent      = PLAN_ACCENT[plan]

          return (
            <div
              key={plan}
              className={clsx(
                'relative rounded-2xl border p-5 flex flex-col transition-all bg-white/3',
                accent.border,
                accent.glow,
                isCurrent && 'opacity-75'
              )}
            >
              {plan === 'pro' && (
                <div className="absolute -top-3 left-4">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                    <Zap size={9} /> Most Popular
                  </span>
                </div>
              )}
              {plan === 'silver' && (
                <div className="absolute -top-3 left-4">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                    <Crown size={9} /> Best Value
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4 mt-1">
                <div>
                  <h2 className="text-base font-bold text-white capitalize">{config.name}</h2>
                  {accent.badge && (
                    <span className={clsx('text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block', accent.badge)}>
                      {plan.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  {config.price === 0 ? (
                    <span className="text-xl font-black text-white">Free</span>
                  ) : (
                    <span className="text-xl font-black text-white">{formatPrice(config.price)}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-2 mb-5 flex-1">
                {PLAN_FEATURES[plan].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                    <Check size={13} className="text-violet-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-2.5 rounded-xl bg-white/5 text-center text-sm font-medium text-slate-500">
                  Current plan
                </div>
              ) : plan === 'free' ? (
                <div className="w-full py-2.5 rounded-xl bg-white/5 text-center text-xs text-slate-600">—</div>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={!!loading || isDowngrade}
                  className={clsx(
                    'w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed',
                    isDowngrade ? 'bg-white/5 text-slate-600' : accent.btn
                  )}
                >
                  {loading === plan && <Loader size={13} className="animate-spin" />}
                  {isDowngrade ? 'Lower tier' : `Upgrade to ${config.name}`}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-slate-600">
        Payments processed by Pesapal · M-Pesa · Secure &amp; encrypted
      </p>
    </div>
  )
}
