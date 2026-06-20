'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { subscribeApi, artistApi } from '@/lib/api'
import { CheckCircle, XCircle, Loader, Clock } from 'lucide-react'
import Link from 'next/link'

type Status = 'loading' | 'success' | 'processing' | 'failed' | 'no_tracking'

const MAX_POLLS = 8
const POLL_MS   = 3000

function PaymentCompleteInner() {
  const searchParams      = useSearchParams()
  const router            = useRouter()
  const { updateArtist }  = useAuthStore()

  const [status, setStatus] = useState<Status>('loading')
  const [plan, setPlan]     = useState<string | null>(null)
  const pollCount           = useRef(0)
  const timerRef            = useRef<ReturnType<typeof setTimeout> | null>(null)

  const trackingId = searchParams.get('tracking_id') || searchParams.get('OrderTrackingId')

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
        if (data.plan) setPlan(data.plan)
        await refreshProfile()
        setStatus('success')
        return
      }
      if (data.status === 'failed') { setStatus('failed'); return }

      pollCount.current += 1
      if (pollCount.current >= MAX_POLLS) { setStatus('processing'); return }
      timerRef.current = setTimeout(poll, POLL_MS)
    } catch {
      pollCount.current += 1
      if (pollCount.current >= MAX_POLLS) { setStatus('processing'); return }
      timerRef.current = setTimeout(poll, POLL_MS)
    }
  }

  useEffect(() => {
    poll()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === 'success') {
      const t = setTimeout(() => router.push('/dashboard'), 3500)
      return () => clearTimeout(t)
    }
  }, [status, router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'var(--background)' }}>
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-400/10 dark:bg-violet-700/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative glass rounded-2xl p-10 max-w-sm w-full text-center">

        {status === 'loading' && (
          <>
            <Loader size={40} className="text-violet-500 animate-spin mx-auto mb-4" />
            <h2 className="text-slate-900 dark:text-white font-bold text-lg">Confirming payment…</h2>
            <p className="text-[var(--muted)] text-sm mt-1">Verifying with Pesapal, please wait.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-emerald-500" />
            </div>
            <h2 className="text-slate-900 dark:text-white font-black text-xl">Payment successful!</h2>
            {plan && (
              <p className="text-violet-600 dark:text-violet-400 text-sm font-semibold mt-1 capitalize">{plan} plan activated</p>
            )}
            <p className="text-[var(--muted)] text-sm mt-2 mb-6">Redirecting to dashboard…</p>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              Go to dashboard
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
              Your payment is being processed. Your plan will be upgraded automatically within a few minutes.
            </p>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 border border-[var(--border)] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors hover:border-violet-400/40">
              Back to dashboard
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
            <Link href="/dashboard/upgrade"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              Try again
            </Link>
          </>
        )}

        {status === 'no_tracking' && (
          <>
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={36} className="text-[var(--muted)]" />
            </div>
            <h2 className="text-slate-900 dark:text-white font-bold text-xl">No payment found</h2>
            <p className="text-[var(--muted)] text-sm mt-2 mb-6">
              This page can only be accessed after completing a payment.
            </p>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 border border-[var(--border)] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors hover:border-violet-400/40">
              Back to dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function PaymentCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <Loader size={32} className="text-violet-500 animate-spin" />
      </div>
    }>
      <PaymentCompleteInner />
    </Suspense>
  )
}
