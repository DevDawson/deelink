'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { subscribeApi, artistApi } from '@/lib/api'
import { CheckCircle, Clock, Loader, XCircle } from 'lucide-react'
import Link from 'next/link'

type Status = 'loading' | 'active' | 'processing' | 'failed' | 'no_tracking'

const POLL_INTERVAL_MS = 3000
const MAX_POLLS        = 10

function CallbackInner() {
  const searchParams      = useSearchParams()
  const router            = useRouter()
  const { updateArtist }  = useAuthStore()

  const [status, setStatus] = useState<Status>('loading')
  const pollCountRef        = useRef(0)
  const timerRef            = useRef<ReturnType<typeof setTimeout> | null>(null)

  const trackingId = searchParams.get('OrderTrackingId')

  const refreshProfile = async () => {
    try {
      const res = await artistApi.getProfile()
      updateArtist(res.data.data)
    } catch {}
  }

  const poll = async () => {
    if (!trackingId) { setStatus('no_tracking'); return }

    try {
      const res  = await subscribeApi.status(trackingId)
      const data = res.data

      if (data.status === 'active') {
        await refreshProfile()
        setStatus('active')
        return
      }
      if (data.status === 'failed' || data.status === 'cancelled') {
        setStatus('failed')
        return
      }

      pollCountRef.current += 1
      if (pollCountRef.current >= MAX_POLLS) { setStatus('processing'); return }
      timerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
    } catch {
      pollCountRef.current += 1
      if (pollCountRef.current >= MAX_POLLS) { setStatus('processing'); return }
      timerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
    }
  }

  useEffect(() => {
    timerRef.current = setTimeout(poll, 1500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === 'active') {
      const t = setTimeout(() => router.push('/dashboard'), 4000)
      return () => clearTimeout(t)
    }
  }, [status, router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'var(--background)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/8 dark:bg-amber-700/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative glass rounded-2xl p-10 max-w-sm w-full text-center">

        {status === 'loading' && (
          <>
            <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader size={32} className="text-violet-500 animate-spin" />
            </div>
            <h2 className="text-slate-900 dark:text-white font-bold text-lg">Verifying payment…</h2>
            <p className="text-[var(--muted)] text-sm mt-1">Please wait while we confirm your payment status.</p>
            <div className="flex justify-center gap-1.5 mt-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          </>
        )}

        {status === 'active' && (
          <>
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-emerald-500" />
            </div>
            <h2 className="text-slate-900 dark:text-white font-black text-xl">Congratulations! 🎉</h2>
            <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm mt-1">Premium activated</p>
            <p className="text-[var(--muted)] text-sm mt-2 mb-6">
              Your account has been upgraded. Redirecting to dashboard…
            </p>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20">
              Go to Dashboard
            </Link>
          </>
        )}

        {status === 'processing' && (
          <>
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={36} className="text-amber-500" />
            </div>
            <h2 className="text-slate-900 dark:text-white font-bold text-xl">Payment processing</h2>
            <p className="text-[var(--muted)] text-sm mt-2 mb-6">
              Your payment has been received and is being processed. Your account will be upgraded
              automatically within a few minutes.
            </p>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 border border-[var(--border)] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors hover:border-violet-400/40">
              Back to Dashboard
            </Link>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={36} className="text-red-500" />
            </div>
            <h2 className="text-slate-900 dark:text-white font-bold text-xl">Payment failed</h2>
            <p className="text-[var(--muted)] text-sm mt-2 mb-6">
              The payment was not completed. You have not been charged. Please try again.
            </p>
            {/* Fixed: was /dashboard/premium which caused 404 */}
            <Link href="/dashboard/upgrade"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all">
              Try Again
            </Link>
          </>
        )}

        {status === 'no_tracking' && (
          <>
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={36} className="text-[var(--muted)]" />
            </div>
            <h2 className="text-slate-900 dark:text-white font-bold text-xl">Page cannot be opened directly</h2>
            <p className="text-[var(--muted)] text-sm mt-2 mb-6">
              This page is only accessible after completing a payment.
            </p>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 border border-[var(--border)] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
              Back to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function PremiumCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <Loader size={32} className="text-violet-500 animate-spin" />
      </div>
    }>
      <CallbackInner />
    </Suspense>
  )
}
